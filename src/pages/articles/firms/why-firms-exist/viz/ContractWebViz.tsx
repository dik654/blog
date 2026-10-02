import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: one-contract 절 — 여러 계약이 하나로 바뀐다 */
const SCENES = [
  "여섯이 서로 맞춰야 합니다",
  "짝마다 약속을 맺으면 열다섯입니다",
  "가운데를 두면 여섯으로 줄어듭니다",
  "줄어든 대신 적히지 않은 것이 생깁니다",
] as const;

const N = 6;
const PAIRS = (N * (N - 1)) / 2;
const SPOKES = N;

const NODE = "#6366f1";
const HUB = "#ef4444";
const EDGE = "#94a3b8";
const MUTED = "#94a3b8";
const INK = "#334155";

const CX = 150;
const CY = 100;
const R = 62;

const pt = (i: number) => {
  const a = (Math.PI * 2 * i) / N - Math.PI / 2;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
};

const PAIR_LIST: Array<[number, number]> = [];
for (let i = 0; i < N; i += 1)
  for (let j = i + 1; j < N; j += 1) PAIR_LIST.push([i, j]);

export default function ContractWebViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const s = scenes.active;

  const NOTES = [
    `여섯 사람이 하나를 만들려면 각자가 무엇을 언제 어떻게 할지 서로 맞춰야 합니다. 값으로 조정한다는 것은 이 맞춤을 전부 약속으로 적는다는 뜻입니다.`,
    `짝마다 따로 맺으면 ${PAIRS}개입니다. 사람이 늘면 짝은 그보다 빠르게 늘어, 열 사람이면 마흔다섯입니다. 맺을 때마다 상대를 찾고 조건을 따지고 지키게 할 방법을 마련해야 하므로 이 수가 그대로 값이 됩니다.`,
    `가운데를 하나 두고 각자가 그 하나와만 맺으면 ${SPOKES}개입니다. 이것이 조직입니다. 줄어든 몫이 조직을 세울 이유이고, Coase는 이것을 "이 일련의 계약들이 하나로 대체된다"고 적었습니다.`,
    `대신 그 하나의 약속에는 무엇을 할지가 적히지 않습니다. 적히는 것은 지시를 받는 범위뿐이고, 그 안에서 무엇을 할지는 나중에 지시로 정해집니다. 값이 하던 일을 지시가 넘겨받은 것입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="약속의 수"
      title="짝마다 맺던 약속이 가운데를 두면 하나씩으로 줄어듭니다"
      description="줄어든 약속의 수가 조직을 세울 이유이고, 그 대신 약속에 적히지 않은 자리가 지시로 채워집니다."
      note="여섯으로 줄인 예입니다. 실제로는 모든 짝이 약속을 맺어야 하는 경우가 드물지만, 늘어나는 속도의 차이를 보이기 위한 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="짝마다 맺는 약속과 가운데를 둔 약속의 수 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              {/* 짝마다 맺는 선 */}
              {s === 1 &&
                PAIR_LIST.map(([i, j], k) => {
                  const a = pt(i);
                  const b = pt(j);
                  return (
                    <line
                      key={`p${k}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={EDGE}
                      strokeWidth={0.75}
                      opacity={0.75}
                    />
                  );
                })}

              {/* 가운데를 둔 선 */}
              {s >= 2 &&
                Array.from({ length: N }, (_, i) => {
                  const a = pt(i);
                  return (
                    <line
                      key={`h${i}`}
                      x1={a.x}
                      y1={a.y}
                      x2={CX}
                      y2={CY}
                      stroke={HUB}
                      strokeWidth={1.25}
                      opacity={0.8}
                    />
                  );
                })}

              {s >= 2 && (
                <g>
                  <circle cx={CX} cy={CY} r={13} fill={HUB} opacity={0.9} />
                  <text
                    x={CX}
                    y={CY + 3}
                    fontSize={8}
                    fontWeight={700}
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    가운데
                  </text>
                </g>
              )}

              {Array.from({ length: N }, (_, i) => {
                const a = pt(i);
                return (
                  <g key={`n${i}`}>
                    <circle cx={a.x} cy={a.y} r={10} fill={NODE} opacity={0.9} />
                    <text
                      x={a.x}
                      y={a.y + 3}
                      fontSize={8}
                      fontWeight={700}
                      fill="#ffffff"
                      textAnchor="middle"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}

              {/* 오른쪽 셈 */}
              <text x={306} y={54} fontSize={8} fontWeight={700} fill={MUTED}>
                맺어야 하는 약속
              </text>
              <text
                x={306}
                y={82}
                fontSize={20}
                fontWeight={700}
                fill={s === 1 ? EDGE : s >= 2 ? HUB : MUTED}
              >
                {s === 0 ? "?" : s === 1 ? PAIRS : SPOKES}
              </text>
              <text x={306} y={102} fontSize={8.5} fill={MUTED}>
                {s === 1
                  ? "짝의 수만큼"
                  : s >= 2
                    ? "사람의 수만큼"
                    : "아직 정하지 않았습니다"}
              </text>

              {s >= 2 && (
                <text x={306} y={124} fontSize={8.5} fontWeight={700} fill={INK}>
                  {PAIRS} → {SPOKES}
                </text>
              )}
              {s === 3 && (
                <text x={306} y={142} fontSize={8} fill={HUB}>
                  무엇을 할지는 적히지 않습니다
                </text>
              )}

              <text x={14} y={186} fontSize={8} fill={MUTED}>
                {s === 3
                  ? "적히는 것은 지시를 받는 범위뿐이고 내용은 나중에 정해집니다"
                  : "사람이 늘면 짝은 사람보다 빠르게 늘어납니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
