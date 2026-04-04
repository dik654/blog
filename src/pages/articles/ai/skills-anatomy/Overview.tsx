import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Skill이란 무엇인가</h2>
      <div className="not-prose"><OverviewViz /></div>
    </section>
  );
}
