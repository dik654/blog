import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dropout-embedding 두 번째 문단 — Embedding은 ID에 해당하는 weight 행을 고르는 lookup이고,
 * backward는 forward의 ID를 기억했다가 해당 행에 gradient를 scatter-add하며 반복 ID는 합산한다.
 * 가정: weight 4행(W₀~W₃), 입력 ID [2, 0, 2], 위에서 내려온 gradient [0.1, 0.2, 0.3].
 * 산술: 행 2 = 0.1 + 0.3 = 0.4, 행 0 = 0.2, 행 1·3 = 0. 덮어쓰기라면 행 2 = 0.3.
 */
const IDS = [2, 0, 2] as const;
const GRADS = ["0.1", "0.2", "0.3"] as const;
const ROWS = [0, 1, 2, 3] as const;

const SCENES = [
  {
    label: "one-hot 곱으로 보면",
    summary: "[0, 0, 1, 0] × W = W₂",
    note: "ID 2를 one-hot vector [0, 0, 1, 0]으로 바꿔 weight 행렬 W와 곱하면 네 행에 각각 0·0·1·0을 곱해 더하게 됩니다. 남는 것은 행 W₂ 하나뿐이고 나머지 계산은 모두 0을 만드는 데 쓰입니다.",
  },
  {
    label: "lookup",
    summary: "ID [2, 0, 2] → [W₂, W₀, W₂]",
    note: "Embedding은 곱셈 없이 해당 행만 읽습니다. 입력이 [2, 0, 2]이면 출력은 [W₂, W₀, W₂]이고 결과는 one-hot 곱과 같습니다. backward를 위해 이 ID 목록을 기억해 둡니다.",
  },
  {
    label: "backward scatter-add",
    summary: "행 2 = 0.1 + 0.3 = 0.4",
    note: "세 위치에 gradient 0.1, 0.2, 0.3이 내려왔다고 가정합니다. 기억한 ID대로 돌려보내면 ID 2가 두 번 나왔으므로 행 2에는 0.1과 0.3을 더한 0.4가, 행 0에는 0.2가 쌓입니다. 한 번도 쓰이지 않은 행 1과 3의 gradient는 0입니다.",
  },
  {
    label: "더하지 않고 덮어쓰면",
    summary: "행 2 = 0.3 (0.1이 사라짐)",
    note: "비교용 오답입니다. 같은 행에 값을 더하지 않고 대입하면 마지막에 온 0.3만 남고 첫 번째 위치의 기여 0.1이 사라집니다. 반복 ID fixture가 잡아야 하는 차이입니다.",
  },
] as const;

export default function EmbeddingScatterViz() {
  return (
    <SceneShell
      eyebrow="Embedding"
      title="같은 ID가 두 번 나오면 gradient도 같은 행에 두 번 쌓입니다"
      description="왼쪽은 weight 행 4개, 오른쪽은 입력 ID 세 개입니다. 행 수, ID 목록과 gradient 값은 설명용 가정입니다."
      ariaLabel="Embedding lookup과 반복 ID의 gradient scatter-add"
      scenes={SCENES}
      render={(active) => {
        const rowGrad = (row: number) => {
          if (active < 2) return "";
          if (row === 2) return active === 2 ? "0.1 + 0.3 = 0.4" : "0.3 (덮어씀)";
          if (row === 0) return "0.2";
          return "0";
        };
        const selected = (row: number) => (active === 0 ? row === 2 : IDS.some((id) => id === row));
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 sm:gap-6">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground">weight W</span>
              <div className="mt-1 space-y-1">
                {ROWS.map((row) => {
                  const on = selected(row);
                  const bad = active === 3 && row === 2;
                  return (
                    <div key={row} className={`flex min-h-10 flex-wrap items-center justify-between gap-x-1 rounded border px-1.5 py-0.5 text-xs ${bad ? "border-amber-600" : on ? "border-primary" : "border-border"}`}>
                      <span className={`font-mono font-bold ${on ? "text-primary" : "text-muted-foreground"}`}>W{["₀", "₁", "₂", "₃"][row]}</span>
                      <span className={`text-right font-mono text-[11px] leading-4 ${bad ? "font-semibold text-amber-700 dark:text-amber-300" : "text-foreground"}`}>
                        {active === 0 ? `× ${row === 2 ? 1 : 0}` : rowGrad(row) ? `grad ${rowGrad(row)}` : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground">{active === 0 ? "one-hot 입력" : "입력 위치"}</span>
              <div className="mt-1 space-y-1">
                {active === 0 ? (
                  <div className="flex min-h-10 items-center rounded border border-primary px-1.5 font-mono text-[11px] text-primary">ID 2 → [0, 0, 1, 0]</div>
                ) : (
                  IDS.map((id, pos) => (
                    <div key={pos} className={`flex min-h-10 flex-wrap items-center justify-between gap-x-1 rounded border px-1.5 py-0.5 font-mono text-[11px] leading-4 ${id === 2 ? "border-primary" : "border-border"}`}>
                      <span className="whitespace-nowrap">{`ID ${id} → W${id === 2 ? "₂" : "₀"}`}</span>
                      <span className={`whitespace-nowrap ${active >= 2 ? "text-primary" : "text-muted-foreground/50"}`}>{active >= 2 ? `g ${GRADS[pos]}` : "g ?"}</span>
                    </div>
                  ))
                )}
                {active === 0 && (
                  <>
                    <div className="min-h-10" />
                    <div className="min-h-10" />
                  </>
                )}
                <div className="min-h-8 pt-1 text-[11px] leading-4 text-muted-foreground">
                  {active === 0 ? "곱 4번 중 3번이 0" : active === 1 ? "ID 목록을 backward용으로 기억" : active === 2 ? "ID대로 행에 더하기" : "대입이면 마지막 값만 남음"}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
