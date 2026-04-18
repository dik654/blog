import CrossAttentionViz from './viz/CrossAttentionViz';
import CrossAttnDetailViz from './viz/CrossAttnDetailViz';
import M from '@/components/ui/math';

export default function CrossAttention() {
  return (
    <section id="cross-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">크로스 어텐션 (디코더)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          크로스 어텐션 — 디코더가 인코더의 출력을 참조하는 메커니즘<br />
          <strong>Q = 디코더</strong>, <strong>K와 V = 인코더</strong>에서 온다<br />
          번역 예시: "나는 학생 이다" → "I am a student"
        </p>
      </div>

      <CrossAttentionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Self-Attention과의 차이</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>Self-Attention:</strong> Q, K, V 모두 같은 시퀀스에서 생성</div>
          <div><strong>Cross-Attention:</strong> Q는 디코더, K/V는 인코더에서 생성</div>
        </div>
        <p>
          디코더 토큰 "I"가 인코더 토큰 "나는"에 높은 어텐션 → 정렬(alignment)<br />
          Seq2Seq+Attention과 같은 원리이지만 병렬 처리 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Attention 수식</h3>
        <M display>
          {`\\underbrace{Q = H_{\\text{dec}} \\cdot W_Q}_{\\text{디코더에서 Query}}, \\quad
\\underbrace{K = H_{\\text{enc}} \\cdot W_K, \\; V = H_{\\text{enc}} \\cdot W_V}_{\\text{인코더에서 Key/Value}}`}
        </M>
        <M display>
          {`\\text{Attn}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V \\quad \\longrightarrow \\quad (T_{\\text{tgt}}, d_v)`}
        </M>
      </div>
      <CrossAttnDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: Cross-Attention은 <strong>Q=디코더, K/V=인코더</strong> — 두 시퀀스 연결 다리.<br />
          요약 2: 번역·요약 등 <strong>seq2seq 태스크</strong>의 핵심 구조.<br />
          요약 3: Decoder-only GPT는 <strong>cross-attention 없음</strong> — 단일 시퀀스만.
        </p>
      </div>
    </section>
  );
}
