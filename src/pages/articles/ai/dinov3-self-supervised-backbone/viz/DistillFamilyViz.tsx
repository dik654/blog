import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: PostHoc.tsx — 해상도 적응과 증류 계열 */
const SCENES = ["한 번만 크게 학습", "해상도 적응 10k", "증류로 계열 생성", "배포 예산에 맞춰 선택"] as const;

const NOTES = [
  "67억 파라미터 모델을 100만 스텝 학습합니다. 이 비용을 해상도마다 다시 치를 수는 없습니다.",
  "넓은 크롭 512·768과 좁은 크롭 112~336을 섞어 1만 스텝만 더 돌립니다. 기준 역할은 7B가 맡습니다.",
  "7B를 teacher로 두고 학생 모델을 100만 스텝 학습한 뒤 25만 스텝 동안 학습률을 낮춰 마무리합니다.",
  "같은 표현을 준다는 뜻이 아닙니다. 과제별로 얼마나 따라잡는지는 각자 재야 합니다.",
] as const;

const MOBILE_STAGES = [
  { title: "ViT-7B 사전학습", detail: "약 67억 파라미터 · 100만 스텝" },
  { title: "해상도 적응", detail: "여러 크롭 크기로 1만 스텝" },
  { title: "고정 teacher로 증류", detail: "S · S+ · B · L · H+" },
  { title: "과제별로 다시 평가", detail: "크기와 품질의 교환을 실측" },
] as const;

const BIG = "#6366f1";
const SMALL = "#10b981";
const RES = "#f59e0b";
const MUTED = "#94a3b8";

const FAMILY = [
  { name: "ViT-S", size: 21, w: 26 },
  { name: "ViT-S+", size: 29, w: 32 },
  { name: "ViT-B", size: 86, w: 46 },
  { name: "ViT-L", size: 300, w: 66 },
  { name: "ViT-H+", size: 800, w: 86 },
];

export default function DistillFamilyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="사후 단계"
      title="큰 모델 하나에서 배포 계열이 갈라집니다"
      description="파라미터 수는 공개된 값이고 상자 너비는 비교를 위해 압축했습니다."
      note="증류 계열의 과제별 성능 차이는 이 그림이 보여 주지 않습니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="dinov3-post-training"
        tabIndex={0}
        role="group"
        aria-label="해상도 적응과 증류 계열"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="DINOv3 사후 적응과 증류 순서" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
            <rect x={24} y={40} width={110} height={54} fill={BIG} fillOpacity={0.12} stroke={BIG} strokeWidth={1.25} />
            <text x={79} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill={BIG}>
              ViT-7B
            </text>
            <text x={79} y={80} textAnchor="middle" fontSize={9} fill={MUTED}>
              6.7B · 1M 스텝
            </text>

            {step >= 1 && (
              <g>
                <line x1={134} y1={67} x2={166} y2={67} stroke={RES} strokeWidth={1} />
                <rect x={166} y={40} width={132} height={54} fill={RES} fillOpacity={0.1} stroke={RES} strokeWidth={1.25} />
                <text x={232} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={RES}>
                  해상도 적응 10k
                </text>
                <text x={232} y={76} textAnchor="middle" fontSize={8} fill={RES}>
                  global 512·768 / local 112~336
                </text>
              </g>
            )}

            {step >= 2 && (
              <g>
                <text x={24} y={118} fontSize={9} fill={MUTED}>
                  증류 계열
                </text>
                {FAMILY.map((f, i) => {
                  const x = 24 + FAMILY.slice(0, i).reduce((acc, p) => acc + p.w + 14, 0);
                  const on = step >= 2;
                  return (
                    <g key={f.name}>
                      <rect
                        x={x}
                        y={126}
                        width={f.w}
                        height={34}
                        fill={SMALL}
                        fillOpacity={on ? 0.15 : 0}
                        stroke={SMALL}
                        strokeWidth={1}
                      />
                      <text x={x + f.w / 2} y={142} textAnchor="middle" fontSize={8} fontWeight={700} fill={SMALL}>
                        {f.name}
                      </text>
                      <text x={x + f.w / 2} y={154} textAnchor="middle" fontSize={7} fill={MUTED}>
                        {f.size >= 300 ? `${(f.size / 1000).toFixed(1)}B` : `${f.size}M`}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {step === 3 && (
              <text x={24} y={182} fontSize={9} fontWeight={700} fill={MUTED}>
                같은 teacher에서 나왔지만 과제별 따라잡는 정도는 각각 다릅니다
              </text>
            )}
            {step === 2 && (
              <text x={24} y={182} fontSize={9} fill={MUTED}>
                1M 스텝 학습 뒤 250k 스텝 학습률 감쇠
              </text>
            )}
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
