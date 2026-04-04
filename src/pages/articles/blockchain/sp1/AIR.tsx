import AIRTraceViz from '../components/AIRTraceViz';
import CodePanel from '@/components/ui/code-panel';
import { CHIPS, ADD_CODE, STARK_CODE, PLONKY3_CODE } from './AIRData';
import { addAnnotations, starkAnnotations, plonky3Annotations } from './AIRAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function AIR({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="air" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AIR 칩 시스템 &amp; STARK</h2>
      <div className="not-prose mb-8"><AIRTraceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1은 실행 추적을 <strong>AIR(Algebraic Intermediate Representation)</strong>으로 변환합니다.<br />
          각 연산 타입별로 독립적인 "칩(Chip)"이 있으며,
          Plonky3 프레임워크로 각 칩의 제약 조건을 STARK으로 증명합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('prover-entry', codeRefs['prover-entry'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prover 진입점</span>
        </div>
        <h3>AIR 칩 목록</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {CHIPS.map(c => (
          <div key={c.name} className="rounded-lg border border-border/60 px-3 py-2 flex gap-3">
            <span className="font-mono text-xs font-bold text-amber-400 w-36 flex-shrink-0">{c.name}</span>
            <span className="text-xs text-foreground/70">{c.desc}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CodePanel title="AIR 제약 조건 예시 (덧셈)" code={ADD_CODE} annotations={addAnnotations} />
        <CodePanel title="STARK 증명 생성 과정" code={STARK_CODE} annotations={starkAnnotations} />
        <p>
          Plonky3는 범용 STARK 프레임워크입니다.<br />
          필드(BabyBear, Goldilocks, BN254 등), FRI 파라미터, 해시 함수를
          모듈식으로 선택할 수 있습니다.
        </p>
        <CodePanel title="Plonky3 프레임워크" code={PLONKY3_CODE} annotations={plonky3Annotations} />
      </div>
    </section>
  );
}
