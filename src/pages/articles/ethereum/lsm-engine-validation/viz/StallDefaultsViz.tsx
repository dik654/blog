import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #environment — RocksDB commit 2dc6bc5의 소스 기본값.
 * write buffer 64MiB · 최대 2개, L0 slowdown 20개 · stop 36개, pending compaction soft 64GiB · hard 256GiB.
 * 눈금은 각 지표의 선형 축이며, 기본값의 존재는 대상 workload 적합성의 증거가 아닙니다.
 */
const L0_MAX = 40;
const L0_SLOW = 20;
const L0_STOP = 36;
const PENDING_MAX = 300;
const PENDING_SOFT = 64;
const PENDING_HARD = 256;

const pct = (value: number, max: number) => `${(value / max) * 100}%`;

function Tick({ at, max, label, tone }: { at: number; max: number; label: string; tone: "amber" | "rose" }) {
  return (
    <div className="absolute inset-y-0" style={{ left: pct(at, max) }}>
      <div className={`h-full border-l ${tone === "amber" ? "border-amber-600" : "border-rose-600"}`} />
      <span
        className={`absolute top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-bold ${
          tone === "amber" ? "text-amber-700 dark:text-amber-300" : "text-rose-700 dark:text-rose-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function StallDefaultsViz() {
  return (
    <VizFrame
      eyebrow="소스 기본값 · stall 경계"
      title="기본 write-stall 경계는 같은 지표 위의 두 단계입니다"
      description="RocksDB commit 2dc6bc5의 소스 기본값을 각 지표의 축 위에 놓았습니다. 이 값의 존재는 대상 workload에 적합하다는 증거가 아닙니다."
      note="Write stall은 백그라운드 정리가 밀릴 때 foreground write를 늦추거나 멈추는 동작입니다. 축의 오른쪽 끝(L0 40개, 300GiB)은 그림 범위를 정하려는 가정입니다."
    >
      <div className="space-y-7" role="img" aria-label="write buffer 64MiB 두 개, L0 파일 20개에서 slowdown과 36개에서 stop, pending compaction bytes 64GiB soft와 256GiB hard 경계">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <strong className="text-sm">Write buffer</strong>
            <span className="font-mono text-xs text-muted-foreground">64MiB × 최대 2개</span>
          </div>
          <div className="mt-2 grid max-w-xs grid-cols-2 gap-2">
            {[0, 1].map((slot) => (
              <div key={slot} className="rounded-md border border-primary/60 bg-background px-2 py-2 text-center font-mono text-xs">64MiB</div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <strong className="text-sm">L0 파일 수</strong>
            <span className="text-xs text-muted-foreground">20개에서 늦춤, 36개에서 멈춤</span>
          </div>
          <div className="relative mt-2 h-6 rounded-sm border border-border bg-background">
            <div className="absolute inset-y-0 bg-amber-500/25" style={{ left: pct(L0_SLOW, L0_MAX), width: pct(L0_STOP - L0_SLOW, L0_MAX) }} />
            <div className="absolute inset-y-0 right-0 bg-rose-500/25" style={{ left: pct(L0_STOP, L0_MAX) }} />
            <Tick at={L0_SLOW} max={L0_MAX} label="slowdown 20" tone="amber" />
            <Tick at={L0_STOP} max={L0_MAX} label="stop 36" tone="rose" />
          </div>
          <div className="mt-6 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>0</span>
            <span>40개</span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <strong className="text-sm">Pending compaction bytes</strong>
            <span className="text-xs text-muted-foreground">soft 64GiB, hard 256GiB (4배)</span>
          </div>
          <div className="relative mt-2 h-6 rounded-sm border border-border bg-background">
            <div className="absolute inset-y-0 bg-amber-500/25" style={{ left: pct(PENDING_SOFT, PENDING_MAX), width: pct(PENDING_HARD - PENDING_SOFT, PENDING_MAX) }} />
            <div className="absolute inset-y-0 right-0 bg-rose-500/25" style={{ left: pct(PENDING_HARD, PENDING_MAX) }} />
            <Tick at={PENDING_SOFT} max={PENDING_MAX} label="soft 64" tone="amber" />
            <Tick at={PENDING_HARD} max={PENDING_MAX} label="hard 256" tone="rose" />
          </div>
          <div className="mt-6 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>0</span>
            <span>300GiB</span>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
