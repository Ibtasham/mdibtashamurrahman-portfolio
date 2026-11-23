import * as THREE from 'three';
import type { ProceduralTextureBundle } from '../proceduralTextures';
import { computeExplodedCoordinate, type MaterialFinishSpec } from '../studioConfig';
import { disposeObjectTree, tagSubsystem, type StudioAssembly } from './types';

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();

export function buildTurbofanModel(
  textures: ProceduralTextureBundle,
  initialFinish: MaterialFinishSpec,
): StudioAssembly {
  const root = new THREE.Group();
  root.name = 'forgemind-turbofan-assembly';
  const raycastTargets: THREE.Object3D[] = [];
  const centerlineY = 1.5;

  const primaryMat = new THREE.MeshPhysicalMaterial({
    color: initialFinish.primaryHex,
    metalness: initialFinish.metalness,
    roughness: initialFinish.roughness,
    clearcoat: initialFinish.clearcoat,
    clearcoatRoughness: 0.22,
    anisotropy: 0.72,
    roughnessMap: textures.brushedRoughness,
    bumpMap: textures.brushedBump,
    bumpScale: 0.004,
  });

  const darkAlloyMat = new THREE.MeshStandardMaterial({
    color: initialFinish.secondaryHex,
    metalness: 0.75,
    roughness: 0.48,
    bumpMap: textures.brushedBump,
    bumpScale: 0.003,
  });

  const acousticMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.25,
    roughness: 0.82,
  });

  const titaniumBladeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.94,
    roughness: 0.16,
    anisotropy: 0.85,
  });

  const spinnerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.spinnerSpiral,
    metalness: 0.3,
    roughness: 0.35,
  });

  const thermalCoreMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    emissive: new THREE.Color(0xf97316),
    emissiveIntensity: 0.45,
    metalness: 0.65,
    roughness: 0.32,
  });

  const sensorBeaconMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: new THREE.Color(0x22d3ee),
    emissiveIntensity: 0.7,
    metalness: 0.2,
    roughness: 0.25,
  });

  const conduitMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.86,
    roughness: 0.28,
  });

  const highlightTargets: Array<{
    subsystemId: string;
    meshes: THREE.Mesh[];
  }> = [];

  // 1. Structural Test-Cell Plinth & Cradle (grounded flush at y = 0)
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.35,
    roughness: 0.72,
  });

  const plinthGroup = new THREE.Group();
  const basePlateGeo = new THREE.BoxGeometry(2.3, 0.14, 3.0);
  const basePlate = new THREE.Mesh(basePlateGeo, plinthMat);
  basePlate.position.set(0, 0.07, -0.05);
  plinthGroup.add(basePlate);

  const strutShape = new THREE.Shape();
  strutShape.moveTo(-0.18, 0);
  strutShape.lineTo(0.18, 0);
  strutShape.lineTo(0.08, 0.78);
  strutShape.lineTo(-0.08, 0.78);
  strutShape.closePath();

  const strutGeo = new THREE.ExtrudeGeometry(strutShape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  strutGeo.center();

  const frontStrut = new THREE.Mesh(strutGeo, plinthMat);
  frontStrut.position.set(0, 0.52, 0.42);
  frontStrut.rotation.y = Math.PI / 2;
  plinthGroup.add(frontStrut);

  const rearStrut = new THREE.Mesh(strutGeo, plinthMat);
  rearStrut.position.set(0, 0.52, -0.78);
  rearStrut.rotation.y = Math.PI / 2;
  plinthGroup.add(rearStrut);

  const saddleGeo = new THREE.TorusGeometry(0.68, 0.06, 12, 32, Math.PI);
  const frontSaddle = new THREE.Mesh(saddleGeo, darkAlloyMat);
  frontSaddle.position.set(0, centerlineY, 0.42);
  frontSaddle.rotation.z = Math.PI;
  plinthGroup.add(frontSaddle);

  const rearSaddle = new THREE.Mesh(saddleGeo, darkAlloyMat);
  rearSaddle.position.set(0, centerlineY, -0.78);
  rearSaddle.rotation.z = Math.PI;
  plinthGroup.add(rearSaddle);

  tagSubsystem(plinthGroup, 'exhaust-nozzle', raycastTargets);
  root.add(plinthGroup);

  // 2. Spinner & Fan Rotor Group
  const fanGroup = new THREE.Group();
  fanGroup.position.set(0, centerlineY, 0.88);

  const spinnerPoints = [
    new THREE.Vector2(0.001, 0.56),
    new THREE.Vector2(0.16, 0.42),
    new THREE.Vector2(0.32, 0.16),
    new THREE.Vector2(0.35, 0.0),
    new THREE.Vector2(0.001, 0.0),
  ];
  const spinnerGeo = new THREE.LatheGeometry(spinnerPoints, 36);
  spinnerGeo.rotateX(Math.PI / 2);
  if (spinnerGeo.index) spinnerGeo.computeTangents();
  const spinnerMesh = new THREE.Mesh(spinnerGeo, spinnerMat);
  spinnerMesh.position.z = 0.2;
  fanGroup.add(spinnerMesh);

  const hubGeo = new THREE.CylinderGeometry(0.34, 0.36, 0.32, 32);
  hubGeo.rotateX(Math.PI / 2);
  const hubMesh = new THREE.Mesh(hubGeo, darkAlloyMat);
  fanGroup.add(hubMesh);

  // 18 swept titanium fan blades nestled cleanly inside 1.00 duct radius
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(-0.075, 0);
  bladeShape.lineTo(0.085, 0.02);
  bladeShape.lineTo(0.1, 0.56);
  bladeShape.lineTo(-0.055, 0.58);
  bladeShape.closePath();

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.026,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.007,
    bevelSegments: 2,
  });
  bladeGeo.translate(0, 0, -0.013);

  const bladeCount = 18;
  const fanBlades = new THREE.InstancedMesh(bladeGeo, titaniumBladeMat, bladeCount);
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2;
    const radius = 0.31;
    _pos.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    _euler.set(0.42, 0, angle - Math.PI / 2, 'ZXY');
    _quat.setFromEuler(_euler);
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    fanBlades.setMatrixAt(i, _mat4);
  }
  fanBlades.instanceMatrix.needsUpdate = true;
  fanBlades.computeBoundingSphere();
  fanGroup.add(fanBlades);

  tagSubsystem(fanGroup, 'spinner-fan', raycastTargets);
  highlightTargets.push({ subsystemId: 'spinner-fan', meshes: [hubMesh] });
  root.add(fanGroup);

  // 3. Outer Contoured Nacelle Cowl (Upper & Lower Halves aligned cleanly along Z)
  const nacelleUpperGroup = new THREE.Group();
  nacelleUpperGroup.position.set(0, centerlineY, 0.15);
  const nacelleLowerGroup = new THREE.Group();
  nacelleLowerGroup.position.set(0, centerlineY, 0.15);

  const cowlProfile: THREE.Vector2[] = [
    new THREE.Vector2(1.01, 1.05),
    new THREE.Vector2(1.13, 1.02),
    new THREE.Vector2(1.18, 0.52),
    new THREE.Vector2(1.14, -0.08),
    new THREE.Vector2(1.04, -0.78),
    new THREE.Vector2(0.92, -1.2),
    new THREE.Vector2(0.84, -1.2),
    new THREE.Vector2(0.95, -0.72),
    new THREE.Vector2(1.0, 0.15),
    new THREE.Vector2(1.0, 0.88),
    new THREE.Vector2(1.01, 1.05),
  ];

  const upperCowlGeo = new THREE.LatheGeometry(
    cowlProfile,
    40,
    Math.PI / 2,
    Math.PI,
  );
  upperCowlGeo.rotateX(Math.PI / 2);
  if (upperCowlGeo.index) upperCowlGeo.computeTangents();
  const upperCowlMesh = new THREE.Mesh(upperCowlGeo, primaryMat);
  nacelleUpperGroup.add(upperCowlMesh);

  const lowerCowlGeo = new THREE.LatheGeometry(
    cowlProfile,
    40,
    -Math.PI / 2,
    Math.PI,
  );
  lowerCowlGeo.rotateX(Math.PI / 2);
  if (lowerCowlGeo.index) lowerCowlGeo.computeTangents();
  const lowerCowlMesh = new THREE.Mesh(lowerCowlGeo, primaryMat);
  nacelleLowerGroup.add(lowerCowlMesh);

  // Split bolted bypass flange half-rings so Exploded View reveals the core cleanly
  const halfFlangeGeo = new THREE.TorusGeometry(1.18, 0.025, 10, 28, Math.PI);
  const upperFlange = new THREE.Mesh(halfFlangeGeo, acousticMat);
  upperFlange.position.z = 0.45;
  nacelleUpperGroup.add(upperFlange);

  const lowerFlange = new THREE.Mesh(halfFlangeGeo, acousticMat);
  lowerFlange.position.z = 0.45;
  lowerFlange.rotation.z = Math.PI;
  nacelleLowerGroup.add(lowerFlange);

  const boltGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.055, 6);
  boltGeo.rotateX(Math.PI / 2);
  const halfBoltCount = 12;

  const upperBoltsMesh = new THREE.InstancedMesh(
    boltGeo,
    titaniumBladeMat,
    halfBoltCount,
  );
  for (let i = 0; i < halfBoltCount; i++) {
    const angle = ((i + 0.5) / halfBoltCount) * Math.PI;
    _pos.set(Math.cos(angle) * 1.18, Math.sin(angle) * 1.18, 0.46);
    _quat.identity();
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    upperBoltsMesh.setMatrixAt(i, _mat4);
  }
  upperBoltsMesh.instanceMatrix.needsUpdate = true;
  upperBoltsMesh.computeBoundingSphere();
  nacelleUpperGroup.add(upperBoltsMesh);

  const lowerBoltsMesh = new THREE.InstancedMesh(
    boltGeo,
    titaniumBladeMat,
    halfBoltCount,
  );
  for (let i = 0; i < halfBoltCount; i++) {
    const angle = Math.PI + ((i + 0.5) / halfBoltCount) * Math.PI;
    _pos.set(Math.cos(angle) * 1.18, Math.sin(angle) * 1.18, 0.46);
    _quat.identity();
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    lowerBoltsMesh.setMatrixAt(i, _mat4);
  }
  lowerBoltsMesh.instanceMatrix.needsUpdate = true;
  lowerBoltsMesh.computeBoundingSphere();
  nacelleLowerGroup.add(lowerBoltsMesh);

  // Structural top mounting pylon
  const pylonShape = new THREE.Shape();
  pylonShape.moveTo(-0.5, 0);
  pylonShape.lineTo(0.45, 0);
  pylonShape.lineTo(0.28, 0.46);
  pylonShape.lineTo(-0.35, 0.46);
  pylonShape.closePath();
  const pylonGeo = new THREE.ExtrudeGeometry(pylonShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 2,
  });
  pylonGeo.center();
  const pylonMesh = new THREE.Mesh(pylonGeo, darkAlloyMat);
  pylonMesh.rotation.y = Math.PI / 2;
  pylonMesh.position.set(0, 1.24, -0.05);
  nacelleUpperGroup.add(pylonMesh);

  tagSubsystem(nacelleUpperGroup, 'nacelle-shroud', raycastTargets);
  tagSubsystem(nacelleLowerGroup, 'nacelle-shroud', raycastTargets);
  highlightTargets.push({
    subsystemId: 'nacelle-shroud',
    meshes: [upperCowlMesh, lowerCowlMesh],
  });
  root.add(nacelleUpperGroup);
  root.add(nacelleLowerGroup);

  // 4. High-Pressure Compressor (HPC) Core & Sensor Conduits
  const hpcGroup = new THREE.Group();
  hpcGroup.position.set(0, centerlineY, 0.12);

  const stageRadii = [0.58, 0.52, 0.47];
  const stageZ = [0.24, 0.0, -0.24];
  const hpcStageMeshes: THREE.Mesh[] = [];
  for (let i = 0; i < stageRadii.length; i++) {
    const drumGeo = new THREE.CylinderGeometry(
      stageRadii[i],
      stageRadii[i] * 0.96,
      0.16,
      32,
    );
    drumGeo.rotateX(Math.PI / 2);
    const drumMesh = new THREE.Mesh(drumGeo, i % 2 === 0 ? titaniumBladeMat : darkAlloyMat);
    drumMesh.position.z = stageZ[i];
    hpcGroup.add(drumMesh);
    hpcStageMeshes.push(drumMesh);
  }

  // External fuel/telemetry TubeGeometry manifolds
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.56, 0.14, 0.34),
      new THREE.Vector3(side * 0.62, 0.24, 0.02),
      new THREE.Vector3(side * 0.52, 0.18, -0.34),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.024, 10, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, conduitMat);
    hpcGroup.add(tubeMesh);

    const sensorGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorBeaconMat);
    sensorMesh.position.set(side * 0.62, 0.24, 0.02);
    hpcGroup.add(sensorMesh);
  }

  tagSubsystem(hpcGroup, 'compressor-core', raycastTargets);
  highlightTargets.push({ subsystemId: 'compressor-core', meshes: hpcStageMeshes });
  root.add(hpcGroup);

  // 5. Combustor & Low-Pressure Turbine Hot Section
  const hotGroup = new THREE.Group();
  hotGroup.position.set(0, centerlineY, -0.62);

  const combustorGeo = new THREE.CylinderGeometry(0.46, 0.52, 0.42, 32);
  combustorGeo.rotateX(Math.PI / 2);
  const combustorMesh = new THREE.Mesh(combustorGeo, thermalCoreMat);
  hotGroup.add(combustorMesh);

  const turbineDiscGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.12, 32);
  turbineDiscGeo.rotateX(Math.PI / 2);
  const turbineDisc = new THREE.Mesh(turbineDiscGeo, darkAlloyMat);
  turbineDisc.position.z = -0.32;
  hotGroup.add(turbineDisc);

  const turbineBladeGeo = new THREE.BoxGeometry(0.022, 0.2, 0.06);
  const turbineBlades = new THREE.InstancedMesh(
    turbineBladeGeo,
    conduitMat,
    24,
  );
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    _pos.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, -0.32);
    _euler.set(0.3, 0, a - Math.PI / 2);
    _quat.setFromEuler(_euler);
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    turbineBlades.setMatrixAt(i, _mat4);
  }
  turbineBlades.instanceMatrix.needsUpdate = true;
  turbineBlades.computeBoundingSphere();
  hotGroup.add(turbineBlades);

  tagSubsystem(hotGroup, 'combustor-turbine', raycastTargets);
  highlightTargets.push({
    subsystemId: 'combustor-turbine',
    meshes: [combustorMesh, turbineDisc],
  });
  root.add(hotGroup);

  // 6. Convergent Exhaust Cone
  const exhaustGroup = new THREE.Group();
  exhaustGroup.position.set(0, centerlineY, -1.25);

  const nozzleProfile = [
    new THREE.Vector2(0.76, 0.22),
    new THREE.Vector2(0.68, 0.02),
    new THREE.Vector2(0.52, -0.45),
    new THREE.Vector2(0.45, -0.45),
    new THREE.Vector2(0.59, 0.05),
    new THREE.Vector2(0.68, 0.22),
  ];
  const nozzleGeo = new THREE.LatheGeometry(nozzleProfile, 36);
  nozzleGeo.rotateX(Math.PI / 2);
  if (nozzleGeo.index) nozzleGeo.computeTangents();
  const nozzleMesh = new THREE.Mesh(nozzleGeo, darkAlloyMat);
  exhaustGroup.add(nozzleMesh);

  const tailConeGeo = new THREE.ConeGeometry(0.28, 0.65, 28);
  tailConeGeo.rotateX(-Math.PI / 2);
  const tailCone = new THREE.Mesh(tailConeGeo, thermalCoreMat);
  tailCone.position.z = -0.25;
  exhaustGroup.add(tailCone);

  tagSubsystem(exhaustGroup, 'exhaust-nozzle', raycastTargets);
  highlightTargets.push({ subsystemId: 'exhaust-nozzle', meshes: [nozzleMesh] });
  root.add(exhaustGroup);

  let rotorAngle = 0;

  return {
    id: 'forgemind-turbofan',
    root,
    raycastTargets,
    subsystemAnchors: [
      { id: 'spinner-fan', object: fanGroup, localOffset: [0, 0.56, 0.2] },
      { id: 'nacelle-shroud', object: nacelleUpperGroup, localOffset: [0, 1.38, 0.05] },
      { id: 'compressor-core', object: hpcGroup, localOffset: [0, 0.72, 0] },
      { id: 'combustor-turbine', object: hotGroup, localOffset: [0, 0.68, -0.1] },
      { id: 'exhaust-nozzle', object: exhaustGroup, localOffset: [0, 0.75, -0.15] },
    ],
    update: ({ dt, elapsed, explodeProgress, thermalMode, paused }) => {
      if (!paused) {
        rotorAngle += dt * 1.9;
        fanGroup.rotation.z = -rotorAngle;
        hpcGroup.rotation.z = rotorAngle * 1.35;
        hotGroup.rotation.z = -rotorAngle * 1.15;
      }

      fanGroup.position.z = computeExplodedCoordinate(1.02, 1.35, explodeProgress);
      hpcGroup.position.z = computeExplodedCoordinate(0.12, 0.35, explodeProgress);
      hotGroup.position.z = computeExplodedCoordinate(-0.62, -0.65, explodeProgress);
      exhaustGroup.position.z = computeExplodedCoordinate(-1.25, -1.45, explodeProgress);

      nacelleUpperGroup.position.y = computeExplodedCoordinate(
        centerlineY,
        0.88,
        explodeProgress,
      );
      nacelleLowerGroup.position.y = computeExplodedCoordinate(
        centerlineY,
        -0.16,
        explodeProgress,
      );

      const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.2);
      thermalCoreMat.emissive.setHex(thermalMode ? 0xff4500 : 0xf97316);
      thermalCoreMat.emissiveIntensity = thermalMode
        ? 1.55 + pulse * 0.45
        : 0.45;
      sensorBeaconMat.emissiveIntensity = thermalMode ? 1.45 : 0.72;
    },
    applyFinish: (finish) => {
      primaryMat.color.setHex(finish.primaryHex);
      primaryMat.metalness = finish.metalness;
      primaryMat.roughness = finish.roughness;
      primaryMat.clearcoat = finish.clearcoat;
      darkAlloyMat.color.setHex(finish.secondaryHex);
    },
    setHighlightSubsystem: (subsystemId) => {
      for (const entry of highlightTargets) {
        const active = entry.subsystemId === subsystemId;
        for (const mesh of entry.meshes) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && mat !== thermalCoreMat) {
            mat.emissive.setHex(active ? 0x0284c7 : 0x000000);
            mat.emissiveIntensity = active ? 0.35 : 0;
          }
        }
      }
    },
    dispose: () => {
      disposeObjectTree(root);
    },
  };
}
