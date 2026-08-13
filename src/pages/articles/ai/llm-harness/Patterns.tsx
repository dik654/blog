import PatternsViz from "./viz/PatternsViz";
import { CitationBlock } from "@/components/ui/citation";

export default function Patterns() {
  return (
    <section id="patterns" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        제어 흐름: workflow·agent loop·checkpoint graph를 섞는 기준
      </h2>
      <div className="not-prose mb-8">
        <PatternsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Workflow, loop, graph는 위아래가 정해진 표준 계층이 아니다. 작업의
          다음 경로를 개발자가 정할지, 모델이 상황에 맞춰 고를지 설명하기 위한
          설계 용어에 가깝다. 그래서 전체 과정을 workflow나 graph로 미리 정할
          필요도 없고, 반대로 모든 판단을 agent loop에 맡길 이유도 없다. 선택
          기준은 유행하는 이름이 아니라 <strong>경로의 불확실성</strong>과
          <strong> side effect의 위험</strong>이다.
        </p>

        <div
          data-viz="harness-control-ledger"
          className="not-prose my-6 grid gap-3 sm:grid-cols-2"
        >
          {[
            ["Workflow", "개발자", "정산·승인·정형 ETL", "변화에 취약한 과도한 분기"],
            ["Agent loop", "모델", "탐색·디버깅·연구", "종료 실패·우회 경로"],
            ["Checkpoint graph", "위험 전이는 시스템", "배포·삭제·결제·권한 변경", "상태·보상 설계 오류"],
            ["Loop stack", "주기별 혼합", "실행·검증·운영 개선", "비용·feedback 오염"],
          ].map(([name, chooser, fit, risk]) => (
            <div key={name} className="min-w-0 border-t border-border/80 pt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <strong className="text-sm text-foreground">{name}</strong>
                <span className="text-[11px] text-primary">경로 선택 · {chooser}</span>
              </div>
              <dl className="mt-3 grid gap-2 text-xs leading-5">
                <div className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                  <dt className="text-muted-foreground">잘 맞는 작업</dt>
                  <dd className="min-w-0 text-foreground">{fit}</dd>
                </div>
                <div className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                  <dt className="text-muted-foreground">주요 위험</dt>
                  <dd className="min-w-0 text-foreground">{risk}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          Loop engineering의 실용적 의미
        </h3>
        <p className="leading-7">
          LangChain은 2026년 글에서 agent loop, verification loop, event-driven
          loop, production trace로 하네스를 개선하는 hill-climbing loop를
          구분했다. 이것을 업계의 확정된 계층으로 받아들이기보다, 실행 중
          이루어지는 검증과 운영 데이터를 바탕으로 한 장기 개선은 서로 다른
          주기와 권한으로 관리해야 한다는 운영 모델로 이해하면 된다.
        </p>
        <p className="leading-7">
          예를 들어 agent loop는 한 run의 token budget 안에서 돌지만, production
          trace로 하네스를 고치는 loop는 여러 run의 표본과 사람 review, canary
          배포를 거쳐야 한다. 두 loop를 같은 권한으로 자동 연결하면 한 번의 잘못된
          feedback이 전체 하네스를 바꾸는 문제가 생길 수 있다.
        </p>
        <p className="leading-7">
          “Graph engineering”은 더 최근의 표현이며 합의된 정의가 약하다. 따라서
          이 글에서는 표준 기술명처럼 사용하지 않고, 배포·삭제·결제처럼 잘못
          실행했을 때 되돌리기 어려운 단계만 정해진 절차와 checkpoint로 진행하는
          패턴을 <em>checkpoint graph</em>라고 제한해 부른다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          복잡성을 추가하기 전 확인할 질문
        </h3>
        <ul>
          <li>단일 model call과 retrieval만으로 품질 기준을 만족하는가?</li>
          <li>다음 단계가 고정돼 있다면 agent 대신 workflow로 충분한가?</li>
          <li>실패를 자동 판정할 verifier와 retry budget이 있는가?</li>
          <li>되돌리기 어려운 action 앞에 승인·checkpoint·receipt가 있는가?</li>
          <li>multi-agent가 정말 context·권한·병렬성 병목을 줄이는가?</li>
        </ul>
        <p className="leading-7">
          이 질문에 답하지 못한 채 agent와 loop를 늘리면, 같은 model error가 여러
          번 복제되고 trace만 길어진다. Anthropic의 권고처럼 가장 단순한 구조로
          시작하고, 관측된 실패가 요구할 때만 routing·parallelization·evaluator를
          더하는 편이 디버깅과 비용 관리에 유리하다.
        </p>

        <div id="paper-langchain-loop" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="LangChain — The Art of Loop Engineering"
            citeKey={4}
            href="https://www.langchain.com/blog/the-art-of-loop-engineering"
          >
            Agent·verification·event-driven·hill-climbing loop를 서로 다른 운영
            주기로 나눈 최근 vocabulary입니다. 합의된 표준 taxonomy나
            graph-engineering 성숙도 모델로 읽지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
