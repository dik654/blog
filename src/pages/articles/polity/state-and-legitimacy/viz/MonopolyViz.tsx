import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: why-monopoly·protection-or-predation·legitimacy — 흩어진 힘에서 정당성까지 */
const SCENES = [
  "강제력이 여럿이면 끝나지 않는다",
  "한 곳으로 몰려야 분쟁이 멈춘다",
  "몰린 힘은 두 얼굴을 갖는다",
  "정당성이 통치 비용을 낮춘다",
] as const;

const NOTES = [
  "같은 사람이 여러 번 걷히고, 규칙이 충돌해도 어느 쪽이 맞는지 정할 곳이 없습니다.",
  "더 올라갈 데가 없는 자리가 생겨야 다툼이 끝납니다. 좋아서가 아니라 멈출 곳이 필요해서 생기는 구조입니다.",
  "같은 힘이 지켜 주기도 하고 빼앗기도 합니다. 계속 머물 작정이면 다 빼앗지 않는 쪽이 자기에게도 이득입니다.",
  "대부분이 스스로 따르기 때문에 통치가 굴러갑니다. 강제는 나머지 소수를 다루는 장치입니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const RIVALS = [
  { label: "무장집단 A", x: 40, y: 44 },
  { label: "무장집단 B", x: 40, y: 92 },
  { label: "무장집단 C", x: 40, y: 140 },
];

export default function MonopolyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="국가의 성립"
      title="힘이 한 곳에 몰리고, 그 힘이 정당성으로 묶입니다"
      description="앞 두 장면은 왜 몰리는지를, 뒤 두 장면은 몰린 힘이 어떻게 갈리는지를 보여 줍니다."
      note="실제 국가 형성은 지역과 시대마다 경로가 다르며, 이 그림은 이어지는 설명에 필요한 구조만 그렸습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="강제력의 독점과 정당성"
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
                  {RIVALS.map((rival) => (
                    <g key={rival.label}>
                      <rect x={rival.x} y={rival.y} width={96} height={32} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1} />
                      <text x={rival.x + 48} y={rival.y + 20} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                        {rival.label}
                      </text>
                      <line x1={rival.x + 96} y1={rival.y + 16} x2={252} y2={92} stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
                    </g>
                  ))}
                  <rect x={254} y={76} width={96} height={32} fill={MUTED} fillOpacity={0.1} stroke={MUTED} strokeWidth={1} />
                  <text x={302} y={96} textAnchor="middle" fontSize={9} fill={MUTED}>
                    같은 주민
                  </text>
                  <text x={362} y={72} fontSize={9} fontWeight={700} fill={WARN}>
                    세 번 걷힘
                  </text>
                  <text x={362} y={92} fontSize={9} fontWeight={700} fill={WARN}>
                    규칙 충돌
                  </text>
                  <text x={362} y={112} fontSize={9} fontWeight={700} fill={WARN}>
                    최종 판정 없음
                  </text>
                  <text x={40} y={184} fontSize={9} fill={MUTED}>
                    다툼이 끝나지 않으면 모든 거래가 뒤집힐 위험을 안습니다
                  </text>
                </g>
              )}

              {step >= 1 && (
                <g>
                  <rect x={40} y={76} width={120} height={36} fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeWidth={1.25} />
                  <text x={100} y={92} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                    독점된 강제력
                  </text>
                  <text x={100} y={106} textAnchor="middle" fontSize={8} fill={MUTED}>
                    최종 판정자
                  </text>
                </g>
              )}

              {step === 1 && (
                <g>
                  <line x1={160} y1={94} x2={232} y2={94} stroke={ACCENT} strokeWidth={1} />
                  <rect x={234} y={76} width={110} height={36} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                  <text x={289} y={98} textAnchor="middle" fontSize={9} fill={MUTED}>
                    분쟁이 여기서 끝남
                  </text>
                  <text x={40} y={150} fontSize={9} fill={MUTED}>
                    경쟁 부재 · 판정 승복 · 영토 범위, 셋이 함께 있어야 성립합니다
                  </text>
                </g>
              )}

              {step >= 2 && (
                <g>
                  <line x1={160} y1={86} x2={222} y2={56} stroke={OK} strokeWidth={1} />
                  <rect x={224} y={38} width={112} height={34} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1} />
                  <text x={280} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    보호·공공재
                  </text>
                  <text x={280} y={65} textAnchor="middle" fontSize={8} fill={MUTED}>
                    내년에 걷을 것이 늘어남
                  </text>

                  <line x1={160} y1={102} x2={222} y2={134} stroke={WARN} strokeWidth={1} />
                  <rect x={224} y={118} width={112} height={34} fill={WARN} fillOpacity={0.12} stroke={WARN} strokeWidth={1} />
                  <text x={280} y={132} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    약탈
                  </text>
                  <text x={280} y={145} textAnchor="middle" fontSize={8} fill={MUTED}>
                    오늘 다 가져가고 끝
                  </text>

                  <text x={348} y={60} fontSize={8} fill={MUTED}>
                    머물 작정일수록
                  </text>
                  <text x={348} y={140} fontSize={8} fill={MUTED}>
                    떠날 작정일수록
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <rect x={40} y={140} width={396} height={44} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1} />
                  <text x={238} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    자발적으로 따르는 비율이 높을수록 강제에 드는 자원이 줄어듭니다
                  </text>
                  <text x={238} y={174} textAnchor="middle" fontSize={8} fill={MUTED}>
                    다만 그 순응이 동의에서 왔는지 공포에서 왔는지는 이 구조가 구분하지 않습니다
                  </text>
                </g>
              )}

              {step === 2 && (
                <text x={40} y={184} fontSize={9} fill={MUTED}>
                  자기 이익만으로도 최소한의 질서가 나오지만, 그 구간은 조건부입니다
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
