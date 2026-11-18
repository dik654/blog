import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 예산 100에서 군비 50→35, 의례 20→10으로 줄여 남은 25를
 * 구제 +20(→40), 행정 +5(→15)로 옮기면 합계가 다시 100이 된다.
 * 마지막 장면은 같은 장부의 어느 줄에 묵가·유가·법가 흐름의 질문이 걸리는지 본문 문구 그대로 붙인다.
 */
type LineKey = "army" | "relief" | "ritual" | "admin";

const LINES: readonly { key: LineKey; name: string; color: string }[] = [
  { key: "army", name: "군비", color: "#64748b" },
  { key: "relief", name: "흉년 구제", color: "#16a34a" },
  { key: "ritual", name: "큰 의례", color: "#d97706" },
  { key: "admin", name: "행정", color: "#2563eb" },
];

const BASE: Readonly<Record<LineKey, number>> = { army: 50, relief: 20, ritual: 20, admin: 10 };

const QUESTIONS: Readonly<Record<LineKey, readonly string[]>> = {
  army: ["묵가: 공격 전쟁의 비용을 물을 수 있음", "법가 흐름: 군사 경쟁의 현실을 먼저 볼 수 있음"],
  relief: ["법가 흐름: 구제의 선의보다 명확한 집행을 먼저 볼 수 있음"],
  ritual: ["묵가: 과도한 장례·음악의 비용을 물을 수 있음", "유가: 욕망·역할을 조정하는 기능을 잃는다고 반론할 수 있음"],
  admin: [],
};

const SCENES = [
  {
    label: "기존 배분",
    summary: "50 + 20 + 20 + 10 = 100",
    values: { army: 50, relief: 20, ritual: 20, admin: 10 },
    pool: 0,
    questions: false,
    note: "쓸 수 있는 예산은 100뿐입니다. 군비 50, 흉년 구제 20, 큰 의례 20, 행정 10으로 나눠 두었습니다. 숫자는 이 글이 설명용으로 정한 값입니다.",
  },
  {
    label: "두 줄을 줄입니다",
    summary: "군비 −15, 의례 −10 → 남은 몫 25",
    values: { army: 35, relief: 20, ritual: 10, admin: 10 },
    pool: 25,
    questions: false,
    note: "군비를 50에서 35로, 큰 의례를 20에서 10으로 줄입니다. 점선 칸이 줄기 전의 크기이고, 빠진 15와 10이 아래 ‘남은 몫’ 25로 모입니다.",
  },
  {
    label: "남은 25를 다시 나눕니다",
    summary: "구제 +20 → 40, 행정 +5 → 15",
    values: { army: 35, relief: 40, ritual: 10, admin: 15 },
    pool: 0,
    questions: false,
    note: "25 가운데 20은 구제로 가서 40이 되고, 5는 행정으로 가서 15가 됩니다. 35 + 40 + 10 + 15로 합계는 다시 100입니다.",
  },
  {
    label: "같은 장부에 다른 질문이 걸립니다",
    summary: "어느 줄을 먼저 보느냐",
    values: { army: 35, relief: 40, ritual: 10, admin: 15 },
    pool: 0,
    questions: true,
    note: "묵가의 절용(쓰임을 아낌)·비공(공격 전쟁 반대) 관점은 군비와 의례의 비용을 물을 수 있습니다. 유가는 의례를 줄이면 그 조정 기능을 잃는다고 반론할 수 있고, 법가 흐름은 구제의 선의보다 집행과 군사 경쟁을 먼저 볼 수 있습니다.",
  },
] as const;

const SCALE = 50;

function Ledger({ index }: { index: number }) {
  const scene = SCENES[index];
  const values: Readonly<Record<LineKey, number>> = scene.values;
  const total = LINES.reduce<number>((sum, line) => sum + values[line.key], 0) + scene.pool;
  return (
    <div className="min-w-0 space-y-3">
      {LINES.map((line) => {
        const value = values[line.key];
        const base = BASE[line.key];
        const changed = value !== base;
        const questions = scene.questions ? QUESTIONS[line.key] : [];
        return (
          <div key={line.key} className="min-w-0">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:grid-cols-[5.5rem_minmax(0,1fr)_5rem] sm:text-sm">
              <span className="font-semibold">{line.name}</span>
              <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
                {index > 0 ? (
                  <div className="absolute inset-y-0 left-0 rounded-sm border border-dashed border-muted-foreground/70" style={{ width: `${(base / SCALE) * 100}%` }} />
                ) : null}
                <div className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: line.color }} />
              </div>
              <span className="text-right font-mono">
                {changed ? (
                  <>
                    <span className="text-muted-foreground">{base}→</span>
                    <span className="font-bold">{value}</span>
                  </>
                ) : (
                  <span>{value}</span>
                )}
              </span>
            </div>
            {questions.length > 0 ? (
              <ul className="mt-1 flex flex-wrap gap-1.5 pl-0 sm:pl-[6rem]">
                {questions.map((question) => (
                  <li key={question} className="rounded-md border border-primary/60 px-2 py-0.5 text-xs leading-5 [word-break:keep-all]">
                    {question}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:grid-cols-[5.5rem_minmax(0,1fr)_5rem] sm:text-sm">
        <span className={scene.pool > 0 ? "font-semibold" : "text-muted-foreground"}>남은 몫</span>
        <div className="relative h-5 min-w-0 rounded-sm">
          {scene.pool > 0 ? (
            <div className="absolute inset-y-0 left-0 rounded-sm border border-dashed border-red-600 bg-red-600/10" style={{ width: `${(scene.pool / SCALE) * 100}%` }} />
          ) : null}
        </div>
        <span className="text-right font-mono">{scene.pool > 0 ? <span className="font-bold">{scene.pool}</span> : "0"}</span>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2 text-xs sm:text-sm">
        <span className="text-muted-foreground">막대 끝 = 50</span>
        <span className="font-mono font-bold">합계 {total}</span>
      </div>
    </div>
  );
}

export default function BudgetShiftViz() {
  return (
    <SceneShell
      eyebrow="설명용 예산 100"
      title="군비와 의례에서 뺀 25가 구제와 행정으로 갑니다"
      description="막대 하나가 예산의 한 줄이고, 막대 끝은 50입니다. 숫자는 이 글이 설명용으로 정한 가정이며 실제 전국시대 국가의 장부가 아닙니다."
      ariaLabel="예산 100에서 군비와 의례를 줄여 남은 25를 구제와 행정에 옮기고, 각 학파의 질문이 걸리는 줄을 보이는 네 장면"
      scenes={SCENES}
      render={(active) => <Ledger index={active} />}
    />
  );
}
