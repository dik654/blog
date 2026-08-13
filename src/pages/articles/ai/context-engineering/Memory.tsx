import MemoryPatternViz from "./viz/MemoryPatternViz";
import { PatternViz, AgentMemViz } from "./viz/MemoryDetailViz";
import { CitationBlock } from "@/components/ui/citation";

export default function Memory() {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리는 애플리케이션이 관리하는 상태다</h2>
      <div className="not-prose mb-8">
        <MemoryPatternViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          일반적인 LLM 요청은 이전 호출의 상태를 자동으로 기억하지 않습니다.
          대화 기록이나 사용자 선호를 다음 요청에 사용할지는 애플리케이션이
          결정합니다. 따라서 에이전트의 메모리는 모델 안에 생기는 장기 기억이라기
          보다, 어떤 정보를 저장하고 언제 다시 context로 가져올지 정한 상태 관리
          계층입니다.
        </p>
        <p>
          최근 몇 턴을 그대로 유지하는 window, 오래된 대화를 줄이는 summary,
          필요할 때 검색하는 장기 저장소는 서로 다른 문제를 풉니다. 이를 무조건
          모두 결합하기보다, 현재 작업의 임시 상태와 세션을 넘어 보존할 사실을
          먼저 구분해야 합니다. 사용자 이름처럼 장기 보존할 정보도 출처, 갱신
          시각과 삭제 정책이 없으면 오래된 사실을 계속 주입하는 오류가 생깁니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">저장 방식의 선택</h3>
        <div className="not-prose mb-6">
          <PatternViz />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Working state와 long-term memory를 나눈다
        </h3>
        <div className="not-prose mb-6">
          <AgentMemViz />
        </div>
        <p className="leading-7">
          working state에는 현재 목표, 완료한 단계와 다음 행동처럼 작업을
          이어가는 데 필요한 정보를 둡니다. long-term memory에는 여러 세션에서
          재사용할 가치가 있고 사용자가 보존에 동의한 사실만 저장합니다.
          procedural knowledge는 즉흥적인 대화 요약보다 version을 관리하는
          문서나 skill로 두는 편이 검토와 수정에 유리합니다.
        </p>
        <div className="not-prose mt-6 grid gap-4 lg:grid-cols-2">
          <div id="paper-memgpt" className="scroll-mt-24">
            <CitationBlock
              source="MemGPT: Towards LLMs as Operating Systems"
              citeKey={3}
              href="https://arxiv.org/abs/2310.08560"
            >
              제한된 context window와 외부 storage 사이에서 정보를 이동하는
              virtual context management를 제안하고 document analysis와
              multi-session chat에서 평가합니다. OS virtual memory와의 비유가
              무제한·무손실 기억이나 모든 agent의 성능 보장을 뜻하지는 않습니다.
            </CitationBlock>
          </div>
          <div id="paper-anthropic-context-management" className="scroll-mt-24">
            <CitationBlock
              source="Anthropic — Managing context on the Claude Developer Platform"
              citeKey={4}
              href="https://claude.com/blog/context-management"
            >
              Stale tool result를 지우는 context editing과 client-side file memory
              tool의 제품 경계를 설명하고 내부 평가 결과를 보고합니다. 수치는
              Sonnet 4.5와 공개된 agentic-search 조건의 product measurement이며
              일반적인 compaction 효과로 확대하지 않습니다.
            </CitationBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
