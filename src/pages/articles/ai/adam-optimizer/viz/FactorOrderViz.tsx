import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #preconditioning — 같은 네 수를 묶는 순서만 다른 두 경로.
 * 수식: −0.02/0.19≈−0.105263 → ÷(2+1e−8)≈−0.052632 → θ−0.1×(…)=θ+0.0052631579.
 * 원문: 0.1/0.19≈0.5263157895 → −0.02/(2+1e−8)≈−0.01 → −0.5263…×(−0.01)≈+0.0052631579.
 * 분모: √0.007996/√0.001999=√4=2.
 */
const TILES = [
  { name: "이동 크기 η", value: "0.1" },
  { name: "1−β₁²", value: "0.19" },
  { name: "방향 장부 m", value: "−0.02" },
  { name: "분모", value: "2+10⁻⁸" },
] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  group: readonly number[];
  steps: readonly (readonly [string, string])[];
}[] = [
  {
    label: "9절의 수식 순서",
    summary: "먼저 m을 보정",
    note: "m을 0.19로 먼저 나눠 보정 방향 m̂를 만들고, 분모로 나눈 뒤 이동 크기를 곱해 θ에서 뺍니다.",
    group: [1, 2],
    steps: [
      ["m̂ = m ÷ 0.19", "≈ −0.105263"],
      ["m̂ ÷ 분모", "≈ −0.052632"],
      ["θ − 0.1 × 위 값", "θ에 약 +0.0052631579"],
    ],
  },
  {
    label: "원문의 순서",
    summary: "먼저 η를 보정",
    note: "원문은 η÷0.19를 step_size로 미리 구합니다. 장부 m은 보정 없이 분모와 함께 addcdiv_에 넘깁니다. addcdiv_는 값에 value×(분자÷분모)를 더하는 연산입니다. 결과는 9절과 같습니다.",
    group: [0, 1],
    steps: [
      ["step_size = 0.1 ÷ 0.19", "≈ 0.5263157895"],
      ["m ÷ 분모", "≈ −0.01"],
      ["addcdiv_, value = −step_size", "θ에 약 +0.0052631579"],
    ],
  },
  {
    label: "분모도 같은 값입니다",
    summary: "둘 다 2+10⁻⁸",
    note: "실수 양의 값에서는 같은 수학식입니다. 유한 정밀도에서 어떤 순서로 계산하는지는 구현에 남습니다. ε는 두 경로 모두 제곱근 바깥에서 더합니다.",
    group: [3],
    steps: [
      ["수식: √v̂ + ε", "√4 + 10⁻⁸"],
      ["원문: √v ÷ √(1−β₂²) + ε", "√0.007996 ÷ √0.001999 + 10⁻⁸"],
      ["두 경로의 값", "2 + 10⁻⁸"],
    ],
  },
];

export default function FactorOrderViz() {
  return (
    <SceneShell
      eyebrow="계산 순서"
      title="같은 네 수를 다른 순서로 묶어도 같은 이동량이 나옵니다"
      description="t=2 상태의 네 수입니다. 진한 테두리 칸이 그 장면에서 먼저 묶거나 따져 보는 수입니다. 값은 이 글의 가정 사례에서 왔습니다."
      ariaLabel="수식 순서와 PyTorch 원문 순서가 같은 네 수에서 같은 이동량을 내는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {TILES.map((tile, index) => {
              const on = SCENES[active].group.includes(index);
              return (
                <div key={tile.name} className={`min-w-0 rounded-lg border bg-background px-1 py-2 text-center ${on ? "border-primary" : "border-border"}`}>
                  <span className={`block text-xs leading-4 ${on ? "font-semibold text-primary" : "text-muted-foreground"}`}>{tile.name}</span>
                  <span className="mt-1 block font-mono text-xs font-semibold sm:text-sm">{tile.value}</span>
                </div>
              );
            })}
          </div>
          <StableSceneStack
            active={active}
            scenes={SCENES.map((scene) => (
              <ol key={scene.label} className="space-y-2">
                {scene.steps.map(([left, right], index) => (
                  <li key={left} className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-baseline gap-1 border-b border-border/60 pb-2 text-sm">
                    <span className="font-mono text-muted-foreground">{index + 1}</span>
                    <span className="flex min-w-0 flex-wrap justify-between gap-x-3">
                      <span className="min-w-0">{left}</span>
                      <span className="min-w-0 font-mono font-semibold">{right}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ))}
          />
        </div>
      )}
    />
  );
}
