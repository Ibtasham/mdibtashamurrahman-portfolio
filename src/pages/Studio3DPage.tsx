import { useSearchParams } from 'react-router-dom';
import { IndustrialStudioViewport } from '../components/three/IndustrialStudioViewport';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { resolveStudioModelId } from '../three/studioConfig';

export function Studio3DPage() {
  const [searchParams] = useSearchParams();
  const initialModel = resolveStudioModelId(searchParams.get('model'));

  usePageMetadata({
    title: 'Interactive 3D Engineering Studio',
    description:
      'Inspect interactive 3D turbofan, manufacturing cell, bearing, CNC, and AS/RS assemblies or load custom GLB/GLTF/STL CAD files.',
    path: '/studio',
    schemaType: 'WebApplication',
    schemaExtra: {
      applicationCategory: 'EngineeringApplication',
      operatingSystem: 'Any WebGL-capable browser',
    },
  });

  return (
    <section
      aria-label="Interactive 3D Engineering Studio"
      className="h-screen w-screen overflow-hidden bg-wood-canvas dark:bg-[#050914]"
    >
      <IndustrialStudioViewport mode="fullscreen" initialModel={initialModel} />
    </section>
  );
}
