import SceneShell from "./SceneShell";

/**
 * 본문 대응: #output-measurement — E[T_repair] ≈ T_g + T_v + p0(T_r + T_v)와
 * "prompt-only 한 번은 가벼워도 실패가 잦으면 p95 latency가 더 커질 수 있다".
 * 시간은 모두 설명용 가정: T_g 1.0s, T_v 0.1s, T_r 0.8s, 요청 20개, 단계별 시간은 요청마다 같음.
 * 통과 1.1s, repair 1회 2.0s. 평균 = 1.1 + (k/20)·0.9 → k=0:1.10, 1:1.145, 2:1.19, 6:1.37.
 * p95 = 빠른 순으로 19번째(nearest-rank). constrained 장면: 생성 1.3s + 검증 0.1s = 1.4s, repair 0개(가정).
 */
const N = 20;
const P95_RANK = Math.ceil(0.95 * N);
const TG = 1.0;
const TV = 0.1;
const TR = 0.8;
const TG_CONSTRAINED = 1.3;

type Mode = "repair" | "constrained";
type Scene = { label: string; summary: string; failures: number; mode: Mode; note: string };

const SCENES: readonly Scene[] = [
  {
    label: "첫 검증 실패 0개",
    summary: "평균 1.10s · p95 1.10s",
    failures: 0,
    mode: "repair",
    note: "모든 요청이 생성 1.0s와 검증 0.1s만 거칩니다. 20개 막대의 길이가 같으므로 평균과 p95가 모두 1.10s입니다.",
  },
  {
    label: "1개 실패 (p0 = 5%)",
    summary: "평균 1.145s · p95 1.10s",
    failures: 1,
    mode: "repair",
    note: "실패한 1개만 repair 0.8s와 재검증 0.1s가 붙어 2.0s가 됩니다. 평균은 1.1 + 0.05 × 0.9 = 1.145s로 조금 늘지만, 빠른 순으로 19번째 요청은 아직 1.10s입니다.",
  },
  {
    label: "2개 실패 (p0 = 10%)",
    summary: "평균 1.19s · p95 2.00s",
    failures: 2,
    mode: "repair",
    note: "실패가 20개 중 1개를 넘자 19번째 요청이 repair 막대가 됩니다. 평균은 1.19s로 0.045s 늘었을 뿐인데 p95는 1.10s에서 2.00s로 뜁니다.",
  },
  {
    label: "6개 실패 (p0 = 30%)",
    summary: "평균 1.37s · p95 2.00s",
    failures: 6,
    mode: "repair",
    note: "평균은 p0에 비례해 1.1 + 0.3 × 0.9 = 1.37s까지 천천히 오릅니다. p95는 이미 repair 한 번 길이인 2.00s에 붙어 있습니다. 평균만 보면 이 tail을 놓칩니다.",
  },
  {
    label: "생성이 느려도 repair가 없다면",
    summary: "평균 1.40s · p95 1.40s",
    failures: 0,
    mode: "constrained",
    note: "Constrained decoding으로 한 번 생성이 1.3s로 느려지지만 repair가 필요한 요청이 0개라고 두면(가정) p95는 1.40s로 앞 장면의 2.00s보다 낮습니다. 실제로는 domain 실패가 남을 수 있으므로 같은 요청으로 end-to-end를 재야 합니다.",
  },
];

const W = 360;
const H = 202;
const LEFT = 30;
const RIGHT = 14;
const TOP = 12;
const ROW = 7;
const BAR_H = 5;
const AXIS_MAX = 2.2;
const AXIS_Y = TOP + N * ROW + 6;
const x = (seconds: number) => LEFT + (seconds / AXIS_MAX) * (W - LEFT - RIGHT);
const TICKS: readonly number[] = [0, 0.5, 1.0, 1.5, 2.0];

const COLOR = { gen: "#64748b", check: "#2563eb", repair: "#d97706", constrained: "#7c3aed" };

function segments(scene: Scene, index: number) {
  if (scene.mode === "constrained") {
    return [
      { from: 0, to: TG_CONSTRAINED, color: COLOR.constrained },
      { from: TG_CONSTRAINED, to: TG_CONSTRAINED + TV, color: COLOR.check },
    ];
  }
  const repaired = index >= N - scene.failures;
  const base = [
    { from: 0, to: TG, color: COLOR.gen },
    { from: TG, to: TG + TV, color: COLOR.check },
  ];
  if (!repaired) return base;
  return [
    ...base,
    { from: TG + TV, to: TG + TV + TR, color: COLOR.repair },
    { from: TG + TV + TR, to: TG + 2 * TV + TR, color: COLOR.check },
  ];
}

function formatMean(value: number) {
  const text = value.toFixed(3);
  return text.endsWith("0") ? text.slice(0, -1) : text;
}

function totals(scene: Scene) {
  return Array.from({ length: N }, (_, index) => segments(scene, index).reduce<number>((end, seg) => Math.max(end, seg.to), 0));
}

export default function RepairTailLatencyViz() {
  return (
    <SceneShell
      eyebrow="평균과 p95"
      title="가정한 요청 20개에서 첫 검증 실패가 5%를 넘으면 p95가 repair 한 번만큼 뜁니다"
      description="막대 하나가 요청 하나이며 빠른 순으로 쌓았습니다. 회색은 생성(T_g), 파랑은 검증(T_v), 주황은 repair(T_r), 마지막 장면의 보라는 constrained decoding 생성입니다. p0는 repair 전 첫 검증에서 실패한 비율, p95는 20개 중 19번째로 끝난 요청의 시간입니다. 시간 값과 요청 20개는 모두 가정입니다."
      note="각 단계 시간이 요청마다 같다고 둔 단순화입니다. 실제 측정에서는 요청별 wall-clock 분포를 그대로 정렬해 p95를 구합니다."
      ariaLabel="요청 20개의 생성·검증·repair 시간 막대로 본 평균과 p95"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ends = totals(scene);
        const mean = ends.reduce<number>((sum, value) => sum + value, 0) / N;
        const p95 = ends[P95_RANK - 1];
        const p95Y = TOP + (P95_RANK - 1) * ROW;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={LEFT - 2} y={p95Y - 1} width={W - LEFT - RIGHT + 4} height={ROW} fill="#d97706" fillOpacity={0.12} />
              <text x={LEFT - 6} y={p95Y + 5.5} textAnchor="end" fontSize={9} fontWeight={700} fill="#b45309">
                19번째
              </text>
              {ends.map((_, index) => (
                <g key={index}>
                  {segments(scene, index).map((seg) => (
                    <rect
                      key={seg.from}
                      x={x(seg.from)}
                      y={TOP + index * ROW}
                      width={x(seg.to) - x(seg.from)}
                      height={BAR_H}
                      fill={seg.color}
                      fillOpacity={0.85}
                    />
                  ))}
                </g>
              ))}
              <line x1={x(mean)} x2={x(mean)} y1={TOP - 4} y2={AXIS_Y} stroke="#0f766e" strokeWidth={1.25} strokeDasharray="3 3" />
              <line x1={x(p95)} x2={x(p95)} y1={TOP - 4} y2={AXIS_Y} stroke="#b45309" strokeWidth={1.25} />
              <line x1={LEFT} x2={W - RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={AXIS_Y + 15} textAnchor="middle" fontSize={10} fill="#64748b">
                    {tick.toFixed(1)}s
                  </text>
                </g>
              ))}
              <text x={W - RIGHT} y={AXIS_Y + 30} textAnchor="end" fontSize={10} fill="#64748b">
                요청 시작부터 최종 판정까지
              </text>
            </svg>
            <div className="mx-auto mt-1 grid max-w-[360px] grid-cols-2 gap-3 text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <span className="inline-block h-0 w-5 border-t border-dashed" style={{ borderColor: "#0f766e" }} />
                <span>평균 <strong className="font-mono">{formatMean(mean)}s</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-block h-0 w-5 border-t" style={{ borderColor: "#b45309" }} />
                <span>p95 <strong className="font-mono">{p95.toFixed(2)}s</strong></span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
