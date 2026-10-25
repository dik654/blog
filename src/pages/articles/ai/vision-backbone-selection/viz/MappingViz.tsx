import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: TaskMapping.tsx — 질의·출력·자리 정보로 후보를 좁히는 분기 */
const SCENES = ["질의가 무엇인가", "출력이 무엇인가", "자리 정보가 필요한가", "후보 축소"] as const;
const NOTES = [
  "이번 요청은 상품 사진을 입력으로 받습니다. 문장 질의에 필요한 텍스트 정렬은 필수 조건이 아닙니다.",
  "출력은 같은 상품 ID의 순위입니다. 마스크를 직접 내는 분할 시스템은 여기서 빠집니다.",
  "상품 안의 픽셀별 답은 필요하지 않습니다. 이미지 전체 벡터를 내는 인코더 두 종류가 남습니다.",
  "자기지도와 이미지·텍스트 정렬 인코더를 같은 데이터로 잽니다. 이 분기는 후보 축소이지 최종 우열이 아닙니다.",
] as const;
const MOBILE_STAGES = [
  { title: "입력 · 상품 사진", detail: "문장 질의 없음" },
  { title: "출력 · 상품 순위", detail: "마스크 출력 없음" },
  { title: "자리 정보 · 불필요", detail: "이미지 전체 벡터 사용" },
  { title: "후보 · 인코더 2개", detail: "자기지도와 이미지·텍스트 정렬" },
] as const;

const Q = "#6366f1";
const OUT = "#f59e0b";
const POS = "#10b981";
const MUTED = "#94a3b8";

export default function MappingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="후보 좁히기"
      title="세 질문이면 계열이 정해집니다"
      description="과제를 좁히는 순서를 분기로 그렸습니다."
      note="도메인이 학습 분포에서 멀면 이 분기보다 실측이 앞섭니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="vision-backbone-task-mapping"
        tabIndex={0}
        role="group"
        aria-label="과제에서 계열로 가는 분기"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="상품 사진 검색 요청을 좁히는 네 단계" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
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
                  { y: 58, t: "자기지도", c: Q },
                  { y: 104, t: "이미지·텍스트", c: "#8b5cf6" },
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
