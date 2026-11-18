import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 재고 손실 10을 선물 이익 10으로 막아 경제적 순손익은 0.
 * 두 항목의 인식 시점이나 소득 성격이 다르면 한 기간의 과세소득은 0이 아닐 수 있다.
 * 어느 항목이 어느 기간·범주에 들어가는지는 설명용 가정이다.
 */
type Item = { name: string; value: number; period: 0 | 1; group: "A" | "B" };

const PERIODS = ["기간 1", "기간 2"] as const;

const SCENES = [
  {
    label: "경제적으로는 0입니다",
    summary: "+10 − 10 = 0",
    items: [
      { name: "선물 이익", value: 10, period: 0, group: "A" },
      { name: "재고 손실", value: -10, period: 0, group: "A" },
    ] as readonly Item[],
    showGroup: false,
    note: "재고에서 10을 잃고 선물에서 10을 벌었습니다. 두 항목이 같은 기간에 잡히고 서로 합칠 수 있다면 그 기간의 과세소득도 0입니다(가정).",
  },
  {
    label: "인식 시점이 갈리면",
    summary: "기간 1 +10 · 기간 2 −10",
    items: [
      { name: "선물 이익", value: 10, period: 0, group: "A" },
      { name: "재고 손실", value: -10, period: 1, group: "A" },
    ] as readonly Item[],
    showGroup: false,
    note: "선물 이익은 기간 1에, 재고 손실은 기간 2에 잡힌다고 놓았습니다(가정). 두 기간을 합치면 여전히 0이지만 기간 1만 보면 과세소득이 +10입니다.",
  },
  {
    label: "소득 성격이 갈리면",
    summary: "같은 기간에도 +10이 남을 수 있음",
    items: [
      { name: "선물 이익", value: 10, period: 0, group: "A" },
      { name: "재고 손실", value: -10, period: 0, group: "B" },
    ] as readonly Item[],
    showGroup: true,
    note: "같은 기간에 잡혀도 두 항목이 서로 다른 소득 범주에 들어가고 그 범주끼리 합칠 수 없다면(가정) 범주 A의 +10은 그대로 남을 수 있습니다. 소득 성격은 손익을 어느 소득 범주에 놓는지 정하는 세법상 분류입니다.",
  },
] as const;

const MAX = 10;

function SignedBar({ value }: { value: number }) {
  const width = `${(Math.abs(value) / MAX) * 50}%`;
  const positive = value > 0;
  return (
    <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
      <div className="absolute inset-y-0 left-1/2 border-l" style={{ borderColor: "#94a3b8" }} />
      {value !== 0 ? (
        <div
          className="absolute inset-y-0 rounded-sm"
          style={{ left: positive ? "50%" : undefined, right: positive ? undefined : "50%", width, backgroundColor: positive ? "#16a34a" : "#dc2626" }}
        />
      ) : null}
    </div>
  );
}

function fmt(value: number) {
  if (value === 0) return "0";
  return `${value > 0 ? "+" : "−"}${Math.abs(value)}`;
}

function Figure({ index }: { index: number }) {
  const scene = SCENES[index];
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
      {PERIODS.map((period, p) => {
        const inPeriod = scene.items.filter((item) => item.period === p);
        const groups = Array.from(new Set(inPeriod.map((item) => item.group)));
        return (
          <div key={period} className="min-w-0 rounded-lg border border-border p-3">
            <p className="text-sm font-bold">{period} <span className="font-normal text-muted-foreground">(가정)</span></p>
            <div className="mt-2 space-y-2">
              {[0, 1].map((slot) => {
                const item = inPeriod[slot];
                return (
                  <div key={slot} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                    <span className={item ? "font-semibold" : "text-muted-foreground/50"}>
                      {item ? item.name : "잡힌 항목 없음"}
                      {item && scene.showGroup ? <span className="block font-normal text-muted-foreground">범주 {item.group}</span> : null}
                    </span>
                    {item ? <SignedBar value={item.value} /> : <div className="h-4 rounded-sm border border-dashed border-border/50" />}
                    <span className="text-right font-mono">{item ? fmt(item.value) : ""}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 border-t border-border pt-2 text-xs">
              <span className="text-muted-foreground">이 기간 과세소득: </span>
              {groups.length === 0 ? (
                <span className="font-mono font-bold">0</span>
              ) : (
                groups.map((group) => {
                  const total = inPeriod.filter((item) => item.group === group).reduce<number>((sum, item) => sum + item.value, 0);
                  return (
                    <span key={group} className="mr-2 font-mono font-bold" style={{ color: total > 0 ? "#15803d" : total < 0 ? "#b91c1c" : undefined }}>
                      {scene.showGroup ? `범주 ${group} ` : ""}{fmt(total)}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HedgeTimingViz() {
  return (
    <SceneShell
      eyebrow="헤지와 세금 시점"
      title="경제적으로 0인 헤지도 한 기간의 세금 장부에는 숫자가 남을 수 있습니다"
      description="막대는 손익 크기 10을 기준으로 그렸습니다. 어느 항목이 어느 기간·범주에 들어가는지는 설명용 가정이며 특정 나라의 규칙이 아닙니다."
      ariaLabel="재고 손실 10과 선물 이익 10이 같은 기간, 다른 기간, 다른 소득 범주에 잡힐 때 기간별 과세소득 비교"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Figure key={scene.label} index={index} />)} />}
    />
  );
}
