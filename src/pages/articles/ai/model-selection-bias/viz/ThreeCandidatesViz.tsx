import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case·#inside-selection·#why-fresh — 실제 평균이 모두 0.70인 A·B·C가
 * 0.69·0.74·0.71로 관측되고, 최고점 B의 0.74는 평균보다 0.04 높다(가정 사례).
 */
const TRUE_MEAN = 0.7;
const CANDIDATES: readonly { name: string; observed: number }[] = [
  { name: "A", observed: 0.69 },
  { name: "B", observed: 0.74 },
  { name: "C", observed: 0.71 },
];

const SCENES = [
  { label: "실제 평균", summary: "A·B·C 모두 0.70 (가정)", note: "세 후보의 실제 평균이 모두 0.70이라고 아는 가상의 상황입니다. 실제 업무에서는 이 평균을 알 수 없습니다. 점수는 클수록 좋습니다." },
  { label: "이번 관측", summary: "0.69 · 0.74 · 0.71", note: "이번 평가에서 A는 평균보다 0.01 낮고, B는 0.04 높고, C는 0.01 높게 관측됐습니다. 평균선에서 점까지 이은 가로 선이 이번 시행의 흔들림입니다." },
  { label: "최고점 고르기", summary: "B 선택 · 0.74 − 0.70 = 0.04", note: "최고점 규칙은 B를 고릅니다. 보고값 0.74에는 B의 평균 0.70과 우연히 높게 나온 0.04가 함께 들어 있습니다. 음의 흔들림을 받은 A는 이 과정에서 버려집니다." },
  { label: "같은 자료로 다시 읽기", summary: "다시 0.74 · 새 검증 아님", note: "B를 고른 뒤 같은 자료에서 다시 계산하면 같은 0.74가 나옵니다. 산출 과정을 재현할 수는 있지만 0.04가 우연인지 분리하지 못합니다." },
  { label: "새 자료로 평가하기", summary: "B 고정 · 새 점수는 미리 모름", note: "B를 고정하고 선택에 쓰지 않은 새 자료로 평가해야 선택 당시의 우연과 분리됩니다. 새 점수도 흔들려 반드시 0.70이 나오지는 않으므로 축 위에 놓지 않았습니다." },
];

const W = 360;
const H = 208;
const LEFT = 30;
const RIGHT = W - 16;
const MIN = 0.66;
const MAX = 0.76;
const x = (value: number) => LEFT + ((value - MIN) / (MAX - MIN)) * (RIGHT - LEFT);
const rowY = (index: number) => 40 + index * 48;
const AXIS_Y = 172;
const TICKS: readonly number[] = [0.66, 0.68, 0.7, 0.72, 0.74, 0.76];

const SLATE = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const MUTED = "#64748b";

export default function ThreeCandidatesViz() {
  return (
    <SceneShell
      eyebrow="평균과 이번의 흔들림"
      title="최고점을 고르면 우연히 높게 나온 0.04도 함께 고릅니다"
      description="가로축은 점수, 세로 점선은 세 후보의 실제 평균 0.70입니다. 점은 이번에 관측한 점수입니다. 3절의 가상 사례를 그대로 씁니다(가정)."
      ariaLabel="실제 평균 0.70인 세 후보의 관측, 최고점 선택, 같은 자료 재계산과 새 자료 평가"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={x(TRUE_MEAN)} x2={x(TRUE_MEAN)} y1={14} y2={AXIS_Y} stroke={SLATE} strokeWidth={1} strokeDasharray="4 3" />
          <text x={x(TRUE_MEAN)} y={10} textAnchor="middle" fontSize={11} fill={MUTED}>실제 평균 0.70</text>
          {CANDIDATES.map((item, index) => {
            const y = rowY(index);
            const isB = item.name === "B";
            const dropped = active >= 4 && !isB;
            const shown = active === 0 ? TRUE_MEAN : item.observed;
            const delta = Math.round((item.observed - TRUE_MEAN) * 100) / 100;
            const color = active >= 2 && isB ? BLUE : SLATE;
            return (
              <g key={item.name} opacity={dropped ? 0.25 : 1}>
                <text x={8} y={y + 4} fontSize={13} fontWeight={700} fill={color}>{item.name}</text>
                <line x1={LEFT} x2={RIGHT} y1={y} y2={y} stroke={LINE} strokeWidth={1} opacity={0.5} />
                {active >= 1 && active <= 2 && (
                  <line x1={x(TRUE_MEAN)} x2={x(item.observed)} y1={y} y2={y} stroke={delta > 0 ? AMBER : SLATE} strokeWidth={1.25} />
                )}
                {active === 4 && isB ? (
                  <text x={LEFT + 4} y={y - 8} fontSize={12} fontWeight={700} fill={BLUE}>새 자료 점수 = ? (위치를 미리 정할 수 없음)</text>
                ) : (
                  <circle cx={x(shown)} cy={y} r={5} fill={color} opacity={active === 4 ? 0.35 : 1} />
                )}
                {active >= 1 && active <= 2 && (
                  <text x={x(item.observed) + (delta < 0 ? -8 : 8)} y={y - 9} textAnchor={delta < 0 ? "end" : "start"} fontSize={11} fill={delta > 0 ? AMBER : MUTED}>
                    {item.observed.toFixed(2)} ({delta > 0 ? "+" : "−"}{Math.abs(delta).toFixed(2)})
                  </text>
                )}
                {active === 3 && isB && (
                  <text x={x(item.observed) - 8} y={y - 9} textAnchor="end" fontSize={11} fill={BLUE}>같은 자료 → 0.74 그대로</text>
                )}
              </g>
            );
          })}
          {active === 2 && (
            <g>
              <line x1={x(TRUE_MEAN)} x2={x(0.74)} y1={rowY(1) + 14} y2={rowY(1) + 14} stroke={AMBER} strokeWidth={1} />
              <line x1={x(TRUE_MEAN)} x2={x(TRUE_MEAN)} y1={rowY(1) + 10} y2={rowY(1) + 18} stroke={AMBER} strokeWidth={1} />
              <line x1={x(0.74)} x2={x(0.74)} y1={rowY(1) + 10} y2={rowY(1) + 18} stroke={AMBER} strokeWidth={1} />
              <text x={(x(TRUE_MEAN) + x(0.74)) / 2} y={rowY(1) + 27} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>우연 0.04</text>
            </g>
          )}
          <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke={LINE} strokeWidth={1} />
          {TICKS.map((tick) => (
            <text key={tick} x={x(tick)} y={AXIS_Y + 16} textAnchor="middle" fontSize={11} fill={MUTED}>{tick.toFixed(2)}</text>
          ))}
        </svg>
      )}
    />
  );
}
