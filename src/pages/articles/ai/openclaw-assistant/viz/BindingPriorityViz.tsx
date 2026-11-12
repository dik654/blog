import SceneShell from "./SceneShell";

/**
 * 본문 대응: #routing-sessions "Binding은 접근 제어가 아닙니다".
 * 채널 정책 → 일치 후보 → 더 구체적인 match → 같은 구체성이면 config 순서 → 일치 없음.
 * binding 세 줄과 Agent 이름은 설명용 가정입니다.
 */
type RowState = "idle" | "match" | "lose" | "win" | "miss";

const BINDINGS = [
  { order: "1번째", rule: "channel = Telegram", agent: "assistant", level: "채널만" },
  { order: "2번째", rule: "channel = Telegram · peer = A", agent: "finance", level: "채널 + 발신자" },
  { order: "3번째", rule: "channel = Telegram · peer = A", agent: "support", level: "채널 + 발신자" },
] as const;

const SCENES = [
  {
    label: "채널 정책이 먼저",
    summary: "수락된 메시지만 binding으로",
    message: "Telegram · 사용자 A",
    gate: "수락",
    rows: ["idle", "idle", "idle"],
    result: "아직 Agent 미정",
    note: "Pairing·allowlist·account 정책이 메시지를 받아들일지 먼저 정합니다. 여기서 거부된 메시지는 binding 세 줄에 도달하지 않습니다. Binding은 수락된 메시지의 담당 Agent만 고릅니다.",
  },
  {
    label: "일치 후보",
    summary: "세 binding 모두 일치",
    message: "Telegram · 사용자 A",
    gate: "수락",
    rows: ["match", "match", "match"],
    result: "후보 3개",
    note: "Binding은 channel·account·peer 같은 이미 확인된 사실과 조건을 비교합니다. 이 메시지는 세 줄의 조건을 모두 만족합니다.",
  },
  {
    label: "더 구체적인 match",
    summary: "채널만 건 1번째 탈락",
    message: "Telegram · 사용자 A",
    gate: "수락",
    rows: ["lose", "match", "match"],
    result: "후보 2개",
    note: "구체적이라는 말은 조건이 더 좁다는 뜻입니다. 채널에 발신자까지 건 2·3번째가 채널만 건 1번째보다 구체적이므로 1번째는 config에서 먼저 나와도 밀려납니다.",
  },
  {
    label: "같은 구체성",
    summary: "config에 먼저 나온 2번째",
    message: "Telegram · 사용자 A",
    gate: "수락",
    rows: ["lose", "win", "lose"],
    result: "agentId: finance",
    note: "2·3번째는 조건 범위가 같습니다. 이때는 config에 먼저 나온 2번째가 이겨 finance가 선택됩니다.",
  },
  {
    label: "일치 없음",
    summary: "AGENT_SELECTION_REQUIRED",
    message: "Slack · 사용자 C",
    gate: "수락",
    rows: ["miss", "miss", "miss"],
    result: "AGENT_SELECTION_REQUIRED",
    note: "Agent가 여럿인데 일치하는 binding도 소유자 기본값도 없으면 Agent를 고르지 못한 상태로 끝납니다. 다른 Agent로 조용히 우회하지 않습니다.",
  },
] as const satisfies readonly { label: string; summary: string; message: string; gate: string; rows: readonly RowState[]; result: string; note: string }[];

const ROW_STYLE: Record<RowState, { box: string; tag: string; text: string }> = {
  idle: { box: "border-border/60 bg-background", tag: "text-muted-foreground/60", text: "비교 전" },
  match: { box: "border-[#2563eb] bg-background", tag: "text-[#2563eb]", text: "일치" },
  lose: { box: "border-dashed border-border bg-muted/30", tag: "text-muted-foreground", text: "밀려남" },
  win: { box: "border-[#16a34a] bg-[#16a34a]/10", tag: "text-[#15803d] dark:text-[#4ade80]", text: "선택" },
  miss: { box: "border-dashed border-border bg-background", tag: "text-muted-foreground", text: "불일치" },
};

export default function BindingPriorityViz() {
  return (
    <SceneShell
      eyebrow="Binding 우선순위"
      title="여러 binding이 일치하면 구체성, 그다음 config 순서로 고릅니다"
      description="왼쪽은 채널 정책을 통과한 메시지, 오른쪽은 config에 적힌 순서대로의 binding 세 줄입니다. 세 줄과 Agent 이름은 설명용 가정입니다."
      ariaLabel="Binding이 채널 정책 뒤에 구체성과 config 순서로 Agent를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const failed = scene.result === "AGENT_SELECTION_REQUIRED";
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <div className="min-w-0 space-y-2">
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-[11px] font-bold text-muted-foreground">들어온 메시지</p>
                <p className="mt-1 text-sm font-semibold">{scene.message}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-[11px] font-bold text-muted-foreground">채널 정책 (pairing·allowlist·account)</p>
                <p className="mt-1 text-sm font-semibold text-[#15803d] dark:text-[#4ade80]">{scene.gate}</p>
              </div>
              <div className={`rounded-lg border p-3 ${failed ? "border-[#dc2626]" : active >= 3 ? "border-[#16a34a]" : "border-border"} bg-background`}>
                <p className="text-[11px] font-bold text-muted-foreground">결과</p>
                <p className={`mt-1 break-words font-mono text-[11px] font-bold ${failed ? "text-[#b91c1c] dark:text-[#f87171]" : ""}`}>{scene.result}</p>
              </div>
            </div>
            <ol className="min-w-0 space-y-2">
              {BINDINGS.map((binding, index) => {
                const style = ROW_STYLE[scene.rows[index]];
                return (
                  <li key={binding.order} className={`rounded-lg border p-3 ${style.box}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground">config {binding.order} · {binding.level}</span>
                      <span className={`shrink-0 text-xs font-bold ${style.tag}`}>{style.text}</span>
                    </div>
                    <p className="mt-1 break-words font-mono text-xs">{binding.rule}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">→ agentId: {binding.agent}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }}
    />
  );
}
