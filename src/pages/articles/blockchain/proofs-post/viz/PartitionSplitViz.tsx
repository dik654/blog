import SceneShell from "./SceneShell";

/**
 * 본문 대응: #window-deadline — B = ⌈N/S⌉.
 * N=2,341, S=2,000(예제 profile) → 첫 partition 2,000개, 남은 341개가 둘째 partition → B=2.
 * 경계 장면의 N=2,000·2,001은 올림을 보이려는 가정이다.
 * 칸 하나 = sector 100개(그림 단위). 칸 안 채움 비율 = 그 칸에 들어간 sector 수 / 100.
 */
const CAPACITY = 2000;
const UNIT = 100;
const PART_CELLS = CAPACITY / UNIT;
const POOL_CELLS = 24;

const SCENES = [
  {
    label: "정렬된 snapshot",
    summary: "N = 2,341",
    n: 2341,
    placed: 0,
    note: "Partition은 한 번에 proof를 만드는 sector 묶음이고, 예제 profile에서는 한 묶음이 최대 2,000개(S)를 받습니다. 먼저 snapshot에 들어간 sector 2,341개를 정렬된 순서대로 둡니다.",
  },
  {
    label: "첫 partition",
    summary: "2,000개 배정 · 341개 남음",
    n: 2341,
    placed: 2000,
    note: "앞에서부터 2,000개가 첫 partition을 가득 채웁니다. 2,341 − 2,000 = 341개가 아직 남습니다.",
  },
  {
    label: "남은 341개",
    summary: "⌈2,341 / 2,000⌉ = ⌈1.1705⌉ = 2",
    n: 2341,
    placed: 2341,
    note: "남은 341개는 둘째 partition으로 갑니다. 둘째 묶음은 2,000칸 중 341칸만 차지만 그래도 partition 하나입니다. 그래서 2,341 / 2,000 = 1.1705(약 1.17)를 올림해 B = 2입니다.",
  },
  {
    label: "경계: 2,000개",
    summary: "N = 2,000(가정) → B = 1",
    n: 2000,
    placed: 2000,
    note: "Sector가 정확히 2,000개였다면(가정) 첫 partition에서 끝나고 남는 것이 없습니다. 둘째 partition은 만들지 않습니다.",
  },
  {
    label: "경계: 2,001개",
    summary: "N = 2,001(가정) → B = 2",
    n: 2001,
    placed: 2001,
    note: "하나만 더 있어도(가정) 남은 sector 1개를 위해 partition 하나를 더 만듭니다. 올림은 남은 sector가 하나라도 있으면 묶음을 하나 더 세는 규칙입니다.",
  },
] as const;

function fill(count: number, index: number) {
  return Math.max(0, Math.min(UNIT, count - index * UNIT)) / UNIT;
}

function Cell({ ratio, color, faint = false }: { ratio: number; color: string; faint?: boolean }) {
  return (
    <div className={`h-5 min-w-0 rounded-sm border ${faint ? "border-dashed border-border/60" : "border-border"} bg-background`}>
      <div
        className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${ratio * 100}%`, backgroundColor: color }}
      />
    </div>
  );
}

function Partition({ index, count, done }: { index: number; count: number; done: boolean }) {
  const used = count > 0;
  return (
    <div className={`min-w-0 rounded-lg border p-3 ${used ? "border-[#2563eb]/60" : "border-dashed border-border"}`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
        <span className="font-bold">partition {index + 1}</span>
        <span className="font-mono text-muted-foreground">
          {used ? `${count.toLocaleString("en-US")} / 2,000` : done ? "만들지 않음" : "아직 비어 있음"}
        </span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: PART_CELLS }, (_, cell) => (
          <Cell key={cell} ratio={fill(count, cell)} color="#2563eb" faint={!used} />
        ))}
      </div>
    </div>
  );
}

export default function PartitionSplitViz() {
  return (
    <SceneShell
      eyebrow="partition 나누기"
      title="2,341개를 2,000개짜리 묶음에 담으면 묶음은 두 개가 됩니다"
      description="칸 하나가 sector 100개이고, 칸이 찬 비율이 그 칸에 들어간 sector 수입니다. S = 2,000은 글의 예제 profile 값이며 실제 값은 registered profile에서 읽습니다."
      ariaLabel="sector 2,341개를 partition 용량 2,000으로 나눠 partition 수를 올림으로 세는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const first = Math.min(scene.placed, CAPACITY);
        const second = Math.max(0, scene.placed - CAPACITY);
        const waiting = scene.n - scene.placed;
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0 rounded-lg border border-border p-3">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
                <span className="font-bold">아직 묶음에 안 들어간 sector</span>
                <span className="font-mono text-muted-foreground">{waiting.toLocaleString("en-US")}개</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: POOL_CELLS }, (_, cell) => (
                  <Cell key={cell} ratio={fill(waiting, cell)} color="#64748b" />
                ))}
              </div>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <Partition index={0} count={first} done={waiting === 0} />
              <Partition index={1} count={second} done={waiting === 0} />
            </div>
            <p className="text-right font-mono text-sm font-bold">
              {waiting > 0 ? "B: 배정 중" : `B = ${(first > 0 ? 1 : 0) + (second > 0 ? 1 : 0)}`}
            </p>
          </div>
        );
      }}
    />
  );
}
