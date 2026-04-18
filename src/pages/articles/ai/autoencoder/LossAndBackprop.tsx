import BackpropViz from './viz/BackpropViz';
import AELossViz from './viz/AELossViz';

export default function LossAndBackprop() {
  return (
    <section id="loss-backprop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 + 역전파</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        MSE로 복원 오차를 측정, 체인룰로 디코더→인코더 순서로 기울기 전파.<br />
        w_new = w_old - η·gradient. 반복하면 출력이 입력에 수렴.
      </p>
      <BackpropViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">손실 함수 + 역전파 체인룰</h3>
      </div>
      <div className="not-prose mt-4 mb-6">
        <AELossViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 손실 함수는 <strong>데이터 범위와 분포</strong>에 맞춰 선택 — MSE, BCE, Perceptual 등.<br />
          요약 2: 역전파는 <strong>디코더 → 인코더</strong> 순서로 체인룰 적용 — 4개 파라미터 동시 업데이트.<br />
          요약 3: sigmoid의 포화 영역에서 기울기 소실 — ReLU/GELU 권장.
        </p>
      </div>
    </section>
  );
}
