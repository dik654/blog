import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 가정한 배분 80/20과 40/60에서 주식 −20%, 채권 그대로.
 * 80×20%=16, 40×20%=8. 전체를 100으로 둔 단순 손실입니다.
 */
const SCENES = [
  { label: "두 배분", summary: "80·20 → 40·60", note: "목표 연도에 가까워지며 주식 80%·채권 20%에서 주식 40%·채권 60%로 바뀐다고 가정합니다. 이 변화 경로가 글라이드패스입니다." },
  { label: "주식 80%일 때 20% 하락", summary: "80 × 20% = 16", note: "주식이 20% 내리고 채권이 그대로면 전체 100 중 16이 사라집니다." },
  { label: "주식 40%일 때 20% 하락", summary: "40 × 20% = 8", note: "같은 하락이어도 주식 몫이 절반이라 단순 손실도 8로 절반입니다. 다만 같은 목표 연도라도 경로와 보수가 다르고 목표일의 원금이나 생활비를 보장하지 않습니다." },
] as const;

const ACCENT = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const GRAY = "#64748b";
const UNIT = 3.1;
const LEFT = 15;

function Allocation({ y, stock, name, showLoss }: { y: number; stock: number; name: string; showLoss: boolean }) {
  const loss = stock * 0.2;
  const stockWidth = stock * UNIT;
  const lossWidth = loss * UNIT;
  return (
    <g>
      <text x={LEFT} y={y - 7} fontSize={12} fontWeight={700} fill="currentColor">{name}</text>
      <rect x={LEFT} y={y} width={stockWidth} height={32} fill={ACCENT} opacity={0.8} />
      <rect x={LEFT + stockWidth} y={y} width={(100 - stock) * UNIT} height={32} fill={MUTED} opacity={0.5} />
      <text x={LEFT + 8} y={y + 21} fontSize={12} fontWeight={700} fill="#ffffff">주식 {stock}</text>
      <text x={LEFT + 310 - 8} y={y + 21} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">채권 {100 - stock}</text>
      {showLoss && (
        <g>
          <rect x={LEFT + stockWidth - lossWidth} y={y} width={lossWidth} height={32} fill={RED} />
          <text x={LEFT + stockWidth - lossWidth / 2} y={y + 21} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">−{loss}</text>
        </g>
      )}
    </g>
  );
}

export default function GlidePathLossViz() {
  return (
    <SceneShell
      eyebrow="타깃데이트펀드(TDF)의 배분"
      title="같은 주식 20% 하락이 배분에 따라 16과 8이 됩니다"
      description="막대 전체가 계좌 100입니다. 파랑은 주식, 회색은 채권, 빨강은 사라지는 몫입니다."
      note="가정한 배분과 하락률로 계산한 단순 손실입니다. 채권은 그대로라고 둡니다."
      ariaLabel="주식 80퍼센트와 40퍼센트 배분에서 주식 20퍼센트 하락의 손실 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 158" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Allocation y={26} stock={80} name="목표 연도에서 먼 때" showLoss={active === 1} />
          <Allocation y={108} stock={40} name="목표 연도에 가까운 때" showLoss={active === 2} />
          <line x1={170} x2={170} y1={62} y2={84} stroke={GRAY} strokeWidth={1} />
          <polygon points="170,88 166,80 174,80" fill={GRAY} />
        </svg>
      )}
    />
  );
}
