import SceneShell from "./SceneShell";

/**
 * 본문 대응: #payment-rail — F_required = r·L + F_fixed, ready ⇔ F_available ≥ F_required.
 * 본문 예: variable obligation 20 + fixed reserve 5 = 25. rate 2는 본문 Variable rate 예.
 * lockup horizon L = 10 epoch, available 30, piece 추가 뒤 rate 3은 설명용 가정.
 */
const L = 10;
const FIXED = 5;
const AVAILABLE = 30;
const SCALE = 40;

const SCENES = [
  { label: "지금 rate 2", summary: `2 × ${L} + ${FIXED} = 25 ≤ ${AVAILABLE} → 받음`, rate: 2, note: "rate 2에 lockup 기간 10 epoch를 곱한 variable 20과 fixed reserve 5를 더하면 25입니다. 다른 rail 예약분을 뺀 available 30 안에 들어가므로 이 rate는 받을 수 있습니다." },
  { label: "piece 추가로 rate 3", summary: `3 × ${L} + ${FIXED} = 35 > ${AVAILABLE} → 거절`, rate: 3, note: "새 piece로 rate가 3이 되면 variable 항이 30으로 커져 합이 35입니다. 지금의 25는 감당하던 available 30이 늘어난 합보다 작으므로 admission을 거절합니다. lockup은 provider의 미지급 위험을 낮출 뿐, proof 실패에도 무조건 지급되는 보험은 아닙니다." },
] as const;

const W = 360;
const H = 150;
const LEFT = 100;
const RIGHT = 14;
const BAR_W = W - LEFT - RIGHT;
const xOf = (value: number) => LEFT + (value / SCALE) * BAR_W;

export default function LockupAdmissionViz() {
  return (
    <SceneShell
      eyebrow="Lockup admission"
      title="rate가 오르면 필요한 lockup이 available을 넘는 순간 새 piece를 거절합니다"
      description="막대 길이는 token 금액입니다. variable 20 + fixed 5 = 25는 본문 예이고, lockup 기간 10 epoch, available 30, rate 3은 설명용 가정입니다."
      ariaLabel="rate × lockup 기간과 fixed reserve의 합을 available funds와 비교하는 admission 판정"
      scenes={SCENES}
      render={(active) => {
        const rate = SCENES[active].rate;
        const variable = rate * L;
        const required = variable + FIXED;
        const ready = AVAILABLE >= required;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={38} fontSize={13} fontWeight={700} fill="#0f172a">필요 lockup</text>
            <text x={8} y={52} fontSize={11} fill="#64748b">r × L + fixed</text>
            <rect x={xOf(0)} y={28} width={xOf(variable) - xOf(0)} height={26} fill="#2563eb" opacity={0.85} />
            <text x={(xOf(0) + xOf(variable)) / 2} y={45} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{rate} × {L} = {variable}</text>
            <rect x={xOf(variable)} y={28} width={xOf(required) - xOf(variable)} height={26} fill="#7c3aed" opacity={0.85} />
            <text x={(xOf(variable) + xOf(required)) / 2} y={45} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{FIXED}</text>

            <text x={8} y={88} fontSize={13} fontWeight={700} fill="#0f172a">available</text>
            <text x={8} y={102} fontSize={11} fill="#64748b">다른 rail 뺀 잔액</text>
            <rect x={xOf(0)} y={78} width={xOf(AVAILABLE) - xOf(0)} height={26} fill="#64748b" opacity={0.75} />
            <text x={(xOf(0) + xOf(AVAILABLE)) / 2} y={95} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{AVAILABLE}</text>

            <line x1={xOf(AVAILABLE)} x2={xOf(AVAILABLE)} y1={20} y2={112} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 3" />
            {!ready && (
              <rect x={xOf(AVAILABLE)} y={28} width={xOf(required) - xOf(AVAILABLE)} height={26} fill="none" stroke="#dc2626" strokeWidth={1.25} />
            )}
            <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill={ready ? "#16a34a" : "#dc2626"}>
              {ready ? `${required} ≤ ${AVAILABLE} · ready` : `${required} > ${AVAILABLE} · 초과 ${required - AVAILABLE} · 거절`}
            </text>
          </svg>
        );
      }}
    />
  );
}
