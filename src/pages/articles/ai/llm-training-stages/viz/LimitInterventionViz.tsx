import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — soft·hard limit은 성능 곡선이 아니라 같은 budget의 개입 비교로 판단한다.
 * TermLesson의 shape: failure slice → data/harness/post-training interventions →
 * architecture/learning-rule intervention → matched evaluation.
 */
const SCENES = [
  {
    label: "실패 하나를 잘라 냅니다",
    summary: "failure slice",
    note: "출발점은 성능 곡선 전체가 아니라 특정 실패 묶음입니다. 글의 예인 long-horizon drift를 둡니다. Soft limit·hard limit은 편리한 대화 표현이지 합의된 학술 분류가 아닙니다.",
  },
  {
    label: "먼저 data·harness 쪽 개입",
    summary: "data·search·RL·harness",
    note: "Architecture는 두고 data·search·RL·harness를 바꿔 봅니다. 결과는 아래 두 갈래 가운데 하나입니다. Long-horizon drift가 context 관리로 줄어든다면 곧바로 Transformer의 hard limit이라고 부를 수 없습니다.",
  },
  {
    label: "그래도 남으면 architecture 쪽",
    summary: "architecture·learning rule",
    note: "앞의 개입으로 줄지 않을 때 architecture나 learning rule을 바꿔 봅니다. 이것을 바꾸어야만 실패가 사라지는지가 이 단계에서 보는 질문입니다.",
  },
  {
    label: "같은 budget으로 맞춰 비교",
    summary: "matched evaluation",
    note: "두 갈래는 같은 budget과 같은 평가로 맞춰야 비교가 됩니다. Agent가 막다른 골목이라는 결론도, post-training만 scale하면 된다는 결론도 현재 evidence보다 강합니다.",
  },
] as const;

function Node({ title, body, on }: { title: string; body: string; on: boolean }) {
  return (
    <div
      className={`min-w-0 break-keep rounded-md border px-3 py-1.5 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
        on ? "border-primary opacity-100" : "border-dashed border-border opacity-45"
      }`}
    >
      <span className="font-bold">{title}</span> <span className="text-muted-foreground">{body}</span>
    </div>
  );
}

function Outcome({ text, on, tone }: { text: string; on: boolean; tone: "soft" | "next" | "hard" }) {
  const color =
    tone === "soft"
      ? "border-emerald-600 text-emerald-800 dark:text-emerald-300"
      : tone === "hard"
        ? "border-red-600 text-red-800 dark:text-red-300"
        : "border-border text-foreground";
  return (
    <div
      className={`min-w-0 break-keep rounded-md border px-2 py-1.5 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
        on ? `${color} opacity-100` : "border-dashed border-border text-muted-foreground opacity-40"
      }`}
    >
      {text}
    </div>
  );
}

export default function LimitInterventionViz() {
  return (
    <SceneShell
      eyebrow="Soft · hard limit"
      title="실패의 원인은 개입을 하나씩 바꿔 보며 가립니다"
      description="Soft limit은 data·search·RL·harness를 더 잘하면 줄어드는 한계, hard limit은 architecture나 learning rule을 바꿔야만 사라지는 한계를 부르는 대화 표현입니다."
      note="갈래의 순서와 판단 문장은 이 글의 TermLesson과 본문을 옮긴 것입니다. 실험 결과나 측정값을 그린 것이 아닙니다."
      ariaLabel="실패 묶음에서 시작해 data·harness 쪽 개입, architecture 쪽 개입, 같은 budget 비교로 이어지는 판단 순서"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <Node title="① failure slice" body="· 예: long-horizon drift" on />
          <Node title="② data · search · RL · harness 개입" body="· architecture는 그대로, 예: context 관리" on={active >= 1} />
          <div className="grid grid-cols-2 gap-2 pl-4">
            <Outcome text="실패가 줄어듦 → 곧바로 hard limit이라 부를 수 없음" on={active >= 1} tone="soft" />
            <Outcome text="줄지 않음 → ③으로" on={active >= 1} tone="next" />
          </div>
          <Node title="③ architecture · learning rule 개입" body="· 이것을 바꾸어야만 실패가 사라지는가" on={active >= 2} />
          <div className="rounded-md border border-dashed border-border px-3 py-1.5 text-xs leading-5">
            <p className={active >= 3 ? "font-bold text-primary" : "font-bold text-muted-foreground"}>
              ②와 ③ 모두 같은 budget · matched evaluation
            </p>
            <p className="text-muted-foreground">성능 곡선 하나만 보고 어느 쪽인지 정하지 않습니다.</p>
          </div>
        </div>
      )}
    />
  );
}
