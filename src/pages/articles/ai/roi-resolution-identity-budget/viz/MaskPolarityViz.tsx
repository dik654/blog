import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: RoiCrop.tsx ProgressiveDetail — 부위 편집은 마스크를 좁게, 물건 교체는 넓게.
 * 주황 면 = 모델이 다시 그리는 범위(마스크). 회색 = 원래 있던 것. 파란 점선 = 새 물건 윤곽 예시(가정).
 * 도형 크기와 새 물건의 모양은 관계를 보이려는 가정이며 실측값이 아닙니다.
 */
const SCENES = [
  {
    label: "부위 편집 · 좁게",
    summary: "바꿀 부위만 다시 그림",
    callout: "뺨을 따라가는 좁은 띠",
    sub: "나머지 얼굴은 다시 그리지 않습니다. 사실감 올리기도 좁게 잡는 쪽입니다.",
    tone: "#b45309",
    note: "눈썹이나 코처럼 기존 형태를 바꾸는 편집은 좁을수록 좋습니다. 바꿀 대상 밖의 픽셀이 재생성 범위에 들어가면 그만큼 인물이 흔들립니다.",
  },
  {
    label: "물건 교체 · 딱 붙은 마스크",
    summary: "다시 그리는 범위 = 옛 물건 윤곽",
    callout: "빨간 면(새 윤곽의 위·양옆)은 마스크 밖",
    sub: "다시 그리지 않는 자리라 새 물건이 끝날 곳을 정할 수 없습니다.",
    tone: "#dc2626",
    note: "마스크가 옛 물건에 딱 붙어 있으면 새 물건이 어디서 끝나야 하는지 모델이 볼 수 없습니다. 다시 그리는 범위가 옛 물건의 윤곽에 묶여 있기 때문입니다.",
  },
  {
    label: "물건 교체 · 넓힌 마스크",
    summary: "새 윤곽이 들어설 여유",
    callout: "새 윤곽이 범위 안에 들어감",
    sub: "어디서 끝날지 모델이 정할 여유가 생깁니다.",
    tone: "#2563eb",
    note: "물건 교체는 마스크를 넓혀야 결과가 좋아집니다. 그래서 '마스크를 좁게'는 규칙이 아니라 동작별 기본값의 한쪽 끝입니다.",
  },
] as const;

const MASK = "#f59e0b";
const ORIGINAL = "#64748b";
const NEW = "#2563eb";
const OUTSIDE = "#dc2626";
const MUTED = "#94a3b8";

function FaceScene() {
  return (
    <g>
      <ellipse cx={110} cy={92} rx={56} ry={72} fill="none" stroke={ORIGINAL} strokeWidth={1.25} />
      <line x1={82} y1={70} x2={100} y2={70} stroke={ORIGINAL} strokeWidth={1} />
      <line x1={120} y1={70} x2={138} y2={70} stroke={ORIGINAL} strokeWidth={1} />
      <line x1={110} y1={84} x2={110} y2={106} stroke={ORIGINAL} strokeWidth={1} />
      <line x1={94} y1={126} x2={126} y2={126} stroke={ORIGINAL} strokeWidth={1} />
      <rect x={140} y={88} width={12} height={38} rx={4} fill={MASK} fillOpacity={0.45} stroke={MASK} strokeWidth={1.25} />
    </g>
  );
}

function ObjectScene({ wide }: { wide: boolean }) {
  return (
    <g>
      <line x1={20} y1={160} x2={200} y2={160} stroke={MUTED} strokeWidth={1} />
      <text x={20} y={178} fontSize={11} fill={MUTED} className="hidden sm:inline">탁자 면</text>
      {wide ? (
        <rect x={50} y={20} width={120} height={140} fill={MASK} fillOpacity={0.3} stroke={MASK} strokeWidth={1.25} />
      ) : (
        <rect x={84} y={92} width={52} height={68} fill={MASK} fillOpacity={0.3} stroke={MASK} strokeWidth={1.25} />
      )}
      {/* 새 윤곽 가운데 마스크 밖으로 나가는 부분 전체(위쪽 + 양옆 띠) */}
      {wide ? null : (
        <path
          d="M68 40 H152 V160 H68 Z M84 92 V160 H136 V92 Z"
          fillRule="evenodd"
          fill={OUTSIDE}
          fillOpacity={0.12}
          stroke="none"
        />
      )}
      {wide ? null : (
        <text x={110} y={68} textAnchor="middle" fontSize={11} fill={OUTSIDE} className="hidden sm:inline">마스크 밖</text>
      )}
      <rect x={84} y={92} width={52} height={68} fill="none" stroke={ORIGINAL} strokeWidth={1.25} />
      <text x={110} y={130} textAnchor="middle" fontSize={11} fill={ORIGINAL} className="hidden sm:inline">옛 물건</text>
      {/* 새 물건 윤곽 예시(가정): 옛 물건보다 위·옆으로 더 큼 */}
      <rect x={68} y={40} width={84} height={120} fill="none" stroke={NEW} strokeWidth={1.25} strokeDasharray="4 3" />
    </g>
  );
}

export default function MaskPolarityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const labels = SCENES.map((scene) => scene.label);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="마스크 방향"
      title="마스크를 좁힐지 넓힐지는 편집 동작이 정합니다"
      description="마스크는 모델에게 다시 그리게 하는 영역입니다. 같은 '좁게'가 부위 편집에서는 맞고 물건 교체에서는 틀립니다."
      note="도형 크기와 새 물건의 모양은 관계를 보이려는 가정입니다(가정)."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="부위 편집과 물건 교체에서 마스크 크기 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border" style={{ backgroundColor: "#fcd9a0", borderColor: MASK }} />
            다시 그리는 범위(마스크)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border" style={{ borderColor: ORIGINAL }} />
            원래 있던 것
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border border-dashed" style={{ borderColor: NEW }} />
            새 물건 윤곽 예시(가정)
          </span>
        </div>
        <div className="mt-3 grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-6">
          <svg
            viewBox="0 0 220 190"
            className="w-full"
            role="img"
            aria-label={`${SCENES[active].callout}. ${SCENES[active].sub}`}
          >
            {active === 0 ? <FaceScene /> : <ObjectScene wide={active === 2} />}
          </svg>
          <StableSceneStack
            active={active}
            scenes={SCENES.map((scene) => (
              <div key={scene.label} className="border-l-2 pl-3" style={{ borderColor: scene.tone }}>
                <strong className="block text-sm" style={{ color: scene.tone }}>{scene.callout}</strong>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">{scene.sub}</span>
              </div>
            ))}
          />
        </div>
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-7">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
