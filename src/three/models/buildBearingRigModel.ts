import * as THREE from 'three';
import type { ProceduralTextureBundle } from '../proceduralTextures';
import { computeExplodedCoordinate, type MaterialFinishSpec } from '../studioConfig';
import { disposeObjectTree, tagSubsystem, type StudioAssembly } from './types';

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();

export function buildBearingRigModel(
  textures: ProceduralTextureBundle,
  initialFinish: MaterialFinishSpec,
): StudioAssembly {
  const root = new THREE.Group();
  root.name = 'femto-bearing-testbed';
  const raycastTargets: THREE.Object3D[] = [];
  const centerlineY = 1.08;

  const primaryMat = new THREE.MeshPhysicalMaterial({
    color: initialFinish.primaryHex,
    metalness: initialFinish.metalness,
    roughness: initialFinish.roughness,
    clearcoat: initialFinish.clearcoat,
    anisotropy: 0.7,
    roughnessMap: textures.brushedRoughness,
    bumpMap: textures.brushedBump,
    bumpScale: 0.004,
  });

  const castBaseMat = new THREE.MeshStandardMaterial({
    color: initialFinish.secondaryHex,
    metalness: 0.58,
    roughness: 0.62,
  });

  const chromeShaftMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    metalness: 0.96,
    roughness: 0.12,
    anisotropy: 0.85,
  });

  const bronzeCageMat = new THREE.MeshPhysicalMaterial({
    color: 0xd97706,
    metalness: 0.88,
    roughness: 0.28,
    clearcoat: 0.25,
  });

  const rubberMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.08,
    roughness: 0.88,
  });

  const gaugeFaceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.gaugeDial,
    metalness: 0.1,
    roughness: 0.35,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.telemetryScreen,
    emissive: new THREE.Color(0x0ea5e9),
    emissiveMap: textures.telemetryScreen,
    emissiveIntensity: 0.85,
    metalness: 0.1,
    roughness: 0.22,
  });

  const sensorBeaconMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: new THREE.Color(0x22d3ee),
    emissiveIntensity: 0.85,
    metalness: 0.2,
    roughness: 0.25,
  });

  const highlightTargets: Array<{ subsystemId: string; meshes: THREE.Mesh[] }> = [];

  // 1. Vibration-Isolated Bedplate & Mounting Pads (flush y = 0)
  const bedGroup = new THREE.Group();
  const padGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.08, 20);
  const padOffsets: Array<[number, number]> = [
    [-1.45, -0.78],
    [-1.45, 0.78],
    [1.45, -0.78],
    [1.45, 0.78],
  ];
  for (const [px, pz] of padOffsets) {
    const pad = new THREE.Mesh(padGeo, rubberMat);
    pad.position.set(px, 0.04, pz);
    bedGroup.add(pad);
  }

  const bedplate = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.18, 1.95),
    castBaseMat,
  );
  bedplate.position.set(0, 0.17, 0);
  bedGroup.add(bedplate);

  // 20 Instanced hex cap screws anchoring sub-plates
  const boltGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.05, 6);
  const boltsMesh = new THREE.InstancedMesh(boltGeo, chromeShaftMat, 20);
  for (let i = 0; i < 20; i++) {
    const col = i % 10;
    const row = Math.floor(i / 10);
    _pos.set(-1.45 + col * 0.32, 0.28, row === 0 ? -0.82 : 0.82);
    _quat.identity();
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    boltsMesh.setMatrixAt(i, _mat4);
  }
  boltsMesh.instanceMatrix.needsUpdate = true;
  boltsMesh.computeBoundingSphere();
  bedGroup.add(boltsMesh);

  tagSubsystem(bedGroup, 'bearing-housing', raycastTargets);
  root.add(bedGroup);

  // 2. VFD Drive Motor + Cooling Fins + Flexible Spider Coupling
  const motorGroup = new THREE.Group();
  motorGroup.position.set(-1.02, 0, 0);

  const motorSaddle = new THREE.Mesh(
    new THREE.BoxGeometry(0.86, 0.36, 0.74),
    castBaseMat,
  );
  motorSaddle.position.y = 0.44;
  motorGroup.add(motorSaddle);

  const motorBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.92, 32),
    primaryMat,
  );
  motorBody.rotation.z = Math.PI / 2;
  motorBody.position.y = centerlineY;
  motorGroup.add(motorBody);

  // 24 radial cooling fins instanced around motor housing
  const finGeo = new THREE.BoxGeometry(0.76, 0.025, 0.06);
  const finCount = 24;
  const finsMesh = new THREE.InstancedMesh(finGeo, castBaseMat, finCount);
  for (let i = 0; i < finCount; i++) {
    const a = (i / finCount) * Math.PI * 2;
    _pos.set(0, centerlineY + Math.cos(a) * 0.43, Math.sin(a) * 0.43);
    _quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), a);
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    finsMesh.setMatrixAt(i, _mat4);
  }
  finsMesh.instanceMatrix.needsUpdate = true;
  finsMesh.computeBoundingSphere();
  motorGroup.add(finsMesh);

  const terminalBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.16, 0.28),
    castBaseMat,
  );
  terminalBox.position.set(0.08, centerlineY + 0.48, 0);
  motorGroup.add(terminalBox);

  // Coupling rotor rotating with motor shaft
  const couplingGroup = new THREE.Group();
  couplingGroup.position.set(0.64, centerlineY, 0);

  const hubL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.14, 24),
    chromeShaftMat,
  );
  hubL.rotation.z = Math.PI / 2;
  hubL.position.x = -0.1;
  couplingGroup.add(hubL);

  const spiderInsert = new THREE.Mesh(
    new THREE.CylinderGeometry(0.165, 0.165, 0.08, 12),
    bronzeCageMat,
  );
  spiderInsert.rotation.z = Math.PI / 2;
  couplingGroup.add(spiderInsert);

  const hubR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.14, 24),
    chromeShaftMat,
  );
  hubR.rotation.z = Math.PI / 2;
  hubR.position.x = 0.1;
  couplingGroup.add(hubR);

  // Stepped Lathe drive shaft extending into bearing housing
  const shaftProfile = [
    new THREE.Vector2(0.08, 0),
    new THREE.Vector2(0.08, 0.42),
    new THREE.Vector2(0.125, 0.44),
    new THREE.Vector2(0.125, 1.05),
    new THREE.Vector2(0.09, 1.08),
    new THREE.Vector2(0.09, 1.38),
    new THREE.Vector2(0.001, 1.38),
  ];
  const shaftGeo = new THREE.LatheGeometry(shaftProfile, 28);
  shaftGeo.rotateZ(-Math.PI / 2);
  if (shaftGeo.index) shaftGeo.computeTangents();
  const shaftMesh = new THREE.Mesh(shaftGeo, chromeShaftMat);
  shaftMesh.position.x = 0.15;
  couplingGroup.add(shaftMesh);

  motorGroup.add(couplingGroup);
  tagSubsystem(motorGroup, 'drive-motor', raycastTargets);
  highlightTargets.push({
    subsystemId: 'drive-motor',
    meshes: [motorBody, hubL, hubR],
  });
  root.add(motorGroup);

  // 3. Split Pillow-Block Test Bearing Housing + 16 Orbiting Chrome Balls
  const pedestalGroup = new THREE.Group();
  pedestalGroup.position.set(0.32, 0, 0);

  const lowerBlockShape = new THREE.Shape();
  lowerBlockShape.moveTo(-0.46, 0);
  lowerBlockShape.lineTo(0.46, 0);
  lowerBlockShape.lineTo(0.38, 0.82);
  lowerBlockShape.lineTo(0.34, 0.82);
  lowerBlockShape.absarc(0, 0.82, 0.34, 0, Math.PI, true);
  lowerBlockShape.lineTo(-0.38, 0.82);
  lowerBlockShape.closePath();

  const lowerBlockGeo = new THREE.ExtrudeGeometry(lowerBlockShape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  lowerBlockGeo.translate(0, 0, -0.21);
  lowerBlockGeo.rotateY(Math.PI / 2);

  const lowerPillowMesh = new THREE.Mesh(lowerBlockGeo, castBaseMat);
  lowerPillowMesh.position.y = 0.26;
  pedestalGroup.add(lowerPillowMesh);

  // Upper Removable Split Cap
  const upperCapGroup = new THREE.Group();
  upperCapGroup.position.set(0, centerlineY, 0);

  const upperArchGeo = new THREE.CylinderGeometry(
    0.42,
    0.42,
    0.4,
    32,
    1,
    false,
    0,
    Math.PI,
  );
  upperArchGeo.rotateZ(Math.PI / 2);
  upperArchGeo.rotateY(Math.PI / 2);
  const upperCapMesh = new THREE.Mesh(upperArchGeo, primaryMat);
  upperArchGeo.rotateY(-Math.PI / 2);
  // Orient semicircle cleanly as top cap (Y >= 0)
  upperCapMesh.rotation.set(0, 0, Math.PI / 2);
  upperCapGroup.add(upperCapMesh);

  // Wait: CylinderGeometry thetaStart=0..PI revolves around Y: x = r*sin(t), z = r*cos(t).
  // Use Torus/Extrude half arch cleanly so it sits flush on top (Y >= 0):
  upperCapGroup.remove(upperCapMesh);
  upperArchGeo.dispose();

  const capShape = new THREE.Shape();
  capShape.absarc(0, 0, 0.4, 0, Math.PI, false);
  capShape.lineTo(-0.28, 0);
  capShape.absarc(0, 0, 0.28, Math.PI, 0, true);
  capShape.closePath();
  const capGeo = new THREE.ExtrudeGeometry(capShape, {
    depth: 0.36,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  capGeo.translate(0, 0, -0.18);
  capGeo.rotateY(Math.PI / 2);
  const trueCapMesh = new THREE.Mesh(capGeo, primaryMat);
  upperCapGroup.add(trueCapMesh);
  pedestalGroup.add(upperCapGroup);

  // Bronze outer/inner race ring & 16 orbiting chrome bearing balls
  const outerRace = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.042, 16, 36),
    bronzeCageMat,
  );
  outerRace.rotation.y = Math.PI / 2;
  outerRace.position.set(0, centerlineY, 0);
  pedestalGroup.add(outerRace);

  const ballComplementGroup = new THREE.Group();
  ballComplementGroup.position.set(0, centerlineY, 0);

  const ballGeo = new THREE.SphereGeometry(0.048, 16, 16);
  const ballCount = 16;
  const ballsMesh = new THREE.InstancedMesh(ballGeo, chromeShaftMat, ballCount);
  for (let i = 0; i < ballCount; i++) {
    const a = (i / ballCount) * Math.PI * 2;
    _pos.set(0, Math.sin(a) * 0.21, Math.cos(a) * 0.21);
    _quat.identity();
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    ballsMesh.setMatrixAt(i, _mat4);
  }
  ballsMesh.instanceMatrix.needsUpdate = true;
  ballsMesh.computeBoundingSphere();
  ballComplementGroup.add(ballsMesh);
  pedestalGroup.add(ballComplementGroup);

  tagSubsystem(pedestalGroup, 'bearing-housing', raycastTargets);
  highlightTargets.push({
    subsystemId: 'bearing-housing',
    meshes: [trueCapMesh, lowerPillowMesh, outerRace],
  });
  root.add(pedestalGroup);

  // 4. Radial Hydraulic Load Actuator & Pressure Gauge
  const loadGroup = new THREE.Group();
  loadGroup.position.set(0.32, 0, -0.92);

  const ramTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 1.08, 0.42),
    castBaseMat,
  );
  ramTower.position.y = 0.8;
  loadGroup.add(ramTower);

  const pistonBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.48, 24),
    primaryMat,
  );
  pistonBarrel.rotation.x = Math.PI / 2;
  pistonBarrel.position.set(0, centerlineY, 0.28);
  loadGroup.add(pistonBarrel);

  const pistonRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.34, 18),
    chromeShaftMat,
  );
  pistonRod.rotation.x = Math.PI / 2;
  pistonRod.position.set(0, centerlineY, 0.54);
  loadGroup.add(pistonRod);

  // Analog calibrated pressure gauge mounted atop actuator
  const gaugeBezel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.09, 28),
    bronzeCageMat,
  );
  gaugeBezel.rotation.x = Math.PI / 2;
  gaugeBezel.position.set(0, 1.54, 0.08);
  loadGroup.add(gaugeBezel);

  const gaugeFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.19, 28),
    gaugeFaceMat,
  );
  gaugeFace.position.set(0, 1.54, 0.128);
  loadGroup.add(gaugeFace);

  tagSubsystem(loadGroup, 'load-actuator', raycastTargets);
  highlightTargets.push({
    subsystemId: 'load-actuator',
    meshes: [pistonBarrel, ramTower],
  });
  root.add(loadGroup);

  // 5. Biaxial Piezo Accelerometers + FFT Spectrum Telemetry Analyzer
  const daqGroup = new THREE.Group();
  daqGroup.position.set(1.22, 0, 0.44);

  const standPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.055, 0.92, 16),
    chromeShaftMat,
  );
  standPost.position.y = 0.72;
  daqGroup.add(standPost);

  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.84, 0.5, 0.08),
    castBaseMat,
  );
  monitorFrame.position.set(0, 1.24, 0);
  monitorFrame.rotation.y = -0.35;
  daqGroup.add(monitorFrame);

  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.74, 0.4),
    screenMat,
  );
  monitorScreen.position.set(0, 0, 0.044);
  monitorFrame.add(monitorScreen);

  // Coaxial accelerometer probes + harnesses reaching back toward bearing housing
  const probeY = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.12, 14),
    sensorBeaconMat,
  );
  probeY.position.set(-0.9, 1.54, -0.44);
  daqGroup.add(probeY);

  const probeX = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.12, 14),
    sensorBeaconMat,
  );
  probeX.rotation.x = Math.PI / 2;
  probeX.position.set(-0.9, centerlineY, -0.02);
  daqGroup.add(probeX);

  const coaxCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.9, 1.54, -0.44),
    new THREE.Vector3(-0.52, 1.68, -0.26),
    new THREE.Vector3(-0.22, 1.28, 0.05),
    new THREE.Vector3(-0.08, 1.15, 0),
  ]);
  const coaxTube = new THREE.Mesh(
    new THREE.TubeGeometry(coaxCurve, 24, 0.018, 8, false),
    sensorBeaconMat,
  );
  daqGroup.add(coaxTube);

  tagSubsystem(daqGroup, 'vibration-daq', raycastTargets);
  highlightTargets.push({
    subsystemId: 'vibration-daq',
    meshes: [monitorFrame],
  });
  root.add(daqGroup);

  let rotorAngle = 0;

  return {
    id: 'femto-bearing',
    root,
    raycastTargets,
    subsystemAnchors: [
      { id: 'drive-motor', object: motorGroup, localOffset: [0, 1.68, 0] },
      { id: 'bearing-housing', object: upperCapGroup, localOffset: [0, 0.52, 0] },
      { id: 'load-actuator', object: loadGroup, localOffset: [0, 1.85, 0] },
      { id: 'vibration-daq', object: daqGroup, localOffset: [0, 1.62, 0] },
    ],
    update: ({ dt, elapsed, explodeProgress, thermalMode, paused }) => {
      if (!paused) {
        rotorAngle += dt * 4.2;
        couplingGroup.rotation.x = rotorAngle;
        ballComplementGroup.rotation.x = -rotorAngle * 0.42;
      }

      motorGroup.position.x = computeExplodedCoordinate(-1.02, -0.68, explodeProgress);
      couplingGroup.position.x = computeExplodedCoordinate(0.64, 0.35, explodeProgress);
      upperCapGroup.position.y = computeExplodedCoordinate(
        centerlineY,
        0.72,
        explodeProgress,
      );
      loadGroup.position.z = computeExplodedCoordinate(-0.92, -0.58, explodeProgress);
      daqGroup.position.x = computeExplodedCoordinate(1.22, 0.45, explodeProgress);

      const pulse = 0.65 + 0.35 * Math.sin(elapsed * 3.6);
      sensorBeaconMat.emissive.setHex(thermalMode ? 0xf97316 : 0x22d3ee);
      sensorBeaconMat.emissiveIntensity = thermalMode ? 1.45 * pulse : 0.85;
      screenMat.emissive.setHex(thermalMode ? 0xfb923c : 0x38bdf8);
      screenMat.emissiveIntensity = thermalMode ? 1.15 : 0.85;
    },
    applyFinish: (finish) => {
      primaryMat.color.setHex(finish.primaryHex);
      primaryMat.metalness = finish.metalness;
      primaryMat.roughness = finish.roughness;
      primaryMat.clearcoat = finish.clearcoat;
      castBaseMat.color.setHex(finish.secondaryHex);
    },
    setHighlightSubsystem: (subsystemId) => {
      for (const entry of highlightTargets) {
        const active = entry.subsystemId === subsystemId;
        for (const mesh of entry.meshes) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && mat !== screenMat) {
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
