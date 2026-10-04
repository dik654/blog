import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["과거 3위치", "현재 값 생성", "새 기록 추가", "4위치 읽기", "다음 실행 준비"] as const;
const STATES = [
  { positions: 3, query: "아직 만들지 않음", result: "저장 48byte", note: "두 KV head가 과거 3위치의 기록을 보관합니다. 각 칸의 숫자는 2byte입니다." },
  { positions: 3, query: "현재 Q 4개 · 16byte", result: "새 K/V 16byte 대기", note: "새 위치의 K/V와 현재 Q를 만들었습니다. 둘 다 16byte지만 저장할 기록과 현재 질문은 역할이 다릅니다." },
  { positions: 4, query: "현재 Q 4개 · 16byte", result: "저장 48 + 16 = 64byte", note: "현재 위치의 K와 V를 붙였습니다. Q head 0·1은 KV head 0을, Q head 2·3은 KV head 1을 읽습니다." },
  { positions: 4, query: "첫 Q = (1, 0)", result: "첫 head 출력 (2.5, 5)", note: "첫 head의 점수는 모두 0이라 비율은 각각 1/4입니다. V의 네 값을 그 비율로 합칩니다." },
  { positions: 4, query: "현재 Q는 남기지 않음", result: "다음 실행용 KV 64byte", note: "다음 위치는 새 Q를 만듭니다. 과거 Q는 쓰지 않고 K/V 4위치만 계속 보관합니다." },
] as const;

export default function KVCacheLifecycleViz() {
  const scenes = useAnimatedScenes(STATES.length, 3600);
  const state = STATES[scenes.active];
  return <VizFrame eyebrow="KV cache lifecycle" title="기록은 48 → 64byte, 현재 질문은 이번에만 씁니다"
    description="같은 요청의 한 층을 따라갑니다. 표의 각 칸은 폭 2인 벡터 하나입니다."
    note="Q head 4·KV head 2·폭 2·원소당 2byte. 모든 값은 가정이며 위치 변환을 끝낸 K를 표시합니다.">
    <div data-viz-canvas role="group" tabIndex={0} aria-label="KV 기록의 생성과 추가와 재사용" onKeyDown={scenes.onKeyDown}
      className="flex h-auto min-h-full min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex flex-none flex-col py-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><h4 className="font-bold">{LABELS[scenes.active]}</h4><span>{state.positions}위치 · KV {state.positions * 16}byte</span></div>
        <svg viewBox="0 0 320 164" role="img" aria-label={`${state.positions}위치와 두 KV head의 K/V 배열`} className="mt-3 h-auto max-h-48 w-full">
          {["위치", "K₀", "V₀", "K₁", "V₁"].map((label, index) => <text key={label} x={index === 0 ? 17 : 20 + index * 66} y={14} textAnchor="middle" className="fill-muted-foreground text-[12px]">{label}</text>)}
          {[1, 2, 3, 4].map((position, row) => <g key={position}>
            <text x={17} y={41 + row * 34} textAnchor="middle" className="fill-muted-foreground text-[12px]">{position}</text>
            {[`0,${position}`, `${position},${position * 2}`, `${position},0`, `${position * 2},${position}`].map((value, column) => <g key={column}>
              <rect x={54 + column * 66} y={23 + row * 34} width={60} height={28} rx={2} className={`${position > state.positions ? "fill-muted/20" : row === 3 ? "fill-primary/15" : "fill-muted/70"} stroke-border`} strokeDasharray={position > state.positions ? "3 3" : undefined} />
              <text x={84 + column * 66} y={42 + row * 34} textAnchor="middle" className="fill-foreground text-[12px]">{position > state.positions ? "—" : `(${value})`}</text>
            </g>)}
          </g>)}
        </svg>
        <p className="mt-3 text-sm">{state.query}</p>
        <p className="mt-2 border-y border-border py-3 font-mono text-base text-primary">{state.result}</p>
        <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{state.note}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={LABELS} />
    </div>
  </VizFrame>;
}
