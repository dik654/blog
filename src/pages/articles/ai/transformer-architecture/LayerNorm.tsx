import LayerNormViz from './viz/LayerNormViz';
import LayerNormDetailViz from './viz/LayerNormDetailViz';
import M from '@/components/ui/math';

export default function LayerNorm() {
  return (
    <section id="layer-norm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Layer Normalization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Layer Normalization</strong> — 각 토큰의 특징 차원에 걸쳐 독립적으로 정규화<br />
          Batch Normalization과 달리 시퀀스 길이나 배치 크기에 무관하게 동작<br />
          트랜스포머의 어텐션 메커니즘과 잘 호환
        </p>
      </div>

      <LayerNormViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Pre-LN vs Post-LN</h3>
        <p>
          원본 Transformer는 Post-LN 사용<br />
          GPT-2 이후 대부분의 모델이 <strong>Pre-LN</strong>으로 전환<br />
          Pre-LN — 잔차 연결 전에 정규화하여 그래디언트 흐름이 안정적
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
          {`\\underbrace{y_i = \\gamma \\cdot \\frac{x_i - \\mu}{\\sqrt{\\sigma^2 + \\varepsilon}} + \\beta}_{\\text{LayerNorm: 특징 차원(d)으로 정규화}}`}
        </M>
      </div>
      <LayerNormDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: LayerNorm은 <strong>특징 차원으로 정규화</strong> — BatchNorm과 대조.<br />
          요약 2: <strong>Pre-LN이 현대 표준</strong> — gradient flow 안정적.<br />
          요약 3: LLaMA는 <strong>RMSNorm</strong> 채택 — 7% 속도 향상.
        </p>
      </div>
    </section>
  );
}
