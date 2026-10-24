import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["압축", "조건 입력", "반복 복원", "픽셀 복원·판정"] as const;
const NOTES = [
  "인코더가 픽셀 격자를 더 작은 잠재 격자로 바꾸며 복원 가능한 정보의 상한을 정합니다.",
  "텍스트 조건과 조건 없는 예측을 함께 준비해 어느 방향을 얼마나 강조할지 정합니다.",
  "표본추출기가 복원기를 여러 번 호출해 잠재값을 잡음에서 결과 쪽으로 옮깁니다.",
  "디코더가 마지막 잠재값을 픽셀로 되돌리고 품질·분포 포괄·지연을 따로 판정합니다.",
] as const;

export default function LatentPipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  const nodes = [
    ["픽셀 x", "512×512×3", "입력·참조 이미지"],
    ["잠재값 z", "64×64×4", "손실 압축 경계"],
    ["조건부 복원기", "텍스트 + 시점", "두 예측 갈래"],
    ["복원 픽셀 x̂", "픽셀 출력", "품질·포괄 판정"],
  ] as const;
  return (
    <VizFrame
      eyebrow="잠재공간 생성"
      title="픽셀을 압축하고 조건 방향을 더한 뒤 다시 픽셀로 복원합니다"
      description="인코더·복원기·표본추출기·디코더는 서로 다른 산출물과 실패를 소유합니다. 제품 이름 하나로 이 경계를 지우지 않습니다."
      note="각 구성요소의 버전과 잠재값 배율은 생성 기록에 함께 남겨야 합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="latent-pipeline-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="latent diffusion component pipeline 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
        <div className="grid gap-3 md:grid-cols-4">
          {nodes.map(([title, shape, detail], i) => (
            <div
              key={title}
              className={`relative min-w-0 border px-4 py-5 ${a === i ? "border-primary bg-primary/5" : "border-border bg-background"}`}
            >
              <p className="text-xs font-black text-primary">0{i + 1}</p>
              <p className="mt-2 font-black">{title}</p>
              <p className="mt-2 font-mono text-xs">{shape}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
              {i < nodes.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-1/2 text-primary md:-right-3 md:bottom-auto md:left-auto md:top-1/2"
                >
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Ledger
            label="압축 기록"
            value="모양 · 배율 · 재구성"
            active={a === 0}
          />
          <Ledger
            label="조건 유도 기록"
            value="조건 · 강도 w · 두 갈래 묶음 처리"
            active={a === 1 || a === 2}
          />
          <Ledger
            label="출시 판정 기록"
            value="품질 · 다양성 · 지연"
            active={a === 3}
          />
        </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
function Ledger({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}
    >
      <p className="text-xs font-black">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}
