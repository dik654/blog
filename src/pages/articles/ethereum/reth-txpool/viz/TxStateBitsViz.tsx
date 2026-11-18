import SceneShell from "./TxpoolSceneShell";

/**
 * 본문 대응: #classification — TxState 비트(NO_NONCE_GAPS·ENOUGH_BALANCE·ENOUGH_FEE_CAP_BLOCK)로 기다리는 이유를 보존하고,
 * head가 바뀌면 영향을 받은 sender와 fee 조건만 다시 계산한다.
 * Alice canonical nonce 7, T7 max fee 40 gwei, 다음 base fee 42 gwei는 본문 예시. T7 balance 충분, base fee가 40 이하로 내려가는 장면은 설명용 가정.
 * T8의 balance·fee는 본문에 없으므로 "?"로 둔다.
 */
type Mark = "yes" | "no" | "unknown";
interface Row {
  tx: string;
  bits: readonly Mark[];
  ancestor: string;
  pool: string;
  /** 이 장면에서 다시 계산한 칸 */
  changed: boolean;
}

const BIT_NAMES: readonly { label: string; code: string }[] = [
  { label: "nonce 빈칸 없음", code: "NO_NONCE_GAPS" },
  { label: "balance 충분", code: "ENOUGH_BALANCE" },
  { label: "max fee ≥ base fee", code: "ENOUGH_FEE_CAP_BLOCK" },
];

const STATES: readonly (readonly Row[])[] = [
  [
    { tx: "Alice T7", bits: ["yes", "yes", "no"], ancestor: "없음", pool: "BaseFee", changed: false },
    { tx: "Alice T8", bits: ["yes", "unknown", "unknown"], ancestor: "T7 · BaseFee", pool: "Queued", changed: false },
    { tx: "Bob T4", bits: ["yes", "yes", "yes"], ancestor: "없음", pool: "Pending", changed: false },
  ],
  [
    { tx: "Alice T7", bits: ["yes", "yes", "yes"], ancestor: "없음", pool: "Pending", changed: true },
    { tx: "Alice T8", bits: ["yes", "unknown", "unknown"], ancestor: "T7 · Pending", pool: "자기 조건으로 재분류", changed: true },
    { tx: "Bob T4", bits: ["yes", "yes", "yes"], ancestor: "없음", pool: "Pending", changed: false },
  ],
];

const SCENES = [
  {
    label: "다음 base fee 42 gwei",
    summary: "T7 BaseFee · T8 Queued · T4 Pending",
    note: "T7은 max fee 40 gwei가 42보다 낮아 fee 비트 하나만 꺼져 BaseFee에 있습니다. T8은 앞선 T7이 아직 Pending이 아니므로 Queued이고, 모든 조건을 채운 Bob T4는 Pending입니다. T7의 balance 충분은 가정이고, T8의 balance·fee는 본문에 없어 ?로 두었습니다.",
  },
  {
    label: "base fee가 40 이하로 (가정)",
    summary: "다시 계산하는 칸만 바뀜",
    note: "base fee가 40 gwei 이하로 내려가면 T7의 fee 비트만 다시 계산해 켜지고 T7은 Pending으로 갑니다. 앞선 거래가 바뀐 T8은 자기 balance·fee 조건에 따라 다시 분류됩니다. Bob T4는 다시 볼 이유가 없습니다.",
  },
] as const;

function markText(mark: Mark) {
  return mark === "yes" ? "✓" : mark === "no" ? "✗" : "?";
}

function markClass(mark: Mark) {
  if (mark === "yes") return "border-emerald-600/60 text-emerald-700 dark:text-emerald-400";
  if (mark === "no") return "border-amber-600/70 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  return "border-border text-muted-foreground";
}

function TxStateFigure({ active }: { active: number }) {
  const rows = STATES[active];
  return (
    <div className="min-w-0 space-y-2 text-xs leading-5">
      <div className="hidden grid-cols-[5.5rem_repeat(3,minmax(0,1fr))_7rem_8rem] gap-2 px-2 text-[11px] text-muted-foreground sm:grid">
        <span>거래</span>
        {BIT_NAMES.map((bit) => (
          <span key={bit.code} className="break-words text-center">{bit.label}<span className="block font-mono text-[9px]">{bit.code.split("_").join("_\u200b")}</span></span>
        ))}
        <span>선행 거래</span>
        <span>서브풀</span>
      </div>
      {rows.map((row) => (
        <div key={row.tx} className={`grid grid-cols-3 gap-2 rounded-lg border p-2 sm:grid-cols-[5.5rem_repeat(3,minmax(0,1fr))_7rem_8rem] sm:items-center ${row.changed ? "border-blue-600" : "border-border"}`}>
          <strong className="col-span-3 sm:col-span-1">{row.tx}</strong>
          {row.bits.map((mark, index) => {
            const recomputed = row.changed && index === 2 && mark !== "unknown";
            return (
              <span key={BIT_NAMES[index].code} className={`rounded-md border px-1 py-1 text-center ${markClass(mark)} ${recomputed ? "ring-1 ring-blue-600" : ""}`}>
                <span className="block text-[10px] text-muted-foreground sm:hidden">{BIT_NAMES[index].label}</span>
                <span className="font-mono text-sm font-bold">{markText(mark)}</span>
              </span>
            );
          })}
          <span className="col-span-3 break-keep text-muted-foreground sm:col-span-1">
            <span className="sm:hidden">선행 거래 · </span>
            {row.ancestor}
          </span>
          <span className={`col-span-3 break-keep font-bold sm:col-span-1 ${row.changed ? "text-blue-700 dark:text-blue-400" : ""}`}>→ {row.pool}</span>
        </div>
      ))}
      <p className="pt-1 text-[11px] text-muted-foreground">✓ 조건 충족 · ✗ 미충족 · ? 본문에 값 없음 · 파란 테두리 = 이번 head 변화로 다시 계산한 거래</p>
    </div>
  );
}

export default function TxStateBitsViz() {
  return (
    <SceneShell
      eyebrow="TxState 비트"
      title="기다리는 이유를 비트로 남기면 base fee가 바뀔 때 그 칸만 다시 봅니다"
      description="TxState는 조건마다 충족 여부를 한 칸(bit)으로 둡니다. 세 비트 이름은 본문의 예이며, 행 하나가 거래 하나입니다."
      ariaLabel="T7, T8, T4의 TxState 조건 비트와 서브풀이 base fee 변화에 따라 바뀌는 과정"
      scenes={SCENES}
      render={(active) => <TxStateFigure active={active} />}
    />
  );
}
