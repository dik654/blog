import QKVComputationViz from './viz/QKVComputationViz';

export default function QKVComputation() {
  return (
    <section id="qkv-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Q, K, V 행렬 생성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          입력 행렬 X(3×6)를 <strong>3개 복사</strong>한다<br />
          각 복사본에 다른 가중치 행렬(W_Q, W_K, W_V)을 곱한다<br />
          결과: Q(3×6), K(3×6), V(3×6) — 같은 크기, 다른 역할
        </p>
      </div>

      <QKVComputationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>행렬 곱 계산</h3>
        <div className="rounded-lg border p-3 font-mono text-sm space-y-1 mb-4">
          <div>Q = X(3×6) × W_Q(6×6) = (3×6)</div>
          <div>K = X(3×6) × W_K(6×6) = (3×6)</div>
          <div>V = X(3×6) × W_V(6×6) = (3×6)</div>
        </div>
        <p>
          W_Q, W_K, W_V는 학습으로 업데이트되는 파라미터<br />
          Q — "내가 찾는 정보" / K — "내가 가진 정보" / V — "실제 전달 정보"
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Q/K/V의 역할 구분</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Q, K, V 직관 (정보 검색 비유)
//
// Query (Q): "무엇을 찾고 싶은가?"
//   - 검색어 역할
//   - 각 토큰이 "다른 토큰에서 무엇을 가져올지" 결정
//   - 예: "it" 토큰의 Q는 "대명사 지시 대상" 찾기
//
// Key (K): "어떤 내용을 가지고 있는가?"
//   - 인덱스 역할
//   - Q와의 유사도로 attention 가중치 결정
//   - 예: "cat" 토큰의 K는 "명사, 주어" 정보
//
// Value (V): "실제로 전달할 내용"
//   - 실제 데이터
//   - Q-K 매칭 후 가져올 정보
//   - 예: "cat" 토큰의 V는 의미 표현
//
// 수식:
//   Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V

// 같은 입력, 다른 투영:
//   X → W_Q → Q  (다른 관점 1)
//   X → W_K → K  (다른 관점 2)
//   X → W_V → V  (다른 관점 3)
//
//   같은 단어도 세 가지 "얼굴"을 가짐
//   W 행렬들이 각 역할에 맞게 학습됨
//
// Self vs Cross Attention:
//   Self: Q, K, V 모두 같은 시퀀스에서
//     encoder self-attention
//     decoder masked self-attention
//
//   Cross: Q는 decoder, K&V는 encoder에서
//     encoder-decoder cross-attention
//     → 디코더가 인코더 정보 조회

// 차원:
//   입력 X: (n, d_model)
//   W_Q, W_K: (d_model, d_k)
//   W_V: (d_model, d_v)
//   보통 d_k = d_v = d_model/h (h=헤드 수)
//
//   Q, K: (n, d_k)
//   V: (n, d_v)`}
        </pre>
        <p className="leading-7">
          요약 1: Q/K/V는 같은 입력에서 파생된 <strong>세 가지 역할의 투영</strong>.<br />
          요약 2: <strong>정보 검색 비유</strong> — Query로 Key 검색 후 Value 가져옴.<br />
          요약 3: Self-attention에서 <strong>모든 토큰이 모든 토큰</strong>을 조회.
        </p>
      </div>
    </section>
  );
}
