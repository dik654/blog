import RecoverySceneShell from "./RecoverySceneShell";

/**
 * 본문 대응: #mask-invariant — 제거한 위치 i 하나를 두 step 따라간다.
 * 위 줄 = gradient만 0으로 만든 경우, 아래 줄 = update 뒤 W와 U에 같은 mask를 다시 곱한 경우.
 * 숫자는 모두 가정: momentum optimizer U←βU+g, W←W−ηU, β=0.9, η=0.1, 제거 직전 U[i]=0.5,
 * 아래 줄의 gradient g[i]=0.3.
 * 위 줄: U1=0.45, W1=−0.045 / U2=0.405, W2=−0.0855.
 * 아래 줄: 후보 U1=0.75, W1=−0.075 → 둘 다 0 / 후보 U2=0.3, W2=−0.03 → 둘 다 0.
 */
interface Cell {
  w: string;
  wRaw: number;
  wNote: string;
  u: string;
  uNote: string;
}

const START: Cell = { w: "0", wRaw: 0, wNote: "제거 직후", u: "0.5", uNote: "pruning 전에 쌓임" };

const GRAD_ONLY: readonly Cell[] = [
  START,
  { w: "−0.045", wRaw: -0.045, wNote: "0 − 0.1×0.45", u: "0.45", uNote: "0.9×0.5 + 0" },
  { w: "−0.0855", wRaw: -0.0855, wNote: "−0.045 − 0.1×0.405", u: "0.405", uNote: "0.9×0.45 + 0" },
];

const MASK_BOTH: readonly Cell[] = [
  START,
  { w: "0", wRaw: 0, wNote: "후보 −0.075 → mask", u: "0", uNote: "후보 0.75 → mask" },
  { w: "0", wRaw: 0, wNote: "후보 −0.03 → mask", u: "0", uNote: "후보 0.3 → mask" },
];

const SCENES: readonly { label: string; summary: string; note: string; top: number; bottom: number }[] = [
  { label: "제거 직후", summary: "W[i]=0 · U[i]=0.5", note: "M[i]=0인 위치의 weight는 0이 됐지만, pruning 전 학습에서 쌓인 momentum U[i]는 아직 0.5로 남아 있다고 가정합니다.", top: 0, bottom: 0 },
  { label: "Gradient만 0 · step 1", summary: "W[i] = −0.045", note: "Gradient를 0으로 막아도 U는 0.9×0.5=0.45로만 줄어듭니다. 이 값이 weight를 0.1×0.45만큼 움직여 제거한 연결이 되살아납니다.", top: 1, bottom: 0 },
  { label: "Gradient만 0 · step 2", summary: "W[i] = −0.0855", note: "과거 state가 매 step 남아 있어 W[i]는 0에서 더 멀어집니다. Gradient만 막는 것으로는 제거 결정을 지키지 못합니다.", top: 2, bottom: 0 },
  { label: "W·U 모두 mask · step 1", summary: "후보 −0.075 → 0", note: "Gradient g[i]=0.3이 와도(가정) optimizer는 일단 후보 U=0.75, W=−0.075를 계산합니다. 그 다음 같은 mask를 W와 U 둘 다에 곱해 0으로 봉인합니다.", top: 2, bottom: 1 },
  { label: "W·U 모두 mask · step 2", summary: "W[i]=0 · U[i]=0", note: "U가 이미 0이라 다음 후보는 이번 gradient만 반영한 W=−0.03이고, 이것도 mask로 다시 0이 됩니다. M[i]=0이면 update 전 값과 무관하게 다음 W[i]와 U[i]는 0입니다.", top: 2, bottom: 2 },
];

function Bar({ value }: { value: number }) {
  const width = Math.min(Math.abs(value) / 0.1, 1) * 100;
  return (
    <div className="mt-1 h-2 w-full rounded-sm bg-muted/50" aria-hidden>
      <div className="h-full rounded-sm" style={{ width: `${width}%`, backgroundColor: value === 0 ? "#94a3b8" : "#dc2626" }} />
    </div>
  );
}

function Row({ title, cells, shown }: { title: string; cells: readonly Cell[]; shown: number }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-xs font-bold">{title}</p>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        {cells.map((cell, step) => {
          const visible = step <= shown;
          const revived = cell.wRaw !== 0;
          return (
            <div
              key={step}
              className={`min-w-0 rounded-lg border px-2 py-2 text-[11px] leading-4 sm:text-xs sm:leading-5 ${
                visible ? (revived ? "border-red-600 bg-background" : "border-border bg-background") : "border-dashed border-border/50"
              }`}
            >
              <p className="font-mono text-[10px] text-muted-foreground">step {step}</p>
              <div className={visible ? "" : "invisible"}>
                <p className="mt-0.5 break-words font-mono font-bold">W[i] {cell.w}</p>
                <Bar value={cell.wRaw} />
                <p className="mt-0.5 break-words text-muted-foreground">{cell.wNote}</p>
                <p className="mt-1.5 break-words font-mono font-bold">U[i] {cell.u}</p>
                <p className="mt-0.5 break-words text-muted-foreground">{cell.uNote}</p>
                <p className={`mt-1 font-semibold ${revived ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{revived ? "되살아남" : "0 유지"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MaskStateViz() {
  return (
    <RecoverySceneShell
      eyebrow="Fixed-mask recovery"
      title="제거한 위치 하나를 두 step 따라가 봅니다"
      description="Momentum은 지난 update 방향을 기억해 다음 update에 더하는 optimizer state입니다. 여기서는 momentum optimizer U←0.9U+g, W←W−0.1U와 제거 직전 U[i]=0.5를 가정하고, 막대는 W[i]가 0에서 얼마나 멀어졌는지 보여 줍니다."
      ariaLabel="Gradient만 0으로 만든 경우와 weight와 state 모두에 mask를 곱한 경우의 두 step 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active] ?? SCENES[0];
        return (
          <div className="min-w-0 space-y-4">
            <Row title="Gradient만 0으로 만들 때" cells={GRAD_ONLY} shown={scene.top} />
            <Row title="Update 뒤 W와 U에 같은 mask를 곱할 때" cells={MASK_BOTH} shown={scene.bottom} />
          </div>
        );
      }}
    />
  );
}
