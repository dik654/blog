import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["Pretraining", "Continued training", "Post-training", "Agent harness"] as const;

const STAGES = [
  {
    number: "01",
    input: "웹·책·코드 corpus",
    operation: "다음 token loss를 반복 계산",
    output: "언어·지식·코드 표현을 담은 새 weight",
    changed: "model weight",
    unchanged: "shell·memory·권한은 아직 없음",
    summary: "웹·책·코드 corpus로 다음 token loss를 반복 계산해 언어·지식·코드 표현을 담은 model weight를 만듭니다.",
  },
  {
    number: "02",
    input: "코드 비중을 높인 새 corpus",
    operation: "같은 다음 token objective를 이어서 학습",
    output: "코드 분포에 더 노출된 새 checkpoint",
    changed: "model weight",
    unchanged: "좋은 답의 기준은 아직 직접 주지 않음",
    summary: "코드 비중을 높인 corpus에서 같은 objective를 이어 학습해 코드 분포에 더 노출된 checkpoint를 만듭니다.",
  },
  {
    number: "03",
    input: "좋은 응답·선호·검증 reward",
    operation: "SFT 또는 preference·RL objective 적용",
    output: "요청 형식과 복구 행동이 조정된 policy",
    changed: "model weight와 행동 분포",
    unchanged: "실제 도구 실행 권한은 별도",
    summary: "좋은 응답·선호·검증 reward를 SFT 또는 RL objective로 바꿔 model의 행동 분포를 조정합니다.",
  },
  {
    number: "04",
    input: "학습된 checkpoint + shell·memory·verifier",
    operation: "여러 turn에서 실행하고 관측을 다시 입력",
    output: "파일 수정·테스트 결과가 남은 trajectory",
    changed: "runtime state와 외부 artifact",
    unchanged: "별도 학습 run 없이는 model weight 유지",
    summary: "학습된 checkpoint에 shell·memory·verifier를 연결해 여러 turn을 실행하지만, 별도 학습 run 없이는 model weight를 바꾸지 않습니다.",
  },
] as const;

export default function TrainingStageFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const stage = STAGES[scenes.active];

  return (
    <VizFrame
      eyebrow="Data → weight → runtime"
      title="같은 코딩 요청도 단계마다 다른 상태를 바꿉니다"
      description="한 단계씩 넘기며 입력, 계산, 결과와 실제로 바뀌는 상태를 확인합니다. 뒤 단계가 앞 단계를 대신하지 않습니다."
      note="그림은 학습 단계의 책임 경계를 설명하는 사례입니다. 특정 모델의 학습 recipe나 성능 측정값은 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz="llm-training-stage-flow"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Pretraining부터 agent harness까지 바뀌는 상태"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100svh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <div className="grid grid-cols-4 gap-px bg-border p-px" aria-label="네 단계 위치">
            {SCENES.map((label, index) => (
              <button
                key={label}
                type="button"
                aria-pressed={index === scenes.active}
                onClick={() => scenes.setActive(index)}
                className={`min-w-0 bg-background px-1 py-2 text-left ${index === scenes.active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className="block font-mono text-[9px]">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1 hidden break-keep text-[10px] font-bold sm:block">{label}</span>
              </button>
            ))}
          </div>

          <p className="mt-5 text-[11px] font-black text-primary">{stage.number} · {SCENES[scenes.active]}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-stretch">
            <div className="border-l border-border pl-3">
              <p className="text-[10px] font-bold text-muted-foreground">입력</p>
              <p className="mt-2 break-keep text-sm font-bold leading-6">{stage.input}</p>
            </div>
            <div aria-hidden className="self-center text-center text-primary">↓</div>
            <div className="border-l border-border pl-3">
              <p className="text-[10px] font-bold text-muted-foreground">계산·실행</p>
              <p className="mt-2 break-keep text-sm font-bold leading-6">{stage.operation}</p>
            </div>
            <div aria-hidden className="self-center text-center text-primary">↓</div>
            <div className="border-l border-border pl-3">
              <p className="text-[10px] font-bold text-muted-foreground">결과</p>
              <p className="mt-2 break-keep text-sm font-bold leading-6">{stage.output}</p>
            </div>
          </div>

          <dl className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold text-primary">이번 단계가 바꾸는 상태</dt>
              <dd className="mt-1 text-sm leading-6">{stage.changed}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold text-muted-foreground">바꾸지 않는 상태</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground">{stage.unchanged}</dd>
            </div>
          </dl>
        </div>

        <noscript>
          <ol className="space-y-2 text-sm leading-6">
            {STAGES.map((item, index) => (
              <li key={item.number}>
                <strong>{index + 1}. {SCENES[index]}</strong> — {item.summary}
              </li>
            ))}
          </ol>
        </noscript>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
