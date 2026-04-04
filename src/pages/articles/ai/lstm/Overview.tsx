import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN의 한계와 LSTM</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        바닐라 RNN — 긴 시퀀스에서 기울기 소실(vanishing gradient) 발생.<br />
        LSTM(1997)은 게이트 메커니즘으로 이 문제를 해결한다.
      </p>
      <OverviewViz />
    </section>
  );
}
