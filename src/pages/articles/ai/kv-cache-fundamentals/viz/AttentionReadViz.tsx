import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 8절의 첫 head: q=(1,0), K=(0,c), V=(c,2c), c=1·2·3·4.
 * 한 mechanism: 점수 → 비율 → V 가중합이 왼쪽에서 오른쪽 열로 차례로 채워져 (2.5, 5)가 된다.
 */
const K = "#2563eb";
const V = "#16a34a";
const POSITIONS = [1, 2, 3, 4] as const;

const SCENES = [
  { label: "질문과 네 기록", step: 0, result: "q = (1, 0)", note: "현재 질문 q와 네 위치의 K, V를 나란히 놓습니다. 다른 KV head의 값은 이 계산에 들어오지 않습니다." },
  { label: "질문과 K로 점수 내기", step: 1, result: "점수 0·0·0·0", note: "같은 자리끼리 곱해 더합니다. 3번째 위치라면 1×0 + 0×3 = 0입니다. 폭에 따른 1/√2를 곱해도 0입니다." },
  { label: "점수를 비율로 바꾸기", step: 2, result: "비율 합계 1", note: "softmax는 점수를 양수로 바꿔 합계 1로 맞춥니다. 네 점수가 같으므로 넷 다 1/4입니다." },
  { label: "비율만큼 V 덜어 오기", step: 3, result: "(1,2)/4 … (4,8)/4", note: "각 V에 자기 비율을 곱합니다. 3번째 위치의 V (3, 6)은 (0.75, 1.5)가 됩니다." },
  { label: "모두 더해 출력 만들기", step: 4, result: "출력 (2.5, 5)", note: "오른쪽 열을 더하면 첫 성분 2.5, 둘째 성분 5입니다. 아직 현재 head 하나의 출력이며 다음 token을 고른 결과가 아닙니다." },
] as const;

const COLUMNS = ["K", "q·K", "비율", "V", "비율×V"] as const;

function Value({ on, children, color }: { on: boolean; children: string; color?: string }) {
  return (
    <span
      className={`flex h-8 min-w-0 items-center justify-center rounded-sm border text-center font-mono text-xs font-bold text-foreground transition-opacity ${on ? "opacity-100" : "opacity-15"}`}
      style={{ borderColor: color ?? "#94a3b8", backgroundColor: color ? `${color}1f` : "transparent" }}
    >
      {children}
    </span>
  );
}

export default function AttentionReadViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const step = scene.step;

  return (
    <VizFrame
      eyebrow="한 head의 읽기"
      title="왼쪽 K로 비율을 정하고 오른쪽 V를 그 비율로 합칩니다"
      description="한 줄이 한 위치입니다. 왼쪽 열부터 차례로 채워지며 마지막에 오른쪽 열을 더합니다."
      note="3절 사례의 첫 Q head입니다(가정). 위치 변환을 끝낸 K를 썼고 dropout은 넣지 않았습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="점수, 비율, V 가중합으로 출력을 계산하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.result}</span>
          </div>
          <div className="mt-3 grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)] gap-1 text-center text-xs font-bold text-muted-foreground">
            {COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          <div className="mt-1 grid gap-1">
            {POSITIONS.map((c) => (
              <div key={c} className="grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)] gap-1">
                <Value on color={K}>{`0,${c}`}</Value>
                <Value on={step >= 1}>0</Value>
                <Value on={step >= 2}>1/4</Value>
                <Value on color={V}>{`${c},${2 * c}`}</Value>
                <Value on={step >= 3} color={V}>{`${c / 4},${c / 2}`}</Value>
              </div>
            ))}
            <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)] gap-1">
              <span className="col-span-4 flex h-8 items-center justify-end pr-2 text-xs font-bold text-muted-foreground">합계</span>
              <Value on={step >= 4} color={V}>2.5,5</Value>
            </div>
          </div>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
