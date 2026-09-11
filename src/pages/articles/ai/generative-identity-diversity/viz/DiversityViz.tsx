import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 같은 질문에 대한 세 번의 답과 각각이 틀린 이유 */
const SCENES = ["첫째 답", "둘째 답", "셋째 답", "지금 답"] as const;
const NOTES = [
  "\"모델당 한 명\" — 그 실험은 프롬프트를 고정한 채 시드만 돌린 것이었습니다.",
  "\"프롬프트당 한 명\" — 여섯 명은 열다섯 쌍이라 10퍼센트 충돌률을 볼 수 없습니다.",
  "\"묘사 일흔두 개가 실질적으로 여섯 개\" — 증류된 가중치에서 잰 것이었습니다.",
  "정체성은 조건의 함수이고 사상은 다대일입니다. 프롬프트 > 모델 > 시드, 그리고 가중치가 범위를 정합니다.",
] as const;

const A1 = "#ef4444";
const A2 = "#f59e0b";
const A3 = "#8b5cf6";
const OK = "#10b981";
const MUTED = "#94a3b8";

const ANSWERS = [
  { n: "모델당 한 명", why: "프롬프트를 고정한 채 시드만 돌림", c: A1 },
  { n: "프롬프트당 한 명", why: "여섯 명 열다섯 쌍으로는 충돌률이 안 보임", c: A2 },
  { n: "묘사 72개가 실질 6개", why: "증류된 가중치에서 측정", c: A3 },
];

export default function DiversityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="같은 질문에 세 번 답했고 매번 다음 측정이 뒤집었습니다"
      description="결론보다 뒤집힌 과정이 더 쓸모 있는 기록입니다."
      note="수치는 한 장비·특정 모델 조합의 실측입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="다양성 질문에 대한 세 번의 정정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={22} fontSize={9} fill={MUTED}>
              서로 다른 인물을 원하는 만큼 만들려면 무엇을 흔들어야 하는가
            </text>
            {ANSWERS.map((a, i) => {
              const on = step >= i;
              const cur = step === i;
              const c = on ? a.c : MUTED;
              return (
                <g key={a.n}>
                  <rect x={24} y={36 + i * 42} width={186} height={32} fill={c} fillOpacity={cur ? 0.16 : on ? 0.06 : 0.03} stroke={c} strokeWidth={cur ? 1.25 : 1} />
                  <text x={117} y={56 + i * 42} textAnchor="middle" fontSize={9} fontWeight={cur ? 700 : 400} fill={c}>
                    {a.n}
                  </text>
                  {on && (
                    <g>
                      <line x1={210} y1={52 + i * 42} x2={236} y2={52 + i * 42} stroke={c} strokeWidth={1} strokeDasharray="3 2" />
                      <text x={242} y={56 + i * 42} fontSize={8} fill={c}>
                        {a.why}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {step === 3 && (
              <g>
                <rect x={24} y={166} width={432} height={30} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1.25} />
                <text x={240} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  프롬프트 &gt; 모델 &gt; 시드 · 그리고 가중치가 프롬프트의 도달 범위를 정합니다
                </text>
              </g>
            )}
            {step < 3 && (
              <text x={24} y={186} fontSize={8} fill={MUTED}>
                {step === 0
                  ? "고정해 둔 변수가 실제 변수를 가렸습니다."
                  : step === 1
                    ? "표본이 작으면 충돌이 0으로 보입니다. 0이라는 뜻이 아니라 못 본다는 뜻입니다."
                    : "측정 도구가 아니라 측정 대상이 능력을 억누르고 있었습니다."}
              </text>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
