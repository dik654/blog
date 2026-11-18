import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 수확 100을 종자 15·소비 65·비축 20으로 나누고(가정),
 * 다음 해 흉작 50에 지난 비축 20을 더해 70, 종자 15를 다시 남겨 현재 소비 55.
 * 첫해 소비 65와 비교하면 10이 줄어든다. 막대 폭은 모두 같은 100 기준이다.
 */
type Part = { name: string; value: number; color: string; dashed?: boolean };

const SEED = "#0f766e";
const EAT = "#2563eb";
const STORE = "#d97706";
const HARVEST = "#64748b";
const SHORT = "#dc2626";

const YEAR1_WHOLE: readonly Part[] = [{ name: "수확", value: 100, color: HARVEST }];
const YEAR1_SPLIT: readonly Part[] = [
  { name: "종자", value: 15, color: SEED },
  { name: "소비", value: 65, color: EAT },
  { name: "비축", value: 20, color: STORE },
];
const YEAR2_SOURCE: readonly Part[] = [
  { name: "흉작 수확", value: 50, color: HARVEST },
  { name: "지난 비축", value: 20, color: STORE },
];
const YEAR2_USE: readonly Part[] = [
  { name: "종자", value: 15, color: SEED },
  { name: "소비", value: 55, color: EAT },
];
const YEAR2_GAP: readonly Part[] = [...YEAR2_USE, { name: "줄어듦", value: 10, color: SHORT, dashed: true }];

const SCENES = [
  { label: "첫해 수확 100", summary: "100", year1: YEAR1_WHOLE, source: null, use: null, note: "한 마을이 곡물 100단위를 거두었다고 놓습니다(가정). 막대 전체 폭이 100이고, 아래 줄도 모두 같은 100 기준으로 그립니다." },
  { label: "세 몫으로 나눕니다", summary: "15 + 65 + 20 = 100", year1: YEAR1_SPLIT, source: null, use: null, note: "다음 파종을 위해 15를 남기고, 현재 65를 먹으며, 20을 공동 창고에 비축합니다. 종자와 비축 35는 지금 바로 먹을 수 없는 몫입니다." },
  { label: "다음 해 흉작 50", summary: "수확 50", year1: YEAR1_SPLIT, source: YEAR2_SOURCE.slice(0, 1), use: null, note: "다음 해 수확이 50으로 줄었습니다. 같은 100 기준이라 막대가 첫해의 절반 폭입니다." },
  { label: "지난 비축 20을 더합니다", summary: "50 + 20 = 70", year1: YEAR1_SPLIT, source: YEAR2_SOURCE, use: null, note: "첫해 창고에 넣은 20이 이때 꺼낼 수 있는 몫이 됩니다. 쓸 수 있는 양은 모두 70입니다." },
  { label: "종자 15를 다시 남깁니다", summary: "70 − 15 = 55", year1: YEAR1_SPLIT, source: YEAR2_SOURCE, use: YEAR2_USE, note: "다음 파종용 15를 다시 떼어 두면 지금 먹을 수 있는 양은 55입니다." },
  { label: "줄어든 10은 누가 부담하나", summary: "65 − 55 = 10", year1: YEAR1_SPLIT, source: YEAR2_SOURCE, use: YEAR2_GAP, note: "첫해 현재 소비 65보다 10이 적습니다. 빨간 점선 칸이 첫해 소비 막대의 끝과 같은 자리에서 끝납니다. 이 10을 누가 부담하는지는 창고의 규칙과 힘에 달렸고, 숫자는 특정 유적의 실측값이 아닙니다." },
] as const;

function Bar({ parts, thin = false }: { parts: readonly Part[] | null; thin?: boolean }) {
  return (
    <div className={`flex w-full min-w-0 rounded-md border border-dashed border-border/60 ${thin ? "h-9" : "h-12"}`}>
      {parts?.map((part) => (
        <div
          key={part.name}
          className="flex min-w-0 flex-col items-center justify-center overflow-hidden border text-center leading-tight first:rounded-l-md last:rounded-r-md"
          style={{ width: `${part.value}%`, borderColor: part.color, borderStyle: part.dashed ? "dashed" : "solid", backgroundColor: `${part.color}26` }}
        >
          <span className="text-[11px] font-semibold sm:text-xs">{part.name}</span>
          <span className="font-mono text-[11px] font-bold sm:text-xs">{part.dashed ? `−${part.value}` : part.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function GranaryTwoYearViz() {
  return (
    <SceneShell
      eyebrow="두 해의 창고 장부"
      title="비축 20이 흉작의 해로 건너갑니다"
      description="막대 폭은 곡물 단위입니다. 세 줄 모두 같은 100 기준이며, 수치는 몫을 나눠 보려는 가정입니다."
      ariaLabel="첫해 수확 100을 종자, 소비, 비축으로 나누고 다음 해 흉작 50에 비축 20을 더해 현재 소비 55가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold">첫해 · 쓰는 곳</p>
              <Bar parts={scene.year1} />
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-semibold ${scene.source ? "" : "text-muted-foreground/50"}`}>다음 해 · 들어온 곳</p>
              <Bar parts={scene.source} thin />
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-semibold ${scene.use ? "" : "text-muted-foreground/50"}`}>다음 해 · 쓰는 곳</p>
              <Bar parts={scene.use} />
            </div>
          </div>
        );
      }}
    />
  );
}
