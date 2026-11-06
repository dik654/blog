import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #picture — 같은 4시 믿음이라도 정상 시계는 사실에서 한 줄로 이어지고,
 * 멈춘 시계는 고장과 시간의 흐름이 따로 와서 같은 숫자에 닿는다.
 */
const SCENES = [
  { label: "정상 시계", summary: "사실 → 표시 → 믿음", note: "실제 시간이 톱니와 전자 신호를 움직이고, 그 결과가 바늘에 나타나고, 민아의 눈과 판단이 바늘을 따라갑니다. 끊긴 곳 없는 한 줄입니다." },
  { label: "멈춘 시계", summary: "고장 → 표시 → 믿음", note: "고장이 4:00을 고정했고 민아의 믿음은 그 바늘을 따라갑니다. 실제 시간은 아래에서 따로 흘러 4:00에 닿습니다." },
  { label: "두 줄 비교", summary: "같은 숫자, 다른 구조", note: "두 경우 모두 민아는 4시라고 믿고 실제로도 4시입니다. 다른 것은 위쪽 줄에만 사실에서 표시로 가는 연결이 있다는 점입니다." },
] as const;

const W = 340;
const H = 236;
const NODE_W = 70;
const NODE_H = 44;
const GAP = 19;
const col = (index: number) => 2 + index * (NODE_W + GAP);

const FACT = "#2563eb";
const BROKEN = "#d97706";
const INK = "#64748b";
const CUT = "#dc2626";

function Node({ column, top, lines, color }: { column: number; top: number; lines: string[]; color: string }) {
  const x = col(column);
  const mid = top + NODE_H / 2;
  return (
    <g>
      <rect x={x} y={top} width={NODE_W} height={NODE_H} rx={8} fill="none" stroke={color} strokeWidth={1} />
      {lines.map((line, index) => (
        <text key={line} x={x + NODE_W / 2} y={mid + 5 + (index - (lines.length - 1) / 2) * 16} textAnchor="middle" fontSize={13} fontWeight={600} fill={color}>{line}</text>
      ))}
    </g>
  );
}

function Arrow({ x1, x2, top, color }: { x1: number; x2: number; top: number; color: string }) {
  const mid = top + NODE_H / 2;
  return (
    <g>
      <line x1={x1} x2={x2 - 5} y1={mid} y2={mid} stroke={color} strokeWidth={1} />
      <path d={`M${x2} ${mid} l-6 -4 v8 z`} fill={color} />
    </g>
  );
}

const ROW1 = 22;
const ROW2 = 110;
const ROW3 = 178;

export default function TwoPathsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const normalOpacity = active === 1 ? 0.3 : 1;
  const stoppedOpacity = active === 0 ? 0.3 : 1;

  return (
    <VizFrame
      eyebrow="판단 경로"
      title="같은 4시에 닿아도 지나온 길이 다릅니다"
      description="화살표는 무엇이 무엇을 만들었는지를 뜻합니다. 위는 정상 시계, 아래는 민아가 고른 멈춘 시계입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정상 시계와 멈춘 시계에서 사실이 믿음에 닿는 경로를 나란히 보는 과정"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <g opacity={normalOpacity}>
            <text x={2} y={14} fontSize={13} fontWeight={700} fill={FACT}>정상 시계</text>
            <Node column={0} top={ROW1} lines={["실제 시간", "4:00"]} color={FACT} />
            <Node column={1} top={ROW1} lines={["톱니·전자", "신호"]} color={FACT} />
            <Node column={2} top={ROW1} lines={["바늘", "4:00"]} color={FACT} />
            <Node column={3} top={ROW1} lines={["믿음", "“4시다”"]} color={FACT} />
            {[0, 1, 2].map((index) => <Arrow key={index} x1={col(index) + NODE_W} x2={col(index + 1)} top={ROW1} color={FACT} />)}
          </g>
          <g opacity={stoppedOpacity}>
            <text x={2} y={ROW2 - 8} fontSize={13} fontWeight={700} fill={BROKEN}>멈춘 시계</text>
            <Node column={1} top={ROW2} lines={["고장"]} color={BROKEN} />
            <Node column={2} top={ROW2} lines={["바늘", "4:00 고정"]} color={BROKEN} />
            <Node column={3} top={ROW2} lines={["믿음", "“4시다”"]} color={BROKEN} />
            {[1, 2].map((index) => <Arrow key={index} x1={col(index) + NODE_W} x2={col(index + 1)} top={ROW2} color={BROKEN} />)}

            <Node column={0} top={ROW3} lines={["실제 시간"]} color={FACT} />
            <Arrow x1={col(0) + NODE_W} x2={col(3)} top={ROW3} color={FACT} />
            <text x={(col(0) + NODE_W + col(3)) / 2} y={ROW3 + NODE_H / 2 - 7} textAnchor="middle" fontSize={13} fill={FACT}>따로 흐름</text>
            <Node column={3} top={ROW3} lines={["실제", "4:00"]} color={FACT} />
            <line x1={col(3) + NODE_W / 2} x2={col(3) + NODE_W / 2} y1={ROW2 + NODE_H + 2} y2={ROW3 - 2} stroke={INK} strokeWidth={1} strokeDasharray="3 3" />
            <text x={col(3) + NODE_W / 2 - 6} y={ROW2 + NODE_H + 19} textAnchor="end" fontSize={13} fontWeight={600} fill={INK}>숫자만 같음</text>
          </g>
          {active === 2 && (
            <g>
              <line x1={col(2) + NODE_W / 2} x2={col(2) + NODE_W / 2} y1={ROW2 + NODE_H + 2} y2={ROW3 + NODE_H / 2 - 2} stroke={CUT} strokeWidth={1} strokeDasharray="3 3" />
              <path d={`M${col(2) + NODE_W / 2 - 6} ${ROW2 + NODE_H + 8} l12 12 m0 -12 l-12 12`} stroke={CUT} strokeWidth={1.25} fill="none" />
              <text x={col(2) + NODE_W / 2 - 11} y={ROW2 + NODE_H + 19} textAnchor="end" fontSize={13} fontWeight={700} fill={CUT}>연결 없음</text>
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
