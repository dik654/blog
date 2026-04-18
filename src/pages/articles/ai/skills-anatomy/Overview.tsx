import OverviewViz from './viz/OverviewViz';
import OverviewDetailViz from './viz/OverviewDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Skill이란 무엇인가</h2>
      <div className="not-prose"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          Skill: <strong>AI agent용 reusable capability package</strong>.<br />
          Anthropic 2024 release — Claude의 확장 메커니즘.<br />
          SKILL.md + code files로 구성, progressive disclosure로 호출.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Skill vs Tool vs Plugin</h3>
        <div className="not-prose mb-6"><OverviewDetailViz /></div>
        <p className="leading-7">
          Skill = <strong>SKILL.md + code + progressive disclosure</strong>.<br />
          Tool (low) → Plugin (medium) → Skill (high) 계층.<br />
          workflow-centric, reusable domain expertise.
        </p>
      </div>
    </section>
  );
}
