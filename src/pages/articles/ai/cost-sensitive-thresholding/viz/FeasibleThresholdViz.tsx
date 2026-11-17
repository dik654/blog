import SceneShell from "./SceneShell";

/**
 * 본문 대응: #capacity-policy — 후보 threshold마다 alert 수와 재현율을 검사해
 * 두 gate를 모두 통과한 구간에서만 validation cost 최소를 고른다.
 * 위 = 비용 Ĉ(τ), 가운데 = alert 수 A(τ)와 K=200, 아래 = 재현율 R(τ)와 r_min=.90.
 * 곡선 모양과 경계 위치는 설명용 가정이며 눈금 값을 적지 않는다.
 */
const X0 = 60;
const X1 = 420;
const BAYES_X = 150;
const CAP_X = 200;
const RECALL_X = 320;

const SAMPLE_XS = Array.from({ length: (X1 - X0) / 5 + 1 }, (_, i) => X0 + i * 5);

const costY = (x: number) =>
  x < BAYES_X ? 80 - 50 * ((BAYES_X - x) / 90) ** 2 : 80 - 50 * ((x - BAYES_X) / 270) ** 1.2;
const alertY = (x: number) => 172 - 55 * Math.exp(-(x - X0) / 140);
const recallY = (x: number) => 204 + 60 * ((x - X0) / 360) ** 1.6;

const toPath = (fn: (x: number) => number) =>
  SAMPLE_XS.map((x, i) => `${i === 0 ? "M" : "L"}${x} ${fn(x).toFixed(1)}`).join(" ");

const COST_PATH = toPath(costY);
const ALERT_PATH = toPath(alertY);
const RECALL_PATH = toPath(recallY);
const K_Y = alertY(CAP_X);
const RMIN_Y = recallY(RECALL_X);

const ACCENT = "#2563eb";
const MUTED = "#64748b";
const RED = "#dc2626";
const AXIS = "#94a3b8";

const SCENES = [
  {
    label: "비용만 보기",
    summary: "Ĉ 최저 = 교차점 .1",
    note: "후보 τ를 한 축에 늘어놓으면 비용 곡선은 앞 절의 교차점 .1에서 가장 낮습니다. 여기서 멈추면 처리 한도와 재현율은 아직 하나도 검사하지 않은 상태입니다.",
  },
  {
    label: "처리 한도 검사",
    summary: "A(τ) ≤ K = 200",
    note: "τ를 낮출수록 alert 수 A(τ)는 늘어납니다. 이 그림은 .1에서 하루 200건을 넘는 경우를 가정했습니다. A(τ)가 K보다 큰 왼쪽 후보는 비용이 낮아도 빠집니다.",
  },
  {
    label: "재현율 검사",
    summary: "R(τ) ≥ r_min = .90",
    note: "τ를 높일수록 alert가 줄어 놓치는 positive가 늘고 재현율 R(τ)는 내려갑니다. R(τ)가 .90 아래로 떨어지는 오른쪽 후보도 빠집니다.",
  },
  {
    label: "두 검사의 AND",
    summary: "남은 구간에서 Ĉ 최소",
    note: "두 검사를 모두 통과한 가운데 구간에서만 비용 최소를 찾습니다. 가정한 모양에서는 .1에 가장 가까운 구간 왼쪽 끝이 선택됩니다. .1이 두 검사를 모두 통과했다면 .1이 그대로 선택됩니다.",
  },
] as const;

function PanelTitle({ y, text }: { y: number; text: string }) {
  return (
    <text x={X0} y={y} className="fill-muted-foreground text-[15px] sm:text-[11px] font-semibold">
      {text}
    </text>
  );
}

export default function FeasibleThresholdViz() {
  return (
    <SceneShell
      eyebrow="제약 안의 비용 최소"
      title="두 검사를 통과한 구간에서만 비용이 가장 낮은 threshold를 고릅니다"
      description="τ 축 위 후보를 비용 Ĉ(τ), alert 수 A(τ), 재현율 R(τ) 세 줄로 봅니다. A(τ)는 τ 이상이라 alert되는 validation 건수, K는 하루 처리 한도 200건, R(τ)는 실제 positive 가운데 찾아낸 비율, r_min은 최소 재현율 .90입니다. 곡선 모양과 경계 위치는 설명을 위해 고른 것(가정)이라 눈금 값을 적지 않았습니다."
      ariaLabel="threshold 후보를 처리 한도와 최소 재현율로 거른 뒤 남은 구간에서 비용 최소를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const capOn = active >= 1;
        const recallOn = active >= 2;
        const bandOn = active === 3;
        return (
          <svg viewBox="0 0 440 300" role="img" aria-label={SCENES[active].label} className="block h-auto w-full">
            <rect
              x={X0}
              y={20}
              width={CAP_X - X0}
              height={252}
              fill={RED}
              fillOpacity={0.08}
              style={{ opacity: capOn ? 1 : 0 }}
              className="transition-opacity duration-300 motion-reduce:transition-none"
            />
            <rect
              x={RECALL_X}
              y={20}
              width={X1 - RECALL_X}
              height={252}
              fill={RED}
              fillOpacity={0.08}
              style={{ opacity: recallOn ? 1 : 0 }}
              className="transition-opacity duration-300 motion-reduce:transition-none"
            />
            <rect
              x={CAP_X}
              y={20}
              width={RECALL_X - CAP_X}
              height={252}
              fill={ACCENT}
              fillOpacity={0.08}
              stroke={ACCENT}
              strokeWidth={1}
              style={{ opacity: bandOn ? 1 : 0 }}
              className="transition-opacity duration-300 motion-reduce:transition-none"
            />

            <PanelTitle y={16} text="비용 Ĉ(τ)" />
            <PanelTitle y={106} text="alert 수 A(τ)" />
            <PanelTitle y={198} text="재현율 R(τ)" />

            <path d={COST_PATH} fill="none" stroke={ACCENT} strokeWidth={1.25} />
            <path d={ALERT_PATH} fill="none" stroke={MUTED} strokeWidth={1.25} />
            <path d={RECALL_PATH} fill="none" stroke={MUTED} strokeWidth={1.25} />

            <line x1={X0} y1={K_Y} x2={X1} y2={K_Y} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
            <text x={X1} y={K_Y - 5} textAnchor="end" className="fill-foreground text-[15px] sm:text-[11px]">
              K = 200
            </text>
            <line x1={X0} y1={RMIN_Y} x2={X1} y2={RMIN_Y} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
            <text x={X1} y={RMIN_Y - 5} textAnchor="end" className="fill-foreground text-[15px] sm:text-[11px]">
              r_min = .90
            </text>

            <circle cx={BAYES_X} cy={costY(BAYES_X)} r={4} fill="#ffffff" stroke={ACCENT} strokeWidth={1.25} />
            <text x={BAYES_X} y={costY(BAYES_X) - 9} textAnchor="middle" className="fill-primary text-[15px] sm:text-[11px] font-bold">
              τ = .1
            </text>

            <g style={{ opacity: capOn ? 1 : 0 }} className="transition-opacity duration-300 motion-reduce:transition-none">
              <line x1={CAP_X} y1={20} x2={CAP_X} y2={272} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={CAP_X} cy={K_Y} r={3} fill={RED} />
              <text x={X0 + 6} y={168} className="fill-red-700 dark:fill-red-400 text-[15px] sm:text-[11px] font-semibold">
                A(τ) &gt; K → 제외
              </text>
            </g>
            <g style={{ opacity: recallOn ? 1 : 0 }} className="transition-opacity duration-300 motion-reduce:transition-none">
              <line x1={RECALL_X} y1={20} x2={RECALL_X} y2={272} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={RECALL_X} cy={RMIN_Y} r={3} fill={RED} />
              <text x={X1 - 6} y={216} textAnchor="end" className="fill-red-700 dark:fill-red-400 text-[15px] sm:text-[11px] font-semibold">
                R(τ) &lt; r_min → 제외
              </text>
            </g>
            <g style={{ opacity: bandOn ? 1 : 0 }} className="transition-opacity duration-300 motion-reduce:transition-none">
              <text x={(CAP_X + RECALL_X) / 2} y={36} textAnchor="middle" className="fill-primary text-[15px] sm:text-[11px] font-bold">
                두 검사 통과
              </text>
              <circle cx={CAP_X} cy={costY(CAP_X)} r={5} fill={ACCENT} />
              <text x={CAP_X + 8} y={costY(CAP_X) - 8} className="fill-primary text-[15px] sm:text-[11px] font-bold">
                선택
              </text>
            </g>

            <line x1={X0} y1={276} x2={X1} y2={276} stroke={AXIS} strokeWidth={1} />
            <text x={X0} y={293} className="fill-muted-foreground text-[15px] sm:text-[11px]">
              ← 낮은 τ: alert 많음
            </text>
            <text x={X1} y={293} textAnchor="end" className="fill-muted-foreground text-[15px] sm:text-[11px]">
              높은 τ: alert 적음 →
            </text>
          </svg>
        );
      }}
    />
  );
}
