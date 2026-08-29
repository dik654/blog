import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 새 token 의 query 가 과거 latent 캐시와 흡수된 weight 로 직접 만나는 동안
 * k_t^C, v_t^C 가 단 한 번도 만들어지지 않는 과정. d_c=512, d_h^R=64, d_h=128 예시를 쓴다.
 * stage 높이는 네 장면의 최대 필요 크기로 고정한다.
 */
const SCENES = ["latent 압축·캐시", "query 흡수", "content+위치 점수", "출력 흡수"] as const;

type CacheSlot = { id: string; label: string; sub: string };
const CACHE_SLOTS: readonly CacheSlot[] = [
  { id: "c1", label: "c₁ᴷⱽ", sub: "512" },
  { id: "c2", label: "c₂ᴷⱽ", sub: "512" },
  { id: "c3", label: "c₃ᴷⱽ", sub: "512" },
  { id: "ct", label: "cₜᴷⱽ", sub: "512" },
];

type SceneState = {
  newCache: readonly string[];
  materializedKV: string;
  foldedQuery: string;
  scoreContent: string;
  scorePosition: string;
  weightedSum: string;
  output: string;
  changed: readonly string[];
  dims: string;
};

const STATES: readonly SceneState[] = [
  {
    newCache: ["ct"],
    materializedKV: "없음 — k_t^C, v_t^C 는 이 시점에도 만들지 않음",
    foldedQuery: "—",
    scoreContent: "—",
    scorePosition: "—",
    weightedSum: "—",
    output: "—",
    changed: ["newCache"],
    dims: "c_t^KV = W^DKV h_t  (5120 → 512)",
  },
  {
    newCache: [],
    materializedKV: "없음 — W^UK 는 latent 를 펼치지 않고 query 쪽으로 옮겨 곱함",
    foldedQuery: "q'_t = (W^UK)ᵀ q_t^C  (128 → 512차원, head당 1회)",
    scoreContent: "—",
    scorePosition: "—",
    weightedSum: "—",
    output: "—",
    changed: ["foldedQuery"],
    dims: "head 당 512×128 곱셈 1회, 과거 token 수와 무관",
  },
  {
    newCache: [],
    materializedKV: "없음",
    foldedQuery: "q'_t (재사용)",
    scoreContent: "q'_t · cⱼᴷⱽ  (512차원 내적, j=1..t)",
    scorePosition: "q_t^R · kⱼᴿ  (64차원 내적, j=1..t)",
    weightedSum: "—",
    output: "—",
    changed: ["scoreContent", "scorePosition"],
    dims: "score_j = content 내적 + 위치 내적",
  },
  {
    newCache: [],
    materializedKV: "없음 — v_j^C 도 끝까지 만들어지지 않음",
    foldedQuery: "q'_t (재사용)",
    scoreContent: "softmax 완료 → p_j",
    scorePosition: "softmax 완료 → p_j",
    weightedSum: "Σ p_j cⱼᴷⱽ  (512차원, latent 공간)",
    output: "out = (W^O W^UV) Σ p_j cⱼᴷⱽ  (512 → 5120)",
    changed: ["weightedSum", "output"],
    dims: "value-side absorption: 마지막에 한 번만 model 차원으로",
  },
];

const NOTES = [
  "새 token 의 hidden state 를 down-projection 하나로 512차원 latent 로 눌러 캐시에 추가합니다. Key·value 는 아직, 그리고 앞으로도 원래 크기로 복원되지 않습니다.",
  "Query 를 up-projection W^UK 의 전치로 미리 접어 512차원 latent 공간으로 옮깁니다. 이 계산은 head당 한 번뿐이고 과거 token 수가 늘어도 반복되지 않습니다.",
  "접힌 query 가 캐시된 latent 각각과 내적해 content 점수를, 위치 query·key 가 따로 내적해 위치 점수를 만듭니다. 두 점수는 더해져 하나의 attention score 가 됩니다.",
  "Attention 가중치로 latent 를 그대로 가중합한 뒤, 미리 곱해 둔 W^O W^UV 하나로 model 차원까지 한 번에 보냅니다. k_t^C, v_t^C 는 이 전체 과정에서 한 번도 존재하지 않았습니다.",
] as const;

export default function MultiHeadLatentAttentionMechanicsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const state = STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="MLA decode · weight absorption"
      title="Query 가 흡수된 weight 로 접혀 latent 캐시와 직접 만나고, key·value 는 끝까지 복원되지 않습니다"
      description="새 token 하나가 decode 되는 동안 캐시(왼쪽)와 계산 상태(오른쪽)가 어떻게 바뀌는지 보여 줍니다. 숫자는 DeepSeek-V2 236B 설정(d_c=512, d_h=128, d_h^R=64)입니다."
      note="실제로는 head 128개가 병렬로 같은 과정을 반복합니다. 그림은 head 하나와 과거 token 세 개로 줄였습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="MLA weight absorption 이 latent 캐시와 만나는 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(38rem,calc(100dvh-15rem))] min-h-[30rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.7fr]">
            <div className="min-w-0 border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">Latent 캐시 (KV cache)</p>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {CACHE_SLOTS.map((slot) => {
                  const isNew = state.newCache.includes(slot.id);
                  return (
                    <div
                      key={slot.id}
                      className={`flex min-h-10 items-center justify-between border px-2 font-mono text-xs ${
                        isNew
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-primary/40 text-foreground"
                      }`}
                    >
                      <span className="font-bold">{slot.label}</span>
                      <span className="text-[10px] text-muted-foreground">{slot.sub}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 border-t border-dashed border-border pt-2 font-mono text-[10px] leading-4 text-muted-foreground">
                head별 k_t^C, v_t^C (128×128): {state.materializedKV}
              </p>
            </div>

            <div className="min-w-0 border border-primary/50 p-3">
              <p className="text-[11px] font-bold text-primary">계산 상태 (head 하나 기준)</p>
              <div className="mt-3 space-y-1.5">
                <div
                  className={`flex min-h-9 items-center justify-between gap-3 border px-2 text-xs ${
                    state.changed.includes("foldedQuery") ? "border-amber-600 bg-amber-500/5 text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="shrink-0">흡수된 query q'_t</span>
                  <span className="truncate font-mono text-right">{state.foldedQuery}</span>
                </div>
                <div
                  className={`flex min-h-9 items-center justify-between gap-3 border px-2 text-xs ${
                    state.changed.includes("scoreContent") ? "border-amber-600 bg-amber-500/5 text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="shrink-0">content 점수</span>
                  <span className="truncate font-mono text-right">{state.scoreContent}</span>
                </div>
                <div
                  className={`flex min-h-9 items-center justify-between gap-3 border px-2 text-xs ${
                    state.changed.includes("scorePosition") ? "border-amber-600 bg-amber-500/5 text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="shrink-0">위치 점수</span>
                  <span className="truncate font-mono text-right">{state.scorePosition}</span>
                </div>
                <div
                  className={`flex min-h-9 items-center justify-between gap-3 border px-2 text-xs ${
                    state.changed.includes("weightedSum") ? "border-amber-600 bg-amber-500/5 text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="shrink-0">latent 가중합</span>
                  <span className="truncate font-mono text-right">{state.weightedSum}</span>
                </div>
                <div
                  className={`flex min-h-9 items-center justify-between gap-3 border px-2 text-xs ${
                    state.changed.includes("output") ? "border-amber-600 bg-amber-500/5 text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="shrink-0">출력 (흡수된 W^O W^UV)</span>
                  <span className="truncate font-mono text-right">{state.output}</span>
                </div>
              </div>
              <p className="mt-3 border-t border-dashed border-border pt-2 font-mono text-[10px] leading-4 text-muted-foreground">
                {state.dims}
              </p>
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
