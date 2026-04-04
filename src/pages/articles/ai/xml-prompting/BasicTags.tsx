import BasicTagsViz from './viz/BasicTagsViz';

export default function BasicTags() {
  return (
    <section id="basic-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기본 태그 패턴</h2>
      <div className="not-prose mb-8"><BasicTagsViz /></div>
    </section>
  );
}
