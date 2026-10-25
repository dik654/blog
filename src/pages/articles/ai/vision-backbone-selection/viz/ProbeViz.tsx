import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: MeasureFirst.tsx — 조건을 맞춘 실측과 맞추지 않은 실측의 차이 */
const SCENES = ["조건이 다른 비교", "조건을 맞춘 비교", "세 숫자 확보", "감점 반영"] as const;
const NOTES = [
  "해상도와 풀링이 다르면 백본 차이가 아니라 설정 차이를 재게 됩니다.",
  "전처리·풀링·정규화를 같게 두면 그제야 표현 자체가 비교됩니다.",
  "상품 recall과 촬영 변형 민감도, 목표 장비의 지연과 메모리를 후보마다 얻습니다.",
  "사전에 정한 감점 규칙을 적용하면 최고 recall과 최종 선택이 다를 수 있습니다.",
] as const;
const MOBILE_STAGES = [
  { title: "잘못된 비교", detail: "해상도·풀링이 서로 다름" },
  { title: "고정 조건 비교", detail: "데이터·전처리·정규화 동일" },
  { title: "서비스 지표 확보", detail: "recall · 견고성 · 지연 · 메모리" },
  { title: "규칙으로 판정", detail: "최소 개선 폭과 배포 한도 적용" },
] as const;

const A = "#6366f1";
const B = "#8b5cf6";
const BAD = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

export default function ProbeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  const cand = [
    { name: "후보 A", color: A, acc: step === 0 ? 0.82 : 0.74, rho: 0.55, cost: 1.0 },
    { name: "후보 B", color: B, acc: step === 0 ? 0.68 : 0.71, rho: 0.22, cost: 0.6 },
  ];
  const score = (c: (typeof cand)[number]) => c.acc - 0.15 * c.rho - 0.1 * c.cost;
  return (
    <VizFrame
      eyebrow="최소 실측"
      title="조건을 맞추지 않으면 설정을 비교하게 됩니다"
      description="후보 두 개를 같은 데이터로 재는 과정을 단계별로 봅니다."
      note="숫자는 절차를 보여 주기 위한 예시이며 특정 모델의 측정값이 아닙니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="vision-backbone-probe"
        tabIndex={0}
        role="group"
        aria-label="백본 후보 실측"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="후보 백본 비교의 네 장면" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
            <text x={20} y={28} fontSize={9} fontWeight={700} fill={step === 0 ? BAD : OK}>
              {step === 0 ? "해상도 336 vs 224 · 풀링 CLS vs 평균" : "전처리·풀링·정규화 동일"}
            </text>
            {cand.map((c, i) => {
              const y = 46 + i * 62;
              return (
                <g key={c.name}>
                  <text x={20} y={y + 12} fontSize={9} fontWeight={700} fill={c.color}>
                    {c.name}
                  </text>
                  <rect x={86} y={y} width={c.acc * 200} height={14} fill={c.color} fillOpacity={0.3} stroke={c.color} strokeWidth={1} />
                  <text x={86 + c.acc * 200 + 6} y={y + 11} fontSize={8} fill={c.color}>
                    성능 {c.acc.toFixed(2)}
                  </text>
                  {step >= 2 && (
                    <g>
                      <rect x={86} y={y + 18} width={c.rho * 200} height={10} fill={BAD} fillOpacity={0.25} stroke={BAD} strokeWidth={0.75} />
                      <text x={86 + c.rho * 200 + 6} y={y + 27} fontSize={8} fill={BAD}>
                        변형 민감도 {c.rho.toFixed(2)}
                      </text>
                      <rect x={86} y={y + 32} width={c.cost * 120} height={10} fill={MUTED} fillOpacity={0.25} stroke={MUTED} strokeWidth={0.75} />
                      <text x={86 + c.cost * 120 + 6} y={y + 41} fontSize={8} fill={MUTED}>
                        비용 ×{c.cost.toFixed(1)}
                      </text>
                    </g>
                  )}
                  {step >= 3 && (
                    <g>
                      <rect x={330} y={y} width={130} height={26} fill={score(c) > 0.6 ? OK : MUTED} fillOpacity={0.12} stroke={score(c) > 0.6 ? OK : MUTED} strokeWidth={1.25} />
                      <text x={395} y={y + 17} textAnchor="middle" fontSize={9} fontWeight={700} fill={score(c) > 0.6 ? OK : MUTED}>
                        S = {score(c).toFixed(2)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {step === 3 && (
              <text x={20} y={186} fontSize={9} fontWeight={700} fill={OK}>
                감점을 반영하면 성능이 낮던 후보가 앞설 수 있습니다
              </text>
            )}
            {step === 1 && (
              <text x={20} y={186} fontSize={9} fill={OK}>
                조건을 맞추자 두 후보의 격차가 줄었습니다
              </text>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
