import BackpropViz from './viz/BackpropViz';

export default function LossAndBackprop() {
  return (
    <section id="loss-backprop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 + 역전파</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        MSE로 복원 오차를 측정, 체인룰로 디코더→인코더 순서로 기울기 전파.<br />
        w_new = w_old - η·gradient. 반복하면 출력이 입력에 수렴.
      </p>
      <BackpropViz />
    </section>
  );
}
