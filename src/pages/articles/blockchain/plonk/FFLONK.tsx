import M from '@/components/ui/math';
import FFLONKViz from './viz/FFLONKViz';

export default function FFLONK() {
  return (
    <section id="fflonk" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FFLONK 최적화</h2>
      <div className="not-prose mb-8"><FFLONKViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">PLONK Round 5의 비효율</h3>
        <p>PLONK의 Round 5는 6개 다항식을 <M>{'\\zeta'}</M>에서, 1개를 <M>{'\\zeta\\omega'}</M>에서 열어야 한다.
        <br />
          서로 다른 2개의 evaluation point에 대해 2개의 quotient polynomial과 custom pairing 등식이 필요하다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">PLONK vs FFLONK Round 5 비교</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-rose-500/30 p-3">
                <p className="font-semibold text-sm text-rose-400 mb-1">PLONK: 2개 opening proof</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li><M>{'W_\\zeta(x)'}</M>: 6개 다항식을 <M>{'\\zeta'}</M>에서 open → 1개 proof</li>
                  <li><M>{'W_{\\zeta\\omega}(x)'}</M>: 1개 다항식을 <M>{'\\zeta\\omega'}</M>에서 open → 1개 proof</li>
                  <li>→ 2개의 opening proof + custom pairing 등식</li>
                </ul>
              </div>
              <div className="rounded border border-emerald-500/30 p-3">
                <p className="font-semibold text-sm text-emerald-400 mb-1">FFLONK: 1개로 통합</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li>7개를 1개 combined polynomial로 합침</li>
                  <li>→ <code>kzg::batch_open</code> 1번 → 1개의 opening proof</li>
                  <li>→ <code>kzg::batch_verify</code> 1번 → 검증 완료</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG의 가법 동형성 (Additive Homomorphism)</h3>
        <p>KZG commitment은 선형 연산이므로 <M>{'\\text{commit}(f + g) = \\text{commit}(f) + \\text{commit}(g)'}</M>가 성립한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">KZG 가법 동형성</p>
            <M display>{'\\text{commit}(f) = [f(\\tau)]_1 = \\sum_i f_i \\cdot [\\tau^i]_1'}</M>
            <div className="mt-2 rounded border border-emerald-500/30 p-2">
              <p className="text-sm text-emerald-400 font-medium">Commitment 선형 결합</p>
              <M display>{'\\text{commit}(f + \\nu \\cdot g + \\nu^2 \\cdot h) = \\text{commit}(f) + \\nu \\cdot \\text{commit}(g) + \\nu^2 \\cdot \\text{commit}(h)'}</M>
              <p className="text-sm text-muted-foreground mt-1">→ Verifier는 개별 commitment로부터 combined commitment를 스칼라 곱 + 덧셈만으로 재구성</p>
            </div>
            <div className="mt-2 rounded border border-amber-500/30 p-2">
              <p className="text-sm text-amber-400 font-medium">제약: 곱에 대해서는 동형이 아님!</p>
              <p className="text-sm text-muted-foreground">G1 &times; G1 → G1 연산은 없음 (G1은 덧셈군)</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Combined Polynomial 구성</h3>
        <p>FFLONK은 서로 다른 점에서 열리는 다항식들을 <strong>하나의 combined polynomial</strong>로 합친다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Combined Polynomial</p>
            <p className="text-sm text-muted-foreground mb-1"><M>{'\\zeta'}</M>에서 열리는 6개: <M>{'r, a, b, c, \\sigma_A, \\sigma_B'}</M></p>
            <p className="text-sm text-muted-foreground mb-2"><M>{'\\zeta\\omega'}</M>에서 열리는 1개: <M>{'Z'}</M></p>
            <p className="text-sm text-muted-foreground mb-1"><M>{'\\nu \\leftarrow'}</M> Fiat-Shamir challenge</p>
            <div className="rounded border border-emerald-500/30 p-3 mt-2">
              <M display>{'\\text{combined}(x) = r(x) + \\nu \\cdot a(x) + \\nu^2 \\cdot b(x) + \\nu^3 \\cdot c(x) + \\nu^4 \\cdot \\sigma_A(x) + \\nu^5 \\cdot \\sigma_B(x) + \\nu^6 \\cdot Z(x)'}</M>
            </div>
            <p className="text-sm text-muted-foreground mt-2">→ <code>kzg::batch_open({'{'}&zeta;, &zeta;&omega;{'}'})</code>로 한 번에 증명</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">장점 정리</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Opening proof 감소:</strong> 2개 → 1개</li>
          <li><strong>코드 재사용:</strong> 기존 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">kzg::batch_open</code> / <code className="bg-accent px-1.5 py-0.5 rounded text-sm">batch_verify</code> 그대로 사용</li>
          <li><strong>검증 단순화:</strong> custom pairing 등식 대신 표준 KZG batch verify</li>
          <li><strong>가스 절감:</strong> on-chain 검증 시 pairing 연산 감소</li>
        </ul>
      </div>
    </section>
  );
}
