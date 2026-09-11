import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SeedNull.tsx — 의도 고정 시 시드·묘사가 같은 바닥, 축별 반응 */
const SCENES = ["의도를 고정하면", "인구통계를 풀면", "축별 반응", "안 움직이는 축"] as const;
const NOTES = [
  "서른 번 시도해 채택된 새 인물이 한 명입니다. 축 샘플링과 시드 변경이 같은 값입니다.",
  "나이와 성별과 체형을 함께 흔들면 66쌍 중 27쌍이 다른 인물로 나옵니다.",
  "길이 축은 노이즈 바닥의 네다섯 배로 반응하고 너비 축은 노이즈 수준에서 멈춥니다.",
  "3차원 형태 제어에서도 안 움직이던 축이 바로 이 너비 축이었습니다.",
] as const;

const NULL = "#ef4444";
const OK = "#10b981";
const MID = "#f59e0b";
const MUTED = "#94a3b8";

export default function SeedViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="축별 기여"
      title="어떤 축이 듣고 어떤 축이 멈추는가"
      description="의도를 고정했을 때와 풀었을 때를 나눠 봅니다."
      note="채택 기준은 별도 글이 정한 임계값을 씁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="다양성 축별 기여"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  의도 고정 · 서른 번 시도 · 채택된 새 인물
                </text>
                {[
                  { n: "서술 축 샘플링", v: 1 },
                  { n: "시드만 변경 · 계열 A", v: 1 },
                  { n: "시드만 변경 · 계열 B", v: 1 },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={44 + i * 40} width={190} height={30} fill={NULL} fillOpacity={0.1} stroke={NULL} strokeWidth={1.25} />
                    <text x={119} y={64 + i * 40} textAnchor="middle" fontSize={9} fontWeight={700} fill={NULL}>
                      {r.n}
                    </text>
                    <text x={240} y={64 + i * 40} fontSize={10} fontWeight={700} fill={NULL}>
                      {r.v} / 30
                    </text>
                  </g>
                ))}
                <text x={24} y={182} fontSize={9} fontWeight={700} fill={NULL}>
                  축 샘플링이 시드 노이즈보다 나은 것이 하나도 없습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  나이·성별·체형을 함께 흔든 열두 묘사
                </text>
                <rect x={24} y={48} width={432} height={40} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                <rect x={24} y={48} width={(27 / 66) * 432} height={40} fill={OK} fillOpacity={0.3} stroke={OK} strokeWidth={1.25} />
                <text x={112} y={73} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                  27쌍 다른 인물
                </text>
                <text x={330} y={73} textAnchor="middle" fontSize={9} fill={MUTED}>
                  전체 66쌍
                </text>
                <text x={24} y={124} fontSize={9} fontWeight={700} fill={OK}>
                  텍스트가 무력한 것이 아닙니다. 어떤 축에서만 듣는 것입니다.
                </text>
                <text x={24} y={148} fontSize={8} fill={MUTED}>
                  나이 지시도 잘 따라옵니다 — 평균 오차 열 살가량이지만 부호가 일정해 보정 가능합니다.
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  형태 지표의 변동 폭 · 묘사 대 시드 노이즈 바닥
                </text>
                {[
                  { n: "얼굴 세로 / 가로", t: 15.6, n1: 3.7, n2: 2.5, good: true },
                  { n: "얼굴 폭", t: 3.5, n1: 4.6, n2: 4.6, good: false },
                  { n: "광대폭 / 턱폭", t: 3.8, n1: 3.1, n2: 4.0, good: false },
                ].map((r, i) => (
                  <g key={r.n}>
                    <text x={110} y={52 + i * 40} textAnchor="end" fontSize={9} fontWeight={700} fill={r.good ? OK : NULL}>
                      {r.n}
                    </text>
                    <rect x={118} y={40 + i * 40} width={(r.t / 18) * 220} height={13} fill={r.good ? OK : NULL} fillOpacity={0.3} stroke={r.good ? OK : NULL} strokeWidth={1} />
                    <text x={118 + (r.t / 18) * 220 + 6} y={50 + i * 40} fontSize={8} fontWeight={700} fill={r.good ? OK : NULL}>
                      {r.t.toFixed(1)}%
                    </text>
                    <rect x={118} y={55 + i * 40} width={(r.n1 / 18) * 220} height={8} fill={MUTED} fillOpacity={0.3} stroke={MUTED} strokeWidth={1} />
                    <text x={118 + (r.n1 / 18) * 220 + 6} y={63 + i * 40} fontSize={7} fill={MUTED}>
                      노이즈 {r.n1.toFixed(1)}%
                    </text>
                  </g>
                ))}
                {step === 2 && (
                  <text x={24} y={180} fontSize={9} fontWeight={700} fill={MID}>
                    길이 축은 말로 조절되고 너비 축은 되지 않습니다.
                  </text>
                )}
                {step === 3 && (
                  <g>
                    <text x={24} y={172} fontSize={9} fontWeight={700} fill={NULL}>
                      3차원 형태로 골격을 직접 제어하려던 시도에서도 안 움직이던 축이 이것입니다.
                    </text>
                    <text x={24} y={192} fontSize={8} fill={MUTED}>
                      두 경로 모두에서 멈춘다면 모델이 그 축의 제어를 배우지 않았다는 쪽에 무게가 실립니다.
                    </text>
                  </g>
                )}
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
