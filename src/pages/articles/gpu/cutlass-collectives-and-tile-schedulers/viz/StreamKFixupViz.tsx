import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stream-k — 80 iteration을 worker 8개에 10회씩 나누면 W0 = [0,10), W1 = [10,20).
 * Tile 2는 iteration 8~11(k0~k3)이라 W0이 k0·k1, W1이 k2·k3(마지막 k 구간)을 맡는다.
 * sm90 Stream-K 절차: 마지막 구간이 아닌 W0이 partial을 global workspace에 쓰고 barrier를 2(자기
 * k-iteration 수) 올린다 → W1이 barrier를 기다렸다가 partial을 읽어 더하고 epilogue를 한 번 실행한다.
 * 같은 일이 tile 7(W2·W3), 12(W4·W5), 17(W6·W7)에서도 일어난다.
 */
const ITERS = Array.from({ length: 20 }, (_, i) => i);
const W0 = "#2563eb";
const W1 = "#7c3aed";

const SCENES = [
  {
    label: "경계가 tile 2 안을 지남",
    summary: "W0: k0·k1 · W1: k2·k3",
    note: "W0은 iteration 0~9, W1은 10~19를 맡습니다. Tile 2는 iteration 8~11이라 경계 10이 그 한가운데를 지나고, tile 2의 마지막 k 구간(k2·k3)은 W1 몫입니다.",
  },
  {
    label: "W0: partial 쓰기",
    summary: "workspace ← partial · barrier 0→2",
    note: "마지막 k 구간을 맡지 않은 W0은 k0·k1까지 더한 partial accumulator를 global workspace에 쓰고, barrier를 자기 k-iteration 수인 2만큼 올립니다. W0은 tile 2의 epilogue를 실행하지 않습니다.",
  },
  {
    label: "W1: barrier 대기",
    summary: "barrier가 2에 이를 때까지",
    note: "마지막 구간을 맡은 W1은 k2·k3만 더한 자기 accumulator를 들고, barrier가 W0의 k-iteration 수 2에 이를 때까지 기다립니다. 이 그림처럼 W0이 먼저 썼다면 barrier가 이미 2라 기다림이 바로 끝납니다.",
  },
  {
    label: "W1: 읽어서 더하기",
    summary: "k0·k1 + k2·k3 = K 전체",
    note: "W1이 workspace에서 partial을 읽어 자기 accumulator에 더하면 tile 2의 K 네 구간이 모두 모입니다.",
  },
  {
    label: "epilogue 한 번",
    summary: "split tile 4개 → 같은 절차 4번",
    note: "W1만 epilogue를 한 번 실행해 D tile 2를 씁니다. Tile 7·12·17도 W2·W3, W4·W5, W6·W7 사이에서 같은 store·barrier·load를 거칩니다. 이 비용이 16.7% 절약과 비교할 대상입니다.",
  },
] as const;

function Lane({ on, title, lines, color }: { on: boolean; title: string; lines: readonly string[]; color: string }) {
  return (
    <div
      className="min-w-0 rounded-lg border bg-background px-3 py-2.5 transition-opacity duration-300 motion-reduce:transition-none"
      style={{ borderColor: on ? color : "#cbd5e1", opacity: on ? 1 : 0.45 }}
    >
      <p className="text-sm font-bold" style={{ color }}>{title}</p>
      {lines.map((line) => (
        <p key={line} className="mt-0.5 break-words font-mono text-xs leading-5">{line}</p>
      ))}
    </div>
  );
}

export default function StreamKFixupViz() {
  return (
    <SceneShell
      eyebrow="Stream-K fixup"
      title="Tile 2를 W0과 W1이 나눠 계산하면 partial을 한 번 넘겨 합칩니다"
      description="위 띠는 iteration 0~19(tile 0~4, tile마다 k0~k3)이고 색은 맡은 worker입니다. Partial accumulator는 K 일부만 더한 중간 합, barrier는 몇 iteration 몫이 workspace에 들어왔는지 세는 카운터입니다."
      ariaLabel="Stream-K에서 tile 2의 partial accumulator를 W0이 workspace에 쓰고 W1이 기다렸다 읽어 더한 뒤 epilogue를 한 번 실행하는 순서"
      scenes={SCENES}
      render={(active) => {
        const barrier = active >= 1 ? 2 : 0;
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-5 gap-1">
              {[0, 1, 2, 3, 4].map((tile) => (
                <div key={tile} className={`min-w-0 rounded-md border p-1 ${tile === 2 ? "border-rose-600" : "border-border"}`}>
                  <p className={`text-center text-[11px] font-bold ${tile === 2 ? "text-rose-700 dark:text-rose-400" : "text-muted-foreground"}`}>t{tile}</p>
                  <div className="mt-1 grid grid-cols-4 gap-0.5">
                    {ITERS.slice(tile * 4, tile * 4 + 4).map((it) => (
                      <span
                        key={it}
                        className="h-5 rounded-sm"
                        style={{ backgroundColor: it < 10 ? W0 : W1, opacity: tile === 2 ? 1 : 0.35 }}
                        title={`iteration ${it}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
              <span className="font-bold" style={{ color: W0 }}>W0 · iteration 0~9</span>
              <span className="font-bold text-foreground">경계 10</span>
              <span className="font-bold" style={{ color: W1 }}>W1 · 10~19</span>
            </div>
            <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-3">
              <Lane on={active <= 1} title="W0 · tile 2 k0·k1" lines={["acc = k0+k1", active >= 1 ? "→ workspace에 store" : "마지막 구간 아님"]} color={W0} />
              <Lane
                on={active >= 1 && active <= 3}
                title="global workspace"
                lines={[active >= 1 ? "partial(k0+k1)" : "비어 있음", `barrier = ${barrier}`]}
                color="#d97706"
              />
              <Lane
                on={active === 0 || active >= 2}
                title="W1 · tile 2 k2·k3"
                lines={[
                  active >= 3 ? "acc = k0+k1+k2+k3" : "acc = k2+k3",
                  active >= 4 ? "epilogue 1회 → D t2" : active === 3 ? "partial load + add" : active === 2 ? "barrier ≥ 2 확인" : "마지막 구간 담당",
                ]}
                color={W1}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
