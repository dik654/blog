import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 후보 A 사례.
 * Clean .84 → .86 (+.02), low-light .75 → .71 (−.04), TTA 네 view low-light .73 (baseline보다 .02 낮음),
 * p95 latency 12ms → 31ms (+19ms). 축은 accuracy .68–.88.
 */
const AXIS_MIN = 0.68;
const AXIS_MAX = 0.88;

const W = 360;
const LEFT = 92;
const RIGHT = 20;
const ROW_H = 44;
const TOP = 26;
const sx = (v: number) => LEFT + ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (W - LEFT - RIGHT);

const BASE_COLOR = "#64748b";
const CAND_COLOR = "#2563eb";
const DROP_COLOR = "#dc2626";
const TTA_COLOR = "#d97706";
const GRID = "#94a3b8";

interface Row {
  name: string;
  base: number;
  cand: number;
  tta: number | null;
}

const ROWS: readonly Row[] = [
  { name: "Clean", base: 0.84, cand: 0.86, tta: null },
  { name: "Low-light", base: 0.75, cand: 0.71, tta: 0.73 },
];

const SCENES = [
  {
    label: "Clean validation",
    summary: ".84 → .86 (+.02)",
    rows: 1,
    tta: false,
    note: "원본 preprocessing만 거친 clean validation에서는 후보 A가 baseline보다 .02 높습니다.",
  },
  {
    label: "고정 low-light slice",
    summary: ".75 → .71 (−.04)",
    rows: 2,
    tta: false,
    note: "고정 low-light slice(어두운 조건의 고정 평가 집합)에서는 반대로 .04 떨어집니다. Clean에서 얻은 .02보다 큽니다.",
  },
  {
    label: "TTA 네 view를 켜면",
    summary: "low-light .73 · p95 12ms → 31ms",
    rows: 2,
    tta: true,
    note: "TTA(추론 때 여러 변형 view를 돌려 합침) 네 view로 .73까지 오르지만 baseline .75보다 .02 낮고, p95는 19ms 늘어납니다. 31ms가 예산 안인지는 사례에 없습니다.",
  },
] as const;

export default function CandidateScorecardViz() {
  return (
    <SceneShell
      eyebrow="후보 A 성적표"
      title="한 후보가 clean에서는 오르고 low-light에서는 내려갑니다"
      description="회색 점은 baseline, 파란 점은 후보 A(flip p=.5 → brightness ±.1 → normalize v3, seed 17)의 accuracy입니다. 가로축은 .68–.88만 잘라 그렸습니다."
      ariaLabel="후보 A의 clean, low-light accuracy와 TTA latency 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const svgH = TOP + ROWS.length * ROW_H + 8;
        return (
          <div className="min-w-0">
            <svg
              viewBox={`0 0 ${W} ${svgH}`}
              className="mx-auto h-auto w-full max-w-[560px]"
              role="img"
              aria-label={`${scene.label}: ${scene.summary}`}
            >
              {[0.7, 0.75, 0.8, 0.85].map((v) => (
                <g key={v}>
                  <line x1={sx(v)} x2={sx(v)} y1={TOP - 6} y2={svgH - 6} stroke={GRID} strokeWidth={0.5} strokeDasharray="2 3" />
                  <text x={sx(v)} y={TOP - 10} textAnchor="middle" fontSize={10} fill={BASE_COLOR}>
                    {v.toFixed(2).slice(1)}
                  </text>
                </g>
              ))}
              {ROWS.map((row, i) => {
                const y = TOP + i * ROW_H + ROW_H / 2;
                const shown = i < scene.rows;
                const drop = row.cand < row.base;
                const showTta = scene.tta && row.tta !== null;
                return (
                  <g key={row.name} opacity={shown ? 1 : 0.15}>
                    <text x={8} y={y + 4} fontSize={12} fontWeight={700} fill={BASE_COLOR}>
                      {row.name}
                    </text>
                    <line x1={sx(row.base)} x2={sx(row.cand)} y1={y} y2={y} stroke={drop ? DROP_COLOR : CAND_COLOR} strokeWidth={1.25} />
                    <circle cx={sx(row.base)} cy={y} r={5} fill={BASE_COLOR} />
                    <circle cx={sx(row.cand)} cy={y} r={5} fill={CAND_COLOR} />
                    <text x={sx(row.base)} y={y - 9} textAnchor="middle" fontSize={11} fill={BASE_COLOR}>
                      {row.base.toFixed(2).slice(1)}
                    </text>
                    <text x={sx(row.cand)} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={CAND_COLOR}>
                      {row.cand.toFixed(2).slice(1)}
                    </text>
                    {showTta && row.tta !== null && (
                      <g>
                        <rect x={sx(row.tta) - 4.5} y={y - 4.5} width={9} height={9} fill={TTA_COLOR} />
                        <text x={sx(row.tta)} y={y - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill={TTA_COLOR}>
                          {row.tta.toFixed(2).slice(1)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: BASE_COLOR }} />baseline</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: CAND_COLOR }} />후보 A</span>
              <span className={scene.tta ? "" : "invisible"} aria-hidden={!scene.tta}><span className="mr-1 inline-block h-2.5 w-2.5 align-middle" style={{ backgroundColor: TTA_COLOR }} />후보 A + TTA 네 view</span>
            </div>
            <div className={`mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-x-2 gap-y-1.5 text-xs sm:text-sm ${scene.tta ? "" : "invisible"}`} aria-hidden={!scene.tta}>
              <span className="text-muted-foreground">p95 · TTA 끔</span>
              <div className="h-3 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: `${(12 / 31) * 100}%`, backgroundColor: CAND_COLOR }} />
              </div>
              <span className="text-right font-mono">12ms</span>
              <span className="text-muted-foreground">p95 · TTA 4</span>
              <div className="h-3 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: "100%", backgroundColor: TTA_COLOR }} />
              </div>
              <span className="text-right font-mono">31ms</span>
            </div>
          </div>
        );
      }}
    />
  );
}
