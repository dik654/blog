import SceneShell from "./SceneShell";

/**
 * 본문 대응: #area — 같은 크기의 결함도 위치에 따라 고장이 달라지고, 고장 위치를 모은 면적이 임계 면적.
 * 주황 띠는 반지름 13인 입자의 중심이 놓이면 선을 잇거나 끊는 자리를 이 그림의 좌표로 계산한 것.
 * 선 y=50·74·124, 선 두께 8. 끊기: 중심이 선 중심 ±9. 잇기: 57~67. 합치면 41~83과 115~133. 1 cm²는 글의 가정값.
 */
const SCENES = [
  { label: "민감하지 않은 자리", summary: "같은 고장을 만들지 않을 수 있음", note: "입자가 다이 위에 있어도 전기적으로 민감하지 않은 자리에 놓이면 같은 고장을 만들지 않을 수 있습니다. 모든 위치가 같은 위험은 아닙니다." },
  { label: "두 선 사이", summary: "두 선을 이어 붙임", note: "같은 크기의 입자가 나란한 두 선 사이에 놓이면 떨어져 있어야 할 선이 이어져 회로가 달라집니다." },
  { label: "한 선 위", summary: "한 선을 끊음", note: "이번에는 입자가 선 하나를 끊을 수 있는 자리입니다. 어떤 자리가 위험한지는 결함 종류에 따라서도 달라집니다." },
  { label: "위험한 자리를 모으면", summary: "임계 면적 · 가상 1 cm²", note: "같은 크기의 입자 중심이 주황 띠에 놓이면 선이 이어지거나 끊깁니다. 이렇게 기능 고장을 만들 수 있는 위치를 모은 면적이 임계 면적입니다. 특정 크기의 결함을 기준으로 정하므로, 가상 1 cm²는 다이의 바깥 치수를 그대로 뜻하지 않습니다." },
] as const;

const WIRE = "#64748b";
const PARTICLE = "#dc2626";

function Wire({ y, cut = false }: { y: number; cut?: boolean }) {
  if (cut) {
    return (
      <g>
        <rect x={44} y={y - 4} width={94} height={8} fill={WIRE} />
        <rect x={162} y={y - 4} width={134} height={8} fill={WIRE} />
      </g>
    );
  }
  return <rect x={44} y={y - 4} width={252} height={8} fill={WIRE} />;
}

export default function CriticalAreaViz() {
  return (
    <SceneShell
      eyebrow="다이 위의 위치"
      title="같은 결함도 놓인 자리에 따라 고장이 갈립니다"
      description="큰 사각형이 다이 하나, 회색 띠가 배선, 빨간 원이 같은 크기의 점 결함입니다. 선 배치와 넓이 비율은 설명용입니다(가정)."
      ariaLabel="같은 크기의 결함이 놓인 자리에 따라 달라지는 고장과 임계 면적"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={20} y={8} width={300} height={180} rx={3} fill="#94a3b8" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} />
          <text x={30} y={25} fontSize={11} fill="#64748b">다이 바깥 면적</text>
          {active === 3 && (
            <g>
              <rect x={44} y={41} width={252} height={42} fill="#d97706" fillOpacity={0.35} stroke="#d97706" strokeWidth={1} />
              <rect x={44} y={115} width={252} height={18} fill="#d97706" fillOpacity={0.35} stroke="#d97706" strokeWidth={1} />
            </g>
          )}
          <Wire y={50} />
          <Wire y={74} />
          <Wire y={124} cut={active === 2} />
          {active === 0 && <circle cx={230} cy={160} r={13} fill={PARTICLE} />}
          {active === 1 && <circle cx={170} cy={62} r={13} fill={PARTICLE} />}
          {active === 2 && <circle cx={150} cy={124} r={13} fill={PARTICLE} />}
          {active === 3 && (
            <text x={170} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">주황 자리를 모은 면적 = 임계 면적 (가정 1 cm²)</text>
          )}
          {active === 0 && <text x={205} y={164} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">민감하지 않은 자리</text>}
          {active === 1 && <text x={170} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">두 선이 이어짐</text>}
          {active === 2 && <text x={150} y={157} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">선이 끊김</text>}
        </svg>
      )}
    />
  );
}
