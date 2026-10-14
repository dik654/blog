import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * decode token 네 개가 adapter A·B·A·C를 쓸 때 kernel이 받는 구간 표를 만든다.
 * 한 mechanism: 안정 정렬 → adapter별 개수 → 누적합 시작 위치 → 구간마다 A·B를 한 번 읽는다.
 */
const SCENES = ["token마다 adapter 번호", "번호로 안정 정렬", "개수와 시작 위치", "구간마다 한 번 읽기"] as const;

const TOKENS = [
  { id: "t0", adapter: 0 },
  { id: "t1", adapter: 1 },
  { id: "t2", adapter: 0 },
  { id: "t3", adapter: 2 },
] as const;
const NAMES = ["A", "B", "C"] as const;
const COLORS = ["#0d9488", "#2563eb", "#d97706"] as const;
const SORTED = [0, 2, 1, 3] as const;
const COUNTS = [2, 1, 1] as const;
const STARTS = [0, 2, 3, 4] as const;

const NOTES = [
  "base 행렬 곱은 네 token을 한 번에 처리합니다. 덧셈 항 x·A·B만 token마다 다른 adapter를 씁니다. 번호 열은 [0,1,0,2]입니다.",
  "같은 번호를 이웃하게 모으려고 번호로 정렬합니다. 안정 정렬이라 같은 A 안에서는 원래 순서 t0, t2가 유지됩니다.",
  "번호 0이 2개, 1이 1개, 2가 1개입니다. 개수를 누적하면 시작 위치 [0,2,3,4]가 되고 i번째 구간은 시작 위치 i부터 i+1 앞까지입니다.",
  "kernel은 구간 하나에 adapter 하나를 맡깁니다. A는 t0·t2에 한 번 읽혀 adapter 행렬을 세 번 읽습니다. 요청마다 따로 계산하면 네 번입니다.",
] as const;

export default function SegmentBatchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const order = scene === 0 ? [0, 1, 2, 3] : [...SORTED];

  return (
    <VizFrame
      eyebrow="Segmented gather"
      title="같은 adapter를 쓰는 token을 이어 붙이면 adapter 행렬을 구간마다 한 번만 읽습니다"
      description="한 줄이 decode token 하나입니다. 색은 그 token이 쓰는 adapter입니다."
      note="vLLM v0.27.1 lora_kernel_metadata.py의 정렬·개수·누적합을 같은 네 token에 적용했습니다. base 전용 token(-1)은 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="adapter별 token 구간 만들기"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid min-h-[12rem] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
            <ol className="space-y-2">
              {order.map((tokenIndex, row) => {
                const token = TOKENS[tokenIndex];
                return (
                  <li
                    key={token.id}
                    className="flex h-9 items-center justify-between rounded-sm border px-3 font-mono text-xs"
                    style={{ borderColor: COLORS[token.adapter] }}
                  >
                    <span className="text-muted-foreground">{row}</span>
                    <span className="font-bold text-foreground">{token.id}</span>
                    <span className="font-bold" style={{ color: COLORS[token.adapter] }}>
                      {NAMES[token.adapter]} · {token.adapter}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="font-mono text-xs">
              {scene === 0 ? (
                <p className="text-muted-foreground">
                  번호 열
                  <br />
                  <span className="text-sm font-bold text-foreground">[0, 1, 0, 2]</span>
                </p>
              ) : null}
              {scene === 1 ? (
                <p className="text-muted-foreground">
                  정렬된 token 위치
                  <br />
                  <span className="text-sm font-bold text-foreground">[0, 2, 1, 3]</span>
                </p>
              ) : null}
              {scene >= 2 ? (
                <dl className="space-y-2">
                  <div>
                    <dt className="text-muted-foreground">adapter id</dt>
                    <dd className="text-sm font-bold text-foreground">[0, 1, 2]</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">개수</dt>
                    <dd className="text-sm font-bold text-foreground">[{COUNTS.join(", ")}]</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">시작 위치</dt>
                    <dd className="text-sm font-bold text-foreground">[{STARTS.join(", ")}]</dd>
                  </div>
                </dl>
              ) : null}
              {scene === 3 ? (
                <p className="mt-3 border-t border-border pt-2 text-muted-foreground">
                  adapter 행렬 읽기
                  <br />
                  <span className="text-sm font-bold text-primary">3회 (요청별 4회)</span>
                </p>
              ) : null}
            </div>
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
