import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: CostAndSwitch.tsx — 교체 시 실제로 드는 것 */
const SCENES = ["재색인", "두 벌 운영", "질의 전환", "임계값 재조정"] as const;
const NOTES = [
  "색인 대상 전체를 다시 계산합니다. 설명용 가정으로 1,000만 장·장당 10밀리초면 단일 장비 약 27.8시간입니다.",
  "전환 기간에는 두 색인을 함께 들고 있어야 하므로 단순화한 저장량이 두 배에 가까워집니다.",
  "요청마다 색인 버전과 질의 인코더 지문을 같은 A 또는 B로 묶어야 합니다.",
  "유사도 임계와 규칙이 벡터 분포에 묶여 있다면 사람이 다시 잡아야 합니다.",
] as const;
const MOBILE_STAGES = [
  { title: "새 벡터 계산", detail: "전체 자산을 새 지문으로 재색인" },
  { title: "A·B 동시 보관", detail: "전환 기간의 이중 저장" },
  { title: "요청별 버전 고정", detail: "질의 인코더와 색인을 같은 지문으로" },
  { title: "판정 기준 재조정", detail: "중복 임계·추천 컷오프를 새로 측정" },
] as const;

const OLD = "#94a3b8";
const NEW = "#6366f1";
const WARN = "#f59e0b";
const OK = "#10b981";

export default function SwitchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="교체 비용"
      title="성능 차이가 이 비용을 넘는지가 실제 기준입니다"
      description="백본을 바꿀 때 순서대로 일어나는 일입니다."
      note="시간 추정은 명시한 가정에서의 산술이며 특정 환경의 실측이 아닙니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="vision-backbone-switch"
        tabIndex={0}
        role="group"
        aria-label="백본 교체 절차와 비용"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="백본 교체의 네 단계" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
            <rect x={20} y={44} width={120} height={40} fill={OLD} fillOpacity={0.12} stroke={OLD} strokeWidth={1.25} />
            <text x={80} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={OLD}>
              기존 색인
            </text>
            <text x={80} y={76} textAnchor="middle" fontSize={8} fill={OLD}>
              지문 A
            </text>

            <rect x={20} y={104} width={120} height={40} fill={NEW} fillOpacity={step >= 0 ? 0.12 : 0} stroke={NEW} strokeWidth={1.25} />
            <text x={80} y={122} textAnchor="middle" fontSize={9} fontWeight={700} fill={NEW}>
              새 색인
            </text>
            <text x={80} y={136} textAnchor="middle" fontSize={8} fill={NEW}>
              지문 B
            </text>

            <g>
              <text x={166} y={40} fontSize={9} fontWeight={700} fill={WARN}>
                재색인 진행
              </text>
              <rect x={166} y={48} width={200} height={14} fill="none" stroke={WARN} strokeWidth={1} />
              <rect x={166} y={48} width={[60, 200, 200, 200][step]} height={14} fill={WARN} fillOpacity={0.3} stroke={WARN} strokeWidth={1} />
              <text x={376} y={59} fontSize={8} fill={WARN}>
                ≈ 28시간
              </text>
            </g>

            {step >= 1 && (
              <g>
                <text x={166} y={88} fontSize={9} fontWeight={700} fill={OLD}>
                  저장 비용
                </text>
                <rect x={166} y={96} width={100} height={12} fill={OLD} fillOpacity={0.25} stroke={OLD} strokeWidth={1} />
                <rect x={266} y={96} width={100} height={12} fill={NEW} fillOpacity={0.25} stroke={NEW} strokeWidth={1} />
                <text x={376} y={106} fontSize={8} fill={OLD}>
                  전환 기간 2배
                </text>
              </g>
            )}

            {step >= 2 && (
              <g>
                <rect x={166} y={120} width={200} height={26} fill={step >= 3 ? OK : NEW} fillOpacity={0.1} stroke={step >= 3 ? OK : NEW} strokeWidth={1.25} />
                <text x={266} y={137} textAnchor="middle" fontSize={9} fontWeight={700} fill={step >= 3 ? OK : NEW}>
                  요청마다 질의·색인 지문을 함께 선택
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <rect x={20} y={162} width={440} height={28} fill={WARN} fillOpacity={0.07} stroke={WARN} strokeWidth={1.25} />
                <text x={240} y={180} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  중복 판정·추천 컷오프·알림 조건을 새 분포에 맞춰 다시 결정
                </text>
              </g>
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
