import SceneShell from "./SceneShell";

/**
 * 본문 대응: #promotion — Promotion threshold.
 * 형태: capture → verify → publish change → decision? → reusable rule?
 * 예: Guard 수정만이면 Changelog에서 끝나고, storage layout 전환이 있을 때만 ADR-005가 생긴다.
 * 경계: 중요해 보인다는 이유나 template checklist만으로 승격하지 않는다.
 */
type LevelState = "made" | "skip" | "maybe";
type GateState = "yes" | "no" | "ask" | "reject";

const LEVELS = [
  { name: "Artifact", role: "관찰 원문 · 무엇을 관찰했나" },
  { name: "Changelog", role: "검증된 변화 · 언제 무엇이 바뀌었나" },
  { name: "ADR", role: "장기 선택 · 왜 골랐나" },
  { name: "Lessons", role: "현재 규칙 · 지금 무엇을 적용하나" },
] as const;

const GATES = ["검증된 notable change인가?", "장기 제약을 만드는 선택이 있나?", "scope·exception·test를 가진 현재 원칙인가?"] as const;

const SCENES = [
  {
    label: "Guard 수정만 있을 때",
    summary: "Changelog에서 끝",
    note: "관찰을 artifact로 고정하고, 검증을 통과한 변화만 Changelog에 올립니다. 장기 선택이 없으므로 ADR도 Lessons도 만들지 않습니다.",
    levels: ["made", "made", "skip", "skip"],
    gates: [
      { state: "yes", text: "예 · 검증 통과" },
      { state: "no", text: "아니오 · 여기서 멈춤" },
      { state: "no", text: "올리지 않음" },
    ],
    item: "run-1842 → Changelog 한 줄",
  },
  {
    label: "Storage layout 전환이 있을 때",
    summary: "ADR-005가 생김",
    note: "같은 사건이라도 storage layout을 바꾸는 선택이 있으면 다른 선택을 제약하므로 ADR-005가 생깁니다. Lessons는 scope·exception·test가 실제로 생겼을 때만 만들며, 이 사례가 거기까지 가는지는 글이 정하지 않습니다.",
    levels: ["made", "made", "made", "maybe"],
    gates: [
      { state: "yes", text: "예 · 검증 통과" },
      { state: "yes", text: "예 · layout 전환" },
      { state: "ask", text: "조건이 생겼을 때만" },
    ],
    item: "run-1842 → Changelog → ADR-005",
  },
  {
    label: "이유가 되지 못하는 것",
    summary: "중요해 보여서 · 양식에 칸이 있어서",
    note: "문서가 중요해 보인다는 느낌이나 template checklist에 칸이 있다는 사실은 관문의 질문에 답하지 않습니다. 이런 이유만으로는 ADR이나 Lessons로 올리지 않습니다.",
    levels: ["made", "made", "skip", "skip"],
    gates: [
      { state: "yes", text: "예 · 검증 통과" },
      { state: "reject", text: "‘중요해 보임’·‘checklist 칸’은 답이 아님" },
      { state: "reject", text: "‘중요해 보임’·‘checklist 칸’은 답이 아님" },
    ],
    item: "Changelog까지는 검증을 통과했다고 둠 (가정)",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  note: string;
  levels: readonly LevelState[];
  gates: readonly { state: GateState; text: string }[];
  item: string;
}[];

const LEVEL_STYLE: Record<LevelState, { box: string; tag: string; label: string }> = {
  made: { box: "border-primary bg-primary/10", tag: "border-primary text-primary", label: "생성" },
  skip: { box: "border-dashed border-border bg-transparent opacity-60", tag: "border-border text-muted-foreground", label: "만들지 않음" },
  maybe: { box: "border-dashed border-amber-600 bg-amber-500/5", tag: "border-amber-600 text-amber-700 dark:text-amber-400", label: "조건부" },
};

const GATE_STYLE: Record<GateState, { mark: string; text: string }> = {
  yes: { mark: "↓", text: "text-emerald-700 dark:text-emerald-400" },
  no: { mark: "■", text: "text-muted-foreground" },
  ask: { mark: "?", text: "text-amber-700 dark:text-amber-400" },
  reject: { mark: "✕", text: "text-red-700 dark:text-red-400" },
};

export default function PromotionGateViz() {
  return (
    <SceneShell
      eyebrow="조건부 승격"
      title="같은 사건이 어느 층까지 올라가는지는 관문의 답이 정합니다"
      description="위에서 아래로 capture → verify → publish change → decision? → reusable rule? 순서입니다. 칸 사이의 질문에 ‘예’일 때만 다음 정본이 생깁니다."
      ariaLabel="Guard 수정만 있을 때와 storage layout 전환이 있을 때 기록이 올라가는 층 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-3 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">{scene.item}</p>
            <ol className="min-w-0">
              {LEVELS.map((level, index) => {
                const levelStyle = LEVEL_STYLE[scene.levels[index]];
                const gate = index < GATES.length ? scene.gates[index] : null;
                const gateStyle = gate ? GATE_STYLE[gate.state] : null;
                return (
                  <li key={level.name} className="min-w-0">
                    <div className={`flex min-w-0 items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors duration-300 motion-reduce:transition-none ${levelStyle.box}`}>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{level.name}</p>
                        <p className="text-xs leading-5 text-muted-foreground">{level.role}</p>
                      </div>
                      <span className={`shrink-0 rounded border px-2 py-0.5 text-xs font-bold ${levelStyle.tag}`}>{levelStyle.label}</span>
                    </div>
                    {gate && gateStyle && (
                      <div className="grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-2 py-2 pl-3">
                        <span aria-hidden="true" className={`text-center font-mono text-sm font-bold ${gateStyle.text}`}>{gateStyle.mark}</span>
                        <p className="min-w-0 text-xs leading-5">
                          <span className="text-muted-foreground">{GATES[index]}</span>{" "}
                          <span className={`font-bold ${gateStyle.text}`}>{gate.text}</span>
                        </p>
                      </div>
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
