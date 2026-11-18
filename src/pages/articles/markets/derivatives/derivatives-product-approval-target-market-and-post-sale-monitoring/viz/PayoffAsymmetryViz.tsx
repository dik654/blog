import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case (1절 사례) — 원금 100, 만기 지수 80 이상이면 108, 지수 60이면 60.
 * 이익 108−100=8, 손실 100−60=40, 40÷8=5배.
 * 80 미만에서 60이 아닌 지수의 상환액은 본문에 없어 선으로 잇지 않고 회색 띠로 남긴다.
 */
const PRINCIPAL = 100;
const UP = 108;
const DOWN_INDEX = 60;
const DOWN = 60;
const COND = 80;
const GAIN = UP - PRINCIPAL;
const LOSS = PRINCIPAL - DOWN;

const SCENES = [
  { label: "조건을 지키면", summary: `100 → ${UP}, 이익 ${GAIN}`, note: "만기 지수가 80 이상이면 원금 100이 108이 됩니다. 지수가 80이든 100이든 받는 돈은 같습니다." },
  { label: "지수가 더 올라도", summary: `받는 돈은 ${UP}에서 멈춤`, note: "지수가 80을 훨씬 넘어도 표시 수익은 8에 멈춥니다. 오른쪽 끝 점은 이 평평함을 보이려고 고른 지수입니다(가정)." },
  { label: "지수가 60이면", summary: `100 → ${DOWN}, 손실 ${LOSS}`, note: "보호선이 깨지고 최종 지수가 60이면 60만 돌려받아 손실은 40입니다. 80 미만의 다른 지수에서 얼마를 받는지는 본문이 적지 않아 회색 띠로 비워 두었습니다." },
  { label: "위 8, 아래 40", summary: `손실이 이익의 ${LOSS / GAIN}배`, note: "위쪽 이익 8보다 아래쪽 손실 40이 다섯 배 큽니다. 만기 전에 팔 때의 가격과 발행자 신용위험은 이 그림에 없으며 따로 설명해야 합니다." },
] as const;

const W = 360;
const H = 190;
const PX0 = 44;
const PX1 = 344;
const PY0 = 160;
const PY1 = 16;
const IX_MIN = 40;
const IX_MAX = 140;
const V_MIN = 40;
const V_MAX = 120;
const px = (index: number) => PX0 + ((index - IX_MIN) / (IX_MAX - IX_MIN)) * (PX1 - PX0);
const py = (value: number) => PY0 - ((value - V_MIN) / (V_MAX - V_MIN)) * (PY0 - PY1);
const FAR = 130;

export default function PayoffAsymmetryViz() {
  return (
    <SceneShell
      eyebrow="지급식"
      title="받는 돈은 위로 108에서 막히고, 지수 60이면 60으로 떨어집니다"
      description="가로는 만기 지수, 세로는 원금 100을 넣은 고객이 만기에 돌려받는 금액입니다. 1절의 숫자만 그렸습니다."
      ariaLabel="만기 지수 80 이상이면 108, 지수 60이면 60을 돌려받아 이익 8과 손실 40이 비대칭인 지급식"
      scenes={SCENES}
      render={(active) => {
        const flatOn = active === 0 || active === 1 || active === 3;
        const downOn = active === 2 || active === 3;
        const dots = active === 1 ? [COND, PRINCIPAL, FAR] : [COND, PRINCIPAL];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={px(IX_MIN)} y={PY1} width={px(COND) - px(IX_MIN)} height={PY0 - PY1} fill="#94a3b8" opacity={0.12} />
            <text x={(px(IX_MIN) + px(COND)) / 2} y={PY1 + 13} textAnchor="middle" fontSize={11} fill="#64748b"><tspan x={(px(IX_MIN) + px(COND)) / 2}>80 미만:</tspan><tspan x={(px(IX_MIN) + px(COND)) / 2} dy={13}>본문은 60만 제시</tspan></text>
            <line x1={PX0} x2={PX1} y1={py(PRINCIPAL)} y2={py(PRINCIPAL)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <text x={PX1} y={py(PRINCIPAL) + 13} textAnchor="end" fontSize={12} fill="#64748b">원금 100</text>
            <line x1={px(COND)} x2={px(COND)} y1={PY1} y2={PY0} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={px(COND)} x2={PX1} y1={py(UP)} y2={py(UP)} stroke="#2563eb" strokeWidth={flatOn ? 1.25 : 1} opacity={flatOn ? 1 : 0.35} />
            <text x={PX1} y={py(UP) - 6} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb" opacity={flatOn ? 1 : 0.35}>108</text>
            {dots.map((index) => (
              <circle key={index} cx={px(index)} cy={py(UP)} r={4} fill="#2563eb" opacity={flatOn ? 1 : 0.35} />
            ))}
            <circle cx={px(DOWN_INDEX)} cy={py(DOWN)} r={4} fill="#dc2626" opacity={downOn ? 1 : 0.35} />
            <text x={px(DOWN_INDEX) + 8} y={py(DOWN) + 4} fontSize={13} fontWeight={700} fill="#dc2626" opacity={downOn ? 1 : 0.35}>60</text>
            {active === 3 && (
              <>
                <line x1={px(PRINCIPAL)} x2={px(PRINCIPAL)} y1={py(PRINCIPAL)} y2={py(UP)} stroke="#2563eb" strokeWidth={1.25} />
                <text x={px(PRINCIPAL) + 5} y={(py(PRINCIPAL) + py(UP)) / 2 + 4} fontSize={13} fontWeight={700} fill="#2563eb">+8</text>
              </>
            )}
            {downOn && (
              <>
                <line x1={px(DOWN_INDEX)} x2={px(DOWN_INDEX)} y1={py(PRINCIPAL)} y2={py(DOWN) - 5} stroke="#dc2626" strokeWidth={1.25} />
                <text x={px(DOWN_INDEX) - 5} y={(py(PRINCIPAL) + py(DOWN)) / 2 + 4} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">−40</text>
              </>
            )}
            <line x1={PX0} x2={PX1} y1={PY0} y2={PY0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={PX0} x2={PX0} y1={PY1} y2={PY0} stroke="#94a3b8" strokeWidth={1} />
            {[60, 80, 100].map((tick) => (
              <text key={tick} x={px(tick)} y={PY0 + 13} textAnchor="middle" fontSize={12} fill="#64748b">{tick}</text>
            ))}
            {active === 1 && <text x={px(FAR)} y={PY0 + 13} textAnchor="middle" fontSize={12} fill="#64748b">130(가정)</text>}
            <text x={PX1} y={PY0 + 26} textAnchor="end" fontSize={12} fill="#64748b">만기 지수 →</text>
            {[60, 100].map((tick) => (
              <text key={tick} x={PX0 - 5} y={py(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
            ))}
            <text x={PX0 - 5} y={PY1 + 4} textAnchor="end" fontSize={11} fill="#64748b">받는 돈</text>
          </svg>
        );
      }}
    />
  );
}
