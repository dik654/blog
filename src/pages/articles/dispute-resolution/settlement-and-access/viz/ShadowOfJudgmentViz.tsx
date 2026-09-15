import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: shadow — 적용되지 않는 규칙이 모든 사건에 작동하는 경로 */
const SCENES = [
  "지금 규칙에서의 합의 구간",
  "규칙이 바뀌면 기대가 바뀐다",
  "재판은 한 건도 열리지 않았는데",
  "그래서 드문 판결이 모든 사건에 닿는다",
] as const;

const JUDGMENT = 1000;
const COST = 80;
const BEFORE = 0.5;
const AFTER = 0.7;

const OK = "#10b981";
const ACCENT = "#6366f1";
const AMBER = "#f59e0b";
const MUTED = "#94a3b8";

const X0 = 46;
const SPAN = 384;
const toX = (v: number) => X0 + (v / JUDGMENT) * SPAN;
const fmt = (v: number) => v.toLocaleString("ko-KR");
const pct = (p: number) => `${Math.round(p * 1000) / 10}`;

const band = (p: number) => ({
  low: p * JUDGMENT - COST,
  high: p * JUDGMENT + COST,
  mid: p * JUDGMENT,
});

export default function ShadowOfJudgmentViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const before = band(BEFORE);
  const after = band(AFTER);
  const showAfter = step >= 1;

  const NOTES = [
    `지금 규칙에서 양쪽이 승소 가능성을 ${pct(BEFORE)}퍼센트로 본다면 합의 구간이 ${fmt(before.low)}에서 ${fmt(before.high)}이고 가운데가 ${fmt(before.mid)}입니다. 실제 합의는 대개 이 안에서 정해집니다.`,
    `판결 하나가 나와 같은 유형에서 청구가 받아들여진다는 것이 분명해지면 양쪽의 기대가 ${pct(AFTER)}퍼센트로 옮겨 갑니다. 구간도 통째로 ${fmt(after.low)}에서 ${fmt(after.high)}으로 밀려 올라갑니다.`,
    `이 이동은 새로 재판을 연 사건에서 일어나는 것이 아닙니다. 협상 테이블에서 일어납니다. 한 건의 판결이 나온 뒤로 재판이 한 건도 더 열리지 않아도 합의 금액은 ${fmt(before.mid)}에서 ${fmt(after.mid)}으로 옮겨 갑니다.`,
    "그래서 대부분의 사건에 규칙이 직접 적용되지 않는다는 사실이 규칙이 하는 일이 없다는 뜻은 아닙니다. 판결은 드물게 나오지만 그 드문 판결이 협상의 기준점을 옮겨 모든 사건에 닿습니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="판결의 그림자"
      title="드물게 나오는 판결이 열리지 않은 사건들의 금액을 정합니다"
      description="협상은 재판했을 때의 결과를 기준점으로 삼아 이루어집니다."
      note={`판결 금액 ${fmt(JUDGMENT)}, 소송비용 각 ${fmt(COST)}으로 둔 예입니다. 양측이 같은 기대를 갖는 경우만 그렸습니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="판결이 합의 구간을 옮기는 과정"
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
              <text x={X0} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                합의 구간
              </text>

              <rect
                x={toX(before.low)}
                y={40}
                width={toX(before.high) - toX(before.low)}
                height={22}
                fill={showAfter ? MUTED : OK}
                fillOpacity={showAfter ? 0.12 : 0.25}
                stroke={showAfter ? MUTED : OK}
                strokeWidth={1}
                strokeDasharray={showAfter ? "3 3" : undefined}
              />
              <text x={toX(before.mid)} y={55} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={showAfter ? MUTED : OK}>
                기대 {pct(BEFORE)}%
              </text>

              {showAfter && (
                <g>
                  <rect x={toX(after.low)} y={72} width={toX(after.high) - toX(after.low)} height={22} fill={AMBER} fillOpacity={0.25} stroke={AMBER} strokeWidth={1} />
                  <text x={toX(after.mid)} y={87} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={AMBER}>
                    기대 {pct(AFTER)}%
                  </text>
                  <path
                    d={`M${toX(before.mid)} 62 L${toX(before.mid)} 68 L${toX(after.mid)} 68 L${toX(after.mid)} 72`}
                    fill="none"
                    stroke={AMBER}
                    strokeWidth={1}
                  />
                </g>
              )}

              <line x1={X0} y1={114} x2={X0 + SPAN} y2={114} stroke={MUTED} strokeWidth={1} />
              {[0, 250, 500, 750, 1000].map((tick) => (
                <g key={tick}>
                  <line x1={toX(tick)} y1={110} x2={toX(tick)} y2={118} stroke={MUTED} strokeWidth={1} />
                  <text x={toX(tick)} y={130} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                    {fmt(tick)}
                  </text>
                </g>
              ))}

              {step === 0 && (
                <text x={X0} y={158} fontSize={9.5} fill={MUTED}>
                  실제 합의는 대개 이 구간 안에서 정해집니다
                </text>
              )}

              {step === 1 && (
                <g>
                  <text x={X0} y={158} fontSize={9.5} fontWeight={700} fill={AMBER}>
                    판결 하나가 같은 유형의 승소 가능성을 분명히 했습니다
                  </text>
                  <text x={X0} y={178} fontSize={9} fill={MUTED}>
                    구간이 통째로 밀려 올라갑니다
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <text x={X0} y={154} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    이 이동은 협상 테이블에서 일어납니다
                  </text>
                  <text x={X0} y={174} fontSize={9.5} fontWeight={700} fill={AMBER}>
                    합의 금액이 {fmt(before.mid)}에서 {fmt(after.mid)}으로 옮겨 갑니다
                  </text>
                  <text x={X0} y={192} fontSize={9} fill={MUTED}>
                    재판은 한 건도 더 열리지 않았습니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={X0} y={154} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    규칙이 직접 적용되는 사건이 드물다는 것과
                  </text>
                  <text x={X0} y={172} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    규칙이 하는 일이 없다는 것은 다른 말입니다
                  </text>
                  <text x={X0} y={192} fontSize={9} fill={MUTED}>
                    드문 판결이 협상의 기준점을 옮겨 모든 사건에 닿습니다
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
