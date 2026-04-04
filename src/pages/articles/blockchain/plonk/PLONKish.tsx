import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import PLONKGateViz from './viz/PLONKGateViz';
import { GATE_CODE, COPY_CODE, GRAND_PRODUCT_CODE } from './PLONKishData';
import { codeRefs } from './codeRefs';

export default function PLONKish({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="plonkish" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONKish Arithmetization</h2>
      <div className="not-prose mb-8"><PLONKGateViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('plonk-gate', codeRefs['plonk-gate'])} />
          <span className="text-[10px] text-muted-foreground self-center">ArithmeticGate</span>
          <CodeViewButton onClick={() => onCodeRef('plonk-copy', codeRefs['plonk-copy'])} />
          <span className="text-[10px] text-muted-foreground self-center">Permutation Z(x)</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS의 한계</h3>
        <p>R1CS 게이트는 본질적으로 곱셈 전용이다.
        <br />
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">x * y + x = z</code>를 표현하려면 보조변수와 2개 제약이 필요하다.
        <br />
          PLONKish(PLONK의 산술화 방식)는 이를 <strong>하나의 범용 게이트</strong>로 처리한다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">범용 게이트 - 5개의 Selector</h3>
        <CodePanel
          title="PLONKish 범용 게이트"
          code={GATE_CODE}
          annotations={[
            { lines: [1, 1], color: 'sky', note: '범용 게이트 등식' },
            { lines: [3, 7], color: 'emerald', note: '5개 파라미터 역할' },
          ]}
        />
        <p>selector 값에 따라 게이트 유형이 결정된다:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>덧셈:</strong> q_L=1, q_R=1, q_O=-1 → a + b = c</li>
          <li><strong>곱셈:</strong> q_M=1, q_O=-1 → a · b = c</li>
          <li><strong>상수:</strong> q_L=1, q_C=-v → a = v</li>
          <li><strong>혼합:</strong> q_M=1, q_L=1, q_O=-1 → a·b + a = c (1개 제약)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Copy Constraint (와이어 연결)</h3>
        <p>각 게이트의 wire는 독립적이다. &quot;게이트 0의 output = 게이트 1의 left input&quot; 같은 연결을 <strong>copy constraint</strong>로 강제한다.</p>
        <CodePanel
          title="Copy Constraint 예시"
          code={COPY_CODE}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '독립된 게이트의 wire' },
            { lines: [6, 7], color: 'violet', note: 'permutation으로 연결' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Permutation Argument (Grand Product)</h3>
        <p>copy constraint를 다항식으로 인코딩한다. 핵심은 &quot;두 벡터가 permutation 관계&quot;임을 grand product로 증명하는 것이다.</p>
        <CodePanel
          title="Grand Product Z(x)"
          code={GRAND_PRODUCT_CODE}
          annotations={[
            { lines: [3, 6], color: 'emerald', note: 'accumulator 다항식 정의' },
            { lines: [8, 10], color: 'amber', note: 'telescoping으로 상쇄' },
          ]}
        />
        <p>이 grand product는 <strong>accumulator 다항식</strong>으로 KZG commit되어 검증된다. 잘못된 와이어 연결이 있으면 Z가 1로 닫히지 않아 증명이 실패한다.</p>
      </div>
    </section>
  );
}
