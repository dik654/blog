import ContinuousMergeViz from "./viz/ContinuousMergeViz";
import MergeSummaryViz from "./viz/MergeSummaryViz";

const ACTUAL_MERGE = [
  [
    "기존 summary 인식",
    "첫 message가 system role이고 고정 continuation preamble로 시작할 때만 기존 compacted summary로 봅니다.",
  ],
  [
    "이전 highlight 추출",
    "Summary heading과 Key timeline 아래를 제외한 나머지 줄을 previous highlight로 가져옵니다.",
  ],
  [
    "새 구간 요약",
    "이번에 제거되는 raw message만 heuristic으로 요약하고 새 highlight와 새 timeline을 분리합니다.",
  ],
  [
    "평평하게 결합",
    "이전 highlight를 다시 ‘이전 summary’ 안에 중첩하지 않고 top level에 놓은 뒤 Newly compacted context와 새 timeline을 붙입니다.",
  ],
] as const;

const MERGE_POLICIES = [
  ["goal", "same identity", "처음 요청을 안정적인 goal ID와 함께 유지하고 표현만 바뀌었다고 새 goal로 만들지 않습니다."],
  ["auth evidence", "set by artifact digest", "같은 URI라도 digest가 다르면 새 evidence이며, 관찰 시각과 401 조건을 함께 보존합니다."],
  ["permission", "append-only decision", "operation·scope·decision·policy version을 event로 남기며, 최신 allow가 과거 deny 사실을 지우지 않습니다."],
  ["test receipt", "latest plus history", "최신 exit code를 현재 상태로 삼되 이전 성공·실패 receipt도 operation ID로 추적합니다."],
  ["hypothesis", "status transition", "open→rejected 또는 confirmed처럼 상태를 바꾸고, 같은 문장을 단순 dedupe하지 않습니다."],
] as const;

const CRASH_RECONCILIATION = [
  ["1 · 조회", "edit operation ID·idempotency key와 workspace content digest를 읽어 effect가 실제 반영됐는지 확인합니다."],
  ["2 · 분기", "after digest가 맞으면 edit를 반복하지 않고 missing ToolResult receipt만 복구합니다."],
  ["3 · 재검증", "permission policy version과 현재 scope를 다시 확인한 뒤 deterministic login test를 실행하고 새 receipt를 commit합니다."],
  ["4 · 중단", "before/after 어느 digest와도 맞지 않거나 외부 API 결과가 불명확하면 자동 재시도하지 않고 사람에게 넘깁니다."],
] as const;

export default function SummaryMerge() {
  return (
    <section id="summary-merge" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        두 번째 compaction에서는 이전 summary를 다시 중첩하지 않습니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          긴 로그인 디버깅은 한 번의 compaction으로 끝나지 않습니다. 첫 summary 뒤에 새 search, edit와 test가 쌓이면 runtime은 다시 오래된 구간을
          줄여야 합니다. 이때 이전 summary 전체를 새 summary의 한 항목으로 감싸면 압축할 때마다 “이전의 이전 context”라는 껍질이 늘고 정작 최신 401 실패는 더
          뒤로 밀립니다.
        </p>
        <p>
          Pinned 구현은 이 문제를 <strong>flattening</strong>, 즉 이전 highlight를
          같은 level로 끌어올리는 방식으로 줄입니다. 다만 문자열 줄을 합치는
          구현과 typed state merge는 같은 일이 아닙니다. 먼저 실제 동작을 본 뒤,
          permission과 test receipt에 필요한 보강 규칙을 구분하겠습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <MergeSummaryViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned source가 이전 summary를 알아보는 방법</h3>
        <p>
          첫 message가 system role이면서 다음 고정 문장으로 시작해야 기존 compact
          result로 인식합니다. <q>This session is being continued from a previous
          conversation that ran out of context. The summary below covers the earlier
          portion of the conversation.</q> 그 뒤의 “recent messages preserved” note와
          direct-resume instruction을 잘라낸 text가 merge 입력이 됩니다.
        </p>
        <p>
          이 parser는 XML schema나 versioned JSON을 읽지 않습니다. heading과 줄 prefix를 기준으로 highlight와 timeline을 구분할
          뿐입니다. 기존 timeline은 버리고 이번에 제거한 구간의 timeline만 넣습니다. 그래서 recursive nesting은 막지만 이전 timeline에만 있던 중요한
          permission denial을 구조적으로 찾아 보존하지는 못합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {ACTUAL_MERGE.map(([operation, behavior]) => (
          <div
            key={operation}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-sm font-bold text-primary">{operation}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{behavior}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>두 번째 cycle을 작은 예제로 펼쳐 봅니다</h3>
        <pre className="overflow-x-auto text-xs">
          {`previous highlights
- Scope: 8 earlier messages compacted.
- Current work: inspect auth middleware.
previous timeline
  - tool: read auth.ts

new highlights
- Current work: patch missing bearer prefix.
new timeline
  - tool: test exit=1; 401 remains.

merged
- Scope: 8 earlier messages compacted.
- Current work: inspect auth middleware.
- Newly compacted context:
  - Current work: patch missing bearer prefix.
- Key timeline:
  - tool: test exit=1; 401 remains.`}
        </pre>
        <p>
          기존 timeline은 highlight 추출 단계에서 제외되므로 merge 결과에 다시 들어가지 않고 이번 cycle의 timeline만 들어갑니다. 이전 highlight는
          그대로 top level에 남기 때문에 recursive “previous context 안의 previous context” 구조도 생기지 않습니다. 다만 두 Current
          work가 충돌한다는 사실을 text merge가 해결하지는 않으므로 desired typed state에서는 최신 revision을 별도 규칙으로 고릅니다.
        </p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>“Parser 실패 시 보존”은 현재 동작이 아니라 필요한 hardening입니다</h3>
        <p>
          Preamble이나 heading이 바뀌면 source는 이를 명시적인 parse error로
          반환하지 않습니다. 기존 summary를 알아보지 못하면 평범한 message처럼
          새 압축 후보에 섞일 수 있습니다. 따라서 production schema에는
          <code>summary_version</code>과 checksum을 두고, 지원하지 않는 version이나
          checksum mismatch가 나오면 기존 session을 그대로 유지해야 합니다.
          Migration은 old parser와 new parser가 같은 typed state를 복원하는 fixture로
          확인합니다.
        </p>
        <p>
          여기서 중요한 기준은 “잘 읽히는 문장이 나왔는가”가 아니라 “필수 field를 같은 identity로 다시 만들 수 있는가”입니다. parse가 성공해도 goal,
          permission decision, 마지막 test 실패가 누락됐다면 candidate를 채택하지 않습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ContinuousMergeViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Desired merge는 field마다 의미가 달라야 합니다</h3>
        <p>
          문자열 dedupe만으로는 “test 성공”과 그 뒤의 “test 실패”를 같은 반복으로
          오인하거나, 같은 파일의 서로 다른 revision을 하나로 합칠 수 있습니다.
          로그인 상태를 typed record로 올리면 각 field가 latest value인지,
          append-only event인지, identity 기반 set인지 명시할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {MERGE_POLICIES.map(([field, policy, detail]) => (
          <div
            key={field}
            className="grid min-w-0 gap-2 p-4 md:grid-cols-[8rem_10rem_minmax(0,1fr)] md:gap-5"
          >
            <code className="break-words text-xs font-bold text-primary">{field}</code>
            <p className="break-words text-xs font-semibold uppercase tracking-wide">{policy}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Adversarial transcript로 hard invariant를 먼저 확인합니다</h3>
        <p>
          예를 들어 오래된 구간에는 “credential file read 거부”와 최신 test의
          <code>exit=1, 401 remains</code>가 있고, 그 주변에는 “수정 완료”, “이전
          test 성공”이라는 더 짧고 눈에 띄는 문장이 있다고 해 보겠습니다.
          Candidate summary가 완료 문장만 보존하면 자연스럽지만 위험합니다.
          Permission denial, latest failure, unresolved state는 soft score가 아무리
          높아도 빠질 수 없는 hard invariant로 검사해야 합니다.
        </p>
        <p>
          같은 fixture를 여러 번 merge했을 때 goal ID와 evidence digest가 바뀌지
          않고, append-only receipt가 중복되지 않으며, latest status가 마지막
          event와 일치해야 합니다. 이 검사를 통과하지 못하면 old state를 유지하고
          새 summary는 격리된 artifact로 남깁니다.
        </p>

        <h3>Compaction 직전 crash는 summary merge로 해결할 수 없습니다</h3>
        <p>
          Agent가 planned operation ID와 idempotency key를 발급받아
          <code>auth.ts</code>를 수정했고 file write는 성공했지만, 그 결과를
          나타내는 ToolResult를 append하기 전에 process가 죽었다고 가정해
          보겠습니다. Session만 replay하면 edit가 없었던 것처럼 보이지만
          workspace에는 effect가 이미 남아 있습니다. 이때 같은 edit를 자동으로
          다시 실행하면 user change를 덮거나 중복 side effect를 만들 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {CRASH_RECONCILIATION.map(([step, detail]) => (
          <div
            key={step}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-xs font-bold text-primary">{step}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 reconciliation의 핵심은 context rollback과 effect rollback을 분리하는
          것입니다. Compaction article은 operation ID와 receipt를 context에 남기는
          요구까지 설명하지만, 실제 idempotent executor 설계는
          <a href="/ai/claw-tool-system"> tool system</a>, branch와 replay의 정본은
          <a href="/ai/claw-session"> session runtime</a>에서 이어집니다.
        </p>
      </div>
    </section>
  );
}
