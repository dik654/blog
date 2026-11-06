import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 105−3=102, 102/100=1.02, 10×1.02=10.20, 102×.8=81.60. 모두 달러, 설명용 가정.
 * 위 막대 = 금액(같은 눈금 0~105). 아래 칸 = 발행 지분 100개.
 */
const SCENES = [
  { label: "순자산", summary: "105 − 3 = 102", note: "자산 평가액 105에서 지급할 비용·부채 3을 빼면 순자산 102가 남습니다. 지분 보유자에게 나눌 수 있는 쪽은 102입니다." },
  { label: "100개로 나누기", summary: "102 ÷ 100 = 개당 1.02", note: "칸 하나가 발행 지분 1개이고, 같은 평가 기준으로 칸마다 1.02입니다. 이 값은 평가이며 그 가격의 매수자가 있다는 뜻은 아닙니다." },
  { label: "A의 10개", summary: "10 × 1.02 = 10.20", note: "보유자 A의 10개는 같은 평가 기준으로 10.20입니다. 지금 즉시 그 가격으로 팔 수 있다는 약속이 아니며 평가 기준 시각과 실제 거래 상대방이 필요합니다." },
  { label: "20% 할인", summary: "102 × 0.8 = 81.60", note: "100개 전부를 담보로 보는 대출자가 20%를 할인하면 담보 평가액은 81.60입니다. 실제 대출 한도와 같으려면 추가 담보비율·집중도 제한 등 다른 조건이 없다는 가정이 필요합니다." },
] as const;

const W = 360;
const BAR_X = 8;
const BAR_W = W - 16;
const money = (value: number) => (value / 105) * BAR_W;
const COLS = 20;
const CELL = BAR_W / COLS;

export default function NavUnitsViz() {
  return (
    <SceneShell
      eyebrow="가상 펀드의 장부"
      title="순자산 102가 100개의 칸으로 나뉘고 다시 할인됩니다"
      description="금액은 모두 달러이고 설명용 가정입니다. 실제 펀드의 값이 아닙니다. 위 막대는 금액, 아래 칸은 발행 지분 100개입니다."
      ariaLabel="순자산 계산과 지분당 가치, A의 10개, 20퍼센트 할인"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 214`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={BAR_X} y={8} width={money(102)} height={24} fill="#2563eb" opacity={0.8} />
          <rect x={BAR_X + money(102)} y={8} width={money(3)} height={24} fill="#dc2626" />
          <rect x={BAR_X} y={8} width={money(105)} height={24} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} />
          <text x={BAR_X} y={47} fontSize={12.5} fontWeight={700} fill="#2563eb">순자산 102</text>
          <text x={W - 8} y={47} textAnchor="end" fontSize={12.5} fontWeight={700} fill="#dc2626">비용·부채 3 (자산 105 중)</text>
          {Array.from({ length: 100 }, (_, index) => {
            const col = index % COLS;
            const row = Math.floor(index / COLS);
            const isA = active === 2 && index < 10;
            const cut = active === 3 && index >= 80;
            const lit = active >= 1;
            return (
              <rect
                key={index}
                x={BAR_X + col * CELL + 1}
                y={62 + row * (CELL + 2)}
                width={CELL - 2}
                height={CELL}
                rx={2}
                fill={isA ? "#d97706" : cut ? "none" : "#2563eb"}
                opacity={isA ? 1 : cut ? 1 : lit ? (active === 2 ? 0.3 : 0.7) : 0.15}
                stroke={cut ? "#dc2626" : "none"}
                strokeWidth={cut ? 1 : 0}
                strokeDasharray={cut ? "2 2" : undefined}
              />
            );
          })}
          {active === 1 && <text x={BAR_X} y={208} fontSize={12.5} fontWeight={700} fill="#2563eb">칸 하나 = 지분 1개 = 1.02</text>}
          {active === 2 && <text x={BAR_X} y={208} fontSize={12.5} fontWeight={700} fill="#d97706">A의 10칸 = 10.20</text>}
          {active === 3 && (
            <g>
              <text x={BAR_X} y={208} fontSize={12.5} fontWeight={700} fill="#2563eb">담보 평가로 남는 80% = 81.60</text>
              <text x={W - 8} y={208} textAnchor="end" fontSize={12.5} fontWeight={700} fill="#dc2626">할인 20% = 20.40</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
