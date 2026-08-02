import MathText from '@/components/ui/math-text';
import M from '@/components/ui/math';
import AttentionScoreScene from './viz/AttentionScoreScene';
import AttnScoreDetailScene from './viz/AttnScoreDetailScene';

export default function AttentionScore() {
  return (
    <MathText id="attention-score" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어텐션 스코어 계산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          $Q$ 와 $K$ 는 먼저 모든 위치 쌍의 비교표 $QK^T$ 를 만든다<br />
          그 점수를 sqrt(d_k) 로 나눠 softmax가 포화되지 않게 조정한다<br />
          softmax 결과 $A$ 는 행별 선택 비율이고, 마지막 $A V$ 가 실제 문맥 벡터다
        </p>
      </div>

      <AttentionScoreScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>4단계 과정</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>1.</strong> Q(3×6) × K<sup>T</sup>(6×3) = 유사도 행렬(3×3)</div>
          <div><strong>2.</strong> ÷ √d_k = √6 ≈ 2.449 → 스케일링</div>
          <div><strong>3.</strong> Softmax → 행별 확률 분포 (합=1)</div>
          <div><strong>4.</strong> × V(3×6) = 문맥 반영 출력(3×6)</div>
        </div>
        <p>
          점수 행렬의 $(i,j)$ 는 위치 $i$ 가 위치 $j$ 를 얼마나 맞는 상대로 보는지다<br />
          d_k 가 커질수록 내적 분산이 커지므로 sqrt(d_k) 로 나눠 분산을 다시 낮춘다
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Attention Score 계산 예시</h3>
        <p className="leading-7">
          3개 토큰이면 각 위치가 세 위치를 모두 비교하므로 $3\\times3$ 점수표가 나온다.
          첫 행은 첫 token이 자기 자신과 다른 두 token을 얼마나 볼지 정한다.
          softmax는 그 행을 합 1인 분포로 바꾸고, $V$ 와의 곱은 “그 비율로 내용을 섞은 결과”를 만든다.
        </p>
        <M display>{'\\text{scores}[i][j] = \\underbrace{Q_i \\cdot K_j}_{\\text{내적}} \\xrightarrow{\\div\\sqrt{6}} \\underbrace{\\text{softmax}}_{\\text{행별 확률}} \\xrightarrow{\\times V} \\underbrace{\\text{context}_i}_{\\text{문맥 벡터}}'}</M>
      </div>
      <div className="not-prose my-8"><AttnScoreDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: $QK^T$ 는 모든 위치 쌍 비교표.<br />
          요약 2: sqrt(d_k) scaling은 softmax 포화를 줄이는 장치.<br />
          요약 3: $A$ 의 각 행은 한 query 위치의 선택 분포.
        </p>
      </div>
    </MathText>
  );
}
