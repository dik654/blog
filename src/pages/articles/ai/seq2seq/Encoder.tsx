import EncoderViz from './viz/EncoderViz';

export default function Encoder() {
  return (
    <section id="encoder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인코더: 문장을 벡터로 압축</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        단어별 LSTM 처리 → 마지막 (cs, hs)가 문장 전체를 압축한 컨텍스트 벡터.<br />
        cs = 장기 기억, hs = 단기 기억. 두 벡터가 문장의 모든 의미를 담는다.
      </p>
      <EncoderViz />
    </section>
  );
}
