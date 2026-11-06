import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 원금은 달러 × 환율, 연 이자는 달러 이자 × 환율.
 * 1억 달러: 1000원 1000억 → 1200원 1200억. 이자: 400만×1000=40억 → 600만×1200=72억.
 * 72 − 40 = 32 = 200만×1000(20) + 400만×200(8) + 200만×200(4).
 */
const SX = 0.28;
const SY = 0.1;
const OX = 170;
const BASE = 180;
const w = (dollars: number) => dollars * SX;
const h = (rate: number) => rate * SY;

const SCENES = [
  { label: "원금 · 빚의 달러는 그대로", summary: "1000억 → 1200억 (+200억)", note: "갚을 달러는 1억 달러로 같습니다. 달러당 1000원이 1200원이 되면 원화로만 버는 회사에게 그 빚은 1000억 원에서 1200억 원이 됩니다." },
  { label: "이자 · 처음 넓이", summary: "400만 달러 × 1000원 = 40억", note: "연 이자는 달러 금액과 환율의 곱이라 사각형 넓이로 그릴 수 있습니다. 가로가 달러 이자, 세로가 달러당 원화입니다. 4%면 이자는 400만 달러입니다." },
  { label: "이자율이 6%로 재설정", summary: "600만 × 1000원 = 60억 (+20억)", note: "재설정은 계약에서 정한 날에 이자율을 새로 정하는 것입니다. 가로만 200만 달러 늘어 20억 원이 더해집니다." },
  { label: "환율도 1200원으로", summary: "600만 × 1200원 = 72억 (+32억)", note: "세로가 늘면 400만 달러 위로 8억 원, 늘어난 200만 달러 위로 4억 원이 더해집니다. 오른쪽 위 4억 원은 두 변화가 겹쳐서 생긴 조각입니다." },
  { label: "두 숫자를 따로 적습니다", summary: "원금 +200억 · 연 이자 +32억", note: "원금 환산 증가와 매년 이자 증가는 따로 적어야 합니다. 모두 설명을 위한 가정이며 실제 특정 국가나 회사의 수치가 아닙니다." },
] as const;

function Cell({ x, y, width, height, label, color, lit }: { x: number; y: number; width: number; height: number; label: string; color: string; lit: boolean }) {
  return (
    <g opacity={lit ? 1 : 0.14} className="transition-opacity duration-300 motion-reduce:transition-none">
      <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.28} stroke={color} strokeWidth={1} />
      <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fontSize={height < 24 ? 10 : 12} fontWeight={700} className="fill-foreground">{label}</text>
    </g>
  );
}

export default function FxInterestAreaViz() {
  return (
    <SceneShell
      eyebrow="환율 × 달러"
      title="같은 빚에서 원금과 이자가 다른 길로 커집니다"
      description="(가정) 원화로만 버는 회사의 1억 달러 빚. 환율 1000원 → 1200원, 연 이자율 4% → 6%, 전액 다음 해 만기입니다. 왼쪽과 오른쪽은 축척이 다릅니다."
      ariaLabel="1억 달러 빚의 원금 환산액 변화와 연 이자 넓이의 변화"
      scenes={SCENES}
      render={(active) => {
        const left = active === 0 || active === 4;
        const opacity = left ? 1 : 0.28;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={opacity} className="transition-opacity duration-300 motion-reduce:transition-none">
              <text x={8} y={24} fontSize={11} fontWeight={700} className="fill-foreground">원금 환산액</text>
              <rect x={14} y={BASE - 100} width={40} height={100} fill="#64748b" fillOpacity={0.35} stroke="#64748b" strokeWidth={1} />
              <rect x={66} y={BASE - 100} width={40} height={100} fill="#64748b" fillOpacity={0.35} stroke="#64748b" strokeWidth={1} />
              <rect x={66} y={BASE - 120} width={40} height={20} fill="#d97706" fillOpacity={0.4} stroke="#d97706" strokeWidth={1} />
              <text x={34} y={BASE - 106} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">1000억</text>
              <text x={86} y={BASE - 106} textAnchor="middle" fontSize={9.5} fontWeight={700} className="fill-foreground">+200억</text>
              <text x={86} y={BASE - 125} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">1200억</text>
              <text x={34} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">1000원</text>
              <text x={86} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">1200원</text>
              <line x1={8} x2={112} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            </g>
            <g opacity={active === 0 ? 0.28 : 1} className="transition-opacity duration-300 motion-reduce:transition-none">
              <text x={OX} y={24} fontSize={11} fontWeight={700} className="fill-foreground">연 이자 = 달러 이자 × 환율</text>
              <Cell x={OX} y={BASE - h(1000)} width={w(400)} height={h(1000)} label="40억" color="#2563eb" lit />
              <Cell x={OX + w(400)} y={BASE - h(1000)} width={w(200)} height={h(1000)} label="+20억" color="#16a34a" lit={active >= 2} />
              <Cell x={OX} y={BASE - h(1200)} width={w(400)} height={h(200)} label="+8억" color="#d97706" lit={active >= 3} />
              <Cell x={OX + w(400)} y={BASE - h(1200)} width={w(200)} height={h(200)} label="+4억" color="#dc2626" lit={active >= 3} />
              <text x={OX - 4} y={BASE - h(1000) + 4} textAnchor="end" fontSize={10} fill="#64748b">1000원</text>
              <text x={OX - 4} y={BASE - h(1200) + 4} textAnchor="end" fontSize={10} fill="#64748b">1200원</text>
              <text x={OX + w(400)} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">400만</text>
              <text x={OX + w(600)} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">600만</text>
              <text x={OX} y={BASE + 28} fontSize={10} fill="#64748b">가로: 달러 이자 (달러)</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
