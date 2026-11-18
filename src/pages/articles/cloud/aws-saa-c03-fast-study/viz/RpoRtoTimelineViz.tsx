import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — "주문은 최대 15분치만 잃을 수 있고 60분 안에 복구해야 합니다."
 * 두 목표는 같은 장애 시각에서 하나는 뒤로(잃을 데이터), 하나는 앞으로(멈춘 시간) 잰다.
 * 4장면의 "마지막 사본 30분 전"은 경계를 보이려는 가정이며 30 − 15 = 15분 초과.
 */
const W = 360;
const H = 182;
const AXIS_Y = 112;
const MIN = -35;
const MAX = 65;
const x = (minute: number) => 24 + ((minute - MIN) / (MAX - MIN)) * (W - 48);

const SCENES = [
  { label: "기준은 장애가 난 순간입니다", summary: "0분 = 장애", note: "두 목표는 모두 장애 시각을 0으로 놓고 잽니다. 하나는 그 순간에서 과거로, 다른 하나는 미래로 향합니다." },
  { label: "뒤로 15분: 잃어도 되는 주문", summary: "RPO 15분", note: "RPO(복구 시점 목표)는 장애 직전 몇 분치 데이터까지 잃어도 되는지입니다. 이 사례에서는 장애 전 15분 안의 주문만 잃을 수 있고, 그보다 오래된 주문은 남아 있어야 합니다." },
  { label: "앞으로 60분: 멈춰도 되는 시간", summary: "RTO 60분", note: "RTO(복구 시간 목표)는 서비스가 멈춰 있어도 되는 최대 시간입니다. 장애 뒤 60분 안에 주문을 다시 받아야 합니다." },
  { label: "(가정) 마지막 사본이 30분 전이라면", summary: "30 − 15 = 15분 초과", note: "장애 30분 전 상태로만 되살릴 수 있다면 30분치 주문을 잃습니다. 60분 안에 다시 열어도 RPO 15분은 지키지 못합니다. 두 목표는 따로 확인해야 합니다." },
] as const;

export default function RpoRtoTimelineViz() {
  return (
    <SceneShell
      eyebrow="복구 목표 두 개"
      title="15분은 장애 이전, 60분은 장애 이후를 잽니다"
      description="가로축은 분 단위 시간이고 0이 장애 시각입니다. 3절의 쇼핑몰 목표(가정)인 주문 손실 15분, 복구 60분을 같은 축에 올렸습니다."
      ariaLabel="장애 시각을 기준으로 뒤로 15분의 데이터 손실 한도와 앞으로 60분의 중단 한도"
      scenes={SCENES}
      render={(active) => {
        const showLoss = active >= 1;
        const showDown = active >= 2;
        const assumed = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {showLoss && !assumed && (
              <g>
                <rect x={x(-15)} y={AXIS_Y - 44} width={x(0) - x(-15)} height={36} rx={4} fill="#f59e0b" opacity={0.28} />
                <text x={(x(-15) + x(0)) / 2} y={AXIS_Y - 54} textAnchor="middle" fontSize={14} fontWeight={700} fill="#b45309">최대 15분치 손실</text>
                <text x={x(-15) - 6} y={AXIS_Y - 22} textAnchor="end" fontSize={12} fill="#64748b">보존</text>
              </g>
            )}
            {assumed && (
              <g>
                <rect x={x(-30)} y={AXIS_Y - 44} width={x(-15) - x(-30)} height={36} rx={4} fill="#dc2626" opacity={0.3} />
                <rect x={x(-15)} y={AXIS_Y - 44} width={x(0) - x(-15)} height={36} rx={4} fill="#f59e0b" opacity={0.28} />
                <text x={(x(-30) + x(-15)) / 2} y={AXIS_Y - 54} textAnchor="middle" fontSize={14} fontWeight={700} fill="#b91c1c">15분 초과</text>
                <text x={(x(-15) + x(0)) / 2} y={AXIS_Y - 54} textAnchor="middle" fontSize={14} fontWeight={700} fill="#b45309">허용</text>
                <line x1={x(-30)} x2={x(-30)} y1={AXIS_Y - 50} y2={AXIS_Y} stroke="#b91c1c" strokeWidth={1.25} />
                <text x={x(-30) - 14} y={AXIS_Y + 60} textAnchor="start" fontSize={12} fill="#b91c1c">마지막 사본(가정)</text>
              </g>
            )}
            {showDown && (
              <g opacity={assumed ? 0.45 : 1}>
                <rect x={x(0)} y={AXIS_Y - 44} width={x(60) - x(0)} height={36} rx={4} fill="#64748b" opacity={0.22} />
                <text x={(x(0) + x(60)) / 2} y={AXIS_Y - 54} textAnchor="middle" fontSize={14} fontWeight={700} fill="#64748b">최대 60분 중단</text>
                <line x1={x(60)} x2={x(60)} y1={AXIS_Y - 50} y2={AXIS_Y} stroke="#64748b" strokeWidth={1} />
                <text x={x(60)} y={AXIS_Y + 42} textAnchor="middle" fontSize={12} fill="#64748b">주문 재개</text>
              </g>
            )}
            <line x1={24} x2={W - 24} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[-30, -15, 0, 60].map((minute) => (
              <g key={minute}>
                <line x1={x(minute)} x2={x(minute)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(minute)} y={AXIS_Y + 20} textAnchor="middle" fontSize={12} fill="#64748b">
                  {minute > 0 ? `+${minute}분` : `${minute}분`}
                </text>
              </g>
            ))}
            <line x1={x(0)} x2={x(0)} y1={AXIS_Y - 48} y2={AXIS_Y + 6} stroke="#dc2626" strokeWidth={1.25} />
            <text x={x(0)} y={AXIS_Y + 42} textAnchor="middle" fontSize={14} fontWeight={700} fill="#dc2626">장애</text>
            <text x={W - 24} y={AXIS_Y + 62} textAnchor="end" fontSize={11} fill="#64748b">시간(분) →</text>
          </svg>
        );
      }}
    />
  );
}
