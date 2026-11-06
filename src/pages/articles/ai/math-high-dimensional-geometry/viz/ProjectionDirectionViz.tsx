import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #distance 마지막 문단 — 길이가 1인 방향이어도 데이터와 직각이면 거리가 전부 사라진다.
 * 네 칸 중 앞 두 칸의 단면입니다. 출력 숫자는 네 칸으로 계산한 본문 값입니다.
 */
const W = 340;
const H = 244;
const SCALE = 44;
const OX = 120;
const OY = 172;
const px = (x: number) => OX + x * SCALE;
const py = (y: number) => OY - y * SCALE;

const POINTS = [0, 1, 2, 3] as const;
const POINT_COLOR = "#64748b";
const LINE_COLOR = "#2563eb";
const DROP_COLOR = "#94a3b8";

/** 단면 위의 점 (t,t)를 방향 (dx,dy)의 선으로 떨어뜨린 자리 */
function foot(t: number, dx: number, dy: number) {
  const along = t * dx + t * dy;
  return [along * dx, along * dy] as const;
}

const SCENES = [
  {
    label: "나란한 방향",
    summary: "출력 0 · 2 · 4 · 6",
    dir: [Math.SQRT1_2, Math.SQRT1_2] as const,
    from: [-0.4, -0.4] as const,
    to: [3.4, 3.4] as const,
    note: "합을 2로 나누는 규칙은 (t,t,t,t)가 움직이는 방향을 따라 잽니다. 첫째 점에서 잰 네 칸 거리 2, 4, 6이 그대로 남습니다.",
  },
  {
    label: "첫 칸 방향",
    summary: "출력 0 · 1 · 2 · 3",
    dir: [1, 0] as const,
    from: [-0.4, 0] as const,
    to: [3.6, 0] as const,
    note: "첫 칸만 남기면 점을 가로축으로 떨어뜨립니다. 순서는 그대로지만 거리는 1, 2, 3으로 절반입니다.",
  },
  {
    label: "직각 방향",
    summary: "출력 모두 0",
    dir: [Math.SQRT1_2, -Math.SQRT1_2] as const,
    from: [-1.3, 1.3] as const,
    to: [1.3, -1.3] as const,
    note: "첫째와 둘째 칸의 차이를 √2로 나누면 데이터와 직각인 선에 떨어집니다. 방향의 길이는 똑같이 1이지만 네 점이 한 곳에 겹칩니다.",
  },
] as const;

const OUTPUT_LABELS = [[0, 2, 4, 6], [0, 1, 2, 3], null] as const;

export default function ProjectionDirectionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const scene = SCENES[active];
  const outputs = OUTPUT_LABELS[active];

  return (
    <VizFrame
      eyebrow="사영의 방향"
      title="같은 네 점도 떨어뜨리는 방향에 따라 거리가 남거나 사라집니다"
      description="네 칸 중 앞의 두 칸만 그린 단면입니다. 파란 선이 출력으로 남기는 방향입니다."
      note="단면이라 화면의 길이는 네 칸 거리와 다르고, 출력 숫자는 네 칸으로 계산했습니다. 직각은 네 칸에서도 직각입니다. 네 점은 가정입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="같은 네 점을 세 방향으로 사영하는 과정"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          <line x1={px(-1.7)} x2={px(3.8)} y1={py(0)} y2={py(0)} stroke="#cbd5e1" strokeWidth={1} />
          <line x1={px(0)} x2={px(0)} y1={py(-1.5)} y2={py(3.7)} stroke="#cbd5e1" strokeWidth={1} />
          <text x={px(3.8)} y={py(0) + 34} textAnchor="end" fontSize={12} fill="#64748b">첫째 칸 →</text>
          <text x={px(0) - 6} y={py(3.7) + 10} textAnchor="end" fontSize={12} fill="#64748b">둘째 칸</text>

          <line x1={px(scene.from[0])} y1={py(scene.from[1])} x2={px(scene.to[0])} y2={py(scene.to[1])} stroke={LINE_COLOR} strokeWidth={1.25} />

          {POINTS.map((t) => {
            const [fx, fy] = foot(t, scene.dir[0], scene.dir[1]);
            return <line key={t} x1={px(t)} y1={py(t)} x2={px(fx)} y2={py(fy)} stroke={DROP_COLOR} strokeWidth={1} strokeDasharray="3 3" />;
          })}

          {active === 2 && (
            <g>
              <path d={`M ${px(0.22)} ${py(0.22)} L ${px(0.44)} ${py(0)} L ${px(0.22)} ${py(-0.22)}`} fill="none" stroke={LINE_COLOR} strokeWidth={1} />
              <text x={px(0.62)} y={py(-0.06) + 14} fontSize={12} fontWeight={700} fill={LINE_COLOR}>직각</text>
              <text x={px(-0.16)} y={py(-0.7)} textAnchor="end" fontSize={12} fontWeight={700} fill={LINE_COLOR}>네 점이 여기로</text>
            </g>
          )}

          {POINTS.map((t) => {
            const [fx, fy] = foot(t, scene.dir[0], scene.dir[1]);
            return (
              <g key={t}>
                {active === 1 && <circle cx={px(fx)} cy={py(fy)} r={4} fill="#ffffff" stroke={LINE_COLOR} strokeWidth={1.25} />}
                {active === 1 && <text x={px(fx)} y={py(fy) + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={LINE_COLOR}>{outputs?.[t]}</text>}
                <circle cx={px(t)} cy={py(t)} r={4} fill={POINT_COLOR} />
                <text x={px(t) - 8} y={active === 2 && t === 0 ? py(t) + 15 : py(t) - 8} textAnchor="end" fontSize={12} fill={POINT_COLOR}>{`t=${t}`}</text>
                {active === 0 && <text x={px(t) + 10} y={py(t) + 5} fontSize={12} fontWeight={700} fill={LINE_COLOR}>{outputs?.[t]}</text>}
              </g>
            );
          })}
          {active === 2 && <circle cx={px(0)} cy={py(0)} r={6} fill="none" stroke={LINE_COLOR} strokeWidth={1.25} />}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
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
