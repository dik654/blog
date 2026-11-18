import SceneShell from "./SceneShell";

/**
 * 본문 대응: #baseline 문단 — 최종 pool 크기가 같아도 T7의 subpool이나 builder에 보인 순서가 다르면 동작이 다르다.
 * T7·T8 = Alice의 nonce 7·8 거래(5절 실험 02·05와 같은 이름). 두 어긋남은 서로 다른 예(가정).
 */
const SCENES = [
  {
    label: "최종 크기만 비교하면",
    short: "크기",
    summary: "기준 2건 = 후보 2건",
    note: "같은 입력 뒤 두 구현의 pool에 남은 거래가 둘 다 2건이라고 해 봅니다(가정). 크기만 보면 차이가 없습니다.",
  },
  {
    label: "T7이 들어간 칸이 다르면",
    short: "예 1 · 칸",
    summary: "BaseFee ≠ Pending",
    note: "예 1. 기준은 T7을 BaseFee에, 후보는 Pending에 넣었다면 크기는 같아도 T7이 builder가 꺼내 보는 칸에 있는지가 달라집니다.",
  },
  {
    label: "builder가 본 순서가 다르면",
    short: "예 2 · 순서",
    summary: "T7 → T8 ≠ T8 → T7",
    note: "예 2. T8이 선행 거래 T7보다 먼저 builder에 보였다면 nonce 순서를 어긴 것입니다. pool 크기에는 드러나지 않습니다.",
  },
  {
    label: "hash별 receipt로 이으면",
    short: "receipt",
    summary: "첫 차이: T7의 칸 / 꺼낸 순서",
    note: "결과를 transaction hash마다 기록하면 크기 줄은 같아도 예 1은 T7의 칸 줄에서, 예 2는 builder 순서 줄에서 첫 차이가 드러납니다.",
  },
] as const;

const LANES = ["Pending", "BaseFee", "Queued", "Blob"] as const;

function Chip({ label, tone }: { label: string; tone: "plain" | "warn" | "unknown" }) {
  const cls =
    tone === "warn"
      ? "border-[#dc2626] text-[#dc2626]"
      : tone === "unknown"
        ? "border-dashed border-border text-muted-foreground"
        : "border-primary text-primary";
  return <span className={`inline-flex min-w-9 items-center justify-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold ${cls}`}>{label}</span>;
}

function PoolColumn({ title, t7Lane, warn }: { title: string; t7Lane: (typeof LANES)[number] | null; warn: boolean }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background p-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <strong className="text-xs sm:text-sm">{title}</strong>
        <span className="font-mono text-xs">2건</span>
      </div>
      <div className="mt-1.5 space-y-0.5">
        {LANES.map((lane) => (
          <div key={lane} className="grid min-h-6 grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-1.5 border-t border-border/60 pt-0.5">
            <span className="font-mono text-[10px] text-muted-foreground">{lane}</span>
            <span>{t7Lane === lane ? <Chip label="T7" tone={warn ? "warn" : "plain"} /> : null}</span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">{t7Lane === null ? "칸 배치를 보지 않음" : "나머지 1건은 생략"}</p>
    </div>
  );
}

function Sequence({ title, order, warn }: { title: string; order: readonly string[]; warn: boolean }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background p-2.5">
      <strong className="text-xs sm:text-sm">{title}</strong>
      <div className="mt-3 flex items-center gap-1.5">
        {order.map((tx, index) => (
          <span key={tx} className="flex items-center gap-1.5">
            {index > 0 ? <span className="font-mono text-xs text-muted-foreground">→</span> : null}
            <Chip label={tx} tone={warn ? "warn" : "plain"} />
          </span>
        ))}
      </div>
      <p className="mt-3 text-[10px] leading-4 text-muted-foreground">builder가 꺼낸 순서 (1번째 → 2번째)</p>
    </div>
  );
}

const RECEIPT = [
  ["pool 크기", "2건", "2건", true],
  ["예 1 · T7의 subpool", "BaseFee", "Pending", false],
  ["예 2 · builder 순서", "T7 → T8", "T8 → T7", false],
] as const;

export default function SameSizeReceiptViz() {
  return (
    <SceneShell
      eyebrow="최종 크기 vs 거래별 receipt"
      title="pool 크기가 같아도 거래 하나의 칸과 순서는 다를 수 있습니다"
      description="T7·T8은 Alice의 nonce 7·8 거래입니다. Pending은 builder가 꺼내 보는 칸, BaseFee는 수수료 상한이 현재 base fee보다 낮아 기다리는 칸, Queued는 앞 nonce가 비어 기다리는 칸, Blob은 blob 거래가 기다리는 칸입니다."
      ariaLabel="기준 구현과 후보 구현의 pool 크기가 같아도 T7의 subpool과 builder 순서가 다를 수 있음을 보이는 비교"
      note="두 어긋남은 본문이 든 서로 다른 예이며, 한 run에서 함께 일어났다는 뜻이 아닙니다."
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          {active === 0 || active === 1 ? (
            <div className="grid grid-cols-2 gap-2">
              <PoolColumn title="기준 구현" t7Lane={active === 1 ? "BaseFee" : null} warn={false} />
              <PoolColumn title="후보 구현" t7Lane={active === 1 ? "Pending" : null} warn={active === 1} />
            </div>
          ) : null}
          {active === 2 ? (
            <div className="grid grid-cols-2 gap-2">
              <Sequence title="기준 구현" order={["T7", "T8"]} warn={false} />
              <Sequence title="후보 구현" order={["T8", "T7"]} warn />
            </div>
          ) : null}
          {active === 3 ? (
            <div className="min-w-0 rounded-md border border-border bg-background text-xs sm:text-sm">
              <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_1.5rem] gap-2 border-b border-border px-2.5 py-2 text-[10px] font-bold text-muted-foreground sm:text-xs">
                <span>기록 줄</span>
                <span>기준</span>
                <span>후보</span>
                <span />
              </div>
              {RECEIPT.map(([row, base, candidate, same]) => (
                <div key={row} className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_1.5rem] items-center gap-2 border-b border-border/60 px-2.5 py-2.5 last:border-b-0">
                  <span className="break-keep">{row}</span>
                  <span className="font-mono text-[11px]">{base}</span>
                  <span className={`font-mono text-[11px] ${same ? "" : "font-bold text-[#dc2626]"}`}>{candidate}</span>
                  <span className={`text-center font-bold ${same ? "text-[#16a34a]" : "text-[#dc2626]"}`}>{same ? "=" : "≠"}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    />
  );
}
