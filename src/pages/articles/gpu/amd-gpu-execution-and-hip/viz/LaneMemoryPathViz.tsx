import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — 37번 lane이 읽는 위치와 CDNA4의 읽기 경로.
 * 모든 띠의 가로 위치가 같은 번호 0–63을 뜻하므로 37번 자리가 한 세로줄에 놓입니다.
 * 주소는 37 × 4바이트 = 148바이트, 유효 읽기는 입력 하나당 64 × 4 = 256바이트입니다.
 */
const SCENES = [
  { label: "읽을 위치", summary: "37 × 4 = 148바이트", note: "64개 lane이 wavefront 1개를 이룹니다. 원소 하나가 4바이트이므로 37번 lane은 입력 A와 B의 148바이트 위치를 읽습니다." },
  { label: "읽기 경로", summary: "L1 → L2 → Infinity Cache → HBM", note: "cache는 메모리 전에 먼저 찾아보는 저장소입니다. L1 뒤에 XCD(연산 칩)별 L2, 그다음 메모리 앞의 큰 cache인 Infinity Cache와 제어기를 지나 주 메모리 HBM에 닿습니다." },
  { label: "중간에서 찾으면", summary: "아래 단계 읽기가 줄어듭니다", note: "L2에서 찾았다고 놓은 예입니다(가정). 입력 하나당 유효 읽기 256바이트(두 입력 512바이트)와 특정 계층의 거래량은 다른 수치입니다." },
  { label: "더하고 쓰기", summary: "64개 lane → 결과 256바이트", note: "읽은 값은 lane마다 VGPR에 놓이고 벡터 덧셈 뒤 결과를 씁니다. 쓰기의 cache 경로는 그리지 않았습니다." },
] as const;

const W = 340;
const H = 300;
const STRIP_X = 64;
const STRIP_W = 262;
const CELL = STRIP_W / 64;
const X37 = STRIP_X + 37.5 * CELL;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const Y = { lane: 30, vgpr: 60, l1: 84, l2: 124, cache: 162, a: 222, b: 244, out: 266 } as const;

function Strip({ y, label, mark, fillAll = false, color = BLUE }: { y: number; label: string; mark: boolean; fillAll?: boolean; color?: string }) {
  return (
    <g>
      <text x={14} y={y + 12} fontSize={13} fill={MUTED}>{label}</text>
      {fillAll && <rect x={STRIP_X} y={y} width={STRIP_W} height={14} fill={`${color}33`} />}
      <rect x={STRIP_X} y={y} width={STRIP_W} height={14} fill="none" stroke={LINE} strokeWidth={0.75} />
      {[8, 16, 24, 32, 40, 48, 56].map((n) => (
        <line key={n} x1={STRIP_X + n * CELL} x2={STRIP_X + n * CELL} y1={y} y2={y + 14} stroke={LINE} strokeWidth={0.5} />
      ))}
      {mark && <rect x={STRIP_X + 37 * CELL - 1} y={y - 1} width={CELL + 2} height={16} fill={color} />}
    </g>
  );
}

function Layer({ y, name }: { y: number; name: string }) {
  return (
    <g>
      <rect x={6} y={y} width={W - 12} height={26} rx={4} fill="none" stroke={MUTED} strokeWidth={1} />
      <text x={14} y={y + 18} fontSize={13} fontWeight={700} fill={MUTED}>{name}</text>
    </g>
  );
}

export default function LaneMemoryPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const pathEnd = active === 1 ? Y.a - 3 : active === 2 ? Y.l2 + 12 : null;

  return (
    <VizFrame
      eyebrow="실행 단위와 저장소"
      title="37번 lane이 읽는 값은 어느 층을 지나 VGPR에 놓일까요"
      description="MI350X·MI355X의 CDNA4에 64 threads block 1개를 제출합니다. 띠의 가로 위치는 번호입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="37번 lane의 읽기 위치, cache 계층을 지나는 경로, VGPR과 결과 쓰기"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={6} y={4} width={W - 12} height={112} rx={4} fill="none" stroke={MUTED} strokeWidth={1} />
          <text x={14} y={20} fontSize={13} fontWeight={700} fill={MUTED}>CU · wavefront 1개</text>
          <text x={X37} y={Y.lane - 3} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>37</text>
          <Strip y={Y.lane} label="lane" mark />
          <Strip y={Y.vgpr} label="VGPR" mark={active === 3} fillAll={active === 3} />
          <rect x={14} y={Y.l1} width={W - 28} height={26} rx={4} fill="none" stroke={MUTED} strokeWidth={1} />
          <text x={22} y={Y.l1 + 18} fontSize={13} fontWeight={700} fill={MUTED}>L1</text>
          <Layer y={Y.l2} name="XCD별 L2" />
          <Layer y={Y.cache} name="Infinity Cache · 제어기" />
          <rect x={6} y={198} width={W - 12} height={94} rx={4} fill="none" stroke={MUTED} strokeWidth={1} />
          <text x={14} y={214} fontSize={13} fontWeight={700} fill={MUTED}>HBM · 37번 = 148바이트</text>
          <Strip y={Y.a} label="입력 A" mark={active !== 3} color={BLUE} />
          <Strip y={Y.b} label="입력 B" mark={active !== 3} color={BLUE} />
          <Strip y={Y.out} label="결과" mark={active === 3} fillAll={active === 3} color={AMBER} />
          {pathEnd !== null && (
            <g>
              <line x1={X37} x2={X37} y1={Y.lane + 15} y2={pathEnd} stroke={BLUE} strokeWidth={1.25} />
              <polygon points={`${X37 - 4},${pathEnd - 6} ${X37 + 4},${pathEnd - 6} ${X37},${pathEnd}`} fill={BLUE} />
            </g>
          )}
          {active === 2 && (
            <g>
              <line x1={X37} x2={X37} y1={Y.l2 + 16} y2={Y.a - 3} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
              <text x={X37 - 8} y={Y.l2 + 18} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>찾음 (가정)</text>
            </g>
          )}
          {active === 3 && <text x={X37 + 8} y={Y.vgpr - 3} fontSize={12} fontWeight={700} fill={BLUE}>64칸 덧셈</text>}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
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
