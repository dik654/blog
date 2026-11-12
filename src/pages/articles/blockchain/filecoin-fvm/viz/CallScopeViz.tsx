import SceneShell from "./SceneShell";

/**
 * 본문 대응: #actor-transaction — 사전 검사의 sequence·gas 선차감은 actor-call transaction 바깥,
 * A·B의 state·events·access 기록은 안쪽에 쌓인다. A가 실패하면 안쪽만 되돌린다.
 */
const SCENES = [
  {
    label: "사전 검사",
    summary: "바깥: sequence +1 · 최대 gas 선차감",
    note: "Executor가 explicit message m₁을 검사하면서 sender sequence를 올리고 최대 gas 비용을 먼저 뺍니다. 이 두 효과는 아직 열리지 않은 actor-call transaction의 바깥에 있습니다.",
  },
  {
    label: "A가 B를 부름",
    summary: "안쪽: A·B 변경을 임시로 쌓음",
    note: "Call Manager가 state tree, actor events, state-access tracker 세 곳의 transaction을 함께 시작하고 A를 부릅니다. A와 B가 남긴 변경은 이 안쪽 칸에 임시로 쌓입니다.",
  },
  {
    label: "A가 성공하지 못함",
    summary: "안쪽만 되돌림 · 바깥은 남음",
    note: "Non-success exit code나 execution error가 나오면 안쪽 세 칸을 함께 되돌립니다. 바깥 칸의 sequence 증가와 gas 정산은 그대로 남으므로 ‘actor 실패 = 아무 영향 없음’이 아닙니다.",
  },
  {
    label: "영수증과 gas 정산",
    summary: "R₁: 실패 exit code · state root 없음",
    note: "Executor가 R₁(exit code·return data·gas used·events root)과 gas 정산 결과를 만듭니다. 최종 state root는 R₁의 필드가 아니며 모든 message 뒤 flush에서 계산합니다.",
  },
] as const;

type Mark = "none" | "pending" | "reverted";

function Store({ name, items, mark }: { name: string; items: string; mark: Mark }) {
  const body =
    mark === "none" ? "비어 있음" : items;
  return (
    <div className={`min-w-0 rounded-md border px-2 py-2 text-center text-xs leading-5 ${mark === "reverted" ? "border-dashed border-red-500/70" : "border-border bg-background"}`}>
      <span className="block font-semibold">{name}</span>
      <span className={`block ${mark === "reverted" ? "text-red-700 line-through dark:text-red-400" : mark === "pending" ? "text-foreground" : "text-muted-foreground"}`}>{body}</span>
      <span className={`block text-[11px] font-semibold ${mark === "reverted" ? "text-red-700 dark:text-red-400" : "text-transparent"}`}>되돌림</span>
    </div>
  );
}

export default function CallScopeViz() {
  return (
    <SceneShell
      eyebrow="되돌리는 범위는 안쪽 칸까지"
      title="Actor-call transaction은 message 적용 안쪽의 한 칸입니다"
      description="바깥 테두리가 message m₁ 한 건의 적용, 안쪽 테두리가 Call Manager의 actor-call transaction입니다. A가 B를 부른 뒤 성공하지 못하는 글의 사례를 따라갑니다."
      note="Actor A·B와 m₁은 설명용 사례입니다. 그림은 되돌리는 범위만 보이며 gas 금액이나 실제 state 내용은 표시하지 않습니다."
      ariaLabel="Message 적용 범위와 actor-call transaction 범위의 중첩"
      scenes={SCENES}
      render={(active) => {
        const innerOpen = active >= 1;
        const reverted = active >= 2;
        const mark: Mark = !innerOpen ? "none" : reverted ? "reverted" : "pending";
        return (
          <div className="min-w-0 rounded-lg border border-foreground/40 p-3 sm:p-4">
            <p className="text-xs font-bold text-muted-foreground">message m₁ 적용 · Executor</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-md border border-primary/60 bg-primary/5 px-2 py-2 text-center text-xs leading-5">
                <span className="block font-semibold">sender sequence</span>
                <span className="block font-mono">+1</span>
                <span className={`block text-[11px] font-semibold ${reverted ? "text-primary" : "text-transparent"}`}>남음</span>
              </div>
              <div className="rounded-md border border-primary/60 bg-primary/5 px-2 py-2 text-center text-xs leading-5">
                <span className="block font-semibold">gas</span>
                <span className="block">최대 비용 선차감</span>
                <span className={`block text-[11px] font-semibold ${reverted ? "text-primary" : "text-transparent"}`}>{active === 3 ? "남음 · 정산" : "남음"}</span>
              </div>
            </div>
            <div className={`mt-3 rounded-lg border p-2 sm:p-3 ${innerOpen ? "border-foreground/40" : "border-dashed border-border"}`}>
              <p className={`text-xs font-bold ${innerOpen ? "" : "text-muted-foreground"}`}>
                actor-call transaction · Call Manager {innerOpen ? (reverted ? "· A 실패 → revert" : "· A → B 실행 중") : "· 아직 열지 않음"}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2">
                <Store name="state tree" items="A·B 변경" mark={mark} />
                <Store name="actor events" items="A·B events" mark={mark} />
                <Store name="access 기록" items="A·B 접근" mark={mark} />
              </div>
            </div>
            <div className={`mt-3 rounded-md border px-3 py-2 text-xs leading-5 ${active === 3 ? "border-primary/60" : "border-dashed border-border text-muted-foreground"}`}>
              <span className="font-semibold">영수증 R₁</span>{" "}
              {active === 3 ? "exit code(실패) · return data · gas used · events root — state root 칸 없음" : "아직 만들지 않음"}
            </div>
          </div>
        );
      }}
    />
  );
}
