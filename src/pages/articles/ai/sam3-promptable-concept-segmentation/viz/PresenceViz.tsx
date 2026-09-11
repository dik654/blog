import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PresenceHead.tsx — 존재 판단과 위치 판단의 분리 */
const SCENES = ["한 출력이 둘을 맡을 때", "존재 토큰 분리", "개념이 있을 때", "개념이 없을 때"] as const;

const NOTES = [
  "질의 하나가 있음·없음과 자리를 함께 맡으면 두 요구가 서로를 눌러 어느 쪽도 날카로워지지 않습니다.",
  "존재 토큰이 이미지 전체를 보고 있음·없음만 맡습니다. 질의는 있다고 치고 자리만 고릅니다.",
  "존재 확률이 높으면 질의 점수가 그대로 살아 후보들이 남습니다.",
  "존재 확률이 낮으면 모든 질의 점수가 함께 내려가 빈 결과가 됩니다.",
] as const;

const Q = "#6366f1";
const P = "#10b981";
const OFF = "#94a3b8";
const WARN = "#f59e0b";

const QUERIES = [0.82, 0.61, 0.44, 0.2];

export default function PresenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  const presence = step === 3 ? 0.08 : 0.93;
  return (
    <VizFrame
      eyebrow="존재와 위치의 분리"
      title="존재 확률이 모든 질의 점수의 공통 인수가 됩니다"
      description="질의 네 개로 줄인 그림입니다. 막대 길이가 점수입니다."
      note="점수 값은 구조를 보여 주기 위한 예시이며 실제 출력이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="존재 토큰과 질의 점수의 결합"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 ? (
              <g>
                <rect x={40} y={50} width={180} height={90} fill={WARN} fillOpacity={0.08} stroke={WARN} strokeWidth={1.25} />
                <text x={130} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>
                  질의 하나의 출력
                </text>
                <text x={130} y={98} textAnchor="middle" fontSize={9} fill={WARN}>
                  있음·없음 판단
                </text>
                <text x={130} y={116} textAnchor="middle" fontSize={9} fill={WARN}>
                  + 자리 판단
                </text>
                <text x={260} y={82} fontSize={9} fill={OFF}>
                  없는 사진에서는 낮게
                </text>
                <text x={260} y={104} fontSize={9} fill={OFF}>
                  있는 사진에서는 날카롭게
                </text>
                <text x={260} y={134} fontSize={10} fontWeight={700} fill={WARN}>
                  두 요구가 충돌
                </text>
              </g>
            ) : (
              <g>
                <rect x={24} y={40} width={120} height={36} fill={P} fillOpacity={step === 3 ? 0.08 : 0.2} stroke={P} strokeWidth={1.25} />
                <text x={84} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={P}>
                  존재 토큰
                </text>
                <text x={84} y={70} textAnchor="middle" fontSize={9} fill={P}>
                  p = {presence.toFixed(2)}
                </text>

                {QUERIES.map((q, i) => {
                  const y = 96 + i * 24;
                  const final = q * presence;
                  return (
                    <g key={i}>
                      <text x={24} y={y + 10} fontSize={8} fill={OFF}>
                        q{i + 1}
                      </text>
                      <rect x={46} y={y} width={q * 140} height={12} fill={Q} fillOpacity={0.18} stroke={Q} strokeWidth={0.75} />
                      {step >= 2 && (
                        <rect
                          x={220}
                          y={y}
                          width={Math.max(1, final * 140)}
                          height={12}
                          fill={step === 3 ? OFF : P}
                          fillOpacity={0.35}
                          stroke={step === 3 ? OFF : P}
                          strokeWidth={0.75}
                        />
                      )}
                      {step >= 2 && (
                        <text x={220 + Math.max(1, final * 140) + 6} y={y + 10} fontSize={8} fill={step === 3 ? OFF : P}>
                          {final.toFixed(2)}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text x={46} y={92} fontSize={8} fill={Q}>
                  조건부 질의 점수
                </text>
                {step >= 2 && (
                  <text x={220} y={92} fontSize={8} fill={step === 3 ? OFF : P}>
                    최종 점수 = 곱
                  </text>
                )}
                {step === 3 && (
                  <text x={220} y={194} fontSize={9} fontWeight={700} fill={OFF}>
                    전부 임계값 아래 · 빈 결과
                  </text>
                )}
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
