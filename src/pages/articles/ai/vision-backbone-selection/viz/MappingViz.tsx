import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: TaskMapping.tsx — 질의·출력·자리 정보로 후보를 좁히는 분기 */
const SCENES = ["질의가 무엇인가", "출력이 무엇인가", "자리 정보가 필요한가", "후보 확정"] as const;
const NOTES = [
  "입력이 이미지인지 문장인지가 첫 갈림길입니다. 문장이면 정렬된 계열이 필요합니다.",
  "순위를 내놓는지 마스크를 내놓는지가 두 번째입니다. 마스크면 분할 감독 계열입니다.",
  "자리마다 답이 필요한지가 세 번째입니다. 필요하면 자기지도 계열이 유리합니다.",
  "세 질문으로 후보가 한 계열로 줄어듭니다. 도메인이 멀면 실측이 우선입니다.",
] as const;

const Q = "#6366f1";
const OUT = "#f59e0b";
const POS = "#10b981";
const MUTED = "#94a3b8";

export default function MappingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="후보 좁히기"
      title="세 질문이면 계열이 정해집니다"
      description="과제를 좁히는 순서를 분기로 그렸습니다."
      note="도메인이 학습 분포에서 멀면 이 분기보다 실측이 앞섭니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="과제에서 계열로 가는 분기"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={16} y={80} width={88} height={36} fill={Q} fillOpacity={0.12} stroke={Q} strokeWidth={1.25} />
            <text x={60} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill={Q}>
              질의 형태
            </text>
            <text x={60} y={110} textAnchor="middle" fontSize={8} fill={Q}>
              이미지 · 문장
            </text>

            {step >= 1 && (
              <g>
                <line x1={104} y1={98} x2={132} y2={98} stroke={MUTED} strokeWidth={1} />
                <rect x={132} y={80} width={88} height={36} fill={OUT} fillOpacity={0.12} stroke={OUT} strokeWidth={1.25} />
                <text x={176} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill={OUT}>
                  출력 형태
                </text>
                <text x={176} y={110} textAnchor="middle" fontSize={8} fill={OUT}>
                  순위 · 마스크
                </text>
              </g>
            )}

            {step >= 2 && (
              <g>
                <line x1={220} y1={98} x2={248} y2={98} stroke={MUTED} strokeWidth={1} />
                <rect x={248} y={80} width={88} height={36} fill={POS} fillOpacity={0.12} stroke={POS} strokeWidth={1.25} />
                <text x={292} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill={POS}>
                  자리 정보
                </text>
                <text x={292} y={110} textAnchor="middle" fontSize={8} fill={POS}>
                  필요 · 불필요
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <line x1={336} y1={98} x2={360} y2={98} stroke={MUTED} strokeWidth={1} />
                {[
                  { y: 40, t: "캡션 정렬", c: "#8b5cf6" },
                  { y: 84, t: "자기지도", c: Q },
                  { y: 128, t: "분할 감독", c: OUT },
                ].map((r) => (
                  <g key={r.t}>
                    <rect x={360} y={r.y} width={104} height={32} fill={r.c} fillOpacity={0.12} stroke={r.c} strokeWidth={1.25} />
                    <text x={412} y={r.y + 20} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.c}>
                      {r.t}
                    </text>
                  </g>
                ))}
              </g>
            )}
            <text x={16} y={178} fontSize={9} fill={MUTED}>
              {step >= 3 ? "같은 칸이라도 도메인이 멀면 실측이 우선입니다" : "과제를 좁히면 분기가 자동으로 정해집니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
