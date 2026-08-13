import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

const RECORD_TYPES = [
  {
    name: "작업일지 · artifact",
    question: "실제로 무엇을 관찰하고 실행했나?",
    owns: "재현 입력, command, log, failing output, test result",
    boundary: "원인이나 장기 원칙을 확정하지 않습니다.",
  },
  {
    name: "Changelog",
    question: "언제 무엇이 달라졌나?",
    owns: "검증을 마친 변화의 날짜, 결과, 영향, 근거 링크",
    boundary: "설계 대안과 긴 debugging transcript를 복제하지 않습니다.",
  },
  {
    name: "ADR",
    question: "왜 이 선택을 했나?",
    owns: "결정 당시 context, options, decision, consequences, status",
    boundary: "구현 진행률이나 매일의 작업 상태를 추적하지 않습니다.",
  },
  {
    name: "Lessons",
    question: "다음에도 적용할 판단 기준은 무엇인가?",
    owns: "현재 원칙, 적용 범위, 예외, 검증법, 근거 사건",
    boundary: "한 사건의 추측을 곧바로 보편 법칙으로 만들지 않습니다.",
  },
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        기록을 많이 쓰는 대신, 질문마다 정본 문서를 하나씩 둡니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          고객 프로필을 요약해 장기 memory에 반영하는 support agent를 운영한다고
          가정해 보겠습니다. 어느 날 compaction 결과가 비어 있었는데 writer가
          이를 정상 결과로 받아들여 기존 profile을 덮어썼습니다. 담당자는 failing
          input과 log를 모으고, 빈 결과면 갱신하지 않는 guard를 추가한 뒤 회귀
          test를 통과시켰습니다. 여기까지는 하나의 개발 작업이지만, 나중에 묻게
          될 질문은 하나가 아닙니다.
        </p>
        <p>
          “그 guard가 언제 들어갔지?”는 시간 질문이고, “왜 single JSON 대신
          profile별 파일로 바꿨지?”는 결정 질문이며, “다른 destructive update에도
          어떤 검증을 붙여야 하지?”는 재사용할 원칙에 관한 질문입니다. 이 답을
          commit message 하나에 모두 넣으면 검색하기 어렵고, 세 문서에 똑같이
          복사하면 곧 내용이 어긋납니다. 이 글은 각 질문에 하나의 소유자를 두고
          나머지는 링크로 연결하는 방법을 설명합니다.
        </p>
      </div>

      <ContentBoundary article="agent-devlog-patterns" />

      <div className="not-prose my-8 min-w-0">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 raw evidence와 해석 문서를 나눕니다</h3>
        <p>
          작업일지와 log는 그 순간의 관찰을 보존합니다. Changelog, ADR, Lessons는
          그 evidence를 사람이 찾고 판단하기 쉽게 편집한 문서입니다. 따라서
          agent가 “원인은 empty compaction이었다”고 요약했더라도 raw input,
          before/after state, failing test와 수정 후 test가 없으면 확정된 사실로
          승격하면 안 됩니다. 요약은 evidence의 주소를 가리켜야지 evidence를
          대신해서는 안 됩니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {RECORD_TYPES.map((item) => (
          <article
            key={item.name}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h4 className="break-words text-sm font-semibold">{item.name}</h4>
            <p className="mt-2 break-words text-xs font-medium">{item.question}</p>
            <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="font-semibold text-emerald-700 dark:text-emerald-300">
                  소유하는 것
                </dt>
                <dd className="mt-1 break-words text-muted-foreground">{item.owns}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold text-rose-700 dark:text-rose-300">
                  소유하지 않는 것
                </dt>
                <dd className="mt-1 break-words text-muted-foreground">{item.boundary}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>git log와 issue가 있어도 별도 진입점이 필요한 이유</h3>
        <p>
          git은 어느 파일이 어떻게 바뀌었는지 정확히 보존하고, issue는 작업의
          진행 상태를 추적하는 데 강합니다. 그러나 merge된 diff만으로는 검토했다
          제외한 option, 당시의 latency·보안·migration 제약, 여러 사건에서 뽑은
          현재 원칙을 곧바로 찾기 어렵습니다. 반대로 ADR이 commit을 대신하거나
          Lessons가 test artifact를 대신하는 것도 아닙니다. 각 시스템은 다른
          질문에 답하며 서로의 stable identifier를 링크합니다.
        </p>
        <p>
          고정 사례에서는 failing run을 <code>run-1842</code>, 수정 commit을
          <code>c8f…</code>, 회귀 test 결과를 <code>test-guard-empty-03</code>처럼
          가리킬 수 있습니다. Changelog는 이 artifact를 한 항목에서 연결하고,
          ADR은 storage 전환을 검토한 evidence로 해당 항목을 참조하며, Lessons는
          현재 guardrail의 근거로 사건과 ADR을 다시 연결합니다. identifier 형식은
          도구마다 달라도 “주장을 검증할 원문으로 돌아갈 수 있어야 한다”는 조건은
          같습니다.
        </p>
        <p>
          Stable ID는 artifact가 저장된 위치가 바뀌어도 같은 실행을 가리키는
          이름이고, digest는 파일 내용으로 계산한 짧은 fingerprint라서 나중에
          원문이 달라졌는지 확인하는 데 씁니다. 실행 기록에는 입력과 log뿐 아니라
          model·prompt·config version, before/after state, 실패한 test와 통과한 test를
          함께 묶습니다. 고객 원문과 secret은 원본 저장소에서 접근을 통제하고,
          일반 문서에는 redacted summary와 ID·digest만 노출합니다.
        </p>
        <p>
          같은 시점에 empty output이 관찰됐다는 사실만으로 그것이 유일한 원인이라고
          단정할 수는 없습니다. 해당 입력으로 실패를 재현하고 guard 적용 전후를
          비교해야 causal claim의 범위가 넓어집니다. 이 사례에서 “수정 완료”라고
          쓸 수 있는 시점도 미리 정한 empty·partial·full 회귀 test를 모두 통과하고
          기존 state 보존을 확인한 뒤입니다.
        </p>

        <h3>기반 개념은 정본 글로 연결합니다</h3>
        <p>
          이 글은 agent의 context나 memory 계산, harness의 실행 loop, evaluation
          설계를 다시 설명하지 않습니다. 아래 글에서 해당 개념을 읽고 돌아오면
          어떤 artifact를 남겨야 하는지 더 분명해집니다.
        </p>
      </div>

      <nav
        aria-label="에이전트 개발 기록의 선행 개념"
        className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2"
      >
        {[
          ["Context engineering", "/ai/context-engineering", "working state, memory, compaction의 차이"],
          ["LLM harness", "/ai/llm-harness", "objective·artifact·verification의 실행 경계"],
          ["Agent frameworks", "/ai/agent-frameworks", "tool loop, checkpoint, durable workflow"],
          ["Agent sandbox security", "/ai/agent-sandbox-security", "log·secret·tool effect의 보안 경계"],
        ].map(([label, href, description]) => (
          <Link
            key={href}
            to={href}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4 transition-colors hover:border-primary/50"
          >
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          </Link>
        ))}
      </nav>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례가 세 층으로 확장되는 순서</h3>
        <ol>
          <li>재현 log와 test artifact로 빈 compaction overwrite를 확인합니다.</li>
          <li>검증된 guard 추가를 Changelog의 짧은 결과로 기록합니다.</li>
          <li>저장 구조를 바꾸는 장기 선택은 ADR에서 option과 trade-off를 비교합니다.</li>
          <li>다른 destructive update에도 재사용할 조건이 생기면 Lessons로 일반화합니다.</li>
        </ol>
        <p>
          모든 작업이 네 단계를 거치는 것은 아닙니다. 대부분은 artifact와
          Changelog에서 끝나며, architecture에 영향을 주는 decision만 ADR이 되고,
          반복되거나 심각도가 높아 예방 가치가 분명한 판단만 Lessons로
          올라갑니다. 다음 절부터 이 한 사건이 각 문서에서 어떤 모양으로
          달라지는지 차례대로 살펴봅니다.
        </p>
      </div>
    </section>
  );
}
