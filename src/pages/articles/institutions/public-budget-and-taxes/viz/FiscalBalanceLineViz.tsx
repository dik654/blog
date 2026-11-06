import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 통합재정수지 −10, 사회보장성기금 수지 +40(가정) → 관리재정수지 −10 − 40 = −50.
 * 정의는 본문이 인용한 통계청 e-나라지표(2026-10-09 확인). 기금을 뺀 나머지 −50 + 기금 +40 = −10으로 검산.
 */
const SCENES = [
  { label: "통합재정수지", summary: "−10", note: "한 해 재정을 한 숫자로 보면 −10이라고 둡니다(가정). 이 숫자에는 사회보장성기금의 수지가 들어 있습니다." },
  { label: "안에 든 기금", summary: "−50 + 40 = −10", note: "국민연금·사학연금·고용보험·산재보험 같은 사회보장성기금의 수지가 +40이라면(가정), 나머지는 −50이어야 합쳐서 −10이 됩니다." },
  { label: "관리재정수지", summary: "−10 − 40 = −50", note: "흑자 몫을 빼므로 값이 더 내려갑니다. 같은 해 재정을 두고 ‘적자 10’과 ‘적자 50’이 모두 맞는 말이 될 수 있어, 어느 지표인지부터 확인합니다." },
] as const;

const MIN = -60;
const MAX = 50;
const LEFT = 16;
const RIGHT = 344;
const xOf = (value: number) => LEFT + ((value - MIN) / (MAX - MIN)) * (RIGHT - LEFT);
const AXIS_Y = 130;
const TICKS = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40] as const;
const GRAY = "#64748b";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#d97706";

export default function FiscalBalanceLineViz() {
  return (
    <SceneShell
      eyebrow="같은 해, 다른 적자 (가정)"
      title="흑자인 기금을 빼면 적자가 10에서 50이 됩니다"
      description="가로줄 왼쪽이 적자, 오른쪽이 흑자입니다. 지표 정의는 통계청 e-나라지표(2026-10-09 확인)를 따르고 금액 −10과 +40은 가정입니다."
      ariaLabel="수직선 위의 통합재정수지 마이너스 10, 사회보장성기금 플러스 40, 관리재정수지 마이너스 50"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 1 && (
            <g>
              <rect x={xOf(0)} y={26} width={xOf(40) - xOf(0)} height={20} rx={2} fill={GREEN} />
              <text x={(xOf(0) + xOf(40)) / 2} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">기금 +40</text>
              <rect x={xOf(-50)} y={52} width={xOf(0) - xOf(-50)} height={20} rx={2} fill={GRAY} />
              <text x={(xOf(-50) + xOf(0)) / 2} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">기금을 뺀 나머지 −50</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <line x1={xOf(-10)} x2={xOf(-50) + 6} y1={92} y2={92} stroke={AMBER} strokeWidth={1.25} />
              <path d={`M${xOf(-50) + 6} 88 L${xOf(-50)} 92 L${xOf(-50) + 6} 96`} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <text x={(xOf(-10) + xOf(-50)) / 2} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>기금 수지 40을 뺌</text>
              <circle cx={xOf(-50)} cy={AXIS_Y} r={5} fill={AMBER} />
              <text x={xOf(-50)} y={AXIS_Y - 12} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={AMBER}>관리 −50</text>
            </g>
          )}
          <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {TICKS.map((tick) => (
            <g key={tick}>
              <line x1={xOf(tick)} x2={xOf(tick)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
              <text x={xOf(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={10} fill={GRAY} fontWeight={tick === 0 ? 700 : 400}>{tick < 0 ? `−${-tick}` : tick}</text>
            </g>
          ))}
          <circle cx={xOf(-10)} cy={AXIS_Y} r={5} fill={BLUE} />
          <text x={xOf(-10)} y={AXIS_Y - 12} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={BLUE}>통합 −10</text>
          <text x={LEFT} y={AXIS_Y + 34} fontSize={10.5} fill={GRAY}>← 적자</text>
          <text x={RIGHT} y={AXIS_Y + 34} textAnchor="end" fontSize={10.5} fill={GRAY}>흑자 →</text>
        </svg>
      )}
    />
  );
}
