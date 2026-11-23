import * as THREE from 'three';
import type { ProceduralTextureBundle } from '../proceduralTextures';
import { computeExplodedCoordinate, type MaterialFinishSpec } from '../studioConfig';
import { disposeObjectTree, tagSubsystem, type StudioAssembly } from './types';

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();
const _color = new THREE.Color();

export function buildAsrsModel(
  textures: ProceduralTextureBundle,
  initialFinish: MaterialFinishSpec,
): StudioAssembly {
  const root = new THREE.Group();
  root.name = 'supply-asrs-bay';
  const raycastTargets: THREE.Object3D[] = [];

  const primaryMat = new THREE.MeshPhysicalMaterial({
    color: initialFinish.primaryHex,
    metalness: initialFinish.metalness,
    roughness: initialFinish.roughness,
    clearcoat: initialFinish.clearcoat,
    anisotropy: 0.6,
    roughnessMap: textures.brushedRoughness,
    bumpMap: textures.brushedBump,
    bumpScale: 0.004,
  });

  const frameSteelMat = new THREE.MeshStandardMaterial({
    color: initialFinish.secondaryHex,
    metalness: 0.72,
    roughness: 0.44,
  });

  const railMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.94,
    roughness: 0.16,
  });

  const toteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.12,
    roughness: 0.68,
  });

  const shuttleAccentMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: new THREE.Color(0x0ea5e9),
    emissiveIntensity: 0.35,
    metalness: 0.4,
    roughness: 0.32,
  });

  const highlightTargets: Array<{ subsystemId: string; meshes: THREE.Mesh[] }> = [];

  // 1. Structural Steel Racking Bay (flush y = 0)
  const rackGroup = new THREE.Group();
  rackGroup.position.set(0, 0, -0.78);

  const uprightGeo = new THREE.BoxGeometry(0.11, 2.86, 0.11);
  const colX = [-1.8, -0.9, 0, 0.9, 1.8];
  const depthZ = [-0.42, 0.42];
  for (const x of colX) {
    for (const z of depthZ) {
      const post = new THREE.Mesh(uprightGeo, frameSteelMat);
      post.position.set(x, 1.43, z);
      rackGroup.add(post);
    }
  }

  const beamGeo = new THREE.BoxGeometry(3.76, 0.09, 0.09);
  const tierY = [0.28, 1.12, 1.96, 2.8];
  for (const y of tierY) {
    for (const z of depthZ) {
      const beam = new THREE.Mesh(beamGeo, primaryMat);
      beam.position.set(0, y, z);
      rackGroup.add(beam);
    }
  }

  tagSubsystem(rackGroup, 'rack-frame', raycastTargets);
  highlightTargets.push({
    subsystemId: 'rack-frame',
    meshes: rackGroup.children.filter((c) => (c as THREE.Mesh).isMesh) as THREE.Mesh[],
  });
  root.add(rackGroup);

  // 2. Unit-Load Tote Inventory (24 InstancedMesh totes with per-instance tint variation)
  const binsGroup = new THREE.Group();
  binsGroup.position.set(0, 0, -0.78);

  const toteGeo = new THREE.BoxGeometry(0.64, 0.46, 0.66);
  const slotX = [-1.35, -0.45, 0.45, 1.35];
  const slotY = [0.56, 1.4, 2.24];
  const toteCount = slotX.length * slotY.length * 2;
  const totesMesh = new THREE.InstancedMesh(toteGeo, toteMat, toteCount);
  const palette = [0x1d4ed8, 0x0f766e, 0x334155, 0x0369a1];

  let idx = 0;
  for (const y of slotY) {
    for (const x of slotX) {
      for (const zOff of [-0.12, 0.12]) {
        if (idx >= toteCount) break;
        const s = 0.94 + ((idx * 7) % 10) * 0.012;
        _pos.set(x, y, zOff * 1.4);
        _quat.identity();
        _scale.set(s, s, s);
        _mat4.compose(_pos, _quat, _scale);
        totesMesh.setMatrixAt(idx, _mat4);
        _color.setHex(palette[idx % palette.length]);
        totesMesh.setColorAt(idx, _color);
        idx++;
      }
    }
  }
  totesMesh.instanceMatrix.needsUpdate = true;
  if (totesMesh.instanceColor) totesMesh.instanceColor.needsUpdate = true;
  totesMesh.computeBoundingSphere();
  binsGroup.add(totesMesh);

  tagSubsystem(binsGroup, 'pallet-bins', raycastTargets);
  root.add(binsGroup);

  // 3. Staging Dock & Dual Floor Guide Rails (offset cleanly above y = 0)
  const dockGroup = new THREE.Group();
  dockGroup.position.set(0, 0, 0.72);

  const railBed = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.05, 0.92),
    frameSteelMat,
  );
  railBed.position.y = 0.025;
  dockGroup.add(railBed);

  for (const zOff of [-0.32, 0.32]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(4.1, 0.07, 0.06),
      railMat,
    );
    rail.position.set(0, 0.085, zOff);
    dockGroup.add(rail);
  }

  // Top guide gantry
  const gantryBeam = new THREE.Mesh(
    new THREE.BoxGeometry(4.1, 0.1, 0.16),
    frameSteelMat,
  );
  gantryBeam.position.set(0, 2.92, 0);
  dockGroup.add(gantryBeam);

  tagSubsystem(dockGroup, 'transfer-dock', raycastTargets);
  highlightTargets.push({ subsystemId: 'transfer-dock', meshes: [railBed, gantryBeam] });
  root.add(dockGroup);

  // 4. Rail-Guided AS/RS Shuttle Crane & Lift Carriage
  const shuttleGroup = new THREE.Group();
  shuttleGroup.position.set(0, 0, 0.72);

  const bogieChassis = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.16, 0.78),
    primaryMat,
  );
  bogieChassis.position.y = 0.2;
  shuttleGroup.add(bogieChassis);

  const mastLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 2.58, 0.12),
    railMat,
  );
  mastLeft.position.set(-0.26, 1.54, 0);
  shuttleGroup.add(mastLeft);

  const mastRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 2.58, 0.12),
    railMat,
  );
  mastRight.position.set(0.26, 1.54, 0);
  shuttleGroup.add(mastRight);

  const liftCarriage = new THREE.Group();
  liftCarriage.position.set(0, 1.2, 0);

  const forkTray = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.12, 0.72),
    shuttleAccentMat,
  );
  liftCarriage.add(forkTray);

  const cargoTote = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.42, 0.56),
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.2,
      roughness: 0.48,
    }),
  );
  cargoTote.position.y = 0.27;
  liftCarriage.add(cargoTote);

  shuttleGroup.add(liftCarriage);
  tagSubsystem(shuttleGroup, 'shuttle-crane', raycastTargets);
  highlightTargets.push({
    subsystemId: 'shuttle-crane',
    meshes: [bogieChassis, forkTray],
  });
  root.add(shuttleGroup);

  let cycleTime = 0;

  return {
    id: 'supply-asrs',
    root,
    raycastTargets,
    subsystemAnchors: [
      { id: 'rack-frame', object: rackGroup, localOffset: [-1.15, 2.95, 0] },
      { id: 'pallet-bins', object: binsGroup, localOffset: [0.95, 2.45, 0] },
      { id: 'shuttle-crane', object: shuttleGroup, localOffset: [0, 2.95, 0] },
      { id: 'transfer-dock', object: dockGroup, localOffset: [1.55, 0.35, 0] },
    ],
    update: ({ dt, elapsed, explodeProgress, thermalMode, paused }) => {
      if (!paused) {
        cycleTime += dt;
      }

      const aisleX = Math.sin(cycleTime * 0.75) * 1.25;
      const liftY = 1.22 + Math.sin(cycleTime * 1.5) * 0.65;
      shuttleGroup.position.x = aisleX;
      liftCarriage.position.y = liftY;

      rackGroup.position.z = computeExplodedCoordinate(-0.78, -0.65, explodeProgress);
      binsGroup.position.z = computeExplodedCoordinate(-0.78, -0.15, explodeProgress);
      binsGroup.position.y = computeExplodedCoordinate(0, 0.35, explodeProgress);
      dockGroup.position.z = computeExplodedCoordinate(0.72, 0.65, explodeProgress);
      shuttleGroup.position.z = computeExplodedCoordinate(0.72, 0.95, explodeProgress);

      const beacon = 0.45 + 0.35 * Math.sin(elapsed * 3.0);
      shuttleAccentMat.emissive.setHex(thermalMode ? 0xf97316 : 0x0ea5e9);
      shuttleAccentMat.emissiveIntensity = thermalMode ? beacon * 1.8 : beacon;
    },
    applyFinish: (finish) => {
      primaryMat.color.setHex(finish.primaryHex);
      primaryMat.metalness = finish.metalness;
      primaryMat.roughness = finish.roughness;
      primaryMat.clearcoat = finish.clearcoat;
      frameSteelMat.color.setHex(finish.secondaryHex);
    },
    setHighlightSubsystem: (subsystemId) => {
      for (const entry of highlightTargets) {
        const active = entry.subsystemId === subsystemId;
        for (const mesh of entry.meshes) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && mat !== shuttleAccentMat) {
            mat.emissive.setHex(active ? 0x0284c7 : 0x000000);
            mat.emissiveIntensity = active ? 0.32 : 0;
          }
        }
      }
    },
    dispose: () => {
      disposeObjectTree(root);
    },
  };
}
