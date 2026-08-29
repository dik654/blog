import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: image가 patch로 나뉘고(0) → vision encoder가 각 patch를 embedding으로
 * 바꾸고(1) → projector가 그 차원을 LLM hidden dimension에 맞추고(2) → 결과 visual
 * token이 text token과 나란히 LLM sequence에 놓인다(3). Stage 높이는 4 장면 중 가장
 * 큰 scene(scene 3, sequence 나열) 기준으로 고정한다.
 */
const SCENES = ["Image → patch 분할", "Vision encoder → patch embedding", "Projector → 차원 투영", "LLM 입력 sequence"] as const;

const NOTES = [
  "224px 이미지를 patch 14로 나누면 16×16=256개의 patch가 됩니다. 각 patch는 아직 벡터가 아니라 픽셀 묶음입니다.",
  "Vision encoder(CLIP ViT-L/14)가 256개 patch 각각을 1024차원 embedding Z_v로 바꿉니다. 이 차원은 LLM의 hidden dimension과 다릅니다.",
  "Projector(linear 또는 MLP)가 1024차원 Z_v를 LLM hidden dimension(예: 5120)의 H_v로 투영합니다. 개수는 그대로 두고 차원만 바뀝니다.",
  "H_v(visual token)와 text token embedding이 순서대로 이어붙어 하나의 sequence가 되고, LLM이 이 sequence 전체를 한 번에 처리합니다.",
] as const;

const patchCls = "flex h-8 items-center justify-center border border-border bg-muted/40 text-[10px] text-muted-foreground";
const vecCls = "flex h-10 items-center justify-center border border-primary/55 bg-primary/10 px-1 text-center text-[10px] font-bold text-foreground";
const tokenCls = "flex h-10 min-w-14 items-center justify-center border px-2 text-center text-[10px] font-bold";

function PatchScene() {
  return (
    <div className="mt-6">
      <p className="text-[11px] text-muted-foreground">원본 image (224×224)</p>
      <div className="mt-2 grid grid-cols-8 gap-[2px]">
        {Array.from({ length: 32 }).map((_, index) => (
          <div key={index} className={patchCls} />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">P×P patch N개 (실제는 16×16=256개, 화면 표시는 축약)</p>
    </div>
  );
}

function EncoderScene() {
  return (
    <div className="mt-6">
      <p className="text-[11px] text-muted-foreground">Vision encoder 출력 Z_v (patch당 1024차원)</p>
      <div className="mt-2 grid grid-cols-6 gap-2 sm:grid-cols-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={vecCls}>
            Z_v
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">각 patch가 픽셀 묶음에서 1024차원 embedding 벡터로 바뀌었습니다.</p>
    </div>
  );
}

function ProjectorScene() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] text-muted-foreground">Z_v (1024차원)</p>
        <div className={`${vecCls} w-20`}>Z_v</div>
      </div>
      <div className="flex flex-col items-center gap-1 px-2">
        <p className="text-[10px] font-bold text-primary">W</p>
        <p className="text-lg leading-none text-primary">→</p>
        <p className="text-[9px] text-muted-foreground">projector</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] text-muted-foreground">H_v (LLM hidden, 예: 5120차원)</p>
        <div className={`${vecCls} w-28`}>H_v</div>
      </div>
    </div>
  );
}

function SequenceScene() {
  return (
    <div className="mt-6">
      <p className="text-[11px] text-muted-foreground">LLM 입력 sequence</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["H_v¹", "H_v²", "H_v³", "…"].map((label) => (
          <div key={label} className={`${tokenCls} border-primary/55 bg-primary/10 text-foreground`}>
            {label}
          </div>
        ))}
        {["text₁", "text₂", "text₃"].map((label) => (
          <div key={label} className={`${tokenCls} border-border bg-muted/40 text-muted-foreground`}>
            {label}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">Visual token(색칠)과 text token(회색)이 같은 sequence 안에서 순서대로 처리됩니다.</p>
    </div>
  );
}

export default function VisionLanguageModelArchitectureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  return (
    <VizFrame
      eyebrow="Image patch → projector → LLM token"
      title="Vision encoder의 patch embedding은 projector를 거쳐야 LLM token과 나란히 놓입니다"
      description="Image가 patch로 나뉘고, vision encoder가 embedding을 만들고, projector가 차원을 맞춘 뒤, LLM sequence에 합류하는 네 단계입니다."
      note="Patch 개수·차원 수치는 CLIP ViT-L/14·LLaVA 계열의 공개 설정값을 예로 든 것이며 화면의 격자 개수는 실제 256개를 축약해 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Image patch가 vision encoder와 projector를 거쳐 LLM token sequence로 합류하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(28rem,calc(100dvh-15rem))] min-h-[22rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && <PatchScene />}
          {scenes.active === 1 && <EncoderScene />}
          {scenes.active === 2 && <ProjectorScene />}
          {scenes.active === 3 && <SequenceScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
