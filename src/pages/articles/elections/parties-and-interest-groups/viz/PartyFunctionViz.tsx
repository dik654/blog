import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·why-parties — 정당이 선택지를 줄여 선호를 한 축 위로 정렬한다 */
const SCENES = [
  "묶이지 않은 후보들",
  "정당이 후보를 묶는다",
  "그래서 앞 글의 순환이 사라진다",
  "축에 못 올라탄 쟁점은 사라진다",
] as const;

const NOTES = [
  "후보마다 쟁점별 입장이 제각각이면 유권자는 후보 수와 쟁점 수를 곱한 만큼을 알아봐야 합니다. 이 비용을 감당할 사람은 거의 없습니다.",
  "정당은 후보들을 몇 덩어리로 묶어 이름 하나에 여러 쟁점의 입장을 붙입니다. 알아볼 것이 후보 수에서 정당 수로 줄고, 흩어져 있던 입장들이 한 줄 위에 늘어섭니다.",
  "선택지가 한 줄 위에 서면 선호가 봉우리 하나 모양이 되기 쉽습니다. 앞 글에서 순환을 막아 주던 조건이 저절로 만들어지는 셈이고, 이것이 정당이 하는 가장 큰 일입니다.",
  "대가는 축 밖에 있습니다. 어느 정당에도 붙지 않은 쟁점은 선택지에 실리지 못하므로, 그 쟁점을 중요하게 보는 사람은 투표로 말할 방법이 없습니다.",
] as const;

const PARTY_COLORS = ["#6366f1", "#f59e0b", "#10b981"];
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 후보 12명. scattered는 묶이기 전 위치, axis는 정당별로 정렬된 뒤의 축 좌표 */
const CANDIDATES = [
  { party: 0, sx: 64, sy: 46, ax: 1.2 },
  { party: 1, sx: 128, sy: 92, ax: 5.1 },
  { party: 0, sx: 96, sy: 118, ax: 1.8 },
  { party: 2, sx: 188, sy: 52, ax: 8.4 },
  { party: 1, sx: 152, sy: 36, ax: 4.6 },
  { party: 2, sx: 210, sy: 104, ax: 9.1 },
  { party: 0, sx: 46, sy: 88, ax: 0.7 },
  { party: 1, sx: 172, sy: 126, ax: 5.6 },
  { party: 2, sx: 118, sy: 66, ax: 8.9 },
  { party: 0, sx: 204, sy: 78, ax: 2.3 },
  { party: 1, sx: 78, sy: 134, ax: 4.1 },
  { party: 2, sx: 142, sy: 110, ax: 7.8 },
] as const;

const PARTY_NAMES = ["가당", "나당", "다당"] as const;

/** 축에 올라타지 못한 쟁점들 */
const OFF_AXIS = ["지역 현안", "세대 문제", "특정 산업 규제"] as const;

const X0 = 40;
const SPAN = 400;
const toX = (v: number) => X0 + (v / 10) * SPAN;

export default function PartyFunctionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="정당의 기능"
      title="정당은 무엇을 대표하기 전에 먼저 선택지를 줄입니다"
      description="흩어진 후보와 쟁점을 몇 덩어리로 묶어 판단을 한 줄 위로 옮깁니다."
      note="후보 12명, 정당 셋으로 줄인 그림입니다. 실제로는 정당 안에서도 입장이 갈리고 축이 하나로 정리되지 않는 시기도 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정당이 선택지를 줄이는 과정"
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
              {step === 0 && (
                <g>
                  <text x={40} y={24} fontSize={9} fontWeight={700} fill={MUTED}>
                    후보 {CANDIDATES.length}명 · 각자 여러 쟁점에 제각각의 입장
                  </text>
                  {CANDIDATES.map((c, i) => (
                    <circle key={i} cx={c.sx + 60} cy={c.sy + 20} r={5} fill={MUTED} fillOpacity={0.4} />
                  ))}
                  <text x={300} y={70} fontSize={9.5} fontWeight={700} fill={WARN}>
                    유권자가 알아봐야 할 것
                  </text>
                  <text x={300} y={90} fontSize={9.5} fill={MUTED}>
                    후보 {CANDIDATES.length}명 × 쟁점 여러 개
                  </text>
                  <text x={300} y={112} fontSize={9} fill={MUTED}>
                    한 명이 감당할 수 있는 양이
                  </text>
                  <text x={300} y={126} fontSize={9} fill={MUTED}>
                    아닙니다
                  </text>
                </g>
              )}

              {step >= 1 && (
                <g>
                  <line x1={X0} y1={120} x2={X0 + SPAN} y2={120} stroke={MUTED} strokeWidth={1} />
                  <text x={X0} y={140} fontSize={8} fill={MUTED}>
                    한 축으로 정리된 입장
                  </text>
                  {CANDIDATES.map((c, i) => (
                    <circle
                      key={i}
                      cx={toX(c.ax)}
                      cy={120}
                      r={5}
                      fill={PARTY_COLORS[c.party]}
                      fillOpacity={step === 3 ? 0.35 : 0.7}
                    />
                  ))}
                  {PARTY_NAMES.map((name, p) => {
                    const members = CANDIDATES.filter((c) => c.party === p);
                    const center =
                      members.reduce((acc, c) => acc + c.ax, 0) / members.length;
                    return (
                      <text
                        key={name}
                        x={toX(center)}
                        y={104}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontWeight={700}
                        fill={PARTY_COLORS[p]}
                      >
                        {name}
                      </text>
                    );
                  })}
                </g>
              )}

              {step === 1 && (
                <g>
                  <text x={40} y={32} fontSize={9} fontWeight={700} fill={MUTED}>
                    알아볼 것이 후보 {CANDIDATES.length}명에서 정당 {PARTY_NAMES.length}개로 줄었습니다
                  </text>
                  <text x={40} y={168} fontSize={9} fill={MUTED}>
                    정당 이름 하나가 여러 쟁점의 입장을 한꺼번에 알려 주는 표지가 됩니다
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <path
                    d={`M${toX(0)} 76 L${toX(3)} 40 L${toX(6)} 76`}
                    fill="none"
                    stroke={PARTY_COLORS[0]}
                    strokeWidth={1.25}
                  />
                  <path
                    d={`M${toX(4)} 76 L${toX(7)} 44 L${toX(10)} 76`}
                    fill="none"
                    stroke={PARTY_COLORS[2]}
                    strokeWidth={1.25}
                  />
                  <text x={40} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
                    유권자의 선호도 같은 축 위에서 봉우리 하나가 됩니다
                  </text>
                  <text x={40} y={168} fontSize={9} fontWeight={700} fill={PARTY_COLORS[2]}>
                    앞 글의 순환 조건이 여기서 사라집니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={40} y={30} fontSize={9} fontWeight={700} fill={WARN}>
                    어느 정당에도 붙지 않은 쟁점
                  </text>
                  {OFF_AXIS.map((issue, i) => (
                    <g key={issue}>
                      <rect
                        x={60 + i * 128}
                        y={42}
                        width={112}
                        height={26}
                        fill={WARN}
                        fillOpacity={0.06}
                        stroke={WARN}
                        strokeWidth={1}
                        strokeDasharray="3 3"
                      />
                      <text x={116 + i * 128} y={59} textAnchor="middle" fontSize={9} fill={MUTED}>
                        {issue}
                      </text>
                    </g>
                  ))}
                  <text x={60} y={84} fontSize={9} fill={MUTED}>
                    축 위 어디에도 자리가 없어 투표로는 말할 수 없습니다
                  </text>
                  <text x={40} y={168} fontSize={9} fontWeight={700} fill={WARN}>
                    줄이는 일과 잘라 내는 일은 같은 동작입니다
                  </text>
                </g>
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
