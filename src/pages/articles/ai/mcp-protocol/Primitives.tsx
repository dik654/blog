import PrimitivesViz from './viz/PrimitivesViz';
import PrimitivesDetailViz from './viz/PrimitivesDetailViz';

export default function Primitives() {
  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3가지 프리미티브: Tools · Resources · Prompts</h2>
      <div className="not-prose mb-8"><PrimitivesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Tools — LLM이 호출하는 함수 (행동), Resources — LLM이 읽는 데이터 (정보), Prompts — 재사용 템플릿<br />
          각 프리미티브는 JSON Schema로 정의 — LLM이 자동으로 파라미터 구조를 파악
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">MCP Primitives 상세</h3>
        <div className="not-prose mb-6"><PrimitivesDetailViz /></div>
        <p className="leading-7">
          3 primitives: <strong>Tools (actions), Resources (data), Prompts (templates)</strong>.<br />
          JSON Schema로 정의 → LLM이 자동 파라미터 이해.<br />
          Filesystem, Git, Database 등 ecosystem 확장 중.
        </p>
      </div>
    </section>
  );
}
