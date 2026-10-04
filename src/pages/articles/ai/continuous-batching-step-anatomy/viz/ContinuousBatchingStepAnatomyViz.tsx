import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: scheduling step 마다 running 이 token budget 을 먼저 쓰고
 * 남은 잔액이 waiting prefill 의 chunk 가 되는 과정.
 * 장면 = step 안의 결정 순간 하나. stage 높이는 고정, control row 는 아래 고정 row.
 */
const BUDGET = 8;

const SCENES = [
  "Step 1 · running 순회",
  "Step 1 · waiting admission",
  "Step 2 · chunk 마무리",
  "Step 3 · decode batch",
] as const;

const CONTROL_LABELS = ["A·B 배정", "C 수용", "D 수용", "네 요청"] as const;

type Segment = { label: string; tokens: number; kind: "decode" | "prefill" };

type Scene = {
  running: { decode: number; prefill?: { id: string; done: number; total: number } };
  waiting: { id: string; total: number }[];
  segments: Segment[];
  admitted?: string;
};

const STATES: readonly Scene[] = [
  { running: { decode: 2 }, waiting: [{ id: "C", total: 10 }],
    segments: [{ label: "A+B", tokens: 2, kind: "decode" }] },
  { running: { decode: 2, prefill: { id: "C", done: 0, total: 10 } }, waiting: [],
    segments: [{ label: "A+B", tokens: 2, kind: "decode" }, { label: "C", tokens: 6, kind: "prefill" }], admitted: "C" },
  { running: { decode: 2, prefill: { id: "C", done: 6, total: 10 } }, waiting: [{ id: "D", total: 2 }],
    segments: [{ label: "A+B", tokens: 2, kind: "decode" }, { label: "C", tokens: 4, kind: "prefill" }, { label: "D", tokens: 2, kind: "prefill" }], admitted: "D" },
  { running: { decode: 4 }, waiting: [],
    segments: [{ label: "A+B+C+D", tokens: 4, kind: "decode" }] },
];

const NOTES = [
  "A와 B가 각각 1토큰을 받아 합계 2입니다. 한도 8에서 잔액 6이 남습니다.",
  "C의 입력 10토큰 중 6토큰을 배정합니다. 계산 뒤에도 4토큰이 남아 C의 첫 답변은 아직 나오지 않습니다.",
  "A와 B에 1씩, C의 남은 입력에 4, 새 D의 입력에 2를 배정합니다. 실행 뒤 C와 D도 첫 답변 토큰을 만듭니다.",
  "네 요청이 각각 다음 토큰을 계산합니다. 배정 합계는 4이고 잔액 4가 남습니다. 이 숫자만으로 실행 시간은 알 수 없습니다.",
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
      title="8토큰을 나누면 C의 입력이 6과 4로 갈립니다"
      description="첫 실행에서 C를 받는 과정과 그 뒤 두 실행을 봅니다. 막대 길이는 계산할 토큰 수입니다."
      note="한도 8, 요청 상한 4, C=10·D=2, 저장 공간 충분. 셋째 명단은 D 수용 직전입니다. (가정)"
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Scheduling step 마다 running·waiting 집합과 token budget 이 채워지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-auto min-h-full min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex flex-none flex-col py-2">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="min-h-[8.5rem] border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">
                running · {state.running.decode + (state.running.prefill ? 1 : 0)} / 4
              </p>
              <div className="mt-2">
                <DecodeDots count={state.running.decode} /><p className="mt-2 text-xs">{state.running.decode === 2 ? "A·B" : "A·B·C·D"} · 각 1토큰</p>
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
                  <p className="font-mono text-[11px] text-muted-foreground">남은 입력 없음</p>
                )}
              </div>
            </div>

            <div className="min-h-[8.5rem] border border-border p-3">
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
                {state.admitted ? `${state.admitted} → running 수용` : "이 순간 admission 없음"}
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
            <div className="mt-1.5 flex h-9 w-full border border-border bg-muted/40">
              {state.segments.map((segment) => (
                <div
                  key={segment.label}
                  title={segment.label}
                  className={`flex h-full items-center overflow-hidden border-r border-background justify-center px-1 font-mono text-[11px] leading-none ${
                    segment.kind === "decode" ? "bg-primary/35 text-foreground" : "bg-amber-500/45 text-foreground"
                  }`}
                  style={{ width: `${(segment.tokens / BUDGET) * 100}%`, flexShrink: 0 }}
                >
                  <span>{segment.label} {segment.tokens}</span>
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-3 font-mono text-[11px] text-muted-foreground">
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
        <AnimatedSceneControls {...scenes} labels={CONTROL_LABELS} />
      </div>
    </VizFrame>
  );
}
