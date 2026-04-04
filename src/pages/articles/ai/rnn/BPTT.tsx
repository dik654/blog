import BPTTViz from './viz/BPTTViz';

export default function BPTT() {
  return (
    <section id="bptt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시간 역전파 (BPTT)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        BPTT — 순환 구조를 시간축으로 펼쳐 일반 역전파를 적용하는 학습 알고리즘.
      </p>
      <BPTTViz />
    </section>
  );
}
