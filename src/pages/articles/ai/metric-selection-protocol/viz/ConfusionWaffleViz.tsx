import SceneShell from "./SceneShell";

/**
 * 본문 대응: #receipt — 1,000건 정규화 혼동행렬 TP 102, FN 18, FP 50, TN 830.
 * recall 102÷120=.85, 비용 18×2+50×0.1=41, 20만 건이면 positive 120×200=24,000 ≥ 4×5,000=20,000.
 * 칸 하나가 1건이고 세로 20칸씩 왼쪽부터 채웁니다.
 */
const PARTS = [
  { key: "TP", count: 102, name: "긴급을 잡음", color: "#2563eb" },
  { key: "FN", count: 18, name: "긴급을 놓침", color: "#dc2626" },
  { key: "FP", count: 50, name: "일반을 잘못 경보", color: "#d97706" },
  { key: "TN", count: 830, name: "일반을 일반으로", color: "#94a3b8" },
] as const;

const COLS = 50;
const ROWS = 20;
const CELL = 7;
const SIZE = 6;
const W = COLS * CELL;
const H = ROWS * CELL + 16;
const TOP = 16;

function squares(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset;
    const cx = Math.floor(index / ROWS) * CELL;
    const cy = TOP + (index % ROWS) * CELL;
    return `M${cx} ${cy}h${SIZE}v${SIZE}h-${SIZE}z`;
  }).join("");
}

const PATHS = PARTS.map((part, index) => ({
  ...part,
  d: squares(PARTS.slice(0, index).reduce<number>((sum, item) => sum + item.count, 0), part.count),
}));

type Key = (typeof PARTS)[number]["key"];

const SCENES: readonly { label: string; summary: string; note: string; lit: readonly Key[] }[] = [
  { label: "1,000건을 네 칸으로", summary: "102 + 18 + 50 + 830 = 1,000", lit: ["TP", "FN", "FP", "TN"], note: "실제 긴급(positive) 120건은 잡은 102건(TP)과 놓친 18건(FN)으로, 실제 일반 880건은 잘못 경보한 50건(FP)과 맞게 둔 830건(TN)으로 나뉩니다." },
  { label: "recall은 긴급 칸만 봅니다", summary: "102 ÷ 120 = 0.85", lit: ["TP", "FN"], note: "분모는 실제 긴급 120건입니다. 일반 880건은 전체 recall 계산에 들어가지 않습니다." },
  { label: "비용은 놓침과 경보에 값을 곱합니다", summary: "18 × 2 + 50 × 0.1 = 41", lit: ["FN", "FP"], note: "놓침 비용을 2, 잘못된 경보 비용을 0.1로 두었습니다. 건수는 경보가 50건으로 많아도 비용은 놓침이 36, 경보가 5입니다." },
  { label: "20만 건으로 키우면", summary: "120 × 200 = 24,000", lit: ["TP", "FN"], note: "실제 20만 건에서는 positive가 24,000건입니다. 네 언어 집단에 5,000건씩이면 합계 20,000건이므로 합계로는 4,000건이 남습니다. 합계가 넉넉해도 집단마다 5,000건을 채웠는지는 따로 봐야 하고, 못 채우면 보류합니다." },
];

const COST_SCALE = 40;

export default function ConfusionWaffleViz() {
  return (
    <SceneShell
      eyebrow="혼동행렬을 칸으로"
      title="1,000건이 네 칸으로 나뉘면 recall과 비용은 어디서 나오는가"
      description="outer-v3의 20만 건을 1,000건으로 정규화했고, 작은 칸 하나가 그중 1건입니다. 왼쪽부터 실제 긴급, 그다음이 실제 일반입니다. 혼동행렬 수치와 비용은 설명용 가정입니다."
      ariaLabel="1,000건을 TP, FN, FP, TN 칸으로 나누어 recall과 비용과 표본 수를 계산하는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto max-w-[560px] min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={0} y={11} fontSize={11} fontWeight={700} fill="#64748b">실제 긴급 120</text>
              <text x={W} y={11} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">실제 일반 880</text>
              {PATHS.map((part) => (
                <path key={part.key} d={part.d} fill={part.color} opacity={scene.lit.includes(part.key) ? (part.key === "TN" ? 0.45 : 1) : 0.12} />
              ))}
            </svg>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              {PARTS.map((part) => (
                <span key={part.key} className="flex min-w-0 items-center gap-1.5" style={{ opacity: scene.lit.includes(part.key) ? 1 : 0.45 }}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: part.color }} />
                  <span className="min-w-0 break-keep"><strong className="font-mono">{part.key} {part.count}</strong> {part.name}</span>
                </span>
              ))}
            </div>
            <div className="mt-3 min-h-[3.25rem] text-xs">
              {active === 2 && (
                <div className="space-y-1">
                  {[{ name: "놓침 36", value: 36, color: "#dc2626" }, { name: "경보 5", value: 5, color: "#d97706" }].map((bar) => (
                    <div key={bar.name} className="grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2">
                      <span className="font-semibold">{bar.name}</span>
                      <span className="h-3 rounded-sm" style={{ width: `${(bar.value / COST_SCALE) * 100}%`, backgroundColor: bar.color }} />
                    </div>
                  ))}
                </div>
              )}
              {active === 3 && (
                <div>
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: "5fr 5fr 5fr 5fr 4fr" }}>
                    {["5천", "5천", "5천", "5천"].map((text, index) => (
                      <span key={index} className="rounded-sm py-1 text-center font-semibold text-white" style={{ backgroundColor: "#2563eb" }}>{text}</span>
                    ))}
                    <span className="rounded-sm border border-dashed py-1 text-center font-semibold" style={{ borderColor: "#64748b", color: "#64748b" }}>4천</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">네 집단 최소 표본의 합 + 남는 몫 = 24,000건 (집단별 분포는 아님)</p>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
