import { CitationBlock } from "@/components/ui/citation";
import HeuristicFilterViz from "./viz/HeuristicFilterViz";
import SummaryCompressorViz from "./viz/SummaryCompressorViz";

const PRIORITIES = [
  ["0 · core", "Summary heading 또는 - Scope:, - Current work:, - Pending work:, - Key files referenced: 같은 고정 prefix"],
  ["1 · section", "colon으로 끝나는 section heading"],
  ["2 · bullets", "- 또는 들여쓴 - 로 시작하는 항목"],
  ["3 · other", "위 조건에 들지 않는 나머지 line"],
] as const;

const ACTUAL_HELPER = [
  ["Normalize", "각 line의 연속 whitespace를 한 칸으로 합치고 빈 line을 버립니다."],
  ["Truncate", "각 line을 max_line_chars 안으로 자르며 default snapshot은 160자입니다."],
  ["Dedupe", "잘린 line을 ASCII lowercase key로 비교해 같은 line을 한 번만 남깁니다."],
  ["Select", "priority 0→3 순서로 훑고 max_lines와 max_chars를 넘지 않는 line index를 선택합니다."],
  ["Notice", "예산에 공간이 남으면 ‘N additional lines omitted’ notice를 마지막에 넣습니다."],
] as const;

const FIDELITY_CHECKS = [
  ["Goal", "요청 identity와 ‘최소 수정 후 동일 test’라는 종료 조건이 그대로인가?"],
  ["Evidence", "auth log URI·digest·401 관찰이 모두 복원되는가?"],
  ["Policy", "permission denial과 policy version이 짧은 성공 문장에 덮이지 않았는가?"],
  ["Effect", "edit operation·before/after digest와 test command·exit code가 이어지는가?"],
  ["Unresolved", "최신 401 실패와 다음 검증 행동을 candidate만 보고 말할 수 있는가?"],
  ["Boundary", "ToolUse/ToolResult가 orphan 없이 남고 외부 effect를 다시 실행하지 않는가?"],
] as const;

const EVAL_PLAN = [
  ["고정 입력", "Base/candidate build의 full SHA를 receipt에 남기고 동일 transcript, workspace snapshot, permission policy, model/token estimator와 seed·config를 함께 사용합니다."],
  ["반복 깊이", "1·3·5회 compaction 뒤 상태를 각각 비교해 한 번에는 보이지 않는 누적 손실을 찾습니다."],
  ["Hard gate", "goal·permission·latest test failure·effect receipt·tool pair 중 하나라도 빠지면 token 절감과 무관하게 실패입니다."],
  ["Soft metrics", "context token, model latency, task completion, 사람 개입, 반복 tool/effect 수를 함께 봅니다."],
  ["배포", "Shadow canary에서 candidate를 만들되 base를 정본으로 유지하고, 사전 등록한 invariant 위반 threshold를 넘으면 candidate summary·state diff·metric artifact를 남기고 즉시 rollback합니다."],
] as const;

export default function SummaryCompression() {
  return (
    <section id="summary-compression" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        summary_compression.rs는 의미 요약기가 아니라 line budget helper입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이름만 보면 <code>compact_session</code>이 이 module을 호출해 두 번째
          semantic compression을 수행할 것처럼 보입니다. Pinned source는 그렇지
          않습니다. <code>summary_compression.rs</code>는 text를 line 단위로
          정규화하고, 중복을 제거하고, prefix priority와 문자 예산으로 일부 line을
          고르는 독립 helper입니다. Runtime의 <code>compact_session</code> 호출
          경로에는 연결되어 있지 않으며 <code>SummaryCompressor</code>라는 class도
          없습니다.
        </p>
        <p>
          이 차이는 단순한 이름 문제가 아닙니다. helper가 줄인 결과는 더 짧고 재현 가능하지만 “최신 login test 실패가 더 중요하다”는 의미를 이해하지 못합니다.
          actual source가 보장하는 것과 compaction fidelity를 위해 설계할 검증은 분리해서 읽어야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <SummaryCompressorViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>실제 helper의 기본 예산과 처리 순서</h3>
        <p>
          Default snapshot은 전체 1,200자, 최대 24개 line, line당 160자입니다.
          여기서 <strong>char budget</strong>은 model token budget과 다릅니다.
          Unicode 문자, tokenizer와 chat template에 따라 같은 1,200자도 token 수가
          달라지므로, 이 값만으로 provider request가 들어간다고 보장할 수 없습니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {ACTUAL_HELPER.map(([step, behavior]) => (
          <div
            key={step}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-xs font-bold text-primary">{step}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{behavior}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>작은 예제로 normalize와 dedupe를 직접 계산해 봅니다</h3>
        <p>
          입력에 <code>- Current work: fix login 401.</code>과 whitespace만 다른
          <code>- Current   work: fix login 401.</code>이 함께 있으면 먼저 공백이
          한 칸으로 정리됩니다. 그 뒤 lowercase key가 같으므로 두 번째 line은
          제거됩니다. 아주 긴 test output은 dedupe 전에 160자로 잘리고,
          <code>- CURRENT WORK:</code>처럼 ASCII 대소문자만 다른 line도 같은 key로
          취급됩니다.
        </p>
        <p>
          반면 <code>exit=0</code>과 <code>exit=1, 401 remains</code>는 서로 다른
          line이므로 둘 다 후보가 됩니다. 제한된 budget에서 무엇이 먼저 들어갈지는
          시간 순서가 아니라 아래 prefix priority가 결정합니다. 따라서 latest
          failure를 반드시 남기려면 별도 typed invariant가 필요합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {PRIORITIES.map(([priority, rule]) => (
          <div
            key={priority}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5"
          >
            <code className="break-words text-xs font-bold text-primary">{priority}</code>
            <p className="break-words text-sm leading-6 text-muted-foreground">{rule}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          selection은 priority별로 source order를 훑되 최종 출력은 선택된 원래 index 순서로 정렬됩니다. budget 때문에 빠진 line이 있어도
          notice를 넣을 공간이 없으면 omission 사실조차 출력되지 않을 수 있습니다. 이 module은 loss를 알려 주는 통계값을 반환하지만 누락된 의미를 복구하지는
          않습니다.
        </p>
        <pre className="overflow-x-auto text-xs">
          {`입력
Conversation summary:                 # priority 0
- Current   work: fix login 401.      # normalize 후 priority 0
- current work: FIX LOGIN 401.        # lowercase key 중복 → 제거
- Key timeline:                       # priority 1
  - tool: test exit=1; 401 remains.   # priority 2
<아주 긴 stdout 한 줄>                # 160자로 잘린 priority 3

예: max_lines=5, char budget은 core/header/bullet+notice까지만 허용
출력
Conversation summary:
- Current work: fix login 401.
- Key timeline:
  - tool: test exit=1; 401 remains.
- … 1 additional line(s) omitted.`}
        </pre>
        <p>
          이 예에서 whitespace collapse와 case-insensitive dedupe가 먼저 일어나고 긴 stdout은 per-line truncate 뒤에도 전체 char
          budget에 들어가지 못해 빠집니다. 공간이 남아 omission notice는 추가되지만, 무엇이 빠졌는지를 semantic fact로 설명하지는 못합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <HeuristicFilterViz />
      </div>

      <div
        id="paper-claw-summary-compression-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Pinned line-budget helper
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — summary_compression.rs at b71afdd…"
          citeKey={4}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/summary_compression.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 임의의 summary text를 제한된 문자·line budget 안에 재현 가능하게 맞출 helper가 필요합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Source는 whitespace normalize, per-line truncate, case-insensitive dedupe, prefix priority selection과 omission 통계를 순수 함수로 제공합니다.</p>
            <p><strong>전제·조건:</strong> 링크된 commit의 ASCII prefix와 character-count budget, default 1,200/24/160 snapshot에 한정됩니다.</p>
            <p><strong>근거 범위:</strong> Priority 0–3, line 선택 순서, duplicate·omitted·truncated 통계와 helper API의 실제 동작을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 이 파일이 <code>compact_session</code>의 semantic compressor이거나, typed fact를 이해하거나, 최신 failure·permission·effect receipt 보존을 보장한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Glob health probe와 semantic fidelity 검사는 목적이 다릅니다</h3>
        <p>
          Conversation runtime은 compaction record가 있는 session을 시작할 때
          <code>glob_search</code>에 결과가 없을 pattern을 보내 tool executor가
          응답하는지 확인합니다. 이것은 runtime과 tool plumbing의
          <strong>liveness probe</strong>입니다. 새 context가 login goal을 기억하는지,
          permission denial과 마지막 401을 보존했는지는 검사하지 않습니다.
        </p>
        <p>
          semantic fidelity를 확인하려면 candidate compacted state에서 아래 질문에 exact field로 답하게 한 뒤 원 session의 typed
          record와 비교합니다. model judge의 자연어 평가는 보조 지표로 둘 수 있습니다. permission과 effect receipt 같은 safety field는
          deterministic equality와 schema validation을 통과해야 합니다.
        </p>
        <p>
          artifact lookup은 secret이 redaction된 URI와 source digest를 사용하고 tool call/result identity는 ID까지 정확히
          비교합니다. candidate가 근거 없이 “로그인 수정 완료”를 만들어 내면 schema가 유효하더라도 실패입니다. 이때는 old context를 유지한 채 next-action
          replay가 실제 unresolved 401에서 test로 이어지는지 확인합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {FIDELITY_CHECKS.map(([field, question]) => (
          <div
            key={field}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-xs font-bold text-primary">{field}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{question}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>배포 전에는 base와 candidate를 1·3·5회 반복해서 비교합니다</h3>
        <p>
          압축률만 높이는 변경은 쉽게 좋은 결과처럼 보입니다. 평가에서는 현재
          production policy를 base, 새 selection·schema를 candidate로 두고 모든
          외부 조건을 고정합니다. 특히 compaction 직후 agent가 같은 edit를 다시
          실행했는지까지 세어야 token 절감이 duplicate effect 비용으로 바뀌는
          회귀를 잡을 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {EVAL_PLAN.map(([stage, detail]) => (
          <div
            key={stage}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-xs font-bold text-primary">{stage}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 평가를 통과해야 “context가 작아졌다”를 “작업을 안전하게 이어갈 수 있다”로 바꿔 말할 수 있습니다. source heuristic 자체는 존중하되
          production에서는 typed lineage, exact receipt 검증과 rollback 가능한 canary를 별도 계층으로 둡니다.
        </p>
      </div>
    </section>
  );
}
