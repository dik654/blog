import CompositionViz from './viz/CompositionViz';

export default function Composition() {
  return (
    <section id="composition" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        하네스 구성: 시스템 프롬프트 + 도구 + 가드레일
      </h2>
      <div className="not-prose mb-8"><CompositionViz /></div>
    </section>
  );
}
