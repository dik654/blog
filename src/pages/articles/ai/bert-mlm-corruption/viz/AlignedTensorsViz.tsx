import SceneShell from "./SceneShell";

/**
 * 본문 대응: #objective — model은 x̃ 전체를 읽지만 loss는 M 위치의 원래 token에만 붙는다.
 * 문장·token 분할·선택 위치는 예시입니다(가정). '고양이'가 random branch로 바뀌는 것은
 * #corruption의 TermBreakdown 예시를 따른 것이고, 바뀐 단어 '연필'은 가정입니다.
 * 보이려고 선택 위치를 3개로 늘렸으며 실제 선택 비율은 약 15%입니다.
 */
type Col = {
  token: string;
  special: boolean;
  branch?: "random" | "mask" | "same";
  shown: string;
};
const COLS: readonly Col[] = [
  { token: "[CLS]", special: true, shown: "[CLS]" },
  { token: "고양이", special: false, branch: "random", shown: "연필" },
  { token: "가", special: false, shown: "가" },
  { token: "창밖", special: false, branch: "mask", shown: "[MASK]" },
  { token: "을", special: false, shown: "을" },
  { token: "본다", special: false, branch: "same", shown: "본다" },
  { token: "[SEP]", special: true, shown: "[SEP]" },
  { token: "[PAD]", special: true, shown: "[PAD]" },
];
const BRANCH_COLOR = { random: "#d97706", mask: "#2563eb", same: "#7c3aed" } as const;
const BRANCH_NAME = { random: "random", mask: "MASK", same: "그대로" } as const;

const SCENES = [
  {
    label: "원래 sequence x",
    summary: "target으로 보존",
    note: "Corruption 전 token을 따로 보존합니다. 이 row가 나중에 맞혀야 할 정답 ID입니다. [CLS]·[SEP] 같은 special token과 [PAD]는 선택과 loss에서 빠집니다.",
  },
  {
    label: "Target 위치 M 선택",
    summary: "고양이 · 창밖 · 본다",
    note: "선택 가능한 위치 중 일부를 prediction 문제로 고릅니다. 그림에서는 보이려고 3곳을 골랐지만(가정) 실제 비율은 약 15%입니다.",
  },
  {
    label: "Model이 보는 입력 x̃",
    summary: "연필 · [MASK] · 본다",
    note: "선택된 위치만 바꿉니다. '고양이'는 random token으로, '창밖'은 [MASK]로 바뀌고, '본다'는 선택됐지만 그대로 보입니다. 나머지 위치는 원래 token입니다.",
  },
  {
    label: "Loss는 M 위치에만",
    summary: "−log p(고양이|x̃) − log p(창밖|x̃) − log p(본다|x̃)",
    note: "Model은 x̃ 전체를 읽고, 선택된 세 위치에서만 원래 token의 확률에 negative log를 씌워 더합니다. [MASK] 자리는 드러나지만, x̃의 '본다'는 선택 안 된 '가'와 똑같이 멀쩡해 보이고 '연필'도 평범한 단어라, 멀쩡해 보이는 token만으로는 어느 자리가 오염됐거나 문제인지 가릴 수 없습니다.",
  },
] as const;

const ROWS = ["x 원문", "M 선택", "x̃ 입력", "loss"] as const;

function cell(row: number, col: Col, active: number) {
  if (row > active) return { text: "", tone: "empty" as const };
  if (row === 0) return { text: col.token, tone: col.special ? ("special" as const) : ("plain" as const) };
  if (row === 1) {
    if (col.special) return { text: "제외", tone: "special" as const };
    return col.branch ? { text: "✓", tone: "picked" as const } : { text: "·", tone: "plain" as const };
  }
  if (row === 2) {
    if (col.special) return { text: col.shown, tone: "special" as const };
    return col.branch ? { text: col.shown, tone: col.branch } : { text: col.shown, tone: "plain" as const };
  }
  if (col.special || !col.branch) return { text: "—", tone: "special" as const };
  return { text: col.token, tone: "loss" as const };
}

export default function AlignedTensorsViz() {
  return (
    <SceneShell
      eyebrow="정렬된 세 row"
      title="원문·오염 입력·loss 위치는 같은 칸에 줄을 맞춥니다"
      description="열 하나가 token 위치 하나입니다. 문장, token 분할, 선택 위치, '연필'은 예시입니다(가정)."
      ariaLabel="원래 token, 선택 위치, model 입력, loss 위치를 위치별로 정렬한 예시"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[3.25rem_repeat(8,minmax(0,1fr))] gap-[3px] sm:grid-cols-[4.5rem_repeat(8,minmax(0,1fr))] sm:gap-1">
            {ROWS.map((rowLabel, row) => (
              <div key={rowLabel} className="contents">
                <span className={`flex items-center text-[10px] font-semibold leading-tight sm:text-xs ${row <= active ? "" : "text-muted-foreground/40"}`}>
                  {rowLabel}
                </span>
                {COLS.map((col, index) => {
                  const { text, tone } = cell(row, col, active);
                  const branchColor = tone === "random" || tone === "mask" || tone === "same" ? BRANCH_COLOR[tone] : undefined;
                  return (
                    <div
                      key={index}
                      className={`flex h-10 min-w-0 flex-col items-center justify-center rounded-sm border text-center leading-tight tracking-tight sm:h-12 ${
                        tone === "empty"
                          ? "border-dashed border-border/50"
                          : tone === "special"
                            ? "border-border/60 bg-muted/40 text-muted-foreground"
                            : tone === "picked"
                              ? "border-[#0f766e] bg-[#0f766e]/10 font-bold text-[#0f766e] dark:text-[#5eead4]"
                              : tone === "loss"
                                ? "border-[#e11d48] bg-[#e11d48]/10 font-semibold text-[#be123c] dark:text-[#fda4af]"
                                : branchColor
                                  ? "font-semibold"
                                  : "border-border bg-background"
                      }`}
                      style={branchColor ? { borderColor: branchColor, backgroundColor: `${branchColor}1a` } : undefined}
                    >
                      <span className="text-[9px] sm:text-xs">{text}</span>
                      {branchColor && tone !== "special" && col.branch && (
                        <span className="text-[8px] sm:text-[10px]" style={{ color: branchColor }}>
                          {BRANCH_NAME[col.branch]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground sm:text-xs">
            loss row의 단어는 그 위치에서 맞혀야 할 원래 token입니다. x̃의 칸 아래 작은 글씨는 branch 이름이며 model에게는 보이지 않습니다.
          </p>
        </div>
      )}
    />
  );
}
