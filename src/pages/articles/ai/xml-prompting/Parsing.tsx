import ParsingViz from './viz/ParsingViz';
import ParsingDetailViz from './viz/ParsingDetailViz';

export default function Parsing() {
  return (
    <section id="parsing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">출력 파싱 &amp; 추출</h2>
      <div className="not-prose mb-8"><ParsingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">XML 출력 파싱 전략</h3>
        <div className="not-prose mb-6"><ParsingDetailViz /></div>
        <p className="leading-7">
          Parsing: <strong>regex → xml.etree → BeautifulSoup → lxml</strong>.<br />
          robust parser: try 여러 방법 + fallback chain.<br />
          prompt에 explicit format spec이 parseability 핵심.
        </p>
      </div>
    </section>
  );
}
