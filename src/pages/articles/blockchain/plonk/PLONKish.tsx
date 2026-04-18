import M from '@/components/ui/math';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import PLONKGateViz from './viz/PLONKGateViz';
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
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">PLONKish 범용 게이트</p>
            <M display>{'q_L \\cdot a + q_R \\cdot b + q_O \\cdot c + q_M \\cdot a \\cdot b + q_C = 0'}</M>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-3">
              <div className="bg-muted/50 rounded p-2"><code>a, b, c</code><br /><span className="text-muted-foreground">3개 wire (left, right, output)</span></div>
              <div className="bg-muted/50 rounded p-2"><code>q_L</code><br /><span className="text-muted-foreground">left wire 선형 계수</span></div>
              <div className="bg-muted/50 rounded p-2"><code>q_R</code><br /><span className="text-muted-foreground">right wire 선형 계수</span></div>
              <div className="bg-muted/50 rounded p-2"><code>q_O</code><br /><span className="text-muted-foreground">output wire 선형 계수</span></div>
              <div className="bg-muted/50 rounded p-2"><code>q_M</code><br /><span className="text-muted-foreground">곱셈 항 계수</span></div>
              <div className="bg-muted/50 rounded p-2"><code>q_C</code><br /><span className="text-muted-foreground">상수 항</span></div>
            </div>
          </div>
        </div>
        <p>selector 값에 따라 게이트 유형이 결정된다:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>덧셈:</strong> q_L=1, q_R=1, q_O=-1 → a + b = c</li>
          <li><strong>곱셈:</strong> q_M=1, q_O=-1 → a &middot; b = c</li>
          <li><strong>상수:</strong> q_L=1, q_C=-v → a = v</li>
          <li><strong>혼합:</strong> q_M=1, q_L=1, q_O=-1 → a&middot;b + a = c (1개 제약)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Copy Constraint (와이어 연결)</h3>
        <p>각 게이트의 wire는 독립적이다. &quot;게이트 0의 output = 게이트 1의 left input&quot; 같은 연결을 <strong>copy constraint</strong>로 강제한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Copy Constraint 예시</p>
            <p className="text-sm text-muted-foreground mb-1">예시: <code>x * y = z</code>, <code>z + w = out</code></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="rounded border border-sky-500/30 p-3">
                <p className="font-semibold text-sm text-sky-400 mb-1">독립된 게이트의 wire</p>
                <p className="text-sm font-mono text-muted-foreground">Gate 0: a_0=x, b_0=y, c_0=z (곱셈)</p>
                <p className="text-sm font-mono text-muted-foreground">Gate 1: a_1=z, b_1=w, c_1=out (덧셈)</p>
              </div>
              <div className="rounded border border-violet-500/30 p-3">
                <p className="font-semibold text-sm text-violet-400 mb-1">Permutation으로 연결</p>
                <p className="text-sm text-muted-foreground">Copy constraint: <M>{'c_0 = a_1'}</M> (같은 값 z)</p>
                <p className="text-sm text-muted-foreground">→ permutation <M>{'\\sigma'}</M>: position(<M>{'c_0'}</M>) &harr; position(<M>{'a_1'}</M>)</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Permutation Argument (Grand Product)</h3>
        <p>copy constraint를 다항식으로 인코딩한다. 핵심은 &quot;두 벡터가 permutation 관계&quot;임을 grand product로 증명하는 것이다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-emerald-500/30 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Grand Product Z(x)</p>
            <p className="text-sm text-muted-foreground mb-2">검증자가 랜덤 <M>{'\\beta, \\gamma'}</M>를 선택</p>
            <div className="my-2">
              <M display>{'Z(\\omega^0) = 1'}</M>
              <M display>{'Z(\\omega^{i+1}) = Z(\\omega^i) \\cdot \\prod_j \\frac{w_j(\\omega^i) + \\beta \\cdot \\omega^i \\cdot k_j + \\gamma}{w_j(\\omega^i) + \\beta \\cdot \\sigma_j(\\omega^i) + \\gamma}'}</M>
            </div>
            <div className="mt-2 rounded border border-amber-500/30 p-2">
              <p className="text-sm text-amber-400 font-medium">Telescoping으로 상쇄</p>
              <p className="text-sm text-muted-foreground">최종 확인: <M>{'Z(\\omega^{n-1}) \\cdot (\\text{마지막 항}) = 1'}</M></p>
              <p className="text-sm text-muted-foreground">→ permutation이 올바르면 곱이 1</p>
            </div>
          </div>
        </div>
        <p>이 grand product는 <strong>accumulator 다항식</strong>으로 KZG commit되어 검증된다. 잘못된 와이어 연결이 있으면 Z가 1로 닫히지 않아 증명이 실패한다.</p>
      </div>
    </section>
  );
}
