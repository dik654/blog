import CodePanel from '@/components/ui/code-panel';
import { ffnCode, ffnAnnotations } from './FeedForwardData';
import FeedForwardViz from './viz/FeedForwardViz';

export default function FeedForward() {
  return (
    <section id="feed-forward" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Feed-Forward Network</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FFN — 어텐션이 토큰 간 관계를 모델링한 후 각 토큰의 표현을 <strong>독립적으로 변환</strong><br />
          포지션별(position-wise) 완전 연결 네트워크<br />
          d_model 차원을 d_ff(보통 4배)로 확장 → 비선형 활성화 → 원래 차원으로 복원
        </p>
      </div>

      <FeedForwardViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>GELU vs SwiGLU</h3>
        <p>
          원본 Transformer는 ReLU를 사용<br />
          최신 모델은 <strong>GELU</strong>(BERT, GPT)나 <strong>SwiGLU</strong>(LLaMA, PaLM) 채택<br />
          SwiGLU — 게이트 메커니즘을 추가하여 더 나은 성능 달성
        </p>
        <CodePanel title="FFN 구현: GELU vs SwiGLU" code={ffnCode} lang="python" annotations={ffnAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FFN 구조와 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Position-wise Feed-Forward Network
//
// 수식:
//   FFN(x) = max(0, x·W_1 + b_1) · W_2 + b_2
//
// 차원:
//   입력: x ∈ R^{n × d_model}   (d_model = 512)
//   W_1: (d_model, d_ff)         (d_ff = 2048, 4× 확장)
//   W_2: (d_ff, d_model)
//
//   내부 활성화: (n, d_ff)
//   출력: (n, d_model)
//
// 왜 position-wise?
//   - 각 토큰이 독립적으로 FFN 통과
//   - 토큰 간 상호작용은 이미 attention에서 처리
//   - 병렬 처리 극대화
//
// 왜 4배 확장?
//   - 비선형 표현 능력 증가
//   - "Compute first, then compress" 전략
//   - Transformer 파라미터의 ~2/3 차지

// 활성화 함수 진화:
//
// 1. ReLU (원 Transformer, 2017)
//    max(0, x)
//
// 2. GELU (BERT, GPT, 2018)
//    x · Φ(x)  (Φ = 정규분포 CDF)
//    근사: 0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))
//    - ReLU보다 매끄러움
//    - 작은 음수 값 일부 통과
//
// 3. SwiGLU (PaLM, LLaMA, 2020)
//    SwiGLU(x) = Swish(xW + b) ⊙ (xV + c)
//    Swish(x) = x · sigmoid(x)
//    - 게이트 메커니즘
//    - gate × content 구조
//    - LLaMA, Mistral 기본

// 파라미터 비교 (d_model=512, d_ff=2048):
//   FFN: 2 × 512 × 2048 = 2.1M
//   Attention: 4 × 512² = 1.05M
//   → FFN이 attention의 2배
//
// LLaMA-7B 파라미터 분포:
//   Attention: 33%
//   FFN (SwiGLU): 66%
//   기타: 1%`}
        </pre>
        <p className="leading-7">
          요약 1: FFN은 <strong>d_model → 4·d_model → d_model</strong> 확장-압축 구조.<br />
          요약 2: <strong>position-wise</strong> — 토큰 독립 처리, 완전 병렬.<br />
          요약 3: Transformer 파라미터의 <strong>약 2/3이 FFN</strong> — 모델 용량의 핵심.
        </p>
      </div>
    </section>
  );
}
