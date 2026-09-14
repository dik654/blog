import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·deposit-creation — 같은 대출을 두 그림이 다르게 예측한다 */
const SCENES = [
  "장부 한 장을 먼저 본다",
  "중개자 그림의 예측",
  "실제로 적히는 분개",
  "그래서 통화량이 따라 움직인다",
] as const;

const NOTES = [
  "왼쪽은 은행이 받을 것, 오른쪽은 갚을 것입니다. 예금은 자산이 아니라 부채입니다.",
  "예금을 빌려준다는 설명이 맞다면 기존 예금이 줄고 차주 예금이 늘어 총예금은 그대로여야 합니다.",
  "실제로는 기존 예금이 줄지 않고 대출채권과 새 예금이 함께 늘어납니다. 총예금이 커집니다.",
  "만들 때 늘고 갚을 때 주는 구조라, 통화량은 대출 잔액을 따라 움직입니다.",
] as const;

const ASSET = "#6366f1";
const LIAB = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 단위는 억 원. 기존 예금 92, 자본 8에서 시작해 대출 10을 실행한다. */
const BASE = { loans: 70, reserves: 30, deposits: 92, equity: 8 };
const NEW_LOAN = 10;

export default function BalanceSheetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;

  const loans = step >= 2 ? BASE.loans + NEW_LOAN : BASE.loans;
  const deposits =
    step === 1 ? BASE.deposits : step >= 2 ? BASE.deposits + NEW_LOAN : BASE.deposits;
  const totalAssets = loans + BASE.reserves;
  const scale = 1.05;

  return (
    <VizFrame
      eyebrow="은행 대차대조표"
      title="같은 대출 한 건을 두 설명이 서로 다르게 예측합니다"
      description="어느 설명이 맞는지는 의견이 아니라 장부에 무엇이 적히는지로 갈립니다."
      note="단위는 억 원이고 숫자는 구조가 보이도록 고른 예시입니다. 실제 은행의 자산 구성은 이보다 훨씬 다양합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="대출이 예금을 만드는 분개"
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
              <text x={70} y={24} textAnchor="middle" fontSize={9} fontWeight={700} fill={ASSET}>
                자산 · 받을 것
              </text>
              <text x={230} y={24} textAnchor="middle" fontSize={9} fontWeight={700} fill={LIAB}>
                부채 · 갚을 것
              </text>

              <rect x={20} y={34} width={100} height={loans * scale} fill={ASSET} fillOpacity={0.16} stroke={ASSET} strokeWidth={1} />
              <text x={70} y={34 + (loans * scale) / 2} textAnchor="middle" fontSize={10} fontWeight={700} fill={ASSET}>
                대출채권 {loans}
              </text>

              <rect
                x={20}
                y={34 + loans * scale}
                width={100}
                height={BASE.reserves * scale}
                fill={ASSET}
                fillOpacity={0.06}
                stroke={ASSET}
                strokeWidth={1}
              />
              <text x={70} y={34 + loans * scale + (BASE.reserves * scale) / 2 + 3} textAnchor="middle" fontSize={9} fill={ASSET}>
                지급준비금 {BASE.reserves}
              </text>

              <rect x={180} y={34} width={100} height={deposits * scale} fill={LIAB} fillOpacity={0.16} stroke={LIAB} strokeWidth={1} />
              <text x={230} y={34 + (deposits * scale) / 2} textAnchor="middle" fontSize={10} fontWeight={700} fill={LIAB}>
                예금 {deposits}
              </text>

              <rect
                x={180}
                y={34 + deposits * scale}
                width={100}
                height={BASE.equity * scale}
                fill={LIAB}
                fillOpacity={0.06}
                stroke={LIAB}
                strokeWidth={1}
              />
              <line
                x1={280}
                y1={34 + deposits * scale + (BASE.equity * scale) / 2}
                x2={292}
                y2={34 + deposits * scale + (BASE.equity * scale) / 2}
                stroke={LIAB}
                strokeWidth={1}
              />
              <text x={296} y={37 + deposits * scale + (BASE.equity * scale) / 2} fontSize={8} fill={LIAB}>
                자기자본 {BASE.equity}
              </text>

              {step === 1 && (
                <g>
                  <text x={300} y={60} fontSize={9} fontWeight={700} fill={WARN}>
                    예측: 누군가의 예금 10 감소
                  </text>
                  <text x={300} y={76} fontSize={9} fill={WARN}>
                    차주 예금 10 증가
                  </text>
                  <text x={300} y={96} fontSize={10} fontWeight={700} fill={WARN}>
                    총예금 {BASE.deposits} · 변화 없음
                  </text>
                  <text x={300} y={116} fontSize={8} fill={MUTED}>
                    이 예측대로면 통화량은 그대로여야 합니다
                  </text>
                </g>
              )}

              {step >= 2 && (
                <g>
                  <text x={300} y={60} fontSize={9} fontWeight={700} fill={ASSET}>
                    자산 대출채권 +{NEW_LOAN}
                  </text>
                  <text x={300} y={76} fontSize={9} fontWeight={700} fill={LIAB}>
                    부채 예금 +{NEW_LOAN} (같은 순간)
                  </text>
                  <text x={300} y={96} fontSize={10} fontWeight={700} fill={LIAB}>
                    총예금 {deposits} · 통화량 증가
                  </text>
                  <text x={300} y={116} fontSize={8} fill={MUTED}>
                    기존 예금은 한 푼도 줄지 않았습니다
                  </text>
                  <text x={300} y={136} fontSize={8} fill={MUTED}>
                    자산 {totalAssets} − 부채 {deposits} = 자본 {BASE.equity}
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <rect x={296} y={148} width={168} height={34} fill={LIAB} fillOpacity={0.08} stroke={LIAB} strokeWidth={1} />
                  <text x={380} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill={LIAB}>
                    상환하면 양쪽이 함께 감소
                  </text>
                  <text x={380} y={175} textAnchor="middle" fontSize={8} fill={MUTED}>
                    통화량이 대출 잔액을 따라간다
                  </text>
                </g>
              )}

              {step === 0 && (
                <text x={300} y={70} fontSize={9} fill={MUTED}>
                  자산 − 부채 = 자기자본
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
