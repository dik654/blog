import InputEmbeddingViz from './viz/InputEmbeddingViz';

export default function InputEmbedding() {
  return (
    <section id="input-embedding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">입력 임베딩 + 위치 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          임베딩 벡터만으로는 <strong>단어 순서</strong>를 알 수 없다<br />
          Transformer는 RNN과 달리 순차 처리를 하지 않기 때문이다<br />
          sin/cos 함수로 위치 정보를 만들어 더한다
        </p>
      </div>

      <InputEmbeddingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>위치 인코딩 공식</h3>
        <div className="rounded-lg border p-3 font-mono text-sm space-y-1 mb-4">
          <div>PE(pos, 2i) = sin(pos / 10000<sup>2i/d_model</sup>)</div>
          <div>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d_model</sup>)</div>
        </div>
        <p>
          짝수 차원은 sin, 홀수 차원은 cos 사용<br />
          pos=위치, i=차원 인덱스, d_model=6<br />
          최종 입력 = 임베딩 벡터 + 위치 인코딩 벡터
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Positional Encoding 설계 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sinusoidal Positional Encoding (Vaswani 2017)
//
// 요구사항:
//   1. 각 위치가 고유한 인코딩
//   2. 서로 다른 길이 시퀀스에 일관성
//   3. 상대 위치 학습 가능 (k 떨어진 위치)
//
// 수식:
//   PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
//   PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
//
// 주파수 해석:
//   i가 작을수록 (저차원) → 주파수 높음 (빠른 변화)
//   i가 클수록 (고차원) → 주파수 낮음 (느린 변화)
//
// 마치 시계의 초침(빠름)과 시침(느림) 조합
//
// 예시 (d_model=4, 4개 위치):
//   PE(0): [sin(0), cos(0), sin(0), cos(0)]     = [0, 1, 0, 1]
//   PE(1): [sin(1), cos(1), sin(0.01), cos(0.01)]
//        ≈ [0.841, 0.540, 0.010, 1.000]
//   PE(2): [sin(2), cos(2), sin(0.02), cos(0.02)]
//        ≈ [0.909, -0.416, 0.020, 1.000]
//
// 상대 위치 학습:
//   PE(pos+k) = LinearTransform(PE(pos))
//   → 모델이 "k 떨어진" 관계 학습 가능

// 대안 방식들:
//   - Learned PE (BERT): 학습 가능한 임베딩
//   - Rotary PE (LLaMA, RoFormer): 회전 기반
//   - ALiBi (BLOOM): attention bias로 대체
//   - RelPos (T5): 상대 위치 bias

// 핵심 특성:
//   - 최대 길이 제한 없음 (sinusoidal)
//   - 학습 불필요
//   - 임베딩에 직접 덧셈`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>sin/cos 주파수 분리</strong>로 각 차원이 다른 시간 스케일 표현.<br />
          요약 2: <strong>최대 길이 제약 없음</strong> - sinusoidal PE가 학습 PE 대비 장점.<br />
          요약 3: LLaMA/GPT-4는 <strong>RoPE (Rotary)</strong>로 진화 — 상대 위치 내장.
        </p>
      </div>
    </section>
  );
}
