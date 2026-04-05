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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Attention Score 계산 예시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 3 토큰 Self-Attention 예시 (d_k=6)
//
// Q = [[1.0, 0.5, 0.0, 0.1, 0.2, 0.3],
//      [0.3, 0.8, 0.1, 0.2, 0.1, 0.2],
//      [0.2, 0.3, 0.9, 0.1, 0.4, 0.1]]
//
// K = [[0.9, 0.4, 0.1, 0.2, 0.1, 0.3],
//      [0.2, 0.7, 0.2, 0.1, 0.2, 0.1],
//      [0.1, 0.2, 0.8, 0.3, 0.3, 0.2]]
//
// Step 1: QK^T
//   scores[i][j] = Q[i] · K[j]
//
//   scores[0][0] = 1.0·0.9+0.5·0.4+0.0·0.1+0.1·0.2+0.2·0.1+0.3·0.3
//               = 0.9+0.2+0+0.02+0.02+0.09 = 1.23
//   scores[0][1] = 1.0·0.2+0.5·0.7+0·0.2+0.1·0.1+0.2·0.2+0.3·0.1 = 0.68
//   scores[0][2] = 0.35
//
//   비슷하게 모든 조합 계산
//
//   scores = [[1.23, 0.68, 0.35],
//             [0.58, 0.82, 0.43],
//             [0.34, 0.31, 1.12]]
//
// Step 2: Scale by sqrt(d_k) = sqrt(6) ≈ 2.449
//   scaled = scores / 2.449
//          = [[0.502, 0.278, 0.143],
//             [0.237, 0.335, 0.176],
//             [0.139, 0.127, 0.457]]
//
// Step 3: Softmax (행별)
//   Row 0: softmax([0.502, 0.278, 0.143])
//          = [0.412, 0.329, 0.259]
//   Row 1: softmax([0.237, 0.335, 0.176])
//          = [0.325, 0.359, 0.316]
//   Row 2: softmax([0.139, 0.127, 0.457])
//          = [0.293, 0.289, 0.418]
//
// Step 4: × V = 최종 context vector
//   각 토큰이 문맥 정보 흡수

// 관찰:
//   - 대각선 값이 크면 self-reference 강함
//   - attention 분산 정도 = 초점 집중도
//   - 낮은 entropy → 특정 토큰에 집중`}
        </pre>
        <p className="leading-7">
          요약 1: Q·K^T는 <strong>모든 쌍의 유사도</strong> 매트릭스 계산.<br />
          요약 2: <strong>√d_k 스케일링</strong>이 softmax 포화 방지 — 필수.<br />
          요약 3: 결과는 <strong>각 행의 확률 분포</strong> — 행별로 합=1.
        </p>
      </div>
    </section>
  );
}
