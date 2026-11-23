import * as THREE from 'three';
import type { ProceduralTextureBundle } from '../proceduralTextures';
import { computeExplodedCoordinate, type MaterialFinishSpec } from '../studioConfig';
import { disposeObjectTree, tagSubsystem, type StudioAssembly } from './types';

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();

export function buildCncCellModel(
  textures: ProceduralTextureBundle,
  initialFinish: MaterialFinishSpec,
  isSoftwareGl: boolean,
): StudioAssembly {
  const root = new THREE.Group();
  root.name = 'carbon-aware-cnc-center';
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

  const frameIronMat = new THREE.MeshStandardMaterial({
    color: initialFinish.secondaryHex,
    metalness: 0.6,
    roughness: 0.6,
  });

  const chromeWayMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    metalness: 0.96,
    roughness: 0.14,
    anisotropy: 0.85,
  });

  const billetMat = new THREE.MeshPhysicalMaterial({
    color: 0xd97706,
    metalness: 0.82,
    roughness: 0.25,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    metalness: 0.0,
    roughness: 0.08,
    transmission: isSoftwareGl ? 0 : 0.85,
    transparent: true,
    opacity: isSoftwareGl ? 0.24 : 1,
    ior: 1.5,
    thickness: 0.12,
    clearcoat: 1.0,
    depthWrite: false,
  });

  const scadaScreenMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.telemetryScreen,
    emissive: new THREE.Color(0x0ea5e9),
    emissiveMap: textures.telemetryScreen,
    emissiveIntensity: 0.9,
    metalness: 0.15,
    roughness: 0.2,
  });

  const carbonBeaconMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: new THREE.Color(0x34d399),
    emissiveIntensity: 0.85,
    metalness: 0.2,
    roughness: 0.22,
  });

  const highlightTargets: Array<{ subsystemId: string; meshes: THREE.Mesh[] }> = [];

  // 1. Machine Base & Chip Pan + Sloped Safety Enclosure + Optical Glass Viewport (y = 0)
  const enclosureGroup = new THREE.Group();
  enclosureGroup.position.set(-0.35, 0, 0);

  const levelFootGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.08, 16);
  const footCoords: Array<[number, number]> = [
    [-1.15, -0.95],
    [-1.15, 0.95],
    [1.15, -0.95],
    [1.15, 0.95],
  ];
  for (const [fx, fz] of footCoords) {
    const foot = new THREE.Mesh(levelFootGeo, frameIronMat);
    foot.position.set(fx, 0.04, fz);
    enclosureGroup.add(foot);
  }

  const baseBed = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.56, 2.2),
    frameIronMat,
  );
  baseBed.position.set(0, 0.36, 0);
  enclosureGroup.add(baseBed);

  // Removable Upper Hood / Canopy + Side Pillars + Optical Glass
  const canopyGroup = new THREE.Group();
  const sideWallShape = new THREE.Shape();
  sideWallShape.moveTo(-1.08, 0);
  sideWallShape.lineTo(1.08, 0);
  sideWallShape.lineTo(1.08, 1.25);
  sideWallShape.lineTo(0.42, 1.95);
  sideWallShape.lineTo(-1.08, 1.95);
  sideWallShape.closePath();

  const sideWallGeo = new THREE.ExtrudeGeometry(sideWallShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  sideWallGeo.rotateY(Math.PI / 2);

  const wallLeft = new THREE.Mesh(sideWallGeo, primaryMat);
  wallLeft.position.set(-1.3, 0.64, 0);
  canopyGroup.add(wallLeft);

  const wallRight = new THREE.Mesh(sideWallGeo, primaryMat);
  wallRight.position.set(1.16, 0.64, 0);
  canopyGroup.add(wallRight);

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(2.58, 1.95, 0.16),
    primaryMat,
  );
  backWall.position.set(0, 1.62, -1.0);
  canopyGroup.add(backWall);

  const roofCrown = new THREE.Mesh(
    new THREE.BoxGeometry(2.58, 0.14, 1.48),
    frameIronMat,
  );
  roofCrown.position.set(0, 2.58, -0.34);
  canopyGroup.add(roofCrown);

  // Sloped optical glass observation door in front
  const glassPane = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 0.92, 0.04),
    glassMat,
  );
  glassPane.position.set(0, 1.86, 0.72);
  glassPane.rotation.x = -0.68;
  glassPane.renderOrder = 5;
  canopyGroup.add(glassPane);

  enclosureGroup.add(canopyGroup);
  tagSubsystem(enclosureGroup, 'cnc-enclosure', raycastTargets);
  highlightTargets.push({
    subsystemId: 'cnc-enclosure',
    meshes: [wallLeft, wallRight, backWall],
  });
  root.add(enclosureGroup);

  // 2. Precision T-Slot XY Table & Clamped Billet
  const tableGroup = new THREE.Group();
  tableGroup.position.set(-0.35, 0.72, 0.12);

  const tableBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.14, 1.15),
    frameIronMat,
  );
  tableGroup.add(tableBase);

  const slotGeo = new THREE.BoxGeometry(1.68, 0.035, 0.04);
  const slotMesh = new THREE.InstancedMesh(slotGeo, chromeWayMat, 8);
  for (let i = 0; i < 8; i++) {
    _pos.set(0, 0.088, -0.44 + i * 0.125);
    _quat.identity();
    _scale.set(1, 1, 1);
    _mat4.compose(_pos, _quat, _scale);
    slotMesh.setMatrixAt(i, _mat4);
  }
  slotMesh.instanceMatrix.needsUpdate = true;
  slotMesh.computeBoundingSphere();
  tableGroup.add(slotMesh);

  const viseBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.16, 0.44),
    frameIronMat,
  );
  viseBody.position.set(0, 0.16, 0);
  tableGroup.add(viseBody);

  const workpiece = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.18, 0.34),
    billetMat,
  );
  workpiece.position.set(0, 0.28, 0);
  tableGroup.add(workpiece);

  tagSubsystem(tableGroup, 'xy-worktable', raycastTargets);
  highlightTargets.push({
    subsystemId: 'xy-worktable',
    meshes: [tableBase, viseBody, workpiece],
  });
  root.add(tableGroup);

  // 3. Vertical Z-Column & High-Speed ER-32 Spindle Head
  const spindleGroup = new THREE.Group();
  spindleGroup.position.set(-0.35, 0.64, -0.58);

  const columnBridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 1.85, 0.44),
    primaryMat,
  );
  columnBridge.position.set(0, 0.92, 0);
  spindleGroup.add(columnBridge);

  for (const rx of [-0.18, 0.18]) {
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.65, 16),
      chromeWayMat,
    );
    rail.position.set(rx, 0.96, 0.24);
    spindleGroup.add(rail);
  }

  const headCarriage = new THREE.Group();
  headCarriage.position.set(0, 1.05, 0.56);

  const headCasting = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.62, 0.58),
    frameIronMat,
  );
  headCarriage.add(headCasting);

  // Lathe ER-32 Spindle Nose & Rotating Toolholder
  const spindleNoseGroup = new THREE.Group();
  spindleNoseGroup.position.set(0, -0.34, 0.08);

  const colletProfile = [
    new THREE.Vector2(0.16, 0.24),
    new THREE.Vector2(0.16, 0.12),
    new THREE.Vector2(0.1, 0.05),
    new THREE.Vector2(0.075, -0.06),
    new THREE.Vector2(0.028, -0.07),
    new THREE.Vector2(0.028, -0.28),
    new THREE.Vector2(0.001, -0.3),
  ];
  const spindleGeo = new THREE.LatheGeometry(colletProfile, 28);
  if (spindleGeo.index) spindleGeo.computeTangents();
  const spindleMesh = new THREE.Mesh(spindleGeo, chromeWayMat);
  spindleNoseGroup.add(spindleMesh);

  // Coolant delivery line curved down toward cutter tip
  const coolantCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 0.18, 0.05),
    new THREE.Vector3(0.24, -0.08, 0.12),
    new THREE.Vector3(0.12, -0.24, 0.09),
  ]);
  const coolantNozzle = new THREE.Mesh(
    new THREE.TubeGeometry(coolantCurve, 16, 0.02, 8, false),
    carbonBeaconMat,
  );
  headCarriage.add(coolantNozzle);
  headCarriage.add(spindleNoseGroup);

  spindleGroup.add(headCarriage);
  tagSubsystem(spindleGroup, 'spindle-head', raycastTargets);
  highlightTargets.push({
    subsystemId: 'spindle-head',
    meshes: [columnBridge, headCasting, spindleMesh],
  });
  root.add(spindleGroup);

  // 4. Side Carbon & Grid Tariff Telemetry Cabinet + Armored Power Conduit
  const cabinetGroup = new THREE.Group();
  cabinetGroup.position.set(1.48, 0, -0.15);

  const cabinetBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 1.98, 1.05),
    frameIronMat,
  );
  cabinetBox.position.y = 0.99;
  cabinetGroup.add(cabinetBox);

  const cabinetDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 1.82, 0.04),
    primaryMat,
  );
  cabinetDoor.position.set(0, 0.99, 0.53);
  cabinetGroup.add(cabinetDoor);

  const hmiPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.56, 0.34),
    scadaScreenMat,
  );
  hmiPanel.position.set(0, 1.48, 0.556);
  cabinetGroup.add(hmiPanel);

  const statusTower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.22, 16),
    carbonBeaconMat,
  );
  statusTower.position.set(0.22, 2.09, -0.32);
  cabinetGroup.add(statusTower);

  // Overhead armored bus conduit linking cabinet to CNC column
  const powerCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.34, 1.85, -0.15),
    new THREE.Vector3(-0.52, 2.25, -0.35),
    new THREE.Vector3(-0.95, 2.15, -0.45),
  ]);
  const powerConduit = new THREE.Mesh(
    new THREE.TubeGeometry(powerCurve, 20, 0.038, 10, false),
    frameIronMat,
  );
  cabinetGroup.add(powerConduit);

  tagSubsystem(cabinetGroup, 'energy-cabinet', raycastTargets);
  highlightTargets.push({
    subsystemId: 'energy-cabinet',
    meshes: [cabinetBox, cabinetDoor],
  });
  root.add(cabinetGroup);

  let cycle = 0;

  return {
    id: 'carbon-cnc',
    root,
    raycastTargets,
    subsystemAnchors: [
      { id: 'cnc-enclosure', object: canopyGroup, localOffset: [-0.35, 2.75, -0.35] },
      { id: 'xy-worktable', object: tableGroup, localOffset: [0, 0.5, 0.2] },
      { id: 'spindle-head', object: headCarriage, localOffset: [0, 0.45, 0] },
      { id: 'energy-cabinet', object: cabinetGroup, localOffset: [0, 2.25, 0] },
    ],
    update: ({ dt, elapsed, explodeProgress, thermalMode, paused }) => {
      if (!paused) {
        cycle += dt;
        spindleNoseGroup.rotation.y += dt * 7.5;
      }

      tableGroup.position.x =
        computeExplodedCoordinate(-0.35, 0, explodeProgress) +
        Math.sin(cycle * 1.1) * 0.22;
      tableGroup.position.z =
        computeExplodedCoordinate(0.12, 0.72, explodeProgress) +
        Math.cos(cycle * 0.85) * 0.12;

      headCarriage.position.y = 1.05 + Math.sin(cycle * 1.6) * 0.14;
      canopyGroup.position.y = computeExplodedCoordinate(0, 0.92, explodeProgress);
      spindleGroup.position.z = computeExplodedCoordinate(-0.58, -0.65, explodeProgress);
      cabinetGroup.position.x = computeExplodedCoordinate(1.48, 0.78, explodeProgress);

      const loadPulse = 0.7 + 0.3 * Math.sin(elapsed * 2.8);
      carbonBeaconMat.emissive.setHex(thermalMode ? 0xf97316 : 0x10b981);
      carbonBeaconMat.emissiveIntensity = thermalMode ? 1.5 * loadPulse : 0.9;
      scadaScreenMat.emissive.setHex(thermalMode ? 0xfb923c : 0x0ea5e9);
      scadaScreenMat.emissiveIntensity = thermalMode ? 1.25 : 0.9;
    },
    applyFinish: (finish) => {
      primaryMat.color.setHex(finish.primaryHex);
      primaryMat.metalness = finish.metalness;
      primaryMat.roughness = finish.roughness;
      primaryMat.clearcoat = finish.clearcoat;
      frameIronMat.color.setHex(finish.secondaryHex);
    },
    setHighlightSubsystem: (subsystemId) => {
      for (const entry of highlightTargets) {
        const active = entry.subsystemId === subsystemId;
        for (const mesh of entry.meshes) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && mat !== glassMat && mat !== scadaScreenMat) {
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
