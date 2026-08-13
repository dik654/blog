import { CitationBlock } from "@/components/ui/citation";
import SessionStateViz from "./viz/SessionStateViz";

const PERSISTENCE_PATHS = [
  [
    "Message·prompt append",
    "기존 JSONL 끝에 한 record를 추가",
    "한 줄 append이며 full snapshot의 atomic replacement와 다른 경로",
  ],
  [
    "Full session save",
    "현재 record를 temporary file에 모두 쓴 뒤 rename",
    "한 file의 torn replacement를 줄이지만 fsync·multi-writer transaction은 별도",
  ],
  [
    "Rotation",
    "크기 정책을 넘은 기존 file을 옮기고 새 snapshot 저장",
    "고정 threshold와 보존 개수는 pinned snapshot의 값일 뿐 제품 불변식이 아님",
  ],
  [
    "Redaction·truncation",
    "민감하거나 지나치게 긴 JSONL field를 저장 단계에서 제한",
    "원 artifact bytes와 digest가 필요하면 별도 owner가 보존",
  ],
] as const;

const RESUME_CHECKS = [
  [
    "Workspace",
    "origin workspace, 현재 canonical root와 target path가 같은 작업을 가리키는가",
  ],
  [
    "Repository",
    "base commit·tree와 수정 전 file digest가 저장 당시 precondition과 같은가",
  ],
  [
    "Authority",
    "현재 policy·plugin/tool generation에서 같은 action이 여전히 허용되는가",
  ],
  [
    "Credential",
    "secret 값을 session에서 복원하지 않고 현재 credential store에서 다시 bind했는가",
  ],
  ["Artifact", "diff·test fixture·receipt의 digest와 접근 권한이 유효한가"],
] as const;

const SESSION_STATES = [
  ["Restoring", "JSONL과 snapshot을 읽고 schema·workspace·artifact를 검증"],
  ["Idle", "Durable state는 열렸지만 active turn은 없음"],
  ["Active", "한 writer가 turn을 진행하며 turn substate를 별도로 관리"],
  [
    "Pausing",
    "새 turn을 막고 cancellation·effect reconciliation·checkpoint 수행",
  ],
  ["Paused", "진행 중 effect가 없고 재개 가능한 durable point가 확인됨"],
  [
    "Draining",
    "Shutdown deadline까지 진행 중 작업을 마치고 이후 작업은 cancel",
  ],
  ["Closed · Failed", "자원을 회수했거나 transition 실패를 숨기지 않고 노출"],
] as const;

const FAILURE_MATRIX = [
  [
    "Persistence",
    "torn append · corrupt snapshot",
    "마지막 검증 가능한 record까지만 복원하고 silent success 금지",
  ],
  [
    "Workspace",
    "wrong-workspace alias resume",
    "write 차단 후 origin·current root와 artifact 재선택",
  ],
  [
    "Effect",
    "edit 뒤 result 전 crash · duplicate resume",
    "digest/status로 reconcile하고 blind replay 금지",
  ],
  [
    "Branch",
    "두 candidate의 같은 줄 충돌",
    "common base three-way merge와 post-merge test",
  ],
  [
    "Lifecycle",
    "pause·drain deadline 초과",
    "Failed 또는 bounded cancel을 보이고 checkpoint 성공을 꾸미지 않음",
  ],
] as const;

export default function SessionControl() {
  return (
    <section id="session-control" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        저장된 session과 실행 중 runtime의 lifecycle을 분리합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          JSONL file이 남아 있다는 사실은 login test process가 아직 실행
          중이라는 뜻이 아닙니다. 반대로 runtime을 종료했다고 session record가
          삭제되는 것도 아닙니다. Resume은 저장 record를 읽어 새 runtime을
          만드는 작업이고, pause·shutdown은 현재 실행 자원을 정리하는
          control입니다. 이 둘을 구분해야 “이어하기”가 이미 실행된 edit를 무심코
          반복하지 않습니다.
        </p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned SessionStore는 workspace별 namespace를 만듭니다</h3>
        <p>
          분석 대상 source의 <code>SessionStore</code>는 canonical workspace
          path를 fingerprint해{" "}
          <code>.claw/sessions/&lt;workspace_hash&gt;</code> 아래에 managed
          session을 둡니다. 명시적인 session ID나 path를 load할 때 저장된
          <code>workspace_root</code>가 현재 workspace와 다르면 mismatch로
          거부합니다. 이 분리는 같은 이름의 session file이 여러 project에서
          충돌하는 문제를 줄이지만 tenant authorization은 아닙니다.
        </p>
        <p>
          <code>latest</code>·<code>last</code>·<code>recent</code> 같은 alias는
          현재 namespace에 유효한 session이 없으면 다른 workspace까지 검색하고,
          workspace mismatch를 note로 알린 뒤 load할 수 있습니다. 편리한 검색
          규칙일 뿐 Project B에서 Project A의 file을 수정해도 된다는 승인이
          아닙니다. Cross-workspace alias resume에서는 실행 전에 target을 다시
          고르거나 unsafe write를 fail-closed해야 합니다.
        </p>
      </div>

      <div
        id="paper-claw-session-store-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Claw Code SessionStore
        </p>
        <CitationBlock
          source="Claw Code pinned session_control.rs"
          citeKey={6}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/session_control.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 여러 workspace의 managed session을 충돌
              없이 저장·조회·load·fork하고 explicit reference와 latest alias를
              해석해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned source는 workspace
              fingerprint namespace, SessionStore·handle, explicit/alias
              resolution, workspace validation과 fork persistence를 구현합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> 링크된 commit의 current·legacy path와
              caller를 함께 읽으며 alias convenience를 authorization으로
              해석하지 않습니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Managed path, current workspace 우선
              검색, cross-workspace latest fallback과 explicit reference 검증의
              실제 behavior를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Restoring·Paused·Draining·Closed
              lifecycle, distributed lease, branch merge와 cross-workspace write
              안전성이 구현됐다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>JSONL append와 atomic snapshot save의 보장 범위도 다릅니다</h3>
        <p>
          Pinned <code>session.rs</code>는 message와 prompt history record를
          기존 JSONL에 append합니다. 전체 session save는 temporary file을 만든
          뒤 rename하고, 크기 정책에 따라 기존 file을 rotation합니다. 저장
          field에는 redaction과 truncation도 적용됩니다. 따라서 “모든 write가
          atomic snapshot”이라고 설명해서는 안 됩니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {PERSISTENCE_PATHS.map(([path, action, boundary]) => (
          <div
            key={path}
            className="grid min-w-0 gap-2 p-4 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-5"
          >
            <p className="break-words text-sm font-semibold">{path}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {action}
            </p>
            <p className="break-words text-xs leading-5 text-muted-foreground">
              {boundary}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Temporary file과 rename은 한 file을 교체하다 찢어지는 위험을 줄이지만,
          directory fsync, disk loss, 두 process의 동시 save, schema
          migration이나 JSONL append와 filesystem edit의 원자성을 보장하지
          않습니다. Recovery test는 마지막 줄이 일부만 쓰인 경우, snapshot이
          손상된 경우와 rotation 중 crash를 따로 주입해야 합니다.
        </p>

        <h3>Resume은 record load 뒤 다섯 경계를 다시 검증합니다</h3>
        <p>
          명시적인 session ID를 Project B에서 열면 workspace mismatch 검사가
          걸리지만, <code>latest</code> alias는 Project A의 최근 session을 찾을
          수 있습니다. 어느 경로든 session key는 authorization이 아니므로,
          model이나 tool을 다시 호출하기 전에 아래 정보를 현재 환경에 맞춰야
          합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RESUME_CHECKS.map(([target, check]) => (
          <article
            key={target}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{target}</h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {check}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Process memory에 있던 provider connection, child process와 partial
          stream은 session file에서 되살릴 수 없습니다. 저장된 ToolUse만 있고
          ToolResult가 없다면 effect 상태를 먼저 조회하고, repository
          revision·target digest와 artifact receipt가 맞지 않으면 자동 write를
          거부해야 합니다.
        </p>

        <h3>아래 lifecycle은 필요한 hardening contract입니다</h3>
        <p>
          Pinned source에서 create·load·save·fork·delete·resume command와
          conversation loop는 확인할 수 있지만, 아래{" "}
          <code>Restoring → Idle → Active → Paused → Closed</code> 상태 머신
          전체는 확인되지 않습니다. 그림은 운영 환경에서 추가하고 failure
          injection으로 검증할 목표를 보여 줍니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <SessionStateViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Session lifecycle과 active turn substate를 두 층으로 둡니다</h3>
        <p>
          <code>CallingModel</code>, <code>AwaitingPermission</code>,
          <code>RunningTool</code>, <code>Verifying</code>은 Active session 안의
          turn 상태입니다. 반면 Restoring, Idle, Pausing, Paused, Draining,
          Closed는 새 turn을 받을 수 있는지와 runtime 자원 수명을 나타냅니다. 두
          층을 하나의 enum에 넣으면 “Paused인데 tool은 계속 실행 중” 같은 모순을
          검증하기 어렵습니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {SESSION_STATES.map(([state, meaning]) => (
          <div
            key={state}
            className="grid min-w-0 gap-1 p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
          >
            <code className="break-words text-xs font-bold text-primary">
              {state}
            </code>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {meaning}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Cancel·pause·resume·shutdown은 서로 다른 범위를 바꿉니다</h3>
        <p>
          <strong>Cancel</strong>은 active turn의 provider request나 tool
          process에 신호를 보내지만 durable session 자체를 닫지는 않습니다.
          <strong> Pause</strong>는 먼저 새 turn을 막고, 실행 중 login test에
          cancellation을 전달한 뒤 edit와 test effect를 reconcile하고
          checkpoint가 성공해야 완료됩니다. 그 전에는 Pausing 또는 Failed를
          보여야 합니다.
        </p>
        <p>
          <strong>Resume</strong>은 checksum·schema·workspace·artifact를
          확인하고 현재 credential, policy와 plugin을 다시 bind한 뒤 Idle로
          전환합니다.
          <strong> Shutdown</strong>은 새 입력 차단, bounded drain, deadline 뒤
          cancel, persist, plugin process·temporary file·lease 회수 순서로
          진행합니다. Persist나 release가 실패했다면 Closed로 꾸미지 않고 실패
          원인을 남겨야 합니다. Closed는 runtime resource를 정리했다는 뜻이며
          durable record를 delete했다는 뜻은 아닙니다.
        </p>

        <h3>Release는 paired failure-injection으로 검증합니다</h3>
        <p>
          Session hardening은 happy path 하나로 평가할 수 없습니다. Base와
          candidate의 full commit SHA를 고정하고, 같은 workspace snapshot, login
          요청, model, deterministic provider fixture, tool registry와
          permission policy를 사용합니다. 아래 fault를 각 crash cut에 주입해
          record/view, artifact와 recovery outcome을 함께 비교합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {FAILURE_MATRIX.map(([area, fault, expected]) => (
          <div
            key={area}
            className="grid min-w-0 gap-2 p-4 md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-5"
          >
            <p className="break-words text-sm font-semibold">{area}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {fault}
            </p>
            <p className="break-words text-xs leading-5 text-muted-foreground">
              {expected}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Candidate는 artifact/test receipt의 일관성과 recovery 성공률뿐 아니라
          latency와 storage 증가도 보고해야 합니다. Canary에서는 미리 정한
          corruption, duplicate effect, wrong-workspace write와 pause timeout
          허용치를 넘으면 즉시 base로 rollback하고, 실패한 session file,
          normalized trace, workspace diff와 fixture version을 보존합니다. 이
          paired test를 통과해도 모든 OS·filesystem·provider 조합의 production
          durability를 보장하는 것은 아닙니다.
        </p>
      </div>
    </section>
  );
}
