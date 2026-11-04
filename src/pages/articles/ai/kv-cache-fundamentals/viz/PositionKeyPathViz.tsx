import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 18~19절의 q=(1,0), W_K=(0,1)에 위치마다 0·90·180·270도 회전을 넣는 설명용 사례다(가정).
 * 한 mechanism: 위치마다 값이 달라져 변환을 하나로 합칠 수 없으므로 위치 key를 별도 숫자로 저장한다.
 */
const K = "#2563eb";
const C = "#7c3aed";
const R = "#d97706";

const ROWS = [
  { position: 1, angle: "0°", rotated: "0,1", factor: "0" },
  { position: 2, angle: "90°", rotated: "-1,0", factor: "-1" },
  { position: 3, angle: "180°", rotated: "0,-1", factor: "0" },
  { position: 4, angle: "270°", rotated: "1,0", factor: "1" },
] as const;

const SCENES = [
  { label: "회전이 없을 때", step: 0, result: "곱할 값 하나: 0", note: "19절처럼 K 쪽 변환 (0,1)을 질문 쪽으로 옮기면 값 하나가 나옵니다. 모든 위치의 c에 같은 값을 곱하면 됩니다." },
  { label: "위치마다 다른 회전", step: 1, result: "곱할 값 0·-1·0·1", note: "회전을 넣으면 위치마다 K 변환의 방향이 달라지고, 질문과 곱한 값도 위치마다 달라집니다." },
  { label: "값 하나로 합칠 수 없음", step: 2, result: "값 하나로 불가", note: "c 앞에 곱할 값이 네 위치에서 같지 않으므로 질문 쪽 변환 하나에 흡수할 수 없습니다." },
  { label: "위치 key를 따로 저장", step: 3, result: "c 1개 + key 1개", note: "내용은 c로 두고 회전을 받는 위치 key를 숫자 하나 더 저장합니다. 회전은 이 경로에만 적용합니다." },
  { label: "저장량 비교", step: 4, result: "8byte → 16byte", note: "위치마다 숫자 2개 × 2byte = 4byte이고 네 위치는 16byte입니다. c만 셌던 8byte의 두 배입니다." },
] as const;

function Cell({ children, color, on = true }: { children: string; color?: string; on?: boolean }) {
  return (
    <span
      className={`flex h-8 min-w-0 items-center justify-center rounded-sm border font-mono text-xs font-bold text-foreground transition-opacity ${on ? "opacity-100" : "opacity-15"}`}
      style={{ borderColor: color ?? "#94a3b8", backgroundColor: color ? `${color}1f` : "transparent" }}
    >
      {children}
    </span>
  );
}

export default function PositionKeyPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const step = scene.step;
  const rotated = step === 1 || step === 2;
  const stored = step >= 3;

  return (
    <VizFrame
      eyebrow="위치 회전과 저장"
      title="위치마다 달라지는 값은 질문 쪽으로 옮길 수 없어 따로 남깁니다"
      description="한 줄이 한 위치입니다. 앞 장면은 c 앞에 곱할 값을, 뒤 장면은 실제로 저장하는 숫자를 보여 줍니다."
      note="회전 각도와 위치 key 폭 1은 식을 적용해 보려는 가정입니다(가정). 실제 DeepSeek의 폭이나 회전 방식, 성능이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="위치 회전이 흡수를 막는 이유와 위치 key의 저장량"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.result}</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs font-bold text-muted-foreground">
            <span>위치</span>
            <span>{stored ? "저장 c" : "회전"}</span>
            <span>{stored ? "위치 key" : "K 변환"}</span>
            <span>{stored ? "byte" : "q와 곱한 값"}</span>
          </div>
          <div className="mt-1 grid gap-1">
            {ROWS.map((row) => (
              <div key={row.position} className="grid grid-cols-4 gap-1">
                <Cell>{String(row.position)}</Cell>
                {stored ? (
                  <>
                    <Cell color={C}>{String(row.position)}</Cell>
                    <Cell color={R}>{`r${row.position}`}</Cell>
                    <Cell>{step === 4 ? "2 + 2" : "—"}</Cell>
                  </>
                ) : (
                  <>
                    <Cell on={rotated}>{row.angle}</Cell>
                    <Cell color={K}>{rotated ? row.rotated : "0,1"}</Cell>
                    <Cell color={step === 2 ? R : undefined}>{rotated ? row.factor : "0"}</Cell>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
