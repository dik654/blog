import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #names — 격자는 기준 벡터의 정수 배수 합, 작은 오류는 점에서 조금 벗어난 위치.
 * 3절의 A의 두 열 (2,4)·(3,1)을 기준 벡터로 씁니다. s=[1,2]이면 1×(2,4)+2×(3,1)=(8,6), e=[1,0]을 더하면 t=(9,6).
 */
const W = 360;
const H = 312;
const LEFT = 26;
const RIGHT = 10;
const TOP = 10;
const BOTTOM = 24;
const X_MAX = 13;
const Y_MAX = 10;

const px = (x: number) => LEFT + (x / X_MAX) * (W - LEFT - RIGHT);
const py = (y: number) => TOP + ((Y_MAX - y) / Y_MAX) * (H - TOP - BOTTOM);

const BASE_A = [2, 4] as const;
const BASE_B = [3, 1] as const;

const LATTICE: [number, number][] = [];
for (let a = -8; a <= 8; a += 1) {
  for (let b = -8; b <= 8; b += 1) {
    const x = a * BASE_A[0] + b * BASE_B[0];
    const y = a * BASE_A[1] + b * BASE_B[1];
    if (x >= 0 && x <= X_MAX && y >= 0 && y <= Y_MAX) LATTICE.push([x, y]);
  }
}

const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";

const SCENES = [
  { label: "기준 벡터 둘", summary: "(2,4) · (3,1)", note: "3절 표 A를 세로로 읽은 두 열을 좌표 위의 화살표로 놓습니다. 17로 나눈 나머지 계산은 잠시 접어 둡니다." },
  { label: "정수 배수의 점들", summary: "격자", note: "두 화살표를 정수 배 해서 더하면 닿는 점만 찍습니다(음수 배 포함). 이 점들의 배열이 격자입니다. 빈 곳에는 정확한 조합이 없습니다." },
  { label: "비밀로 한 점 고르기", summary: "(8,6)", note: "비밀 s=[1,2]는 첫 화살표 한 번, 둘째 화살표 두 번을 뜻합니다. 그러면 (2,4)+(3,1)+(3,1)=(8,6)에 닿습니다." },
  { label: "오류로 벗어나기", summary: "t = (9,6)", note: "작은 오류 e=[1,0]이 한 칸 옆으로 밉니다. 공개되는 t=[9,6]은 격자 점이 아니고, 어느 조합에서 왔는지가 바로 적혀 있지 않습니다. 이 2차원 그림은 직관용이며 안전한 크기가 아닙니다." },
] as const;

function Arrow({ from, to, color }: { from: readonly [number, number]; to: readonly [number, number]; color: string }) {
  const x1 = px(from[0]);
  const y1 = py(from[1]);
  const x2 = px(to[0]);
  const y2 = py(to[1]);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  const head = [angle - 0.45, angle + 0.45]
    .map((a) => `${(x2 - size * Math.cos(a)).toFixed(1)},${(y2 - size * Math.sin(a)).toFixed(1)}`);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <polyline points={`${head[0]} ${x2},${y2} ${head[1]}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function LatticeOffsetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="격자 그림"
      title="격자 점에서 한 칸 벗어난 곳이 공개값입니다"
      description="가로는 첫째 성분, 세로는 둘째 성분입니다. 3절의 작은 숫자를 그대로 씁니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="기준 벡터로 격자를 만들고 비밀과 오류로 공개값 위치를 찾는 과정"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {Array.from({ length: X_MAX + 1 }, (_, x) => (
            <line key={`x${x}`} x1={px(x)} x2={px(x)} y1={py(0)} y2={py(Y_MAX)} stroke="#94a3b8" strokeWidth={0.5} opacity={0.4} />
          ))}
          {Array.from({ length: Y_MAX + 1 }, (_, y) => (
            <line key={`y${y}`} x1={px(0)} x2={px(X_MAX)} y1={py(y)} y2={py(y)} stroke="#94a3b8" strokeWidth={0.5} opacity={0.4} />
          ))}
          {[0, 2, 4, 6, 8, 10, 12].map((x) => (
            <text key={x} x={px(x)} y={H - 7} textAnchor="middle" fontSize={12} fill={GRAY}>{x}</text>
          ))}
          {[2, 4, 6, 8, 10].map((y) => (
            <text key={y} x={LEFT - 6} y={py(y) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{y}</text>
          ))}

          {active >= 1 && LATTICE.map(([x, y]) => (
            <circle key={`${x},${y}`} cx={px(x)} cy={py(y)} r={4} fill={GRAY} />
          ))}
          <circle cx={px(0)} cy={py(0)} r={3} fill={GRAY} />

          {active <= 1 && (
            <g>
              <Arrow from={[0, 0]} to={BASE_A} color={BLUE} />
              <Arrow from={[0, 0]} to={BASE_B} color={AMBER} />
              <text x={px(2) - 8} y={py(4) - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>(2,4)</text>
              <text x={px(3) + 8} y={py(1) + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>(3,1)</text>
            </g>
          )}

          {active >= 2 && (
            <g>
              <Arrow from={[0, 0]} to={[2, 4]} color={BLUE} />
              <Arrow from={[2, 4]} to={[5, 5]} color={AMBER} />
              <Arrow from={[5, 5]} to={[8, 6]} color={AMBER} />
              <circle cx={px(8)} cy={py(6)} r={5} fill={BLUE} />
              <text x={px(8) - 2} y={py(6) - 11} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>(8,6)</text>
            </g>
          )}

          {active >= 3 && (
            <g>
              <Arrow from={[8, 6]} to={[9, 6]} color={RED} />
              <circle cx={px(9)} cy={py(6)} r={5} fill="none" stroke={RED} strokeWidth={1.25} />
              <text x={px(9) + 9} y={py(6) - 9} fontSize={13} fontWeight={700} fill={RED}>t = (9,6)</text>
              <text x={px(8.5)} y={py(6) + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>e</text>
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
