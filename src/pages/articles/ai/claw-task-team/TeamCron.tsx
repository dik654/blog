import TeamCronViz from "./viz/TeamCronViz";
import { CitationBlock } from "@/components/ui/citation";

const schedulerRules = [
  {
    title: "Routing",
    body: "team scope와 capability가 task contract를 만족할 때만 후보가 됩니다.",
  },
  {
    title: "Concurrency",
    body: "worker 수뿐 아니라 file ownership과 verifier capacity를 함께 제한합니다.",
  },
  {
    title: "Overlap",
    body: "이전 cron run이 남아 있을 때 skip·queue·replace 중 정책을 명시합니다.",
  },
  {
    title: "Idempotency",
    body: "schedule ID와 logical run time으로 중복 task 생성을 방지합니다.",
  },
] as const;

export default function TeamCron() {
  return (
    <section id="team-cron" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Team은 실행 범위를 묶고 cron은 task를 생성한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          team은 worker pool과 capability, writable scope, concurrency policy를 묶는 실행 단위입니다. backend나 docs 같은
          이름표로 읽기 쉽지만 그렇지 않습니다. cron도 특정 시각마다 이 team을 직접 실행하지 않습니다. 검증 가능한 task contract를 생성해 동일한 registry와
          dispatch 경로에 넣는 producer입니다.
        </p>
        <p className="leading-7">
          두 개념을 분리하면 수동 task와 scheduled task가 같은 validation과
          permission을 통과합니다. cron template이 오래됐거나 team scope가
          바뀌어도 우회 경로로 실행되지 않습니다.
        </p>

        <div className="not-prose my-8">
          <TeamCronViz />
        </div>

        <div id="paper-claw-team-cron-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code team_cron_registry.rs @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/team_cron_registry.rs"
            citeKey={4}
            type="code"
          >
            <p>
              <strong>문제:</strong> team과 scheduled entry를 typed registry로
              표현하고 조회합니다. <strong>기여:</strong> pinned source의 실제
              records·validation·serialization 범위를 확인할 수 있습니다.
              <strong>전제:</strong> commit·clock·registry input을 고정합니다.
              <strong>근거 범위:</strong> in-memory registry와 test가 관찰한
              동작입니다. <strong>일반화 금지:</strong> timezone misfire, distributed
              claim, overlap cancellation과 exactly-once task creation을 모두
              구현했다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {schedulerRules.map((item) => (
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
          team matching은 tag보다 capability를 먼저 본다
        </h3>
        <p className="leading-7">
          task tag와 file pattern은 후보 team을 찾는 데 유용하지만 실제 배정은 required tool과 path, model class, isolation
          profile을 모두 만족해야 합니다. 여러 team이 가능하면 queue depth뿐 아니라 같은 file을 이미 수정 중인지, dependency가 걸린 task가 있는지
          확인합니다.
        </p>
        <p className="leading-7">
          team instruction은 worker의 context를 돕는 문서이지 enforcement가
          아닙니다. excluded path와 network 제한은 registry와 executor가 실제
          capability로 강제합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          cron parser보다 timezone과 misfire 정책이 중요하다
        </h3>
        <p className="leading-7">
          cron expression만 저장하면 daylight saving time이나 scheduler downtime, clock change에서 실행 의미가 모호해집니다.
          schedule과 함께 timezone과 start·end boundary를 저장합니다. misfire 때 건너뛸지 따라잡을지, 최대 지연은 얼마인지도 같이 적어 둡니다.
        </p>
        <p className="leading-7">
          scheduler loop는 polling 간격에 기대기보다 durable{" "}
          <code>next_run</code>을 기준으로 실행 시각이 된 job을 원자적으로
          선점(claim)합니다. 여러 scheduler instance가 있어도 한 logical run만
          task를 만들도록 schedule ID와 예정 시각을 idempotency key로
          사용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          이전 run이 끝나지 않았을 때의 동작을 정한다
        </h3>
        <p className="leading-7">
          maintenance와 dependency update는 실행 시간이 schedule 간격보다 길 수
          있습니다. job마다 <code>skip</code>, <code>queue</code>,
          <code>replace</code> 또는 제한된 병렬 실행 중 하나를 선택하고,
          replace는 이전 task cancellation과 cleanup이 확인된 뒤에만 시작합니다.
        </p>
        <p className="leading-7">
          cron이 만든 task도 당시 template version과 source revision을 기록합니다. 그래야 결과를 어느 정책과 코드에 따라 실행했는지 추적하고
          template 변경 뒤 오래된 queued task를 재검토합니다.
        </p>
      </div>
    </section>
  );
}
