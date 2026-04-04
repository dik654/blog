import RNNUnrollViz from './viz/RNNUnrollViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN 구조</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        은닉 상태(h_t)가 시간축으로 순환 — 이전 출력이 현재 입력과 합쳐진다.<br />
        모든 시간 단계에서 동일한 가중치를 공유하여 가변 길이 시퀀스 처리 가능.
      </p>
      <RNNUnrollViz />
    </section>
  );
}
