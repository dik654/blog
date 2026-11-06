import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 같은 16,384 MiB 장부에서 경보·available·used 두 정의가 각각 어느 몫을 세는가.
 * 장부: 앱 4,608 + 커널 512 + slab 512 + cache 9,216 + 빈 page 1,536 = 16,384.
 * available: 빈 1,536−160, cache 9,216−64, slab 512−64 → 1,376 + 9,152 + 448 = 10,976.
 * used 3.3.17: 16,384−1,536−9,728 = 5,120 (앱+커널). used 4.0.1: 16,384−10,976 = 5,408 (5,120 + 160 + 64 + 64).
 */
const TOTAL = 16384;

const PARTS = [
  { key: "anon", label: "앱 메모리", mib: 4608, color: "#dc2626" },
  { key: "kernel", label: "커널 내부", mib: 512, color: "#64748b" },
  { key: "slab", label: "회수 가능 slab", mib: 512, color: "#a78bfa" },
  { key: "cache", label: "page cache", mib: 9216, color: "#2563eb" },
  { key: "free", label: "빈 page", mib: 1536, color: "#94a3b8" },
] as const;

const SCENES = [
  { label: "장부: 다섯 몫의 합", summary: "합계 16,384 MiB", counted: [4608, 512, 512, 9216, 1536], total: "16,384", note: "위 막대는 RAM 전체이고 칸 너비가 곧 크기입니다. 아래 막대는 다음 장면부터 각 계산이 세는 몫을 같은 자리에 칠합니다." },
  { label: "경보: 빈 page만 뺍니다", summary: "14,848 ÷ 16,384 = 90.6%", counted: [4608, 512, 512, 9216, 0], total: "14,848", note: "(total − free)를 사용률로 계산합니다. 디스크에 원본이 있는 page cache 9,216 MiB까지 사용으로 들어갑니다." },
  { label: "available: 내줄 수 있다고 추정한 몫", summary: "10,976 MiB · 전체의 67%", counted: [0, 0, 448, 9152, 1376], total: "10,976", note: "swap 없이 받을 수 있는 양의 추정값입니다. 빈 page에서 예약 160을, slab과 cache에서 low watermark 합 64씩을 남기고 더합니다." },
  { label: "used: procps-ng 3.3.17", summary: "16,384 − 1,536 − 9,728 = 5,120", counted: [4608, 512, 0, 0, 0], total: "5,120", note: "free 명령(procps-ng 3.3.17)의 used 열은 total − free − buffers − cache입니다. cache 열 9,728은 page cache와 회수 가능 slab의 합이라 앱과 커널 몫만 남습니다." },
  { label: "used: 4.0.1부터", summary: "16,384 − 10,976 = 5,408", counted: [4608, 512, 64, 64, 160], total: "5,408", note: "total − available입니다. available에서 남겨 둔 160 + 64 + 64 = 288이 used로 넘어와, 앞 장면의 available이 칠하지 않은 자리를 칠합니다. 어느 판이든 used는 90%가 아닙니다." },
] as const;

export default function MemoryCountsViz() {
  return (
    <SceneShell
      eyebrow="같은 장부, 다른 계산"
      title="경보·available·used는 같은 막대의 다른 칸을 셉니다"
      description="아래 막대의 칠한 부분이 그 계산에 들어가는 몫입니다. 단위는 MiB입니다."
      note="(가정) swap·tmpfs 없는 서버, 커널 예약 160 MiB, low watermark(빈 page가 이 아래면 회수를 시작하는 선) 합 64 MiB. 실제 회수량은 시스템마다 다릅니다."
      ariaLabel="16,384 MiB 장부에서 경보, available, used 두 정의가 세는 몫 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">서버의 장부</p>
            <div className="flex h-6 w-full overflow-hidden rounded-sm border border-border sm:h-8">
              {PARTS.map((part) => (
                <div key={part.key} className="h-full border-r border-background last:border-r-0" style={{ width: `${(part.mib / TOTAL) * 100}%`, backgroundColor: part.color }} />
              ))}
            </div>
            <p className="mb-1 mt-2 text-xs font-semibold text-muted-foreground">이 계산이 세는 몫</p>
            <div className="flex h-6 w-full overflow-hidden rounded-sm border border-border sm:h-8">
              {PARTS.map((part, index) => (
                <div key={part.key} className="h-full border-r border-background last:border-r-0" style={{ width: `${(part.mib / TOTAL) * 100}%` }}>
                  <div className={`h-full ${active === 4 ? "ml-auto" : ""}`} style={{ width: `${(scene.counted[index] / part.mib) * 100}%`, backgroundColor: part.color }} />
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] gap-x-2 gap-y-0.5 text-xs">
              <span className="text-muted-foreground">몫</span>
              <span className="text-right text-muted-foreground">장부</span>
              <span className="text-right text-muted-foreground">이 계산</span>
              {PARTS.map((part, index) => (
                <div key={part.key} className="contents">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: part.color }} />
                    {part.label}
                  </span>
                  <span className="text-right font-mono text-muted-foreground">{part.mib.toLocaleString("en-US")}</span>
                  <span className="text-right font-mono font-bold">{scene.counted[index].toLocaleString("en-US")}</span>
                </div>
              ))}
              <span className="mt-1 border-t border-border pt-1 font-semibold">합계</span>
              <span className="mt-1 border-t border-border pt-1 text-right font-mono text-muted-foreground">16,384</span>
              <span className="mt-1 border-t border-border pt-1 text-right font-mono font-bold">{scene.total}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
