import M from '@/components/ui/math';
import AttentionScoreViz from './viz/AttentionScoreViz';
import AttnScoreDetailViz from './viz/AttnScoreDetailViz';

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
        <p className="leading-7">
          3개 토큰, d_k=6일 때 Q·K^T로 3×3 유사도 행렬을 구한다.
          scores[0][0] = 1.23으로 자기 참조가 가장 높고, √6 ≈ 2.449로 스케일링한 뒤
          softmax를 적용하면 행별 확률 분포가 된다.
          마지막으로 V와 가중 합산하여 문맥을 반영한 출력 벡터를 얻는다.
        </p>
        <M display>{'\\text{scores}[i][j] = \\underbrace{Q_i \\cdot K_j}_{\\text{내적}} \\xrightarrow{\\div\\sqrt{6}} \\underbrace{\\text{softmax}}_{\\text{행별 확률}} \\xrightarrow{\\times V} \\underbrace{\\text{context}_i}_{\\text{문맥 벡터}}'}</M>
      </div>
      <div className="not-prose my-8"><AttnScoreDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Q·K^T는 <strong>모든 쌍의 유사도</strong> 매트릭스 계산.<br />
          요약 2: <strong>√d_k 스케일링</strong>이 softmax 포화 방지 — 필수.<br />
          요약 3: 결과는 <strong>각 행의 확률 분포</strong> — 행별로 합=1.
        </p>
      </div>
    </section>
  );
}
