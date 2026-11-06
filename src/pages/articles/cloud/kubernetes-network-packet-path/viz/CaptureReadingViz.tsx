import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evidence — VXLAN 캡처에서 inner와 outer가 어디에 보이는지로 다음 조사 대상을 정한다.
 * 글은 "outer만 있고 remote inner가 없으면"까지만 말하므로 node B eth0은 그 장면에서 미확인으로 둡니다.
 */
type State = "seen" | "missing" | "unknown";

const STOPS = [
  { place: "node A · tunnel 뒤", packet: "inner · Pod IP" },
  { place: "node A · eth0", packet: "outer · UDP 4789" },
  { place: "node B · eth0", packet: "outer · UDP 4789" },
  { place: "node B · tunnel 뒤", packet: "inner · Pod IP" },
] as const;

const SCENES: ReadonlyArray<{ label: string; summary: string; states: readonly State[]; next: string; note: string }> = [
  {
    label: "정상 판독",
    summary: "outer와 inner 모두 보임",
    states: ["seen", "seen", "seen", "seen"],
    next: "이 구간은 정상",
    note: "VXLAN이면 eth0에서 UDP 4789의 outer packet(node 주소로 감싼 바깥 packet)이, tunnel 뒤에서 Pod IP의 inner packet(원래 packet)이 보입니다.",
  },
  {
    label: "inner만 있음",
    summary: "감싸는 단계와 길을 조사",
    states: ["seen", "missing", "missing", "missing"],
    next: "encapsulation·route",
    note: "inner만 있고 outer가 없으면 encapsulation(바깥 packet으로 감싸기)과 route를 조사합니다.",
  },
  {
    label: "상대 쪽 inner가 없음",
    summary: "물리망과 벗기는 지점을 조사",
    states: ["seen", "seen", "unknown", "missing"],
    next: "underlay ACL·MTU·decap",
    note: "outer는 있는데 상대 쪽 inner가 없으면 물리망의 ACL(통과 규칙), MTU, decap(바깥 packet을 벗기는 단계)을 조사합니다. node B eth0에 outer가 도착했는지는 이 판독만으로 정해지지 않아 “확인 필요”로 두었습니다.",
  },
];

const STATE_TEXT: Record<State, string> = { seen: "보임", missing: "안 보임", unknown: "확인 필요" };

export default function CaptureReadingViz() {
  return (
    <SceneShell
      eyebrow="캡처 판독"
      title="어느 지점에서 어떤 packet이 보이는지가 다음 조사 대상을 정합니다"
      description="아래 3번 점검의 캡처를 지도로 옮겼습니다. 위에서 아래로 packet이 지나는 네 지점이며, VXLAN 경로를 가정합니다."
      ariaLabel="VXLAN 경로의 네 지점에서 inner와 outer packet이 보이는 패턴과 다음 조사 대상"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div className="mx-auto max-w-xl">
            <ol className="space-y-1">
              {STOPS.map((stop, index) => {
                const state = item.states[index];
                return (
                  <li key={stop.place}>
                    {index === 2 && <p className="py-1 text-center text-xs leading-5 text-muted-foreground">↓ 물리망(underlay) ↓</p>}
                    <div
                      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 rounded-lg border px-2.5 py-1.5 ${
                        state === "seen" ? "border-blue-600" : state === "missing" ? "border-dashed border-red-600" : "border-dashed border-amber-600"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-5 sm:text-sm">{stop.place}</p>
                        <p className="font-mono text-xs leading-5 text-muted-foreground">{stop.packet}</p>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          state === "seen" ? "text-blue-700 dark:text-blue-300" : state === "missing" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {STATE_TEXT[state]}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 border-t border-border pt-2 text-xs leading-5 sm:text-sm">
              <span className="text-muted-foreground">다음에 볼 곳</span>
              <span className="font-bold">{item.next}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
