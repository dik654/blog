import TeamLeadFlowViz from "./viz/TeamLeadFlowViz";
import { CitationBlock } from "@/components/ui/citation";

const responsibilities = [
  {
    role: "Main agent",
    body: "사용자 목표, 우선순위와 최종 승인 책임을 유지합니다.",
  },
  {
    role: "Coordinator",
    body: "독립 작업으로 분해하고 ownership·dependency·완료 조건을 관리합니다.",
  },
  {
    role: "Worker",
    body: "좁은 contract 안에서 조사하거나 수정하고 검증 가능한 결과를 반환합니다.",
  },
] as const;

export default function TeamLeadWorkers() {
  return (
    <section id="team-lead-workers" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Main·coordinator·worker의 책임을 겹치지 않게 나눈다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          multi-agent 구조에서 가장 흔한 문제는 역할 이름은 여러 개인데 모두가
          같은 목표를 다시 계획하는 것입니다. main agent는 사용자와의 약속을
          소유하고, coordinator는 work unit과 dependency를 관리하며, worker는 한
          산출물에 집중해야 합니다. 각 계층의 상태와 완료 정의가 달라야 역할을
          나눈 의미가 생깁니다.
        </p>
        <p className="leading-7">
          작업이 두세 개뿐이고 main agent가 직접 dependency를 관리할 수 있다면
          별도 coordinator는 필요하지 않습니다. coordinator는 worker가 많거나,
          실행 순서와 재시도·취소를 지속적으로 조정해야 할 때 추가하는
          orchestration layer입니다.
        </p>

        <div className="not-prose my-8">
          <TeamLeadFlowViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {responsibilities.map((item) => (
          <article
            key={item.role}
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
          >
            <h4 className="text-sm font-bold text-foreground">{item.role}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          dispatch 전에 작업 계약을 완성한다
        </h3>
        <p className="leading-7">
          worker prompt에는 목표뿐 아니라 입력 자료, 읽기·쓰기 범위, 금지 사항,
          expected artifact, 검증 명령과 중단 조건을 넣습니다. “코드를
          개선해라”보다 “이 모듈의 timeout 누수를 찾아 테스트와 diff를
          반환해라”처럼 결과를 확인할 수 있는 contract가 좋습니다.
        </p>
        <p className="leading-7">
          context는 필요한 만큼만 전달하되 중요한 제약을 요약 과정에서 지우지
          않습니다. user requirement와 security invariant는 별도 필드로
          유지하고, worker가 main conversation 전체와 secret을 자동 상속하지
          않게 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          병렬성은 dependency와 write ownership으로 제한한다
        </h3>
        <p className="leading-7">
          서로 다른 문서를 조사하거나 겹치지 않는 module을 수정하는 작업은
          병렬화하기 쉽습니다. 반면 같은 file, schema, migration을 건드리는
          작업은 순서를 정하거나 한 owner가 통합해야 합니다. separate worktree가
          충돌을 늦춰 줄 수는 있지만 의미 충돌을 없애 주지는 않습니다.
        </p>
        <p className="leading-7">
          coordinator는 dependency graph에서 준비된 work unit만 시작하고, 선행
          결과가 바뀌면 downstream contract를 갱신합니다. 동시성 상한은 API rate
          limit뿐 아니라 검증 capacity와 merge queue도 고려해 정합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          완료 보고가 아니라 artifact를 회수한다
        </h3>
        <p className="leading-7">
          조사 worker는 source와 file·line reference를, 구현 worker는
          diff·commit과 test result를 반환합니다. coordinator는 schema만 맞는지
          보는 데서 멈추지 않고 artifact가 존재하는지, test가 실제 변경을
          검증하는지 확인한 뒤 main agent에 전달합니다.
        </p>
        <p className="leading-7">
          실패와 budget exhaustion은 정상 종료와 다른 terminal state로 남깁니다.
          partial result에는 확인된 사실과 미확인 추론, 남은 작업을 구분하고,
          재시도할 때는 같은 범위를 무작정 반복하지 않고 실패 원인에 맞게
          contract를 좁힙니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          취소는 worker process와 권한까지 전파한다
        </h3>
        <p className="leading-7">
          사용자가 목표를 바꾸거나 main agent가 작업을 중단하면 queued job만
          지우는 것으로 부족합니다. 실행 중인 worker, child process, temporary
          credential과 writable workspace를 함께 회수해야 합니다. 늦게 도착한
          결과에는 generation ID를 붙여 현재 작업에 잘못 합쳐지지 않게 합니다.
        </p>

        <div id="paper-anthropic-multi-agent-research" className="scroll-mt-24">
          <CitationBlock
            source="Anthropic — How we built our multi-agent research system"
            href="https://www.anthropic.com/engineering/multi-agent-research-system"
            citeKey={2}
            type="paper"
          >
            <p>
              <strong>문제:</strong> 넓은 research task를 한 agent가 순차 탐색할 때
              생기는 coverage·context 한계를 다룹니다. <strong>기여:</strong>
              lead agent가 전략을 세우고 specialized subagent가 병렬 탐색한 뒤
              결과를 합치는 orchestrator-worker 구조와 운영 경험을 제시합니다.
              <strong>전제:</strong> research workload, 해당 model·tool·evaluation
              환경의 사례입니다. <strong>근거 범위:</strong> 역할 분해와 병렬 탐색의
              설계 근거입니다. <strong>일반화 금지:</strong> 모든 coding task에서
              비용·latency·품질이 개선되거나 Claw가 같은 runtime을 구현했다는 뜻은
              아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
