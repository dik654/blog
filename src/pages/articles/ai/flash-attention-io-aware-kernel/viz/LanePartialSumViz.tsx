import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 한 행을 네 lane이 나눠 맡을 때 row_sum은 lane별 부분합이다.
 * (가정) 각 조각의 첫 항은 lane 0, 둘째 항은 lane 1. 나머지 두 lane은 0.
 * 조각 1: [e⁻², 1, 0, 0] → row_scale e⁻² → [e⁻⁴, e⁻², 0, 0] → 조각 2 더하기 [e⁻⁴+e⁻³, e⁻²+1, 0, 0]
 * finalize width=4 합산: 0.068103 + 1.135335 = 1.203438, 반환값 1/1.203438 ≈ 0.830953.
 */
interface LaneScene {
  label: string;
  summary: string;
  note: string;
  values: readonly number[];
  shown: readonly string[];
  terms: readonly string[];
  total: string;
}

const SCENES: readonly LaneScene[] = [
  {
    label: "조각 1 · 기준 3",
    summary: "[e⁻², 1, 0, 0]",
    values: [0.135335, 1, 0, 0],
    shown: ["0.135335", "1", "0", "0"],
    terms: ["점수 1", "점수 3", "항 없음", "항 없음"],
    total: "아직 합치지 않음",
    note: "lane은 한 행을 나눠 맡은 실행 스레드 하나의 몫입니다. (가정) 첫 조각의 점수 1은 lane 0, 점수 3은 lane 1이 맡고 나머지 두 lane에는 항이 없습니다. 최대값 3은 네 lane 사이에서 합쳐 정합니다.",
  },
  {
    label: "기준 3 → 5 · row_scale",
    summary: "각 lane × e⁻²",
    values: [0.018316, 0.135335, 0, 0],
    shown: ["0.018316", "0.135335", "0", "0"],
    terms: ["e⁻² × e⁻²", "1 × e⁻²", "0 × e⁻²", "0 × e⁻²"],
    total: "아직 합치지 않음",
    note: "row_max_prev 3과 row_max_cur 5의 차이로 row_scale = e⁻²를 만듭니다. row_sum[r] × row_scale[r]은 행 전체 합이 아니라 lane마다 따로 쥔 부분합에 곱해집니다.",
  },
  {
    label: "조각 2 더하기",
    summary: "[e⁻⁴+e⁻³, e⁻²+1, 0, 0]",
    values: [0.068103, 1.135335, 0, 0],
    shown: ["0.068103", "1.135335", "0", "0"],
    terms: ["+ 점수 2 → e⁻³", "+ 점수 5 → 1", "항 없음", "항 없음"],
    total: "아직 합치지 않음",
    note: "lane 1의 1.135335는 첫 조각의 ℓ와 숫자가 같지만, 여기서는 lane 하나의 부분합입니다. 이 칸 하나를 행 전체 ℓ로 읽으면 lane 0의 0.068103을 빠뜨립니다.",
  },
  {
    label: "finalize · width=4 합산",
    summary: "합 1.203438",
    values: [0.068103, 1.135335, 0, 0],
    shown: ["0.068103", "1.135335", "0", "0"],
    terms: ["", "", "", ""],
    total: "0.068103 + 1.135335 = 1.203438",
    note: "마무리 함수 finalize가 width=4로 네 lane의 값을 합쳐야 행 전체 지수합 1.203438이 됩니다. 추가 가중치와 별도 배율이 없는 이번 조건에서 반환값은 그 역수 약 0.830953입니다. 이후 row_sum 칸은 로그 지수합으로 덮어씁니다.",
  },
];

const W = 360;
const BASE_Y = 132;
const TOP_Y = 50;
const MAX = 1.2;
const COL_W = 78;
const BAR_W = 34;
const LEFT = 18;
const colX = (lane: number) => LEFT + lane * (COL_W + 8);
const LANE_COLOR = ["#2563eb", "#2563eb", "#94a3b8", "#94a3b8"] as const;

export default function LanePartialSumViz() {
  return (
    <SceneShell
      eyebrow="lane별 부분합"
      title="row_sum 한 칸은 행 전체가 아니라 lane 하나의 몫입니다"
      description="막대 하나가 lane 하나의 row_sum입니다. 점수 [1, 3, 2, 5]와 기준 3→5를 그대로 쓰며, 항을 lane에 나눈 방식은 산술 확인용 가정입니다."
      note="부분합의 논리적 배정이며 실제 GPU 배치를 실행한 결과가 아닙니다."
      ariaLabel="네 lane의 row_sum 부분합이 기준 이동과 둘째 조각을 거쳐 finalize에서 합쳐지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const merged = active === SCENES.length - 1;
        const h = (v: number) => (v / MAX) * (BASE_Y - TOP_Y);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 166`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={LEFT - 6} x2={W - 8} y1={BASE_Y - h(1)} y2={BASE_Y - h(1)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={W - 8} y={BASE_Y - h(1) - 4} textAnchor="end" fontSize={10} fill="#64748b">1</text>
              {scene.values.map((value, lane) => {
                const x = colX(lane);
                const cx = x + COL_W / 2;
                return (
                  <g key={lane}>
                    <rect x={x} y={14} width={COL_W} height={BASE_Y - 14} rx={6} fill="none" stroke={merged ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                    <text x={cx} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">lane {lane}</text>
                    {value > 0 && (
                      <rect x={cx - BAR_W / 2} y={BASE_Y - h(value)} width={BAR_W} height={h(value)} rx={2} fill={LANE_COLOR[lane]} opacity={0.8} />
                    )}
                    <text x={cx} y={BASE_Y - Math.max(h(value), 0) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={value > 0 ? "#1d4ed8" : "#64748b"}>
                      {scene.shown[lane]}
                    </text>
                    <text x={cx} y={BASE_Y + 16} textAnchor="middle" fontSize={10} fill="#64748b">{scene.terms[lane]}</text>
                  </g>
                );
              })}
              <line x1={LEFT - 6} x2={W - 8} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
              {merged && (
                <path d={`M ${colX(0) + COL_W / 2} ${BASE_Y + 22} V ${BASE_Y + 28} H ${colX(3) + COL_W / 2} V ${BASE_Y + 22}`} fill="none" stroke="#2563eb" strokeWidth={1} />
              )}
            </svg>
            <div className={`mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg border px-3 py-2 text-sm ${merged ? "border-blue-600" : "border-dashed border-border"}`}>
              <span className="text-xs text-muted-foreground">행 전체 ℓ</span>
              <span className={`min-w-0 font-mono ${merged ? "font-bold text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>{scene.total}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
