import DLTimelineViz from './viz/DLTimelineViz';

export default function History() {
  return (
    <section id="history" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝의 초기 역사</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        80년에 걸친 연구, 좌절, 재발견의 반복.<br />
        1943 인공 뉴런 → 1986 역전파 → 2012 AlexNet → 2017 Transformer.
      </p>
      <DLTimelineViz />
    </section>
  );
}
