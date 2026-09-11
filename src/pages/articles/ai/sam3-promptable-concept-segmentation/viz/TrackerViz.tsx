import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: VideoTracker.tsx — 검출과 추적을 잇는 절차 */
const SCENES = ["궤적을 옮김", "현재 프레임 검출", "겹침으로 매칭", "재프롬프트"] as const;

const NOTES = [
  "이전 프레임까지의 궤적을 메모리를 참조해 현재 위치로 옮깁니다.",
  "같은 프레임에서 개념 프롬프트로 새로 검출합니다. 두 결과는 아직 별개입니다.",
  "겹침 정도로 짝을 지어 정체성을 잇고, 짝이 없는 검출은 새 궤적이 됩니다.",
  "신뢰도 높은 검출 마스크로 추적기를 다시 프롬프트해 누적된 편차를 되돌립니다.",
] as const;

const TRACK = "#8b5cf6";
const DET = "#6366f1";
const LINK = "#10b981";
const NEW = "#f59e0b";
const MUTED = "#94a3b8";

export default function TrackerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="영상 경로"
      title="궤적과 검출은 따로 만들어진 뒤 짝지어집니다"
      description="한 프레임에서 두 흐름이 만나는 지점만 그렸습니다."
      note="매칭 임계값과 메모리 길이는 구현 설정이며 그림에 반영하지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="검출과 추적의 매칭"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={28} fontSize={9} fill={MUTED}>
              프레임 t-1
            </text>
            <rect x={24} y={36} width={130} height={84} fill="none" stroke={MUTED} strokeWidth={1} />
            <rect x={44} y={56} width={40} height={28} fill={TRACK} fillOpacity={0.2} stroke={TRACK} strokeWidth={1} />
            <rect x={98} y={80} width={36} height={26} fill={TRACK} fillOpacity={0.2} stroke={TRACK} strokeWidth={1} />
            <text x={24} y={134} fontSize={8} fill={TRACK}>
              궤적 2개 · 메모리 보유
            </text>

            <text x={196} y={28} fontSize={9} fill={MUTED}>
              프레임 t
            </text>
            <rect x={196} y={36} width={130} height={84} fill="none" stroke={MUTED} strokeWidth={1} />
            {step >= 0 && (
              <g>
                <rect x={222} y={52} width={40} height={28} fill={TRACK} fillOpacity={0.15} stroke={TRACK} strokeWidth={1} strokeDasharray="3 2" />
                <rect x={272} y={82} width={36} height={26} fill={TRACK} fillOpacity={0.15} stroke={TRACK} strokeWidth={1} strokeDasharray="3 2" />
              </g>
            )}
            {step >= 1 && (
              <g>
                <rect x={226} y={56} width={40} height={28} fill={DET} fillOpacity={0.18} stroke={DET} strokeWidth={1} />
                <rect x={268} y={78} width={36} height={26} fill={DET} fillOpacity={0.18} stroke={DET} strokeWidth={1} />
                <rect x={198} y={96} width={30} height={22} fill={NEW} fillOpacity={0.2} stroke={NEW} strokeWidth={1} />
              </g>
            )}
            <text x={196} y={134} fontSize={8} fill={DET}>
              {step >= 1 ? "검출 3개 (점선은 옮겨온 궤적)" : "옮겨온 궤적"}
            </text>

            {step >= 2 && (
              <g>
                <rect x={356} y={36} width={104} height={84} fill="none" stroke={LINK} strokeWidth={1.25} />
                <text x={408} y={54} textAnchor="middle" fontSize={9} fontWeight={700} fill={LINK}>
                  매칭 결과
                </text>
                <text x={408} y={72} textAnchor="middle" fontSize={8} fill={LINK}>
                  id1 · id2 유지
                </text>
                <text x={408} y={88} textAnchor="middle" fontSize={8} fill={NEW}>
                  id3 새로 생성
                </text>
                <text x={408} y={108} textAnchor="middle" fontSize={8} fill={MUTED}>
                  짝 없는 궤적은 점수 하락
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <rect x={24} y={150} width={436} height={34} fill={LINK} fillOpacity={0.07} stroke={LINK} strokeWidth={1.25} />
                <text x={242} y={171} textAnchor="middle" fontSize={9} fontWeight={700} fill={LINK}>
                  주기적 재프롬프트 · 높은 신뢰도 검출 마스크로 추적기 상태를 갱신
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
