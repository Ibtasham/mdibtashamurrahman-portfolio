import * as THREE from 'three';
import type { ProceduralTextureBundle } from '../proceduralTextures';
import { computeExplodedCoordinate, type MaterialFinishSpec } from '../studioConfig';
import { disposeObjectTree, tagSubsystem, type StudioAssembly } from './types';

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();

export function buildFactoryCellModel(
  textures: ProceduralTextureBundle,
  initialFinish: MaterialFinishSpec,
): StudioAssembly {
  const root = new THREE.Group();
  root.name = 'factorymind-workcell';
  const raycastTargets: THREE.Object3D[] = [];

  const primaryMat = new THREE.MeshPhysicalMaterial({
    color: initialFinish.primaryHex,
    metalness: initialFinish.metalness,
    roughness: initialFinish.roughness,
    clearcoat: initialFinish.clearcoat,
    anisotropy: 0.65,
    roughnessMap: textures.brushedRoughness,
    bumpMap: textures.brushedBump,
    bumpScale: 0.004,
  });

  const castIronMat = new THREE.MeshStandardMaterial({
    color: initialFinish.secondaryHex,
    metalness: 0.62,
    roughness: 0.54,
  });

  const servoSilverMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.18,
    anisotropy: 0.8,
  });

  const conveyorRubberMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.15,
    roughness: 0.85,
  });

  const laserBeamMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: new THREE.Color(0x06b6d4),
    emissiveIntensity: 1.1,
    metalness: 0.1,
    roughness: 0.2,
  });

  const cableMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.25,
    roughness: 0.62,
  });

  const highlightTargets: Array<{ subsystemId: string; meshes: THREE.Mesh[] }> = [];

  // 1. Cast-Iron Robot Pedestal & J1 Waist Turret (grounded flush at y = 0)
  const baseGroup = new THREE.Group();
  baseGroup.position.set(-0.95, 0, 0.25);

  const footPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.76, 0.16, 32),
    castIronMat,
  );
  footPlate.position.y = 0.08;
  baseGroup.add(footPlate);

  const columnDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.52, 0.62, 32),
    castIronMat,
  );
  columnDrum.position.y = 0.47;
  baseGroup.add(columnDrum);

  const waistTurret = new THREE.Group();
  waistTurret.position.y = 0.78;
  const turretBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.41, 0.36, 32),
    primaryMat,
  );
  turretBody.position.y = 0.18;
  waistTurret.add(turretBody);

  const j2Housing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.56, 24),
    servoSilverMat,
  );
  j2Housing.rotation.x = Math.PI / 2;
  j2Housing.position.set(0.12, 0.36, 0);
  waistTurret.add(j2Housing);

  baseGroup.add(waistTurret);
  tagSubsystem(baseGroup, 'robot-base', raycastTargets);
  highlightTargets.push({ subsystemId: 'robot-base', meshes: [turretBody] });
  root.add(baseGroup);

  // 2. Twin-Spar Lower Arm (J2) & Articulated Forearm (J3)
  const shoulderPivot = new THREE.Group();
  shoulderPivot.position.set(0.12, 0.36, 0);
  waistTurret.add(shoulderPivot);

  const lowerArmShape = new THREE.Shape();
  lowerArmShape.moveTo(-0.14, 0);
  lowerArmShape.lineTo(0.14, 0);
  lowerArmShape.lineTo(0.11, 1.32);
  lowerArmShape.lineTo(-0.11, 1.32);
  lowerArmShape.closePath();

  const lowerArmGeo = new THREE.ExtrudeGeometry(lowerArmShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });

  const sparLeft = new THREE.Mesh(lowerArmGeo, primaryMat);
  sparLeft.position.z = 0.16;
  shoulderPivot.add(sparLeft);

  const sparRight = new THREE.Mesh(lowerArmGeo, primaryMat);
  sparRight.position.z = -0.26;
  shoulderPivot.add(sparRight);

  // Umbilical dress pack tube along arm
  const dressCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.1, 0),
    new THREE.Vector3(-0.26, 0.68, 0.06),
    new THREE.Vector3(-0.05, 1.24, 0),
  ]);
  const dressTube = new THREE.Mesh(
    new THREE.TubeGeometry(dressCurve, 24, 0.042, 10, false),
    cableMat,
  );
  shoulderPivot.add(dressTube);

  // Forearm pivot (J3)
  const elbowPivot = new THREE.Group();
  elbowPivot.position.set(0, 1.28, 0);
  shoulderPivot.add(elbowPivot);

  const j3Cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.21, 0.54, 24),
    servoSilverMat,
  );
  j3Cap.rotation.x = Math.PI / 2;
  elbowPivot.add(j3Cap);

  const forearmBeam = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.22, 0.26),
    primaryMat,
  );
  forearmBeam.position.set(0.58, 0.04, 0);
  elbowPivot.add(forearmBeam);

  tagSubsystem(shoulderPivot, 'robot-arm', raycastTargets);
  highlightTargets.push({
    subsystemId: 'robot-arm',
    meshes: [sparLeft, sparRight, forearmBeam],
  });

  // 3. Parallel Jaw Gripper & Machined Billet
  const wristPivot = new THREE.Group();
  wristPivot.position.set(1.18, 0.04, 0);
  elbowPivot.add(wristPivot);

  const wristCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.2, 20),
    servoSilverMat,
  );
  wristCollar.rotation.z = Math.PI / 2;
  wristPivot.add(wristCollar);

  const palmBlock = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.34),
    castIronMat,
  );
  palmBlock.position.set(0.12, -0.06, 0);
  wristPivot.add(palmBlock);

  const jawGeo = new THREE.BoxGeometry(0.06, 0.22, 0.055);
  const jawA = new THREE.Mesh(jawGeo, servoSilverMat);
  jawA.position.set(0.14, -0.22, 0.12);
  wristPivot.add(jawA);

  const jawB = new THREE.Mesh(jawGeo, servoSilverMat);
  jawB.position.set(0.14, -0.22, -0.12);
  wristPivot.add(jawB);

  const heldBillet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.085, 0.16, 20),
    cableMat,
  );
  heldBillet.position.set(0.14, -0.26, 0);
  wristPivot.add(heldBillet);

  tagSubsystem(wristPivot, 'gripper-billet', raycastTargets);
  highlightTargets.push({
    subsystemId: 'gripper-billet',
    meshes: [palmBlock, heldBillet],
  });

  // 4. Indexed Roller Conveyor Line (24 instanced rollers, flush y = 0)
  const conveyorGroup = new THREE.Group();
  conveyorGroup.position.set(0.85, 0, -0.15);

  const legOffsets: Array<[number, number]> = [
    [-1.4, -0.44],
    [-1.4, 0.44],
    [1.4, -0.44],
    [1.4, 0.44],
  ];
  const legGeo = new THREE.BoxGeometry(0.1, 0.66, 0.1);
  for (const [lx, lz] of legOffsets) {
    const leg = new THREE.Mesh(legGeo, castIronMat);
    leg.position.set(lx, 0.33, lz);
    conveyorGroup.add(leg);
  }

  const railGeo = new THREE.BoxGeometry(3.2, 0.16, 0.08);
  const railFront = new THREE.Mesh(railGeo, primaryMat);
  railFront.position.set(0, 0.72, 0.48);
  conveyorGroup.add(railFront);

  const railBack = new THREE.Mesh(railGeo, primaryMat);
  railBack.position.set(0, 0.72, -0.48);
  conveyorGroup.add(railBack);

  const rollerGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.88, 16);
  rollerGeo.rotateX(Math.PI / 2);
  const rollerCount = 24;
  const rollers = new THREE.InstancedMesh(
    rollerGeo,
    servoSilverMat,
    rollerCount,
  );
  for (let i = 0; i < rollerCount; i++) {
    const x = -1.45 + (i / (rollerCount - 1)) * 2.9;
    _pos.set(x, 0.73, 0);
    _quat.identity();
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    rollers.setMatrixAt(i, _mat4);
  }
  rollers.instanceMatrix.needsUpdate = true;
  rollers.computeBoundingSphere();
  conveyorGroup.add(rollers);

  // Moving workpieces along conveyor
  const palletA = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.08, 0.36),
    conveyorRubberMat,
  );
  palletA.position.set(-0.8, 0.82, 0);
  const billetA = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.18, 20),
    cableMat,
  );
  billetA.position.y = 0.13;
  palletA.add(billetA);
  conveyorGroup.add(palletA);

  const palletB = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.08, 0.36),
    conveyorRubberMat,
  );
  palletB.position.set(0.65, 0.82, 0);
  const billetB = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.18, 20),
    servoSilverMat,
  );
  billetB.position.y = 0.13;
  palletB.add(billetB);
  conveyorGroup.add(palletB);

  tagSubsystem(conveyorGroup, 'conveyor-bed', raycastTargets);
  highlightTargets.push({
    subsystemId: 'conveyor-bed',
    meshes: [railFront, railBack],
  });
  root.add(conveyorGroup);

  // 5. Optical SPC Inspection Portal Arch
  const spcGroup = new THREE.Group();
  spcGroup.position.set(0.85, 0, -0.15);

  const archPostGeo = new THREE.BoxGeometry(0.14, 1.38, 0.14);
  const postFront = new THREE.Mesh(archPostGeo, castIronMat);
  postFront.position.set(0.45, 0.69, 0.6);
  spcGroup.add(postFront);

  const postBack = new THREE.Mesh(archPostGeo, castIronMat);
  postBack.position.set(0.45, 0.69, -0.6);
  spcGroup.add(postBack);

  const archBridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.18, 1.36),
    primaryMat,
  );
  archBridge.position.set(0.45, 1.44, 0);
  spcGroup.add(archBridge);

  const laserEmitter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.12, 20),
    laserBeamMat,
  );
  laserEmitter.position.set(0.45, 1.31, 0);
  spcGroup.add(laserEmitter);

  const laserCurtain = new THREE.Mesh(
    new THREE.PlaneGeometry(0.02, 0.45),
    laserBeamMat,
  );
  laserCurtain.position.set(0.45, 1.08, 0);
  laserCurtain.rotation.y = Math.PI / 2;
  spcGroup.add(laserCurtain);

  tagSubsystem(spcGroup, 'spc-portal', raycastTargets);
  highlightTargets.push({
    subsystemId: 'spc-portal',
    meshes: [archBridge],
  });
  root.add(spcGroup);

  let cycleTime = 0;

  return {
    id: 'factorymind-cell',
    root,
    raycastTargets,
    subsystemAnchors: [
      { id: 'robot-base', object: baseGroup, localOffset: [0, 0.95, 0] },
      { id: 'robot-arm', object: elbowPivot, localOffset: [0.35, 0.35, 0] },
      { id: 'gripper-billet', object: wristPivot, localOffset: [0.15, 0.15, 0] },
      { id: 'conveyor-bed', object: conveyorGroup, localOffset: [-0.7, 0.95, 0.45] },
      { id: 'spc-portal', object: spcGroup, localOffset: [0.45, 1.65, 0] },
    ],
    update: ({ dt, elapsed, explodeProgress, thermalMode, paused }) => {
      if (!paused) {
        cycleTime += dt;
      }

      const swing = Math.sin(cycleTime * 0.95);
      waistTurret.rotation.y = -0.35 + swing * 0.42;
      shoulderPivot.rotation.z = -0.22 + Math.cos(cycleTime * 0.95) * 0.16;
      elbowPivot.rotation.z = -0.32 + Math.sin(cycleTime * 1.9) * 0.14;
      wristPivot.rotation.z = 0.35 - elbowPivot.rotation.z - shoulderPivot.rotation.z;

      const travel = ((cycleTime * 0.45) % 2.4) - 1.2;
      palletA.position.x = travel;
      palletB.position.x = ((cycleTime * 0.45 + 1.2) % 2.4) - 1.2;

      baseGroup.position.x = computeExplodedCoordinate(-0.95, -0.75, explodeProgress);
      waistTurret.position.y = computeExplodedCoordinate(0.78, 0.45, explodeProgress);
      elbowPivot.position.y = computeExplodedCoordinate(1.28, 0.35, explodeProgress);
      wristPivot.position.x = computeExplodedCoordinate(1.18, 0.48, explodeProgress);
      conveyorGroup.position.x = computeExplodedCoordinate(0.85, 0.55, explodeProgress);
      spcGroup.position.y = computeExplodedCoordinate(0, 0.72, explodeProgress);

      const scanGlow = 0.8 + 0.35 * Math.sin(elapsed * 4.5);
      laserBeamMat.emissive.setHex(thermalMode ? 0xf97316 : 0x06b6d4);
      laserBeamMat.emissiveIntensity = thermalMode ? scanGlow * 1.45 : scanGlow;
    },
    applyFinish: (finish) => {
      primaryMat.color.setHex(finish.primaryHex);
      primaryMat.metalness = finish.metalness;
      primaryMat.roughness = finish.roughness;
      primaryMat.clearcoat = finish.clearcoat;
      castIronMat.color.setHex(finish.secondaryHex);
    },
    setHighlightSubsystem: (subsystemId) => {
      for (const entry of highlightTargets) {
        const active = entry.subsystemId === subsystemId;
        for (const mesh of entry.meshes) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
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
