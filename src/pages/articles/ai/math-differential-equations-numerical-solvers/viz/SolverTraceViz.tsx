import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — fixed_grid.py의 _step_func가 (변화량, f0)를 돌려주고 solvers.py 반복문이 y1=y0+dy를 수행한다.
 * Euler 1단계 f0=−1, dy=−.5, y1=.5 / 2단계 f0=−.5, dy=−.25, y1=.25. Heun2 k1=−1, 예상 .5, k2=−.5, dy=−.375, y1=.625.
 */
type Slot = "f0" | "mid" | "dy" | "y1" | "y0";

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  range: string;
  y0: string;
  f0?: string;
  mid?: string;
  dy?: string;
  y1?: string;
  hot: Slot;
  heun?: boolean;
}[] = [
  { label: "변화율 읽기", summary: "func(0, 1) → f0 = −1", range: "0 → 0.5", y0: "1", f0: "−1", hot: "f0", note: "반복문이 현재 상태 y0=1을 _step_func에 넘기고, 그 안에서 func(t,y)가 변화율 −1을 돌려줍니다." },
  { label: "변화량 반환", summary: "dt * f0 = −0.5", range: "0 → 0.5", y0: "1", f0: "−1", dy: "−0.5", hot: "dy", note: "_step_func가 돌려주는 값은 새 상태가 아니라 변화량 −0.5와 f0입니다. −0.5를 새 상태라고 읽으면 부호부터 틀립니다." },
  { label: "상태 덧셈", summary: "y1 = y0 + dy = 0.5", range: "0 → 0.5", y0: "1", f0: "−1", dy: "−0.5", y1: "0.5", hot: "y1", note: "덧셈은 안쪽 함수가 아니라 solvers.py의 반복문이 수행합니다. 여기서 비로소 새 상태 0.5가 나옵니다." },
  { label: "다음 반복", summary: "y0 = 0.5 → y1 = 0.25", range: "0.5 → 1", y0: "0.5", f0: "−0.5", dy: "−0.25", y1: "0.25", hot: "y0", note: "반복문 끝에서 y0=y1로 저장합니다. 다음 함수 입력은 0.5이고 f0=−0.5, dy=−0.25, y1=0.25 순서가 됩니다. 수식의 아래 첨자 n을 이 변수와 시각 쌍이 맡습니다." },
  { label: "Heun2로 바꾸면", summary: "dy = −0.375 → y1 = 0.625", range: "0 → 0.5", y0: "1", f0: "−1", mid: "예상 0.5 → k2 −0.5", dy: "−0.375", y1: "0.625", hot: "mid", heun: true, note: "처음 구한 f0를 k1로 재사용하고 예상 상태 0.5에서 k2=−0.5를 구합니다. 반환 변화량은 −0.375이고 같은 반복문이 더해 0.625를 만듭니다. 바뀐 곳은 안쪽 칸뿐입니다." },
];

function Cell({ name, value, hot }: { name: string; value?: string; hot: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-1.5 ${hot ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
      <p className="break-words font-mono text-[11px] leading-4 text-muted-foreground">{name}</p>
      <p className={`mt-1 break-words font-mono text-sm leading-5 ${hot ? "font-bold text-primary" : value ? "" : "text-muted-foreground/50"}`}>{value ?? "아직 없음"}</p>
    </div>
  );
}

export default function SolverTraceViz() {
  return (
    <SceneShell
      eyebrow="코드에서 같은 숫자 따라가기"
      title="안쪽 함수는 변화량을 돌려주고 바깥 반복문이 상태를 더합니다"
      description="실제 코드를 x′=−x, y0=1, step_size=0.5에 맞춰 손으로 대입한 추적입니다. 라이브러리를 실행한 결과가 아닙니다."
      ariaLabel="반복문과 단계 함수 사이에서 상태와 변화량이 이동하는 순서"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="rounded-lg border border-border p-2 sm:p-3">
              <p className="text-xs font-bold text-muted-foreground">solvers.py · integrate 반복문</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Cell name="t0 → t1" value={scene.range} hot={false} />
                <Cell name="y0 (현재 상태)" value={scene.y0} hot={scene.hot === "y0"} />
              </div>
              <div className="mt-2 rounded-lg border border-dashed border-border p-2 sm:p-3">
                <p className="text-xs font-bold text-muted-foreground">{scene.heun ? "fixed_grid.py Heun2 → rk_common.py" : "fixed_grid.py · Euler._step_func"}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Cell name="f0 = func(t0, y0)" value={scene.f0} hot={scene.hot === "f0"} />
                  <Cell name="반환 dy (변화량)" value={scene.dy} hot={scene.hot === "dy"} />
                  <div className="col-span-2 sm:col-span-1 sm:col-start-3 sm:row-start-1">
                    {scene.heun
                      ? <Cell name="k2 계산" value={scene.mid} hot />
                      : <div className="flex h-full min-w-0 items-center rounded-lg border border-dashed border-border/60 px-2 py-2 text-xs leading-5 text-muted-foreground">Euler에는 추가 호출 없음</div>}
                  </div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1">
                <Cell name="y1 = y0 + dy (새 상태)" value={scene.y1} hot={scene.hot === "y1"} />
              </div>
            </div>
          ))}
        />
      )}
    />
  );
}
