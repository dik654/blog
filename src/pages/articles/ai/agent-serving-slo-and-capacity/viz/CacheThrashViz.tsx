import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

/**
 * 본문 대응: kv-residency 절. 세션 접두가 GPU KV 풀에 상주하는 동안은 다음 턴이 적중하고,
 * 동시 세션이 풀을 넘으면 서로의 접두를 밀어내 적중률이 무너진다(arXiv 2605.26297 Table II).
 * 칸 수 16은 그림용 축소이며 실제 풀 크기가 아니다.
 */
const SLOTS = 16;

const SCENES = [
  { agents: 15, hit: "98.85%", speed: "30.08", host: false, label: "동시 15" },
  { agents: 20, hit: "16.78%", speed: "16.96", host: false, label: "동시 20" },
  { agents: 25, hit: "19.21%", speed: "10.30", host: false, label: "동시 25" },
  { agents: 20, hit: "미측정", speed: "미측정", host: true, label: "호스트 층" },
] as const;

const NOTES = [
  "15개 세션의 앞부분이 모두 GPU 안에 남아 있습니다. 다음 턴은 새로 붙은 도구 결과만 계산하면 됩니다.",
  "세션이 20개가 되자 들어가지 못한 접두가 남의 접두를 밀어냅니다. 다음 턴마다 앞부분을 다시 계산하므로 적중률이 16.78%로 떨어집니다.",
  "25개에서는 적중률이 조금 오르내릴 뿐 회복하지 않고, 요청 하나의 생성 속도는 10.30까지 내려갑니다.",
  "밀려난 접두를 지우지 않고 호스트 메모리에 내려 두면 다음 턴에 다시 계산하는 대신 가져올 수 있습니다. 회복 폭은 이 근거 묶음에서 측정되지 않았습니다.",
] as const;

function Square({ state }: { state: "resident" | "thrash" | "evicted" | "host" | "empty" }) {
  const cls = {
    resident: "border-primary/70 bg-primary/40",
    thrash: "border-[#b45309] bg-[#b45309]/25",
    evicted: "border-dashed border-[#b45309] bg-background",
    host: "border-[#64748b] bg-[#64748b]/30",
    empty: "border-border bg-background",
  }[state];
  return <span className={`aspect-square border ${cls}`} />;
}

function Scene({ index }: { index: number }) {
  const s = SCENES[index];
  const overflow = Math.max(0, s.agents - SLOTS);
  const thrashing = overflow > 0 && !s.host;
  const gpu = Array.from({ length: SLOTS }, (_, i) => {
    if (i >= s.agents) return "empty" as const;
    return thrashing ? ("thrash" as const) : ("resident" as const);
  });
  const outside = Array.from({ length: 10 }, (_, i) => {
    if (i >= overflow) return "empty" as const;
    return s.host ? ("host" as const) : ("evicted" as const);
  });
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:items-start sm:gap-4">
      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-3">
        <div className="border border-border bg-background p-3">
          <p className="text-xs font-bold text-foreground">GPU KV 풀</p>
          <div className="mt-2 grid grid-cols-8 gap-1" aria-hidden="true">
            {gpu.map((state, i) => (
              <Square key={i} state={state} />
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">칸 하나 = 세션 하나의 접두</p>
        </div>
        <div className={`border p-3 ${s.host ? "border-[#64748b] bg-background" : "border-dashed border-border"}`}>
          <p className="text-xs font-bold text-foreground">{s.host ? "호스트 DRAM" : "풀 밖"}</p>
          <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden="true">
            {outside.map((state, i) => (
              <Square key={i} state={state} />
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{s.host ? "내려 둔 접두" : "들어가지 못한 접두"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
        <div className="border-l-2 border-border pl-3">
          <p className="text-xs text-muted-foreground">동시 세션</p>
          <p className="mt-1 text-base font-bold tabular-nums text-foreground sm:text-lg">{s.agents}</p>
        </div>
        <div className="border-l-2 border-primary pl-3">
          <p className="text-xs text-muted-foreground">접두 적중률</p>
          <p className="mt-1 text-base font-bold tabular-nums text-foreground sm:text-lg">{s.hit}</p>
        </div>
        <div className="border-l-2 border-primary pl-3">
          <p className="text-xs text-muted-foreground">요청당 생성 tok/s</p>
          <p className="mt-1 text-base font-bold tabular-nums text-foreground sm:text-lg">{s.speed}</p>
        </div>
      </div>
    </div>
  );
}

export default function CacheThrashViz() {
  const scene = useAnimatedScenes(SCENES.length, 4200);
  return (
    <VizFrame
      eyebrow="상주와 밀어내기"
      title="세션 접두가 풀을 넘는 순간 적중률이 한꺼번에 무너집니다"
      description="Qwen3.6-27B, H100 NVL 두 장, Terminal-Bench 세션 수를 늘린 측정입니다. 칸 16개는 15개는 담고 20개는 못 담았다는 결과만 옮긴 축소 그림입니다."
      note="적중률과 속도는 arXiv 2605.26297 Table II의 저자 보고값입니다. 네 번째 장면은 대응 방향을 보여 줄 뿐 측정값이 아닙니다."
    >
      <div
        role="group"
        tabIndex={0}
        onKeyDown={scene.onKeyDown}
        aria-label="동시 세션 수에 따른 접두 적중률 붕괴와 호스트 메모리 층"
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="hidden grid-cols-4 gap-2 sm:grid">
          {SCENES.map((s, index) => (
            <div
              key={s.label}
              className={`border-t-2 px-1 py-2 text-center text-xs font-bold ${
                scene.active === index ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
        <StableSceneStack
          active={scene.active}
          className="border-border sm:mt-4 sm:border-t sm:pt-4"
          scenes={SCENES.map((s, index) => (
            <div key={s.label}>
              <Scene index={index} />
              <p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{NOTES[index]}</p>
            </div>
          ))}
        />
        <AnimatedSceneControls {...scene} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
