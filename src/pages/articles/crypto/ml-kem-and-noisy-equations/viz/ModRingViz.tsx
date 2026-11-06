import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism·#limits — 원 위의 거리로 7은 8에 가깝고, e2=−4로 3이 되면 0에 가깝다.
 * 거리 = min(|x−c|, 17−|x−c|). 5~12는 8에 더 가깝고 13~3은 0에 더 가까우며 4는 양쪽 4칸으로 같다.
 */
const Q = 17;
const W = 360;
const H = 316;
const CX = W / 2;
const CY = H / 2;
const R = 122;
const NODE = 13;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";

const distance = (x: number, center: number) => {
  const gap = Math.abs(x - center);
  return Math.min(gap, Q - gap);
};

const angleOf = (x: number) => (x / Q) * 2 * Math.PI - Math.PI / 2;
const pointAt = (x: number, radius = R) => ({
  x: CX + radius * Math.cos(angleOf(x)),
  y: CY + radius * Math.sin(angleOf(x)),
});

const SCENES = [
  { label: "두 기준점", summary: "0과 8", note: "17로 나눈 나머지는 16 다음에 다시 0으로 이어지므로 줄이 아니라 원 위에 놓입니다. 비트 0은 0, 비트 1은 8을 기준으로 삼습니다." },
  { label: "가까운 쪽 나누기", summary: "5~12는 비트 1", note: "원을 따라 짧은 쪽으로 세면 5~12는 8에, 13~16과 0~3은 0에 더 가깝습니다. 4만 양쪽 모두 4칸으로 같습니다." },
  { label: "7 읽기", summary: "8까지 1칸 → 비트 1", note: "보낸 8에서 남은 오류 −1만큼 움직여 7에 닿습니다. 8까지 1칸, 0까지 7칸이므로 비트 1을 복원합니다." },
  { label: "오류가 커지면", summary: "3 → 비트 0", note: "10절에서 다룰 경우처럼 e2를 −4로 바꾸면 7−4=3입니다. 0까지 3칸, 8까지 5칸이라 비트 0으로 잘못 읽습니다." },
] as const;

/** from에서 to까지 원 안쪽 호를 그립니다. 값이 줄어드는 방향으로만 씁니다. */
function DownArc({ from, to, color }: { from: number; to: number; color: string }) {
  const radius = R - 24;
  const a = pointAt(from, radius);
  const b = pointAt(to, radius);
  const angle = angleOf(to) + Math.PI / 2;
  const size = 6;
  const left = { x: b.x + size * Math.cos(angle + 0.5), y: b.y + size * Math.sin(angle + 0.5) };
  const right = { x: b.x + size * Math.cos(angle - 0.5), y: b.y + size * Math.sin(angle - 0.5) };
  return (
    <g>
      <path d={`M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${radius} ${radius} 0 0 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`} fill="none" stroke={color} strokeWidth={1.25} />
      <polyline points={`${left.x.toFixed(1)},${left.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)} ${right.x.toFixed(1)},${right.y.toFixed(1)}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function ModRingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const value = active === 2 ? 7 : active === 3 ? 3 : null;
  const readOut =
    value === null
      ? null
      : { value, to0: distance(value, 0), to8: distance(value, 8), bit: distance(value, 8) < distance(value, 0) ? 1 : 0 };

  return (
    <VizFrame
      eyebrow="원 위의 거리"
      title="남은 값이 0과 8 중 어디에 가까운지 원에서 셉니다"
      description="17칸의 원에 나머지를 놓았습니다. 큰 곱을 지운 뒤 남은 값이 어느 기준점 쪽에 있는지가 비트를 정합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="mod 17 원에서 남은 값을 0과 8 중 가까운 쪽으로 읽는 과정"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#94a3b8" strokeWidth={1} />
          {Array.from({ length: Q }, (_, x) => {
            const point = pointAt(x);
            const tie = distance(x, 0) === distance(x, 8);
            const nearEight = distance(x, 8) < distance(x, 0);
            const center = x === 0 || x === 8;
            const regions = active >= 1;
            const stroke = center ? (x === 8 ? BLUE : AMBER) : regions && !tie ? (nearEight ? BLUE : AMBER) : "#94a3b8";
            const isValue = readOut?.value === x;
            const fill = isValue ? (active === 3 ? RED : BLUE) : center ? stroke : regions && !tie ? `${stroke}26` : "#94a3b81a";
            return (
              <g key={x}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={NODE}
                  fill={fill}
                  stroke={isValue && active === 3 ? RED : stroke}
                  strokeWidth={1}
                  strokeDasharray={regions && tie ? "2 2" : undefined}
                />
                <text x={point.x} y={point.y + 4.5} textAnchor="middle" fontSize={13} fontWeight={center || isValue ? 700 : 500} fill={center || isValue ? "#ffffff" : GRAY}>
                  {x}
                </text>
              </g>
            );
          })}

          {active === 0 && (
            <g>
              <text x={CX} y={CY - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>0 = 비트 0</text>
              <text x={CX} y={CY + 14} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>8 = 비트 1</text>
            </g>
          )}
          {active === 1 && (
            <g>
              <text x={CX} y={CY - 34} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>13~3 → 비트 0</text>
              <text x={CX} y={CY + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>4 → 양쪽 같음</text>
              <text x={CX} y={CY + 42} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>5~12 → 비트 1</text>
            </g>
          )}
          {readOut && (
            <g>
              <DownArc from={8} to={7} color={BLUE} />
              {active === 3 && <DownArc from={7} to={3} color={RED} />}
              <text x={CX - 8} y={CY - 16} textAnchor="middle" fontSize={13} fill={GRAY}>{readOut.value}에서</text>
              <text x={CX - 8} y={CY + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>0까지 {readOut.to0}칸</text>
              <text x={CX - 8} y={CY + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>8까지 {readOut.to8}칸</text>
              <text x={CX - 8} y={CY + 46} textAnchor="middle" fontSize={13} fontWeight={700} fill={active === 3 ? RED : BLUE}>
                비트 {readOut.bit}{active === 3 ? " (틀림)" : ""}
              </text>
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
