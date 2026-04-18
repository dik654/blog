import M from '@/components/ui/math';
import LDEViz from './viz/LDEViz';

export default function LowDegreeExtension() {
  return (
    <section id="low-degree-extension" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">저차 확장 (Low-Degree Extension)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          유효한 trace = 저차 다항식, 잘못된 trace = 고차 &mdash; Reed-Solomon LDE로 차이 증폭.
        </p>
      </div>
      <div className="not-prose"><LDEViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LDE와 Reed-Solomon 코드</h3>

        {/* 개념 + Domain */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">Low-Degree Extension 개념</p>
          <p className="text-sm mb-3">
            Trace polynomial (차수 <M>T-1</M>)을 더 큰 domain으로 확장하여 평가.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Domain 크기</p>
              <M display>{String.raw`\underbrace{|D|}_{\text{원본 도메인 크기}} = \underbrace{T}_{\text{trace 행 수}}, \quad \underbrace{|D'|}_{\text{확장 도메인 크기}} = T \cdot \underbrace{\text{blowup\_factor}}_{\text{확장 배율}}`}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>D</M> &mdash; 원본 도메인, trace 값이 정의된 점 집합 (크기 <M>T</M>).{' '}
                <M>D'</M> &mdash; 확장 도메인, LDE 결과를 평가하는 더 큰 점 집합.{' '}
                <M>T</M> &mdash; 실행 trace의 행(step) 수.{' '}
                <code>blowup_factor</code> &mdash; 확장 배율 (2, 4, 8, 16, ...), 증명 크기 vs 보안 trade-off 결정.
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Process</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>1. Trace values over <M>D</M> &rarr; polynomial <M>P(x)</M></p>
                <p>2. <M>P(x)</M>를 더 큰 domain <M>D'</M>에서 평가</p>
                <p>3. 평가값으로 Merkle tree commit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reed-Solomon Encoding */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">Reed-Solomon Encoding</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">다항식 인코딩</p>
              <p className="text-xs text-muted-foreground mb-1">원본 메시지 <M>m = (m_0, m_1, \ldots, m_{'{T-1}'})</M></p>
              <M display>{String.raw`\underbrace{P(x)}_{\text{trace 다항식}} = \underbrace{m_0}_{\text{첫 번째 계수}} + m_1 x + m_2 x^2 + \cdots + \underbrace{m_{T-1}\, x^{T-1}}_{\text{최고차항}}`}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>P(x)</M> &mdash; trace 값을 보간하여 얻은 다항식 (차수 최대 <M>T-1</M>).{' '}
                <M>m_i</M> &mdash; 다항식 계수, 원본 trace 메시지에서 유도.{' '}
                <M>x</M> &mdash; 유한체(finite field) 위의 평가 지점.{' '}
                <M>T</M> &mdash; trace 길이, 계수 개수와 동일.
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Codeword</p>
              <M display>{String.raw`\Big(\underbrace{P(\alpha_0)}_{\text{첫 평가값}},\; P(\alpha_1),\; \ldots,\; \underbrace{P(\alpha_{N-1})}_{\text{마지막 평가값}}\Big)`}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>\alpha_i</M> &mdash; 확장 도메인 <M>D'</M>의 <M>i</M>번째 점 (유한체 원소).{' '}
                <M>P(\alpha_i)</M> &mdash; 해당 점에서의 다항식 평가값, 곧 codeword의 <M>i</M>번째 심볼.{' '}
                <M>N = T \cdot \text{'{blowup}'}</M> &mdash; codeword 전체 길이 (확장된 도메인 크기).
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">특성</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Minimum distance: <M>N - T + 1</M></p>
                <p>Error correcting capability</p>
                <p>Low-degree polynomial &hArr; valid codeword</p>
              </div>
            </div>
          </div>
        </div>

        {/* 왜 LDE? */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">왜 LDE가 필요한가?</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3 border-red-500/30">
              <p className="font-semibold text-red-400 text-xs">공격자 (위조)</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>모든 row 만족 어려움</p>
                <p>일부만 맞추고 나머지 랜덤</p>
                <p>&rarr; high-degree polynomial</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3 border-emerald-500/30">
              <p className="font-semibold text-emerald-400 text-xs">정직한 Prover</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>모든 row 정확히 만족</p>
                <p><M>P(x)</M>는 low-degree</p>
                <p>(차수 <M>T-1</M>)</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3 border-blue-500/30">
              <p className="font-semibold text-blue-400 text-xs">Verifier</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>Random point 샘플링</p>
                <p>Low-degree test (FRI)</p>
                <p>고차수 &rarr; reject</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rate & Soundness */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">Rate &amp; Soundness</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Rate</p>
              <M display>{String.raw`\underbrace{\rho}_{\text{코드 비율}} = \frac{\overbrace{T}^{\text{trace 길이}}}{\underbrace{N}_{\text{codeword 길이}}} = \frac{1}{\underbrace{\text{blowup\_factor}}_{\text{확장 배율}}}`}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>\rho</M> &mdash; Reed-Solomon 코드의 rate (비율), 정보 밀도를 나타냄.{' '}
                <M>T</M> &mdash; 원본 trace 길이 (다항식 차수 + 1).{' '}
                <M>N</M> &mdash; 확장 후 codeword 전체 길이.{' '}
                낮은 rate = 더 높은 보안 + 더 큰 proof 크기. 일반적으로 <M>\rho = 1/4</M> 또는 <M>1/8</M>.
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Soundness error</p>
              <M display>{String.raw`\underbrace{\varepsilon}_{\text{건전성 오차}} \approx \underbrace{(1 - \rho)}_{\text{단일 쿼리 탈락 확률}}^{\overbrace{\text{queries}}^{\text{질의 횟수}}}`}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>\varepsilon</M> &mdash; soundness error, 위조 증명이 검증을 통과할 확률 상한.{' '}
                <M>\rho</M> &mdash; 코드 rate, 위에서 정의한 <M>T/N</M>.{' '}
                <M>1 - \rho</M> &mdash; 한 번의 랜덤 쿼리에서 위조를 탐지하지 못할 확률.{' '}
                <M>\text{'{queries}'}</M> &mdash; 독립적인 검증 쿼리 횟수, 반복할수록 오차가 지수적으로 감소.
              </p>
              <p className="text-sm text-muted-foreground">
                예: blowup=4, queries=40 &rarr; <M>\varepsilon \approx 0.75^{'{40}'} \approx 10^{'{-5}'}</M>.{' '}
                128-bit security &rarr; ~100 queries 필요.
              </p>
            </div>
          </div>
        </div>

        {/* 실무 파라미터 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-sky-400 mb-3">실무 파라미터</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">StarkWare Cairo</p>
              <p className="text-xs text-muted-foreground mt-1">blowup=16, queries=40</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Risc0</p>
              <p className="text-xs text-muted-foreground mt-1">blowup=4, queries=50</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Plonky2</p>
              <p className="text-xs text-muted-foreground mt-1">various configs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
