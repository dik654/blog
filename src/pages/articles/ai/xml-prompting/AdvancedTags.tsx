import AdvancedTagsViz from './viz/AdvancedTagsViz';

export default function AdvancedTags() {
  return (
    <section id="advanced-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">고급 태그 패턴</h2>
      <div className="not-prose mb-8"><AdvancedTagsViz /></div>
    </section>
  );
}
