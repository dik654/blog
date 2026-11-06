import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — v−s·u에서 공통 항이 지워지고 8+1+0−2=7이 남는다.
 * 칸 하나 = 1. A·s=[8,6], r=[1,1]이므로 공통 항은 8+6=14. e·r=1, s·e1=2, e2=0.
 * 검산: v=14+1+0+8=23(17로 나누면 6), s·u=14+2=16, 23−16=7.
 */
const CELL = 14;
const X0 = 19;
const W = 360;
const H = 214;
const ROW_V = 34;
const ROW_SU = 100;
const ROW_LEFT = 166;

const SHARED = "#64748b";
const ERROR = "#d97706";
const SUBTRACT = "#dc2626";
const BIT = "#2563eb";
const TEXT = "#64748b";

const SCENES = [
  { label: "v 쌓기", summary: "v = 15 + 0 + 8 = 23", note: "칸 하나가 1입니다. 보내는 쪽은 t·r=9+6=15에 오류 e2=0과 비트 1을 나타내는 8을 더합니다. e2는 0이라 칸이 없습니다. 17로 나눈 나머지 6만 보냅니다." },
  { label: "t 안을 펼치기", summary: "15 = 14 + 1", note: "t에는 A·s=[8,6]과 오류 e=[1,0]이 들어 있습니다. 그래서 15칸은 r과 곱한 큰 곱 14칸과 e·r=1칸으로 나뉩니다." },
  { label: "s·u 쌓기", summary: "s·u = 14 + 2 = 16", note: "수신자가 계산한 s·u도 펼쳐 봅니다. u=[6,5]는 [6,4]에 오류 e1=[0,1]을 더한 값이라 같은 큰 곱 14칸과 s·e1=2칸이 됩니다." },
  { label: "빼기", summary: "8 + 1 + 0 − 2 = 7", note: "14칸은 위아래가 같아 사라집니다. 남은 것은 비트의 8칸과 오류 1칸에서 2칸을 뺀 7입니다. 6−16=−10도 17로 나누면 같은 7입니다." },
] as const;

function Run({ start, count, y, fill, ghost = false }: { start: number; count: number; y: number; fill: string; ghost?: boolean }) {
  return (
    <g>
      {Array.from({ length: count }, (_, index) => (
        <rect
          key={index}
          x={X0 + (start + index) * CELL + 0.5}
          y={y}
          width={CELL - 1}
          height={CELL + 6}
          fill={ghost ? "none" : fill}
          stroke={fill}
          strokeWidth={1}
          strokeDasharray={ghost ? "2 2" : undefined}
          opacity={ghost ? 0.6 : 0.85}
        />
      ))}
    </g>
  );
}

function RunLabel({ start, count, y, fill, children }: { start: number; count: number; y: number; fill: string; children: string }) {
  return (
    <text x={X0 + (start + count / 2) * CELL} y={y} textAnchor="middle" fontSize={13} fontWeight={700} fill={fill}>
      {children}
    </text>
  );
}

export default function CancelCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="칸으로 세는 상쇄"
      title="두 값에 같은 14칸이 들어 있어 빼면 사라집니다"
      description="보내는 쪽의 임시 비밀 r=[1,1], 오류 e1=[0,1], e2=0으로 놓은 사례입니다(가정). 보내는 두 값이 u와 v입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="v와 s·u의 공통 14칸이 지워지고 7이 남는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={ROW_V - 8} fontSize={13} fontWeight={700} fill={TEXT}>v (23칸)</text>
          {active === 0 ? (
            <g>
              <Run start={0} count={15} y={ROW_V} fill={SHARED} />
              <RunLabel start={0} count={15} y={ROW_V + 38} fill={SHARED}>t·r = 15</RunLabel>
            </g>
          ) : (
            <g>
              <Run start={0} count={14} y={ROW_V} fill={SHARED} ghost={active === 3} />
              <Run start={14} count={1} y={ROW_V} fill={ERROR} />
              <RunLabel start={0} count={14} y={ROW_V + 38} fill={SHARED}>큰 곱 14</RunLabel>
              <RunLabel start={13} count={3} y={ROW_V + 38} fill={ERROR}>e·r=1</RunLabel>
            </g>
          )}
          <Run start={15} count={8} y={ROW_V} fill={BIT} />
          <RunLabel start={16.5} count={8} y={ROW_V + 38} fill={BIT}>비트 8</RunLabel>

          {active >= 2 && (
            <g>
              <text x={X0} y={ROW_SU - 8} fontSize={13} fontWeight={700} fill={TEXT}>s·u (16칸)</text>
              <Run start={0} count={14} y={ROW_SU} fill={SHARED} ghost={active === 3} />
              <Run start={14} count={2} y={ROW_SU} fill={SUBTRACT} />
              <RunLabel start={0} count={14} y={ROW_SU + 38} fill={SHARED}>큰 곱 14</RunLabel>
              <RunLabel start={13.5} count={4} y={ROW_SU + 38} fill={SUBTRACT}>s·e1=2</RunLabel>
            </g>
          )}

          {active === 3 && (
            <g>
              <text x={X0} y={ROW_LEFT - 8} fontSize={13} fontWeight={700} fill={BIT}>남는 값 = 7칸</text>
              <Run start={0} count={7} y={ROW_LEFT} fill={BIT} />
              <Run start={7} count={1} y={ROW_LEFT} fill={SUBTRACT} ghost />
              <text x={X0 + 8 * CELL + 8} y={ROW_LEFT + 15} fontSize={13} fontWeight={700} fill={SUBTRACT}>8보다 1 작음</text>
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
