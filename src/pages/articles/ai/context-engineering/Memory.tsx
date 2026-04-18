import MemoryPatternViz from './viz/MemoryPatternViz';
import { PatternViz, AgentMemViz } from './viz/MemoryDetailViz';

export default function Memory() {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대화 메모리 패턴</h2>
      <div className="not-prose mb-8"><MemoryPatternViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM은 기본적으로 무상태(stateless) — 매 요청마다 이전 대화를 컨텍스트에 직접 넣어줘야 "기억"처럼 작동<br />
          문제는 대화가 길어지면 토큰 한도를 초과한다는 것
        </p>
        <p>
          실전에서는 단일 전략보다 하이브리드 조합이 효과적<br />
          최근 턴은 전체 유지 + 오래된 대화는 요약 + 핵심 사실은 벡터 DB에서 검색
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 패턴 6가지</h3>
        <div className="not-prose mb-6"><PatternViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Agent 메모리 아키텍처</h3>
        <div className="not-prose mb-6"><AgentMemViz /></div>
        <p className="leading-7">
          요약 1: 메모리 패턴은 <strong>Buffer·Window·Summary·Vector</strong> 등 6가지.<br />
          요약 2: 실전은 <strong>Hybrid (최근+요약+장기)</strong> 조합.<br />
          요약 3: 2024 트렌드는 <strong>Agent 메모리 계층화</strong> (working/short/long/procedural).
        </p>
      </div>
    </section>
  );
}
