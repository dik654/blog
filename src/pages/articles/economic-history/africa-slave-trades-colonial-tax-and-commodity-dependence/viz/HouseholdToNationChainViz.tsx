import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 매출 20이 중개·운송 4, 정부 세금 10, 농가 6으로 나뉘고,
 * 수출업자는 국제 통화 대금을 수입 기계·연료·부채 상환에 쓴다.
 * 국제 가격이 절반이면 농가 소득·관세와 수출세·정부 예산·외채 상환이 함께 줄 "수 있다".
 * 수출업자가 받는 대금의 크기는 글에 없어 숫자와 굵기로 그리지 않는다.
 */
const SLATE = "#64748b";
const FARM = "#16a34a";
const STATE = "#7c3aed";
const TRADE = "#2563eb";
const COST = "#d97706";
const HIT = "#dc2626";

const SCENES = [
  { label: "매출 20이 세 갈래로", summary: "4 + 10 + 6 = 20", note: "농가가 현금작물 20을 팔면 중개·운송업자가 비용 4를, 정부가 세금 10을 가져가고 농가에는 6이 남습니다. 3절의 가구 장부와 같은 숫자입니다." },
  { label: "수출업자는 국제 통화를 받습니다", summary: "대금 → 기계·연료·부채", note: "수출업자는 세계시장에서 국제 통화로 대금을 받아 수입 기계·연료와 부채 상환에 씁니다. 이 대금이 얼마인지는 글에 없어 숫자를 적지 않았습니다." },
  { label: "국제 가격이 절반이면", summary: "농가·관세·예산·외채 상환이 함께 줄 수 있음", note: "가격 충격은 농가 한 곳에서 멈추지 않습니다. 농가 소득, 관세와 수출세, 정부 예산, 외채 상환이 함께 줄 수 있습니다(빨간 점선). 얼마나 줄지는 나라와 작물마다 달라 크기로 그리지 않았습니다." },
] as const;

function Node({ x, y, w, h, title, sub, color, on, hit }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color: string; on: boolean; hit?: boolean }) {
  const stroke = hit ? HIT : color;
  return (
    <g opacity={on ? 1 : 0.35}>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={8} fill={stroke} fillOpacity={0.1} stroke={stroke} strokeWidth={1} strokeDasharray={hit ? "4 3" : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={11} fill={hit ? HIT : "currentColor"}>{sub}</text>}
    </g>
  );
}

function Link({ d, color, on, hit }: { d: string; color: string; on: boolean; hit?: boolean }) {
  return <path d={d} fill="none" stroke={hit ? HIT : color} strokeWidth={1.25} strokeDasharray={hit ? "4 3" : undefined} opacity={on ? 1 : 0.3} markerEnd={`url(#chain-head-${hit ? "hit" : on ? "on" : "off"})`} />;
}

export default function HouseholdToNationChainViz() {
  return (
    <SceneShell
      eyebrow="가구 장부에서 국가 장부로"
      title="작물 매출 20이 정부 예산과 외채 상환까지 이어집니다"
      description="상자 크기와 선 굵기는 금액이 아닙니다. 숫자가 적힌 곳만 3절의 설명용 금액이고, 나머지는 글에 크기가 없습니다."
      ariaLabel="농가 매출 20의 분배와 수출업자의 국제 통화 대금, 국제 가격 절반 때 함께 줄 수 있는 네 곳"
      scenes={SCENES}
      render={(active) => {
        const s0 = active === 0;
        const s1 = active === 1;
        const hit = active === 2;
        return (
          <svg viewBox="0 0 360 250" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {[
                ["on", "#64748b"],
                ["off", "#94a3b8"],
                ["hit", HIT],
              ].map(([key, color]) => (
                <marker key={key} id={`chain-head-${key}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" fill={color} />
                </marker>
              ))}
            </defs>

            <Node x={4} y={8} w={352} h={34} title="세계시장" sub={hit ? "국제 가격 절반" : undefined} color={TRADE} on={s1 || hit} hit={hit} />

            <Node x={4} y={84} w={184} h={40} title="농가 현금작물" sub="매출 20" color={SLATE} on />
            <Node x={200} y={84} w={156} h={40} title="수출업자" sub="국제 통화로 대금" color={TRADE} on={s1 || hit} />

            <Link d="M188,104 L197,104" color={SLATE} on={s1 || hit} />
            <Link d="M250,84 L250,46" color={SLATE} on={s1 || hit} />
            <text x={244} y={68} textAnchor="end" fontSize={11} fill="currentColor" opacity={s1 || hit ? 1 : 0.4}>작물</text>
            <Link d="M306,46 L306,80" color={TRADE} on={s1 || hit} hit={hit} />
            <text x={312} y={68} fontSize={11} fill={hit ? HIT : TRADE} opacity={s1 || hit ? 1 : 0.4}>대금</text>

            <Link d="M35,124 L35,170" color={COST} on={s0} />
            <Link d="M105,124 L105,170" color={STATE} on={s0 || hit} hit={hit} />
            <Link d="M166,124 L166,170" color={FARM} on={s0 || hit} hit={hit} />
            <Link d="M237,124 L237,170" color={TRADE} on={s1} />
            <Link d="M318,124 L318,170" color={TRADE} on={s1 || hit} hit={hit} />

            <Node x={4} y={174} w={62} h={48} title="중개·운송" sub="4" color={COST} on={s0} />
            <Node x={70} y={174} w={70} h={48} title={hit ? "정부 예산" : "정부"} sub={hit ? "관세·수출세" : "세금 10"} color={STATE} on={s0 || hit} hit={hit} />
            <Node x={144} y={174} w={44} h={48} title="농가" sub={hit ? "소득" : "6"} color={FARM} on={s0 || hit} hit={hit} />
            <Node x={200} y={174} w={74} h={48} title="수입" sub="기계·연료" color={TRADE} on={s1} />
            <Node x={280} y={174} w={76} h={48} title="외채" sub="상환" color={TRADE} on={s1 || hit} hit={hit} />

            <text x={96} y={242} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>가구 매출의 분배</text>
            <text x={277} y={242} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>수출 대금의 쓰임</text>
          </svg>
        );
      }}
    />
  );
}
