import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — A(0.20,10ms,4GB) B(0.22,12ms,5GB) C(0.18,15ms,3GB) D(0.16,9ms,18GB).
 * 한도 16GB·100ms → D 제외. A는 B보다 세 값 모두 작음 → B 제외. A와 C는 서로 나은 축이 있어 함께 남음.
 * 막대는 축마다 따로 0부터 그린 실제 값이며, 지연 막대 축은 20ms까지만 그린다(한도 100ms는 축 밖).
 */
type Id = "A" | "B" | "C" | "D";
const IDS: readonly Id[] = ["A", "B", "C", "D"];

const VALUES: Record<Id, readonly [number, number, number]> = {
  A: [0.2, 10, 4],
  B: [0.22, 12, 5],
  C: [0.18, 15, 3],
  D: [0.16, 9, 18],
};

const AXES = [
  { name: "손실", unit: "", max: 0.25, fmt: (v: number) => v.toFixed(2) },
  { name: "지연", unit: "ms", max: 20, fmt: (v: number) => String(v) },
  { name: "메모리", unit: "GB", max: 20, fmt: (v: number) => String(v) },
] as const;

const MEMORY_LIMIT = 16;

const SCENES = [
  {
    label: "필수 한도",
    summary: "D: 18GB > 16GB → 제외",
    note: "메모리 16GB 이하, 지연 100ms 이하가 필수입니다(가정). 지연은 넷 모두 100ms보다 훨씬 작아 통과하지만, D는 손실이 0.16으로 가장 낮아도 메모리 18GB가 한도를 넘어 비교 전에 빠집니다.",
    pair: null,
  },
  {
    label: "A와 B를 축마다 비교",
    summary: "세 축 모두 A가 작음 → B 제외",
    note: "0.20<0.22, 10<12, 4<5입니다. B는 A보다 나은 축이 하나도 없으므로 A를 두고 B를 고를 이유가 남지 않습니다. 이렇게 모든 축에서 뒤지는 관계를 6절에서 지배(dominance)라고 부릅니다.",
    pair: ["A", "B"] as const,
  },
  {
    label: "A와 C를 축마다 비교",
    summary: "A는 지연, C는 손실·메모리 → 둘 다 남음",
    note: "C는 손실(0.18<0.20)과 메모리(3<4)가 좋고, A는 지연(10<15)이 좋습니다. 어느 쪽도 상대보다 모든 축에서 낫지 않으므로 A와 C가 함께 남고, 둘 중 선택은 11절의 사용 목적이 정합니다.",
    pair: ["A", "C"] as const,
  },
] as const;

function status(active: number, id: Id): { text: string; out: boolean } {
  if (id === "D") return { text: "제외 · 메모리", out: true };
  if (id === "B" && active >= 1) return { text: "제외 · A에 뒤짐", out: true };
  if (active === 2 && (id === "A" || id === "C")) return { text: "남음", out: false };
  return { text: "한도 통과", out: false };
}

export default function CandidateScreenViz() {
  return (
    <SceneShell
      eyebrow="네 후보 · 세 축 (가정)"
      title="한도로 D를 빼고, 축마다 비교해 B를 빼면 A와 C가 남습니다"
      description="모든 값은 작을수록 좋습니다. 막대 길이는 축마다 따로 0부터 그린 실제 값입니다. 지연 막대는 20ms까지만 그렸고 100ms 한도는 그 바깥에 있습니다."
      ariaLabel="네 후보 A B C D를 메모리 한도와 축별 비교로 거르는 과정"
      scenes={SCENES}
      render={(active) => {
        const pair = SCENES[active].pair;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {IDS.map((id) => {
                const s = status(active, id);
                const inPair = pair !== null && (pair as readonly Id[]).includes(id);
                return (
                  <div
                    key={id}
                    className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 ${
                      inPair ? "border-[#2563eb]" : s.out ? "border-dashed border-border" : "border-border"
                    }`}
                  >
                    <span className={`block text-sm font-bold ${s.out ? "text-muted-foreground line-through" : ""}`}>{id}</span>
                    <span className={s.out ? "text-[#b91c1c] dark:text-[#f87171]" : "text-muted-foreground"}>{s.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {AXES.map((axis, axisIndex) => (
                <div key={axis.name} className="min-w-0">
                  <p className="mb-1 text-xs font-bold">
                    {axis.name}
                    {axis.unit && <span className="font-normal text-muted-foreground"> ({axis.unit})</span>}
                    {axisIndex === 2 && <span className="font-normal text-muted-foreground"> · 점선 16GB 한도</span>}
                  </p>
                  <div className="space-y-1">
                    {IDS.map((id) => {
                      const value = VALUES[id][axisIndex];
                      const inPair = pair !== null && (pair as readonly Id[]).includes(id);
                      const dimmed = active === 0 ? axisIndex !== 2 && id !== "D" : !inPair;
                      const other = pair === null ? null : pair[0] === id ? pair[1] : pair[1] === id ? pair[0] : null;
                      const wins = other !== null && value < VALUES[other][axisIndex];
                      const over = axisIndex === 2 && value > MEMORY_LIMIT;
                      const width = Math.min(value / axis.max, 1) * 100;
                      const color = over && active === 0 ? "#dc2626" : wins ? "#2563eb" : "#94a3b8";
                      return (
                        <div key={id} className={`grid grid-cols-[1rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs ${dimmed ? "opacity-40" : ""}`}>
                          <span className="font-bold">{id}</span>
                          <div className="relative h-3 min-w-0 rounded-sm bg-muted/40">
                            <div className="h-full rounded-sm" style={{ width: `${width}%`, backgroundColor: color }} />
                            {axisIndex === 2 && (
                              <span
                                className="absolute top-[-2px] h-4 border-l border-dashed border-[#dc2626]"
                                style={{ left: `${(MEMORY_LIMIT / axis.max) * 100}%` }}
                              />
                            )}
                          </div>
                          <span className="text-right font-mono">
                            {axis.fmt(value)}
                            {wins ? " ◀" : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">파란 막대와 ◀ = 비교 중인 두 후보 가운데 그 축에서 더 작은 쪽</p>
          </div>
        );
      }}
    />
  );
}
