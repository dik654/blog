import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: yield-curve·curve-shapes — 만기별 금리가 이루는 곡선과 그 해석 */
const SCENES = [
  "만기마다 금리가 다르다",
  "보통은 길수록 높다",
  "기대가 내려가면 뒤집힌다",
  "기대와 프리미엄은 곡선만으로 못 가른다",
] as const;

const NOTES = [
  "같은 발행자의 채권이라도 1년물과 10년물의 금리는 다릅니다. 점을 이으면 하나의 곡선이 됩니다.",
  "기다리는 데 대한 보상이 붙어 대체로 우상향합니다. 이 모양이 기준선입니다.",
  "짧은 쪽이 긴 쪽보다 높아지면, 앞으로 단기금리가 내려갈 것으로 시장이 본다는 신호로 읽힙니다.",
  "곡선은 기대 평균과 기간 프리미엄의 합이라, 어느 쪽이 움직였는지는 곡선만 보고 가를 수 없습니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const MATURITIES = [1, 2, 3, 5, 7, 10];
/** 단위는 %. 구조를 보이기 위한 예시 값입니다. */
const NORMAL = [2.6, 2.9, 3.1, 3.4, 3.6, 3.8];
const INVERTED = [4.2, 4.0, 3.8, 3.5, 3.4, 3.3];
/** 뒤집힌 곡선을 기대 평균과 프리미엄으로 분해한 한 가지 예 */
const EXPECTATION = [4.1, 3.7, 3.4, 3.0, 2.8, 2.7];

const X = (index: number) => 56 + index * 72;
const Y = (rate: number) => 168 - (rate - 2.2) * 52;

function polyline(values: readonly number[]) {
  return values.map((value, index) => `${X(index)},${Y(value)}`).join(" ");
}

export default function YieldCurveShapeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;
  const values = step >= 2 ? INVERTED : NORMAL;
  const color = step >= 2 ? WARN : ACCENT;

  return (
    <VizFrame
      eyebrow="수익률 곡선"
      title="만기를 가로축에 놓고 금리를 이으면 시장의 기대가 보입니다"
      description="곡선의 모양이 앞으로의 정책 경로에 대한 예상을 담지만, 프리미엄과 섞여 있습니다."
      note="금리 값은 모양을 보이기 위한 예시이며 특정 시점의 실제 국채 금리가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="수익률 곡선의 모양"
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
              <line x1={44} y1={24} x2={44} y2={168} stroke={MUTED} strokeWidth={1} />
              <line x1={44} y1={168} x2={460} y2={168} stroke={MUTED} strokeWidth={1} />
              <text x={16} y={40} fontSize={8} fill={MUTED}>
                금리
              </text>
              <text x={460} y={190} textAnchor="end" fontSize={8} fill={MUTED}>
                만기
              </text>
              {MATURITIES.map((maturity, index) => (
                <text key={maturity} x={X(index)} y={184} textAnchor="middle" fontSize={8} fill={MUTED}>
                  {maturity}년
                </text>
              ))}

              {step === 3 && (
                <g>
                  <polyline points={polyline(EXPECTATION)} fill="none" stroke={OK} strokeWidth={1} strokeDasharray="4 3" />
                  {EXPECTATION.map((value, index) => (
                    <circle key={index} cx={X(index)} cy={Y(value)} r={2} fill={OK} />
                  ))}
                  <text x={X(3)} y={Y(EXPECTATION[3]) + 18} fontSize={8} fontWeight={700} fill={OK}>
                    기대 평균만 떼어 낸 경우의 한 예
                  </text>
                  {MATURITIES.map((maturity, index) => (
                    <line
                      key={`gap-${maturity}`}
                      x1={X(index)}
                      y1={Y(EXPECTATION[index])}
                      x2={X(index)}
                      y2={Y(INVERTED[index])}
                      stroke={MUTED}
                      strokeWidth={1}
                    />
                  ))}
                  <text x={X(5) - 8} y={Y(3.0)} textAnchor="end" fontSize={8} fill={MUTED}>
                    이 간격이 기간 프리미엄
                  </text>
                </g>
              )}

              <polyline points={polyline(values)} fill="none" stroke={color} strokeWidth={1.25} />
              {values.map((value, index) => (
                <g key={index}>
                  <circle cx={X(index)} cy={Y(value)} r={2.5} fill={color} />
                  {step <= 2 && (
                    <text x={X(index)} y={Y(value) - 8} textAnchor="middle" fontSize={8} fill={color}>
                      {value.toFixed(1)}
                    </text>
                  )}
                </g>
              ))}

              <text x={460} y={22} textAnchor="end" fontSize={9} fontWeight={700} fill={color}>
                {step >= 2 ? "뒤집힌 곡선" : "우상향 곡선"}
              </text>
              {step === 3 && (
                <text x={460} y={38} textAnchor="end" fontSize={8} fill={MUTED}>
                  프리미엄은 관측값이 아니라 추정값입니다
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
