import SpecDecodeViz from './viz/SpecDecodeViz';
import ModelOptimization from './ModelOptimization';
import SpeculativeDecoding from './SpeculativeDecoding';
import DistributedInference from './DistributedInference';
import { CodeViewButton } from '@/components/code';
import CodeSidebar from './CodeSidebar';
import { servingArchRefs } from './codeRefs';
import { sharedCodeRefs } from './sharedCodeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ServingArchitecture({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="serving-architecture" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">서빙 아키텍처 & 최적화</h2>
        <div className="flex gap-2">
          <CodeViewButton onClick={() => onCodeRef('api-server', sharedCodeRefs['api-server'])} />
          <CodeSidebar refs={servingArchRefs} />
        </div>
      </div>
      <div className="not-prose mb-8"><SpecDecodeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ModelOptimization />
        <SpeculativeDecoding />
        <DistributedInference />
      </div>
    </section>
  );
}
