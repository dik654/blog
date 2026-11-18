import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 섬 가구·지역경제 자원 100 = 생산 35 + 송금 25 + 관광 30 + 지원금 10.
 * 관광 30→10(−20), 송금 25→20(−5)이면 35 + 20 + 10 + 10 = 75.
 * 막대 전체 폭 = 100. 줄어든 몫은 점선 칸으로 남긴다. 감소 25 중 관광 20(80%), 송금 5(20%).
 */
const PARTS = [
  { key: "production", name: "현지 생산", before: 35, color: "#2563eb" },
  { key: "remittance", name: "해외 송금", before: 25, color: "#16a34a" },
  { key: "tourism", name: "관광", before: 30, color: "#d97706" },
  { key: "aid", name: "정부·공여 지원", before: 10, color: "#7c3aed" },
] as const;

type PartKey = (typeof PARTS)[number]["key"];

const SCENES = [
  {
    label: "충격 전: 네 갈래로 100",
    summary: "35 + 25 + 30 + 10 = 100",
    after: { production: 35, remittance: 25, tourism: 30, aid: 10 },
    note: "막대 전체가 자원 100입니다. 특정 나라 통계가 아니라 생산·송금·관광·지원금이 서로 다른 외부 연결에서 온다는 점을 보려고 단순화한 설명용 장부입니다.",
  },
  {
    label: "관광이 30에서 10으로",
    summary: "관광 −20 → 합계 80",
    after: { production: 35, remittance: 25, tourism: 10, aid: 10 },
    note: "글의 가정대로 항공과 관광 충격으로 관광이 줄었다고 봅니다. 점선 칸이 사라진 관광 20입니다. 나머지 세 칸은 아직 그대로입니다.",
  },
  {
    label: "송금도 25에서 20으로",
    summary: "송금 −5 → 합계 75",
    after: { production: 35, remittance: 20, tourism: 10, aid: 10 },
    note: "같은 충격 장부에서 송금도 5 줄었다고 가정합니다. 생산 35와 지원금 10은 그대로인데도 막대는 75까지 짧아집니다.",
  },
  {
    label: "줄어든 25는 어디서 왔나",
    summary: "관광 20 + 송금 5 = 25",
    after: { production: 35, remittance: 20, tourism: 10, aid: 10 },
    note: "감소 25 가운데 20은 관광, 5는 송금에서 왔습니다. 현지 생산과 지원금이 그대로여도 가구와 정부의 소비·세수가 함께 줄 수 있습니다. 실제로는 송금이 위기 때 오히려 늘어 완충하거나 정부가 지원금을 늘릴 수도 있습니다.",
  },
] as const;

const pct = (value: number) => `${value}%`;

function StackedBar({ values, ghost }: { values: Record<PartKey, number>; ghost: boolean }) {
  return (
    <div className="flex h-9 min-w-0 overflow-hidden rounded-sm border border-border/60">
      {PARTS.map((part) => {
        const kept = values[part.key];
        const lost = part.before - kept;
        return (
          <div key={part.key} className="flex h-full" style={{ width: pct(part.before) }}>
            <div
              className="flex h-full items-center justify-center font-mono text-xs font-bold text-white transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(kept / part.before) * 100}%`, backgroundColor: part.color }}
            >
              {kept}
            </div>
            {ghost && lost > 0 && (
              <div
                className="flex h-full items-center justify-center border border-dashed font-mono text-xs font-bold text-red-700 dark:text-red-400"
                style={{ width: `${(lost / part.before) * 100}%`, borderColor: "#dc2626" }}
              >
                {lost >= 10 ? `−${lost}` : ""}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function IslandIncomeShockViz() {
  return (
    <SceneShell
      eyebrow="설명용 섬 장부"
      title="관광과 송금 두 칸이 줄면 100이 75가 됩니다"
      description="막대 전체 폭이 충격 전 자원 100입니다. 색 칸 안의 숫자가 남은 크기, 빨간 점선 칸이 줄어든 크기입니다. 모든 숫자는 1·3절의 설명용 가정입니다."
      ariaLabel="생산 35, 송금 25, 관광 30, 지원금 10의 자원 100이 관광과 송금 감소로 75가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = PARTS.reduce<number>((sum, part) => sum + scene.after[part.key], 0);
        const showSource = active === SCENES.length - 1;
        const lostText = PARTS.filter((part) => part.before > scene.after[part.key])
          .map((part) => `${part.name} −${part.before - scene.after[part.key]}`)
          .join(", ");
        return (
          <div className="min-w-0 space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">충격 전</p>
              <StackedBar values={{ production: 35, remittance: 25, tourism: 30, aid: 10 }} ghost={false} />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                지금 <span className="font-mono font-bold text-foreground">{total}</span>
                <span className="ml-2 text-red-700 dark:text-red-400">{lostText ? `점선 = ${lostText}` : "\u00a0"}</span>
              </p>
              <StackedBar values={scene.after} ghost />
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-xs sm:grid-cols-4">
              {PARTS.map((part) => (
                <li key={part.key} className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: part.color }} />
                  <span>{part.name}</span>
                </li>
              ))}
            </ul>
            <div className={`grid grid-cols-[minmax(0,4fr)_minmax(0,1fr)] gap-2 text-center text-xs ${showSource ? "" : "invisible"}`} aria-hidden={!showSource}>
              <div className="rounded-lg border border-dashed px-1 py-2 leading-5" style={{ borderColor: "#d97706" }}>
                관광에서 <span className="font-mono font-bold">20</span> (감소의 80%)
              </div>
              <div className="rounded-lg border border-dashed px-1 py-2 leading-5" style={{ borderColor: "#16a34a" }}>
                송금 <span className="font-mono font-bold">5</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
