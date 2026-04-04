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
    </section>
  );
}
