import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: checks 의 ExplainedFormula — 승인 구간의 교집합이 통과 가능 영역 */
const SCENES = [
  "한 명이면 옮길 폭이 넓다",
  "둘이면 겹치는 곳만 남는다",
  "셋이면 더 좁아진다",
  "현상유지가 사이에 있으면 빈다",
] as const;

const NOTES = [
  "거부권자가 한 명이면 현상유지보다 자기 이상점에 가까운 구간 전체가 통과 가능합니다.",
  "한 명이라도 반대하면 끝이므로 합집합이 아니라 교집합입니다. 구간이 좁아지기만 하고 넓어지지는 않습니다.",
  "거부권자를 더할수록 겹치는 곳이 계속 줄어듭니다. 견제 장치가 남용과 함께 정상적인 변경도 막는 이유입니다.",
  "같은 사람들이라도 현상유지가 이상점들 사이에 놓이면 서로 반대 방향을 원해 겹치는 곳이 사라집니다.",
] as const;

const COLORS = ["#6366f1", "#f59e0b", "#a855f7"];
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const X0 = 40;
const SPAN = 400;
const toX = (v: number) => X0 + (v / 10) * SPAN;

/** 장면별 (거부권자 이상점 목록, 현상유지) */
const SETUP: Array<{ ideals: number[]; q: number }> = [
  { ideals: [5], q: 10 },
  { ideals: [5, 7], q: 10 },
  { ideals: [5, 7, 9], q: 10 },
  { ideals: [5, 7], q: 6 },
];

/** i의 승인 구간: 현상유지 q와 이상점 기준 반사점 2·x_i − q 사이 */
function approval(ideal: number, q: number): [number, number] {
  const mirror = 2 * ideal - q;
  return [Math.min(q, mirror), Math.max(q, mirror)];
}

export default function VetoPlayerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const step = scenes.active;
  const { ideals, q } = SETUP[step];
  const ranges = ideals.map((ideal) => approval(ideal, q));
  const low = Math.max(...ranges.map(([start]) => start));
  const high = Math.min(...ranges.map(([, end]) => end));
  const winset: [number, number] | null = low < high ? [low, high] : null;

  return (
    <VizFrame
      eyebrow="거부권 행위자"
      title="통과 가능한 영역은 모든 승인 구간이 겹치는 곳뿐입니다"
      description="거부권자를 더할수록 좁아지고, 현상유지가 이상점들 사이에 놓이면 아예 사라집니다."
      note="정책을 하나의 축으로 줄이고 선호가 이상점에서 멀어질수록 단조롭게 나빠진다고 가정한 단순화입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="거부권자의 승인 구간과 교집합"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <line x1={X0} y1={156} x2={X0 + SPAN} y2={156} stroke={MUTED} strokeWidth={1} />
              {[0, 2, 4, 6, 8, 10].map((tick) => (
                <g key={tick}>
                  <line x1={toX(tick)} y1={152} x2={toX(tick)} y2={160} stroke={MUTED} strokeWidth={1} />
                  <text x={toX(tick)} y={172} textAnchor="middle" fontSize={8} fill={MUTED}>
                    {tick}
                  </text>
                </g>
              ))}
              <text x={X0 + SPAN} y={190} textAnchor="end" fontSize={8} fill={MUTED}>
                정책 축
              </text>

              {ranges.map(([start, end], index) => {
                const color = COLORS[index];
                const y = 44 + index * 28;
                return (
                  <g key={index}>
                    <rect
                      x={toX(start)}
                      y={y}
                      width={toX(end) - toX(start)}
                      height={18}
                      fill={color}
                      fillOpacity={0.16}
                      stroke={color}
                      strokeWidth={1}
                    />
                    <circle cx={toX(ideals[index])} cy={y + 9} r={3} fill={color} />
                    <text x={toX(end) + 8} y={y + 13} fontSize={9} fontWeight={700} fill={color}>
                      이상점 {ideals[index]}
                    </text>
                  </g>
                );
              })}

              <line x1={toX(q)} y1={36} x2={toX(q)} y2={156} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
              <text x={toX(q)} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                현상유지 {q}
              </text>

              {winset ? (
                <g>
                  <rect
                    x={toX(winset[0])}
                    y={130}
                    width={toX(winset[1]) - toX(winset[0])}
                    height={18}
                    fill={OK}
                    fillOpacity={0.25}
                    stroke={OK}
                    strokeWidth={1}
                  />
                  <text x={toX((winset[0] + winset[1]) / 2)} y={143} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    통과 가능 {winset[0]}~{winset[1]}
                  </text>
                </g>
              ) : (
                <text x={toX(3)} y={143} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>
                  통과 가능 영역 없음 · 현상유지 고착
                </text>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
