import TcpSceneShell from "./TcpSceneShell";

/**
 * 본문 대응: #socket-creation — PortUse::Reuse는 listener의 local port를 outbound dial에 재사용해 보라는 best-effort 요청.
 * 재사용하려던 local address가 사라져 AddrNotAvailable이 나면 socket을 버리고 새 port로 한 번 다시 dial한다.
 * 요청한 PortUse와 실제 local port, fallback 여부를 같은 trace에 남긴다.
 */
type StepState = "on" | "off" | "fail";

const SCENES = [
  {
    label: "PortUse::New",
    summary: "새 local port로 connect",
    note: "이 dial의 DialOpts::port_use가 New라면 listener port와 상관없는 새 local port로 Bob에게 connect합니다.",
    steps: { reuse: "off", error: "off", retry: "off", fresh: "on" } as Record<string, StepState>,
    trace: { asked: "New", local: "새 port", fallback: "아니오" },
  },
  {
    label: "PortUse::Reuse · 재사용 성공",
    summary: "listener port로 connect",
    note: "Reuse는 listener의 local port를 이 outbound dial에도 써 보라는 요청입니다. 이번에는 그 local address에 bind할 수 있어 같은 port로 connect합니다.",
    steps: { reuse: "on", error: "off", retry: "off", fresh: "off" } as Record<string, StepState>,
    trace: { asked: "Reuse", local: "listener port", fallback: "아니오" },
  },
  {
    label: "PortUse::Reuse · 주소가 사라짐",
    summary: "AddrNotAvailable → 새 port로 한 번 재시도",
    note: "재사용하려던 local address가 사라져 AddrNotAvailable이 나면 그 socket을 버리고 PortUse::New로 한 번 다시 dial합니다. 요청은 Reuse였지만 실제로는 새 port를 썼습니다.",
    steps: { reuse: "on", error: "fail", retry: "on", fresh: "on" } as Record<string, StepState>,
    trace: { asked: "Reuse", local: "새 port", fallback: "예" },
  },
] as const;

const BOX: Record<StepState, { border: string; color: string; dash?: string; tag: string }> = {
  on: { border: "#2563eb", color: "#1d4ed8", tag: "지남" },
  off: { border: "#cbd5e1", color: "#94a3b8", dash: "dashed", tag: "안 지남" },
  fail: { border: "#dc2626", color: "#b91c1c", tag: "실패" },
};

function Step({ state, title, sub }: { state: StepState; title: string; sub: string }) {
  const style = BOX[state];
  return (
    <div
      className="rounded-lg border bg-background px-3 py-2 text-xs"
      style={{ borderColor: style.border, borderStyle: style.dash ?? "solid" }}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-semibold" style={{ color: style.color }}>{title}</span>
        <span className="shrink-0 font-mono text-[11px]" style={{ color: style.color }}>{style.tag}</span>
      </span>
      <span className="block text-muted-foreground">{sub}</span>
    </div>
  );
}

export default function PortReuseFallbackViz() {
  return (
    <TcpSceneShell
      eyebrow="요청과 실제"
      title="Reuse를 요청해도 실제로는 새 port를 쓸 수 있습니다"
      description="Alice가 Bob(203.0.113.7:4001)에게 거는 한 번의 dial입니다. 파란 칸이 실제로 지난 단계, 빨간 칸이 실패한 단계, 점선은 이번에 지나지 않은 단계입니다. 아래 줄은 trace에 남길 값입니다."
      ariaLabel="PortUse New, Reuse 성공, Reuse 실패 후 새 port 재시도 세 경우의 단계와 trace 값"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground">Reuse 갈래</p>
                <Step state={scene.steps.reuse} title="listener의 local port에 bind" sub="같은 port로 connect 시도" />
                <Step state={scene.steps.error} title="AddrNotAvailable" sub="그 local address가 사라짐 → socket 버림" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground">새 port 갈래</p>
                <Step state={scene.steps.retry} title="PortUse::New로 한 번 재시도" sub="Reuse 실패 뒤에만 지나감" />
                <Step state={scene.steps.fresh} title="새 local port로 connect" sub="→ 203.0.113.7:4001" />
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              {[
                ["요청한 PortUse", scene.trace.asked],
                ["실제 local port", scene.trace.local],
                ["fallback", scene.trace.fallback],
              ].map(([name, value]) => (
                <div key={name} className="rounded-md border border-border bg-muted/30 px-2 py-1.5">
                  <dt className="text-muted-foreground">{name}</dt>
                  <dd className="mt-0.5 font-mono font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}
