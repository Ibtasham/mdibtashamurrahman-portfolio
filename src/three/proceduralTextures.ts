import * as THREE from 'three';

export interface ProceduralTextureBundle {
  brushedRoughness: THREE.CanvasTexture;
  brushedBump: THREE.CanvasTexture;
  plinthGridDark: THREE.CanvasTexture;
  plinthGridLight: THREE.CanvasTexture;
  spinnerSpiral: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  gaugeDial: THREE.CanvasTexture;
  telemetryScreen: THREE.CanvasTexture;
  dispose: () => void;
}

function createBrushedMetalTexture(
  contrast: number,
  anisotropy: number,
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y++) {
      const wave = Math.sin(y * 0.45) * 10 + Math.cos(y * 1.9) * 8;
      const hash = ((y * 73) % 37) - 18;
      const val = Math.max(
        60,
        Math.min(235, Math.round(158 + (wave + hash) * contrast)),
      );
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.fillRect(0, y, size, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = anisotropy;
  return tex;
}

function createPlinthGridTexture(
  darkMode: boolean,
  anisotropy: number,
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = darkMode ? '#091122' : '#e2e8f0';
    ctx.fillRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;

    const grad = ctx.createRadialGradient(cx, cy, 18, cx, cy, size * 0.49);
    if (darkMode) {
      grad.addColorStop(0, '#13203b');
      grad.addColorStop(0.7, '#0b1426');
      grad.addColorStop(1, '#070d1a');
    } else {
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(0.75, '#e2e8f0');
      grad.addColorStop(1, '#cbd5e1');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = darkMode
      ? 'rgba(56, 189, 248, 0.14)'
      : 'rgba(37, 99, 235, 0.12)';
    ctx.lineWidth = 1;
    const step = 32;
    for (let i = 0; i <= size; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    const radii = [92, 168, 224, 240];
    for (let idx = 0; idx < radii.length; idx++) {
      ctx.beginPath();
      ctx.arc(cx, cy, radii[idx], 0, Math.PI * 2);
      ctx.strokeStyle =
        idx === radii.length - 1
          ? darkMode
            ? 'rgba(34, 211, 238, 0.46)'
            : 'rgba(37, 99, 235, 0.38)'
          : darkMode
            ? 'rgba(148, 163, 184, 0.24)'
            : 'rgba(51, 65, 85, 0.22)';
      ctx.lineWidth = idx === radii.length - 1 ? 2.5 : 1.2;
      ctx.stroke();
    }

    ctx.strokeStyle = darkMode
      ? 'rgba(34, 211, 238, 0.38)'
      : 'rgba(37, 99, 235, 0.32)';
    ctx.lineWidth = 1.5;
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 45 === 0 ? 214 : deg % 15 === 0 ? 226 : 233;
      const outer = 240;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * inner, cy + Math.sin(rad) * inner);
      ctx.lineTo(cx + Math.cos(rad) * outer, cy + Math.sin(rad) * outer);
      ctx.stroke();
    }

    // Crisp cardinal degree numerals etched along the outer vernier ring
    ctx.fillStyle = darkMode
      ? 'rgba(125, 211, 252, 0.72)'
      : 'rgba(30, 64, 175, 0.72)';
    ctx.font = '600 13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labels: Array<[number, string]> = [
      [0, '090°'],
      [Math.PI / 2, '180°'],
      [Math.PI, '270°'],
      [(Math.PI * 3) / 2, '000°'],
    ];
    for (const [ang, text] of labels) {
      ctx.fillText(text, cx + Math.cos(ang) * 196, cy + Math.sin(ang) * 196);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

function createSpinnerSpiralTexture(anisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const y = i * 44;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y + 72);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = anisotropy;
  return tex;
}

function createGaugeDialTexture(anisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(cx, cy, 114, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Nominal cyan & load warning amber arcs
    ctx.beginPath();
    ctx.arc(cx, cy, 88, Math.PI * 0.75, Math.PI * 1.85);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 88, Math.PI * 1.85, Math.PI * 2.25);
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 10;
    ctx.stroke();

    for (let i = 0; i <= 10; i++) {
      const angle = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 72, cy + Math.sin(angle) * 72);
      ctx.lineTo(cx + Math.cos(angle) * 100, cy + Math.sin(angle) * 100);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = i % 2 === 0 ? 4 : 2;
      ctx.stroke();
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('kN · LOAD', cx, cy + 56);

    // Indicator needle
    const needleAngle = Math.PI * 1.62;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(needleAngle) * 82, cy + Math.sin(needleAngle) * 82);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

function createTelemetryScreenTexture(anisotropy: number): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#040a17';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.16)';
    ctx.lineWidth = 1;
    for (let x = 24; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }
    for (let y = 24; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Dual-trace telemetry curve (vibration / tariff & carbon envelope)
    ctx.beginPath();
    for (let x = 24; x <= width - 24; x += 6) {
      const t = (x - 24) / (width - 48);
      const y =
        128 -
        Math.sin(t * Math.PI * 6) * (28 + t * 32) -
        Math.cos(t * Math.PI * 14) * 12;
      if (x === 24) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    for (let x = 24; x <= width - 24; x += 6) {
      const t = (x - 24) / (width - 48);
      const y = 168 - Math.cos(t * Math.PI * 3.5) * 34;
      if (x === 24) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('SYSTEM TELEMETRY · LIVE ENVELOPE', 26, 36);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, cx);
    grad.addColorStop(0, 'rgba(2, 6, 23, 0.85)');
    grad.addColorStop(0.5, 'rgba(2, 6, 23, 0.42)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export function createProceduralTextureBundle(
  maxAnisotropy: number,
): ProceduralTextureBundle {
  const anisotropy = Math.max(1, Math.min(maxAnisotropy, 8));
  const brushedRoughness = createBrushedMetalTexture(0.9, anisotropy);
  const brushedBump = createBrushedMetalTexture(1.3, anisotropy);
  const plinthGridDark = createPlinthGridTexture(true, anisotropy);
  const plinthGridLight = createPlinthGridTexture(false, anisotropy);
  const spinnerSpiral = createSpinnerSpiralTexture(anisotropy);
  const contactShadow = createContactShadowTexture();
  const gaugeDial = createGaugeDialTexture(anisotropy);
  const telemetryScreen = createTelemetryScreenTexture(anisotropy);

  return {
    brushedRoughness,
    brushedBump,
    plinthGridDark,
    plinthGridLight,
    spinnerSpiral,
    contactShadow,
    gaugeDial,
    telemetryScreen,
    dispose: () => {
      brushedRoughness.dispose();
      brushedBump.dispose();
      plinthGridDark.dispose();
      plinthGridLight.dispose();
      spinnerSpiral.dispose();
      contactShadow.dispose();
      gaugeDial.dispose();
      telemetryScreen.dispose();
    },
  };
}
