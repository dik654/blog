import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

const FLOW = [
  ["1 · RAW HISTORY", "요청과 실행 기록", "로그인 401 요청, 검색, 권한 판정, edit와 test 결과가 message history에 쌓입니다."],
  ["2 · SELECT", "보존 경계", "최근 turn과 끊으면 안 되는 ToolUse/ToolResult를 원문으로 남기고 그 앞부분을 줄일 후보로 고릅니다."],
  ["3 · PROJECT", "Compacted context", "오래된 기록을 작은 summary로 바꾸되 외부 artifact는 URI와 digest로 다시 찾게 합니다."],
  ["4 · VERIFY", "다음 행동 복원", "새 context만 보고 goal·근거·권한·수정·test·미해결 상태를 복원할 수 있을 때만 채택합니다."],
] as const;

const TERMS = [
  ["Raw history", "아직 줄이지 않은 system·user·assistant·tool message 배열"],
  ["Recent tail", "현재 작업의 세부 맥락을 위해 원문으로 유지하는 최근 message 구간"],
  ["Summary", "오래된 message에서 선택한 정보를 더 작은 text state로 투영한 결과"],
  ["Receipt", "어떤 edit나 test가 실제로 수행됐는지 식별하는 command·exit code·digest 같은 영수증"],
  ["Invariant", "Compaction 전후에 반드시 참이어야 하는 상태 보존 조건"],
] as const;

const LOGIN_STATE = [
  ["반드시 보존", "Goal", "로그인 401의 원인을 찾아 최소 수정하고 deterministic test로 확인한다."],
  ["반드시 보존", "Auth evidence", "secret을 redaction한 파일·로그 artifact의 URI, content digest와 어떤 401 조건을 뒷받침하는지"],
  ["반드시 보존", "Permission", "허용·거부된 operation, scope와 아직 승인을 기다리는 action"],
  ["반드시 보존", "Edit · test receipt", "수정 전후 digest, test command·cwd·exit code와 결과 artifact"],
  ["반드시 보존", "Unresolved state", "아직 재현되는 401, 기각되지 않은 가설과 다음 검증 행동"],
  ["원문 보존", "Recent turn", "현재 가설과 다음 action이 오가는 최근 message와 완전한 ToolUse/ToolResult pair"],
  ["줄일 수 있음", "Stale trace", "중복 search와 이미 요약된 설명; 긴 stdout은 redacted artifact URI·digest로 바꾸고 본문에서는 줄임"],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Compaction은 기록 삭제가 아니라 다음 행동을 위한 context 재구성입니다
      </h2>

      <ContentBoundary article="claw-compaction" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          사용자가 “로그인 버튼이 401을 반환하니 원인을 찾아 최소 수정하고 test로 확인해 달라”고 요청했다고 해 보겠습니다. agent가 파일을 읽고, 검색하고, 권한을 확인하고,
          수정과 test를 반복하면 message history는 빠르게 커집니다. 이때 단순히 앞부분을 지우면 token은 줄지만 어떤 파일을 왜 바꿨는지와 무엇이 아직 실패하는지도 함께
          사라질 수 있습니다.
        </p>
        <p>
          <strong>Compaction</strong>은 이 history를 다음 model request에 넣을 더
          작은 <strong>context state</strong>로 바꾸는 runtime 변환입니다. Model의
          weight를 바꾸거나 장기 기억을 만드는 일이 아니며, 원 transcript를
          lossless archive로 대체하는 기능도 아닙니다. Context의 일반적인 선택·
          memory·token budget은 <a href="/ai/context-engineering">context engineering</a>
          이 소유하고, 이 글은 pinned Claw Code 구현이 실제로 어떤 history를
          줄이는지와 그 구현에 어떤 검증을 더해야 하는지를 다룹니다.
        </p>
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-x-7 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        {FLOW.map(([label, title, detail]) => (
          <article key={label} className="min-w-0 border-l border-border pl-4">
            <p className="break-words font-mono text-[0.65rem] font-bold tracking-wide text-primary">
              {label}
            </p>
            <h3 className="mt-3 break-words text-sm font-bold">{title}</h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {detail}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 다섯 용어만 구분하면 됩니다</h3>
        <p>
          초심자가 가장 자주 헷갈리는 부분은 session 저장소, model context와
          실행 결과를 모두 “기억”이라고 부르는 것입니다. 이 글에서는 다음처럼
          구분합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {TERMS.map(([term, meaning]) => (
          <div
            key={term}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
          >
            <code className="break-words text-xs font-bold text-primary">{term}</code>
            <p className="break-words text-sm leading-6 text-muted-foreground">{meaning}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>실제 구현과 원하는 안전 계약을 같은 것으로 쓰지 않습니다</h3>
        <p>
          분석 대상은 독립 공개 Claw Code 재구현의 commit
          <code>b71afdd…</code>입니다. 이 snapshot의 compaction은 LLM에게
          자유 요약을 맡기지 않습니다. 오래된 message에서 role별 개수, tool 이름,
          최근 user request, 특정 keyword가 든 pending 문장, file candidate,
          current work와 짧은 timeline을 규칙으로 뽑습니다. 빠르고 재현 가능하지만,
          permission denial이나 edit/test receipt를 별도 typed field로 보존하는
          구현은 아닙니다.
        </p>
        <p>
          따라서 아래 ledger의 “반드시 보존” 항목은 현재 heuristic이 모두
          보장한다는 설명이 아니라, 로그인 작업을 안전하게 이어가기 위해
          추가해야 할 <strong>desired state contract</strong>입니다. 반면 stale
          trace는 원본 artifact를 다시 찾을 수 있을 때 context에서 줄일 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {LOGIN_STATE.map(([policy, field, detail]) => (
          <div
            key={field}
            className="grid min-w-0 gap-2 p-4 sm:grid-cols-[7rem_9rem_minmax(0,1fr)] sm:gap-4"
          >
            <p className={`break-words text-xs font-bold ${policy === "반드시 보존" ? "text-primary" : "text-amber-700 dark:text-amber-300"}`}>
              {policy}
            </p>
            <p className="break-words text-sm font-semibold">{field}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Context를 되돌려도 이미 발생한 effect는 되돌아가지 않습니다</h3>
        <p>
          Compaction이 바꾸는 것은 session의 message representation입니다. 이미
          실행한 <code>auth.ts</code> edit, process 실행이나 network request는
          workspace와 외부 시스템에 남습니다. 옛 context를 유지한다고 file이
          원래대로 돌아가지 않으며, summary에 “승인됨”이라고 적는다고 새 권한이
          생기지도 않습니다. Permission과 tool effect의 정본은 각각
          <a href="/ai/claw-permissions"> permission runtime</a>과
          <a href="/ai/claw-tool-system"> tool receipt</a>에 있어야 합니다.
        </p>
        <p>
          예를 들어 edit가 성공한 직후 ToolResult를 session에 저장하기 전에 process가 죽었다면, 다음 agent는 “결과 message가 없으니 edit를 다시
          실행한다”고 결정해서는 안 됩니다. stable operation ID와 before/after digest로 workspace effect를 조회하고, 완료 여부가 불명확하면
          사람에게 넘긴 뒤 test를 이어갑니다. compaction은 이 reconciliation을 대신하지 않습니다.
        </p>
      </div>

      <div
        id="paper-claw-compaction-runtime"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Pinned conversation auto-compaction runtime
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — conversation.rs at b71afdd…"
          citeKey={1}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/conversation.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Conversation loop가 누적 usage를 언제 확인하고 compacted session을 언제 채택하는지 확인해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Pinned source는 누적 input-token threshold, <code>maybe_auto_compact</code>, session 교체, compaction event와 다음 turn 전 glob health probe를 구현합니다.</p>
            <p><strong>전제·조건:</strong> 링크된 commit의 runtime·session·tool executor와 환경변수 parsing을 함께 읽은 snapshot입니다.</p>
            <p><strong>근거 범위:</strong> Auto trigger signal, recent-message 기본 정책, compacted session assignment와 liveness probe의 실제 동작을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> Glob probe가 goal·permission·receipt의 semantic fidelity를 검사하거나 candidate 실패 시 외부 effect까지 rollback한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이제 실제 변환 경로부터 따라갑니다</h3>
        <p>
          다음 절에서는 수동·auto·오류 복구 trigger를 분리한 뒤, pinned
          <code>compact_session</code>이 최근 tail과 tool pair 경계를 계산하고
          synthetic system summary를 만드는 과정을 한 단계씩 살펴봅니다. 그
          다음에는 반복 merge, line compressor와 semantic fidelity 평가를
          차례로 확장합니다.
        </p>
      </div>
    </section>
  );
}
