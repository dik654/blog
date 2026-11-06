import SceneShell from "./SceneShell";

/**
 * 본문 대응: #claim-asset-map — 유통시장 거래와 환매·상환의 차이.
 * 유통시장: A의 10개가 다른 투자자로, 발행 총수 100 유지. 환매: 10개를 없애 90.
 * 대금·대가의 금액은 본문이 이 절에서 정하지 않으므로 숫자를 적지 않는다.
 */
const SCENES = [
  { label: "유통시장 거래", summary: "발행 총수 100 그대로", note: "기존 보유자의 10개를 다른 투자자에게 팝니다. 지분은 사라지지 않고 보유자만 바뀌며, 대금은 산 사람이 냅니다." },
  { label: "환매 또는 상환", summary: "발행 총수 100 → 90", note: "펀드의 정해진 절차로 지분을 없애고 대가를 받습니다. 대가는 펀드 쪽에서 나옵니다. 유통시장 가격과 환매 산정 가격·지급 시각은 같을 필요가 없습니다." },
] as const;

const BOX = "#94a3b8";

function Box({ x, y, w, title, sub, on = true }: { x: number; y: number; w: number; title: string; sub: string; on?: boolean }) {
  return (
    <g opacity={on ? 1 : 0.35}>
      <rect x={x} y={y} width={w} height={52} rx={8} fill="none" stroke={BOX} strokeWidth={1} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">{title}</text>
      <text x={x + w / 2} y={y + 39} textAnchor="middle" fontSize={12} fill="#64748b">{sub}</text>
    </g>
  );
}

function Arrow({ x1, x2, y, color, label, labelY }: { x1: number; x2: number; y: number; color: string; label: string; labelY: number }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2 - dir * 5} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2} ${y}l${-dir * 6} -4v8z`} fill={color} />
      <text x={(x1 + x2) / 2} y={labelY} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function TwoExitsViz() {
  return (
    <SceneShell
      eyebrow="같은 10개, 다른 경로"
      title="파는 것과 환매하는 것은 상대방과 발행 수가 다릅니다"
      description="A가 지분 10개에서 벗어나는 두 경로입니다. 숫자는 3절의 가상 사례이고, 받는 금액은 경로마다 따로 정해지므로 적지 않았습니다."
      ariaLabel="유통시장 거래와 환매의 상대방과 발행 총수 비교"
      scenes={SCENES}
      render={(active) => {
        const secondary = active === 0;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={8} y={30} w={96} title="A" sub={secondary ? "10개 → 0개" : "10개 → 소각"} />
            {secondary
              ? <Box x={256} y={30} w={96} title="다른 투자자" sub="0개 → 10개" />
              : <Box x={256} y={30} w={96} title="펀드" sub="정해진 절차" />}
            <Arrow x1={108} x2={252} y={46} color="#2563eb" label={secondary ? "지분 10개 이전" : "지분 10개를 없앰"} labelY={38} />
            <Arrow x1={252} x2={108} y={70} color="#16a34a" label={secondary ? "대금 (투자자가 지급)" : "대가 (펀드가 지급)"} labelY={86} />
            <rect x={8} y={116} width={344} height={70} rx={8} fill="none" stroke={BOX} strokeWidth={1} strokeDasharray="3 3" />
            <text x={20} y={136} fontSize={12.5} fontWeight={700} fill="#64748b">등록부의 발행 총수 (칸 하나 = 2개)</text>
            <text x={348} y={136} textAnchor="end" fontSize={13} fontWeight={700} fill={secondary ? "#2563eb" : "#dc2626"}>{secondary ? "100개" : "90개"}</text>
            {Array.from({ length: 50 }, (_, index) => {
              const gone = !secondary && index >= 45;
              return <rect key={index} x={20 + index * 6.4} y={148} width={5} height={24} rx={1} fill={gone ? "none" : "#64748b"} opacity={gone ? 1 : 0.6} stroke={gone ? "#dc2626" : "none"} strokeWidth={gone ? 1 : 0} />;
            })}
          </svg>
        );
      }}
    />
  );
}
