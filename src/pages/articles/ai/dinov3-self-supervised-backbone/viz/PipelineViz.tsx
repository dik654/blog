import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 크롭 생성부터 사후 증류까지의 전체 단계 */
const SCENES = ["크롭 만들기", "두 목표로 학습", "100만 스텝 뒤 규제 추가", "사후 적응과 증류"] as const;

const NOTES = [
  "한 이미지에서 넓은 크롭과 좁은 크롭을 여러 장 만듭니다. 라벨 대신 이 크롭 쌍이 학습 신호가 됩니다.",
  "teacher는 student 가중치의 이동평균입니다. 이미지 수준과 패치 수준 두 목표를 동시에 겁니다.",
  "이 시점부터 Gram teacher를 세우고 패치 유사도 구조를 붙잡는 항을 더합니다.",
  "학습을 다시 하지 않고 해상도 적응과 증류로 배포용 계열을 만듭니다.",
] as const;

const STUDENT = "#6366f1";
const TEACHER = "#8b5cf6";
const GRAM = "#10b981";
const MUTED = "#94a3b8";

export default function PipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="학습 전체 흐름"
      title="라벨 없는 학습이 네 단계로 나뉩니다"
      description="각 장면이 앞 단계의 결과 위에 무엇을 더하는지를 보여 줍니다."
      note="단계별 스텝 수는 공개된 설정값이며 다른 데이터에서의 권장값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="DINOv3 학습 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
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

            {step >= 1 && (
              <g>
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
              </g>
            )}

            {step >= 2 && (
              <g>
                <rect x={186} y={112} width={278} height={32} fill={GRAM} fillOpacity={0.08} stroke={GRAM} strokeWidth={1.25} />
                <text x={325} y={132} textAnchor="middle" fontSize={10} fontWeight={700} fill={GRAM}>
                  Gram teacher · 패치 유사도 구조 유지
                </text>
                <text x={186} y={158} fontSize={8} fill={GRAM}>
                  1M 스텝 이후 시작 · 10k마다 갱신
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <rect x={16} y={168} width={214} height={24} fill="none" stroke={MUTED} strokeWidth={1} />
                <text x={123} y={184} textAnchor="middle" fontSize={9} fill={MUTED}>
                  해상도 적응 10k 스텝
                </text>
                <rect x={250} y={168} width={214} height={24} fill="none" stroke={MUTED} strokeWidth={1} />
                <text x={357} y={184} textAnchor="middle" fontSize={9} fill={MUTED}>
                  증류로 작은 계열 생성
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
