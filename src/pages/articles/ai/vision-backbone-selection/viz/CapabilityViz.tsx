import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: ObjectiveAxes.tsx — 학습 목표별 능력 프로필 */
const SCENES = ["자기지도 계열", "캡션 정렬 계열", "분할 감독 계열", "겹쳐 보기"] as const;
const NOTES = [
  "이미지와 패치의 관계를 학습합니다. 텍스트 정렬은 별도 단계가 없으면 생기지 않습니다.",
  "사진과 문장을 같은 공간에 놓습니다. 문장 질의를 받는 경로에 필요한 능력입니다.",
  "지목한 개념의 마스크를 직접 냅니다. 검색 인코더가 아니라 전체 시스템일 수 있습니다.",
  "서로 다른 출력 계약을 한 점수표에 놓지 않습니다. 이번 상품 검색에는 인코더 두 종류만 남습니다.",
] as const;
const MOBILE_STAGES = [
  { title: "자기지도 인코더", detail: "이미지·패치 관계를 학습" },
  { title: "이미지·텍스트 인코더", detail: "문장과 사진을 정렬" },
  { title: "프롬프트 분할 시스템", detail: "개념의 마스크를 직접 출력" },
  { title: "출력 계약으로 구분", detail: "검색 후보와 분할 시스템을 분리" },
] as const;

const SSL = "#6366f1";
const TXT = "#8b5cf6";
const SEG = "#f59e0b";
const MUTED = "#94a3b8";

const AXES = ["자리별 표현", "이미지 요약", "문장 접근", "마스크 출력"];
const PROFILES = [
  { name: "자기지도", color: SSL, v: [0.92, 0.78, 0.12, 0.55] },
  { name: "이미지·텍스트", color: TXT, v: [0.5, 0.85, 0.9, 0.35] },
  { name: "분할 시스템", color: SEG, v: [0.7, 0.3, 0.35, 0.95] },
];

export default function CapabilityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  const shown = step === 3 ? [0, 1, 2] : [step];
  return (
    <VizFrame
      eyebrow="능력 프로필"
      title="하나가 모든 축에서 높지는 않습니다"
      description="각 계열이 학습 목표로부터 얻은 강점을 네 축으로 비교합니다."
      note="막대 값은 각 논문이 보고한 경향을 정성적으로 요약한 것이며 측정값이 아닙니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="vision-backbone-capability-profile"
        tabIndex={0}
        role="group"
        aria-label="학습 목표별 능력 프로필"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="학습 신호와 출력 계약의 네 장면" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
            {AXES.map((ax, i) => (
              <g key={ax}>
                <text x={20} y={54 + i * 36} fontSize={9} fill={MUTED}>
                  {ax}
                </text>
                <line x1={124} y1={50 + i * 36} x2={440} y2={50 + i * 36} stroke={MUTED} strokeWidth={0.5} />
                {shown.map((pi, k) => {
                  const p = PROFILES[pi];
                  const yOff = step === 3 ? k * 9 - 9 : 0;
                  return (
                    <rect
                      key={p.name}
                      x={124}
                      y={42 + i * 36 + yOff}
                      width={p.v[i] * 312}
                      height={step === 3 ? 8 : 16}
                      fill={p.color}
                      fillOpacity={0.3}
                      stroke={p.color}
                      strokeWidth={1}
                    />
                  );
                })}
              </g>
            ))}
            <g>
              {PROFILES.map((p, i) => (
                <g key={p.name}>
                  <rect x={124 + i * 110} y={186} width={10} height={10} fill={p.color} fillOpacity={0.3} stroke={p.color} strokeWidth={1} />
                  <text x={140 + i * 110} y={195} fontSize={9} fill={p.color}>
                    {p.name}
                  </text>
                </g>
              ))}
            </g>
            <text x={20} y={26} fontSize={9} fill={MUTED}>
              축이 높을수록 얼린 표현에서 그 능력이 강합니다
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
