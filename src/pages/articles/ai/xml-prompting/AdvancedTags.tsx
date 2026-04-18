import AdvancedTagsViz from './viz/AdvancedTagsViz';
import AdvancedTagsDetailViz from './viz/AdvancedTagsDetailViz';

export default function AdvancedTags() {
  return (
    <section id="advanced-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">고급 태그 패턴</h2>
      <div className="not-prose mb-8"><AdvancedTagsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">고급 XML 패턴</h3>
        <div className="not-prose mb-6"><AdvancedTagsDetailViz /></div>
        <p className="leading-7">
          고급 패턴: <strong>CoT, self-critique, multi-step, conditional, extraction</strong>.<br />
          nested documents, tool definitions, validation.<br />
          2-3 levels nesting 권장, meaningful names.
        </p>
      </div>
    </section>
  );
}
