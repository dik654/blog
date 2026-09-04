import TaskStatusViz from "./viz/TaskStatusViz";
import { CitationBlock } from "@/components/ui/citation";

const registryRecords = [
  {
    title: "Task spec",
    body: "goal, scope, constraints, dependency와 acceptance criteria를 보존합니다.",
  },
  {
    title: "Execution",
    body: "owner, attempt, lease와 현재 terminal state를 추적합니다.",
  },
  {
    title: "Evidence",
    body: "artifact reference, verifier result와 전이 이유를 남깁니다.",
  },
] as const;

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Task registry는 상태보다 전이의 근거를 소유한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          scheduler와 worker가 같은 task를 동시에 갱신할 때 task registry는 어떤 전이가 유효한지 판정합니다. owner와 attempt도, dependency와
          result도 한곳에서 함께 추적합니다. 작업을 담는 HashMap으로만 쓰기에는 몫이 큽니다. 상태 값만 저장하면 재시작이나 늦은 event가 들어왔을 때 왜 그 상태가 됐는지
          복구하기 어렵습니다.
        </p>

        <div className="not-prose my-8">
          <TaskStatusViz />
        </div>

        <div id="paper-claw-task-registry-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code task_registry.rs @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/task_registry.rs"
            citeKey={2}
            type="code"
          >
            <p>
              <strong>문제:</strong> task·lane·heartbeat 상태를 machine-readable
              projection으로 조회합니다. <strong>기여:</strong> pinned source는
              registry records, lane board와 freshness/status JSON surface를
              제공합니다. <strong>전제:</strong> 한 process의 canonical state와
              clock 입력을 고정합니다. <strong>근거 범위:</strong> source와
              same-commit test가 보이는 상태 projection입니다.
              <strong>일반화 금지:</strong> multi-instance transaction, durable
              lease·linearizable transition·crash-safe event log를 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {registryRecords.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
          >
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          create는 schema와 dependency graph를 함께 검증한다
        </h3>
        <p className="leading-7">
          task를 만들 때 필수 field와 scope를 검증하고 참조한 dependency가 존재하는지, cycle이 생기지 않는지 확인합니다. 단일 task의 self-
          reference 검사만으로는 여러 task에 걸친 cycle이 잡히지 않습니다. graph 전체를 기준으로 봐야 하는 이유입니다.
        </p>
        <p className="leading-7">
          client가 같은 create 요청을 재시도할 수 있으므로 idempotency key도 받습니다. 순차 번호만 발급하면 timeout 뒤 재시도에서 같은 작업이 두 개
          생깁니다. 생성 성공과 event 발행도 같은 transaction 경계로 묶거나 outbox를 사용해 누락을 줄입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          assign은 조회와 갱신을 한 operation으로 만든다
        </h3>
        <p className="leading-7">
          “다음 pending task를 찾고 나중에 worker를 기록”하면 두 scheduler가 같은 task를 가져갑니다. expected status와 version을 조건으로
          compare-and-set하거나 storage transaction 안에서 owner와 lease를 함께 갱신하는 편이 안전합니다.
        </p>
        <p className="leading-7">
          worker에는 영구 ownership보다 만료되는 lease를 주는 편이 복구하기 쉽습니다. heartbeat가 끊겼다고 바로 다른 worker에 재할당하지는 않습니다. 이전
          attempt의 side effect와 cancellation 여부를 확인한 뒤에 새 attempt를 발급합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          상태 전이에는 generation과 evidence를 붙인다
        </h3>
        <p className="leading-7">
          <code>Pending → Assigned → Running</code> 같은 happy path뿐 아니라
          blocked, cancelled, failed와 partial 같은 상태를 구분합니다. completed
          전이에는 verifier ID와 artifact reference가 필요하고, 이전 attempt에서
          늦게 온 event는 task version이 다르면 거부합니다.
        </p>
        <p className="leading-7">
          history에는 timestamp만 남기지 않습니다. actor와 previous version, reason, correlation ID까지 함께 기록합니다. 그래야
          audit뿐 아니라 recovery도 같은 정보를 사용해 재현 가능한 결정을 내립니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          in-memory와 durable storage의 경계를 명시한다
        </h3>
        <p className="leading-7">
          단일 process의 짧은 session에서는 in-memory registry가 단순하고 빠릅니다. 하지만 JSON snapshot을 가끔 저장하는 방식은 마지막 저장 이후
          전이와 부분 write를 잃을 수 있고 여러 instance가 같은 truth를 공유하지 못합니다. 이 한계는 기능 설명에 분명히 남깁니다.
        </p>
        <p className="leading-7">
          background scheduler와 cron, process restart까지 지원한다면 SQLite나 다른 durable store, append-only event log를
          고려합니다. storage backend가 달라져도 유효 전이와 lease, idempotency contract는 registry interface 안에 유지합니다.
        </p>

        <div id="paper-aws-transactional-outbox" className="scroll-mt-24">
          <CitationBlock
            source="AWS Prescriptive Guidance — Transactional outbox"
            href="https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html"
            citeKey={3}
            type="paper"
          >
            <p>
              <strong>문제:</strong> database state는 commit됐지만 event publish가
              실패하거나 반대 순서로 유령 event가 생기는 dual-write 문제를
              다룹니다. <strong>기여:</strong> business state와 outbox record를 한
              transaction에 쓰고 별도 relay가 publish하는 패턴을 설명합니다.
              <strong>전제:</strong> local transaction과 idempotent consumer가
              필요합니다. <strong>근거 범위:</strong> task transition과 event
              발행을 함께 복구하는 일반 설계입니다. <strong>일반화 금지:</strong>
              exactly-once delivery, Claw registry의 현재 구현이나 외부 effect
              rollback을 증명하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
