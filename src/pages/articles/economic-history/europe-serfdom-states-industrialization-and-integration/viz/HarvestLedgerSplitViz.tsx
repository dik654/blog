import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 두 장부.
 * 의무 장부 100 = 영주 의무 30 + 국가 세금 10 + 종자·생계 40 + 잔여 20.
 * 시장 장부 110 = 현금 임대료 25 + 세금 15 + 시장용 투입 20 + 생계 35 + 잔여 15.
 * 두 막대는 같은 축(0~110)에 놓아 생산 +10, 잔여 −5를 길이로 비교한다.
 */
const SCALE = 110;

interface Part {
  name: string;
  value: number;
  color: string;
  rest?: boolean;
}

const DUTY: readonly Part[] = [
  { name: "영주 의무", value: 30, color: "#7c3aed" },
  { name: "국가 세금", value: 10, color: "#d97706" },
  { name: "종자·생계", value: 40, color: "#64748b" },
  { name: "잔여", value: 20, color: "#16a34a", rest: true },
];

const MARKET: readonly Part[] = [
  { name: "현금 임대료", value: 25, color: "#7c3aed" },
  { name: "세금", value: 15, color: "#d97706" },
  { name: "시장용 투입", value: 20, color: "#0891b2" },
  { name: "생계", value: 35, color: "#64748b" },
  { name: "잔여", value: 15, color: "#16a34a", rest: true },
];

const total = (parts: readonly Part[]) => parts.reduce<number>((sum, part) => sum + part.value, 0);

const SCENES = [
  { label: "의무 장부: 수확 100", summary: "100 − 30 − 10 − 40 = 20", note: "영주 의무 30과 국가 세금 10을 내고 다음 해 종자·생계 40을 남기면 20이 남습니다." },
  { label: "시장 장부: 생산 110", summary: "110 − 25 − 15 − 20 − 35 = 15", note: "법적 강제는 줄었지만 임대료·세금·투입비 60을 현금으로 먼저 냅니다." },
  { label: "같은 축에서 나란히", summary: "생산 +10 · 잔여 −5", note: "생산은 10 늘고 잔여는 5 줄었습니다. 이동·투자 선택이 넓어지는 장기 효과는 이 막대 밖에 있습니다." },
] as const;

function Ledger({ title, parts, faded, restOnly }: { title: string; parts: readonly Part[]; faded: boolean; restOnly: boolean }) {
  const sum = total(parts);
  const starts = parts.map((_, index) => parts.slice(0, index).reduce<number>((acc, part) => acc + part.value, 0));
  return (
    <div className={`min-w-0 transition-opacity duration-300 motion-reduce:transition-none ${faded ? "opacity-0" : "opacity-100"}`} aria-hidden={faded}>
      <div className="flex items-baseline justify-between gap-2 text-xs sm:text-sm">
        <span className="font-semibold">{title}</span>
        <span className="font-mono text-muted-foreground">합계 {sum}</span>
      </div>
      <div className="relative mt-1 h-7 min-w-0 rounded-sm bg-muted/30">
        {parts.map((part, index) => (
          <div
            key={part.name}
            className="absolute inset-y-0 flex items-center justify-center border-r border-background font-mono text-[11px] font-bold text-white transition-opacity duration-300 motion-reduce:transition-none sm:text-xs"
            style={{
              left: `${(starts[index] / SCALE) * 100}%`,
              width: `${(part.value / SCALE) * 100}%`,
              backgroundColor: part.color,
              opacity: restOnly && !part.rest ? 0.25 : 1,
            }}
          >
            {part.value}
          </div>
        ))}
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] leading-4 sm:text-xs sm:leading-5">
        {parts.map((part) => (
          <li key={part.name} className={`flex items-center gap-1 ${part.rest ? "font-bold" : "text-muted-foreground"}`}>
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: part.color }} />
            {part.name} {part.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HarvestLedgerSplitViz() {
  return (
    <SceneShell
      eyebrow="농가 장부 두 개"
      title="생산이 늘어도 남는 몫은 줄 수 있습니다"
      description="막대 하나가 한 해의 생산이고, 칸은 그 생산이 어디로 나가는지입니다. 두 막대는 같은 눈금이라 길이를 바로 비교할 수 있습니다. 숫자는 실제 영지 통계가 아닌 설명용 장부입니다."
      ariaLabel="수확 100의 의무 장부와 생산 110의 시장 장부에서 잔여 20과 15 비교"
      scenes={SCENES}
      render={(active) => {
        const at = (value: number) => `${(value / SCALE) * 100}%`;
        return (
          <div className="min-w-0 space-y-3">
            <Ledger title="의무 장부" parts={DUTY} faded={false} restOnly={active === 2} />
            <Ledger title="시장 장부" parts={MARKET} faded={active === 0} restOnly={active === 2} />
            <div className="relative h-4 text-[11px] text-muted-foreground">
              <span className="absolute left-0 font-mono">0</span>
              <span className="absolute -translate-x-1/2 font-mono" style={{ left: at(50) }}>50</span>
              <span className="absolute -translate-x-1/2 font-mono" style={{ left: at(100) }}>100</span>
            </div>
          </div>
        );
      }}
    />
  );
}
