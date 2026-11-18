import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 핵심만기 금리를 하나씩 움직여 민감도를 구하고,
 * 2년 위험은 2년 수단으로, 10년 위험은 장기 수단으로 따로 맞춘다. 총 듀레이션이 0이어도 만기별 위험은 남을 수 있다.
 * 본문에 숫자가 없어 민감도 −60·+60과 0.01%p 이동은 모두 설명용 가정이다.
 * 평행 이동 손익 = −60 + 60 = 0, 2년만 이동 손익 = −60, 헤지 뒤 만기별 순민감도 = 0.
 */
const W = 360;
const H = 212;
const ZERO_Y = 112;
const SCALE = 1;
const BAR_W = 26;
const TENORS = ["1년", "2년", "5년", "10년"] as const;
const XS = [62, 148, 234, 320] as const;
const BOOK = [0, -60, 0, 60] as const;
const HEDGE = [0, 60, 0, -60] as const;

const SCENES = [
  { label: "만기별 민감도(가정)", summary: "2년 −60 · 10년 +60 · 합계 0", note: "핵심만기 민감도는 곡선의 한 지점만 조금 움직였을 때 가치가 얼마나 바뀌는지입니다. 이 장부(가정)는 2년 금리가 0.01%p 오르면 60을 잃고 10년 금리가 오르면 60을 법니다. 합계가 0이라 총 듀레이션으로는 위험이 없어 보입니다." },
  { label: "곡선 전체가 평행하게 오르면", summary: "−60 + 60 = 0", note: "1·2·5·10년이 모두 같이 0.01%p 오르면 2년 손실과 10년 이익이 상쇄돼 손익은 0입니다. 평행 이동 한 숫자만 보면 여기서 멈춥니다." },
  { label: "2년만 오르면", summary: "손익 −60", note: "곡선이 기울어 2년 금리만 0.01%p 오르면(가정) 10년의 이익이 생기지 않아 60을 그대로 잃습니다. 총 듀레이션이 0이어도 만기별 위험이 남는 경로입니다." },
  { label: "만기별로 따로 맞추면", summary: "2년 +60 · 10년 −60 → 각 0", note: "2년 위험은 2년 선물이나 스왑으로, 10년 위험은 장기 수단으로 따로 맞춥니다. 헤지 민감도(가정)를 더하면 네 핵심만기의 순민감도가 각각 0이 되어, 2년만 움직여도 손익이 상쇄됩니다." },
] as const;

const barY = (value: number) => (value >= 0 ? ZERO_Y - value * SCALE : ZERO_Y);
const barH = (value: number) => Math.abs(value) * SCALE;
const fmt = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0");

export default function KeyRateViz() {
  return (
    <SceneShell
      eyebrow="핵심만기 민감도"
      title="합계가 0이어도 2년만 움직이면 손익이 남습니다"
      description="가로는 곡선의 핵심만기, 막대는 그 만기 금리만 0.01%p 올렸을 때의 손익입니다. 본문에 숫자가 없어 −60·+60은 설명용 가정이며 단위도 임의입니다."
      ariaLabel="2년 −60, 10년 +60인 장부가 평행 이동에는 손익 0이지만 2년만 오르면 −60이고, 만기별 헤지 뒤 각 만기 순민감도가 0이 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const hedged = active === 3;
        const moved = active === 1 ? [true, true, true, true] : active === 2 ? [false, true, false, false] : [false, false, false, false];
        const pnl = active === 1 ? BOOK.reduce<number>((sum, v) => sum + v, 0) : active === 2 ? BOOK[1] : null;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={20} x2={W - 12} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={20} y={ZERO_Y - 6} fontSize={10} fill="#64748b">0</text>
            {XS.map((x, index) => {
              const book = BOOK[index];
              const hedge = HEDGE[index];
              const bookX = hedged ? x - BAR_W - 2 : x - BAR_W / 2;
              const dim = active === 2 && !moved[index];
              return (
                <g key={TENORS[index]}>
                  {moved[index] && (
                    <g>
                      <line x1={x} x2={x} y1={35} y2={22} stroke="#d97706" strokeWidth={1.25} markerEnd="url(#kr-arrow)" />
                    </g>
                  )}
                  {book !== 0 && (
                    <g opacity={dim ? 0.25 : 1}>
                      <rect x={bookX} y={barY(book)} width={BAR_W} height={barH(book)} fill="#2563eb" />
                      <text x={bookX + BAR_W / 2} y={book > 0 ? barY(book) - 5 : ZERO_Y + barH(book) + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{fmt(book)}</text>
                    </g>
                  )}
                  {hedged && hedge !== 0 && (
                    <g>
                      <rect x={x + 2} y={barY(hedge)} width={BAR_W} height={barH(hedge)} fill="#d97706" />
                      <text x={x + 2 + BAR_W / 2} y={hedge > 0 ? barY(hedge) - 5 : ZERO_Y + barH(hedge) + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">{fmt(hedge)}</text>
                    </g>
                  )}
                  {hedged && <circle cx={x} cy={ZERO_Y} r={4} fill="#16a34a" />}
                  <text x={x} y={H - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">{TENORS[index]}</text>
                </g>
              );
            })}
            {hedged && (
              <g>
                <rect x={20} y={8} width={10} height={10} fill="#2563eb" />
                <text x={34} y={17} fontSize={10} fill="currentColor">기존 장부</text>
                <rect x={92} y={8} width={10} height={10} fill="#d97706" />
                <text x={106} y={17} fontSize={10} fill="currentColor">헤지 수단</text>
                <circle cx={169} cy={13} r={4} fill="#16a34a" />
                <text x={177} y={17} fontSize={10} fill="currentColor">순민감도 0</text>
              </g>
            )}
            {active === 1 || active === 2 ? (
              <text x={W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">{active === 1 ? "네 만기 금리 모두 +0.01%p" : "2년 금리만 +0.01%p"}</text>
            ) : null}
            {pnl !== null && (
              <text x={W - 12} y={185} textAnchor="end" fontSize={13} fontWeight={700} fill={pnl === 0 ? "#16a34a" : "#dc2626"}>손익 {fmt(pnl)}</text>
            )}
            {active === 0 && (
              <text x={W - 12} y={185} textAnchor="end" fontSize={13} fontWeight={700} fill="#475569">민감도 합계 {fmt(BOOK.reduce<number>((sum, v) => sum + v, 0))}</text>
            )}
            <defs>
              <marker id="kr-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill="#d97706" />
              </marker>
            </defs>
          </svg>
        );
      }}
    />
  );
}
