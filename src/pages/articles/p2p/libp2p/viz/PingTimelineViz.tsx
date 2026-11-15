import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #connection-poll "한 Ping trace의 시간 장부" — 설명용 고정 trace.
 * TCP 28 + Noise 17 + Yamux 4 + queue 6 + negotiation 3 + Ping RTT 42 = 100ms (순차 경로).
 * 누적: 45 → 49 → 58 → 100. 연결 재사용 시 TCP·Noise·Yamux가 빠지면 6 + 3 + 42 = 51ms.
 */
const PHASES = [
  { name: "TCP", ms: 28, color: "#64748b", reused: false },
  { name: "Noise", ms: 17, color: "#7c3aed", reused: false },
  { name: "Yamux", ms: 4, color: "#0f766e", reused: false },
  { name: "queue", ms: 6, color: "#d97706", reused: true },
  { name: "협상", ms: 3, color: "#2563eb", reused: true },
  { name: "Ping RTT", ms: 42, color: "#059669", reused: true },
] as const;

const TOTAL = PHASES.reduce<number>((sum, phase) => sum + phase.ms, 0);
const REUSED_TOTAL = PHASES.filter((phase) => phase.reused).reduce<number>((sum, phase) => sum + phase.ms, 0);

const SCENES = [
  {
    label: "사용자가 본 시간",
    summary: `총 ${TOTAL}ms`,
    upTo: 0,
    reuse: false,
    note: "사용자에게는 100ms 하나로 보입니다. 이 덩어리만으로는 어느 owner가 시간을 썼는지 알 수 없습니다.",
  },
  {
    label: "peer 인증까지",
    summary: "28 + 17 = 45ms",
    upTo: 2,
    reuse: false,
    note: "TCP connect 성공(28ms)과 expected Bob PeerId 인증 완료(Noise 17ms)를 따로 기록합니다. Socket이 붙었다는 것과 상대가 Bob이라는 것은 다른 timestamp입니다.",
  },
  {
    label: "connection 42 준비",
    summary: "45 + 4 = 49ms",
    upTo: 3,
    reuse: false,
    note: "Yamux 협상 4ms가 끝나야 connection 42를 Swarm에 등록할 공통 output이 준비됩니다.",
  },
  {
    label: "Handler가 Ping stream을 얻음",
    summary: "49 + 6 + 3 = 58ms",
    upTo: 5,
    reuse: false,
    note: "NotifyHandler enqueue 뒤 Handler가 받기까지의 queue 6ms와 /ipfs/ping/1.0.0 합의 3ms를 나눠 둡니다.",
  },
  {
    label: "Pong이 돌아옴",
    summary: "58 + 42 = 100ms",
    upTo: 6,
    reuse: false,
    note: "Bob과의 Ping round trip 42ms가 끝나야 nonce 7 요청의 완료 event가 납니다. 100ms 가운데 49ms는 연결을 만드는 데 쓰였습니다.",
  },
  {
    label: "연결을 재사용하면",
    summary: `6 + 3 + 42 = ${REUSED_TOTAL}ms`,
    upTo: 6,
    reuse: true,
    note: "connection을 재사용하면 TCP·Noise·Yamux 단계가 빠지고 queue·substream·Ping만 남을 수 있습니다. 같은 고정 수치라면 51ms입니다. 주소 후보를 병렬로 경주하면 단순 합보다 겹침이 생깁니다.",
  },
] as const;

export default function PingTimelineViz() {
  return (
    <StepSceneShell
      eyebrow="100ms 나누기"
      title="한 Ping의 100ms는 여섯 단계의 시간을 이어 붙인 것입니다"
      description="막대 길이가 시간(ms)입니다. TCP 28·Noise 17·Yamux 4·queue 6·협상 3·Ping RTT 42는 글의 설명용 고정 trace이며 실제 benchmark 수치가 아닙니다."
      ariaLabel="한 Ping trace 100ms를 단계별로 나눈 막대와 연결 재사용 시 51ms"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shown = PHASES.map((phase, index) => {
          if (scene.reuse && !phase.reused) return { ...phase, visible: false, lit: false };
          return { ...phase, visible: true, lit: index < scene.upTo };
        });
        const cumulative = PHASES.map((_, index) => PHASES.slice(0, index + 1).reduce<number>((sum, phase) => sum + phase.ms, 0));
        const ticks = scene.reuse ? [REUSED_TOTAL] : scene.upTo === 0 ? [TOTAL] : [cumulative[scene.upTo - 1]];
        return (
          <div className="min-w-0">
            <div className="relative h-5 text-[11px] font-bold sm:text-xs">
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-primary"
                  style={{ left: `${Math.min(Math.max((tick / TOTAL) * 100, 6), 94)}%` }}
                >
                  {tick}ms
                </span>
              ))}
            </div>
            <div className="flex h-9 w-full overflow-hidden rounded-md border border-border bg-background">
              {scene.upTo === 0 ? (
                <div className="h-full w-full bg-[#94a3b8]/40" />
              ) : (
                shown
                  .filter((phase) => phase.visible)
                  .map((phase) => (
                    <div
                      key={phase.name}
                      className="h-full border-r border-background transition-opacity duration-300 motion-reduce:transition-none"
                      style={{ width: `${(phase.ms / TOTAL) * 100}%`, backgroundColor: phase.color, opacity: phase.lit ? 0.85 : 0.18 }}
                    />
                  ))
              )}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground sm:text-xs">
              <span>0</span>
              <span>100ms</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2">
              {shown.map((phase) => (
                <div
                  key={phase.name}
                  className={`rounded-md border px-1.5 py-1 text-center text-[11px] leading-4 sm:text-xs ${
                    !phase.visible ? "border-dashed border-border/60 text-muted-foreground/50 line-through" : phase.lit ? "border-border bg-background" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  <span className="mr-1 inline-block h-2 w-2 rounded-sm align-middle" style={{ backgroundColor: phase.color, opacity: phase.visible ? 0.85 : 0.25 }} aria-hidden />
                  <span className="font-semibold">{phase.name}</span>
                  <span className="block font-mono">{phase.ms}ms</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
