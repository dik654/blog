import ValidationViz from "./viz/ValidationViz";

const validationMoments = [
  {
    title: "Registration",
    body: "schema, dependency와 constraint가 서로 모순되지 않는지 확인합니다.",
  },
  {
    title: "Dispatch",
    body: "실제 worker capability와 resolved scope가 contract를 충족하는지 봅니다.",
  },
  {
    title: "Completion",
    body: "sandboxed verifier와 artifact evidence로 acceptance criteria를 판정합니다.",
  },
] as const;

export default function Validation() {
  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Task validation은 등록·실행·완료에서 서로 다른 질문을 한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          task contract를 한 번 validate했다고 실행과 완료까지 보장되는 것은
          아닙니다. 등록 시에는 명세가 well-formed인지, dispatch 시에는 선택한
          worker가 실제 scope를 수행할 권한이 있는지, 완료 시에는 결과가
          acceptance criteria를 만족하는지 확인합니다.
        </p>

        <div className="not-prose my-8">
          <ValidationViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {validationMoments.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
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
          등록 검증은 구조와 모순을 찾는다
        </h3>
        <p className="leading-7">
          goal과 acceptance criteria가 비어 있지 않은지, dependency가 존재하고
          cycle이 없는지, read-only constraint와 write deliverable이 충돌하지
          않는지 확인합니다. title 길이 같은 값 검증은 필요하지만, task가 실제로
          좋은 계획인지까지 보장하지는 않습니다.
        </p>
        <p className="leading-7">
          completion command를 task packet 안의 임의 shell 문자열로 저장하는
          방식은 또 하나의 code execution surface가 됩니다. 가능한 검증은 test
          ID, repository script와 structured assertion으로 참조하고, 새
          command가 필요하면 Bash와 동일한 permission·sandbox 경계를 거칩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          scope는 path pattern에서 실제 capability로 resolve한다
        </h3>
        <p className="leading-7">
          task의 include·exclude pattern과 team policy, worker capability를 합쳐
          effective scope를 계산합니다. exclude가 include보다 우선하며,
          symlink와 canonical path를 반영한 뒤 executor가 같은 scope를 강제해야
          합니다.
        </p>
        <p className="leading-7">
          permission이 부족하면 validator가 몰래 scope를 넓히지 않습니다. 작업을
          더 작은 deliverable로 나누거나 사용자에게 필요한 추가 권한과 이유를
          보여주고 새 decision을 받습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          완료 검증은 isolated verifier에서 실행한다
        </h3>
        <p className="leading-7">
          test와 lint, schema check는 worker가 작업한 environment와 분리된 clean
          checkout에서 실행해야 결과 조작과 숨은 상태 의존을 줄일 수 있습니다.
          verifier에는 필요한 read·execute capability만 주고 network와 secret은
          기본적으로 제거합니다.
        </p>
        <p className="leading-7">
          여러 criterion이 있으면 passed·failed·not-run을 각각 기록합니다.
          <code>PartiallyComplete</code>는 terminal success가 아니라 남은 항목을
          보여 주는 진행 상태이며, 자동 검증할 수 없는 조건은 owner와 review
          checklist가 있는 <code>ManualReview</code>로 보냅니다.
        </p>
      </div>
    </section>
  );
}
