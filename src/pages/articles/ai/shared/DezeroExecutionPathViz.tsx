import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import type { DezeroImplementationStep } from "./DezeroImplementationLocator";

const CONFIG = {
  autodiff: {
    eyebrow: "실행 한 번",
    title: "값 3이 두 경로로 갈라졌다가 gradient 12로 돌아옵니다",
    description: "y=x²+x² 한 계산에서 순전파 기록과 역전파 합산이 어떻게 맞물리는지 봅니다.",
    scenes: ["입력 만들기", "두 제곱 기록", "출력 계산", "오차 합산"],
    notes: [
      "Variable x는 값 3을 가지며 아직 creator와 gradient가 없습니다.",
      "같은 x를 입력으로 받은 두 Square가 각각 값 9를 만들고 자신을 creator로 기록합니다.",
      "Add가 9+9=18을 만들고 두 입력 경로보다 높은 generation을 기록합니다.",
      "출력 gradient 1을 거꾸로 보내면 두 경로가 각각 6을 반환하고 x.grad는 6+6=12가 됩니다.",
    ],
    blocks: [
      ["x", "값 3", "creator 없음"],
      ["Square ×2", "9 · 9", "같은 입력 공유"],
      ["Add", "y=18", "generation 2"],
      ["x.grad", "6+6=12", "경로별 누적"],
    ],
    note: "x=3인 y=x²+x²를 손으로 검산한 값입니다. 특정 프레임워크의 성능 측정값이 아닙니다.",
  },
  nn: {
    eyebrow: "학습 한 걸음",
    title: "같은 파라미터 신원이 예측·미분·갱신·재시작을 통과합니다",
    description: "4×2 입력을 3개 출력으로 바꾸는 Linear layer와 한 번의 optimizer 갱신을 추적합니다.",
    scenes: ["파라미터 등록", "예측 계산", "오차 역전파", "상태 갱신"],
    notes: [
      "Model registry가 W 2×3과 b 길이 3을 고정된 신원으로 등록합니다. 학습할 숫자는 모두 9개입니다.",
      "X 4×2와 W 2×3을 곱하고 b를 더하면 Y의 shape은 4×3이 됩니다.",
      "스칼라 loss에서 돌아온 dY로 dW=XᵀdY, db=행 합, dX=dYWᵀ를 계산합니다.",
      "예시 θ=2, gradient=.5, learning rate=.1이면 SGD 뒤 θ=1.95가 되며 checkpoint도 같은 신원에 상태를 묶습니다.",
    ],
    blocks: [
      ["Registry", "W · b", "6+3=9개"],
      ["Forward", "Y 4×3", "XW+b"],
      ["Backward", "dW · db · dX", "shape 검산"],
      ["Optimizer", "2→1.95", "상태 저장"],
    ],
    note: "행렬 shape와 SGD 숫자는 구현 계약을 확인하기 위한 고정 예제입니다.",
  },
  advanced: {
    eyebrow: "상태 한 구간",
    title: "값은 다음 구간으로 넘기고, 과거 계산 그래프는 경계에서 끊습니다",
    description: "짧은 LSTM sequence가 reset·계산·carry·detach를 거쳐 다음 chunk로 이어지는 과정을 봅니다.",
    scenes: ["상태 초기화", "LSTM 계산", "값 넘기기", "그래프 끊기"],
    notes: [
      "새 표본이 시작되면 hidden state h와 cell state c를 모두 0으로 초기화합니다.",
      "f=.8, c 이전값=1, i=.25, g=.4, o=.5이면 c=.9이고 h는 약 .358입니다.",
      "같은 시퀀스의 다음 chunk에는 h=.358과 c=.9라는 값 자체를 넘깁니다.",
      "Truncated BPTT 경계에서는 넘긴 값을 detach해 더 오래된 그래프와 gradient 경로를 끊습니다.",
    ],
    blocks: [
      ["Reset", "h=0 · c=0", "새 표본"],
      ["Cell", "c=.9", "h≈.358"],
      ["Carry", "값 유지", "같은 시퀀스"],
      ["Detach", "그래프 종료", "다음 chunk"],
    ],
    note: "Gate 값은 수명 경계를 검산하기 위한 가정입니다. 실제 모델 품질이나 처리량 측정값이 아닙니다.",
  },
} as const;

export default function DezeroExecutionPathViz({ current }: { current: DezeroImplementationStep }) {
  const config = CONFIG[current];
  const scenes = useAnimatedScenes(config.scenes.length, 3800, { loop: false });
  const step = scenes.active;

  return (
    <VizFrame eyebrow={config.eyebrow} title={config.title} description={config.description} note={config.note}>
      <div
        id={scenes.playbackId}
        data-viz-scene={`dezero-${current}-execution`}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label={`${config.title}의 네 장면`}
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(25rem,calc(100svh-15rem))] sm:min-h-[22rem]"
      >
        <div key={step} data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
          <div className="grid grid-cols-4 gap-1 sm:gap-3">
            {config.scenes.map((label, index) => (
              <div key={label} className={`min-w-0 border-t-2 pt-2 ${step >= index ? "border-primary" : "border-border text-muted-foreground"}`}>
                <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-xs sm:leading-5">{label}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {config.blocks.map(([label, value, detail], index) => (
              <div key={label} className={`min-w-0 border-l-2 bg-card px-3 py-3 ${step >= index ? "border-primary" : "border-border text-muted-foreground"}`}>
                <span className="block text-[10px] font-bold">{label}</span>
                <strong className="mt-1 block break-keep font-mono text-sm">{step >= index ? value : "대기"}</strong>
                <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{detail}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{config.notes[step]}</p>
        </div>

        <AnimatedSceneControls {...scenes} labels={config.scenes} />
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {config.scenes.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>
              <span className="mt-1 block text-muted-foreground">{config.notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
