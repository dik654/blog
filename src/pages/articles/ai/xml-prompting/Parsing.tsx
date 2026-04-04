import ParsingViz from './viz/ParsingViz';

export default function Parsing() {
  return (
    <section id="parsing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">출력 파싱 & 추출</h2>
      <div className="not-prose mb-8"><ParsingViz /></div>
    </section>
  );
}
