import OverviewViz from './viz/OverviewViz';
import OverviewDetailViz from './viz/OverviewDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 XML 태그인가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          XML Prompting: <strong>LLM prompt structuring 기법</strong>.<br />
          Claude가 XML tags 선호 (학습 데이터 특성).<br />
          명확한 구조 → 더 정확한 파싱 + 응답.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 XML tags가 효과적인가</h3>
        <div className="not-prose mb-6"><OverviewDetailViz /></div>
        <p className="leading-7">
          XML prompting: <strong>명확한 구조 + 파싱 가능 + Claude 친화적</strong>.<br />
          plain text/Markdown/JSON 대비 explicit + semantic.<br />
          2024 Anthropic 공식 best practice.
        </p>
      </div>
    </section>
  );
}
