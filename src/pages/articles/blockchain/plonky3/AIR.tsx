import AIRTraceViz from '../components/AIRTraceViz';
import CodePanel from '@/components/ui/code-panel';
import { windowAccessCode, keccakAirCode } from './AIRData';
import { quotientProverCode } from './AIRData2';
import { windowAnnotations, keccakAnnotations, quotientAnnotations } from './AIRAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function AIR({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="air" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'AIR — Algebraic Intermediate Representation'}</h2>
      <div className="not-prose mb-8"><AIRTraceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3의 AIR은 <strong>트레이스 행렬</strong>에 대한 다항식 제약을 표현합니다.<br />
          각 행이 하나의 실행 단계이며, <code>current</code>·<code>next</code> 행 접근으로
          전이 제약(transition constraints)을 표현합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-keccak-air', codeRefs['p3-keccak-air'])} />
            <span className="text-[10px] text-muted-foreground self-center">keccak-air/air.rs</span>
          </div>
        )}
        <CodePanel title="WindowAccess & AirBuilder (air/src/air.rs)" code={windowAccessCode} annotations={windowAnnotations} />
        <CodePanel title="KeccakAir 예시 (keccak-air/src/air.rs)" code={keccakAirCode} annotations={keccakAnnotations} />
        <CodePanel title="제약 평가 → 몫 다항식 (uni-stark)" code={quotientProverCode} annotations={quotientAnnotations} />
      </div>
    </section>
  );
}
