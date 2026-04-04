import NovaFoldingViz from '../components/NovaFoldingViz';
import IVCFoldingViz from './viz/IVCFoldingViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATE_CODE, RELAXED_CODE, crateAnnotations, relaxedAnnotations } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & IVC 폴딩 구조'}</h2>
      <div className="not-prose mb-8"><NovaFoldingViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">IVC 폴딩 흐름</h3>
      <div className="not-prose mb-8"><IVCFoldingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Nova</strong>(microsoft/Nova)는 R1CS 인스턴스를 누적 폴딩(Folding, 접기)하여 IVC(Incrementally Verifiable Computation, 점진적 검증 연산)를 구현합니다.
          <br />
          각 스텝에서 Relaxed R1CS 인스턴스를 업데이트하는 NIFS(Non-Interactive Folding Scheme)를 사용합니다.
          <br />
          최종에 단 한 번 SNARK로 압축합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nova-r1cs', codeRefs['nova-r1cs'])} />
            <span className="text-[10px] text-muted-foreground self-center">r1cs/mod.rs</span>
            <CodeViewButton onClick={() => onCodeRef('nova-spartan', codeRefs['nova-spartan'])} />
            <span className="text-[10px] text-muted-foreground self-center">spartan/mod.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 구조 (src/)" code={CRATE_CODE} annotations={crateAnnotations} />
        <CodePanel title="Relaxed R1CS와 NIFS 아이디어" code={RELAXED_CODE} annotations={relaxedAnnotations} />
      </div>
    </section>
  );
}
