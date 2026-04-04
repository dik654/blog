import CodePanel from '@/components/ui/code-panel';
import STARKPipelineViz from './viz/STARKPipelineViz';
import { PROVE_CODE, PROVE_ANNOTATIONS, VERIFY_CODE, VERIFY_ANNOTATIONS } from './UniSTARKData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function UniSTARK({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="uni-stark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'uni-stark 증명 시스템'}</h2>
      <div className="not-prose mb-8"><STARKPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>uni-stark</strong>는 Plonky3의 단변수(univariate) STARK 프레임워크입니다.<br />
          AIR 제약조건을 다항식으로 변환하고 FRI 프로토콜로 효율적으로 증명합니다.<br />
          투명 셋업(trusted setup 없음)으로 강력한 보안을 제공합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-stark-config', codeRefs['p3-stark-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">config.rs</span>
          </div>
        )}

        <h3>증명 생성 (prove)</h3>
        <CodePanel title="5단계 STARK 증명 파이프라인" code={PROVE_CODE}
          annotations={PROVE_ANNOTATIONS} />

        <h3>검증 (verify)</h3>
        <CodePanel title="Fiat-Shamir 재현 + 제약 검증" code={VERIFY_CODE}
          annotations={VERIFY_ANNOTATIONS} />
      </div>
    </section>
  );
}
