import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { buildAsrsModel } from './models/buildAsrsModel';
import { buildBearingRigModel } from './models/buildBearingRigModel';
import { buildCncCellModel } from './models/buildCncCellModel';
import { buildCustomModelFromFile } from './models/buildCustomModel';
import { buildFactoryCellModel } from './models/buildFactoryCellModel';
import { buildTurbofanModel } from './models/buildTurbofanModel';
import type { StudioAssembly } from './models/types';
import {
  createProceduralTextureBundle,
  type ProceduralTextureBundle,
} from './proceduralTextures';
import {
  clampExplodeAmount,
  dampScalar,
  MATERIAL_FINISHES,
  projectNdcPointToViewport,
  STUDIO_MODELS,
  type CameraPose,
  type CameraPresetId,
  type LightingPresetId,
  type MaterialFinishId,
  type StudioModelId,
} from './studioConfig';

export interface ProjectedAnnotation {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface EngineCallbacks {
  onSelectSubsystem: (subsystemId: string | null) => void;
  onWebglError: (message: string) => void;
  onAnnotationsUpdate?: (annotations: ProjectedAnnotation[]) => void;
}

export interface EngineInitOptions {
  container: HTMLElement;
  initialModel: StudioModelId;
  initialFinish: MaterialFinishId;
  initialLighting: LightingPresetId;
  initialTheme: 'dark' | 'light';
  initialExplode: number;
  initialPaused: boolean;
  callbacks: EngineCallbacks;
}

const _mouse = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _boltMat4 = new THREE.Matrix4();
const _boltQuat = new THREE.Quaternion();
const _boltPos = new THREE.Vector3();
const _boltScale = new THREE.Vector3(1, 1, 1);
const _anchorWorld = new THREE.Vector3();
const _anchorNdc = new THREE.Vector3();
const _zoomDir = new THREE.Vector3();
_raycaster.layers.set(1);

function detectSoftwareWebGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export class ThreeStudioEngine {
  private readonly container: HTMLElement;
  private readonly isSoftwareGl: boolean;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly textures: ProceduralTextureBundle;
  private readonly envTarget: THREE.WebGLRenderTarget;
  private readonly callbacks: EngineCallbacks;

  private readonly keyLight: THREE.DirectionalLight;
  private readonly hemiLight: THREE.HemisphereLight;
  private readonly rimLight: THREE.DirectionalLight;
  private readonly softboxLeft: THREE.RectAreaLight | null = null;
  private readonly softboxRight: THREE.RectAreaLight | null = null;

  private readonly turntableGroup: THREE.Group;
  private readonly plinthMesh: THREE.Mesh;
  private readonly plinthMat: THREE.MeshStandardMaterial;
  private readonly plinthRimMesh: THREE.Mesh;
  private readonly plinthRimMat: THREE.MeshPhysicalMaterial;
  private readonly plinthBoltsMesh: THREE.InstancedMesh;
  private readonly plinthGridMesh: THREE.Mesh;
  private readonly plinthGridMat: THREE.MeshBasicMaterial;
  private readonly contactShadowMesh: THREE.Mesh;
  private readonly contactShadowMat: THREE.MeshBasicMaterial;

  private activeAssembly: StudioAssembly;
  private activeModelId: StudioModelId;
  private activeFinishId: MaterialFinishId;
  private activeLightingId: LightingPresetId;
  private activeTheme: 'dark' | 'light';

  private targetExplode = 0;
  private currentExplode = 0;
  private paused = false;
  private turntableSpin = false;
  private customModelActive = false;
  private inViewport = true;
  private documentVisible = true;
  private annotationsEnabled = false;
  private lastAnnotationEmitMs = 0;
  private disposed = false;

  private camGoalPos: [number, number, number] | null = null;
  private camGoalTarget: [number, number, number] | null = null;

  private frameId = 0;
  private lastTickMs = performance.now();
  private elapsedSeconds = 0;
  private lastHoverMs = 0;
  private pointerDownPos = { x: 0, y: 0 };

  private renderBusy = false;
  private renderDirty = false;
  private lastWidth = 0;
  private lastHeight = 0;
  private resizeObserver: ResizeObserver;

  constructor(options: EngineInitOptions) {
    this.container = options.container;
    this.callbacks = options.callbacks;
    this.activeModelId = options.initialModel;
    this.activeFinishId = options.initialFinish;
    this.activeLightingId = options.initialLighting;
    this.activeTheme = options.initialTheme;
    this.targetExplode = clampExplodeAmount(options.initialExplode);
    this.currentExplode = this.targetExplode;
    this.paused = options.initialPaused;

    this.isSoftwareGl = detectSoftwareWebGl();

    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: !this.isSoftwareGl,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
    } catch {
      throw new Error('WebGL context could not be initialized on this browser.');
    }

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.lastWidth = width;
    this.lastHeight = height;
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.touchAction = 'none';
    this.renderer.domElement.setAttribute('data-testid', 'studio-3d-canvas');
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const roomEnv = new RoomEnvironment();
    this.envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    this.scene.environment = this.envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.fov = width < height ? Math.min(60, 42 + ((height / width) - 1) * 14) : 42;
    this.camera.updateProjectionMatrix();
    const initialPose = STUDIO_MODELS[this.activeModelId].cameraPresets.isometric;
    this.camera.position.set(...initialPose.position);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(...initialPose.target);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.4;
    this.controls.maxDistance = 14.5;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.enablePan = true;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    this.controls.update();

    this.controls.addEventListener('start', () => {
      this.camGoalPos = null;
      this.camGoalTarget = null;
    });
    this.controls.addEventListener('change', () => {
      this.emitAnnotationsIfDue(true);
      if (this.paused || !this.isRenderingActive()) {
        this.requestRender();
      }
    });

    this.textures = createProceduralTextureBundle(
      this.renderer.capabilities.getMaxAnisotropy(),
    );

    // 3-Point Studio Lighting Rig
    this.keyLight = new THREE.DirectionalLight(0xfff1dc, 2.3);
    this.keyLight.position.set(5.5, 8.0, 5.2);
    this.keyLight.castShadow = !this.isSoftwareGl;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 24;
    this.keyLight.shadow.camera.left = -4.5;
    this.keyLight.shadow.camera.right = 4.5;
    this.keyLight.shadow.camera.top = 4.5;
    this.keyLight.shadow.camera.bottom = -4.5;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.normalBias = 0.02;
    this.scene.add(this.keyLight);

    this.hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e293b, 0.85);
    this.scene.add(this.hemiLight);

    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
    this.rimLight.position.set(-5.0, 4.2, -5.5);
    this.scene.add(this.rimLight);

    if (!this.isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      this.softboxLeft = new THREE.RectAreaLight(0xe0f2fe, 2.2, 4.5, 2.4);
      this.softboxLeft.position.set(-4.5, 3.6, 2.4);
      this.softboxLeft.lookAt(0, 1.3, 0);
      this.scene.add(this.softboxLeft);

      this.softboxRight = new THREE.RectAreaLight(0xfff7ed, 2.0, 4.0, 2.2);
      this.softboxRight.position.set(4.5, 3.2, -2.0);
      this.softboxRight.lookAt(0, 1.3, 0);
      this.scene.add(this.softboxRight);
    }

    // Machined Multi-Part Rotary Engineering Plinth + Rim + 24 Perimeter Bolts
    this.turntableGroup = new THREE.Group();
    this.scene.add(this.turntableGroup);

    this.plinthMat = new THREE.MeshStandardMaterial({
      color: 0x0b1325,
      metalness: 0.45,
      roughness: 0.55,
    });
    const plinthGeo = new THREE.CylinderGeometry(3.6, 3.82, 0.18, 64);
    this.plinthMesh = new THREE.Mesh(plinthGeo, this.plinthMat);
    this.plinthMesh.position.y = -0.09;
    this.plinthMesh.receiveShadow = true;
    this.turntableGroup.add(this.plinthMesh);

    this.plinthRimMat = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.22,
      clearcoat: 0.25,
    });
    const rimGeo = new THREE.TorusGeometry(3.58, 0.042, 12, 64);
    rimGeo.rotateX(Math.PI / 2);
    this.plinthRimMesh = new THREE.Mesh(rimGeo, this.plinthRimMat);
    this.plinthRimMesh.position.y = -0.005;
    this.turntableGroup.add(this.plinthRimMesh);

    const plinthBoltGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.03, 6);
    this.plinthBoltsMesh = new THREE.InstancedMesh(
      plinthBoltGeo,
      this.plinthRimMat,
      24,
    );
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      _boltPos.set(Math.cos(ang) * 3.69, 0.006, Math.sin(ang) * 3.69);
      _boltQuat.identity();
      _boltMat4.compose(_boltPos, _boltQuat, _boltScale);
      this.plinthBoltsMesh.setMatrixAt(i, _boltMat4);
    }
    this.plinthBoltsMesh.instanceMatrix.needsUpdate = true;
    this.plinthBoltsMesh.computeBoundingSphere();
    this.turntableGroup.add(this.plinthBoltsMesh);

    this.plinthGridMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: this.textures.plinthGridDark,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const gridGeo = new THREE.CircleGeometry(3.52, 64);
    gridGeo.rotateX(-Math.PI / 2);
    this.plinthGridMesh = new THREE.Mesh(gridGeo, this.plinthGridMat);
    this.plinthGridMesh.position.y = 0.002;
    this.turntableGroup.add(this.plinthGridMesh);

    this.contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: this.textures.contactShadow,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const shadowGeo = new THREE.CircleGeometry(2.75, 48);
    shadowGeo.rotateX(-Math.PI / 2);
    this.contactShadowMesh = new THREE.Mesh(shadowGeo, this.contactShadowMat);
    this.contactShadowMesh.position.y = 0.015;
    this.turntableGroup.add(this.contactShadowMesh);

    this.activeAssembly = this.instantiateModel(this.activeModelId);
    this.turntableGroup.add(this.activeAssembly.root);

    this.applyAtmosphereAndLighting();

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bindEvents();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    this.startOrRequestFrame();
  }

  private instantiateModel(modelId: StudioModelId): StudioAssembly {
    const finish = MATERIAL_FINISHES[this.activeFinishId];
    switch (modelId) {
      case 'factorymind-cell':
        return buildFactoryCellModel(this.textures, finish);
      case 'femto-bearing':
        return buildBearingRigModel(this.textures, finish);
      case 'carbon-cnc':
        return buildCncCellModel(this.textures, finish, this.isSoftwareGl);
      case 'supply-asrs':
        return buildAsrsModel(this.textures, finish);
      case 'forgemind-turbofan':
      default:
        return buildTurbofanModel(this.textures, finish);
    }
  }

  private applyAtmosphereAndLighting(): void {
    const isDaylight =
      this.activeLightingId === 'daylight' ||
      (this.activeTheme === 'light' && this.activeLightingId !== 'dark-lab');
    const isThermal = this.activeLightingId === 'thermal';

    const bgHex = isDaylight ? 0xeef2f6 : 0x050914;
    this.scene.background = new THREE.Color(bgHex);
    this.scene.fog = new THREE.FogExp2(bgHex, 0.032);

    this.plinthGridMat.map = isDaylight
      ? this.textures.plinthGridLight
      : this.textures.plinthGridDark;
    this.plinthGridMat.needsUpdate = true;
    this.plinthMat.color.setHex(isDaylight ? 0xcbd5e1 : 0x0b1325);
    this.contactShadowMat.opacity = isDaylight ? 0.28 : 0.45;

    if (isThermal) {
      this.keyLight.color.setHex(0xffedd5);
      this.keyLight.intensity = 1.65;
      this.hemiLight.color.setHex(0x38bdf8);
      this.hemiLight.groundColor.setHex(0x451a03);
      this.hemiLight.intensity = 0.65;
      this.rimLight.color.setHex(0xf97316);
      this.rimLight.intensity = 1.85;
    } else if (isDaylight) {
      this.keyLight.color.setHex(0xfffbeb);
      this.keyLight.intensity = 2.6;
      this.hemiLight.color.setHex(0xe0f2fe);
      this.hemiLight.groundColor.setHex(0x94a3b8);
      this.hemiLight.intensity = 1.1;
      this.rimLight.color.setHex(0x60a5fa);
      this.rimLight.intensity = 1.1;
    } else {
      this.keyLight.color.setHex(0xfff1dc);
      this.keyLight.intensity = 2.35;
      this.hemiLight.color.setHex(0xbae6fd);
      this.hemiLight.groundColor.setHex(0x1e293b);
      this.hemiLight.intensity = 0.85;
      this.rimLight.color.setHex(0x38bdf8);
      this.rimLight.intensity = 1.45;
    }
  }

  public setModel(modelId: StudioModelId): void {
    if (modelId === this.activeModelId && !this.customModelActive) return;
    this.turntableGroup.remove(this.activeAssembly.root);
    this.activeAssembly.dispose();
    this.customModelActive = false;
    this.activeModelId = modelId;
    this.activeAssembly = this.instantiateModel(modelId);
    this.turntableGroup.add(this.activeAssembly.root);
    this.turntableGroup.rotation.y = 0;
    this.setCameraPreset('isometric');
    this.callbacks.onSelectSubsystem(null);
    this.requestRender();
  }

  public async loadCustomModelFile(file: File): Promise<string> {
    const finish = MATERIAL_FINISHES[this.activeFinishId];
    const customAssembly = await buildCustomModelFromFile(
      file,
      this.activeModelId,
      this.textures,
      finish,
    );
    if (this.disposed) {
      customAssembly.dispose();
      return file.name;
    }
    this.turntableGroup.remove(this.activeAssembly.root);
    this.activeAssembly.dispose();
    this.activeAssembly = customAssembly;
    this.customModelActive = true;
    this.turntableGroup.add(this.activeAssembly.root);
    this.turntableGroup.rotation.y = 0;
    this.camGoalPos = [4.8, 3.0, 4.8];
    this.camGoalTarget = [0, 1.1, 0];
    this.callbacks.onSelectSubsystem(null);
    this.requestRender();
    return customAssembly.fileName;
  }

  public clearCustomModel(): void {
    if (!this.customModelActive) return;
    this.setModel(this.activeModelId);
  }

  public setTurntableSpin(enabled: boolean): void {
    this.turntableSpin = enabled;
    this.requestRender();
  }

  public setFinish(finishId: MaterialFinishId): void {
    this.activeFinishId = finishId;
    this.activeAssembly.applyFinish(MATERIAL_FINISHES[finishId]);
    this.requestRender();
  }

  public setLightingAndTheme(
    lightingId: LightingPresetId,
    theme: 'dark' | 'light',
  ): void {
    this.activeLightingId = lightingId;
    this.activeTheme = theme;
    this.applyAtmosphereAndLighting();
    this.requestRender();
  }

  public setExplode(amount: number): void {
    this.targetExplode = clampExplodeAmount(amount);
    this.requestRender();
  }

  public setPaused(paused: boolean): void {
    if (this.paused === paused) return;
    this.paused = paused;
    this.cancelScheduledFrame();
    this.lastTickMs = performance.now();
    this.startOrRequestFrame();
  }

  public setInViewport(visible: boolean): void {
    if (this.inViewport === visible) return;
    this.inViewport = visible;
    this.cancelScheduledFrame();
    if (this.isRenderingActive()) {
      this.lastTickMs = performance.now();
      this.startOrRequestFrame();
    }
  }

  public setAnnotationsEnabled(enabled: boolean): void {
    if (this.annotationsEnabled === enabled) return;
    this.annotationsEnabled = enabled;
    if (enabled) {
      this.emitAnnotationsIfDue(true);
    } else {
      this.callbacks.onAnnotationsUpdate?.([]);
    }
  }

  public setSelectedSubsystem(subsystemId: string | null): void {
    this.activeAssembly.setHighlightSubsystem(subsystemId);
    this.requestRender();
  }

  public focusCameraPose(pose: CameraPose): void {
    this.camGoalPos = [...pose.position];
    this.camGoalTarget = [...pose.target];
    this.requestRender();
  }

  public zoomByFactor(factor: number): void {
    const target = this.camGoalTarget
      ? new THREE.Vector3(...this.camGoalTarget)
      : this.controls.target.clone();
    const currentPos = this.camGoalPos
      ? new THREE.Vector3(...this.camGoalPos)
      : this.camera.position.clone();
    _zoomDir.copy(currentPos).sub(target);
    const currentDist = Math.max(0.1, _zoomDir.length());
    const nextDist = Math.max(
      this.controls.minDistance,
      Math.min(this.controls.maxDistance, currentDist * factor),
    );
    _zoomDir.normalize().multiplyScalar(nextDist).add(target);
    this.camGoalPos = [_zoomDir.x, _zoomDir.y, _zoomDir.z];
    this.camGoalTarget = [target.x, target.y, target.z];
    this.requestRender();
  }

  public setCameraPreset(preset: CameraPresetId): void {
    const pose = STUDIO_MODELS[this.activeModelId].cameraPresets[preset];
    this.focusCameraPose(pose);
  }

  public capturePngDataUrl(): string | null {
    if (this.disposed) return null;
    this.renderer.render(this.scene, this.camera);
    try {
      return this.renderer.domElement.toDataURL('image/png');
    } catch {
      return null;
    }
  }

  public handleResize(): void {
    if (this.disposed) return;
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    if (width === this.lastWidth && height === this.lastHeight) return;
    this.lastWidth = width;
    this.lastHeight = height;
    this.camera.aspect = width / height;
    this.camera.fov = width < height ? Math.min(60, 42 + ((height / width) - 1) * 14) : 42;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    if (!this.paused && this.isRenderingActive()) {
      this.cancelScheduledFrame();
      this.lastTickMs = performance.now();
      this.frameId = requestAnimationFrame(this.tick);
    } else {
      this.requestRender();
    }
    this.emitAnnotationsIfDue(true);
  }

  private bindEvents(): void {
    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', this.onPointerDown);
    dom.addEventListener('pointerup', this.onPointerUp);
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('webglcontextlost', this.onContextLost);
    dom.addEventListener('webglcontextrestored', this.onContextRestored);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private readonly onVisibilityChange = () => {
    this.documentVisible = !document.hidden;
    this.cancelScheduledFrame();
    if (this.isRenderingActive()) {
      this.lastTickMs = performance.now();
      this.startOrRequestFrame();
    }
  };

  private isRenderingActive(): boolean {
    return this.inViewport && this.documentVisible && !this.disposed;
  }

  private emitAnnotationsIfDue(force = false): void {
    if (!this.annotationsEnabled || !this.callbacks.onAnnotationsUpdate || this.disposed) {
      return;
    }
    const anchors = this.activeAssembly.subsystemAnchors;
    if (!anchors || anchors.length === 0 || this.customModelActive) {
      if (force) {
        this.callbacks.onAnnotationsUpdate([]);
      }
      return;
    }
    const now = performance.now();
    if (!force && now - this.lastAnnotationEmitMs < 75) {
      return;
    }
    this.lastAnnotationEmitMs = now;
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld();

    const projected: ProjectedAnnotation[] = [];
    for (const anchor of anchors) {
      _anchorWorld.set(...anchor.localOffset);
      anchor.object.localToWorld(_anchorWorld);
      _anchorNdc.copy(_anchorWorld).project(this.camera);
      const screen = projectNdcPointToViewport(
        _anchorNdc.x,
        _anchorNdc.y,
        _anchorNdc.z,
        this.lastWidth,
        this.lastHeight,
      );
      projected.push({
        id: anchor.id,
        x: screen.x,
        y: screen.y,
        visible: screen.visible,
      });
    }
    this.callbacks.onAnnotationsUpdate(projected);
  }

  private readonly onContextLost = (e: Event) => {
    e.preventDefault();
    this.cancelScheduledFrame();
    this.callbacks.onWebglError(
      'WebGL rendering context paused by the browser GPU driver.',
    );
  };

  private readonly onContextRestored = () => {
    this.callbacks.onWebglError('');
    this.lastTickMs = performance.now();
    this.startOrRequestFrame();
  };

  private readonly onPointerDown = (e: PointerEvent) => {
    this.pointerDownPos.x = e.clientX;
    this.pointerDownPos.y = e.clientY;
  };

  private readonly onPointerUp = (e: PointerEvent) => {
    const dx = e.clientX - this.pointerDownPos.x;
    const dy = e.clientY - this.pointerDownPos.y;
    if (dx * dx + dy * dy > 36) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    _raycaster.setFromCamera(_mouse, this.camera);
    const hits = _raycaster.intersectObjects(
      this.activeAssembly.raycastTargets,
      false,
    );
    const hitId =
      hits.length > 0
        ? ((hits[0].object.userData.subsystemId as string | undefined) ?? null)
        : null;
    this.activeAssembly.setHighlightSubsystem(hitId);
    this.callbacks.onSelectSubsystem(hitId);
    this.requestRender();
  };

  private readonly onPointerMove = (e: PointerEvent) => {
    const now = performance.now();
    if (now - this.lastHoverMs < 60) return;
    this.lastHoverMs = now;

    const rect = this.renderer.domElement.getBoundingClientRect();
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    _raycaster.setFromCamera(_mouse, this.camera);
    const hits = _raycaster.intersectObjects(
      this.activeAssembly.raycastTargets,
      false,
    );
    this.renderer.domElement.style.cursor =
      hits.length > 0 ? 'pointer' : 'grab';
  };

  private stepSimulation(dt: number): boolean {
    if (!this.paused) {
      this.elapsedSeconds += dt;
    }

    const prevExplode = this.currentExplode;
    this.currentExplode = dampScalar(
      this.currentExplode,
      this.targetExplode,
      8.5,
      dt,
    );
    const explodeMoving = Math.abs(this.currentExplode - this.targetExplode) > 0.001 ||
      Math.abs(this.currentExplode - prevExplode) > 0.0005;

    let cameraMoving = false;
    if (this.camGoalPos && this.camGoalTarget) {
      this.camera.position.x = dampScalar(this.camera.position.x, this.camGoalPos[0], 7.0, dt);
      this.camera.position.y = dampScalar(this.camera.position.y, this.camGoalPos[1], 7.0, dt);
      this.camera.position.z = dampScalar(this.camera.position.z, this.camGoalPos[2], 7.0, dt);

      this.controls.target.x = dampScalar(this.controls.target.x, this.camGoalTarget[0], 7.0, dt);
      this.controls.target.y = dampScalar(this.controls.target.y, this.camGoalTarget[1], 7.0, dt);
      this.controls.target.z = dampScalar(this.controls.target.z, this.camGoalTarget[2], 7.0, dt);

      const distSq =
        (this.camera.position.x - this.camGoalPos[0]) ** 2 +
        (this.camera.position.y - this.camGoalPos[1]) ** 2 +
        (this.camera.position.z - this.camGoalPos[2]) ** 2;
      if (distSq < 0.0012) {
        this.camera.position.set(...this.camGoalPos);
        this.controls.target.set(...this.camGoalTarget);
        this.camGoalPos = null;
        this.camGoalTarget = null;
      } else {
        cameraMoving = true;
      }
    }

    if (!this.paused && this.turntableSpin) {
      this.turntableGroup.rotation.y += dt * 0.28;
    }

    this.activeAssembly.update({
      dt,
      elapsed: this.elapsedSeconds,
      explodeProgress: this.currentExplode,
      thermalMode: this.activeLightingId === 'thermal',
      paused: this.paused,
    });

    this.controls.update();
    this.emitAnnotationsIfDue(false);
    return explodeMoving || cameraMoving;
  }

  private afterDraw(cb: () => void): void {
    if (this.disposed) return;
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private readonly tick = () => {
    if (this.disposed || this.paused || !this.isRenderingActive()) return;
    const now = performance.now();
    const dt = Math.max(0.001, Math.min((now - this.lastTickMs) / 1000, 0.1));
    this.lastTickMs = now;

    this.stepSimulation(dt);
    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  public requestRender(): void {
    if (this.disposed || !this.isRenderingActive()) return;
    if (!this.paused) return;

    if (this.renderBusy) {
      this.renderDirty = true;
      return;
    }
    this.renderBusy = true;
    this.frameId = requestAnimationFrame(() => {
      if (this.disposed) return;
      this.renderDirty = false;
      const now = performance.now();
      const dt = Math.max(0.008, Math.min((now - this.lastTickMs) / 1000, 0.1));
      this.lastTickMs = now;
      const keepGoing = this.stepSimulation(dt);
      this.renderer.render(this.scene, this.camera);
      this.emitAnnotationsIfDue(true);
      const done = () => {
        this.renderBusy = false;
        if ((this.renderDirty || keepGoing) && this.paused && this.isRenderingActive()) {
          this.requestRender();
        }
      };
      if (this.isSoftwareGl) {
        this.afterDraw(done);
      } else {
        done();
      }
    });
  }

  private startOrRequestFrame(): void {
    if (this.disposed || !this.isRenderingActive()) return;
    if (this.paused) {
      this.stepSimulation(0.016);
      this.renderer.render(this.scene, this.camera);
      this.emitAnnotationsIfDue(true);
      this.requestRender();
      return;
    }
    this.frameId = requestAnimationFrame(this.tick);
  }

  private cancelScheduledFrame(): void {
    cancelAnimationFrame(this.frameId);
    window.clearTimeout(this.frameId);
    this.renderBusy = false;
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cancelScheduledFrame();
    this.resizeObserver.disconnect();

    const dom = this.renderer.domElement;
    dom.removeEventListener('pointerdown', this.onPointerDown);
    dom.removeEventListener('pointerup', this.onPointerUp);
    dom.removeEventListener('pointermove', this.onPointerMove);
    dom.removeEventListener('webglcontextlost', this.onContextLost);
    dom.removeEventListener('webglcontextrestored', this.onContextRestored);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    this.controls.dispose();
    this.activeAssembly.dispose();
    this.plinthMesh.geometry.dispose();
    this.plinthMat.dispose();
    this.plinthRimMesh.geometry.dispose();
    this.plinthRimMat.dispose();
    this.plinthBoltsMesh.geometry.dispose();
    this.plinthGridMesh.geometry.dispose();
    this.plinthGridMat.dispose();
    this.contactShadowMesh.geometry.dispose();
    this.contactShadowMat.dispose();
    this.textures.dispose();
    this.envTarget.dispose();
    this.renderer.dispose();

    if (dom.parentNode === this.container) {
      this.container.removeChild(dom);
    }
  }
}
