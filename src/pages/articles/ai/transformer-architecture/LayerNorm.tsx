import MathText from '@/components/ui/math-text';
import LayerNormScene from './viz/LayerNormScene';
import LayerNormDetailScene from './viz/LayerNormDetailScene';
import M from '@/components/ui/math';

export default function LayerNorm() {
  return (
    <MathText id="layer-norm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Layer Normalization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          깊은 layer를 지나면 token 벡터의 크기와 분포가 계속 흔들린다<br />
          다음 sublayer가 매번 다른 scale을 받으면 학습이 불안정해진다<br />
          그래서 각 token 안의 feature 차원으로 평균과 분산을 맞춘 뒤, $\\gamma,\\beta$ 로 필요한 scale을 다시 학습한다
        </p>
      </div>

      <LayerNormScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Pre-LN vs Post-LN</h3>
        <p>
          residual은 원본 $x$ 를 더해 gradient가 지나갈 우회로를 남긴다<br />
          Post-LN은 더한 뒤 정규화하고, Pre-LN은 sublayer 앞에서 정규화한 뒤 $x+F(LN(x))$ 를 만든다<br />
          깊은 decoder stack에서는 Pre-LN이 원본 경로를 덜 막아 더 안정적이다
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">Pre-LN (GPT-2, LLaMA)</h4>
            <M display>
              {`\\underbrace{x + \\text{Attn}\\bigl(\\text{LN}(x)\\bigr)}_{\\text{정규화 → 서브레이어 → 잔차}}`}
            </M>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
              정규화를 먼저 적용 — 잔차 경로(identity path)가 그래디언트를 직접 전달. Warmup 없이도 안정적 학습 가능, 깊은 모델(100+ 레이어)에 적합
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Post-LN (원본 Transformer)</h4>
            <M display>
              {`\\underbrace{\\text{LN}\\bigl(x + \\text{Attn}(x)\\bigr)}_{\\text{서브레이어 → 잔차 → 정규화}}`}
            </M>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
              잔차 연결 후 정규화 — 그래디언트가 LN을 통과해야 해서 깊은 모델에서 불안정. 반드시 Warmup 필요, 학습률 민감
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LayerNorm vs BatchNorm</h3>
        <M display>
          {`y_i = \\underbrace{\\gamma}_{\\text{학습 scale}} \\cdot \\frac{\\overbrace{x_i - \\mu}^{\\text{centering}}}{\\underbrace{\\sqrt{\\sigma^2 + \\varepsilon}}_{\\text{scaling, } \\varepsilon \\text{ 0 분산 방지}}} + \\underbrace{\\beta}_{\\text{학습 shift}}`}
        </M>
      </div>
      <LayerNormDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: LayerNorm은 token별 feature 차원 평균과 분산을 맞춘다.<br />
          요약 2: residual은 원본 경로를 더해 gradient 흐름을 보존한다.<br />
          요약 3: 현대 decoder LLM은 대체로 Pre-LN 또는 RMSNorm 계열을 쓴다.
        </p>
      </div>
    </MathText>
  );
}
