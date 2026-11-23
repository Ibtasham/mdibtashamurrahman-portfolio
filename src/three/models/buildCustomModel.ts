import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import type { ProceduralTextureBundle } from '../proceduralTextures';
import {
  computeModelNormalizeTransform,
  type MaterialFinishSpec,
  type StudioModelId,
} from '../studioConfig';
import { disposeObjectTree, tagSubsystem, type StudioAssembly } from './types';

export interface CustomStudioAssembly extends StudioAssembly {
  fileName: string;
}

const MAX_CUSTOM_MODEL_BYTES = 25 * 1024 * 1024;

export async function buildCustomModelFromFile(
  file: File,
  fallbackId: StudioModelId,
  textures: ProceduralTextureBundle,
  initialFinish: MaterialFinishSpec,
): Promise<CustomStudioAssembly> {
  const lower = file.name.toLowerCase();
  const isGltf = lower.endsWith('.glb') || lower.endsWith('.gltf');
  const isStl = lower.endsWith('.stl');

  if (!isGltf && !isStl) {
    throw new Error('Supported CAD/3D formats: .glb, .gltf, or .stl.');
  }

  if (file.size > MAX_CUSTOM_MODEL_BYTES) {
    throw new Error(
      'File exceeds the 25 MB browser limit. Compress textures or decimate the mesh and retry.',
    );
  }

  const buffer = await file.arrayBuffer();
  const root = new THREE.Group();
  root.name = `custom-model-${file.name}`;
  const raycastTargets: THREE.Object3D[] = [];
  const customMeshes: THREE.Mesh[] = [];
  const baseGltfColors = new Map<THREE.MeshStandardMaterial, THREE.Color>();

  const fallbackStlMat = new THREE.MeshPhysicalMaterial({
    color: initialFinish.primaryHex,
    metalness: initialFinish.metalness,
    roughness: initialFinish.roughness,
    clearcoat: initialFinish.clearcoat,
    anisotropy: 0.55,
    roughnessMap: textures.brushedRoughness,
    bumpMap: textures.brushedBump,
    bumpScale: 0.004,
  });

  let loadedGroup: THREE.Object3D;

  if (isStl) {
    const stlLoader = new STLLoader();
    const geometry = stlLoader.parse(buffer);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, fallbackStlMat);
    loadedGroup = new THREE.Group();
    loadedGroup.add(mesh);
  } else {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    try {
      const gltf = await gltfLoader.parseAsync(buffer, '');
      loadedGroup = gltf.scene;
    } finally {
      dracoLoader.dispose();
    }
  }

  // Compute bounding box and normalize onto turntable plinth flush at y = 0
  loadedGroup.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(loadedGroup);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const normalized = computeModelNormalizeTransform(
    size,
    center,
    box.min.y,
    3.2,
  );
  loadedGroup.scale.setScalar(normalized.scale);
  loadedGroup.position.set(...normalized.position);

  root.add(loadedGroup);
  tagSubsystem(loadedGroup, 'custom-cad', raycastTargets);

  loadedGroup.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      customMeshes.push(mesh);
      if (!isStl) {
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        for (const m of mats) {
          if (m instanceof THREE.MeshStandardMaterial && !baseGltfColors.has(m)) {
            baseGltfColors.set(m, m.color.clone());
          }
        }
      }
    }
  });

  const customTextures = new Set<THREE.Texture>();
  if (!isStl) {
    loadedGroup.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        if (m && typeof m === 'object') {
          const rec = m as unknown as Record<string, unknown>;
          for (const key of [
            'map',
            'normalMap',
            'roughnessMap',
            'metalnessMap',
            'emissiveMap',
            'aoMap',
          ]) {
            const val = rec[key];
            if (val instanceof THREE.Texture) {
              customTextures.add(val);
            }
          }
        }
      }
    });
  }

  return {
    id: fallbackId,
    fileName: file.name,
    root,
    raycastTargets,
    update: ({ dt, paused, explodeProgress }) => {
      if (!paused) {
        root.rotation.y += dt * 0.25;
      }
      loadedGroup.position.y = normalized.position[1] + explodeProgress * 0.35;
    },
    applyFinish: (finish) => {
      fallbackStlMat.color.setHex(finish.primaryHex);
      fallbackStlMat.metalness = finish.metalness;
      fallbackStlMat.roughness = finish.roughness;
      fallbackStlMat.clearcoat = finish.clearcoat;

      if (!isStl) {
        const tint = new THREE.Color(finish.primaryHex);
        baseGltfColors.forEach((baseCol, mat) => {
          mat.color.copy(baseCol).lerp(tint, 0.35);
          mat.metalness = finish.metalness;
          mat.roughness = finish.roughness;
          if (mat instanceof THREE.MeshPhysicalMaterial) {
            mat.clearcoat = finish.clearcoat;
          }
        });
      }
    },
    setHighlightSubsystem: (subsystemId) => {
      const active = subsystemId === 'custom-cad';
      for (const mesh of customMeshes) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && 'emissive' in mat) {
          mat.emissive.setHex(active ? 0x0284c7 : 0x000000);
          mat.emissiveIntensity = active ? 0.25 : 0;
        }
      }
    },
    dispose: () => {
      baseGltfColors.clear();
      disposeObjectTree(root);
      customTextures.forEach((tex) => tex.dispose());
      customTextures.clear();
    },
  };
}
