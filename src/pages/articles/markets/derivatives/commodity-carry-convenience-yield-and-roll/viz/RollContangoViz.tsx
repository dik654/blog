import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 75달러 계약을 팔고 78달러 계약을 사면 수량 유지에 배럴당 3달러가 더 든다.
 * 가로축 = 날짜(만기), 세로 = 배럴당 가격. 세로축 눈금은 그리지 않고 본문 숫자만 라벨로 적는다.
 * 수렴 장면: 8절(만기에 현물과 선물이 수렴) + 현물 75 그대로(가정) → 78 계약은 다음 만기에 75, 78−75=3.
 * 백워데이션 장면은 본문에 숫자가 없어 방향만 그린다.
 */
const W = 360;
const H = 200;
const X_NOW = 70;
const X_NEXT = 290;
const y = (price: number) => 124 - (price - 75) * 22;
const Y_LOW = y(73.9);

const SCENES = [
  { label: "콘탱고 곡선", summary: "가까운 75 < 다음 78", note: "선 하나가 같은 날 화면에 뜬 만기별 선물가격을 잇습니다. 먼 만기가 가까운 만기보다 비싸면 이 모양을 콘탱고라고 부릅니다. 재고가 넉넉하고 보관비가 크면 나타나기 쉽습니다." },
  { label: "롤오버", summary: "75 팔고 78 사기 = +3", note: "만기가 다가온 75달러 계약을 팔고 다음 만기의 78달러 계약을 삽니다. 같은 수량을 유지하는 데 배럴당 3달러가 더 듭니다." },
  { label: "현물이 그대로면", summary: "78 → 75, 배럴당 −3", note: "만기에는 선물이 현물로 수렴합니다(8절). 현물이 75달러에 머물면(가정) 78달러에 산 계약도 다음 만기에 75달러 근처로 내려옵니다. 곡선 모양이 되풀이되면(가정) 롤마다 반복됩니다." },
  { label: "백워데이션이면", summary: "방향이 반대 · 크기는 본문에 없음", note: "당장 쓸 재고가 귀해 편의수익이 커지면 먼 만기가 더 싼 백워데이션이 나타날 수 있습니다. 롤이 유리할 수 있어도 현물이 크게 떨어지면 전체 수익은 손실일 수 있습니다(10절). 높이는 방향만 뜻합니다." },
] as const;

function Dot({ x, yy, color, label, anchor = "middle", dy = -10 }: { x: number; yy: number; color: string; label: string; anchor?: "start" | "middle" | "end"; dy?: number }) {
  return (
    <g>
      <circle cx={x} cy={yy} r={5} fill={color} />
      <text x={x} y={yy + dy} textAnchor={anchor} fontSize={13} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function RollContangoViz() {
  return (
    <SceneShell
      eyebrow="선물곡선과 롤"
      title="콘탱고에서 롤하면 현물이 그대로여도 차이가 생깁니다"
      description="가로축은 날짜(만기), 점은 배럴당 선물가격입니다. 75·78달러는 본문 숫자이고, 현물이 75달러에 머문다는 것은 설명을 위한 가정입니다."
      ariaLabel="콘탱고 곡선에서 75달러 계약을 78달러 계약으로 롤하고, 현물이 그대로일 때 78달러 계약이 75달러로 수렴하는 과정"
      scenes={SCENES}
      render={(active) => {
        const back = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={40} x2={W - 20} y1={176} y2={176} stroke="#94a3b8" strokeWidth={1} />
            <text x={X_NOW} y={192} textAnchor="middle" fontSize={12} fill="#64748b">가까운 만기(지금)</text>
            <text x={X_NEXT} y={192} textAnchor="middle" fontSize={12} fill="#64748b">다음 만기</text>
            <line x1={X_NOW} x2={X_NOW} y1={170} y2={176} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X_NEXT} x2={X_NEXT} y1={170} y2={176} stroke="#94a3b8" strokeWidth={1} />

            {!back && active >= 2 && (
              <g>
                <line x1={40} x2={W - 20} y1={y(75)} y2={y(75)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                <text x={40} y={y(75) + 18} textAnchor="start" fontSize={12} fill="#64748b">현물 75 그대로(가정)</text>
              </g>
            )}

            {!back && (
              <g opacity={active === 2 ? 0.35 : 1}>
                <line x1={X_NOW} x2={X_NEXT} y1={y(75)} y2={y(78)} stroke="#2563eb" strokeWidth={1.25} />
                <Dot x={X_NOW} yy={y(75)} color={active === 1 ? "#dc2626" : "#2563eb"} label={active === 1 ? "75 팔기" : "75"} />
                <Dot x={X_NEXT} yy={y(78)} color={active === 1 ? "#16a34a" : "#2563eb"} label={active === 1 ? "78 사기" : "78"} />
              </g>
            )}

            {!back && active === 1 && (
              <g>
                <line x1={X_NEXT + 22} x2={X_NEXT + 22} y1={y(75)} y2={y(78)} stroke="#d97706" strokeWidth={1.25} />
                <line x1={X_NEXT + 16} x2={X_NEXT + 28} y1={y(75)} y2={y(75)} stroke="#d97706" strokeWidth={1} />
                <line x1={X_NEXT + 16} x2={X_NEXT + 28} y1={y(78)} y2={y(78)} stroke="#d97706" strokeWidth={1} />
                <text x={X_NEXT + 30} y={(y(75) + y(78)) / 2 + 4} fontSize={13} fontWeight={700} fill="#d97706">+3</text>
              </g>
            )}

            {!back && active === 2 && (
              <g>
                <line x1={X_NOW} x2={X_NEXT} y1={y(78)} y2={y(75)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
                <circle cx={X_NOW} cy={y(78)} r={5} fill="#16a34a" />
                <text x={X_NOW} y={y(78) - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill="#16a34a">78에 산 계약</text>
                <circle cx={X_NEXT} cy={y(75)} r={5} fill="#d97706" />
                <text x={X_NEXT + 12} y={y(75) + 22} textAnchor="end" fontSize={13} fontWeight={700} fill="#d97706">만기에 75 · −3</text>
              </g>
            )}

            {back && (
              <g>
                <line x1={X_NOW} x2={X_NEXT} y1={y(75)} y2={Y_LOW} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="5 3" />
                <Dot x={X_NOW} yy={y(75)} color="#2563eb" label="가까운 만기가 더 비쌈" anchor="start" dy={-12} />
                <Dot x={X_NEXT} yy={Y_LOW} color="#2563eb" label="다음 만기가 더 쌈" anchor="end" dy={21} />
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
