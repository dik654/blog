import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: GramAnchoring.tsx — 정규화 → 유사도 행렬 → 차이 → 손실 */
const SCENES = ["패치 특징 정규화", "각자 유사도 행렬", "두 행렬의 차이", "회전에는 반응하지 않음"] as const;

const NOTES = [
  "student와 Gram teacher의 패치 특징을 각각 길이 1로 맞춥니다. 이후 내적이 코사인 유사도가 됩니다.",
  "패치가 P개면 P×P 행렬이 하나씩 나옵니다. 값이 아니라 이 행렬이 비교 대상입니다.",
  "성분별 차이를 제곱해 더합니다. 구현은 원소 수로 나눈 평균제곱오차를 씁니다.",
  "표현 전체를 회전시켜도 패치 쌍의 각도는 그대로라 손실이 변하지 않습니다. 학습은 계속 움직일 수 있습니다.",
] as const;

const MOBILE_STAGES = [
  { title: "패치 특징 정규화", detail: "각 벡터의 길이를 1로" },
  { title: "P×P Gram 행렬", detail: "패치 쌍의 코사인 유사도" },
  { title: "두 행렬 비교", detail: "student와 이른 teacher의 관계 차이" },
  { title: "값은 계속 움직임", detail: "전체 회전에는 같은 관계가 유지됨" },
] as const;

const S = "#6366f1";
const G = "#8b5cf6";
const DIFF = "#f59e0b";
const OK = "#10b981";
const MUTED = "#94a3b8";

const N = 6;
const sim = (i: number, j: number, shift = 0) =>
  i === j ? 1 : Math.max(0, 0.85 - Math.abs(i - j) * 0.22 + shift * (((i + j) % 3) - 1) * 0.08);

export default function GramViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="Gram anchoring"
      title="관계 행렬만 맞추고 값은 놓아둡니다"
      description="패치 6개로 줄인 그림입니다. 실제로는 이미지 한 장의 패치 수만큼 한 변이 늘어납니다."
      note="행렬 값은 설명을 위한 예시이며 실제 체크포인트의 측정값이 아닙니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="dinov3-gram-loss"
        tabIndex={0}
        role="group"
        aria-label="Gram anchoring 손실 계산"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="Gram anchoring 손실 계산 순서" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
            {step === 0 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  패치 특징 벡터를 길이 1로
                </text>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <g key={i}>
                    <rect x={24 + i * 72} y={44} width={56} height={Math.max(10, 14 + (i % 3) * 14)} fill={S} fillOpacity={0.2} stroke={S} strokeWidth={1} />
                    <rect x={24 + i * 72} y={120} width={56} height={24} fill={OK} fillOpacity={0.25} stroke={OK} strokeWidth={1} />
                    <text x={52 + i * 72} y={136} textAnchor="middle" fontSize={8} fontWeight={700} fill={OK}>
                      |v| = 1
                    </text>
                  </g>
                ))}
                <text x={24} y={168} fontSize={9} fill={MUTED}>
                  크기 차이를 없애면 내적이 곧 코사인 유사도입니다
                </text>
              </g>
            )}

            {step >= 1 && (
              <g>
                {[
                  { x: 24, color: S, label: "student" },
                  { x: 186, color: G, label: "Gram teacher" },
                ].map((m, mi) =>
                  Array.from({ length: N }, (_, i) => i).map((i) =>
                    Array.from({ length: N }, (_, j) => j).map((j) => (
                      <rect
                        key={`${mi}-${i}-${j}`}
                        x={m.x + j * 20}
                        y={40 + i * 20}
                        width={18}
                        height={18}
                        fill={m.color}
                        fillOpacity={sim(i, j, mi === 0 && step >= 2 ? 1 : 0) * 0.65}
                        stroke={m.color}
                        strokeWidth={0.5}
                      />
                    )),
                  ),
                )}
                <text x={24} y={32} fontSize={9} fontWeight={700} fill={S}>
                  student
                </text>
                <text x={186} y={32} fontSize={9} fontWeight={700} fill={G}>
                  Gram teacher
                </text>
              </g>
            )}

            {step === 2 && (
              <g>
                {Array.from({ length: N }, (_, i) => i).map((i) =>
                  Array.from({ length: N }, (_, j) => j).map((j) => (
                    <rect
                      key={`d-${i}-${j}`}
                      x={348 + j * 20}
                      y={40 + i * 20}
                      width={18}
                      height={18}
                      fill={DIFF}
                      fillOpacity={Math.abs(sim(i, j, 1) - sim(i, j, 0)) * 3}
                      stroke={DIFF}
                      strokeWidth={0.5}
                    />
                  )),
                )}
                <text x={348} y={32} fontSize={9} fontWeight={700} fill={DIFF}>
                  차이
                </text>
                <text x={348} y={178} fontSize={9} fontWeight={700} fill={DIFF}>
                  제곱해서 평균
                </text>
              </g>
            )}

            {step === 3 && (
              <g>
                <rect x={348} y={52} width={116} height={44} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                <text x={406} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  표현 전체 회전
                </text>
                <text x={406} y={88} textAnchor="middle" fontSize={9} fill={OK}>
                  손실 변화 없음
                </text>
                <rect x={348} y={110} width={116} height={44} fill="none" stroke={DIFF} strokeWidth={1.25} />
                <text x={406} y={130} textAnchor="middle" fontSize={9} fontWeight={700} fill={DIFF}>
                  패치 쌍 각도 변화
                </text>
                <text x={406} y={146} textAnchor="middle" fontSize={9} fill={DIFF}>
                  손실 증가
                </text>
              </g>
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
