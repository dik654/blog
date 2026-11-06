import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kubernetes-qos — 16 GiB 노드 전역 OOM에서 크기 항과 adj 항의 상대적 크기.
 * adj 한 칸 ⌊4,194,304 ÷ 1000⌋ = 4,194 page.
 * X 786,432 + 938×4,194 = 4,720,404 · Y 1,572,864 − 997×4,194 = −2,608,554 · Z 131,072 + 1000×4,194 = 4,325,072.
 */
const LOW = -4400000;
const HIGH = 5000000;
const pos = (value: number) => ((value - LOW) / (HIGH - LOW)) * 100;

const CANDIDATES = [
  { name: "X", qos: "Burstable", size: "3 GiB", base: 786432, adj: 938 },
  { name: "Y", qos: "Guaranteed", size: "6 GiB", base: 1572864, adj: -997 },
  { name: "Z", qos: "BestEffort", size: "0.5 GiB", base: 131072, adj: 1000 },
] as const;

const UNIT = 4194;

const SCENES = [
  { label: "크기만 보면 Y가 가장 큽니다", summary: "Y 1,572,864 page", mode: "base", note: "붙잡은 page 수만 비교하면 6 GiB를 쓰는 Y가 1등입니다. 이 막대가 점수의 크기 항입니다." },
  { label: "adj 항이 크기 항보다 큽니다", summary: "adj 한 칸 = 4,194 page", mode: "adj", note: "전역 OOM의 adj 한 칸은 4,194 page입니다. kubelet이 준 adj 938, −997, 1000을 곱하면 400만 안팎이 되어 크기 항을 압도합니다." },
  { label: "합하면 순서가 뒤집힙니다", summary: "X 4,720,404 → 먼저 죽음", mode: "sum", note: "X가 Z보다 395,332점 높아 먼저 죽습니다. Y는 6 GiB를 쓰고도 음수입니다. Burstable이라도 request보다 많이 쓰면 BestEffort보다 앞설 수 있습니다." },
] as const;

const format = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toLocaleString("en-US")}`;

export default function AdjOverwhelmViz() {
  return (
    <SceneShell
      eyebrow="전역 OOM의 세 후보"
      title="adj 항이 크기 항을 압도해 순서가 뒤집힙니다"
      description="세로선이 0점이고 가로 길이는 page 수입니다. 세 장면의 축척이 같아 막대끼리 바로 비교할 수 있습니다."
      note="swap 없는 16 GiB 노드, page table 무시, X의 memory request 1 GiB입니다. kubelet의 eviction이 제때 메모리를 되찾으면 이 OOM은 일어나지 않습니다."
      ariaLabel="세 컨테이너의 크기 항, adj 항, 합계 점수 비교"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        return (
          <div className="min-w-0 space-y-4">
            {CANDIDATES.map((item) => {
              const adjPart = item.adj * UNIT;
              const sum = item.base + adjPart;
              const value = mode === "base" ? item.base : mode === "adj" ? adjPart : sum;
              const left = pos(Math.min(0, value));
              const width = pos(Math.max(0, value)) - left;
              const color = mode === "base" ? "#64748b" : mode === "adj" ? "#d97706" : item.name === "X" ? "#dc2626" : "#2563eb";
              const formula = mode === "base" ? `${item.size} 사용` : mode === "adj" ? `adj ${item.adj > 0 ? "" : "−"}${Math.abs(item.adj).toLocaleString("en-US")} × 4,194` : item.name === "X" ? "최고점" : "합";
              return (
                <div key={item.name} className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
                    <span className="font-semibold">{item.name} · {item.qos} <span className="font-normal text-muted-foreground">({formula})</span></span>
                    <span className="font-mono font-bold">{format(value)}</span>
                  </div>
                  <div className="relative mt-1 h-6 rounded-sm bg-muted/40">
                    <div className="absolute inset-y-0 rounded-sm transition-all duration-300 motion-reduce:transition-none" style={{ left: `${left}%`, width: `${width}%`, backgroundColor: color }} />
                    <div className="absolute -inset-y-0.5 w-px" style={{ left: `${pos(0)}%`, backgroundColor: "#475569" }} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
