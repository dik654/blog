import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 같은 설정에서 대상 크기만 다를 때의 결과 */
const SCENES = ["전신 1MP", "전신 4MP", "얼굴 패널", "무엇이 달랐나"] as const;
const NOTES = [
  "얼굴이 95픽셀입니다. 노이즈 비율 0.25인데도 인물이 다른 사람이 됐습니다.",
  "프레임을 네 배로 키우자 조금 올라갑니다. 방향은 맞지만 여전히 부족합니다.",
  "총 픽셀은 훨씬 적은데 결과는 훨씬 좋습니다. 얼굴이 327픽셀이기 때문입니다.",
  "모델도 프롬프트도 설정도 같습니다. 달라진 것은 대상이 몇 픽셀이냐 하나뿐입니다.",
] as const;

const BAD = "#ef4444";
const MID = "#f59e0b";
const OK = "#10b981";
const MUTED = "#94a3b8";

const CASES = [
  { n: "전신 1MP", face: 95, id: 0.265, c: BAD },
  { n: "전신 4MP", face: 190, id: 0.318, c: MID },
  { n: "얼굴 패널", face: 327, id: 0.531, c: OK },
];

export default function BudgetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="같은 편집이 대상 크기에 따라 갈립니다"
      description="모델·프롬프트·설정을 고정하고 대상 해상도만 바꿨습니다."
      note="정체성은 얼굴 임베딩 코사인이며 판정 임계값 0.40은 별도 글이 정합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="대상 해상도와 정체성 보존"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={22} fontSize={9} fill={MUTED}>
              같은 리파인 설정 · 노이즈 비율 0.25
            </text>
            {CASES.map((c, i) => {
              const on = step === 3 || i === step;
              const col = on ? c.c : MUTED;
              const box = Math.max(14, (c.face / 327) * 44);
              return (
                <g key={c.n}>
                  <rect x={24} y={38 + i * 46} width={110} height={36} fill={col} fillOpacity={on ? 0.1 : 0.04} stroke={col} strokeWidth={on ? 1.25 : 1} />
                  <text x={79} y={60 + i * 46} textAnchor="middle" fontSize={9} fontWeight={700} fill={col}>
                    {c.n}
                  </text>
                  <rect x={148} y={56 + i * 46 - box / 2} width={box} height={box} fill={col} fillOpacity={on ? 0.3 : 0.08} stroke={col} strokeWidth={1} />
                  <text x={148 + box + 8} y={60 + i * 46} fontSize={8} fill={col}>
                    얼굴 {c.face}px
                  </text>
                  <rect x={268} y={48 + i * 46} width={c.id * 180} height={16} fill={col} fillOpacity={on ? 0.28 : 0.08} stroke={col} strokeWidth={1} />
                  <text x={268 + c.id * 180 + 6} y={60 + i * 46} fontSize={9} fontWeight={on ? 700 : 400} fill={col}>
                    {c.id.toFixed(3)}
                  </text>
                </g>
              );
            })}
            <line x1={268 + 0.4 * 180} y1={40} x2={268 + 0.4 * 180} y2={186} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            <text x={268 + 0.4 * 180} y={196} textAnchor="middle" fontSize={8} fill={MUTED}>
              임계 0.40
            </text>
            {step === 3 && (
              <text x={24} y={186} fontSize={9} fontWeight={700} fill={OK}>
                프레임 해상도가 아니라 대상 해상도가 성패를 가릅니다.
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
