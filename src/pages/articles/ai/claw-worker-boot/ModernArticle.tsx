import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { WorkerBootPathViz, WorkerEvidenceViz } from "./viz/ModernWorkerBootViz";

const SNAPSHOT = "b71afddae100ced324457337925a694686b8fef2";
const WORKER_SOURCE = `https://github.com/ultraworkers/claw-code/blob/${SNAPSHOT}/rust/crates/runtime/src/worker_boot.rs`;
const TRUST_SOURCE = `https://github.com/ultraworkers/claw-code/blob/${SNAPSHOT}/rust/crates/runtime/src/trust_resolver.rs`;

export default function ModernWorkerBootArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Claw worker를 작업 전달 경계부터</p>
          <h2 className="text-3xl font-bold tracking-tight">프로세스가 떠 있는 것과 prompt를 받을 준비가 된 것은 다르다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          외부 coding agent를 worker로 띄우면 운영체제는 곧바로 process ID를 돌려주지만, 화면에는 workspace trust 질문이나 tool permission 요청이 남아 있을 수 있습니다. 이때 task prompt를 보내면 coding agent가 아니라 shell이나 승인 화면에 입력될 수 있으므로, <strong>boot는 spawn이 아니라 ready handshake가 끝날 때까지</strong> 이어집니다.
        </p>
        <p>
          이 글은 Claw Code의 commit <code>b71afdd…</code>에 있는 in-memory worker boot state machine을 고정해 읽습니다. 실제 구현의 status·screen cue·replay 동작을 먼저 확인한 뒤, path identity·process generation·idempotency처럼 source에서 보장되지 않는 운영 hardening을 별도로 구분합니다.
        </p>
        <WorkerBootPathViz />
        <ContentBoundary article="claw-worker-boot" />
        <ExplainedFormula
          question="작업 prompt를 보내도 되는 순간을 한 조건으로 어떻게 표현할까?"
          idea={<>Process 생존만 보지 않고 ready cue, trust gate, tool permission gate가 모두 통과했을 때만 1이 되는 곱으로 읽습니다. 하나라도 0이면 전송하지 않습니다.</>}
          formula={String.raw`G_{send}=I_{alive},I_{ready},I_{trust},I_{tool}`}
          terms={[
            { symbol: "I_{alive}", name: "Process 생존 indicator", description: "Worker process가 종료되지 않았으면 1, 아니면 0입니다." },
            { symbol: "I_{ready}", name: "Ready 관찰 indicator", description: "Pinned detector가 coding-agent prompt surface를 ready로 분류했으면 1입니다." },
            { symbol: "I_{trust}", name: "Trust gate indicator", description: "Workspace trust 질문이 없거나 승인 처리됐으면 1입니다." },
            { symbol: "I_{tool}", name: "Tool gate indicator", description: "Tool permission prompt가 작업 입력을 가로막고 있지 않으면 1입니다." },
          ]}
          assumptions={["각 indicator는 같은 worker record와 같은 관찰 시점에 속합니다.", "이 식은 안전 조건을 설명하는 논리식이며 pinned source가 실제로 곱셈을 계산한다는 뜻은 아닙니다."]}
          interpretation="네 조건이 모두 참일 때만 send_prompt를 허용한다는 의미입니다. 값이 1이어도 원격 endpoint identity나 side effect의 exactly-once까지 보장되지는 않습니다."
        />
      </section>

      <section id="trust-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Trust gate</p><h2 className="mt-2 text-2xl font-bold">Pinned 구현은 path allowlist와 terminal cue로 trust 질문을 판별한다</h2></header>
        <p>
          Worker를 만들 때 registry는 <code>cwd</code>가 trusted root와 맞는지 확인해 <code>trust_auto_resolve</code>를 정합니다. 이후 화면에서 trust 문구를 찾으면 <code>TrustRequired</code> event를 남기며, allowlist에 맞은 worker는 gate를 자동으로 풀고 다시 <code>Spawning</code>으로 돌아갑니다. 수동 승인도 <code>resolve_trust</code>가 현재 status를 검사한 뒤 처리합니다.
        </p>
        <p>
          그러나 이 snapshot의 path matching은 정규화된 문자열의 exact·prefix 관계를 중심으로 하며 repository remote, commit, filesystem owner를 worker identity로 묶지 않습니다. 따라서 “이 경로는 예전에 승인됐다”와 “지금 이 checkout이 같은 code와 권한을 가진다”는 같은 명제가 아닙니다. Canonical path·repo identity·revision·owner를 함께 receipt에 넣고, hook·network·secret처럼 위험이 큰 capability는 다시 승인하는 절차는 <strong>추가 hardening</strong>입니다.
        </p>
        <div id="paper-claw-trust-resolver-source">
          <CitationBlock type="code" citeKey={1} source="Claw Code · pinned trust_resolver.rs" href={TRUST_SOURCE}>
            <p><strong>문제:</strong> terminal에서 workspace trust prompt를 발견하고 allow·manual approval·deny 정책으로 연결해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> 문구 cue와 path allowlist·denylist를 사용해 typed TrustEvent와 TrustDecision을 만듭니다.</p>
            <p><strong>중요 가정:</strong> commit b71afdd…의 문자열 matcher와 caller가 전달한 cwd·worktree 값을 기준으로 합니다.</p>
            <p><strong>근거 범위:</strong> 해당 source의 pattern matching, policy, event data model과 unit test에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Symlink-safe identity, signed repository, sandbox 또는 capability별 승인까지 구현됐다고 결론 내릴 수 없습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="observation" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Observation</p><h2 className="mt-2 text-2xl font-bold">Screen text는 관찰값이며 state의 완전한 증명이 아니다</h2></header>
        <p>
          <code>observe</code>는 화면 문자열에서 tool permission, trust, running, ready, prompt misdelivery cue를 차례로 찾습니다. Plain shell prompt는 ready로 인정하지 않는 test가 있지만, parser가 보는 것은 여전히 terminal text입니다. CLI version·locale·theme가 달라지거나 progress UI가 carriage return으로 갱신되면 false positive와 false negative가 생길 수 있습니다.
        </p>
        <WorkerEvidenceViz />
        <p>
          Startup timeout에서는 마지막 lifecycle state, pane command, prompt sent time, trust·tool prompt 관찰 여부, transport·MCP health를 <code>StartupEvidenceBundle</code>로 묶습니다. 이때 source의 typed health summary 문자열은 이름 그대로 <em>placeholder</em>입니다. 따라서 <code>transport_healthy=true</code>를 실제 round-trip probe나 MCP method 성공으로 확대해서는 안 되며, 배포 환경에서는 process exit·protocol acknowledgement·task receipt를 terminal cue보다 우선하도록 바꾸는 편이 안전합니다.
        </p>
      </section>

      <section id="prompt-delivery" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Prompt delivery</p><h2 className="mt-2 text-2xl font-bold">Ready에서만 보내지만 replay가 exactly-once를 만들지는 않는다</h2></header>
        <p>
          Pinned <code>send_prompt</code>는 status가 <code>ReadyForPrompt</code>가 아니면 거부합니다. 전송할 때 attempt 수를 늘리고 <code>prompt_in_flight</code>, 전송 시각, 마지막 prompt와 expected task receipt를 기록한 뒤 <code>Running</code>으로 바꿉니다. 이후 화면에 prompt가 shell에서 echo되거나 관찰한 cwd·receipt가 기대값과 다르면 misdelivery로 분류합니다.
        </p>
        <p>
          자동 복구가 켜져 있으면 마지막 prompt를 <code>replay_prompt</code>에 보관하고 status를 다시 Ready로 돌립니다. 이 동작은 재전송할 payload를 잃지 않는다는 뜻이지, 첫 전송이 아무 effect도 만들지 않았다는 증명이 아닙니다. Write task에는 stable operation ID와 worker generation을 붙이고, replay 전에 이전 attempt의 acknowledgement·artifact·side effect를 조회해야 중복 실행을 제어할 수 있습니다. 이 generation·deduplication 절차 역시 source 밖의 hardening입니다.
        </p>
        <div id="paper-claw-worker-boot-source">
          <CitationBlock type="code" citeKey={2} source="Claw Code · pinned worker_boot.rs" href={WORKER_SOURCE}>
            <p><strong>문제:</strong> Raw terminal 위에서 trust gate, ready handshake, prompt misdelivery와 startup timeout을 한 lifecycle로 추적해야 합니다.</p>
            <p><strong>핵심 아이디어:</strong> In-memory WorkerRegistry가 typed status·event·failure·task receipt와 replay payload를 함께 보존합니다.</p>
            <p><strong>중요 가정:</strong> commit b71afdd…의 cue detector, process 외부에서 공급되는 screen text와 단일 process memory를 전제로 합니다.</p>
            <p><strong>근거 범위:</strong> Status 전이, Ready 전송 gate, misdelivery detector, replay arm, evidence bundle과 unit test에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Durable registry, real transport/MCP probe, process generation, exactly-once effect 또는 descendant cleanup을 보장하는 production supervisor라고 볼 수 없습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 역검사와 배포</p><h2 className="mt-2 text-2xl font-bold">정상 boot보다 gate 충돌과 늦은 응답을 먼저 재생한다</h2></header>
        <p>
          이 글만으로 기초 여섯 문제를 풀 수 있어야 합니다. Spawn과 Ready의 차이, 실제 status, trust auto-resolution, cue 기반 observation, StartupEvidenceBundle, Ready-only send와 replay의 한계를 각각 설명할 수 있어야 합니다. 심화 문제는 path identity 공격, false ready, stale attempt, restart 뒤 late result를 failure injection으로 설계합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> 같은 commit·terminal fixture·cwd·task receipt에서 base와 candidate를 실행합니다. Trust prompt, tool permission prompt, plain shell prompt, ready cue, wrong cwd, wrong receipt, acceptance timeout과 restart 뒤 늦은 event를 주입한 다음 unauthorized send 0건, terminal state 1개, attempt별 evidence 보존, stale result 반영 0건을 확인합니다.
        </aside>
      </section>
    </article>
  );
}
