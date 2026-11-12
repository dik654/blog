import PolicySceneShell from "./PolicySceneShell";

/**
 * 본문 대응: #rules — match한 rule의 action은 모두 결과에 들어가고 Chain은 안쪽 action을 평평하게 펼친다.
 * Priority는 순서만 정하고 MergeToDev·Block 가운데 하나를 지우지 않는다.
 * 가정: merge rule의 action을 Chain[MergeToDev, Notify]로 묶음, Block rule(priority 30)을 추가.
 */
type Rule = { priority: string; name: string; action: string; chain?: readonly string[]; assumed?: boolean };

const RULES: readonly Rule[] = [
  { priority: "P10", name: "retry rule", action: "Retry" },
  { priority: "P20", name: "merge rule", action: "Chain", chain: ["MergeToDev", "Notify"], assumed: true },
  { priority: "P30", name: "block rule", action: "Block", assumed: true },
];

const SCENES = [
  {
    label: "Chain은 펼쳐서 넣습니다",
    summary: "결과 3칸 · 중첩 없음",
    ruleCount: 2,
    conflict: false,
    note: "Merge rule의 action을 Chain[MergeToDev, Notify] 하나로 묶었다고 가정해도 결과 목록에는 Chain이라는 상자가 남지 않습니다. 안쪽 action 두 개가 각각 한 칸씩 들어가 lane-17과 같은 [Retry, MergeToDev, Notify]가 됩니다.",
  },
  {
    label: "Block rule도 match한다면",
    summary: "결과 4칸 · Block은 뒤에",
    ruleCount: 3,
    conflict: false,
    note: "같은 context에서 Block을 내는 rule이 하나 더 match한다고 가정합니다(priority 30도 가정). Match한 rule의 action은 모두 들어가므로 결과가 한 칸 늘어날 뿐이고, priority는 그 칸의 순서만 정합니다.",
  },
  {
    label: "둘 중 하나를 고르는 곳은 따로",
    summary: "MergeToDev와 Block 공존",
    ruleCount: 3,
    conflict: true,
    note: "Merge하라는 action과 막으라는 action이 같은 목록에 함께 있습니다. 현재 evaluator만으로는 둘 중 하나가 사라지지 않으므로, 어느 쪽을 따를지 정하는 충돌 matrix와 최종 enforcer가 별도로 필요합니다.",
  },
] as const;

function Chip({ text, tone }: { text: string; tone: "plain" | "conflict" | "empty" }) {
  const cls =
    tone === "conflict"
      ? "border-red-600 text-red-700 dark:text-red-400 font-semibold"
      : tone === "empty"
        ? "border-dashed border-border/60 text-muted-foreground/50"
        : "border-border bg-background";
  return <span className={`flex min-h-9 min-w-0 items-center justify-center rounded-lg border px-0.5 text-center font-mono text-[10px] leading-4 [overflow-wrap:anywhere] sm:px-1 sm:text-xs ${cls}`}>{text}</span>;
}

export default function ActionCollectionViz() {
  return (
    <PolicySceneShell
      eyebrow="Action 수집"
      title="Match한 action은 펼쳐져서 모두 목록에 남습니다"
      description="Chain은 여러 action을 한 action처럼 묶은 것입니다. 위는 match한 rule, 아래는 evaluator가 반환하는 action 목록입니다. '(가정)'이 붙은 부분은 설명을 위해 lane-17에 덧붙이거나 바꾼 것입니다."
      ariaLabel="Chain 펼침과 MergeToDev·Block 공존을 보여 주는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const output = RULES.slice(0, scene.ruleCount).flatMap((rule) => (rule.chain ? [...rule.chain] : [rule.action]));
        const slots = [0, 1, 2, 3].map((slot) => output[slot] ?? "");
        return (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">Match한 rule (priority 오름차순)</p>
            <div className="mt-2 space-y-2">
              {RULES.map((rule, index) => {
                const shown = index < scene.ruleCount;
                return (
                  <div
                    key={rule.name}
                    className={`grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-2 rounded-lg border px-2 py-2 text-xs sm:grid-cols-[3rem_7rem_minmax(0,1fr)] ${shown ? "border-border bg-background" : "border-dashed border-border/40 text-muted-foreground/40"}`}
                  >
                    <span className="font-mono font-bold">{rule.priority}</span>
                    <span className="hidden sm:block">{rule.name}{rule.assumed ? " (가정)" : ""}</span>
                    <span className="min-w-0 font-mono">
                      <span className="sm:hidden">{rule.name}{rule.assumed ? "(가정)" : ""} → </span>
                      {shown ? (rule.chain ? `Chain[${rule.chain.join(", ")}]` : rule.action) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">반환되는 action 목록</p>
            <div className="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
              {slots.map((text, slot) => (
                <Chip key={slot} text={text || "—"} tone={!text ? "empty" : scene.conflict && (text === "MergeToDev" || text === "Block") ? "conflict" : "plain"} />
              ))}
            </div>
            <div className={`mt-3 rounded-lg border border-dashed px-3 py-2 text-xs leading-5 ${scene.conflict ? "border-red-600 text-foreground" : "border-border/40 text-muted-foreground/40"}`}>
              충돌 matrix · 최종 enforcer — evaluator 밖에서 별도로 필요
            </div>
          </div>
        );
      }}
    />
  );
}
