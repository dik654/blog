import DecoderViz from './viz/DecoderViz';

export default function Decoder() {
  return (
    <section id="decoder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">디코더: 벡터에서 번역 생성</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        EOS + 컨텍스트 벡터 → LSTM → Softmax → 단어 생성.<br />
        출력이 다음 입력(자기회귀) — GPT 등 현대 LLM의 기본 메커니즘.
      </p>
      <DecoderViz />
    </section>
  );
}
