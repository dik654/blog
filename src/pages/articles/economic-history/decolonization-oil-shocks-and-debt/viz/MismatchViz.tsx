import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 수익은 자국 통화, 빚은 달러(통화 어긋남). 단기 변동금리로 장기 시설(만기 어긋남).
 * 세계 금리·환율이 급변하면 유익한 사업도 현금 부족으로 중단될 수 있습니다.
 * 글에 금액·기간이 없어 칸 수, 막대 길이, 대출 횟수는 전부 그림을 위한 가정입니다.
 */
const SCENES = [
  { label: "통화가 어긋납니다", summary: "자국 통화로 벌고 달러로 갚음", note: "같은 달러 빚이라도 자국 통화 가치가 떨어지면 갚는 데 드는 자국 통화가 늘어납니다. 국내 세금으로 마련해야 할 금액이 커지는 것입니다(2절)." },
  { label: "만기가 어긋납니다", summary: "효과는 나중, 갚을 날은 먼저", note: "만기는 빚을 갚기로 한 날이고, 변동금리는 세계 금리에 따라 이자가 달라지는 대출입니다. 시설의 효과는 나중에 나는데 단기 대출의 만기는 그 전에 옵니다." },
  { label: "세계 금리·환율이 급변하면", summary: "유익한 사업도 중단될 수 있음", note: "사업 자체가 나빠지지 않아도, 만기와 이자를 맞출 현금이 모자라 중단될 수 있습니다. 반드시 중단된다는 뜻은 아니며, 충격의 시점과 크기는 그림을 위한 가정입니다." },
] as const;

const W = 340;
const BOX = "#94a3b8";
const MUTED = "#64748b";
const RED = "#dc2626";

function Currency() {
  return (
    <>
      <rect x={6} y={6} width={124} height={52} rx={8} fill="none" stroke={BOX} strokeWidth={1} />
      <text x={68} y={28} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">사업 수익</text>
      <text x={68} y={47} textAnchor="middle" fontSize={12} fill={MUTED}>자국 통화</text>
      <rect x={210} y={6} width={124} height={52} rx={8} fill="none" stroke={BOX} strokeWidth={1} />
      <text x={272} y={28} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">외채 상환</text>
      <text x={272} y={47} textAnchor="middle" fontSize={12} fill={MUTED}>달러</text>
      <line x1={134} x2={200} y1={32} y2={32} stroke={MUTED} strokeWidth={1} />
      <path d="M200 27 L208 32 L200 37 Z" fill={MUTED} />
      <text x={170} y={25} textAnchor="middle" fontSize={12} fill={MUTED}>바꿔서</text>

      <text x={6} y={86} fontSize={12} fill={MUTED}>같은 달러 빚에 드는 자국 통화 (칸 수는 가정)</text>
      <text x={6} y={115} fontSize={12} fill={MUTED}>가치 하락 전</text>
      {[0, 1].map((i) => <rect key={i} x={92 + i * 42} y={98} width={38} height={26} rx={3} fill="#64748b" />)}
      <text x={6} y={151} fontSize={12} fill={RED} fontWeight={700}>가치 하락 뒤</text>
      {[0, 1, 2].map((i) => <rect key={i} x={92 + i * 42} y={134} width={38} height={26} rx={3} fill={i === 2 ? RED : "#64748b"} />)}
      <text x={224} y={151} fontSize={12} fontWeight={700} fill={RED}>더 내야 할 몫</text>
    </>
  );
}

const LOANS = [
  { x: 6, label: "대출" },
  { x: 80, label: "다시 빌림" },
  { x: 154, label: "다시 빌림" },
] as const;
const EFFECT_X = 196;

function Maturity({ shock }: { shock: boolean }) {
  return (
    <>
      <text x={6} y={14} fontSize={13} fontWeight={700} className="fill-foreground">장기 시설</text>
      <rect x={6} y={21} width={EFFECT_X - 8} height={28} rx={3} fill={BOX} />
      <text x={(6 + EFFECT_X) / 2} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">오늘 큰돈이 듦</text>
      {shock ? (
        <>
          <rect x={EFFECT_X} y={21} width={W - EFFECT_X - 6} height={28} rx={3} fill="none" stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />
          <text x={(EFFECT_X + W - 6) / 2} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>중단될 수 있음</text>
        </>
      ) : (
        <>
          <rect x={EFFECT_X} y={21} width={W - EFFECT_X - 6} height={28} rx={3} fill="#15803d" />
          <text x={(EFFECT_X + W - 6) / 2} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">효과는 나중에</text>
        </>
      )}

      <text x={6} y={76} fontSize={13} fontWeight={700} className="fill-foreground">단기 변동금리 대출</text>
      {LOANS.map((loan, index) => {
        // 급변 뒤의 차환은 된다고 그리지 않습니다. 본문은 "중단될 수 있습니다"까지만 말합니다.
        const uncertain = shock && index === LOANS.length - 1;
        return (
          <g key={loan.x}>
            <rect x={loan.x} y={83} width={70} height={28} rx={3} fill={uncertain ? "none" : "#2563eb"} stroke={uncertain ? RED : "none"} strokeWidth={uncertain ? 1.25 : 0} strokeDasharray={uncertain ? "4 3" : undefined} />
            <text x={loan.x + 35} y={102} textAnchor="middle" fontSize={12} fontWeight={700} fill={uncertain ? RED : "#ffffff"}>{uncertain ? "다시 빌릴까?" : loan.label}</text>
            <path d={`M${loan.x + 70} 115 l-4 7 l8 0 Z`} fill={MUTED} />
            <text x={loan.x + 70} y={134} textAnchor="middle" fontSize={12} fill={MUTED}>만기</text>
          </g>
        );
      })}

      {shock && (
        <>
          <line x1={152} x2={152} y1={18} y2={113} stroke={RED} strokeWidth={1.25} />
          <text x={152} y={13} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>금리·환율 급변</text>
        </>
      )}

      <line x1={6} x2={W - 12} y1={164} y2={164} stroke={BOX} strokeWidth={1} />
      <path d={`M${W - 12} 159 L${W - 4} 164 L${W - 12} 169 Z`} fill={BOX} />
      <text x={6} y={181} fontSize={12} fill={MUTED}>오늘</text>
      <text x={W - 4} y={181} textAnchor="end" fontSize={12} fill={MUTED}>나중 (길이·횟수는 가정)</text>
    </>
  );
}

export default function MismatchViz() {
  return (
    <SceneShell
      eyebrow="두 가지 어긋남"
      title="버는 통화와 갚는 통화, 효과가 나는 때와 갚을 때가 어긋납니다"
      description="글에 금액과 기간이 없어 숫자를 적지 않았습니다. 칸 수와 길이는 어긋남의 모양만 보여 주는 가정입니다."
      ariaLabel="수익 통화와 빚 통화의 어긋남, 장기 시설과 단기 대출 만기의 어긋남, 급변 시 중단 가능성"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 186`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? <Currency /> : <Maturity shock={active === 2} />}
        </svg>
      )}
    />
  );
}
