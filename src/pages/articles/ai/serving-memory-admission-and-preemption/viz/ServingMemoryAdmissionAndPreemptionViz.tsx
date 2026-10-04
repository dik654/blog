import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["C 도착", "C 수용", "16번 뒤", "C 중단", "재개 대기", "C 재개"] as const;
const STATES = [
  { blocks: [14, 12, 0], c: "대기 · 입력 144", check: "14 − 9 = 5 ≥ 3", note: "A와 B가 26개를 쓰고 빈 공간은 14개입니다. C의 입력 144토큰에는 9개가 필요합니다." },
  { blocks: [14, 12, 9], c: "진행 · 계산 144", check: "사용 35 · 빈 공간 5", note: "C를 수용하고 입력을 계산했습니다. C의 첫 출력 토큰은 다음 실행에서 KV에 저장됩니다." },
  { blocks: [15, 13, 10], c: "진행 · 계산 160", check: "다음 수요 3 > 빈 공간 2", note: "각 요청이 16번 더 진행한 결과입니다. 다음 위치 241·209·161에는 각각 한 block을 더 써야 합니다." },
  { blocks: [16, 14, 0], c: "중단 · 계산 0", check: "2 + 10 − 2 = 10", note: "A와 B에 하나씩 더 주고 C의 전용 10개를 되찾습니다. C의 토큰 이력 161개는 보존합니다." },
  { blocks: [16, 14, 0], c: "대기 · 필요 11", check: "10 − 11 < 3", note: "C는 161토큰을 다시 계산해야 하므로 11개가 필요합니다. 빈 공간 10개로는 들어갈 수 없습니다." },
  { blocks: [0, 14, 11], c: "재개 · 계산 161", check: "10 + 16 − 11 = 15", note: "A가 끝나 16개를 반환했습니다. C가 11개를 받아 다시 계산하면 B14·C11이 남고 빈 공간은 15개입니다." },
] as const;
const COLORS = ["fill-primary/80", "fill-sky-500/45", "fill-amber-500/60"] as const;
const POOL = 40;

export default function ServingMemoryAdmissionAndPreemptionViz() {
  const scenes = useAnimatedScenes(STATES.length, 3600);
  const state = STATES[scenes.active];
  const owners = state.blocks.flatMap((count, owner) => Array.from({ length: count }, () => owner));
  const free = POOL - owners.length;
  const cells = Array.from({ length: POOL }, (_, index) => owners[index] ?? -1);
  return <VizFrame
    eyebrow="Memory admission and preemption"
    title="C의 공간은 9 → 10 → 0 → 11개로 바뀝니다"
    description="40개 공간의 소유와 C의 상태를 함께 봅니다. 하한 3은 빈 공간 개수의 조건입니다."
    note="한 block16토큰·2MiB, 전용 공간, 동기식, 공유 없음. 모든 숫자는 가정입니다."
  >
    <div data-viz-canvas role="group" tabIndex={0} aria-label="C의 수용부터 중단과 재개까지" onKeyDown={scenes.onKeyDown}
      className="flex h-auto min-h-full min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex flex-none flex-col py-2">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-base font-bold">{LABELS[scenes.active]}</h4>
          <span className="font-mono text-sm">빈 공간 {free} / 40</span>
        </div>
        <svg viewBox="0 0 320 140" role="img" aria-label={`A ${state.blocks[0]}개, B ${state.blocks[1]}개, C ${state.blocks[2]}개, 빈 공간 ${free}개`} className="mt-3 h-auto max-h-44 w-full">
          {cells.map((owner, index) => {
            const x = 8 + (index % 10) * 31;
            const y = 6 + Math.floor(index / 10) * 32;
            return <g key={index}>
              <rect x={x} y={y} width={26} height={26} rx={2} className={`${owner < 0 ? "fill-muted" : COLORS[owner]} stroke-border`} strokeWidth={1} />
              <text x={x + 13} y={y + 18} textAnchor="middle" className={`${owner === 0 ? "fill-primary-foreground" : "fill-foreground"} text-[12px]`}>{owner < 0 ? "·" : "ABC"[owner]}</text>
            </g>;
          })}
        </svg>
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <span>A {state.blocks[0]}</span><span>B {state.blocks[1]}</span><span>C {state.blocks[2]}</span><span>수용 하한 3</span>
        </div>
        <div className="mt-4 border-y border-border py-3">
          <p className="text-sm font-medium">C · {state.c}</p>
          <p className="mt-2 font-mono text-base text-primary">{state.check}</p>
        </div>
        <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{state.note}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={LABELS} />
    </div>
  </VizFrame>;
}
