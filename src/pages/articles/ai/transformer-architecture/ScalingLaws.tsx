import MathText from '@/components/ui/math-text';
import ScalingLawsScene from './viz/ScalingLawsScene';
import ScalingDetailScene from './viz/ScalingDetailScene';
import M from '@/components/ui/math';

export default function ScalingLaws() {
  return (
    <MathText id="scaling-laws" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스케일링 법칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모델을 키우면 loss가 내려가지만, 데이터가 부족하면 같은 문장을 반복해서 외운다<br />
          데이터를 늘려도 모델이 너무 작으면 새 패턴을 담을 공간이 부족하다<br />
          파라미터 수 $N$, 토큰 수 $D$, 연산량 $C$ 를 함께 맞추는 경험 법칙이 scaling laws다
        </p>
      </div>

      <ScalingLawsScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>스케일링 법칙 & Chinchilla</h3>

        <M display>
          {`L(N) = \\underbrace{\\left(\\frac{N_c}{N}\\right)^{0.076}}_{\\text{파라미터 스케일링}}, \\quad L(D) = \\underbrace{\\left(\\frac{D_c}{D}\\right)^{0.095}}_{\\text{데이터 스케일링}}, \\quad L(C) = \\underbrace{\\left(\\frac{C_c}{C}\\right)^{0.050}}_{\\text{연산량 스케일링}}`}
        </M>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">Kaplan (2020)</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              loss가 <M>{'N, D, C'}</M> 각각에 대해 완만한 power law를 따른다는 관찰. 작은 실험으로 큰 학습의 loss를 어느 정도 예측할 수 있게 했다
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Chinchilla (2022)</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              고정 FLOP에서는 큰 모델만 키우는 것보다 토큰을 충분히 먹이는 쪽이 낫다는 결론. 대표 비율이 <M>{'N{:}D = 1{:}20'}</M>
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
      <ScalingDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: loss는 $N$, $D$, $C$ 중 어느 한 축만으로 내려가지 않는다.<br />
          요약 2: Chinchilla는 고정 FLOP에서 데이터 부족 모델의 비효율을 드러냈다.<br />
          요약 3: 큰 모델 학습 계획은 아키텍처보다 먼저 예산 배분 문제를 풀어야 한다.
        </p>
      </div>
    </MathText>
  );
}
