import SealingPipelineViz from './viz/SealingPipelineViz';
import ProofArchViz from './viz/ProofArchViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ title, onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 증명 유형'}</h2>
      <div className="not-prose mb-8">
        <SealingPipelineViz onOpenCode={onCodeRef
          ? (key) => onCodeRef(key, codeRefs[key]) : undefined} />
      </div>
      <div className="not-prose mb-8"><ProofArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin 저장 증명 — <strong>PoRep</strong>(복제 증명)과
          <strong> PoSt</strong>(시공간 증명)
          <br />
          PoRep: 섹터를 물리적으로 저장했음을 증명
          <br />
          PoSt: 시간 경과 후에도 계속 저장 중임을 증명
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('seal-pc1', codeRefs['seal-pc1'])} />
            <span className="text-[10px] text-muted-foreground self-center">seal.rs — PC1</span>
            <CodeViewButton onClick={() => onCodeRef('stacked-graph', codeRefs['stacked-graph'])} />
            <span className="text-[10px] text-muted-foreground self-center">graph.rs</span>
          </div>
        )}
      </div>
    </section>
  );
}
