import SoftmaxViz from './viz/SoftmaxViz';

export default function Softmax() {
  return (
    <section id="softmax" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소프트맥스: 숫자를 확률로</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        h값의 범위가 자유로움 → 0~1 확률로 변환 필요.<br />
        Softmax: y_i = e^h_i / Σe^h_j — 큰 값은 확대, 작은 값은 축소.
      </p>
      <SoftmaxViz />
    </section>
  );
}
