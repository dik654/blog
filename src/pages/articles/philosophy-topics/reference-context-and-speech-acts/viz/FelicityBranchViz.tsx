import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 오스틴의 두 실패: 권한 없는 사람이 배 이름을 선언 → 불발(행위 불성립),
 * 지킬 생각 없이 약속 → 남용(행위는 성립, 진지성 위반). 조건이 맞으면 약속과 기대가 생기고(3절),
 * 지켜졌는지는 그 뒤에 묻는다(9절 첫 문단, 7절: 말한 순간 돈이 이동하지는 않음).
 * 행 = [질문1 알맞은 사람·절차, 행위 성립, 질문2 진지한 의사, 이후 이행].
 * 남용은 행위가 성립한 뒤의 실패이므로 '행위 성립' 행을 진지성 질문보다 위에 둔다.
 */
type RowState = "idle" | "pass" | "fail" | "end";

const SCENES: readonly { label: string; summary: string; rows: readonly [RowState, RowState, RowState, RowState]; example: string; note: string }[] = [
  {
    label: "말을 했다고 행위가 끝나지 않습니다",
    summary: "두 갈림길",
    rows: ["idle", "idle", "idle", "idle"],
    example: "같은 글자의 말이라도 아래 두 질문을 거칩니다.",
    note: "참·거짓만 묻지 않고, 말행위가 적절하게 수행됐는지를 묻습니다. 오스틴은 실패를 두 종류로 나눴습니다.",
  },
  {
    label: "첫 갈림길에서 걸리면: 불발",
    summary: "행위 자체가 성립하지 않음",
    rows: ["fail", "idle", "idle", "idle"],
    example: "권한 없는 사람이 배 이름을 선언합니다.",
    note: "불발(misfire)은 말은 했지만 그 행위 자체가 성립하지 않은 실패입니다. 배 이름을 붙이는 일은 이뤄지지 않습니다.",
  },
  {
    label: "둘째 갈림길에서 걸리면: 남용",
    summary: "성립하지만 진지성 위반",
    rows: ["pass", "pass", "fail", "idle"],
    example: "지킬 생각 없이 ‘내일 10만원을 갚겠다’고 약속합니다.",
    note: "남용(abuse)은 약속이라는 행위는 성립했지만 진지한 의사라는 기준을 어긴 실패입니다. 불발과 달리 약속은 있었던 것이 됩니다.",
  },
  {
    label: "두 갈림길을 모두 지나면: 진지한 약속",
    summary: "기대와 의무가 생김",
    rows: ["pass", "pass", "end", "idle"],
    example: "채무자가 채권자에게 진지하게 말하고 상대가 알아듣습니다.",
    note: "조건이 맞으면 약속과 기대가 생깁니다. 말은 이렇게 새로운 사회적 사실을 만듭니다.",
  },
  {
    label: "지켜졌는지는 그 뒤에 묻습니다",
    summary: "말한 순간 돈은 그대로",
    rows: ["pass", "pass", "pass", "end"],
    example: "내일, 10만원이 실제로 건너갔는지를 봅니다.",
    note: "말한 순간 돈이 이동하지는 않지만, 이후 행동을 평가할 이유가 생깁니다. 지켜졌는지는 성립 여부와 따로 묻는 세 번째 질문입니다.",
  },
];

const ROWS = [
  { question: "알맞은 사람·절차인가?", failName: "불발", failText: "행위 자체가 성립하지 않음" },
  { question: "행위 성립", failName: "", failText: "" },
  { question: "진지한 의사가 있는가?", failName: "남용", failText: "성립했지만 진지성 기준 위반" },
  { question: "이후: 지켜졌는가?", failName: "", failText: "" },
] as const;

const COLOR: Record<RowState, string> = { idle: "#94a3b8", pass: "#2563eb", fail: "#dc2626", end: "#2563eb" };

export default function FelicityBranchViz() {
  return (
    <SceneShell
      eyebrow="말행위의 성공 조건"
      title="약속이 성립하거나 실패하는 두 갈림길"
      description="왼쪽 줄은 위에서 아래로 묻는 질문, 오른쪽은 ‘아니오’일 때의 실패 이름입니다. 두 질문만 그린 것은 글이 든 두 실패를 가르기 위한 단순화입니다."
      ariaLabel="말행위가 알맞은 사람과 절차를 묻는 첫 질문에서 걸리면 불발, 통과하면 행위가 성립하고, 그 뒤 진지한 의사를 묻는 둘째 질문에서 걸리면 남용, 통과하면 진지한 약속이 되며 이행은 그 뒤에 묻는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <p className="rounded-lg border border-border px-3 py-2 text-sm leading-6">
              <span className="mr-2 text-xs text-muted-foreground">사례</span>
              {scene.example}
            </p>
            <ol className="min-w-0 space-y-2">
              {ROWS.map((row, index) => {
                const state = (scene.rows as readonly RowState[])[index];
                const color = COLOR[state];
                const branching = index === 0 || index === 2;
                return (
                  <li key={row.question} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch gap-2 text-sm">
                    <div
                      className={`flex min-h-[3rem] min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-1.5 ${state === "idle" ? "text-muted-foreground" : "font-semibold"}`}
                      style={{ borderColor: color, borderStyle: index === 3 ? "dashed" : "solid" }}
                    >
                      <span className="leading-5">{row.question}</span>
                      <span className="shrink-0 text-xs" style={{ color }}>
                        {state === "pass" ? (branching ? "예 ↓" : "↓") : state === "fail" ? "아니오 →" : state === "end" ? (branching ? "예 · 여기" : "여기") : ""}
                      </span>
                    </div>
                    {branching ? (
                      <div
                        className={`min-h-[3rem] min-w-0 rounded-lg border border-dashed px-3 py-1.5 ${state === "fail" ? "" : "opacity-40"}`}
                        style={{ borderColor: state === "fail" ? "#dc2626" : "#94a3b8" }}
                      >
                        <span className="block font-semibold leading-5" style={{ color: state === "fail" ? "#dc2626" : undefined }}>{row.failName}</span>
                        <span className="block text-xs leading-4 text-muted-foreground">{row.failText}</span>
                      </div>
                    ) : (
                      <div />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }}
    />
  );
}
