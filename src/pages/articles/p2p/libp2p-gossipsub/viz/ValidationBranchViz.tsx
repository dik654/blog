import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release — Strict wire 검사 뒤 validate_messages 값에 따라 갈라지는 길.
 * false(기본) → local event + mesh 자동 forward.
 * true → memcache 대기 → Accept: forward / Reject: cache 삭제 + invalid delivery penalty /
 * Ignore: 삭제, penalty 없음 / 늦은 보고: cache에 없어 false 반환, forward 못함.
 */
type NodeId = "recv" | "strict" | "auto" | "wait" | "app" | "accept" | "reject" | "ignore" | "late";

const SCENES = [
  { label: "validate_messages = false (기본)", summary: "Strict 통과 → 자동 forward", path: ["recv", "strict", "auto"] as readonly NodeId[], note: "별도로 켜지 않으면 author·sequence number·signature 같은 wire 조건만 통과해도 local event로 전달되고 mesh로 자동 forward됩니다. 이미 forward된 message는 뒤에서 회수할 수 없습니다." },
  { label: "manual · Accept", summary: "대기 → 검사 통과 → forward", path: ["recv", "strict", "wait", "app", "accept"] as readonly NodeId[], note: "Manual application validation을 켜면 message는 memcache에서 기다립니다. Payroll schema, publisher authorization, timestamp, application signature, CID 형식을 검사한 뒤 Accept하면 forward합니다." },
  { label: "manual · Reject", summary: "cache 삭제 + invalid delivery penalty", path: ["recv", "strict", "wait", "app", "reject"] as readonly NodeId[], note: "Reject는 cache에서 지우고 invalid delivery penalty를 적용합니다. forward하지 않습니다." },
  { label: "manual · Ignore", summary: "cache 삭제 · penalty 없음", path: ["recv", "strict", "wait", "app", "ignore"] as readonly NodeId[], note: "Ignore도 cache에서 지우고 forward하지 않지만 invalid delivery penalty는 적용하지 않습니다." },
  { label: "manual · 너무 늦은 보고", summary: "cache에 없음 → false · forward 못함", path: ["recv", "strict", "wait", "app", "late"] as readonly NodeId[], note: "결과를 너무 늦게 보고해 message가 이미 cache에 없으면 함수는 false를 반환하고 forward하지 못합니다." },
] as const;

function Node({ id, path, title, sub, tone = "neutral" }: { id: NodeId; path: readonly NodeId[]; title: string; sub?: string; tone?: "neutral" | "good" | "bad" | "soft" }) {
  const on = path.includes(id);
  const color = tone === "good" ? "#16a34a" : tone === "bad" ? "#dc2626" : tone === "soft" ? "#d97706" : "#2563eb";
  return (
    <div
      className={`min-w-0 rounded-md border px-2 py-1.5 text-center text-xs leading-5 ${on ? "font-semibold" : "border-dashed border-border/60 text-muted-foreground/60"}`}
      style={on ? { borderColor: color, backgroundColor: `${color}14` } : undefined}
    >
      <span className="block">{title}</span>
      {sub && <span className={`block text-[11px] ${on ? "font-normal text-muted-foreground" : ""}`}>{sub}</span>}
    </div>
  );
}

function Arrow({ on }: { on: boolean }) {
  return <div className={`mx-auto h-3 w-px ${on ? "bg-[#2563eb]" : "bg-border"}`} />;
}

export default function ValidationBranchViz() {
  return (
    <SceneShell
      eyebrow="두 개의 검사 문"
      title="Strict 검사를 통과한 message가 forward되기까지의 갈림길"
      description="위에서 아래로 message가 지나는 순서입니다. 진한 테두리가 이번 장면의 경로이고 점선은 지나지 않는 칸입니다. validate_messages는 application 검사를 기다릴지 정하는 설정입니다."
      ariaLabel="validate_messages 설정과 Accept·Reject·Ignore·늦은 보고에 따른 forward 여부"
      scenes={SCENES}
      render={(active) => {
        const path = SCENES[active].path;
        const manual = path.includes("wait");
        return (
          <div className="min-w-0">
            <Node id="recv" path={path} title="peer에게서 message 수신" />
            <Arrow on />
            <Node id="strict" path={path} title="Strict wire 검사" sub="author · sequence number · signature" />
            <Arrow on />
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0">
                <p className={`mb-1 text-center font-mono text-[11px] ${manual ? "text-muted-foreground/60" : "font-bold text-[#2563eb] dark:text-[#93c5fd]"}`}>validate_messages = false</p>
                <Node id="auto" path={path} title="local event + mesh 자동 forward" tone="good" />
              </div>
              <div className="min-w-0">
                <p className={`mb-1 text-center font-mono text-[11px] ${manual ? "font-bold text-[#2563eb] dark:text-[#93c5fd]" : "text-muted-foreground/60"}`}>validate_messages = true</p>
                <Node id="wait" path={path} title="memcache에서 대기" />
                <Arrow on={manual} />
                <Node id="app" path={path} title="application 검사" sub="schema·권한·timestamp·서명·CID 형식" />
              </div>
            </div>
            <Arrow on={manual} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Node id="accept" path={path} title="Accept" sub="forward" tone="good" />
              <Node id="reject" path={path} title="Reject" sub="삭제 + penalty" tone="bad" />
              <Node id="ignore" path={path} title="Ignore" sub="삭제 · penalty 없음" tone="soft" />
              <Node id="late" path={path} title="늦은 보고" sub="false · forward 못함" tone="bad" />
            </div>
          </div>
        );
      }}
    />
  );
}
