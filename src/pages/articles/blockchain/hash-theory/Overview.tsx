import HashSecurityViz from './viz/HashSecurityViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">해시 안전성 정의</h2>
      <div className="not-prose mb-8"><HashSecurityViz /></div>
    </section>
  );
}
