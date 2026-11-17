import SceneShell from "./SceneShell";

/**
 * 본문 대응: #objective — D = 0.01에서 saturating 약 0.01, non-saturating 약 0.99.
 * D = σ(a)라 두면 logit a에 대한 기울기 크기는
 *   saturating      log(1 − D) → |∂/∂a| = D
 *   non-saturating  −log D     → |∂/∂a| = 1 − D
 * 0.5와 0.9는 비교를 위해 고른 점(가정)이다.
 */
const W = 360;
const H = 220;
const LEFT = 36;
const RIGHT = 14;
const BASE = 182;
const TOP = 18;
const sx = (d: number) => LEFT + d * (W - LEFT - RIGHT);
const sy = (v: number) => BASE - v * (BASE - TOP);

const NS = "#2563eb";
const SAT = "#d97706";

const SCENES = [
  {
    label: "D가 fake를 확신할 때",
    summary: "D = 0.01 → 0.01 vs 0.99",
    d: 0.01,
    note: "D(G(z)) = 0.01이면 saturating 쪽 기울기 크기는 0.01뿐이라 generator가 받는 신호가 거의 없습니다. 같은 점에서 non-saturating은 0.99로, 본문이 말한 강한 초기 signal입니다.",
  },
  {
    label: "점수가 중간일 때",
    summary: "D = 0.5 → 0.5 vs 0.5 (가정한 점)",
    d: 0.5,
    note: "두 직선은 D = 0.5에서 만납니다. 이 점에서는 어느 objective를 써도 기울기 크기가 같습니다.",
  },
  {
    label: "점수가 이미 높을 때",
    summary: "D = 0.9 → 0.9 vs 0.1 (가정한 점)",
    d: 0.9,
    note: "fake score가 높아지면 순서가 뒤집힙니다. 본문 제목이 ‘fake score가 낮을 때’라고 범위를 한정한 것과 맞습니다. 어느 쪽도 global convergence나 mode coverage를 보장하지 않습니다.",
  },
] as const;

export default function GeneratorSignalViz() {
  return (
    <SceneShell
      eyebrow="Generator signal"
      title="같은 fake score에서 두 objective가 주는 기울기 크기"
      description="가로축은 generated sample의 real score D(G(z)), 세로축은 D의 logit(sigmoid를 거치기 전 값) a에 대한 기울기 크기입니다. D = σ(a)로 두면 saturating은 D, non-saturating은 1 − D가 됩니다."
      ariaLabel="D(G(z)) 값에 따른 saturating과 non-saturating generator objective의 logit 기울기 크기 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const d = scene.d;
        const labelRight = d < 0.5;
        return (
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ backgroundColor: NS }} />non-saturating −log D: 1 − D</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 border-t-2 border-dashed" style={{ borderColor: SAT }} />saturating log(1 − D): D</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {[0, 0.5, 1].map((v) => (
                <g key={v}>
                  <text x={LEFT - 5} y={sy(v) + 3} fontSize={9} textAnchor="end" fill="#64748b">{v}</text>
                  <text x={sx(v)} y={BASE + 13} fontSize={9} textAnchor="middle" fill="#64748b">{v}</text>
                </g>
              ))}
              <text x={W - RIGHT} y={BASE + 30} fontSize={10} textAnchor="end" fill="#64748b">D(G(z)) →</text>
              <line x1={sx(0)} y1={sy(1)} x2={sx(1)} y2={sy(0)} stroke={NS} strokeWidth={1.25} />
              <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke={SAT} strokeWidth={1.25} strokeDasharray="4 3" />
              <line x1={sx(d)} x2={sx(d)} y1={TOP} y2={BASE} stroke="#64748b" strokeWidth={1} strokeDasharray="2 3" />
              <circle cx={sx(d)} cy={sy(1 - d)} r={4} fill={NS} />
              <circle cx={sx(d)} cy={sy(d)} r={4} fill={SAT} />
              <text x={sx(d) + (labelRight ? 8 : -8)} y={sy(1 - d) + (d === 0.5 ? -8 : 4)} fontSize={11} fontWeight={700} textAnchor={labelRight ? "start" : "end"} fill={NS}>{(1 - d).toFixed(2)}</text>
              <text x={sx(d) + (labelRight ? 8 : -8)} y={sy(d) + (d === 0.5 ? 16 : 4)} fontSize={11} fontWeight={700} textAnchor={labelRight ? "start" : "end"} fill={SAT}>{d.toFixed(2)}</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
