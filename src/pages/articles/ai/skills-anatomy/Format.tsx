import FormatViz from './viz/FormatViz';
import FormatDetailViz from './viz/FormatDetailViz';

export default function Format() {
  return (
    <section id="format" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SKILL.md 포맷</h2>
      <div className="not-prose"><FormatViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SKILL.md 구조</h3>
        <div className="not-prose mb-6"><FormatDetailViz /></div>
        <p className="leading-7">
          SKILL.md: <strong>frontmatter (metadata) + body (instructions)</strong>.<br />
          required: name, description; recommended: version, author, tags.<br />
          design: clarity + conciseness + testability + composability.
        </p>
      </div>
    </section>
  );
}
