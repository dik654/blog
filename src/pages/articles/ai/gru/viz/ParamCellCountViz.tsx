import SceneShell from "./SceneShell";

/**
 * 본문 대응: "같은 input·hidden 크기에서 GRU와 LSTM의 parameter·state 예산" 식과 해석(D=3, H=2).
 * affine block 하나 = 출력 H행 × (input D + 이전 hidden H + bias 1)열 = 2×6 = 12칸.
 * GRU 3 block = 36, state h 2칸. LSTM 4 block = 48, state C·h 4칸.
 */
const D = 3;
const HID = 2;
const COLS = D + HID + 1;
const BLOCK = HID * COLS;

const COLUMN_KIND = [
  ...Array.from({ length: D }, (_, i) => ({ key: `x${i + 1}`, label: `x${i + 1}`, kind: "input" as const })),
  ...Array.from({ length: HID }, (_, i) => ({ key: `h${i + 1}`, label: `h${i + 1}`, kind: "hidden" as const })),
  { key: "b", label: "b", kind: "bias" as const },
];

const KIND_CLASS = {
  input: "border-blue-600/60 bg-blue-600/15",
  hidden: "border-amber-600/60 bg-amber-600/15",
  bias: "border-slate-500/60 bg-slate-500/15",
} as const;

const BLOCK_NAMES: readonly (readonly string[])[] = [
  ["block 1", "block 2", "block 3", "block 4"],
  ["reset", "update", "candidate", "없음"],
  ["forget", "input", "candidate", "output"],
];
const ACTIVE_BLOCKS: readonly number[] = [1, 3, 4];
const STATE_CELLS: readonly { label: string; cells: number }[] = [
  { label: "", cells: 0 },
  { label: "h", cells: HID },
  { label: "C · h", cells: 2 * HID },
];

const SCENES = [
  {
    label: "affine block 하나",
    summary: `${HID} × (${D}+${HID}+1) = ${BLOCK}`,
    note: `block 하나는 현재 input ${D}개와 이전 hidden ${HID}개, bias 1개를 받아 값 ${HID}개를 만듭니다. 출력 하나마다 가중치 ${COLS}개가 필요하므로 ${HID}행 × ${COLS}열 = ${BLOCK}칸입니다.`,
  },
  {
    label: "GRU: block 3개",
    summary: `3 × ${BLOCK} = ${3 * BLOCK} · state ${HID}칸`,
    note: `reset·update·candidate가 같은 모양의 block을 하나씩 가지므로 parameter는 ${3 * BLOCK}개입니다. 다음 timestep으로 넘기는 state는 hidden h ${HID}개뿐입니다.`,
  },
  {
    label: "LSTM: block 4개",
    summary: `4 × ${BLOCK} = ${4 * BLOCK} · state ${2 * HID}칸`,
    note: `forget·input·candidate·output으로 block이 하나 더 있어 ${4 * BLOCK}개이고, cell C와 hidden h를 함께 넘기므로 state가 ${2 * HID}칸입니다. 한 칸의 byte 수 B를 곱하면 state memory가 됩니다.`,
  },
] as const;

function Block({ name, on, showHeads }: { name: string; on: boolean; showHeads: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${on ? "border-border bg-background" : "border-dashed border-border/50"}`}>
      <p className={`text-center text-[11px] font-bold ${on ? "" : "text-muted-foreground/60"}`}>{name}</p>
      <div className={`mx-auto mt-1.5 grid w-fit gap-0.5 ${on ? "" : "opacity-15"}`} style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {COLUMN_KIND.map((col) => (
          <span key={`head-${col.key}`} className={`text-center font-mono text-[9px] leading-3 text-muted-foreground ${showHeads ? "" : "invisible"}`}>
            {col.label}
          </span>
        ))}
        {Array.from({ length: HID }, (_, row) =>
          COLUMN_KIND.map((col) => <span key={`${row}-${col.key}`} className={`block size-3.5 rounded-sm border sm:size-4 ${KIND_CLASS[col.kind]}`} />),
        )}
      </div>
    </div>
  );
}

export default function ParamCellCountViz() {
  return (
    <SceneShell
      eyebrow="Parameter를 칸으로 세기"
      title="같은 D=3, H=2에서 GRU는 36칸, LSTM은 48칸입니다"
      description="작은 사각형 하나가 학습 parameter 하나입니다. 행은 block이 만드는 출력 H개, 열은 그 출력 하나가 보는 input D개·이전 hidden H개·bias 1개입니다. 아래 줄은 timestep마다 넘기는 recurrent state의 원소 수입니다."
      ariaLabel="D가 3이고 H가 2일 때 affine block 하나, GRU 세 block, LSTM 네 block의 parameter 칸 수와 state 칸 수"
      scenes={SCENES}
      render={(active) => {
        const names = BLOCK_NAMES[active];
        const state = STATE_CELLS[active];
        const total = ACTIVE_BLOCKS[active] * BLOCK;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {names.map((name, i) => (
                <Block key={i} name={name} on={i < ACTIVE_BLOCKS[active]} showHeads={i === 0 || active > 0} />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className={`size-3 rounded-sm border ${KIND_CLASS.input}`} />input x (D열)</span>
              <span className="inline-flex items-center gap-1"><span className={`size-3 rounded-sm border ${KIND_CLASS.hidden}`} />이전 hidden h (H열)</span>
              <span className="inline-flex items-center gap-1"><span className={`size-3 rounded-sm border ${KIND_CLASS.bias}`} />bias b (1열)</span>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">넘기는 recurrent state (원소 수)</p>
                <div className="mt-1 flex min-h-5 items-center gap-1">
                  {state.cells === 0 ? (
                    <span className="text-xs text-muted-foreground">block 하나만 볼 때는 세지 않음</span>
                  ) : (
                    <>
                      <span className="mr-1 font-mono text-xs font-bold">{state.label}</span>
                      {Array.from({ length: state.cells }, (_, i) => (
                        <span key={i} className="block size-4 rounded-sm border border-primary/60 bg-primary/15" />
                      ))}
                    </>
                  )}
                </div>
              </div>
              <p className="text-right text-[11px] text-muted-foreground">parameter 합계<span className="block font-mono text-sm font-bold text-primary">{total}칸</span></p>
            </div>
          </div>
        );
      }}
    />
  );
}
