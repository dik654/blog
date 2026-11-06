import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 모델 1.0 vs 실제 0.8, 두 번째까지 눈 감고 실행하면 1.6(예측 2와 0.4 차이).
 * 0.8에서 다시 계산: 마지막 −1.2, 0.8, 0.8, 2.8 → 비용 10.24, 1.44, 1.44, 0.64.
 */
const LEFT = 26;
const RIGHT = 334;
const MIN = -1.5;
const MAX = 3;
const INK = "#64748b";
const LINE = "#94a3b8";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";

const px = (x: number) => LEFT + ((x - MIN) / (MAX - MIN)) * (RIGHT - LEFT);

const SCENES = [
  { label: "첫 행동 뒤", summary: "예상 1.0 · 실제 0.8", note: "첫 행동 +1 뒤 모델은 위치 1.0을 예상하지만 가정한 실제 환경은 0.8을 돌려줍니다." },
  { label: "눈 감고 둘째 행동까지", summary: "예상 2 · 실제 1.6 · 차이 0.4", note: "다시 보지 않고 두 번째 행동까지 실행하면 실제 위치는 1.6입니다. 처음 예측한 2와 0.4만큼 차이가 납니다." },
  { label: "0.8에서 다시 예측", summary: "마지막 −1.2 · 0.8 · 0.8 · 2.8", note: "새 관측 0.8을 출발점으로 같은 네 후보를 다시 펼칩니다. 예측 규칙 x′=x+a는 그대로라서 두 번 오른쪽은 이제 2.8까지 간다고 예상합니다." },
  { label: "다시 고른 결과", summary: "최소 비용 0.64 · 0 아님", note: "제곱거리는 10.24, 1.44, 1.44, 0.64입니다. 네 후보 안에서는 두 번 오른쪽이 여전히 가장 작지만 비용은 더 이상 0이 아닙니다. 다시 보는 것만으로 편향된 예측 규칙이나 제한된 후보가 완벽해지지 않습니다." },
] as const;

const REPLAN = [
  { end: -1.2, name: "[−1,−1]", cost: "10.24" },
  { end: 0.8, name: "[−1,+1] [+1,−1]", cost: "1.44" },
  { end: 2.8, name: "[+1,+1]", cost: "0.64" },
] as const;

function Track({ y, label, color, points }: { y: number; label: string; color: string; points: readonly number[] }) {
  const last = points[points.length - 1] ?? 0;
  return (
    <g>
      <text x={LEFT} y={y - 14} fontSize={12} fontWeight={700} fill={color}>{label}</text>
      <line x1={px(0)} x2={px(last)} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      {points.map((point) => (
        <g key={point}>
          <circle cx={px(point)} cy={y} r={4} fill={color} />
          <text x={px(point)} y={y + 18} textAnchor="middle" fontSize={12} fill={color}>{point}</text>
        </g>
      ))}
    </g>
  );
}

export default function BlindRunViz() {
  return (
    <SceneShell
      eyebrow="예측과 현실의 간격"
      title="눈을 감고 끝까지 가면 0.4 빗나가고, 다시 봐도 비용은 0이 되지 않습니다"
      description="가로줄이 1차원 위치이고 초록 세로 점선이 목표 2입니다. 파랑은 모델의 예측, 주황은 가정한 실제 환경의 값입니다."
      ariaLabel="모델 예측과 실제 위치의 차이, 새 관측에서 다시 계산한 후보 비용"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={px(2)} x2={px(2)} y1={14} y2={150} stroke={GREEN} strokeWidth={1} strokeDasharray="4 3" />
          <text x={px(2)} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={GREEN}>목표 2</text>
          {active < 2 ? (
            <>
              <Track y={50} label="모델의 예상" color={BLUE} points={active === 0 ? [0, 1] : [0, 1, 2]} />
              <Track y={118} label="실제 위치" color={AMBER} points={active === 0 ? [0, 0.8] : [0, 0.8, 1.6]} />
              {active === 1 && (
                <>
                  <line x1={px(1.6)} x2={px(2)} y1={84} y2={84} stroke={INK} strokeWidth={1} />
                  <text x={px(1.8)} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>0.4</text>
                </>
              )}
            </>
          ) : (
            <>
              <text x={LEFT} y={30} fontSize={12} fontWeight={700} fill={AMBER}>새 출발점: 관측 0.8</text>
              <circle cx={px(0.8)} cy={46} r={4} fill={AMBER} />
              {REPLAN.map((item, index) => {
                const y = 76 + index * 28;
                const best = active === 3 && index === 2;
                return (
                  <g key={item.name}>
                    <line x1={px(0.8)} x2={px(0.8)} y1={50} y2={y} stroke={LINE} strokeWidth={1} strokeDasharray="1 3" />
                    <line x1={px(0.8)} x2={px(item.end)} y1={y} y2={y} stroke={BLUE} strokeWidth={1.25} />
                    <circle cx={px(item.end)} cy={y} r={4} fill={best ? GREEN : BLUE} />
                    <text x={item.end < 0 ? px(item.end) + 8 : px(0.8) - 8} y={item.end < 0 ? y - 7 : y + 4} textAnchor={item.end < 0 ? "start" : "end"} fontSize={12} fontWeight={best ? 700 : 400} fill={best ? GREEN : BLUE}>
                      {active === 3 ? `${item.name} 비용 ${item.cost}` : `${item.name} → ${item.end}`}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      )}
    />
  );
}
