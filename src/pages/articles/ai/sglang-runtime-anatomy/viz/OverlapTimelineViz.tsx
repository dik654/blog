import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * CPU 한 줄과 GPU 한 줄에 decode 세 번을 놓는다.
 * 한 mechanism: 앞 step의 결과 처리를 다음 step의 GPU 실행 뒤로 미루면 GPU의 빈칸이 사라지고, 결과는 한 step 늦게 읽힌다.
 */
const X0 = 46;
const PX = 11.8;
const sx = (ms: number) => X0 + ms * PX;

type Kind = "sched" | "proc" | "gpu" | "waste";

interface Block {
  lane: 0 | 1;
  start: number;
  end: number;
  kind: Kind;
  label: string;
}

const COLORS: Record<Kind, string> = {
  sched: "#0d9488",
  proc: "#d97706",
  gpu: "#2563eb",
  waste: "#2563eb",
};

const SERIAL: readonly Block[] = [
  { lane: 0, start: 0, end: 1, kind: "sched", label: "" },
  { lane: 1, start: 1, end: 11, kind: "gpu", label: "step 1" },
  { lane: 0, start: 11, end: 12, kind: "proc", label: "" },
  { lane: 0, start: 12, end: 13, kind: "sched", label: "" },
  { lane: 1, start: 13, end: 23, kind: "gpu", label: "step 2" },
  { lane: 0, start: 23, end: 24, kind: "proc", label: "" },
  { lane: 0, start: 24, end: 25, kind: "sched", label: "" },
  { lane: 1, start: 25, end: 35, kind: "gpu", label: "step 3" },
  { lane: 0, start: 35, end: 36, kind: "proc", label: "" },
];

const OVERLAP: readonly Block[] = [
  { lane: 0, start: 0, end: 1, kind: "sched", label: "" },
  { lane: 1, start: 1, end: 11, kind: "gpu", label: "step 1" },
  { lane: 0, start: 1, end: 2, kind: "sched", label: "" },
  { lane: 0, start: 11, end: 12, kind: "proc", label: "" },
  { lane: 1, start: 11, end: 21, kind: "gpu", label: "step 2" },
  { lane: 0, start: 12, end: 13, kind: "sched", label: "" },
  { lane: 0, start: 21, end: 22, kind: "proc", label: "" },
  { lane: 1, start: 21, end: 31, kind: "gpu", label: "step 3" },
  { lane: 0, start: 31, end: 32, kind: "proc", label: "" },
];

const SCENES = ["직렬", "겹치기", "EOS가 한 step 늦게 보임"] as const;

interface SceneState {
  blocks: readonly Block[];
  finish: number;
  marker?: { at: number; label: string };
  note: string;
}

const STATES: readonly SceneState[] = [
  {
    blocks: SERIAL,
    finish: 36,
    note: "CPU가 batch를 고르고(1ms) GPU가 계산한 뒤(10ms) 결과를 처리(1ms)해야 다음 batch를 고릅니다. 한 step이 12ms라 세 step은 36ms입니다.",
  },
  {
    blocks: OVERLAP,
    finish: 32,
    note: "step 1을 GPU에 넣자마자 step 2를 골라 넣고, step 1의 결과는 step 2가 도는 동안 처리합니다. GPU가 쉬지 않아 step 간격이 10ms로 줄어듭니다.",
  },
  {
    blocks: [
      ...OVERLAP.filter((block) => !(block.lane === 1 && block.start === 11)),
      { lane: 1, start: 11, end: 21, kind: "waste", label: "step 2 · X 포함" },
    ],
    finish: 32,
    marker: { at: 12, label: "X의 EOS를 읽음" },
    note: "요청 X가 step 1에서 EOS를 뽑아도 CPU는 11~12ms에야 그 값을 읽습니다. step 2는 이미 X를 포함해 돌고 있으므로 X의 token 하나를 더 계산하고 버립니다.",
  },
];

export default function OverlapTimelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const state = STATES[scenes.active];
  const ticks = [0, 12, 24, 36];

  return (
    <VizFrame
      eyebrow="Overlap scheduler"
      title="결과 처리를 다음 GPU 실행 뒤로 미루면 GPU의 빈칸이 사라집니다"
      description="위 줄은 CPU, 아래 줄은 GPU입니다. 초록은 batch 고르기, 주황은 결과 처리, 파랑은 GPU의 decode 한 번, 빨간 테두리는 이미 끝난 요청 X가 섞인 step입니다."
      note="CPU 1ms+1ms, GPU 10ms는 설명용 가정입니다. CUDA graph·sampling 위치·복사 시간은 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CPU와 GPU의 작업 시간표"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
          <svg viewBox="0 0 480 128" className="h-auto w-full min-w-[30rem]" role="img" aria-label={`세 step이 ${state.finish}ms에 끝남`}>
            <text x={4} y={38} fontSize={10} fill="#374151" fontWeight={700}>CPU</text>
            <text x={4} y={82} fontSize={10} fill="#374151" fontWeight={700}>GPU</text>
            <line x1={X0} y1={44} x2={sx(36)} y2={44} stroke="#e5e7eb" strokeWidth={1} />
            <line x1={X0} y1={88} x2={sx(36)} y2={88} stroke="#e5e7eb" strokeWidth={1} />
            {state.blocks.map((block, index) => {
              const y = block.lane === 0 ? 26 : 68;
              return (
                <g key={index}>
                  <rect
                    x={sx(block.start)}
                    y={y}
                    width={Math.max((block.end - block.start) * PX - 1, 2)}
                    height={18}
                    rx={2}
                    fill={COLORS[block.kind]}
                    fillOpacity={block.kind === "proc" || block.kind === "sched" ? 1 : 0.85}
                    stroke={block.kind === "waste" ? "#dc2626" : "none"}
                    strokeWidth={block.kind === "waste" ? 1.25 : 0}
                  />
                  {block.label ? (
                    <text x={sx((block.start + block.end) / 2)} y={y + 12.5} fontSize={9} fill="#ffffff" textAnchor="middle" fontWeight={700}>
                      {block.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {state.marker ? (
              <g>
                <line x1={sx(state.marker.at)} y1={14} x2={sx(state.marker.at)} y2={94} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                <text x={sx(state.marker.at) + 4} y={16} fontSize={9} fill="#dc2626" fontWeight={700}>
                  {state.marker.label}
                </text>
              </g>
            ) : null}
            {ticks.map((tick) => (
              <text key={tick} x={sx(tick)} y={110} fontSize={9} fill="#6b7280" textAnchor={tick === 36 ? "end" : tick === 0 ? "start" : "middle"}>
                {tick}ms
              </text>
            ))}
          </svg>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">세 step 끝</dt>
              <dd className="font-bold text-foreground">{state.finish}ms</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">step 간격</dt>
              <dd className="font-bold text-foreground">{state.finish === 36 ? "12ms" : "10ms"}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
