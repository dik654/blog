import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 같은 문 열기라도 책임 차이는 앞 단계(정보→믿음, 이유 비교, 실행 조절)에 있다.
 * 칸 상태는 3절·7절 문장에서만 가져온다. 글이 말하지 않은 칸은 "글에서 다루지 않음"으로 둔다.
 */
type CellState = "ok" | "pressure" | "weak" | "unstated" | "same";

interface Cell {
  state: CellState;
  text: string;
}

const STAGES = ["정보 → 믿음", "이유 비교", "실행 조절", "마지막 장면"] as const;

const PEOPLE: readonly { name: string; cells: readonly Cell[] }[] = [
  {
    name: "돈을 받고 계획한 사람",
    cells: [
      { state: "ok", text: "결과를 앎" },
      { state: "ok", text: "대안 비교 · 자기 이익" },
      { state: "ok", text: "자기 이유로 움직임" },
      { state: "same", text: "문고리를 돌림" },
    ],
  },
  {
    name: "위협받은 사람",
    cells: [
      { state: "ok", text: "결과를 앎" },
      { state: "pressure", text: "가족이 인질 · 거부 비용 커짐" },
      { state: "unstated", text: "글에서 다루지 않음" },
      { state: "same", text: "문고리를 돌림" },
    ],
  },
  {
    name: "수면보행자",
    cells: [
      { state: "weak", text: "행동을 이해 못 함" },
      { state: "weak", text: "이유 반응 약함" },
      { state: "weak", text: "자기 이유로 조절 못 함" },
      { state: "same", text: "문고리를 돌림" },
    ],
  },
];

const STYLE: Record<CellState, { border: string; text: string; tag: string }> = {
  ok: { border: "border-[#16a34a]", text: "text-[#15803d] dark:text-[#4ade80]", tag: "갖춤" },
  pressure: { border: "border-[#d97706]", text: "text-[#b45309] dark:text-[#fbbf24]", tag: "압력" },
  weak: { border: "border-[#dc2626]", text: "text-[#b91c1c] dark:text-[#f87171]", tag: "약함" },
  unstated: { border: "border-dashed border-[#94a3b8]", text: "text-muted-foreground", tag: "미기술" },
  same: { border: "border-[#64748b]", text: "text-foreground", tag: "같음" },
};

const SCENES = [
  { label: "마지막 장면만 보면", summary: "셋 다 문고리를 돌렸습니다", note: "손이 문고리를 돌린 장면은 세 사람이 똑같습니다. 이 칸만 보고는 누구에게 얼마나 책임을 물을지 가를 수 없습니다.", reveal: 0 },
  { label: "돈을 받고 계획한 사람", summary: "앞 단계가 모두 갖춰짐", note: "결과를 알고 대안을 비교하며 자기 이익을 이유로 움직였고, 위협도 없었습니다.", reveal: 1 },
  { label: "위협받은 사람", summary: "이유 비교에 압력이 들어옴", note: "결과는 알았지만 가족의 안전이 인질로 잡혀 거부 비용이 커졌습니다. 실행 단계는 글이 따로 말하지 않아 비워 둡니다.", reveal: 2 },
  { label: "수면보행자", summary: "앞 단계가 약하거나 무너짐", note: "3절은 정보와 이유 반응이 약하다고 했고, 7절은 자기 이유로 행동을 조절하지 못했다고 합니다.", reveal: 3 },
  { label: "차이는 앞 단계에 있습니다", summary: "앞의 세 단계가 책임을 가릅니다", note: "책임 차이는 마지막 칸이 아니라 정보가 믿음으로 들어오고, 이유를 비교하고, 실행을 조절하는 앞 단계에서 생깁니다. 그래서 행위 전후의 기록과 압력의 구조가 필요합니다.", reveal: 3 },
] as const;

export default function ResponsibilityStagesViz() {
  return (
    <SceneShell
      eyebrow="같은 문 열기, 다른 앞 단계"
      title="세 사람은 마지막 장면이 아니라 앞 단계에서 갈립니다"
      description="가로 줄 하나가 한 사람, 칸 하나가 행동에 이르는 단계입니다. 칸에는 글이 말한 상태만 적었고, 색과 함께 '갖춤·압력·약함·미기술' 글자로도 구분합니다. 점수가 아니라 어떤 근거가 빠졌는지 보는 표입니다."
      ariaLabel="돈을 받은 사람, 위협받은 사람, 수면보행자의 정보·이유 비교·실행 조절 단계 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const emphasizeFront = active === SCENES.length - 1;
        return (
          <div className="min-w-0 space-y-4">
            <div className="hidden grid-cols-[8.5rem_repeat(4,minmax(0,1fr))] gap-2 text-xs font-bold text-muted-foreground sm:grid">
              <span />
              {STAGES.map((stage) => (
                <span key={stage} className="text-center">{stage}</span>
              ))}
            </div>
            {PEOPLE.map((person, row) => {
              const shown = row < scene.reveal;
              const focus = active === row + 1;
              return (
                <div key={person.name} className="grid grid-cols-1 gap-2 sm:grid-cols-[8.5rem_repeat(4,minmax(0,1fr))] sm:items-stretch">
                  <span className={`text-sm leading-6 sm:self-center ${focus ? "font-bold text-foreground" : "font-semibold text-muted-foreground"}`}>{person.name}</span>
                  <div className="grid grid-cols-2 gap-2 sm:contents">
                    {person.cells.map((cell, col) => {
                      const isLast = col === STAGES.length - 1;
                      const visible = shown || isLast;
                      const style = STYLE[cell.state];
                      const dim = emphasizeFront ? isLast : !focus && active !== 0 && !isLast;
                      return (
                        <div
                          key={STAGES[col]}
                          className={`min-w-0 rounded-lg border bg-background px-2 py-1.5 text-center transition-opacity duration-300 motion-reduce:transition-none ${
                            visible ? style.border : "border-dashed border-border/60"
                          } ${dim ? "opacity-45" : "opacity-100"}`}
                        >
                          <span className="block text-[11px] text-muted-foreground sm:hidden">{STAGES[col]}</span>
                          <span className={`block text-xs font-bold ${visible ? style.text : "text-muted-foreground/60"}`}>{visible ? style.tag : "?"}</span>
                          <span className={`block text-xs leading-5 ${visible ? "" : "text-muted-foreground/50"}`}>{visible ? cell.text : "아직 안 봄"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
