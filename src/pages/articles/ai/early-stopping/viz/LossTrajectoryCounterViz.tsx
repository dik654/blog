import SceneShell from "./SceneShell";

/**
 * 본문 대응: #state-machine · #stop-and-restore — loss .42,.38,.39,.40,.41, δ=0, P=2.
 * 세로축은 loss 값 그대로(.36–.43). best b는 점선, 각 eval 아래에 counter c를 적는다.
 * 마지막 장면은 TermBreakdown의 δ=.01 예: b−δ = .38−.01 = .37, .375는 .37보다 낮지 않다.
 */
const LOSSES: readonly number[] = [0.42, 0.38, 0.39, 0.4, 0.41];
const BESTS: readonly number[] = [0.42, 0.38, 0.38, 0.38, 0.38];
const COUNTERS: readonly number[] = [0, 0, 1, 2, 3];

const W = 360;
const H = 190;
const LEFT = 44;
const RIGHT = 336;
const TOP = 18;
const BOTTOM = 150;
const Y_MIN = 0.36;
const Y_MAX = 0.43;

const xAt = (index: number) => LEFT + 20 + index * ((RIGHT - LEFT - 40) / 4);
const yAt = (value: number) => BOTTOM - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);

const SCENES = [
  { label: "Eval 1", summary: "m=.42 → b=.42, c=0", shown: 1, note: "처음 관측한 값은 비교할 이전 best가 없어 그대로 best로 둡니다(가정: 이 글은 첫 event의 초기값을 따로 정하지 않습니다). 점선이 지금까지의 best b입니다." },
  { label: "Eval 2", summary: ".38 < .42 → best 갱신, c=0", shown: 2, note: "Loss는 낮을수록 좋습니다. .38이 이전 best .42보다 δ=0 이상 낮으므로 개선입니다. 점선이 .38로 내려가고 이 시점의 snapshot을 저장하며 counter는 0입니다." },
  { label: "Eval 3", summary: ".39 ≥ .38 → c=1", shown: 3, note: ".39는 첫 값 .42보다는 낮지만 비교 대상은 지금까지의 best .38입니다. .38보다 높으므로 bad event이고 best는 그대로, counter만 1이 됩니다." },
  { label: "Eval 4", summary: ".40 → c=2, 2>2 아님", shown: 4, note: "다시 .38보다 높아 counter가 2가 됩니다. P=2이고 멈추는 조건이 c>P이므로 c=2에서는 아직 계속 학습합니다." },
  { label: "Eval 5", summary: ".41 → c=3 > P=2 → stop", shown: 5, note: "Counter가 3이 되어 처음으로 P=2를 넘습니다. 여기서 학습을 멈춥니다. 가장 마지막으로 평가한 checkpoint는 eval 5입니다." },
  { label: "반환", summary: "stop=eval 5, return=eval 2", shown: 5, note: "멈춘 위치와 돌려줄 위치는 다릅니다. 점선이 가리키는 가장 낮은 loss .38의 eval 2 snapshot을 복원하고, 더 나쁜 eval 5(.41)는 반환하지 않습니다." },
  { label: "δ=.01이면", summary: ".375 < .37 아님 → 개선 아님", shown: 0, note: "용어 설명의 예입니다. Minimum improvement δ=.01이면 새 값은 .38이 아니라 .38−.01=.37보다 낮아야 개선으로 셉니다(식 m_j<b−δ). .375는 .38보다 낮지만 .37보다 높아 이 규칙에서는 bad event로 셉니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#94a3b8";

export default function LossTrajectoryCounterViz() {
  return (
    <SceneShell
      eyebrow="δ=0 · P=2 · c>P에서 stop"
      title="Loss 다섯 개를 점으로 찍고 best와 counter를 함께 따라갑니다"
      description="세로축이 validation loss이며 아래로 갈수록 좋습니다. 점선은 지금까지의 best b, 점 아래 숫자는 bad-event counter c입니다."
      ariaLabel="validation loss 다섯 개에서 best 점선과 bad counter가 바뀌다가 eval 5에서 멈추고 eval 2를 반환하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const deltaScene = scene.shown === 0;
        const restore = active === 5;
        const shown = scene.shown;
        const bestNow = shown > 0 ? BESTS[shown - 1] : 0.38;
        const bestPath = BESTS.slice(0, Math.max(shown, 1))
          .map((best, index) => {
            const x0 = index === 0 ? xAt(0) - 14 : xAt(index) - (xAt(1) - xAt(0)) / 2;
            const x1 = xAt(index) + (index === shown - 1 ? 14 : (xAt(1) - xAt(0)) / 2);
            return `M${x0},${yAt(best)} H${x1}`;
          })
          .join(" ");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${scene.label}: ${scene.summary}`} className="block h-auto w-full">
            {[0.37, 0.38, 0.39, 0.4, 0.41, 0.42].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={RIGHT} y1={yAt(tick)} y2={yAt(tick)} stroke="#e2e8f0" strokeWidth="1" />
                <text x={LEFT - 6} y={yAt(tick) + 3} textAnchor="end" className="text-[11px] sm:text-[9px]" fill="#64748b">
                  {tick.toFixed(2).slice(1)}
                </text>
              </g>
            ))}
            <text x={8} y={TOP - 4} className="text-[11px] sm:text-[9px]" fill="#64748b">loss ↓ 좋음</text>

            {deltaScene ? (
              <g>
                <line x1={LEFT} x2={RIGHT} y1={yAt(0.38)} y2={yAt(0.38)} stroke={BLUE} strokeWidth="1.25" strokeDasharray="5 3" />
                <text x={RIGHT} y={yAt(0.38) - 5} textAnchor="end" className="text-[11px] sm:text-[9px]" fill={BLUE} fontWeight="bold">best b=.38</text>
                <line x1={LEFT} x2={RIGHT} y1={yAt(0.37)} y2={yAt(0.37)} stroke={RED} strokeWidth="1.25" strokeDasharray="2 3" />
                <text x={RIGHT} y={yAt(0.37) + 12} textAnchor="end" className="text-[11px] sm:text-[9px]" fill={RED} fontWeight="bold">개선 기준 b−δ=.37</text>
                <rect x={LEFT} width={RIGHT - LEFT} y={yAt(0.38)} height={yAt(0.37) - yAt(0.38)} fill="#fef3c7" opacity="0.7" />
                <circle cx={(LEFT + RIGHT) / 2} cy={yAt(0.375)} r="5" fill={AMBER} />
                <text x={(LEFT + RIGHT) / 2 + 9} y={yAt(0.375) + 3} className="text-[12px] sm:text-[10px]" fill={AMBER} fontWeight="bold">.375 → bad event</text>
              </g>
            ) : (
              <g>
                <path d={bestPath} fill="none" stroke={BLUE} strokeWidth="1.25" strokeDasharray="5 3" />
                <text x={xAt(Math.max(shown, 1) - 1) + 16} y={yAt(bestNow) + 3} className="text-[11px] sm:text-[9px]" fill={BLUE} fontWeight="bold">b</text>
                {LOSSES.map((loss, index) => {
                  const visible = index < shown;
                  const isBest = index === 1 && shown >= 2;
                  const bad = COUNTERS[index] > 0;
                  const stop = index === 4 && shown === 5;
                  const color = !visible ? "transparent" : isBest ? BLUE : stop ? RED : bad ? AMBER : GRAY;
                  const dim = restore && index !== 1;
                  return (
                    <g key={index} opacity={dim ? 0.35 : 1}>
                      {index > 0 && index < shown ? (
                        <line x1={xAt(index - 1)} y1={yAt(LOSSES[index - 1])} x2={xAt(index)} y2={yAt(loss)} stroke={GRAY} strokeWidth="1" />
                      ) : null}
                      <circle cx={xAt(index)} cy={yAt(loss)} r={isBest && restore ? 7 : 5} fill={color} stroke={isBest && restore ? "#1e3a8a" : "none"} strokeWidth="1.25" />
                      <text x={xAt(index)} y={yAt(loss) - 9} textAnchor="middle" className="text-[11px] sm:text-[9px]" fill={visible ? "#334155" : "transparent"}>
                        {loss.toFixed(2).slice(1)}
                      </text>
                      <text x={xAt(index)} y={BOTTOM + 15} textAnchor="middle" className="text-[11px] sm:text-[9px]" fill="#64748b">
                        eval {index + 1}
                      </text>
                      <text x={xAt(index)} y={BOTTOM + 30} textAnchor="middle" className="text-[12px] sm:text-[10px]" fontWeight="bold" fill={!visible ? "#cbd5e1" : stop ? RED : bad ? AMBER : "#334155"}>
                        {visible ? `c=${COUNTERS[index]}` : "c=?"}
                      </text>
                    </g>
                  );
                })}
                {shown === 5 ? (
                  <text x={xAt(4)} y={yAt(LOSSES[4]) + 18} textAnchor="middle" className="text-[11px] sm:text-[9px]" fill={RED} fontWeight="bold">stop</text>
                ) : null}
                {restore ? (
                  <text x={xAt(1)} y={yAt(0.38) + 20} textAnchor="middle" className="text-[11px] sm:text-[9px]" fill={BLUE} fontWeight="bold">return</text>
                ) : null}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
