import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const CONFIG = {
  action: {
    eyebrow: "행동 표현의 전체 흐름",
    title: "같은 움직임도 표현 방법에 따라 학습과 실행 방식이 달라집니다",
    description: "20cm 이동 범위의 한 축을 실제 숫자로 따라가며 연속값·토큰·행동 묶음·재관측을 연결합니다.",
    scenes: [
      { label: "실행 계약", input: "Δx 범위 −0.10m…+0.10m", operation: "로봇이 소비할 단위·좌표계·주기를 고정", output: "action 축 하나의 계약", note: "표현 방법을 고르기 전에 실제 로봇이 어떤 값을 어떤 주기로 받을지 먼저 고정합니다." },
      { label: "토큰 변환", input: "a=+0.02m · B=256", operation: "floor(((0.02+0.10)/0.20)×255)", output: "bin 153", note: "연속값을 토큰으로 바꾸면 언어모델의 분류 head를 재사용할 수 있지만 bin보다 작은 차이는 사라집니다." },
      { label: "행동 묶음", input: "12 timestep · k=6", operation: "한 번에 a₀…a₅를 예측하고 두 번 호출", output: "model call 12회 → 2회", note: "호출 수는 줄지만 여섯 step 동안 환경이 바뀌면 처음 계획이 낡을 수 있습니다." },
      { label: "재관측", input: "t=3에서 물체 위치 변화", operation: "새 chunk를 예측하고 겹친 action을 가중 평균", output: "수정된 a₃만 실행", note: "표현은 예측값의 모양을 정하고, closed-loop 실행은 새 관측을 언제 반영할지 정합니다." },
    ],
  },
  imitation: {
    eyebrow: "시연에서 정책까지",
    title: "사람의 시연 한 쌍이 정책의 예측이 되고, 배포 중에는 새 상태를 만납니다",
    description: "관측·행동 한 쌍에서 시작해 예측·오차·업데이트·분포 이탈을 한 경로로 추적합니다.",
    scenes: [
      { label: "시연 기록", input: "o₀=컵이 중앙 · a₀=오른쪽 2cm", operation: "사람의 teleoperation을 (observation, action)으로 저장", output: "D에 (o₀,a₀) 추가", note: "Behavior cloning의 정답은 reward가 아니라 사람이 실제로 실행한 action입니다." },
      { label: "행동 예측", input: "πθ(o₀)=오른쪽 1.7cm", operation: "같은 observation에서 사람 action과 비교", output: "|â₀−a₀|=0.3cm", note: "연속 action이면 MSE 같은 손실을, 토큰이면 cross-entropy를 사용할 수 있습니다." },
      { label: "정책 갱신", input: "loss=0.3cm", operation: "gradient로 θ를 갱신해 â₀를 a₀ 쪽으로 이동", output: "πθ′(o₀)=오른쪽 1.9cm", note: "학습 데이터 안에서는 사람 action을 더 잘 모사하도록 바뀝니다." },
      { label: "배포 이탈", input: "오차 누적으로 컵이 왼쪽인 o₁", operation: "D에 없는 상태에서 다시 action을 예측", output: "오차가 다음 관측으로 누적", note: "훈련 손실이 낮아도 policy가 만든 새 상태의 분포까지 자동으로 배운 것은 아닙니다." },
    ],
  },
  navigation: {
    eyebrow: "언어 지시의 실행 흐름",
    title: "지시는 한 번의 답이 아니라 관측·경로·제어·재판단의 반복으로 실행됩니다",
    description: "복도에서 왼쪽 방을 찾는 한 요청이 waypoint와 저수준 제어를 거쳐 다시 관측으로 돌아오는 경로입니다.",
    scenes: [
      { label: "지시 해석", input: "“복도 끝에서 왼쪽 방” + RGB-D", operation: "landmark와 남은 지시를 현재 시야에 대응", output: "다음 목표=복도 끝", note: "언어 의미만 맞아서는 이동할 수 없고 현재 위치에서 실행 가능한 목표가 필요합니다." },
      { label: "경유점", input: "depth + camera pose", operation: "pixel 목표를 map 좌표로 변환", output: "waypoint=(3.2m,1.1m)", note: "Waypoint는 고수준 판단과 SLAM controller 사이의 실행 계약입니다." },
      { label: "저수준 제어", input: "현재 pose=(1.0m,0.4m)", operation: "SLAM 경로와 충돌 검사를 따라 전진·회전", output: "pose=(3.0m,1.0m)", note: "모든 step에서 VLM을 다시 호출하지 않고 저수준 controller가 정해진 목표까지 이동합니다." },
      { label: "재판단", input: "새 관측=왼쪽 갈림길", operation: "결정 지점을 감지하고 memory와 남은 지시를 다시 조회", output: "새 waypoint=왼쪽 방 입구", note: "새 관측이 계획을 바꾸는 순간에만 reasoning을 다시 호출하면 실행 비용과 반응성을 나눌 수 있습니다." },
    ],
  },
} as const;

export default function EmbodiedProcessOverviewViz({ variant }: { variant: keyof typeof CONFIG }) {
  const config = CONFIG[variant];
  const controls = useAnimatedScenes(config.scenes.length, 5200, { loop: false });
  const scene = config.scenes[controls.active];

  return (
    <VizFrame eyebrow={config.eyebrow} title={config.title} description={config.description}>
      <div id={controls.playbackId} data-viz data-viz-canvas tabIndex={0} onKeyDown={controls.onKeyDown} className="min-w-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
          {config.scenes.map((item, index) => (
            <button key={item.label} type="button" onClick={() => controls.setActive(index)} aria-pressed={controls.active === index} className={`min-w-0 bg-background px-3 py-3 text-left ${controls.active === index ? "text-primary" : "text-muted-foreground"}`}>
              <span className="font-mono text-[9px]">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs text-foreground">{item.label}</strong>
            </button>
          ))}
        </div>

        <div aria-live="polite" className="border-y border-border/70 py-5">
          <p className="text-[10px] font-bold text-primary">장면 {String(controls.active + 1).padStart(2, "0")} · {scene.label}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1.15fr)_1.5rem_minmax(0,1fr)] sm:items-stretch">
            <div className="min-w-0 border border-border bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">입력 상태</p>
              <p className="mt-2 break-keep font-mono text-xs font-bold leading-6">{scene.input}</p>
            </div>
            <span aria-hidden className="hidden items-center justify-center text-muted-foreground sm:flex">→</span>
            <div className="min-w-0 border-l-2 border-primary bg-primary/[0.04] p-4">
              <p className="text-[10px] font-bold text-primary">이번 계산·판단</p>
              <p className="mt-2 break-keep text-xs font-semibold leading-6">{scene.operation}</p>
            </div>
            <span aria-hidden className="hidden items-center justify-center text-muted-foreground sm:flex">→</span>
            <div className="min-w-0 border border-border bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">출력 상태</p>
              <p className="mt-2 break-keep font-mono text-xs font-bold leading-6">{scene.output}</p>
            </div>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{scene.note}</p>
        </div>

        <noscript>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
            {config.scenes.map((item) => (
              <li key={item.label}><strong>{item.label}</strong>: {item.input} → {item.operation} → {item.output}. {item.note}</li>
            ))}
          </ol>
        </noscript>
        <AnimatedSceneControls labels={config.scenes.map((item) => item.label)} {...controls} playLabel="과정 재생" />
      </div>
    </VizFrame>
  );
}
