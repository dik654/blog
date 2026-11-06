import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #default-stream — A, 기본 줄, B 순서로 제출했을 때 생기는 순서 연결.
 * 가로 = 제출 순서, 화살표 = 뒤 작업이 앞 작업을 기다리는 관계입니다.
 */
const SCENES = [
  { label: "legacy 기본 줄", summary: "A → 기본 → B", lanes: ["일반 A", "legacy 기본 줄", "일반 B"], note: "같은 프로그램 환경(context)에서 NonBlocking 설정 없이 만든 일반 줄들과 암묵적인 순서를 만듭니다. 코드에 B가 A를 기다리라고 적지 않았어도 가운데 작업이 앞뒤를 연결할 수 있습니다." },
  { label: "NonBlocking 줄", summary: "연결에서 빠짐", lanes: ["NonBlocking A", "legacy 기본 줄", "NonBlocking B"], note: "cudaStreamNonBlocking으로 만든 줄은 legacy 기본 줄과의 암묵적 동기화에서 빠집니다. 모든 API 호출이 host를 기다리게 하지 않는다는 뜻은 아닙니다." },
  { label: "per-thread 기본 줄", summary: "전역 연결 기대 불가", lanes: ["일반 A", "per-thread 기본 줄", "일반 B"], note: "host thread마다 갖는 일반 줄이라 legacy와 같은 전역 연결을 기대할 수 없습니다. 암묵적 연결에 기대던 코드는 정확성이나 계측이 달라질 수 있습니다." },
  { label: "event로 명시", summary: "A → event → B", lanes: ["일반 A", "기본 줄", "일반 B"], note: "A의 작업을 명시한 줄에 두고 필요한 교차 관계만 event로 적습니다. 어떤 연결이 있는지 코드에서 추적하기 쉬워집니다." },
] as const;

const W = 340;
const H = 176;
const BOX_W = 62;
const BOX_H = 30;
const BOX_X = [104, 186, 268];
const LANE_Y = [18, 72, 126];
const BLUE = "#2563eb";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const arrowHead = (x: number, y: number) => `${x - 4},${y - 6} ${x + 4},${y - 6} ${x},${y}`;

export default function DefaultStreamLinkViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const scene = SCENES[active];
  const dimDefault = active === 3;

  return (
    <VizFrame
      eyebrow="보이지 않는 연결"
      title="가운데 기본 줄 작업이 앞뒤 stream을 잇는 경우"
      description="기본 줄은 stream 인자를 0으로 둔 줄입니다. 작업을 A, 기본 줄, B 순서로 제출합니다. 가로는 제출 순서이고 화살표는 뒤 작업이 앞 작업을 기다린다는 뜻입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="기본 줄 모드에 따라 stream 사이 순서 연결이 생기거나 빠지는 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          {scene.lanes.map((lane, row) => (
            <g key={row}>
              <text x={2} y={LANE_Y[row] + 20} fontSize={13} fontWeight={700} fill={MUTED} opacity={row === 1 && dimDefault ? 0.45 : 1}>{lane}</text>
              <line x1={BOX_X[0] - 6} x2={W - 4} y1={LANE_Y[row] + BOX_H + 6} y2={LANE_Y[row] + BOX_H + 6} stroke={LINE} strokeWidth={0.5} />
              <rect x={BOX_X[row]} y={LANE_Y[row]} width={BOX_W} height={BOX_H} rx={4} fill={row === 1 ? "none" : `${BLUE}22`} stroke={row === 1 && dimDefault ? LINE : BLUE} strokeWidth={1} opacity={row === 1 && dimDefault ? 0.45 : 1} />
              <text x={BOX_X[row] + BOX_W / 2} y={LANE_Y[row] + 20} textAnchor="middle" fontSize={13} fill={MUTED} opacity={row === 1 && dimDefault ? 0.45 : 1}>{["A 작업", "기본 작업", "B 작업"][row]}</text>
            </g>
          ))}
          {active === 0 && (
            <g>
              <polyline points={`${BOX_X[0] + BOX_W},${LANE_Y[0] + 15} ${BOX_X[1] + BOX_W / 2},${LANE_Y[0] + 15} ${BOX_X[1] + BOX_W / 2},${LANE_Y[1] - 1}`} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <polygon points={arrowHead(BOX_X[1] + BOX_W / 2, LANE_Y[1])} fill={BLUE} />
              <polyline points={`${BOX_X[1] + BOX_W},${LANE_Y[1] + 15} ${BOX_X[2] + BOX_W / 2},${LANE_Y[1] + 15} ${BOX_X[2] + BOX_W / 2},${LANE_Y[2] - 1}`} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <polygon points={arrowHead(BOX_X[2] + BOX_W / 2, LANE_Y[2])} fill={BLUE} />
            </g>
          )}
          {(active === 1 || active === 2) && (
            <g>
              <polyline points={`${BOX_X[0] + BOX_W},${LANE_Y[0] + 15} ${BOX_X[1] + BOX_W / 2},${LANE_Y[0] + 15} ${BOX_X[1] + BOX_W / 2},${LANE_Y[1]}`} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
              <polyline points={`${BOX_X[1] + BOX_W},${LANE_Y[1] + 15} ${BOX_X[2] + BOX_W / 2},${LANE_Y[1] + 15} ${BOX_X[2] + BOX_W / 2},${LANE_Y[2]}`} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
              <text x={BOX_X[0]} y={LANE_Y[2] + 20} fontSize={13} fontWeight={700} fill={MUTED}>기대할 연결 없음</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <polyline points={`${BOX_X[0] + BOX_W},${LANE_Y[0] + 15} ${BOX_X[2] + BOX_W / 2},${LANE_Y[0] + 15} ${BOX_X[2] + BOX_W / 2},${LANE_Y[2] - 1}`} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <polygon points={arrowHead(BOX_X[2] + BOX_W / 2, LANE_Y[2])} fill={BLUE} />
              <text x={BOX_X[1] + 6} y={LANE_Y[0] + 10} fontSize={13} fontWeight={700} fill={BLUE}>event</text>
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
