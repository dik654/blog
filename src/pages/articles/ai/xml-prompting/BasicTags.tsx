import BasicTagsViz from './viz/BasicTagsViz';
import BasicTagsDetailViz from './viz/BasicTagsDetailViz';

export default function BasicTags() {
  return (
    <section id="basic-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기본 태그 패턴</h2>
      <div className="not-prose mb-8"><BasicTagsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">XML 기본 태그 패턴</h3>
        <div className="not-prose mb-6"><BasicTagsDetailViz /></div>
        <p className="leading-7">
          기본 tags: <strong>task, context, input, instructions, examples, output_format</strong>.<br />
          Anthropic 추천: document, examples, question, answer, thinking.<br />
          consistent naming → LLM learns patterns.
        </p>
      </div>
    </section>
  );
}
