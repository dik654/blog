import CrossAttentionViz from './viz/CrossAttentionViz';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cross-Attention in Encoder-Decoder Transformer
//
// Encoder output: H_enc ∈ R^{T_src × d_model}
// Decoder hidden: H_dec ∈ R^{T_tgt × d_model}
//
// Q comes from decoder:
//   Q = H_dec · W_Q   ∈ R^{T_tgt × d_k}
//
// K, V come from encoder:
//   K = H_enc · W_K   ∈ R^{T_src × d_k}
//   V = H_enc · W_V   ∈ R^{T_src × d_v}
//
// Attention:
//   scores = Q · K^T / sqrt(d_k)    # (T_tgt, T_src)
//   attn = softmax(scores)
//   output = attn · V               # (T_tgt, d_v)
//
// 주목: attention matrix가 직사각형 (T_tgt × T_src)
//   - 각 target 토큰이 모든 source 토큰 참조
//   - Bahdanau attention의 진화형

// Decoder Layer 전체 구조:
//
//   Layer Input: x (T_tgt, d_model)
//
//   1. Masked Self-Attention
//      x' = MaskedSelfAttn(x)
//      x = LayerNorm(x + x')
//
//   2. Cross-Attention
//      x'' = CrossAttn(Q=x, K=H_enc, V=H_enc)
//      x = LayerNorm(x + x'')
//
//   3. Feed-Forward
//      x''' = FFN(x)
//      x = LayerNorm(x + x''')
//
//   → Decoder layer 출력
//
// Encoder → Decoder 정보 흐름:
//   Encoder output H_enc는 모든 decoder layer의
//   cross-attention에 공유 입력으로 사용

// 사용 모델:
//   - Original Transformer (번역)
//   - T5 (seq2seq)
//   - BART (denoising autoencoder)
//   - FLAN-T5
//
// Decoder-only (GPT, LLaMA)는 cross-attention 없음
//   → 단일 시퀀스 내 self-attention만`}
        </pre>
        <p className="leading-7">
          요약 1: Cross-Attention은 <strong>Q=디코더, K/V=인코더</strong> — 두 시퀀스 연결 다리.<br />
          요약 2: 번역·요약 등 <strong>seq2seq 태스크</strong>의 핵심 구조.<br />
          요약 3: Decoder-only GPT는 <strong>cross-attention 없음</strong> — 단일 시퀀스만.
        </p>
      </div>
    </section>
  );
}
