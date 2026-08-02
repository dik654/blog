import MathText from '@/components/ui/math-text';
import CrossAttentionScene from './viz/CrossAttentionScene';
import CrossAttnDetailScene from './viz/CrossAttnDetailScene';
import M from '@/components/ui/math';

export default function CrossAttention() {
  return (
    <MathText id="cross-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">크로스 어텐션 (디코더)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          decoder가 다음 target token을 고를 때 source 문장의 어느 위치를 봐야 하는지 알아야 한다<br />
          decoder 상태에서 $Q$ 를 만들고, encoder memory H_enc 에서 $K,V$ 를 만든다<br />
          target 위치가 source 위치를 조회하는 이 연결이 cross-attention이다
        </p>
      </div>

      <CrossAttentionScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Self-Attention과의 차이</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>Self-Attention:</strong> Q, K, V 모두 같은 시퀀스에서 생성</div>
          <div><strong>Cross-Attention:</strong> Q는 디코더, K/V는 인코더에서 생성</div>
        </div>
        <p>
          target token "I"의 $Q$ 가 source token "나는"의 $K$ 와 높은 점수를 만들 수 있다<br />
          이 점수표가 target 길이 × source 길이의 정렬표가 된다
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Attention 수식</h3>
        <M display>
          {`\\underbrace{Q = H_{\\text{dec}} \\cdot W_Q}_{\\text{디코더에서 Query}}, \\quad
\\underbrace{K = H_{\\text{enc}} \\cdot W_K, \\; V = H_{\\text{enc}} \\cdot W_V}_{\\text{인코더에서 Key/Value}}`}
        </M>
        <M display>
          {`\\text{Attn}(Q,K,V) = \\underbrace{\\text{softmax}\\!\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right)}_{\\text{디코더 토큰 × 인코더 위치별 가중치}} \\cdot \\underbrace{V}_{\\text{인코더 값}} \\;\\longrightarrow\\; \\underbrace{(T_{\\text{tgt}}, d_v)}_{\\text{디코더 길이 × 값 차원}}`}
        </M>
      </div>
      <CrossAttnDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: $Q$ 는 decoder, $K,V$ 는 encoder memory에서 온다.<br />
          요약 2: attention 행렬은 T_tgt x T_src 직사각형.<br />
          요약 3: decoder-only GPT는 source와 target을 한 시퀀스로 붙여 self-attention만 쓴다.
        </p>
      </div>
    </MathText>
  );
}
