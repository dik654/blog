import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SnapshotGate.tsx — 판단 순서 */
const SCENES = ["한 장에 들어가는가", "들어감", "안 들어감", "마지막 관문"] as const;
const NOTES = [
  "첫 질문은 용량입니다. 이 답에 따라 이후 축의 비중이 완전히 달라집니다.",
  "들어가면 링크 축의 비중이 줄고 대역폭과 소프트웨어가 결정적이 됩니다.",
  "안 들어가면 링크 구조와 통신 패턴의 궁합, 그리고 폼팩터가 요구하는 전력·냉각을 봅니다.",
  "어느 경로든 마지막은 실제 워크로드를 띄워 기능과 정확도를 확인하는 것입니다.",
] as const;

const Q = "#6366f1";
const YES = "#10b981";
const NO = "#f59e0b";
const FINAL = "#8b5cf6";
const MUTED = "#94a3b8";

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판단 순서"
      title="첫 질문이 나머지 축의 비중을 정합니다"
      description="용량 질문에서 갈라진 뒤 마지막에 같은 관문으로 모입니다."
      note="스펙 표는 기준일과 함께 읽고 순위 판정에는 쓰지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가속기 선택 판단 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={20} y={80} width={120} height={40} fill={Q} fillOpacity={0.14} stroke={Q} strokeWidth={1.25} />
            <text x={80} y={98} textAnchor="middle" fontSize={9} fontWeight={700} fill={Q}>
              모델 + 상태가
            </text>
            <text x={80} y={112} textAnchor="middle" fontSize={9} fontWeight={700} fill={Q}>
              한 장에 들어가나
            </text>

            {step >= 1 && (
              <g>
                <line x1={140} y1={92} x2={172} y2={62} stroke={YES} strokeWidth={1} />
                <rect x={172} y={44} width={150} height={38} fill={YES} fillOpacity={step === 1 ? 0.16 : 0.06} stroke={YES} strokeWidth={step === 1 ? 1.25 : 1} />
                <text x={247} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={YES}>
                  예 · 대역폭 + 소프트웨어
                </text>
                <text x={247} y={74} textAnchor="middle" fontSize={8} fill={YES}>
                  링크 비중 축소
                </text>
              </g>
            )}

            {step >= 2 && (
              <g>
                <line x1={140} y1={110} x2={172} y2={140} stroke={NO} strokeWidth={1} />
                <rect x={172} y={120} width={150} height={38} fill={NO} fillOpacity={step === 2 ? 0.16 : 0.06} stroke={NO} strokeWidth={step === 2 ? 1.25 : 1} />
                <text x={247} y={136} textAnchor="middle" fontSize={9} fontWeight={700} fill={NO}>
                  아니오 · 링크 + 폼팩터
                </text>
                <text x={247} y={150} textAnchor="middle" fontSize={8} fill={NO}>
                  통신 패턴 궁합부터
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <line x1={322} y1={63} x2={352} y2={92} stroke={FINAL} strokeWidth={1} />
                <line x1={322} y1={139} x2={352} y2={110} stroke={FINAL} strokeWidth={1} />
                <rect x={352} y={80} width={108} height={42} fill={FINAL} fillOpacity={0.14} stroke={FINAL} strokeWidth={1.25} />
                <text x={406} y={98} textAnchor="middle" fontSize={9} fontWeight={700} fill={FINAL}>
                  실제 워크로드
                </text>
                <text x={406} y={112} textAnchor="middle" fontSize={9} fontWeight={700} fill={FINAL}>
                  한 번 띄우기
                </text>
              </g>
            )}
            <text x={20} y={182} fontSize={9} fill={MUTED}>
              {step >= 3 ? "기능이 전부 켜지는지와 정확도부터 확인합니다" : "축의 비중은 첫 질문의 답에 따라 달라집니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
