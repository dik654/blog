import ThreeLayersViz from "./viz/ThreeLayersViz";

const CLASSIFICATION = [
  {
    event: "재현 command·raw log·실패 output",
    home: "작업일지 / artifact store",
    trigger: "관찰 즉시 capture",
    link: "Changelog가 stable artifact ID를 참조",
  },
  {
    event: "검증을 마친 behavior·운영 변화",
    home: "Changelog",
    trigger: "완료 조건과 evidence가 확인됨",
    link: "commit·test·issue, 필요하면 ADR·Lessons",
  },
  {
    event: "구조·interface·보안·운영에 장기 영향",
    home: "ADR",
    trigger: "option과 consequence를 보존할 가치가 있음",
    link: "Changelog 사건과 implementation task",
  },
  {
    event: "반복되거나 severity가 큰 재사용 판단",
    home: "Lessons",
    trigger: "scope·exception·verification을 말할 수 있음",
    link: "사건, ADR, test를 evidence로 연결",
  },
  {
    event: "사용자 영향이 큰 production incident",
    home: "Postmortem / incident system",
    trigger: "팀이 미리 정한 incident 기준 충족",
    link: "Changelog와 Lessons는 요약·원칙만 참조",
  },
] as const;

const FAILURE_MODES = [
  ["복제된 사실", "같은 context를 세 문서가 소유해 수정 후 서로 달라짐", "한 정본만 남기고 다른 문서는 요약+link로 변경"],
  ["증거 없는 agent 요약", "실제 log에 없는 원인·수치·완료 상태가 문서에 들어감", "claim마다 artifact existence와 verification status 검사"],
  ["accepted=done 혼동", "ADR 채택만으로 migration과 rollout이 끝난 것으로 보임", "implementation task와 deployment evidence를 별도 상태로 연결"],
  ["stale decision", "context가 바뀌었는데 accepted ADR이 현재 rule처럼 남음", "revisit trigger와 superseding ADR link 점검"],
  ["secret·개인정보 노출", "prompt, customer message, token이 Changelog에 복사됨", "redacted summary와 access-controlled artifact ID만 공개"],
  ["link rot", "commit·run·issue가 이동하거나 권한이 사라져 근거를 못 찾음", "link checker와 archive/retention policy를 운영"],
] as const;

export default function ThreeLayers() {
  return (
    <section id="three-layers" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        작성은 evidence에서 시작하고, 조회는 질문에서 시작합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Changelog, ADR, Lessons는 모든 작업에 세 문서를 만들라는 checklist가
          아닙니다. 먼저 raw artifact를 보존하고 검증된 변화만 Changelog에
          올립니다. 그 변화 안에 significant decision이 있을 때 ADR을 만들고,
          다른 작업에도 재사용할 rule이 생겼을 때만 Lessons를 갱신합니다. 고정
          사례도 실제로는 하나의 Changelog, 하나의 ADR, 하나의 Lessons로
          이어졌지만 작은 guard 수정이었다면 Changelog에서 끝날 수 있었습니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <ThreeLayersViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>새 기록이 들어갈 위치를 먼저 판정합니다</h3>
        <p>
          문서 종류는 내용의 중요해 보이는 정도가 아니라 독자가 던질 질문으로
          고릅니다. raw observation과 verified result를 나누고, project-specific
          decision과 reusable rule도 나누면 같은 사건을 여러 번 설명하지 않아도
          됩니다.
        </p>
      </div>

      <div className="not-prose my-7 min-w-0 space-y-3">
        {CLASSIFICATION.map((item) => (
          <article
            key={item.event}
            className="grid min-w-0 gap-4 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,.8fr)_minmax(0,1fr)]"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary">{item.home}</p>
              <h3 className="mt-1 break-words text-sm font-semibold">{item.event}</h3>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Trigger</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.trigger}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Link rule</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.link}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례의 write path</h3>
        <ol>
          <li>
            <strong>Capture:</strong> before state checksum, empty compaction output,
            model·prompt version, failing test를 immutable run artifact로 보존합니다.
          </li>
          <li>
            <strong>Verify:</strong> empty·partial·full fixture로 guard behavior와 기존
            state 보존을 확인하고 완료 조건을 통과시킵니다.
          </li>
          <li>
            <strong>Publish change:</strong> 검증된 결과와 artifact link를
            Changelog에 기록합니다.
          </li>
          <li>
            <strong>Record decision:</strong> storage option을 같은 driver로 비교하고
            ADR-005의 status와 implementation task를 연결합니다.
          </li>
          <li>
            <strong>Generalize carefully:</strong> destructive derived update rule의
            scope, exception, test, revisit condition을 Lessons에서 소유합니다.
          </li>
        </ol>
        <p>
          agent가 이 흐름을 자동화할 때도 state transition을 명시해야 합니다.
          <code>captured → verified → published</code>는 evidence와 reviewer가 있어야
          진행되며, <code>candidate lesson → accepted rule</code>도 자동 요약만으로
          넘어가지 않습니다. 실패하면 기존 문서를 삭제하지 않고 draft 또는
          blocked 상태와 이유를 남깁니다.
        </p>

        <h3>read path는 질문에 따라 달라집니다</h3>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-3">
        {[
          ["언제 behavior가 바뀌었나?", "Changelog", "날짜 → 결과 → test/commit → 관련 ADR"],
          ["왜 profile별 파일을 골랐나?", "ADR-005", "context → options → decision → consequences"],
          ["지금 destructive update에 무엇을 적용하나?", "Lessons", "rule → scope/exception → verification → evidence"],
        ].map(([question, entry, path]) => (
          <article
            key={question}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <p className="break-words text-xs font-semibold text-muted-foreground">{question}</p>
            <h3 className="mt-2 break-words text-sm font-bold">{entry}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{path}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>운영 중 가장 먼저 무너지는 경계</h3>
        <p>
          기록 시스템의 품질은 문서 수보다 추적 가능성, current ownership,
          verification으로 판단합니다. 아래 failure는 문서가 많아져서가 아니라
          evidence와 해석, decision과 implementation, current rule과 history를
          섞을 때 생깁니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {FAILURE_MODES.map(([name, symptom, response]) => (
          <article
            key={name}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{name}</h3>
            <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="font-semibold text-rose-700 dark:text-rose-300">증상</dt>
                <dd className="mt-1 break-words text-muted-foreground">{symptom}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold text-emerald-700 dark:text-emerald-300">대응</dt>
                <dd className="mt-1 break-words text-muted-foreground">{response}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>review와 automation의 책임을 나눕니다</h3>
        <p>
          자동화하기 좋은 것은 날짜와 template 채우기, diff와 test artifact link
          수집, broken link와 duplicate heading 검사, secret pattern 탐지입니다.
          agent가 잘할 수 있는 일도 여기에 포함됩니다. 반면 decision driver의
          우선순위, causal claim, exception이 있는 domain rule, postmortem의
          contributing factor는 stakeholder review 없이 확정하면 안 됩니다.
        </p>
        <p>
          최소 review에서는 각 claim이 실제 artifact를 가리키는지, Changelog의
          결과가 검증됐는지, ADR의 negative consequence와 revisit trigger가
          있는지, Lessons의 scope와 counterexample이 있는지 확인합니다. 그 뒤
          artifact retention과 link permission을 주기적으로 점검하고, superseded
          ADR과 오래된 Lessons가 현재 guidance처럼 검색되지 않도록 status를
          노출합니다. 문서 경로를 옮겼다면 이전 URL이나 ID에 redirect·alias를
          남기고, 누가 어떤 evidence를 확인해 언제 publish를 승인했는지도 audit
          trail로 보존합니다.
        </p>

        <h3>처음 도입할 때 과거 기록을 전부 이관하지 않습니다</h3>
        <p>
          현재 작업부터 artifact ID와 짧은 Changelog를 남기고, 실제로 다시
          논의되는 과거 decision만 ADR로 복원합니다. 같은 질문이 두 번째로
          나타났을 때 Lessons 후보를 만들면 사용되지 않는 문서 hierarchy를 먼저
          설계하는 일을 피할 수 있습니다. 각 정본에는 관리할 owner를 정하고,
          팀의 release나 incident처럼 의미 있는 event 또는 미리 합의한 review
          주기에 맞춰 “질문 하나에 정본이 하나인가”, “link를 따라 evidence까지
          갈 수 있는가”, “rule에 test와 owner가 있는가”를 점검해 구조를
          조정합니다. 모든 팀에 같은 고정 주기를 강제할 필요는 없습니다.
        </p>
        <p>
          예를 들어 첫 30일을 도입 실험으로 잡는다면, 첫 주에는 현재 작업에
          artifact ID와 짧은 Changelog만 적용하고 기존 release note·RFC·runbook의
          소유 질문을 표로 정리합니다. 둘째 주부터 실제로 다시 논의되는 과거
          decision만 ADR로 복원하며, 반복되거나 severity가 큰 사례가 확인될 때만
          Lessons 후보를 만듭니다. 30일째에는 owner와 reviewer가 link의 존재·접근
          권한·retention, superseded·stale status의 노출, 중복 정본을 검사한 뒤 이
          방식의 유지 여부를 결정합니다. 이는 도입 예시이지 모든 팀의 고정
          일정은 아닙니다.
        </p>
        <p>
          세 층은 이 개인 project에 사용한 운영 pattern이지 보편 표준이
          아닙니다. 이미 release note, RFC, decision log, runbook, postmortem
          system이 있다면 새 이름을 추가하기보다 각각이 시간·결정·현재 원칙 중
          어느 질문을 소유하는지 매핑하고, 중복되는 문서는 link로 바꾸는 편이
          낫습니다.
        </p>
      </div>
    </section>
  );
}
