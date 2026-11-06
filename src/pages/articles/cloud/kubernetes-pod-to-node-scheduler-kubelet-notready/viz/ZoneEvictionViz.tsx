import SceneShell from "./SceneShell";

/**
 * 본문 대응: #notready-clock caveats — 여러 노드가 함께 죽을 때 축출 속도가 갈리는 조건입니다.
 * 판정은 아래 evaluate가 NotReady 수와 전체 수에서 직접 계산합니다. 3노드 사례 외의 규모는 조건을 보이려는 (가정)이고 zone 하나로 된 클러스터로 둡니다.
 */
const CASES = [
  { total: 3, down: 2, label: "3개 중 2개", assumed: false },
  { total: 100, down: 40, label: "100개 중 40개", assumed: true },
  { total: 100, down: 60, label: "100개 중 60개", assumed: true },
  { total: 40, down: 25, label: "40개 중 25개", assumed: true },
  { total: 3, down: 3, label: "3개 중 3개", assumed: false },
] as const;

type Verdict = { all: boolean; unhealthy: boolean; large: boolean; result: string; rate: string; tone: string };

function evaluate(total: number, down: number): Verdict {
  const all = down === total;
  const unhealthy = down >= 3 && down / total >= 0.55;
  const large = total > 50;
  if (all) return { all, unhealthy, large, result: "taint를 떼고 축출을 전부 멈춤", rate: "멈춤", tone: "#b91c1c" };
  if (!unhealthy) return { all, unhealthy, large, result: "정상 zone: 10초에 노드 하나", rate: "0.1/s", tone: "#15803d" };
  if (large) return { all, unhealthy, large, result: "비정상 zone: 100초에 노드 하나", rate: "0.01/s", tone: "#b45309" };
  return { all, unhealthy, large, result: "노드 50개 이하: 축출 멈춤", rate: "멈춤", tone: "#b91c1c" };
}

const NOTES = [
  "NotReady가 2개라 3개 미만입니다. 66.7%여도 정상 zone으로 보아 10초에 하나씩 지워집니다.",
  "(가정) NotReady가 3개 이상이지만 40%로 55%에 못 미칩니다. 정상 zone입니다.",
  "(가정) 3개 이상이고 60%라 비정상 zone입니다. 클러스터가 50개보다 크므로 100초에 하나로 낮춥니다.",
  "(가정) 62.5%로 비정상 zone이지만 노드 50개 이하 클러스터이므로 축출을 멈춥니다.",
  "zone의 모든 노드가 NotReady면 control plane 쪽 문제로 보고 taint를 떼고 축출을 전부 멈춥니다.",
];

const SCENES = CASES.map((item, index) => ({
  label: item.label,
  summary: evaluate(item.total, item.down).rate,
  note: NOTES[index],
}));

function Check({ text, value, skipped }: { text: string; value: boolean; skipped: boolean }) {
  return (
    <li className={`flex items-start justify-between gap-3 text-xs leading-5 ${skipped ? "text-muted-foreground/60" : ""}`}>
      <span className="min-w-0">{text}</span>
      <span className="shrink-0 font-bold">{skipped ? "안 봄" : value ? "예" : "아니오"}</span>
    </li>
  );
}

export default function ZoneEvictionViz() {
  return (
    <SceneShell
      eyebrow="여러 노드가 함께 죽을 때"
      title="NotReady 비율과 클러스터 크기가 축출 속도를 가릅니다"
      description="칸 하나가 노드 하나이고 ×가 표시된 칸이 NotReady입니다. 축출은 그 노드의 Pod를 지우는 일입니다. zone은 함께 장애를 겪기 쉬운 노드 묶음이며, 여기서는 클러스터 전체를 zone 하나로 둡니다(가정). 위에서 아래로 조건을 봅니다."
      ariaLabel="NotReady 노드 수와 비율, 클러스터 크기에 따른 축출 속도 분기"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const v = evaluate(item.total, item.down);
        return (
          <div className="min-w-0">
            <div className="grid min-h-[5.5rem] gap-[3px]" style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))", alignContent: "start" }}>
              {Array.from({ length: item.total }, (_, i) => {
                const down = i < item.down;
                return (
                  <span key={i} className="flex aspect-square items-center justify-center rounded-[2px] text-[9px] font-bold leading-none" style={{ backgroundColor: down ? "#fee2e2" : "#dcfce7", color: "#991b1b", border: `1px solid ${down ? "#dc2626" : "#16a34a"}` }}>
                    {down ? "×" : ""}
                  </span>
                );
              })}
            </div>
            <ul className="mt-3 space-y-1 border-y border-border py-2">
              <Check text="zone의 모든 노드가 NotReady?" value={v.all} skipped={false} />
              <Check text={`NotReady 3개 이상이고 55% 이상? (${item.down}개, ${Number(((item.down / item.total) * 100).toFixed(1))}%)`} value={v.unhealthy} skipped={v.all} />
              <Check text="클러스터 노드 50개 초과?" value={v.large} skipped={v.all || !v.unhealthy} />
            </ul>
            <p className="mt-3 rounded-sm border px-3 py-1.5 text-center text-sm font-bold" style={{ borderColor: v.tone, color: v.tone }}>{v.result}</p>
          </div>
        );
      }}
    />
  );
}
