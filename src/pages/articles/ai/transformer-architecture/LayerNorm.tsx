import CodePanel from '@/components/ui/code-panel';
import { lnCode, lnAnnotations } from './LayerNormData';
import LayerNormViz from './viz/LayerNormViz';

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
        <CodePanel title="Pre-LN vs Post-LN" code={lnCode} lang="python" annotations={lnAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LayerNorm vs BatchNorm</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LayerNorm 수식:
//   μ = (1/d) Σ x_i           # 특징 차원 평균
//   σ² = (1/d) Σ (x_i - μ)²   # 특징 차원 분산
//   y_i = γ · (x_i - μ)/√(σ²+ε) + β
//
// 정규화 방향:
//   입력 shape: (B, N, d_model)
//
//   BatchNorm: 배치 차원으로 정규화 (B 방향)
//     - 각 특징 채널마다 배치 평균
//     - CNN에서 유리
//     - 시퀀스에 적용 시 패딩 문제
//
//   LayerNorm: 특징 차원으로 정규화 (d_model 방향)
//     - 각 토큰의 모든 특징 평균
//     - 배치 크기 무관
//     - 가변 길이 시퀀스에 OK

// Pre-LN vs Post-LN 차이:
//
// Post-LN (원 Transformer):
//   x → SubLayer → Add(x) → LayerNorm
//   y = LN(x + SubLayer(x))
//
// Pre-LN (GPT-2 이후):
//   x → LayerNorm → SubLayer → Add(x)
//   y = x + SubLayer(LN(x))
//
// 차이점:
//   Post-LN:
//     - 학습 불안정 (warmup 필수)
//     - 최종 성능 약간 좋음
//   Pre-LN:
//     - 학습 안정적 (warmup 선택)
//     - gradient flow 균일
//     - 현대 LLM 표준

// RMSNorm (LLaMA, T5):
//   - LayerNorm의 평균 제거 단순화
//   - RMS(x) = sqrt(mean(x²))
//   - y_i = γ · x_i / RMS(x)
//   - 약 7% 속도 향상
//   - 성능 유사

// 위치 변형:
//   - Pre-LN (GPT-2, GPT-3)
//   - Post-LN (original, BERT)
//   - Sandwich-LN (PaLM, attention 전후)
//   - DeepNorm (1000층 가능)
//   - RMSNorm (LLaMA, Mistral)`}
        </pre>
        <p className="leading-7">
          요약 1: LayerNorm은 <strong>특징 차원으로 정규화</strong> — BatchNorm과 대조.<br />
          요약 2: <strong>Pre-LN이 현대 표준</strong> — gradient flow 안정적.<br />
          요약 3: LLaMA는 <strong>RMSNorm</strong> 채택 — 7% 속도 향상.
        </p>
      </div>
    </section>
  );
}
