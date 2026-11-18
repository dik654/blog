import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 도시 사업장의 부가가치 180이 임금·이익·세금으로 나가고,
 * 외부 통근자 임금·외부 소유자 재산소득은 도시 밖 가계로, 다른 지역·해외 소득은 도시 주민에게 들어온다.
 * 정부가 소득세·사회보험료를 걷고 연금·실업·가족 급여를 준 뒤 주민소득 120 ÷ 주민 100 = 1.2.
 * 180 − 120 = 60은 순 차이일 뿐 항목별 크기는 글에 없어 선 굵기를 모두 같게 그린다.
 */
const SLATE = "#64748b";
const OUT = "#d97706";
const IN = "#16a34a";
const STATE = "#7c3aed";
const CITY = "#2563eb";

const SCENES = [
  { label: "사업장이 부가가치 180을 나눕니다", summary: "임금 · 이익 · 세금", note: "기업은 도시에서 부가가치 180을 만들고 노동자에게 임금, 소유자에게 이익, 정부에 세금을 지급합니다. 이 장면의 임금·이익 화살표는 도시 안에 사는 노동자·소유자에게 가는 몫이고, 밖에 사는 사람에게 가는 몫은 다음 장면에서 따로 그립니다." },
  { label: "일부는 도시 밖 가계로 갑니다", summary: "통근자 임금 · 외부 소유자 이익", note: "다른 지역에 사는 통근자의 임금과 외부 소유자의 재산소득은 도시 경계를 넘어 밖의 가계로 갑니다. 이 생산은 도시 GDP에는 들어가지만 도시 주민의 소득은 되지 않습니다." },
  { label: "밖에서 들어오는 소득도 있습니다", summary: "다른 지역 · 해외 → 도시 주민", note: "도시 주민도 다른 지역과 해외에서 소득을 받을 수 있습니다. 그래서 나가는 몫만 빼서는 주민소득이 나오지 않습니다." },
  { label: "세금과 이전을 거쳐 120", summary: "120 ÷ 100 = 1.2", note: "정부는 소득세와 사회보험료를 걷고 연금·실업·가족 급여를 지급합니다. 그렇게 남은 주민소득 120을 주민 100으로 나누면 1.2입니다. 설명용 숫자로는 180에서 순 60이 줄었지만, 항목마다 얼마인지는 글에 없습니다." },
  { label: "생활수준 비교는 한 단계 더", summary: "물가 · 주거비 · 가구 규모", note: "지역 물가·주거비와 가구 규모를 반영해야 생활수준 비교에 가까워집니다. 글은 이 조정의 크기를 주지 않아 숫자를 적지 않았습니다." },
] as const;

function Node({ x, y, w, h, title, sub, color, on }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.4}>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={8} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={11} fill="currentColor">{sub}</text>}
    </g>
  );
}

type LinkState = "hidden" | "past" | "now";

function Link({ d, color, state }: { d: string; color: string; state: LinkState }) {
  if (state === "hidden") return <path d={d} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" opacity={0.25} />;
  const now = state === "now";
  return <path d={d} fill="none" stroke={now ? color : "#94a3b8"} strokeWidth={now ? 1.25 : 1} markerEnd={`url(#ledger-head-${now ? color.slice(1) : "past"})`} />;
}

function Label({ x, y, text, color, state, anchor = "middle" }: { x: number; y: number; text: string; color: string; state: LinkState; anchor?: "start" | "middle" | "end" }) {
  if (state === "hidden") return null;
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={10.5} fontWeight={state === "now" ? 700 : 400} fill={state === "now" ? color : "#64748b"}>
      {text}
    </text>
  );
}

export default function CityLedgerFlowViz() {
  return (
    <SceneShell
      eyebrow="생산 장부에서 가계 장부로"
      title="도시 생산 180이 주민소득 120이 되기까지 경계를 넘나드는 돈"
      description="점선 상자가 도시의 행정 경계입니다. 선 굵기는 금액이 아니며, 숫자가 적힌 곳만 글의 설명용 값입니다."
      ariaLabel="도시 사업장의 부가가치가 임금, 이익, 세금으로 나뉘고 경계를 넘어 나가고 들어온 뒤 정부의 세금과 급여를 거쳐 주민소득 120이 되는 경로"
      scenes={SCENES}
      render={(active) => {
        const state = (from: number): LinkState => (active < from ? "hidden" : active === from ? "now" : "past");
        const heads = [SLATE, OUT, IN, STATE];
        return (
          <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {[...heads.map((color) => [color.slice(1), color]), ["past", "#94a3b8"]].map(([key, color]) => (
                <marker key={key} id={`ledger-head-${key}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" fill={color} />
                </marker>
              ))}
            </defs>

            <rect x={4.5} y={70.5} width={236} height={130} rx={10} fill="none" stroke={CITY} strokeWidth={1} strokeDasharray="5 4" />
            <text x={234} y={194} textAnchor="end" fontSize={10.5} fill={CITY}>도시 행정 경계</text>

            <Node x={124} y={6} w={112} h={34} title="정부" color={STATE} on={active === 0 || active === 3} />
            <Node x={12} y={106} w={84} h={46} title="도시 사업장" sub="부가가치 180" color={SLATE} on={active <= 1} />
            <Node x={146} y={106} w={84} h={46} title="도시 주민" sub={active >= 3 ? "소득 120" : "가계"} color={CITY} on />
            <Node x={268} y={106} w={88} h={46} title="도시 밖" sub="다른 지역·해외" color={OUT} on={active === 1 || active === 2} />

            <Link d="M96,124 L142,124" color={SLATE} state={state(0)} />
            <Label x={120} y={118} text="임금·이익" color={SLATE} state={state(0)} />
            <Link d="M40,106 L40,23 L120,23" color={SLATE} state={state(0)} />
            <Label x={46} y={60} text="세금" color={SLATE} state={state(0)} anchor="start" />

            <Link d="M60,152 L60,178 L312,178 L312,156" color={OUT} state={state(1)} />
            <Label x={176} y={170} text="통근자 임금·외부 소유자 이익" color={OUT} state={state(1)} />

            <Link d="M268,138 L234,138" color={IN} state={state(2)} />
            <Label x={300} y={100} text="밖에서 받는 소득" color={IN} state={state(2)} />

            <Link d="M170,106 L170,44" color={STATE} state={state(3)} />
            <Label x={164} y={62} text="소득세·보험료" color={STATE} state={state(3)} anchor="end" />
            <Link d="M206,44 L206,102" color={STATE} state={state(3)} />
            <Label x={212} y={62} text="연금·실업·가족 급여" color={STATE} state={state(3)} anchor="start" />

            <g opacity={active >= 3 ? 1 : 0.25}>
              <rect x={4.5} y={212.5} width={351} height={42} rx={8} fill={CITY} fillOpacity={0.06} stroke={CITY} strokeWidth={1} />
              <text x={180} y={230} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">
                {active >= 3 ? "주민소득 120 ÷ 주민 100 = 1인당 1.2" : "주민소득 ÷ 주민 수"}
              </text>
              <text x={180} y={246} textAnchor="middle" fontSize={10.5} fill={active === 4 ? CITY : "#64748b"} fontWeight={active === 4 ? 700 : 400}>
                {active === 4 ? "→ 지역 물가·주거비·가구 규모 반영 → 생활수준 비교" : "생활수준 비교에는 한 단계가 더 남습니다"}
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
