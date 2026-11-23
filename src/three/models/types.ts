import * as THREE from 'three';
import type { MaterialFinishSpec, StudioModelId } from '../studioConfig';

export interface SubsystemAnchor {
  id: string;
  object: THREE.Object3D;
  localOffset: [number, number, number];
}

export interface StudioAssembly {
  id: StudioModelId;
  root: THREE.Group;
  raycastTargets: THREE.Object3D[];
  subsystemAnchors?: SubsystemAnchor[];
  update: (params: {
    dt: number;
    elapsed: number;
    explodeProgress: number;
    thermalMode: boolean;
    paused: boolean;
  }) => void;
  applyFinish: (finish: MaterialFinishSpec) => void;
  setHighlightSubsystem: (subsystemId: string | null) => void;
  dispose: () => void;
}

export function tagSubsystem(
  object: THREE.Object3D,
  subsystemId: string,
  raycastTargets: THREE.Object3D[],
): void {
  object.traverse((child) => {
    child.userData.subsystemId = subsystemId;
    if ((child as THREE.Mesh).isMesh) {
      child.layers.enable(1);
      child.castShadow = true;
      child.receiveShadow = true;
      raycastTargets.push(child);
    }
  });
}

export function disposeObjectTree(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      geometries.add(mesh.geometry);
    }
    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => materials.add(m));
    } else if (mat) {
      materials.add(mat);
    }
  });

  geometries.forEach((geo) => geo.dispose());
  materials.forEach((mat) => mat.dispose());
}
