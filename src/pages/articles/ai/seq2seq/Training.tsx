import BackpropViz from './viz/BackpropViz';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습: 역전파</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        손실 → Softmax → 디코더 LSTM → 인코더 LSTM — 하나의 역전파로 전체 학습.<br />
        Teacher Forcing: 학습 시 정답 단어를 다음 입력으로 사용하여 속도 향상.
      </p>
      <BackpropViz />
    </section>
  );
}
