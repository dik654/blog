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
    </section>
  );
}
