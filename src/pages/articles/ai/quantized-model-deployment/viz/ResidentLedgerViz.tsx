import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resident-ledger 해석 — Weights 14→3.5 GB, metadata 0.3, activation+state 7, workspace+headroom 3.
 * 양자화 전 14 + 7 + 3 = 24 GB, 뒤 3.5 + 0.3 + 7 + 3 = 13.8 GB. 24의 4분의 1은 6 GB.
 */
const MAX_GB = 24;
const QUARTER_GB = MAX_GB / 4;

const PARTS = [
  { key: "weights", name: "Weights", hint: "checkpoint의 weight tensor", color: "#2563eb", before: 14, after: 3.5 },
  { key: "meta", name: "Scale metadata", hint: "low-bit 값을 되살릴 scale 등", color: "#d97706", before: 0, after: 0.3 },
  { key: "act", name: "Activation + state", hint: "실행 중 tensor와 KV·recurrent state", color: "#64748b", before: 7, after: 7 },
  { key: "work", name: "Workspace + headroom", hint: "kernel scratch와 안전 여유", color: "#94a3b8", before: 3, after: 3 },
] as const;

const BEFORE_TOTAL = PARTS.reduce<number>((sum, part) => sum + part.before, 0);
const AFTER_TOTAL = PARTS.reduce<number>((sum, part) => sum + part.after, 0);

const SCENES = [
  {
    label: "양자화 전 peak",
    summary: `14 + 7 + 3 = ${BEFORE_TOTAL} GB`,
    note: "본문의 설명용 예시이며, 앞 절의 27B가 아닌 더 작은 model을 가정합니다. Weight 14 GB 위에 실행 중 tensor와 요청 상태(activation + KV·recurrent state) 7 GB, kernel scratch와 안전 여유(workspace + headroom) 3 GB가 더해져 peak가 24 GB입니다.",
  },
  {
    label: "Weight 항만 4분의 1",
    summary: "14 → 3.5 GB, scale +0.3 GB",
    note: "Weight-only quantization이 줄이는 것은 파란 칸입니다. 14 GB가 3.5 GB로 줄지만, 줄어든 값을 해석할 scale metadata 0.3 GB가 새로 붙습니다.",
  },
  {
    label: "나머지 항은 그대로",
    summary: `${BEFORE_TOTAL} → ${AFTER_TOTAL.toFixed(1)} GB`,
    note: "회색 두 칸 7 GB와 3 GB는 이 예시에서 그대로 남습니다. 그래서 peak는 24의 4분의 1인 6 GB가 아니라 13.8 GB, 원래의 약 58%입니다.",
  },
] as const;

function StackRow({ label, total, values, showQuarter }: { label: string; total: string; values: readonly number[]; showQuarter: boolean }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:grid-cols-[6rem_minmax(0,1fr)_4.5rem] sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="relative h-7 min-w-0 rounded-sm bg-muted/40">
        <div className="flex h-full overflow-hidden rounded-sm">
          {values.map((value, index) => (
            <div
              key={PARTS[index].key}
              className="h-full border-r border-background transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(value / MAX_GB) * 100}%`, backgroundColor: PARTS[index].color }}
            />
          ))}
        </div>
        {showQuarter && (
          <div
            className="absolute -bottom-2.5 -top-2.5"
            style={{ left: `${(QUARTER_GB / MAX_GB) * 100}%`, borderLeft: "1.25px dashed #dc2626" }}
            aria-hidden
          />
        )}
      </div>
      <span className="text-right font-mono font-bold">{total}</span>
    </div>
  );
}

export default function ResidentLedgerViz() {
  return (
    <SceneShell
      eyebrow="Peak VRAM 장부"
      title="Weight가 4분의 1이 돼도 peak는 4분의 1이 되지 않습니다"
      description="막대 전체 길이가 24 GB입니다. 숫자는 본문 해석의 설명용 예시이며 특정 model의 측정값이 아닙니다."
      ariaLabel="양자화 전 24 GB와 weight-only 양자화 뒤 13.8 GB의 peak VRAM 구성 비교"
      scenes={SCENES}
      render={(active) => {
        const after = PARTS.map((part, index) => {
          if (active === 0) return 0;
          if (active === 1) return index < 2 ? part.after : 0;
          return part.after;
        });
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-3">
              <StackRow label="양자화 전" total={`${BEFORE_TOTAL} GB`} values={PARTS.map((part) => part.before)} showQuarter={false} />
              <StackRow
                label="양자화 뒤"
                total={active === 0 ? "?" : active === 1 ? "3.8 + ?" : `${AFTER_TOTAL.toFixed(1)} GB`}
                values={after}
                showQuarter={active === 2}
              />
              <p className={`pl-[5rem] text-[11px] leading-5 sm:pl-[6.5rem] ${active === 2 ? "text-red-700 dark:text-red-400" : "invisible"}`}>
                빨간 점선: 24 GB의 4분의 1 = {QUARTER_GB} GB
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border text-xs sm:grid-cols-2">
              {PARTS.map((part, index) => (
                <div key={part.key} className="grid grid-cols-[0.75rem_minmax(0,1fr)_auto] items-start gap-2 bg-background px-3 py-2">
                  <span className="mt-1 h-3 w-3 rounded-sm" style={{ backgroundColor: part.color }} aria-hidden />
                  <span className="min-w-0">
                    <strong className="block">{part.name}</strong>
                    <span className="block text-muted-foreground">{part.hint}</span>
                  </span>
                  <span className="text-right font-mono">
                    {part.before} → {active === 0 ? "?" : after[index] === 0 && part.after > 0 ? "?" : part.after}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
