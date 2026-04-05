import { RoughNotation } from 'react-rough-notation';
import TransformerBlockViz from './viz/TransformerBlockViz';

export default function Overview() {
  return (
    <section id="overview">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">개요</h2>
      <div className="not-prose mb-8"><TransformerBlockViz /></div>
      <p className="leading-7">
        Transformer — 2017년{' '}
        <RoughNotation type="highlight" show color="#fef08a" animationDelay={300}>
          "Attention Is All You Need"
        </RoughNotation>{' '}
        논문에서 제안된 아키텍처<br />
        기존 RNN/LSTM 기반 시퀀스 모델의 한계를 극복<br />
        병렬 처리가 가능하고, 긴 시퀀스에서도 효과적으로 의존성을 포착
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Transformer 전체 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Transformer = Encoder Stack + Decoder Stack
//
// Encoder (6 layers, 원 논문):
//   각 layer:
//     - Multi-Head Self-Attention
//     - Add & Norm (residual + LayerNorm)
//     - Position-wise Feed-Forward
//     - Add & Norm
//
// Decoder (6 layers):
//   각 layer:
//     - Masked Multi-Head Self-Attention
//     - Add & Norm
//     - Encoder-Decoder Cross-Attention
//     - Add & Norm
//     - Feed-Forward
//     - Add & Norm
//
// 모델 크기 (원 논문):
//   d_model = 512 (hidden dimension)
//   d_ff = 2048 (FFN hidden)
//   h = 8 (attention heads)
//   N = 6 (layers)
//   약 65M parameters (base model)
//
// 설계 원칙:
//   1. No RNN: 순차성 제거 → 병렬화
//   2. Self-Attention: 임의 거리 토큰 직접 연결
//   3. Positional Encoding: 순서 정보 명시 부여
//   4. Residual + LayerNorm: 깊은 학습 안정화

// RNN 대비 장점:
//   - 병렬 학습 (전체 시퀀스 동시 처리)
//   - O(1) 경로 길이 (임의 두 토큰)
//   - GPU/TPU 친화적 (행렬 연산)
//
// RNN 대비 단점:
//   - O(n²) attention 복잡도
//   - 메모리 사용량 큼
//   - 긴 시퀀스 (10K+) 어려움`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Encoder 6 + Decoder 6</strong> 층 구조가 원 논문 기본.<br />
          요약 2: <strong>No Recurrence</strong>, Attention만으로 시퀀스 처리 — 병렬화 혁명.<br />
          요약 3: GPT/BERT/LLaMA 모두 Transformer의 <strong>encoder 또는 decoder 부분</strong>.
        </p>
      </div>
    </section>
  );
}
