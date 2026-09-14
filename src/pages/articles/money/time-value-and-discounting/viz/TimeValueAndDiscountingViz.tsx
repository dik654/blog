import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: compounding·discounting·npv — 굴리기, 되돌리기, 합치기 */
const SCENES = [
  "앞으로 굴린다",
  "뒤로 되돌린다",
  "흩어진 돈을 한 시점으로 모은다",
  "할인율을 바꾸면 답이 바뀐다",
] as const;

const NOTES = [
  "한 해가 지날 때마다 같은 배율이 한 번씩 더 곱해집니다. 덧셈이 아니라 곱셈의 반복입니다.",
  "미래 금액을 같은 배율로 나누면 오늘의 값이 됩니다. 나누는 횟수는 기다린 햇수만큼입니다.",
  "시점이 다른 금액은 각자의 할인계수로 오늘에 모은 뒤에야 더할 수 있습니다.",
  "같은 현금흐름도 할인율을 올리면 먼 미래의 기여가 빠르게 줄어 합계가 작아집니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const YEARS = [0, 1, 2, 3];
const PV = 100;
const RATE = 0.05;

/** 3년간 매년 40이 들어오는 현금흐름. 장면 3·4가 같은 데이터를 쓴다. */
const FLOWS = [40, 40, 40];

function df(rate: number, t: number) {
  return 1 / (1 + rate) ** t;
}

export default function TimeValueAndDiscountingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;
  const highRate = 0.15;

  return (
    <VizFrame
      eyebrow="시간가치"
      title="같은 금액도 시점이 다르면 다른 값이고, 환산해야 비교됩니다"
      description="앞 두 장면은 한 금액을 옮기는 방향을, 뒤 두 장면은 여러 금액을 모으고 할인율을 바꿔 보는 과정을 보여 줍니다."
      note="금액 단위는 만 원이고 이자율은 계산이 보이도록 고른 값입니다. 특정 상품의 조건이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="미래가치와 현재가치 환산"
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
              <line x1={30} y1={150} x2={450} y2={150} stroke={MUTED} strokeWidth={1} />
              {YEARS.map((year) => (
                <g key={year}>
                  <line x1={40 + year * 130} y1={146} x2={40 + year * 130} y2={154} stroke={MUTED} strokeWidth={1} />
                  <text x={40 + year * 130} y={168} textAnchor="middle" fontSize={9} fill={MUTED}>
                    {year}년
                  </text>
                </g>
              ))}

              {step === 0 &&
                YEARS.map((year) => {
                  const value = PV * (1 + RATE) ** year;
                  const height = value * 0.62;
                  return (
                    <g key={year}>
                      <rect
                        x={22 + year * 130}
                        y={150 - height}
                        width={36}
                        height={height}
                        fill={ACCENT}
                        fillOpacity={0.16}
                        stroke={ACCENT}
                        strokeWidth={1}
                      />
                      <text x={40 + year * 130} y={144 - height} textAnchor="middle" fontSize={9} fontWeight={700} fill={ACCENT}>
                        {value.toFixed(1)}
                      </text>
                      {year > 0 && (
                        <text x={105 + (year - 1) * 130} y={40} textAnchor="middle" fontSize={8} fill={MUTED}>
                          ×1.05
                        </text>
                      )}
                    </g>
                  );
                })}

              {step === 1 && (
                <g>
                  <rect x={412} y={90} width={44} height={36} fill={MUTED} fillOpacity={0.12} stroke={MUTED} strokeWidth={1} />
                  <text x={434} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}>
                    115.8
                  </text>
                  <text x={434} y={84} textAnchor="middle" fontSize={8} fill={MUTED}>
                    3년 뒤 금액
                  </text>

                  <rect x={22} y={90} width={44} height={36} fill={OK} fillOpacity={0.14} stroke={OK} strokeWidth={1} />
                  <text x={44} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                    100.0
                  </text>
                  <text x={44} y={84} textAnchor="middle" fontSize={8} fill={OK}>
                    오늘의 값
                  </text>

                  <line x1={408} y1={108} x2={72} y2={108} stroke={OK} strokeWidth={1} />
                  <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    ÷ 1.05를 세 번
                  </text>
                  <text x={240} y={130} textAnchor="middle" fontSize={8} fill={MUTED}>
                    할인계수 0.8638을 곱하는 것과 같습니다
                  </text>
                </g>
              )}

              {step >= 2 &&
                FLOWS.map((flow, index) => {
                  const year = index + 1;
                  const rate = step === 2 ? RATE : highRate;
                  const present = flow * df(rate, year);
                  const height = flow * 1.5;
                  const presentHeight = present * 1.5;
                  return (
                    <g key={year}>
                      <rect
                        x={22 + year * 130}
                        y={150 - height}
                        width={36}
                        height={height}
                        fill={MUTED}
                        fillOpacity={0.12}
                        stroke={MUTED}
                        strokeWidth={1}
                      />
                      <text x={40 + year * 130} y={144 - height} textAnchor="middle" fontSize={9} fill={MUTED}>
                        {flow}
                      </text>
                      <rect
                        x={22}
                        y={150 - presentHeight - index * 22}
                        width={36}
                        height={presentHeight}
                        fill={step === 2 ? OK : WARN}
                        fillOpacity={0.14}
                        stroke={step === 2 ? OK : WARN}
                        strokeWidth={1}
                      />
                      <text
                        x={66}
                        y={156 - presentHeight - index * 22}
                        fontSize={8}
                        fill={step === 2 ? OK : WARN}
                      >
                        {year}년 → {present.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

              {step >= 2 && (
                <text
                  x={240}
                  y={30}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill={step === 2 ? OK : WARN}
                >
                  할인율 {step === 2 ? "5%" : "15%"} · 현재가치 합계{" "}
                  {FLOWS.reduce((sum, flow, index) => sum + flow * df(step === 2 ? RATE : highRate, index + 1), 0).toFixed(1)}
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
