import M from '@/components/ui/math';
import CodePanel from '@/components/ui/code-panel';
import { FRI_CODE, FRI_ANNOTATIONS } from './FRIData';

export default function FRI({ title }: { title?: string }) {
  return (
    <section id="fri" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Linear Codes (Ligero/Brakedown)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Linear Codes</strong> 기반 PCS는 오류 정정 부호와 해시 함수만을 사용하여
          양자 컴퓨터에 대한 강한 저항성을 제공합니다.<br />
          대수적 구조에 의존하지 않으므로 투명한 설정이 가능합니다.
        </p>

        <h3>Linear Codes PCS 구현</h3>
        <CodePanel title="RS 인코딩 + Merkle Tree" code={FRI_CODE}
          annotations={FRI_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">FRI (Fast Reed-Solomon IOP)</h3>

        {/* 목적 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">FRI Protocol (Ben-Sasson et al. 2018)</div>
          <p className="text-sm text-muted-foreground">
            Prover가 commit한 <M>f</M>가 실제로 차수 <M>{'\\leq d'}</M>인 다항식의 evaluation인지 증명한다. STARK의 핵심 primitive.
          </p>
        </div>

        {/* 5단계 프로토콜 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">1</div>
            <div className="text-sm font-semibold mb-1">RS Encoding</div>
            <p className="text-xs text-muted-foreground">
              도메인 <M>{'D = \\{g^0, g^1, \\dots, g^{N-1}\\}'}</M>. <M>{'|D| = \\rho \\times d'}</M> (blowup)
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">2</div>
            <div className="text-sm font-semibold mb-1">Merkle Commit</div>
            <p className="text-xs text-muted-foreground">RS evaluations를 Merkle Tree로 커밋</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">3</div>
            <div className="text-sm font-semibold mb-1">Folding</div>
            <p className="text-xs text-muted-foreground">
              <M>{"f'(y) = f_{\\text{even}}(y) + \\alpha \\cdot f_{\\text{odd}}(y)"}</M>. 차수 반감.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">4</div>
            <div className="text-sm font-semibold mb-1">Repeat</div>
            <p className="text-xs text-muted-foreground"><M>{'\\log n'}</M> 라운드 반복 &rarr; 상수까지 축소</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">5</div>
            <div className="text-sm font-semibold mb-1">Query</div>
            <p className="text-xs text-muted-foreground">랜덤 위치에서 일관성 체크. Soundness <M>{'(1 - \\delta)^q'}</M></p>
          </div>
        </div>

        {/* Folding 수식 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Folding의 대수적 핵심 (Algebraic Linking Identity)</div>
          <M display>{'f(x) = \\underbrace{f_{\\text{even}}(x^2)}_{\\text{짝수 차수 항}} + \\underbrace{x \\cdot f_{\\text{odd}}(x^2)}_{\\text{홀수 차수 항}}'}</M>
          <p className="text-sm text-muted-foreground mt-2 mb-3">
            <M>{'f_{\\text{even}}'}</M>: 짝수 차수 계수로 구성된 다항식, <M>{'f_{\\text{odd}}'}</M>: 홀수 차수 계수로 구성된 다항식. 임의의 다항식을 짝수/홀수 부분으로 분해.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <M display>{'f_{\\text{even}}(x^2) = \\frac{\\overbrace{f(x) + f(-x)}^{\\text{홀수항 상쇄}}}{\\underbrace{2}_{\\text{정규화}}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>{'f(x)+f(-x)'}</M>에서 홀수 차수 항이 부호 반전으로 상쇄되어 짝수 항만 남음.
              </p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <M display>{'f_{\\text{odd}}(x^2) = \\frac{\\overbrace{f(x) - f(-x)}^{\\text{짝수항 상쇄}}}{\\underbrace{2x}_{\\text{x 인수 제거}}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>{'f(x)-f(-x)'}</M>에서 짝수 차수 항이 상쇄. <M>{'2x'}</M>로 나누어 차수를 1 낮춤.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            매 fold마다 <M>{'f_{\\text{even}}'}</M>과 <M>{'f_{\\text{odd}}'}</M>의 random linear combination. 도메인 크기와 차수 모두 반감.
          </p>
        </div>

        {/* 복잡도 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">복잡도</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center">Commit: <M>{'O(N \\log N)'}</M></div>
            <div className="rounded bg-muted/50 p-2 text-center">Prove: <M>{'O(N \\log N)'}</M></div>
            <div className="rounded bg-muted/50 p-2 text-center">Verify: <M>{'O(\\log^2 N)'}</M></div>
            <div className="rounded bg-muted/50 p-2 text-center">Proof: <M>{'O(\\log^2 N)'}</M> hashes</div>
          </div>
        </div>

        {/* STARK 활용 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">STARK에서의 활용</div>
          <p className="text-sm text-muted-foreground">
            AIR &rarr; Trace polynomial &rarr; RS encoding &rarr; FRI low-degree test &rarr; Batched across constraints
          </p>
        </div>

        {/* 구현체 + Linear Codes 변형 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">FRI 구현체</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="rounded bg-muted/50 p-2 text-center">StarkWare (Cairo)</div>
              <div className="rounded bg-muted/50 p-2 text-center">Risc0 (RISC-V VM)</div>
              <div className="rounded bg-muted/50 p-2 text-center">Winterfell</div>
              <div className="rounded bg-muted/50 p-2 text-center">Plonky2</div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Linear Codes 변형</div>
            <p className="text-sm text-muted-foreground">
              Ligero, Brakedown &mdash; 해시만 사용. <M>{'O(\\log^2 n)'}</M> proof. No trusted setup. Post-quantum 안전.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
