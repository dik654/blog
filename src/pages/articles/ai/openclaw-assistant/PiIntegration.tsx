import PiSDKLayerViz from './viz/PiSDKLayerViz';
import PiSDKStructure from './PiSDKStructure';
import EmbeddedAgent from './EmbeddedAgent';
import MultiProvider from './MultiProvider';
import CustomTools from './CustomTools';
import type { CodeRef } from '@/components/code/types';

export default function PiIntegration({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pi-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pi SDK 통합 & 에이전트 세션</h2>
      <div className="not-prose mb-8"><PiSDKLayerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <PiSDKStructure onCodeRef={onCodeRef} />
        <EmbeddedAgent onCodeRef={onCodeRef} />
        <MultiProvider onCodeRef={onCodeRef} />
        <CustomTools />
      </div>
    </section>
  );
}
