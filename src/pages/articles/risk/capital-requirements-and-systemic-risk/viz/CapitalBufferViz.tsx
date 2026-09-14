import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: loss-absorption·rwa — 자본이 손실을 먼저 받고, 요구량은 위험에 비례한다 */
const SCENES = [
  "손실이 나면 자본부터 깎인다",
  "자본을 다 쓰면 예금자 차례다",
  "같은 자산 100억이 같지 않다",
  "그래서 분모를 위험으로 바꾼다",
] as const;

const NOTES = [
  "자산이 5% 깎여도 자본이 8%라면 손실은 전부 주주 몫이고 예금자는 온전합니다.",
  "자본을 다 쓰고 나면 그다음 손실부터 예금자와 다른 채권자의 몫이 깎입니다.",
  "국채와 신용대출은 같은 금액이라도 깎일 가능성이 다릅니다. 금액만 보면 이 차이가 안 보입니다.",
  "금액에 위험 가중치를 곱해 더한 값을 분모로 쓰면, 요구 자본이 크기가 아니라 위험에 비례하게 됩니다.",
] as const;

const EQUITY = "#10b981";
const DEPOSIT = "#6366f1";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const ASSETS = 100;
const CAPITAL = 8;
const LOSSES = [5, 14];

/** 3·4장면에서 비교할 두 자산 구성 */
const MIXES = [
  { label: "국채 50 + 기업대출 50", rwa: 50 },
  { label: "전부 기업대출 100", rwa: 100 },
];

export default function CapitalBufferViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;
  const loss = step <= 1 ? LOSSES[step] : 0;
  const equityLeft = Math.max(CAPITAL - loss, 0);
  const depositorLoss = Math.max(loss - CAPITAL, 0);
  const scale = 3.4;

  return (
    <VizFrame
      eyebrow="자본과 위험가중"
      title="자본은 손실을 먼저 받는 층이고, 요구량은 위험이 정합니다"
      description="앞 두 장면은 손실이 배분되는 순서를, 뒤 두 장면은 같은 금액이 왜 같은 요구를 낳지 않는지를 보여 줍니다."
      note="자산 100·자본 8과 가중치 0·100%는 계산이 보이도록 고른 예시이며 특정 은행이나 규제 수준이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="자본의 손실 흡수와 위험가중자산"
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
              {step <= 1 && (
                <g>
                  <text x={24} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    자산 {ASSETS} · 자본 {CAPITAL} · 손실 {loss}
                  </text>

                  <rect x={24} y={44} width={(ASSETS - CAPITAL) * scale} height={34} fill={DEPOSIT} fillOpacity={0.14} stroke={DEPOSIT} strokeWidth={1} />
                  <text x={24 + ((ASSETS - CAPITAL) * scale) / 2} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill={DEPOSIT}>
                    예금·차입 {ASSETS - CAPITAL}
                  </text>
                  <rect x={24 + (ASSETS - CAPITAL) * scale} y={44} width={CAPITAL * scale} height={34} fill={EQUITY} fillOpacity={0.18} stroke={EQUITY} strokeWidth={1} />
                  <text x={24 + (ASSETS - CAPITAL + CAPITAL / 2) * scale} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={EQUITY}>
                    자본 {CAPITAL}
                  </text>

                  <text x={24} y={106} fontSize={9} fontWeight={700} fill={MUTED}>
                    손실 배분
                  </text>
                  <rect x={24} y={116} width={(ASSETS - CAPITAL - depositorLoss) * scale} height={30} fill={DEPOSIT} fillOpacity={0.14} stroke={DEPOSIT} strokeWidth={1} />
                  {depositorLoss > 0 && (
                    <g>
                      <rect x={24 + (ASSETS - CAPITAL - depositorLoss) * scale} y={116} width={depositorLoss * scale} height={30} fill={WARN} fillOpacity={0.2} stroke={WARN} strokeWidth={1} />
                      <text x={24 + (ASSETS - CAPITAL - depositorLoss / 2) * scale} y={136} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                        −{depositorLoss}
                      </text>
                    </g>
                  )}
                  {equityLeft > 0 && (
                    <rect x={24 + (ASSETS - CAPITAL) * scale} y={116} width={equityLeft * scale} height={30} fill={EQUITY} fillOpacity={0.18} stroke={EQUITY} strokeWidth={1} />
                  )}
                  <rect
                    x={24 + (ASSETS - CAPITAL + equityLeft) * scale}
                    y={116}
                    width={(CAPITAL - equityLeft) * scale}
                    height={30}
                    fill={WARN}
                    fillOpacity={0.12}
                    stroke={WARN}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />

                  <text x={24} y={170} fontSize={9} fill={step === 0 ? EQUITY : WARN}>
                    {step === 0
                      ? `자본 ${CAPITAL} 가운데 ${loss}만 깎이고 예금자 몫은 그대로입니다`
                      : `자본 ${CAPITAL}을 다 쓰고 ${depositorLoss}이 예금자 몫에서 깎입니다`}
                  </text>
                </g>
              )}

              {step >= 2 && (
                <g>
                  <text x={24} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    자본 {CAPITAL}으로 같은 자산 {ASSETS}을 담은 두 경우
                  </text>
                  {MIXES.map((mix, index) => {
                    const y = 48 + index * 62;
                    const ratio = (CAPITAL / mix.rwa) * 100;
                    return (
                      <g key={mix.label}>
                        <text x={24} y={y} fontSize={9} fill={MUTED}>
                          {mix.label}
                        </text>
                        <rect x={24} y={y + 8} width={ASSETS * scale} height={16} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                        <text x={24 + ASSETS * scale + 8} y={y + 20} fontSize={8} fill={MUTED}>
                          금액 {ASSETS}
                        </text>
                        {step === 3 && (
                          <g>
                            <rect x={24} y={y + 28} width={mix.rwa * scale} height={16} fill={WARN} fillOpacity={0.16} stroke={WARN} strokeWidth={1} />
                            <text x={24 + mix.rwa * scale + 8} y={y + 40} fontSize={9} fontWeight={700} fill={WARN}>
                              위험가중 {mix.rwa} · 비율 {ratio.toFixed(0)}%
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                  <text x={24} y={186} fontSize={9} fill={step === 3 ? WARN : MUTED}>
                    {step === 2
                      ? "금액만 보면 두 은행이 똑같아 보입니다"
                      : "같은 자본인데 요구를 견디는 정도가 두 배 차이가 납니다"}
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
