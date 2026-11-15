import SceneShell from "./SceneShell";

/**
 * 본문 대응: #validate-finalize 두 문단 — ProcessProposal은 envelope 검사 뒤 newPayloadV3 결과로 갈린다.
 * INVALID → 거절, SYNCING·ACCEPTED → (VALID와 같지 않지만) 이 고정 구현은 후보 경로 계속, VALID → 계속.
 * Commit 뒤 Finalize는 같은 payload를 다시 newPayloadV3에 넣고, FCU가 VALID일 때까지 SYNCING·transport error를 retry,
 * 성공하면 head·safe·finalized = EP101.
 */
type Node = "envelope" | "newPayload" | "reject" | "continue" | "commit" | "finalNew" | "fcu" | "retry" | "pointers";

const SCENES = [
  {
    label: "Envelope 검사 실패",
    summary: "Engine 호출 전에 검증 중단",
    lit: ["envelope", "reject"] as readonly Node[],
    head: "H100",
    note: "Module authority, withdrawals 순서, no-witness, fee recipient, parent H100, block number, timestamp 범위, Random 값을 먼저 봅니다. Parent·height·withdrawals·timestamp가 다르면 Engine 실행 전에 proposal 검증이 멈춥니다.",
  },
  {
    label: "newPayloadV3 = INVALID",
    summary: "C101 거절",
    lit: ["envelope", "newPayload", "reject"] as readonly Node[],
    head: "H100",
    note: "검사를 통과한 P101을 execution client에 넣었는데 INVALID가 오면 proposal을 거절합니다. Candidate 단계의 거절이며 consensus는 아직 아무것도 commit하지 않았습니다.",
  },
  {
    label: "SYNCING · ACCEPTED",
    summary: "VALID 아님 · 그래도 후보 경로 계속",
    lit: ["envelope", "newPayload", "continue"] as readonly Node[],
    head: "H100",
    note: "SYNCING과 ACCEPTED는 VALID와 같은 판정이 아닙니다. 다만 initial sync 중인 node가 target head를 받을 수 있도록 이 고정 구현은 후보 경로를 계속합니다.",
  },
  {
    label: "newPayloadV3 = VALID",
    summary: "후보 경로 계속 · head는 H100 그대로",
    lit: ["envelope", "newPayload", "continue"] as readonly Node[],
    head: "H100",
    note: "VALID는 이 node의 execution client가 P101을 실행할 수 있다는 candidate 판정입니다. 이 단계만으로는 head·safe·finalized pointer가 움직이지 않아 아래 상자는 여전히 H100입니다.",
  },
  {
    label: "Commit 뒤 FCU = SYNCING",
    summary: "B101 commit · FCU retry",
    lit: ["commit", "finalNew", "fcu", "retry"] as readonly Node[],
    head: "H100",
    note: "CometBFT가 C101을 B101로 commit하면 Finalize mode가 같은 payload를 다시 newPayloadV3에 넣고 forkchoiceUpdatedV3를 부릅니다. SYNCING이나 transport error면 retry합니다. 그동안 B101은 commit됐어도 이 node의 execution head는 따라오지 못한 상태입니다. Retry가 언제 끝나는지는 보장되지 않습니다.",
  },
  {
    label: "FCU = VALID",
    summary: "head = safe = finalized = EP101",
    lit: ["commit", "finalNew", "fcu", "pointers"] as readonly Node[],
    head: "EP101",
    note: "FCU가 VALID를 반환해야 local head·safe·finalized가 모두 EP101로 전진합니다. 세 pointer를 같은 hash에 두는 것은 이 고정 Octane 구현의 정책입니다.",
  },
] as const;

function Step({ on, title, body, tone = "plain" }: { on: boolean; title: string; body: string; tone?: "plain" | "bad" | "good" | "loop" }) {
  const onBorder = tone === "bad" ? "#dc2626" : tone === "good" ? "#059669" : tone === "loop" ? "#d97706" : "#2563eb";
  return (
    <div
      className={`min-w-0 rounded-lg border px-2 py-1.5 text-[10px] leading-4 transition-colors sm:px-2.5 sm:py-2 sm:leading-5 duration-300 motion-reduce:transition-none sm:text-xs ${on ? "bg-background text-foreground" : "border-border text-muted-foreground/55"} ${tone === "loop" || tone === "bad" ? "border-dashed" : ""}`}
      style={on ? { borderColor: onBorder } : undefined}
    >
      <p className="break-all font-mono font-semibold">{title}</p>
      <p className="break-keep">{body}</p>
    </div>
  );
}

export default function EngineStatusPathViz() {
  return (
    <SceneShell
      eyebrow="P101 status별 경로"
      title="같은 P101도 어느 단계의 어떤 status냐에 따라 거절·계속·retry로 갈립니다"
      description="왼쪽은 commit 전 ProcessProposal, 오른쪽은 B101 commit 뒤 Finalize 경로입니다. 맨 아래 상자는 이 node execution client의 canonical head입니다. 진한 색 테두리 상자가 그 장면에서 지나는 단계입니다."
      ariaLabel="ProcessProposal의 newPayloadV3 status와 Finalize의 forkchoiceUpdatedV3 status에 따른 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lit = new Set<Node>(scene.lit);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="grid min-w-0 content-start gap-2">
                <p className="text-[11px] font-bold text-muted-foreground sm:text-xs">ProcessProposal · commit 전</p>
                <Step on={lit.has("envelope")} title="envelope 검사" body="parent H100 · height · withdrawals · timestamp 등" />
                <Step on={lit.has("newPayload")} title="newPayloadV3(P101)" body="execution client의 실행 판정" />
                <Step on={lit.has("reject")} tone="bad" title="거절" body={active === 0 ? "검사 불일치 · Engine 호출 전" : "INVALID"} />
                <Step on={lit.has("continue")} tone="good" title="후보 경로 계속" body={active === 2 ? "SYNCING·ACCEPTED (VALID 아님)" : "VALID 또는 SYNCING·ACCEPTED"} />
              </div>
              <div className="grid min-w-0 content-start gap-2">
                <p className="text-[11px] font-bold text-muted-foreground sm:text-xs">Finalize · commit 뒤</p>
                <Step on={lit.has("commit")} title="B101 Commit" body="CometBFT가 C101 순서 확정" />
                <Step on={lit.has("finalNew")} title="newPayloadV3(P101) 다시" body="같은 payload를 다시 넣음" />
                <Step on={lit.has("fcu")} title="forkchoiceUpdatedV3" body="canonical pointer 변경 요청" />
                <Step on={lit.has("retry")} tone="loop" title="↻ retry" body="SYNCING · transport error" />
              </div>
            </div>
            <div
              className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg border px-3 py-2 text-[11px] sm:text-xs"
              style={{ borderColor: lit.has("pointers") ? "#059669" : "#cbd5e1" }}
            >
              <span className="font-semibold text-muted-foreground">execution head · safe · finalized</span>
              <span className={`font-mono font-bold ${scene.head === "EP101" ? "text-[#047857] dark:text-[#34d399]" : ""}`}>
                {scene.head} · {scene.head} · {scene.head}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
