import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #committee-lifecycle — period 경계 8,192에서 current·next committee를 함께 바꾸는 과정.
 * period(s) = floor(s / 8192): 8,191 → 0, 8,192 → 1, 8,193 → 1.
 * 적용 전 T0: finalized 8,191 · current K0 · next K1. 적용 후 T1: finalized 8,192 · current K1 · next K2.
 */
const SLOTS: readonly { slot: string; period: number; role: string }[] = [
  { slot: "8,191", period: 0, role: "T0 finalized" },
  { slot: "8,192", period: 1, role: "u-8193 finalized" },
  { slot: "8,193", period: 1, role: "signature slot" },
];

type StoreRow = { key: string; value: string; changed?: boolean; bad?: boolean };

const SCENES = [
  {
    label: "T0는 period 0에 있습니다",
    summary: "finalized 8,191 → period 0",
    note: "8,191 ÷ 8,192의 몫은 0이므로 T0의 finalized header는 period 0입니다. T0는 그 period의 current K0와 다음 period의 next K1을 함께 보관합니다.",
    highlight: 0,
    rows: [
      { key: "finalized", value: "8,191 (period 0)" },
      { key: "current", value: "K0" },
      { key: "next", value: "K1" },
      { key: "참여 최댓값", value: "이전 · 현재 값 보관" },
    ],
  },
  {
    label: "서명 slot은 period 1입니다",
    summary: "8,193 → period 1 → K1",
    note: "Signature slot 8,193 ÷ 8,192의 몫은 1입니다. T0에서 period 1을 맡는 committee는 next K1이므로 u-8193의 서명은 K0가 아니라 K1로 검증합니다.",
    highlight: 2,
    rows: [
      { key: "finalized", value: "8,191 (period 0)" },
      { key: "current", value: "K0 — 이 서명에 쓰지 않음", bad: true },
      { key: "next", value: "K1 — 서명 검증에 사용", changed: true },
      { key: "참여 최댓값", value: "이전 · 현재 값 보관" },
    ],
  },
  {
    label: "K2는 branch로 묶여야 합니다",
    summary: "K2 ⟵ attested state branch",
    note: "Update가 내민 next committee K2는 attested state의 Merkle branch로 확인합니다. Signature가 맞아도 이 branch가 틀리면 K2를 다음 key set으로 쓸 수 없습니다.",
    highlight: 1,
    rows: [
      { key: "finalized", value: "8,191 (period 0)" },
      { key: "current", value: "K0" },
      { key: "next", value: "K1" },
      { key: "후보", value: "K2 — branch 확인 중", changed: true },
    ],
  },
  {
    label: "경계를 넘으면 둘을 함께 바꿉니다",
    summary: "T1: current K1 · next K2",
    note: "Finalized slot이 8,191(period 0)에서 8,192(period 1)로 넘어갑니다. 기존 next K1이 current로 옮겨지고 검증한 K2가 새 next가 됩니다. 참여 최댓값도 같은 경계에서 현재 값을 이전 칸으로 넘기고 현재 값을 0으로 초기화합니다.",
    highlight: 1,
    rows: [
      { key: "finalized", value: "8,192 (period 1)", changed: true },
      { key: "current", value: "K1 (기존 next)", changed: true },
      { key: "next", value: "K2 (branch 검증)", changed: true },
      { key: "참여 최댓값", value: "현재 → 이전 · 현재 = 0", changed: true },
    ],
  },
  {
    label: "검증된 next 없이 경계를 넘으면",
    summary: "새 서명을 확인할 key set 없음",
    note: "새 signature를 확인할 key set이 없습니다. 임의 endpoint의 committee로 이어 가면 신뢰 사슬이 끊기므로, “가능”으로 표시한 두 길 중 하나로 다시 연결합니다.",
    highlight: 2,
    rows: [
      { key: "finalized", value: "period 경계를 넘음" },
      { key: "next", value: "검증된 값 없음", bad: true },
      { key: "다음 서명", value: "확인할 key set 없음", bad: true },
    ],
  },
] as const;

const SCENE_LIST: readonly (typeof SCENES)[number][] = SCENES;

const BRANCHES = [
  { text: "임의 endpoint의 committee로 계속", ok: false },
  { text: "기존 finalized에서 이어지는 update 재요청", ok: true },
  { text: "새 checkpoint를 별도 승인해 부트스트랩", ok: true },
] as const;

function SlotRuler({ highlight, nextVerified }: { highlight: number; nextVerified: boolean }) {
  // 경계는 slot 8,191과 8,192 사이입니다. 칸 너비는 순서만 나타냅니다.
  const chip = (i: number) => {
    const s = SLOTS[i];
    if (!s) return null;
    const on = i === highlight;
    return (
      <div key={s.slot} className={`min-w-0 flex-1 rounded-md border px-1.5 py-1.5 text-center ${on ? "border-primary bg-background" : "border-transparent"}`}>
        <span className={`block font-mono text-xs sm:text-sm ${on ? "font-bold text-primary" : "text-muted-foreground"}`}>{s.slot}</span>
        <span className="block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{s.role}</span>
      </div>
    );
  };
  return (
    <div className="min-w-0" role="img" aria-label={nextVerified ? "slot 8,191은 period 0, 8,192와 8,193은 period 1" : "slot 8,192와 8,193은 period 1이지만 검증된 committee가 없음"}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-1.5">
        <div className="rounded-lg border border-border bg-muted/30 p-1.5">
          <p className="mb-1 text-center text-[11px] font-bold text-muted-foreground sm:text-xs">period 0 · K0</p>
          <div className="flex">{chip(0)}</div>
        </div>
        <div className="rounded-lg border border-blue-300 bg-blue-500/[0.05] p-1.5 dark:border-blue-800">
          <p className="mb-1 text-center text-[11px] font-bold text-blue-700 sm:text-xs dark:text-blue-300">{nextVerified ? "period 1 · K1" : "period 1 · 검증된 committee 없음"}</p>
          <div className="flex gap-1">{chip(1)}{chip(2)}</div>
        </div>
      </div>
      <p className="mt-1 text-center font-mono text-[11px] text-red-700 dark:text-red-400">경계: slot 8,192부터 period 1</p>
    </div>
  );
}

export default function PeriodHandoffViz() {
  return (
    <HeliosSceneShell
      eyebrow="Committee period · 8,192 slots"
      title="Slot 8,192에서 period가 바뀌면 current와 next가 한 칸씩 이동합니다"
      description="띠는 slot 순서와 period 경계이고 period마다 그 서명을 확인하는 committee를 적었습니다. period(s) = ⌊s ÷ 8,192⌋이며 8,192는 mainnet preset의 32 slots × 256 epochs입니다. Store 표는 그 장면에서 Store가 보관하는 값입니다."
      note="세 slot 칸의 간격은 순서만 나타냅니다. K0·K1·K2는 committee 이름이며 실제 public key 값이 아닙니다."
      ariaLabel="period 경계에서 committee를 교체하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENE_LIST[active] ?? SCENE_LIST[0];
        const rows: readonly StoreRow[] = scene.rows;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <SlotRuler highlight={scene.highlight} nextVerified={active !== 4} />
              {active === 4 ? (
                <ul className="mt-2 space-y-1 text-xs leading-5 sm:text-sm">
                  {BRANCHES.map((b) => (
                    <li
                      key={b.text}
                      className={`break-keep rounded-md border px-2.5 py-1 ${
                        b.ok ? "border-primary/60" : "border-dashed border-red-600 text-red-700 line-through dark:text-red-400"
                      }`}
                    >
                      {b.ok ? "가능 · " : "금지 · "}
                      {b.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-center font-mono text-xs font-bold sm:text-sm">
                  ⌊{SLOTS[scene.highlight]?.slot} ÷ 8,192⌋ = {SLOTS[scene.highlight]?.period} → {SLOTS[scene.highlight]?.period === 0 ? "K0" : "K1"} 담당
                </p>
              )}
            </div>
            <dl className="grid grid-cols-[5.5rem_minmax(0,1fr)] self-start gap-px overflow-hidden rounded-lg border border-border bg-border text-xs sm:text-sm">
              <dt className="col-span-2 bg-muted/40 px-3 py-1.5 font-mono text-[11px] font-bold text-muted-foreground">
                {active === 3 ? "Store T1 (적용 후)" : active === 4 ? "Store (next 없이 경계를 넘은 경우)" : "Store T0 (적용 전)"}
              </dt>
              {rows.map((row) => (
                <div key={row.key} className="contents">
                  <dt className="bg-background px-3 py-1.5 font-semibold text-muted-foreground">{row.key}</dt>
                  <dd
                    className={`break-keep px-3 py-1.5 font-mono ${
                      row.bad
                        ? "bg-red-600/[0.06] text-red-700 dark:text-red-400"
                        : row.changed
                          ? "bg-primary/[0.08] font-bold text-primary"
                          : "bg-background"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}
