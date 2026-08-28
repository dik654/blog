import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: scheduling step 마다 running 이 token budget 을 먼저 쓰고
 * 남은 잔액이 waiting prefill 의 chunk 가 되는 과정.
 * 장면 = step 안의 결정 순간 하나. stage 높이는 고정, control row 는 아래 고정 row.
 */
const BUDGET = 2048;

const SCENES = [
  "Step 1 · running 순회",
  "Step 1 · waiting admission",
  "Step 2 · chunk 마무리",
  "Step 3 · decode batch",
] as const;

type Segment = { label: string; tokens: number; kind: "decode" | "prefill" };

type Scene = {
  running: { decode: number; prefill?: { id: string; done: number; total: number } };
  waiting: { id: string; total: number }[];
  segments: Segment[];
  admitted?: string;
};

const STATES: readonly Scene[] = [
  {
    running: { decode: 40 },
    waiting: [{ id: "R41", total: 3000 }],
    segments: [{ label: "decode ×40", tokens: 40, kind: "decode" }],
  },
  {
    running: { decode: 40, prefill: { id: "R41", done: 0, total: 3000 } },
    waiting: [],
    segments: [
      { label: "decode ×40", tokens: 40, kind: "decode" },
      { label: "R41 chunk 2008", tokens: 2008, kind: "prefill" },
    ],
    admitted: "R41",
  },
  {
    running: { decode: 40, prefill: { id: "R41", done: 2008, total: 3000 } },
    waiting: [{ id: "R42", total: 500 }],
    segments: [
      { label: "decode ×40", tokens: 40, kind: "decode" },
      { label: "R41 chunk 992", tokens: 992, kind: "prefill" },
      { label: "R42 500", tokens: 500, kind: "prefill" },
    ],
    admitted: "R42",
  },
  {
    running: { decode: 42 },
    waiting: [],
    segments: [{ label: "decode ×42", tokens: 42, kind: "decode" }],
  },
];

const NOTES = [
  "Running 의 decode 40개가 need 1 씩 budget 2048 에서 먼저 가져갑니다. 잔액 2008 이 남습니다.",
  "Preemption 이 없고 sequence 자리가 있으니 waiting 의 R41 이 running 으로 올라옵니다. Chunk 크기는 상수가 아니라 잔액 2008 입니다.",
  "R41 은 이제 running 이라 decode 뒤에 남은 992 를 받습니다. 그래도 잔액이 남아 R42 가 같은 step 에 admission 됩니다. 이 step 이 mixed batch 입니다.",
  "R41·R42 의 prefill 이 끝나 둘 다 need 1 인 decode 가 됐습니다. 42 token 짜리 decode batch 라 이 step 은 짧지만 GPU 는 비어 있습니다.",
] as const;

function DecodeDots({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap gap-[3px]" aria-label={`decode request ${count}개`}>
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="block h-2 w-2 border border-primary/60 bg-primary/25" />
      ))}
    </div>
  );
}

export default function ContinuousBatchingStepAnatomyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const state = STATES[scenes.active];
  const used = state.segments.reduce((sum, segment) => sum + segment.tokens, 0);

  return (
    <VizFrame
      eyebrow="Scheduling step anatomy"
      title="Running 이 budget 을 먼저 쓰고 남은 잔액이 prefill chunk 가 됩니다"
      description="각 장면은 한 scheduling step 안의 결정 순간입니다. 왼쪽은 running set 과 waiting queue, 아래 막대는 그 step 의 token budget 2048 이 채워지는 모습입니다."
      note="KV block 배정과 priority 정책, speculative token 은 생략했습니다. 숫자는 본문의 예(budget 2048, decode 40, prompt 3000·500)입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Scheduling step 마다 running·waiting 집합과 token budget 이 채워지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr]">
            <div className="min-h-[9.5rem] border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">
                running · {state.running.decode + (state.running.prefill ? 1 : 0)} / max_num_seqs
              </p>
              <div className="mt-2">
                <DecodeDots count={state.running.decode} />
              </div>
              <div className="mt-3 min-h-[3.25rem]">
                {state.running.prefill ? (
                  <div className="border border-amber-600 bg-amber-500/5 px-2 py-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>{state.running.prefill.id} prefill</span>
                      <span>
                        {state.running.prefill.done}/{state.running.prefill.total}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-muted">
                      <div
                        className="h-full bg-amber-600/70"
                        style={{ width: `${(state.running.prefill.done / state.running.prefill.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="font-mono text-[11px] text-muted-foreground">prefill 이 남은 request 없음</p>
                )}
              </div>
            </div>

            <div className="min-h-[9.5rem] border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">waiting · 도착 순</p>
              <div className="mt-2 flex min-h-[3rem] flex-col gap-1.5">
                {state.waiting.length === 0 ? (
                  <p className="font-mono text-[11px] text-muted-foreground">비어 있음</p>
                ) : (
                  state.waiting.map((request) => (
                    <div
                      key={request.id}
                      className="flex justify-between border border-dashed border-border px-2 py-1 font-mono text-[11px]"
                    >
                      <span>{request.id}</span>
                      <span>prompt {request.total}</span>
                    </div>
                  ))
                )}
              </div>
              <p className="mt-3 font-mono text-[11px] text-primary">
                {state.admitted ? `${state.admitted} → running (잔액 크기의 chunk)` : "이 순간 admission 없음"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>token budget</span>
              <span>
                {used} / {BUDGET}
              </span>
            </div>
            <div className="mt-1.5 flex h-7 w-full border border-border bg-muted/40">
              {state.segments.map((segment) => (
                <div
                  key={segment.label}
                  title={segment.label}
                  className={`flex h-full items-center overflow-hidden border-r border-background px-1 font-mono text-[10px] leading-none ${
                    segment.kind === "decode" ? "bg-primary/35 text-foreground" : "bg-amber-500/45 text-foreground"
                  }`}
                  style={{ width: `${(segment.tokens / BUDGET) * 100}%`, minWidth: segment.tokens < 80 ? "1.75rem" : undefined }}
                >
                  <span className="truncate">{segment.tokens >= 300 ? segment.label : ""}</span>
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex gap-4 font-mono text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 bg-primary/35" /> decode (need 1)
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 bg-amber-500/45" /> prefill chunk
              </span>
              <span>잔액 {BUDGET - used}</span>
            </div>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
