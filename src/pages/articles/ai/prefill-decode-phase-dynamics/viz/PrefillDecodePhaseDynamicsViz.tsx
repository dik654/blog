import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const CHUNKS = [0, 4, 8, 16, 20] as const;
const LABELS = ["C 없이", "C 4위치", "C 8위치", "C 16위치", "C 20위치"] as const;
const NOTES = [
  "A와 B의 2위치만 계산합니다. 전송 항 1.40 ms가 더 큽니다.",
  "A1+B1+C4는 처음의 budget 6 배정입니다. 두 항을 함께 세면 하한은 1.48 ms입니다.",
  "이 장면은 budget을 10으로 바꾼 비교입니다. 조각이 늘면서 계산과 전송이 모두 늘어납니다.",
  "budget 18의 비교입니다. 하한 1.80 ms여도 관측 2.30 ms라면 목표 2 ms에 실패합니다.",
  "budget 22로 C의 입력을 전부 넣습니다. 하한부터 2.20 ms라 이 조건에서 목표 2 ms는 불가능합니다.",
] as const;

export default function PrefillDecodePhaseDynamicsViz() {
  const scenes = useAnimatedScenes(CHUNKS.length, 4200);
  const c = CHUNKS[scenes.active];
  const flops = 100 * (2 + c);
  const bytes = 140 + 2 * c;
  const computeMs = flops / 1000;
  const memoryMs = bytes / 100;
  const lowerMs = Math.max(computeMs, memoryMs);
  const x = (ms: number) => 76 + (ms / 2.5) * 215;
  return <VizFrame eyebrow="가정한 작업량 → 시간 하한" title="C를 더 넣으면 두 장부가 함께 바뀝니다"
    description="같은 A·B를 유지하며 C의 조각만 바꿉니다. 최초 한도 6 외의 장면은 다른 budget 비교입니다."
    note="전체 작업 F=100(2+c) MFLOP, M=(140+2c) MB. 1 TFLOP/s·100 GB/s의 가정이며 GPU 측정값이 아닙니다.">
    <div data-viz-canvas role="group" tabIndex={0} aria-label="C의 조각 크기별 연산과 전송 시간 하한" onKeyDown={scenes.onKeyDown}
      className="flex h-auto min-h-full min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex flex-none flex-col py-2">
        <div className="flex flex-wrap justify-between gap-2 text-sm"><h4 className="font-bold">A1 + B1 + C{c}</h4><span>총 {2 + c}위치</span></div>
        <p className="mt-2 text-sm leading-6">{flops} MFLOP · {bytes} MB · {(flops / bytes).toFixed(3)} FLOP/byte</p>
        <svg viewBox="0 0 320 144" role="img" aria-label={`계산 하한 ${computeMs.toFixed(2)} ms, 전송 하한 ${memoryMs.toFixed(2)} ms`} className="mt-2 h-auto max-h-40 w-full">
          {[0, 1, 2].map(ms => <g key={ms}><line x1={x(ms)} x2={x(ms)} y1={22} y2={116} className="stroke-border" /><text x={x(ms)} y={138} textAnchor="middle" className="fill-muted-foreground text-[12px]">{ms} ms</text></g>)}
          <line x1={x(2)} x2={x(2)} y1={15} y2={116} className="stroke-primary" strokeDasharray="3 3" />
          <text x={x(2)} y={12} textAnchor="middle" className="fill-primary text-[12px]">목표 2 ms</text>
          <text x={9} y={45} className="fill-foreground text-[12px]">계산</text>
          <rect x={76} y={27} width={x(computeMs) - 76} height={20} className="fill-primary/65" />
          <text x={76} y={68} className="fill-foreground text-[12px]">{computeMs.toFixed(2)} ms</text>
          <text x={9} y={95} className="fill-foreground text-[12px]">전송</text>
          <rect x={76} y={77} width={x(memoryMs) - 76} height={20} className="fill-muted-foreground/55" />
          <text x={76} y={113} className="fill-foreground text-[12px]">{memoryMs.toFixed(2)} ms</text>
        </svg>
        <p className="mt-2 border-y border-border py-2 font-mono text-base text-primary">실제 시간 ≥ {lowerMs.toFixed(2)} ms</p>
        <p className="mt-2 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={LABELS} />
    </div>
  </VizFrame>;
}
