import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: TwoObjectives.tsx — 이미지 수준 목표와 패치 수준 목표 */
const SCENES = ["이미지 수준: 크롭 쌍", "teacher 쪽 centering", "패치 수준: 가린 자리", "퍼뜨리기 항"] as const;

const NOTES = [
  "넓은 크롭과 좁은 크롭의 prototype 분포를 서로 맞춥니다. 모든 student·teacher 쌍이 손실에 들어갑니다.",
  "teacher 출력에서 배치 평균을 빼고 낮은 온도로 나눕니다. 한 prototype으로 몰리는 붕괴를 막는 장치입니다.",
  "student 입력의 일부 패치를 가리고, 가려진 자리마다 teacher 분포를 맞춥니다. 픽셀이 아니라 분포가 목표입니다.",
  "배치 안에서 최근접 이웃까지의 거리를 키워 서로 다른 이미지가 한 점으로 뭉치지 않게 합니다.",
] as const;

const S = "#6366f1";
const T = "#8b5cf6";
const OK = "#10b981";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

export default function ObjectivesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="두 학습 목표"
      title="한 장에 하나, 그리고 자리마다 하나"
      description="같은 teacher에서 나오지만 비교하는 단위가 다릅니다."
      note="prototype 개수와 온도는 공개 설정값이며 그림에서는 단순화했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="DINOv3의 두 학습 목표"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {(step === 0 || step === 1) && (
              <g>
                <rect x={24} y={34} width={70} height={40} fill={S} fillOpacity={0.1} stroke={S} strokeWidth={1.25} />
                <text x={59} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={S}>
                  student 크롭
                </text>
                <rect x={24} y={100} width={70} height={40} fill={T} fillOpacity={0.1} stroke={T} strokeWidth={1.25} />
                <text x={59} y={124} textAnchor="middle" fontSize={9} fontWeight={700} fill={T}>
                  teacher 크롭
                </text>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <g key={i}>
                    <rect x={150 + i * 44} y={44} width={34} height={Math.max(6, (i % 3) * 9 + 8)} fill={S} fillOpacity={0.25} stroke={S} strokeWidth={1} />
                    <rect
                      x={150 + i * 44}
                      y={110}
                      width={34}
                      height={step === 1 ? (i === 2 ? 26 : 7) : Math.max(6, ((i + 1) % 3) * 9 + 8)}
                      fill={T}
                      fillOpacity={0.25}
                      stroke={T}
                      strokeWidth={1}
                    />
                  </g>
                ))}
                <text x={150} y={38} fontSize={8} fill={MUTED}>
                  prototype 분포 (student)
                </text>
                <text x={150} y={104} fontSize={8} fill={MUTED}>
                  prototype 분포 (teacher)
                </text>
                <text x={150} y={166} fontSize={9} fontWeight={700} fill={step === 1 ? WARN : MUTED}>
                  {step === 1 ? "centering + 낮은 온도로 뾰족하게" : "교차 엔트로피로 student를 teacher에 맞춤"}
                </text>
              </g>
            )}

            {step === 2 && (
              <g>
                {Array.from({ length: 16 }, (_, i) => i).map((i) => {
                  const masked = [2, 5, 6, 9, 13].includes(i);
                  return (
                    <rect
                      key={i}
                      x={40 + (i % 4) * 34}
                      y={38 + Math.floor(i / 4) * 30}
                      width={28}
                      height={24}
                      fill={masked ? WARN : S}
                      fillOpacity={masked ? 0.3 : 0.08}
                      stroke={masked ? WARN : S}
                      strokeWidth={1}
                    />
                  );
                })}
                <text x={40} y={30} fontSize={9} fill={MUTED}>
                  student 입력 · 색칠된 자리가 가려짐
                </text>
                {[2, 5, 6, 9, 13].map((i, k) => (
                  <rect key={i} x={260} y={40 + k * 24} width={90} height={16} fill={T} fillOpacity={0.2} stroke={T} strokeWidth={1} />
                ))}
                <text x={260} y={32} fontSize={9} fill={T}>
                  teacher의 같은 자리 분포
                </text>
                <text x={260} y={174} fontSize={9} fontWeight={700} fill={OK}>
                  가려진 자리만 손실에 들어감
                </text>
              </g>
            )}

            {step === 3 && (
              <g>
                <circle cx={140} cy={100} r={58} fill="none" stroke={MUTED} strokeWidth={1} />
                {[[120, 84], [128, 96], [122, 108], [150, 78], [168, 120], [110, 122]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={5} fill={WARN} fillOpacity={0.4} stroke={WARN} strokeWidth={1} />
                ))}
                <text x={140} y={172} textAnchor="middle" fontSize={9} fill={WARN}>
                  겹친 표현
                </text>
                <text x={228} y={100} fontSize={14} fill={MUTED}>
                  →
                </text>
                <circle cx={340} cy={100} r={58} fill="none" stroke={MUTED} strokeWidth={1} />
                {[[306, 78], [340, 68], [376, 96], [352, 128], [312, 122], [338, 100]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={5} fill={OK} fillOpacity={0.4} stroke={OK} strokeWidth={1} />
                ))}
                <text x={340} y={172} textAnchor="middle" fontSize={9} fill={OK}>
                  최근접 거리를 키운 뒤
                </text>
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
