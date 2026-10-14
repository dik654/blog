import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * n_ctx 16,384 cell을 slot 4개가 나눠 쓰는 두 방식을 같은 눈금의 막대로 그린다.
 * 한 mechanism: per-slot stream은 칸막이가 상한이 되고, unified stream은 한 대화가 남의 자리까지 차지할 수 있다.
 */
const SCENES = ["slot별 칸막이", "칸막이 없는 한 배열", "긴 대화 하나가 독차지", "unified의 mask 폭"] as const;

const TOTAL = 16384;
const SLOT = 4096;

interface Bar {
  label: string;
  cells: number;
  color: string;
  fail?: boolean;
}

interface State {
  slots?: Bar[];
  unified?: Bar[];
  maskEdge?: number;
  verdict: string;
}

const STATES: readonly State[] = [
  {
    slots: [
      { label: "문서 6,000 → 4,096 상한 초과", cells: 4096, color: "bg-rose-500/40", fail: true },
      { label: "500", cells: 500, color: "bg-blue-600" },
      { label: "500", cells: 500, color: "bg-teal-600" },
      { label: "500", cells: 500, color: "bg-amber-500" },
    ],
    verdict: "slot 0 실패 · 사용 1,500 / 16,384",
  },
  {
    unified: [
      { label: "문서 6,000", cells: 6000, color: "bg-violet-600" },
      { label: "500", cells: 500, color: "bg-blue-600" },
      { label: "500", cells: 500, color: "bg-teal-600" },
      { label: "500", cells: 500, color: "bg-amber-500" },
    ],
    verdict: "모두 성공 · 사용 7,500 / 16,384",
  },
  {
    unified: [
      { label: "긴 대화 15,000", cells: 15000, color: "bg-violet-600" },
      { label: "500", cells: 500, color: "bg-blue-600" },
      { label: "500", cells: 500, color: "bg-teal-600" },
    ],
    verdict: "남은 384 cell · 500짜리 셋째 요청이 실패",
  },
  {
    unified: [
      { label: "문서 6,000", cells: 6000, color: "bg-violet-600" },
      { label: "500", cells: 500, color: "bg-blue-600" },
      { label: "500", cells: 500, color: "bg-teal-600" },
      { label: "500", cells: 500, color: "bg-amber-500" },
      { label: "padding 180", cells: 180, color: "bg-muted-foreground/40" },
    ],
    maskEdge: 7680,
    verdict: "n_kv 7,680 · query 4개 × 7,680칸 중 7,500칸만 0",
  },
];

const NOTES = [
  "-np 4에 unified를 끄면 한 slot의 상한은 16,384 ÷ 4 = 4,096입니다. 6,000 token 문서는 다른 세 slot이 거의 비어 있어도 들어가지 못합니다.",
  "unified 배열 하나에서는 칸막이가 없어 6,000 + 3 × 500 = 7,500 cell이 그대로 들어갑니다. 남은 8,884 cell은 다음 요청이 씁니다.",
  "같은 배열에서 한 대화가 15,000 cell을 쥐면 1,384만 남습니다. 500짜리 두 개가 들어간 뒤 셋째가 자리를 못 찾고, 쥔 cell을 빼앗는 선점은 없습니다.",
  "unified decode step은 used_max_p1 7,500을 256 단위로 올린 7,680칸을 읽습니다. 각 query는 자기 대화의 cell만 0으로 남기고 나머지는 −∞입니다.",
] as const;

function pct(cells: number, total: number) {
  return `${(cells / total) * 100}%`;
}

export default function KvStreamSplitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const state = STATES[scene];

  return (
    <VizFrame
      eyebrow="KV stream"
      title="칸막이는 긴 요청을 막고, 칸막이가 없으면 긴 요청이 남을 막습니다"
      description="막대 전체 폭이 n_ctx 16,384 cell입니다. 첫 장면은 slot마다 4,096칸씩 나눈 배열, 나머지는 하나로 합친 배열입니다."
      note="slot 4개, 문서 6,000 token, 짧은 대화 500 token은 설명용 가정입니다. prompt cache와 context shift는 켜지 않았다고 둡니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV stream 분할 방식 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 min-h-[14rem] sm:min-h-[9.5rem]">
            {state.slots ? (
              <div className="flex h-10 w-full gap-1">
                {state.slots.map((bar, slot) => (
                  <div key={slot} className="relative h-full flex-1 rounded-sm border border-dashed border-muted-foreground/50">
                    <div className={`h-full rounded-sm ${bar.color}`} style={{ width: pct(Math.min(bar.cells, SLOT), SLOT) }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative flex h-10 w-full overflow-hidden rounded-sm border border-muted-foreground/50">
                {state.unified?.map((bar, index) => (
                  <div key={index} className={`h-full border-r border-background ${bar.color}`} style={{ width: pct(bar.cells, TOTAL) }} />
                ))}
                {state.maskEdge ? (
                  <div className="absolute inset-y-0 border-r border-dashed border-rose-600" style={{ left: pct(state.maskEdge, TOTAL) }} />
                ) : null}
              </div>
            )}

            <ul className="mt-3 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
              {(state.slots ?? state.unified ?? []).map((bar, index) => (
                <li key={index} className={`flex items-center gap-2 ${bar.fail ? "text-rose-600" : "text-muted-foreground"}`}>
                  <span className={`inline-block size-2.5 shrink-0 ${bar.color}`} />
                  {state.slots ? `slot ${index} · ` : ""}
                  {bar.label}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-xs font-bold text-foreground">{state.verdict}</p>
          </div>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
