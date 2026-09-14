import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·exchange-problem·credit-money — 짝 맞추기 실패에서 세 종류의 빚까지 */
const SCENES = [
  "짝이 맞지 않아 멈춘다",
  "넘기려고 받아 둔다",
  "물건이 약속으로 바뀐다",
  "오늘의 돈은 세 사람의 빚이다",
] as const;

const NOTES = [
  "쌀을 가진 사람이 신발을 원해도, 신발 주인이 쌀을 원하지 않으면 거래가 성립하지 않습니다.",
  "지금 쓸 일이 없어도 남들이 잘 받아 주는 물건을 먼저 받아 두면 두 거래가 이어집니다.",
  "받아 준다는 믿음만 있으면 되므로, 매개는 물건이 아니라 발행자가 갚겠다는 약속이어도 됩니다.",
  "그래서 무엇을 들고 있느냐에 따라 갚아야 할 상대가 달라지고, 떠안는 위험도 달라집니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const HOLDERS = [
  { holder: "가계·기업", asset: "현금", issuer: "중앙은행" },
  { holder: "가계·기업", asset: "예금", issuer: "예금은행" },
  { holder: "예금은행", asset: "지급준비금", issuer: "중앙은행" },
];

export default function MoneyAsAClaimViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="돈의 정체"
      title="교환이 막히는 자리에서 매개가 생기고, 그 매개가 빚으로 옮겨 갑니다"
      description="앞 세 장면은 왜 매개가 필요한지를, 마지막 장면은 오늘의 돈이 각각 누구의 빚인지를 보여 줍니다."
      note="실제 화폐의 등장 과정은 나라마다 다르며, 이 그림은 기능을 설명하기 위한 단순화입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="물물교환의 한계에서 신용화폐까지"
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
                <rect x={20} y={54} width={110} height={40} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeWidth={1} />
                <text x={75} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                  쌀을 가진 사람
                </text>
                <text x={75} y={86} textAnchor="middle" fontSize={8} fill={MUTED}>
                  신발을 원함
                </text>

                <rect x={350} y={54} width={110} height={40} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeWidth={1} />
                <text x={405} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                  신발을 가진 사람
                </text>
                <text x={405} y={86} textAnchor="middle" fontSize={8} fill={MUTED}>
                  생선을 원함
                </text>

                {step === 0 && (
                  <g>
                    <line x1={130} y1={74} x2={350} y2={74} stroke={WARN} strokeWidth={1} strokeDasharray="4 4" />
                    <text x={240} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                      거래 성립 안 함
                    </text>
                    <text x={240} y={110} textAnchor="middle" fontSize={9} fill={MUTED}>
                      필요가 서로 맞물려야 한다 · 욕구의 이중 일치
                    </text>
                  </g>
                )}

                {step >= 1 && (
                  <g>
                    <rect x={195} y={120} width={90} height={34} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                    <text x={240} y={136} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                      {step === 1 ? "소금" : "차용증"}
                    </text>
                    <text x={240} y={148} textAnchor="middle" fontSize={8} fill={MUTED}>
                      {step === 1 ? "넘기려고 받아 둔다" : "발행자가 갚겠다는 약속"}
                    </text>
                    <line x1={130} y1={84} x2={200} y2={122} stroke={OK} strokeWidth={1} />
                    <line x1={280} y1={122} x2={350} y2={84} stroke={OK} strokeWidth={1} />
                    <text x={240} y={176} textAnchor="middle" fontSize={9} fill={step === 2 ? OK : MUTED}>
                      {step === 1
                        ? "쌀 → 소금 → 신발, 두 거래로 나뉜다"
                        : "받아 준다는 믿음만 있으면 물건일 필요가 없다"}
                    </text>
                  </g>
                )}
              </g>
            )}

            {step === 3 && (
              <g>
                <text x={24} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
                  들고 있는 쪽
                </text>
                <text x={180} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
                  무엇을
                </text>
                <text x={320} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
                  갚아야 할 쪽
                </text>
                {HOLDERS.map((row, index) => {
                  const y = 46 + index * 46;
                  return (
                    <g key={row.asset}>
                      <rect x={24} y={y} width={120} height={32} fill="none" stroke={MUTED} strokeWidth={1} />
                      <text x={84} y={y + 20} textAnchor="middle" fontSize={9} fill={MUTED}>
                        {row.holder}
                      </text>

                      <rect x={168} y={y} width={116} height={32} fill={ACCENT} fillOpacity={0.1} stroke={ACCENT} strokeWidth={1} />
                      <text x={226} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                        {row.asset}
                      </text>

                      <line x1={284} y1={y + 16} x2={318} y2={y + 16} stroke={ACCENT} strokeWidth={1} />

                      <rect x={320} y={y} width={136} height={32} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1} />
                      <text x={388} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                        {row.issuer}의 부채
                      </text>
                    </g>
                  );
                })}
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
