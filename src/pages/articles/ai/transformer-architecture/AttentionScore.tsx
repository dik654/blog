import AttentionScoreViz from './viz/AttentionScoreViz';

export default function AttentionScore() {
  return (
    <section id="attention-score" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어텐션 스코어 계산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Q, K, V가 준비되면 4단계로 셀프어텐션을 계산한다<br />
          핵심 공식: <strong>Attention(Q,K,V) = softmax(QK<sup>T</sup>/√d_k)V</strong>
        </p>
      </div>

      <AttentionScoreViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>4단계 과정</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>1.</strong> Q(3×6) × K<sup>T</sup>(6×3) = 유사도 행렬(3×3)</div>
          <div><strong>2.</strong> ÷ √d_k = √6 ≈ 2.449 → 스케일링</div>
          <div><strong>3.</strong> Softmax → 행별 확률 분포 (합=1)</div>
          <div><strong>4.</strong> × V(3×6) = 문맥 반영 출력(3×6)</div>
        </div>
        <p>
          유사도 행렬의 (i,j) = 토큰 i가 토큰 j를 얼마나 주목하는지<br />
          √d_k 스케일링 — 값이 커지면 softmax 기울기가 0에 수렴하는 문제 방지
        </p>
      </div>
    </section>
  );
}
