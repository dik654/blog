import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 16 GiB 서버 한 대의 메모리 장부가 앱의 anonymous memory 증가에 따라 어떻게 바뀌는지 그린다.
 * 한 mechanism: 앱이 커지면 커널이 page cache를 회수해 자리를 내주고, 회수할 cache가 바닥나면 OOM으로 간다.
 * available은 mm/show_mem.c의 si_mem_available 식으로 계산한 값이다(예약 160 MiB, low watermark 64 MiB 가정).
 */
const TOTAL = 16384;
const SCENES = ["평소", "앱이 10.5 GiB", "앱이 14 GiB", "앱이 15.5 GiB를 원함"] as const;

type Kind = "anon" | "cache" | "slab" | "kernel" | "free";

interface Segment {
  kind: Kind;
  mib: number;
}

interface Phase {
  segments: Segment[];
  available: string;
  naiveUsed: string;
  signal: string;
  note: string;
}

const PHASES: readonly Phase[] = [
  {
    segments: [
      { kind: "anon", mib: 4608 },
      { kind: "kernel", mib: 512 },
      { kind: "slab", mib: 512 },
      { kind: "cache", mib: 9216 },
      { kind: "free", mib: 1536 },
    ],
    available: "10,976 MiB",
    naiveUsed: "90.6%",
    signal: "major fault 거의 없음",
    note: "빈 칸은 1,536 MiB뿐이라 (total − free) ÷ total은 90.6%입니다. 그러나 9,216 MiB의 page cache는 필요하면 비울 수 있어 available은 10,976 MiB입니다.",
  },
  {
    segments: [
      { kind: "anon", mib: 10752 },
      { kind: "kernel", mib: 512 },
      { kind: "slab", mib: 512 },
      { kind: "cache", mib: 4352 },
      { kind: "free", mib: 256 },
    ],
    available: "4,832 MiB",
    naiveUsed: "98.4%",
    signal: "kswapd가 cache를 회수",
    note: "앱이 6 GiB를 더 쓰자 커널이 page cache 4,864 MiB를 비워 자리를 내줬습니다. free는 256 MiB 안팎에 머물고 available이 줄어든 만큼이 실제로 쓴 몫입니다.",
  },
  {
    segments: [
      { kind: "anon", mib: 14336 },
      { kind: "kernel", mib: 512 },
      { kind: "slab", mib: 512 },
      { kind: "cache", mib: 768 },
      { kind: "free", mib: 256 },
    ],
    available: "1,248 MiB",
    naiveUsed: "98.4%",
    signal: "major fault·PSI some 상승",
    note: "page cache가 768 MiB로 줄어 앱이 자주 읽는 파일 1,024 MiB(가정)보다 작아졌습니다. 방금 비운 page를 다시 디스크에서 읽는 major fault가 늘고 PSI memory 수치가 오릅니다.",
  },
  {
    segments: [
      { kind: "anon", mib: 15648 },
      { kind: "kernel", mib: 512 },
      { kind: "slab", mib: 64 },
      { kind: "free", mib: 160 },
    ],
    available: "0에 가까움",
    naiveUsed: "99.0%",
    signal: "OOM killer 호출",
    note: "앱이 available 1,248 MiB보다 많은 1,536 MiB를 더 원합니다. cache 768 MiB, slab 448 MiB, 예약선 위 빈 page 96 MiB를 다 넘겨 1,312 MiB를 받아도 224 MiB가 모자랍니다. swap이 없어 anon page는 내보낼 곳이 없으니 회수가 진전 없이 끝나고 OOM killer가 불립니다.",
  },
];

const KINDS: readonly Kind[] = ["anon", "kernel", "slab", "cache", "free"];

const COLOR: Record<Kind, string> = {
  anon: "#dc2626",
  kernel: "#64748b",
  slab: "#a78bfa",
  cache: "#2563eb",
  free: "#e2e8f0",
};

const LABEL: Record<Kind, string> = {
  anon: "앱 anon",
  kernel: "커널 기타",
  slab: "회수 가능 slab",
  cache: "page cache",
  free: "빈 page",
};

export default function MemoryLedgerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  const phase = PHASES[scene];

  return (
    <VizFrame
      eyebrow="Memory ledger · 16 GiB"
      title="앱이 커지면 page cache가 비켜 주고, 비켜 줄 cache가 없으면 OOM입니다"
      description="막대 하나가 서버의 RAM 16,384 MiB입니다. 빨강은 앱이 직접 쓰는 메모리, 파랑은 파일을 담아 둔 page cache, 가장 옅은 칸은 아직 아무도 쓰지 않은 page입니다."
      note="swap이 없는 서버를 가정했습니다. 커널 예약 160 MiB, zone low watermark 합 64 MiB, 앱이 자주 읽는 파일 1,024 MiB는 설명용 값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="16 GiB 서버의 메모리 장부 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 flex h-12 w-full overflow-hidden rounded-sm border border-border">
            {phase.segments.map((segment, index) => (
              <div
                key={`${segment.kind}-${index}`}
                className="h-full shrink-0 border-r border-background transition-[width] duration-500 last:border-r-0"
                style={{
                  width: `${(segment.mib / TOTAL) * 100}%`,
                  backgroundColor: COLOR[segment.kind],
                }}
                title={`${LABEL[segment.kind]} ${segment.mib.toLocaleString()} MiB`}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>0</span>
            <span>16,384 MiB</span>
          </div>

          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:grid-cols-3">
            {KINDS.map((kind) => {
              const mib = phase.segments.find((segment) => segment.kind === kind)?.mib ?? 0;
              return (
                <li key={`legend-${kind}`} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-border"
                    style={{ backgroundColor: COLOR[kind] }}
                  />
                  <span className="text-muted-foreground">{LABEL[kind]}</span>
                  <span className="ml-auto font-mono tabular-nums text-foreground">{mib.toLocaleString()}</span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">available</dt>
              <dd className="font-bold text-foreground">{phase.available}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">free 기준 사용률</dt>
              <dd className="font-bold text-foreground">{phase.naiveUsed}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-muted-foreground">관찰할 신호</dt>
              <dd className="font-bold text-foreground">{phase.signal}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[14rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[13rem] sm:min-h-[4.5rem]">
            {phase.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
