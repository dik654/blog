import SceneShell from "./SceneShell";

/**
 * 본문 대응: #constitutional-ai — SL-CAI·RL-CAI AlgorithmBlock.
 * SL: 초기 model(helpful-only)이 초안 → 원칙마다 critique→revise 반복 → (prompt, 최종 수정본)으로 pretrained model 지도학습 → SL-CAI model.
 * RL: SL-CAI model이 응답 A·B → 별도 feedback model이 원칙 기준 비교 → preference data → reward model → SL-CAI model을 초기값으로 RL(PPO 등) → 최종 policy.
 */
const PHASES = [
  {
    name: "1단계 · SL-CAI",
    nodes: [
      { id: "prompt", text: "red-team prompt" },
      { id: "init", text: "초기 model (helpful-only)" },
      { id: "draft", text: "첫 응답 (초안)" },
      { id: "loop", text: "원칙마다 critique → revise" },
      { id: "final", text: "최종 수정본" },
      { id: "pre", text: "pretrained model 지도학습" },
      { id: "sl", text: "SL-CAI model" },
    ],
  },
  {
    name: "2단계 · RL-CAI",
    nodes: [
      { id: "sl2", text: "SL-CAI model + 새 prompt" },
      { id: "ab", text: "응답 A · 응답 B" },
      { id: "judge", text: "feedback model + 원칙" },
      { id: "pref", text: "preference data" },
      { id: "rm", text: "reward model" },
      { id: "rl", text: "RL (PPO 등)" },
      { id: "policy", text: "최종 policy" },
    ],
  },
] as const;

type NodeId = (typeof PHASES)[number]["nodes"][number]["id"];

const LOOP = ["초안", "원칙 1로 수정", "원칙 2로 수정", "…", "최종 수정본"] as const;

const SCENES = [
  {
    label: "초안",
    summary: "harmlessness 학습 전 model이 먼저 답함",
    note: "Helpful-only 초기 model이 red-team prompt(해롭거나 애매한 요청)에 첫 응답을 만듭니다. 이 글의 예로는 근거 없는 의학 답변 초안입니다.",
    on: ["prompt", "init", "draft"],
    loop: 0,
  },
  {
    label: "원칙을 바꿔 가며 고침",
    summary: "critique → revise를 사슬처럼",
    note: "원칙 하나를 뽑아 model이 스스로 문제를 지적(critique)하고 같은 응답을 고칩니다(revise). 원칙을 바꿔 여러 차례 반복합니다. 반복 횟수는 정하지 않았습니다.",
    on: ["draft", "loop", "final"],
    loop: 4,
  },
  {
    label: "수정본으로 지도학습",
    summary: "(prompt, 최종 수정본) → SL-CAI model",
    note: "원래 prompt와 최종 수정본을 짝으로 삼아, 초안을 쓴 초기 model이 아니라 아직 harmlessness가 없는 pretrained model을 supervised fine-tuning합니다.",
    on: ["prompt", "final", "pre", "sl"],
    loop: 0,
  },
  {
    label: "AI가 고른 선호",
    summary: "feedback model이 원칙으로 A·B 판정",
    note: "SL-CAI model이 새 prompt에 응답 두 개를 만들고, 별도 feedback model이 원칙 하나로 나은 쪽을 고릅니다. harmfulness label 일부를 대신할 뿐 human label이 사라지지는 않습니다.",
    on: ["sl2", "ab", "judge", "pref"],
    loop: 0,
  },
  {
    label: "Reward model과 RL",
    summary: "SL-CAI model이 policy 초기값",
    note: "AI가 labeling한 preference data로 reward model을 학습하고, SL-CAI model을 출발점으로 그 reward를 보상 삼아 PPO 등 RL로 더 학습해 최종 policy를 얻습니다.",
    on: ["sl2", "pref", "rm", "rl", "policy"],
    loop: 0,
  },
] as const satisfies readonly { label: string; summary: string; note: string; on: readonly NodeId[]; loop: number }[];

export default function CaiTwoPhaseViz() {
  return (
    <SceneShell
      eyebrow="두 단계 pipeline"
      title="어느 model이 무엇을 만들고, 그것이 다음 단계 어디로 가는가"
      description="위 줄 SL-CAI는 수정본으로 지도학습(SL)하는 단계, 아래 줄 RL-CAI는 AI가 고른 선호로 강화학습(RL)하는 단계입니다. 색이 칠해진 칸이 지금 장면에서 움직이는 model과 data입니다."
      ariaLabel="Constitutional AI의 SL-CAI 단계와 RL-CAI 단계에서 model과 data가 이어지는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = new Set<string>(scene.on);
        return (
          <div className="min-w-0 space-y-4">
            {PHASES.map((phase, phaseIndex) => (
              <div key={phase.name} className="min-w-0">
                <p className="mb-2 text-xs font-bold text-primary">{phase.name}</p>
                <ol className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-2">
                  {phase.nodes.map((node, index) => {
                    const lit = on.has(node.id);
                    return (
                      <li key={node.id} className="flex min-w-0 items-center gap-1">
                        <span
                          className={`rounded-md border px-2 py-1 text-xs leading-5 transition-colors duration-300 motion-reduce:transition-none ${
                            lit ? "border-primary bg-primary/10 font-bold text-foreground" : "border-border text-muted-foreground/70"
                          }`}
                        >
                          {node.text}
                        </span>
                        {index < phase.nodes.length - 1 && <span aria-hidden="true" className="text-xs text-muted-foreground">→</span>}
                      </li>
                    );
                  })}
                </ol>
                {phaseIndex === 0 && (
                  <div className={`mt-3 rounded-lg border border-dashed px-3 py-2 ${scene.loop ? "block" : "hidden sm:block"} transition-opacity duration-300 motion-reduce:transition-none ${scene.loop ? "border-primary/60 opacity-100" : "border-border opacity-40"}`}>
                    <p className="text-[11px] font-bold text-muted-foreground">같은 응답이 고쳐지는 순서</p>
                    <ol className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1 text-xs">
                      {LOOP.map((step, index) => (
                        <li key={step} className="flex items-center gap-1">
                          <span className={index === LOOP.length - 1 && scene.loop ? "font-bold text-primary" : "text-foreground/80"}>{step}</span>
                          {index < LOOP.length - 1 && <span aria-hidden="true" className="text-muted-foreground">→</span>}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {phaseIndex === 0 && (
                  <p className="mt-3 border-l border-border pl-3 text-[11px] leading-5 text-muted-foreground">↓ SL-CAI model이 2단계의 응답 생성기이자 RL 출발점</p>
                )}
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
