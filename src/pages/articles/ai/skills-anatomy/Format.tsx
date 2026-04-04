import FormatViz from './viz/FormatViz';

export default function Format() {
  return (
    <section id="format" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SKILL.md 포맷</h2>
      <div className="not-prose"><FormatViz /></div>
    </section>
  );
}
