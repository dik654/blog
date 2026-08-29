import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 image 위에 세 가지 visual primitive(bbox·point·segmentation)를
 * 차례로 겹쳐, 위치를 표현하는 정보량이 늘어나는 순서를 보여 준다. 원본(0) → bbox 4좌표(1)
 * → point 2좌표(2) → segmentation mask 픽셀별(3). Stage 높이는 4 장면 중 가장 큰 scene
 * (mask를 그리는 scene 3) 기준으로 고정한다.
 */
const SCENES = ["원본 image", "Bounding box (좌표 4개)", "Point (좌표 2개)", "Segmentation mask (픽셀별)"] as const;

const NOTES = [
  "빨간 컵을 가리키는 지시가 있다고 합시다. Grounding은 이 image 안에서 그 대상의 위치를 표현해야 합니다.",
  "Bounding box는 좌상단·우하단 좌표 4개로 대상을 감싸는 사각형입니다. 배경도 함께 담겨 실제 윤곽은 드러나지 않습니다.",
  "Point는 좌표 2개로 대상의 한 지점만 가리킵니다. 표현은 더 간단하지만 크기·범위 정보가 없습니다.",
  "Segmentation mask는 픽셀마다 대상 여부를 표시해 윤곽까지 담지만, 표현 비용이 픽셀 수에 비례해 커집니다.",
] as const;

const viewBox = "0 0 240 160";

function Backdrop() {
  return (
    <>
      <rect x={0} y={0} width={240} height={160} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1} />
      <text x={10} y={16} fontSize={8} fill="currentColor" opacity={0.5}>
        image
      </text>
      {/* 대상(컵)을 나타내는 단순 도형 */}
      <path
        d="M96 60 h48 l-6 46 a8 8 0 0 1 -8 7 h-20 a8 8 0 0 1 -8 -7 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        opacity={0.9}
      />
      <path d="M144 68 q14 4 2 20" fill="none" stroke="currentColor" strokeWidth={1.25} opacity={0.9} />
    </>
  );
}

function OriginalScene() {
  return (
    <svg viewBox={viewBox} className="mt-6 h-40 w-full text-foreground">
      <Backdrop />
    </svg>
  );
}

function BboxScene() {
  return (
    <svg viewBox={viewBox} className="mt-6 h-40 w-full text-foreground">
      <Backdrop />
      <rect x={88} y={54} width={70} height={68} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      <circle cx={88} cy={54} r={2} fill="#2563eb" />
      <circle cx={158} cy={122} r={2} fill="#2563eb" />
      <text x={90} y={48} fontSize={8} fill="#2563eb">
        (x1,y1)–(x2,y2)
      </text>
    </svg>
  );
}

function PointScene() {
  return (
    <svg viewBox={viewBox} className="mt-6 h-40 w-full text-foreground">
      <Backdrop />
      <circle cx={120} cy={92} r={3} fill="#2563eb" />
      <text x={126} y={90} fontSize={8} fill="#2563eb">
        (x,y)
      </text>
    </svg>
  );
}

function SegmentationScene() {
  return (
    <svg viewBox={viewBox} className="mt-6 h-40 w-full text-foreground">
      <Backdrop />
      <path
        d="M96 60 h48 l-6 46 a8 8 0 0 1 -8 7 h-20 a8 8 0 0 1 -8 -7 Z"
        fill="#2563eb"
        fillOpacity={0.28}
        stroke="#2563eb"
        strokeWidth={1.25}
      />
      <text x={96} y={52} fontSize={8} fill="#2563eb">
        픽셀별 mask
      </text>
    </svg>
  );
}

export default function MultimodalRetrievalAndVisualGroundingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  return (
    <VizFrame
      eyebrow="Bbox · point · segmentation"
      title="같은 대상도 primitive에 따라 위치 표현의 정보량과 비용이 달라집니다"
      description="원본 image 위에 bounding box, point, segmentation mask를 차례로 겹쳐 표현력과 비용의 차이를 보여 줍니다."
      note="컵 모양과 좌표는 grounding primitive를 비교하기 위한 예시이며 실제 검출 결과가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Bounding box, point, segmentation mask로 위치를 표현하는 세 가지 grounding primitive"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && <OriginalScene />}
          {scenes.active === 1 && <BboxScene />}
          {scenes.active === 2 && <PointScene />}
          {scenes.active === 3 && <SegmentationScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
