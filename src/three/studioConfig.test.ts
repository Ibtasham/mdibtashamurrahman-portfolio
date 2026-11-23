import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampExplodeAmount,
  computeExplodedCoordinate,
  computeModelNormalizeTransform,
  dampScalar,
  findSubsystemMeta,
  getAdjacentStudioModel,
  MATERIAL_FINISH_ORDER,
  MATERIAL_FINISHES,
  projectNdcPointToViewport,
  resolveStudioModelId,
  resolveWalkthroughStep,
  STUDIO_MODEL_ORDER,
  STUDIO_MODELS,
} from './studioConfig';

test('studio catalog defines five composite conceptual models with educational metadata and guided tours', () => {
  assert.equal(STUDIO_MODEL_ORDER.length, 5);
  for (const id of STUDIO_MODEL_ORDER) {
    const model = STUDIO_MODELS[id];
    assert.ok(model.subsystems.length >= 4);
    assert.ok(model.conceptualNotice.toLowerCase().includes('conceptual'));
    assert.ok(model.ipeRelevance.length > 40);
    assert.ok(model.ipeDomains.length >= 3);
    assert.equal(model.guidedTour.length, model.subsystems.length);
    for (const sub of model.subsystems) {
      assert.ok(sub.engineeringPurpose.length > 20);
      assert.ok(sub.workingPrinciple.length > 20);
      assert.ok(sub.industrialApplication.length > 20);
      assert.ok(sub.ipeConcepts.length >= 2);
      assert.ok(sub.relatedRecords.length >= 1);
      assert.equal(sub.cameraFocus.position.length, 3);
      assert.equal(sub.cameraFocus.target.length, 3);
    }
    assert.equal(model.cameraPresets.isometric.position.length, 3);
    assert.equal(model.cameraPresets.front.position.length, 3);
    assert.equal(model.cameraPresets.top.position.length, 3);
    assert.equal(model.cameraPresets.closeup.position.length, 3);
  }
});

test('dampScalar converges smoothly toward target without overshoot', () => {
  let value = 0;
  for (let i = 0; i < 60; i++) {
    value = dampScalar(value, 1, 8, 1 / 60);
    assert.ok(value >= 0 && value <= 1);
  }
  assert.ok(value > 0.99);
});

test('clampExplodeAmount and computeExplodedCoordinate stay bounded', () => {
  assert.equal(clampExplodeAmount(-0.4), 0);
  assert.equal(clampExplodeAmount(1.8), 1);
  assert.equal(clampExplodeAmount(Number.NaN), 0);
  assert.equal(computeExplodedCoordinate(1.2, 2.0, 0.5), 2.2);
  assert.equal(computeExplodedCoordinate(-1.0, -1.5, 2), -2.5);
});

test('findSubsystemMeta and resolveStudioModelId map projects and manuscripts cleanly', () => {
  assert.equal(resolveStudioModelId('forgemind-ai'), 'forgemind-turbofan');
  assert.equal(resolveStudioModelId('rul-explainable'), 'forgemind-turbofan');
  assert.equal(resolveStudioModelId('factorymind'), 'factorymind-cell');
  assert.equal(resolveStudioModelId('decision-aware-prognostics'), 'femto-bearing');
  assert.equal(resolveStudioModelId('carbon-aware-jss'), 'carbon-cnc');
  assert.equal(resolveStudioModelId('decision-centric-demand'), 'supply-asrs');
  assert.equal(resolveStudioModelId('unknown'), 'forgemind-turbofan');

  const hpc = findSubsystemMeta('forgemind-turbofan', 'compressor-core');
  assert.ok(hpc?.name.includes('Compressor'));
  const bearing = findSubsystemMeta('femto-bearing', 'bearing-housing');
  assert.ok(bearing?.name.includes('16-Ball'));
  const cnc = findSubsystemMeta('carbon-cnc', 'energy-cabinet');
  assert.ok(cnc?.name.includes('Carbon'));
  assert.equal(findSubsystemMeta('forgemind-turbofan', 'missing'), null);

  assert.equal(MATERIAL_FINISH_ORDER.length, 4);
  assert.ok(MATERIAL_FINISHES.titanium.roughness < MATERIAL_FINISHES.graphite.roughness);
  assert.ok(MATERIAL_FINISHES.bronze.metalness > 0.8);
});

test('getAdjacentStudioModel cycles cleanly across all five models', () => {
  assert.equal(getAdjacentStudioModel('forgemind-turbofan', 'prev'), 'supply-asrs');
  assert.equal(getAdjacentStudioModel('forgemind-turbofan', 'next'), 'factorymind-cell');
  assert.equal(getAdjacentStudioModel('supply-asrs', 'next'), 'forgemind-turbofan');
});

test('resolveWalkthroughStep wraps step indices and links subsystems accurately', () => {
  const step0 = resolveWalkthroughStep('forgemind-turbofan', 0);
  assert.equal(step0.stepIndex, 0);
  assert.equal(step0.subsystem.id, 'spinner-fan');

  const wrappedPrev = resolveWalkthroughStep('forgemind-turbofan', -1);
  assert.equal(wrappedPrev.stepIndex, wrappedPrev.totalSteps - 1);
  assert.equal(wrappedPrev.subsystem.id, 'exhaust-nozzle');
});

test('projectNdcPointToViewport clamps screen pins safely inside safe bounds', () => {
  const center = projectNdcPointToViewport(0, 0, 0.2, 1000, 600);
  assert.equal(center.visible, true);
  assert.equal(center.x, 500);
  assert.equal(center.y, 300);

  const clippedEdge = projectNdcPointToViewport(1.02, -1.02, 0.5, 1000, 600);
  assert.equal(clippedEdge.visible, true);
  assert.ok(clippedEdge.x <= 928);
  assert.ok(clippedEdge.y <= 504);

  const behindCam = projectNdcPointToViewport(0, 0, 1.5, 1000, 600);
  assert.equal(behindCam.visible, false);
});

test('computeModelNormalizeTransform scales custom CAD meshes and grounds minY at 0', () => {
  const result = computeModelNormalizeTransform(
    { x: 6.4, y: 3.2, z: 1.6 },
    { x: 2.0, y: 1.6, z: -0.5 },
    0.0,
    3.2,
  );
  assert.equal(result.scale, 0.5);
  assert.deepEqual(result.position, [-1.0, 0, 0.25]);
});
