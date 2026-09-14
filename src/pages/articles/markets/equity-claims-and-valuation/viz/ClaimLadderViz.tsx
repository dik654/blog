import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·residual-claim·leverage — 순위와 유한책임이 만드는 비대칭 */
const SCENES = [
  "회사 가치가 넉넉할 때",
  "가치가 줄어들 때",
  "부채에 못 미칠 때",
  "주주 몫만 따로 그리면",
] as const;

const NOTES = [
  "앞 순위가 먼저 받고 남는 것이 주주 몫입니다. 회사가 잘되면 그 몫이 그대로 커집니다.",
  "회사 가치가 줄면 앞 순위는 그대로 받고 주주 몫부터 깎입니다. 같은 변화가 주주 쪽에서 더 크게 나타납니다.",
  "부채에 못 미치면 주주 몫은 0이고, 유한책임 때문에 0보다 아래로는 내려가지 않습니다.",
  "그래서 주주의 몫은 아래가 막히고 위는 열린 꺾인 선이 됩니다. 이 비대칭이 행동까지 바꿉니다.",
] as const;

const SENIOR = "#94a3b8";
const EQUITY = "#6366f1";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 단위는 억 원. 선순위(채권 등) 청구액은 60으로 고정. */
const SENIOR_CLAIM = 60;
const FIRM_VALUES = [100, 75, 40];

export default function ClaimLadderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;
  const firmValue = FIRM_VALUES[Math.min(step, 2)];
  const seniorPaid = Math.min(firmValue, SENIOR_CLAIM);
  const equityPaid = Math.max(firmValue - SENIOR_CLAIM, 0);

  return (
    <VizFrame
      eyebrow="청구권 순위"
      title="앞 순위가 먼저 받고, 주주는 남는 것을 받습니다"
      description="같은 회사 가치 변화가 주주 몫에서 훨씬 크게 나타나는 이유가 이 순서에 있습니다."
      note="단위는 억 원이고 선순위 청구액 60은 구조를 보이기 위한 예시입니다. 실제로는 세금·임금 등 더 앞선 순위가 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="청구권 순위와 주주 몫"
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
              {step <= 2 && (
                <g>
                  <text x={70} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                    회사 가치 {firmValue}
                  </text>
                  <rect
                    x={30}
                    y={170 - firmValue * 1.25}
                    width={80}
                    height={firmValue * 1.25}
                    fill={MUTED}
                    fillOpacity={0.1}
                    stroke={MUTED}
                    strokeWidth={1}
                  />

                  <text x={230} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                    누가 얼마를 받는가
                  </text>
                  <rect
                    x={190}
                    y={170 - seniorPaid * 1.25}
                    width={80}
                    height={seniorPaid * 1.25}
                    fill={SENIOR}
                    fillOpacity={0.18}
                    stroke={SENIOR}
                    strokeWidth={1}
                  />
                  <text x={230} y={170 - (seniorPaid * 1.25) / 2} textAnchor="middle" fontSize={9} fontWeight={700} fill={SENIOR}>
                    선순위 {seniorPaid}
                  </text>
                  {equityPaid > 0 && (
                    <g>
                      <rect
                        x={190}
                        y={170 - firmValue * 1.25}
                        width={80}
                        height={equityPaid * 1.25}
                        fill={EQUITY}
                        fillOpacity={0.2}
                        stroke={EQUITY}
                        strokeWidth={1}
                      />
                      <text
                        x={230}
                        y={174 - (firmValue + SENIOR_CLAIM) * 0.625}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={700}
                        fill={EQUITY}
                      >
                        주주 {equityPaid}
                      </text>
                    </g>
                  )}
                  <line x1={30} y1={170 - SENIOR_CLAIM * 1.25} x2={290} y2={170 - SENIOR_CLAIM * 1.25} stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={296} y={173 - SENIOR_CLAIM * 1.25} fontSize={8} fill={WARN}>
                    선순위 청구액 {SENIOR_CLAIM}
                  </text>

                  <text x={310} y={60} fontSize={9} fill={MUTED}>
                    회사 가치 {FIRM_VALUES[0]} → {firmValue}
                  </text>
                  <text x={310} y={78} fontSize={9} fontWeight={700} fill={step === 2 ? WARN : EQUITY}>
                    주주 몫 {FIRM_VALUES[0] - SENIOR_CLAIM} → {equityPaid}
                  </text>
                  <text x={310} y={98} fontSize={8} fill={MUTED}>
                    {step === 0
                      ? "여기서 시작합니다"
                      : step === 1
                        ? "회사는 25% 줄었는데 주주 몫은 62% 줄었습니다"
                        : "주주 몫은 0이고 더 내려가지 않습니다"}
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <line x1={40} y1={170} x2={452} y2={170} stroke={MUTED} strokeWidth={1} />
                  <line x1={40} y1={30} x2={40} y2={170} stroke={MUTED} strokeWidth={1} />
                  <text x={452} y={188} textAnchor="end" fontSize={8} fill={MUTED}>
                    회사 가치
                  </text>
                  <text x={44} y={26} fontSize={8} fill={MUTED}>
                    주주 몫
                  </text>
                  <line x1={40} y1={170} x2={40 + SENIOR_CLAIM * 3.2} y2={170} stroke={WARN} strokeWidth={1.25} />
                  <line
                    x1={40 + SENIOR_CLAIM * 3.2}
                    y1={170}
                    x2={452}
                    y2={170 - (452 - 40 - SENIOR_CLAIM * 3.2) * 0.42}
                    stroke={EQUITY}
                    strokeWidth={1.25}
                  />
                  <line x1={40 + SENIOR_CLAIM * 3.2} y1={170} x2={40 + SENIOR_CLAIM * 3.2} y2={178} stroke={MUTED} strokeWidth={1} />
                  <text x={40 + SENIOR_CLAIM * 3.2} y={190} textAnchor="middle" fontSize={8} fill={MUTED}>
                    부채 {SENIOR_CLAIM}
                  </text>
                  <text x={70} y={160} fontSize={9} fontWeight={700} fill={WARN}>
                    0에서 막힘
                  </text>
                  <text x={300} y={72} fontSize={9} fontWeight={700} fill={EQUITY}>
                    위는 한도 없음
                  </text>
                  <text x={130} y={54} fontSize={8} fill={MUTED}>
                    아래가 막혀 있으면 위험한 선택이 주주에게 유리해집니다
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
