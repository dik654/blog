import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MultiviewMobileStageFlow from "../MultiviewMobileStageFlow";

const SCENES = ["센서 원본", "좌표 정렬", "값과 유효성 결합", "첫 층 입력"] as const;
const NOTES = [
  "정면 RGB와 깊이 영상은 같은 장면을 보지만, 같은 픽셀 번호가 같은 물리 지점을 뜻한다고 아직 가정할 수 없습니다.",
  "보정값 T_depth로 깊이 영상을 RGB 기준 격자에 옮깁니다. 촬영 시각 차이와 보정 오차가 허용 범위 안인지 먼저 확인합니다.",
  "RGB 3채널, 깊이 1채널과 두 유효성 표시를 쌓아 6×H×W를 만듭니다. 실제 깊이 0은 mask=1, 관측 없음은 mask=0입니다.",
  "첫 합성곱 층은 6채널 입력에 맞춰 새로 학습하거나 가중치 이관 규칙을 명시합니다. 좌표가 맞지 않으면 이 경로를 쓰지 않습니다.",
] as const;
const STAGES = [
  { title: "RGB · 깊이", detail: "같은 장면, 아직 다른 격자" },
  { title: "깊이 재투영", detail: "T_depth로 RGB 기준 좌표에 정렬" },
  { title: "6채널", detail: "RGB 3 + 깊이 1 + 유효성 2" },
  { title: "첫 합성곱", detail: "입력 채널과 가중치 이관을 함께 변경" },
] as const;

export default function EarlyFusionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  const nodes = [
    ["RGB", "3 × H × W"],
    ["깊이", step >= 1 ? "RGB 격자로 이동" : "자체 격자"],
    ["유효성", step >= 2 ? "2 × H × W" : "아직 없음"],
    ["입력", step >= 3 ? "6 × H × W" : "결합 전"],
  ] as const;
  return (
    <VizFrame
      eyebrow="입력 단계 결합"
      title="같은 좌표를 가리키는 센서값만 채널로 쌓습니다"
      description="이 경로는 여러 각도의 사진을 포개는 방법이 아니라, 보정된 센서가 같은 위치를 볼 때 쓰는 방법입니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="multiview-registered-input"
        tabIndex={0}
        role="group"
        aria-label="RGB와 깊이 영상을 정렬해 여섯 채널 입력으로 만드는 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[19rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">장면 · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MultiviewMobileStageFlow items={STAGES} active={step} ariaLabel="입력 단계 결합의 네 단계" />
          <div className="mt-6 hidden items-stretch gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
            {nodes.map(([label, detail], index) => (
              <div key={label} className="contents">
                <div className={`min-w-0 border-t-2 px-3 py-4 ${index <= step ? "border-primary bg-primary/8" : "border-border text-muted-foreground"}`}>
                  <strong className="block text-xs">{label}</strong>
                  <span className="mt-2 block break-keep text-[11px] leading-5">{detail}</span>
                </div>
                {index < nodes.length - 1 && <span aria-hidden className={`self-center text-sm ${index < step ? "text-primary" : "text-muted-foreground/40"}`}>→</span>}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 border-y border-border py-3 text-xs sm:grid-cols-2">
            <p><strong>실제 0</strong><span className="ml-2 font-mono text-muted-foreground">value=0 · mask=1</span></p>
            <p><strong>관측 없음</strong><span className="ml-2 font-mono text-muted-foreground">value=0 · mask=0</span></p>
          </div>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]"><strong>{index + 1}. {label}</strong><span className="text-muted-foreground">{NOTES[index]}</span></li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
