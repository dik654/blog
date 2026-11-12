import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-separate — 손실·지연·메모리를 근거 없이 그대로 더하면 지연 단위만 바꿔도 순위가 바뀐다.
 * ms로 더하면 A 0.20+10+4=14.2, B 0.22+12+5=17.22, C 0.18+15+3=18.18 → A가 가장 작다.
 * 초로 더하면 A 0.20+0.010+4=4.21, B 0.22+0.012+5=5.232, C 0.18+0.015+3=3.195 → C가 가장 작다.
 */
type Row = { id: string; loss: number; latencyMs: number; memory: number };
const ROWS: readonly Row[] = [
  { id: "A", loss: 0.2, latencyMs: 10, memory: 4 },
  { id: "B", loss: 0.22, latencyMs: 12, memory: 5 },
  { id: "C", loss: 0.18, latencyMs: 15, memory: 3 },
];

const SCALE = 20;
const COLORS = { loss: "#7c3aed", latency: "#d97706", memory: "#64748b" } as const;

const SCENES = [
  {
    label: "지연을 ms로 적어 더하기",
    summary: "A 14.2 < B 17.22 < C 18.18",
    note: "0.20+10+4=14.2처럼 숫자만 더하면 지연(주황)이 합의 대부분을 차지하고, 합이 가장 작은 A가 1위로 보입니다. 단위 없이 그대로 더한 가정의 계산입니다.",
    seconds: false,
  },
  {
    label: "같은 지연을 초로 적어 더하기",
    summary: "C 3.195 < A 4.21 < B 5.232",
    note: "모델은 그대로이고 15ms를 0.015초로 적었을 뿐입니다. 이제 지연 몫은 거의 사라지고 메모리(회색)가 합을 좌우해, 1위가 A에서 C로 바뀝니다.",
    seconds: true,
  },
] as const;

function fmt(value: number) {
  return Number(value.toFixed(3)).toString();
}

export default function UnitSumViz() {
  return (
    <SceneShell
      eyebrow="A·B·C 값을 단순 합산 (가정)"
      title="지연의 단위만 바꿔도 합산 순위가 뒤집힙니다"
      description="막대 하나는 한 후보의 손실+지연+메모리 숫자 합이며 두 장면이 같은 축(0–20)을 씁니다. 작을수록 좋은 값이므로 합이 작은 후보가 1위입니다."
      ariaLabel="지연을 밀리초와 초로 적었을 때 세 후보의 합산 순위 비교"
      scenes={SCENES}
      render={(active) => {
        const seconds = SCENES[active].seconds;
        const parts = ROWS.map((row) => {
          const latency = seconds ? row.latencyMs / 1000 : row.latencyMs;
          return { ...row, latency, sum: row.loss + latency + row.memory };
        });
        const best = parts.reduce<number>((min, part) => Math.min(min, part.sum), Number.POSITIVE_INFINITY);
        return (
          <div className="min-w-0 space-y-3">
            {parts.map((part) => (
              <div key={part.id} className="grid grid-cols-[1rem_minmax(0,1fr)_6.5rem] items-center gap-2 text-xs sm:text-sm">
                <span className="font-bold">{part.id}</span>
                <div className="flex h-5 min-w-0 overflow-hidden rounded-sm bg-muted/40">
                  <div style={{ width: `${(part.loss / SCALE) * 100}%`, backgroundColor: COLORS.loss }} />
                  <div className="transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(part.latency / SCALE) * 100}%`, backgroundColor: COLORS.latency }} />
                  <div style={{ width: `${(part.memory / SCALE) * 100}%`, backgroundColor: COLORS.memory }} />
                </div>
                <span className={`text-right font-mono ${part.sum === best ? "font-bold text-[#2563eb]" : ""}`}>
                  {fmt(part.sum)}
                  {part.sum === best ? " · 1위" : ""}
                </span>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1 pt-1 text-xs text-muted-foreground sm:grid-cols-3">
              {parts.map((part) => (
                <span key={part.id} className="font-mono">
                  {part.id}: {part.loss.toFixed(2)} + {seconds ? part.latency.toFixed(3) : part.latency} + {part.memory}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: COLORS.loss }} />손실</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: COLORS.latency }} />지연 ({seconds ? "초" : "ms"})</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: COLORS.memory }} />메모리 (GB)</span>
            </div>
          </div>
        );
      }}
    />
  );
}
