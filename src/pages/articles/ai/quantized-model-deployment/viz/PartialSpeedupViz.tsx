import SceneShell from "./SceneShell";

/**
 * 본문 대응: #runtime-release 해석 — p = 0.6, S_q = 2.
 * 그대로 남는 시간 1 − p = 0.4, 가속 뒤 대상 시간 0.6 / 2 = 0.3, 새 시간 0.7, 1 / 0.7 ≈ 1.43배(상한).
 */
const P = 0.6;
const SQ = 2;
const KEEP = 1 - P;
const FAST = P / SQ;
const NEW_TIME = KEEP + FAST;
const E2E = 1 / NEW_TIME;

const SCENES = [
  {
    label: "기준 요청 시간을 둘로 나눕니다",
    summary: `1 = ${KEEP.toFixed(1)} + ${P.toFixed(1)}`,
    note: "p는 baseline 시간 중 low-bit kernel로 실제로 대체된 비율입니다. 여기서는 p = 0.6이고, 나머지 0.4는 sampling·communication·fallback처럼 교체되지 않은 시간입니다.",
  },
  {
    label: "교체된 구간만 2배 빨라집니다",
    summary: `${P.toFixed(1)} / ${SQ} = ${FAST.toFixed(1)}`,
    note: "Kernel speedup S_q = 2는 파란 구간에만 적용됩니다. 0.6이 0.3으로 줄고, 회색 0.4는 그대로 남습니다.",
  },
  {
    label: "전체는 최대 약 1.43배",
    summary: `1 / ${NEW_TIME.toFixed(1)} ≈ ${E2E.toFixed(2)}배`,
    note: "새 시간은 0.4 + 0.3 = 0.7이고, 그 역수 1/0.7 ≈ 1.43배가 end-to-end speedup의 상한입니다. Kernel의 2배가 요청 전체의 2배가 되지 않으며, file size 4배 축소와 latency 4배 향상도 서로 다른 주장입니다.",
  },
] as const;

function TimeRow({ label, keep, fast, total }: { label: string; keep: number; fast: number; total: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:grid-cols-[6rem_minmax(0,1fr)_4rem] sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="flex h-8 min-w-0 overflow-hidden rounded-sm bg-muted/40 font-mono text-[11px] text-white">
        <div className="flex h-full items-center justify-center border-r border-background" style={{ width: `${keep * 100}%`, backgroundColor: "#64748b" }}>
          {keep > 0 ? keep.toFixed(1) : ""}
        </div>
        <div
          className="flex h-full items-center justify-center transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${fast * 100}%`, backgroundColor: "#2563eb" }}
        >
          {fast > 0 ? fast.toFixed(1) : ""}
        </div>
      </div>
      <span className="text-right font-mono font-bold">{total}</span>
    </div>
  );
}

export default function PartialSpeedupViz() {
  return (
    <SceneShell
      eyebrow="Request speedup"
      title="Kernel이 2배 빨라져도 요청 전체는 그만큼 빨라지지 않습니다"
      description="막대 전체 길이가 baseline 요청 시간 1입니다. 파랑은 low-bit kernel로 교체된 구간, 회색은 그대로 남는 구간입니다. Overlap과 batch 변화는 단순화한 계산입니다."
      ariaLabel="p 0.6, kernel speedup 2에서 요청 시간이 1에서 0.7로 줄어 최대 약 1.43배가 되는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <TimeRow label="기준" keep={KEEP} fast={P} total="1.0" />
          <TimeRow
            label="개선 뒤"
            keep={active === 0 ? 0 : KEEP}
            fast={active === 0 ? 0 : FAST}
            total={active === 0 ? "?" : NEW_TIME.toFixed(1)}
          />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border text-center text-xs">
            <div className="bg-background px-2 py-2">
              <span className="block text-muted-foreground">교체 구간 kernel</span>
              <strong className="font-mono">{SQ}배</strong>
            </div>
            <div className={`px-2 py-2 ${active === 2 ? "bg-primary/[0.07]" : "bg-background"}`}>
              <span className="block text-muted-foreground">요청 전체 (상한)</span>
              <strong className="font-mono">{active === 2 ? `${E2E.toFixed(2)}배` : "?"}</strong>
            </div>
          </div>
        </div>
      )}
    />
  );
}
