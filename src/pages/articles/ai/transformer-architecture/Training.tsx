import MathText from '@/components/ui/math-text';
import TrainingScene from './viz/TrainingScene';
import TrainingDetailScene from './viz/TrainingDetailScene';
import M from '@/components/ui/math';

export default function Training() {
  return (
    <MathText id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 기법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          큰 모델은 작은 batch noise, 큰 gradient, 낮은 정밀도 오류가 한꺼번에 쌓인다<br />
          처음부터 큰 학습률로 움직이면 attention 점수와 optimizer moment가 안정되기 전에 튄다<br />
          warmup, AdamW, mixed precision은 각각 step 크기, 좌표별 update, 숫자 표현을 안정화하는 조각이다
        </p>
      </div>

      <TrainingScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>학습 파이프라인</h3>

        <M display>
          {`\\underbrace{\\text{lr} = d_{\\text{model}}^{-0.5} \\cdot \\min\\!\\bigl(\\text{step}^{-0.5},\\; \\text{step} \\cdot \\text{warmup}^{-1.5}\\bigr)}_{\\text{원본 논문 LR 공식 — warmup 구간에서 선형 증가, 이후 } \\sqrt{\\text{step}} \\text{ 비례 감소}}`}
        </M>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">LR Warmup + Decay</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              초기에는 optimizer 통계가 아직 거칠다. <M>{'\\text{warmup}'}</M> 동안 LR을 천천히 키워 큰 update를 피하고, 이후 cosine 또는 <M>{'\\text{step}^{-0.5}'}</M>로 줄인다
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">AdamW 옵티마이저</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <M>{'\\beta_1{=}0.9,\\;\\beta_2{=}0.95'}</M>로 gradient 평균과 제곱 평균을 추적한다. weight decay를 gradient update와 분리해 큰 좌표가 과하게 왜곡되지 않게 한다
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Mixed Precision (BF16)</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              forward는 FP16/BF16으로 싸게 계산하고 optimizer state는 FP32로 보관한다. BF16은 지수 범위가 넓어 대규모 학습에서 underflow 위험을 줄인다
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Warmup + Cosine Decay</h3>
        <M display>
          {`\\text{lr} = \\begin{cases} \\text{peak} \\times \\dfrac{\\text{step}}{\\text{warmup}} & \\text{warmup 구간} \\\\[6pt] \\underbrace{\\text{min} + \\tfrac{1}{2}(\\text{peak}-\\text{min})\\,(1+\\cos\\pi p)}_{\\text{cosine decay, } p = \\frac{\\text{step}-\\text{warmup}}{\\text{total}-\\text{warmup}}} & \\text{decay 구간} \\end{cases}`}
        </M>
      </div>
      <TrainingDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: warmup은 초기 큰 update를 막고 decay는 후반 미세 조정으로 보낸다.<br />
          요약 2: AdamW는 gradient moment와 weight decay를 분리한다.<br />
          요약 3: mixed precision은 계산/메모리 비용을 낮추되 중요한 상태는 더 넓은 정밀도로 둔다.
        </p>
      </div>
    </MathText>
  );
}
