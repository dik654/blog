import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 소득이 생겼어도 입금이 늦으면 부채 30의 만기를 넘길 수 있습니다.
 * 수취일·상환일·보유 현금을 함께 놓습니다. 날짜와 현금 금액은 글에 없으므로 순서만 그립니다.
 */
const AXIS_Y = 84;
const EARLY = 104;
const LATE = 256;

const SCENES = [
  { label: "입금이 먼저인 경우", summary: "대금을 받은 뒤 만기가 옵니다", note: "(가정) 수출대금이 만기 전에 들어오는 순서입니다. 다만 들어온 돈이 전부 빚 갚는 데 쓰이는지는 40이 어떻게 나뉘는지에 달려 있어 이 그림만으로 알 수 없습니다." },
  { label: "만기가 먼저인 경우", summary: "같은 소득, 뒤집힌 순서", note: "(가정) 소득이 생긴 것은 같아도 실제 입금이 만기보다 늦습니다. 이 사이에는 받을 돈이 있어도 아직 손에 없어서, 부채 30의 만기를 넘길 수 있습니다." },
  { label: "보유 현금을 함께 놓으면", summary: "세 가지를 같은 시간 위에", note: "그 사이를 버틸 수 있는지는 보유 현금까지 놓아야 판단합니다. 이 사례에는 현금 금액이 없어 양을 그리지 않았습니다." },
] as const;

const DEPOSIT = "#2563eb";
const DUE = "#dc2626";

function Marker({ x, label, sub, color, above }: { x: number; label: string; sub: string; color: string; above: boolean }) {
  const y1 = above ? AXIS_Y - 36 : AXIS_Y + 36;
  const y2 = above ? AXIS_Y - 20 : AXIS_Y + 50;
  return (
    <g style={{ transition: "transform 300ms" }}>
      <line x1={x} x2={x} y1={AXIS_Y - 12} y2={AXIS_Y + 12} stroke={color} strokeWidth={1.25} />
      <circle cx={x} cy={AXIS_Y} r={4.5} fill={color} />
      <text x={x} y={y1} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{label}</text>
      <text x={x} y={y2} textAnchor="middle" fontSize={11} fill="#64748b">{sub}</text>
    </g>
  );
}

export default function PaymentOrderViz() {
  return (
    <SceneShell
      eyebrow="입금과 만기의 순서"
      title="같은 소득도 입금과 만기의 순서가 다르면 다른 문제가 됩니다"
      description="만기는 빚을 갚기로 한 날입니다. 가로축은 시간이며 순서만 표시합니다. 날짜 간격은 그림을 위한 가정입니다."
      ariaLabel="수출대금 입금일과 부채 상환일의 순서, 보유 현금을 한 시간축에 놓은 그림"
      scenes={SCENES}
      render={(active) => {
        const dueFirst = active !== 0;
        const depositX = dueFirst ? LATE : EARLY;
        const dueX = dueFirst ? EARLY : LATE;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {dueFirst && (
              <>
                <rect x={EARLY} y={AXIS_Y - 12} width={LATE - EARLY} height={24} fill="#d97706" opacity={0.14} />
                <text x={(EARLY + LATE) / 2} y={AXIS_Y - 17} textAnchor="middle" fontSize={11} fill="#b45309">입금 전 구간</text>
              </>
            )}
            <line x1={16} x2={344} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            <path d={`M338 ${AXIS_Y - 4}L344 ${AXIS_Y}L338 ${AXIS_Y + 4}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={344} y={AXIS_Y + 18} textAnchor="end" fontSize={11} fill="#64748b">시간</text>
            <Marker x={depositX} label="수출대금 입금" sub="수취일" color={DEPOSIT} above />
            <Marker x={dueX} label="부채 30 만기" sub="상환일" color={DUE} above={false} />
            <g opacity={active === 2 ? 1 : 0}>
              <rect x={16} y={152} width={LATE - 16} height={28} rx={6} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
              <text x={(16 + LATE) / 2} y={170} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">보유 현금 ? (이 사례에 금액 없음)</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
