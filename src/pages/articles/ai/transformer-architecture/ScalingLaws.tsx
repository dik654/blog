import ScalingLawsViz from './viz/ScalingLawsViz';
import ScalingDetailViz from './viz/ScalingDetailViz';
import M from '@/components/ui/math';

export default function ScalingLaws() {
  return (
    <section id="scaling-laws" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스케일링 법칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transformer의 성능 — <strong>파라미터 수(N)</strong>, <strong>데이터양(D)</strong>, <strong>연산량(C)</strong>의 멱법칙(Power Law, 변수 간 거듭제곱 관계)을 따라 예측 가능하게 향상<br />
          Chinchilla 논문 — 고정 연산 예산에서 <strong>N:D=1:20</strong>이 최적임을 입증<br />
          LLM 학습 패러다임을 근본적으로 변화시킴
        </p>
      </div>

      <ScalingLawsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>스케일링 법칙 & Chinchilla</h3>

        <M display>
          {`L(N) = \\underbrace{\\left(\\frac{N_c}{N}\\right)^{0.076}}_{\\text{파라미터 스케일링}}, \\quad L(D) = \\underbrace{\\left(\\frac{D_c}{D}\\right)^{0.095}}_{\\text{데이터 스케일링}}, \\quad L(C) = \\underbrace{\\left(\\frac{C_c}{C}\\right)^{0.050}}_{\\text{연산량 스케일링}}`}
        </M>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">Kaplan (2020)</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Loss가 <M>{'N, D, C'}</M> 각각에 대해 멱법칙(power law)을 따름. 지수 <M>{'\\alpha{=}0.076'}</M>이 가장 작아 파라미터 증가 대비 수익이 가장 낮음
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Chinchilla (2022)</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              고정 FLOP에서 최적 비율 <M>{'N{:}D = 1{:}20'}</M>. GPT-3(175B, 300B토큰)보다 Chinchilla(70B, 1.4T토큰)가 더 나은 성능 달성
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">실전 N:D 비율</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              GPT-3 <M>{'1{:}1.7'}</M>(과대 파라미터) → Chinchilla <M>{'1{:}20'}</M>(최적) → LLaMA-2 <M>{'1{:}29'}</M> → LLaMA-3 <M>{'1{:}1875'}</M>(극단적 오버트레이닝)
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Scaling Laws 주요 발견</h3>
        <M display>
          {`L(N,D,C) \\approx \\underbrace{a \\cdot N^{-\\alpha}}_{\\text{파라미터}} + \\underbrace{b \\cdot D^{-\\beta}}_{\\text{데이터}} + \\underbrace{c \\cdot C^{-\\gamma}}_{\\text{연산량}}`}
        </M>
      </div>
      <ScalingDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: <strong>Kaplan 2020</strong>이 scaling laws 정식화 — 성능 예측 가능해짐.<br />
          요약 2: <strong>Chinchilla (1:20 비율)</strong>이 GPT-3 시대 통념 전복.<br />
          요약 3: <strong>Emergent abilities</strong>는 scaling의 질적 전환 — 아직도 연구 중.
        </p>
      </div>
    </section>
  );
}
