import NIFSFoldingViz from '../components/NIFSFoldingViz';
import NIFSArchViz from './viz/NIFSArchViz';
import CodePanel from '@/components/ui/code-panel';
import { NIFS_PROVE_CODE, PROVE_STEP_CODE } from './NIFSData';
import { nifsAnnotations, proveStepAnnotations } from './NIFSAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function NIFS({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="nifs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'NIFS & prove_step (실제 구현)'}</h2>
      <div className="not-prose mb-8"><NIFSFoldingViz /></div>
      <div className="not-prose mb-8"><NIFSArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>NIFS::prove</code>는 교차항 T를 계산하고 커밋하여 단일 도전값으로
          두 R1CS 인스턴스를 폴딩합니다. <code>RecursiveSNARK::prove_step</code>은
          이중 곡선(E1/E2) 방식으로 보조 회로를 통해 주 회로를 검증합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nova-nifs-prove', codeRefs['nova-nifs-prove'])} />
            <span className="text-[10px] text-muted-foreground self-center">nifs.rs</span>
            <CodeViewButton onClick={() => onCodeRef('nova-prove-step', codeRefs['nova-prove-step'])} />
            <span className="text-[10px] text-muted-foreground self-center">nova/mod.rs</span>
          </div>
        )}
        <CodePanel title="NIFS::prove (nova/nifs.rs)" code={NIFS_PROVE_CODE} annotations={nifsAnnotations} />
        <CodePanel title="prove_step — 이중 곡선 IVC (nova/mod.rs)" code={PROVE_STEP_CODE} annotations={proveStepAnnotations} />
      </div>
    </section>
  );
}
