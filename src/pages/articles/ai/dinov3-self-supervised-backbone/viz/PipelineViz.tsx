import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: Overview.tsx — 크롭 생성부터 사후 증류까지의 전체 단계 */
const SCENES = ["크롭이 정답을 만듦", "두 단위로 맞힘", "이른 관계를 다시 붙잡음", "배포용 계열로 확장"] as const;

const NOTES = [
  "사진 한 장에서 넓은 크롭 2장과 좁은 크롭 8장을 만듭니다. 사람이 붙인 라벨 대신 이 장면들의 관계가 학습 신호가 됩니다.",
  "EMA teacher는 넓은 크롭만 보고 목표 분포를 냅니다. student는 이미지 전체의 CLS 분포와 가린 패치 자리의 분포를 함께 맞힙니다.",
  "기본 학습 100만 번 뒤 Gram 손실을 켭니다. 최초 기준은 그때의 모델이 아니라 dense 특성이 좋았던 10만 또는 20만 체크포인트입니다.",
  "큰 모델에 짧은 해상도 적응을 붙이고, 고정한 7B teacher로 작은 모델을 따로 증류합니다. 두 후속 경로는 같은 작업이 아닙니다.",
] as const;

const MOBILE_STAGES = [
  { title: "한 이미지에서 여러 크롭", detail: "넓은 2장 · 좁은 8장" },
  { title: "EMA teacher를 목표로", detail: "이미지 전체 · 가린 패치" },
  { title: "이른 관계를 기준으로", detail: "100k/200k teacher의 Gram 행렬" },
  { title: "해상도 적응과 증류", detail: "큰 모델 하나에서 배포 계열로" },
] as const;

const STUDENT = "#6366f1";
const TEACHER = "#8b5cf6";
const GRAM = "#10b981";
const MUTED = "#94a3b8";

export default function PipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="학습 전체 흐름"
      title="라벨 없는 학습이 네 단계로 나뉩니다"
      description="재생하거나 장면을 고른 뒤, 같은 이미지가 목표·규제·배포 모델로 바뀌는 순서를 따라갑니다."
      note="스텝 수와 체크포인트는 DINOv3 보고서의 설정이며 다른 데이터에서의 권장값이 아닙니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="dinov3-training-path"
        tabIndex={0}
        role="group"
        aria-label="DINOv3 학습 단계"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="DINOv3 학습의 네 단계" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
            <defs>
              <marker id="dinov3-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={MUTED} />
              </marker>
            </defs>
            <rect x={16} y={28} width={64} height={64} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={48} y={104} textAnchor="middle" fontSize={9} fill={MUTED}>
              원본 이미지
            </text>
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={100 + i * 10}
                y={28 + i * 8}
                width={44}
                height={44}
                fill={STUDENT}
                fillOpacity={0.1}
                stroke={STUDENT}
                strokeWidth={1}
              />
            ))}
            <text x={122} y={104} textAnchor="middle" fontSize={9} fill={STUDENT}>
              크롭 여러 장
            </text>

            <line x1={148} y1={60} x2={180} y2={42} stroke={MUTED} strokeWidth={1} markerEnd="url(#dinov3-arrow)" opacity={step >= 1 ? 1 : 0.2} />
            <line x1={148} y1={60} x2={180} y2={80} stroke={MUTED} strokeWidth={1} markerEnd="url(#dinov3-arrow)" opacity={step >= 1 ? 1 : 0.2} />

            <g opacity={step >= 1 ? 1 : 0.16}>
                <rect x={186} y={24} width={80} height={30} fill={STUDENT} fillOpacity={0.1} stroke={STUDENT} strokeWidth={1.25} />
                <text x={226} y={43} textAnchor="middle" fontSize={10} fontWeight={700} fill={STUDENT}>
                  student
                </text>
                <rect x={186} y={66} width={80} height={30} fill={TEACHER} fillOpacity={0.1} stroke={TEACHER} strokeWidth={1.25} />
                <text x={226} y={85} textAnchor="middle" fontSize={10} fontWeight={700} fill={TEACHER}>
                  EMA teacher
                </text>
                <line x1={226} y1={54} x2={226} y2={66} stroke={TEACHER} strokeWidth={1} />
                <text x={272} y={62} fontSize={8} fill={MUTED}>
                  이동평균
                </text>
                <rect x={320} y={24} width={144} height={30} fill="none" stroke={STUDENT} strokeWidth={1} />
                <text x={392} y={43} textAnchor="middle" fontSize={9} fill={STUDENT}>
                  이미지 수준 손실
                </text>
                <rect x={320} y={66} width={144} height={30} fill="none" stroke={STUDENT} strokeWidth={1} />
                <text x={392} y={85} textAnchor="middle" fontSize={9} fill={STUDENT}>
                  패치 수준 손실
                </text>
                <line x1={270} y1={39} x2={314} y2={39} stroke={MUTED} strokeWidth={1} markerEnd="url(#dinov3-arrow)" />
                <line x1={270} y1={81} x2={314} y2={81} stroke={MUTED} strokeWidth={1} markerEnd="url(#dinov3-arrow)" />
            </g>

            <g opacity={step >= 2 ? 1 : 0.16}>
                <rect x={186} y={112} width={278} height={32} fill={GRAM} fillOpacity={0.08} stroke={GRAM} strokeWidth={1.25} />
                <text x={325} y={132} textAnchor="middle" fontSize={10} fontWeight={700} fill={GRAM}>
                  Gram teacher · 패치 유사도 구조 유지
                </text>
                <text x={186} y={158} fontSize={8} fill={GRAM}>
                  Gram loss: 1M 뒤 시작 · 기준: 100k/200k
                </text>
                <line x1={226} y1={100} x2={226} y2={106} stroke={MUTED} strokeWidth={1} markerEnd="url(#dinov3-arrow)" />
            </g>

            <g opacity={step >= 3 ? 1 : 0.16}>
                <rect x={16} y={168} width={214} height={24} fill="none" stroke={MUTED} strokeWidth={1} />
                <text x={123} y={184} textAnchor="middle" fontSize={9} fill={MUTED}>
                  해상도 적응 10k 스텝
                </text>
                <rect x={250} y={168} width={214} height={24} fill="none" stroke={MUTED} strokeWidth={1} />
                <text x={357} y={184} textAnchor="middle" fontSize={9} fill={MUTED}>
                  증류로 작은 계열 생성
                </text>
                <line x1={325} y1={148} x2={325} y2={162} stroke={MUTED} strokeWidth={1} markerEnd="url(#dinov3-arrow)" />
            </g>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
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
