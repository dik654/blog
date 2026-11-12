import LatencySceneShell from "./LatencySceneShell";

/**
 * 본문 대응: #distribution — 같은 정렬 표본에서 nearest-rank 와 NumPy 기본 선형 보간이 읽는 자리.
 * 100개 표본(9절 가정): 95번째 1.45초, 96번째 1.7초.
 *   nearest-rank: ceil(0.95×100)=95번째 → 1.45초
 *   선형 보간: 0기반 위치 0.95×99=94.05 → 1.45 + 0.05×(1.7−1.45) = 1.4625초
 * 20개 표본(19개 0초, 1개 100초): nearest-rank ceil(0.95×20)=19번째 → 0초,
 *   선형 보간 0.95×19=18.05 → 0 + 0.05×100 = 5초
 */
const GROUPS = [
  [0.3, 4], [0.5, 21], [0.7, 27], [0.9, 18], [1.0, 1], [1.1, 11],
  [1.3, 7], [1.45, 6], [1.7, 1], [1.9, 1], [2.3, 1], [2.4, 1], [4.0, 1],
] as const;
const SAMPLE_100 = GROUPS.flatMap(([value, count]) => Array<number>(count).fill(value));
const SAMPLE_20 = [...Array<number>(19).fill(0), 100];

function nearestRank(sample: readonly number[], p: number) {
  const rank = Math.ceil((p * sample.length) / 100);
  return { rank, value: sample[rank - 1] };
}

function linear(sample: readonly number[], p: number) {
  const pos = (p / 100) * (sample.length - 1);
  const lo = Math.floor(pos);
  const frac = pos - lo;
  return { pos, lo, frac, value: sample[lo] + frac * (sample[lo + 1] - sample[lo]) };
}

const NR100 = nearestRank(SAMPLE_100, 95);
const LI100 = linear(SAMPLE_100, 95);
const NR20 = nearestRank(SAMPLE_20, 95);
const LI20 = linear(SAMPLE_20, 95);

const fmt = (v: number) => (Math.round(v * 10000) / 10000).toString();

const SCENES = [
  {
    label: "nearest-rank: 순위를 올림해 그 값을 읽는다",
    summary: `ceil(0.95×100) = ${NR100.rank}번째 → ${fmt(NR100.value)}초`,
    note: `표본 100개를 작은 값부터 세웠을 때 끝의 12개입니다. 95%에 해당하는 순위 95를 1부터 세어 그 칸의 값 ${fmt(NR100.value)}초를 그대로 읽습니다. 95번째까지가 이 값 이하이므로 적어도 95%가 ${fmt(NR100.value)}초 이하입니다.`,
  },
  {
    label: "선형 보간: 0부터 센 위치 사이를 잇는다",
    summary: `${fmt(LI100.pos)} → ${fmt(LI100.value)}초`,
    note: `NumPy 기본 방식은 0부터 센 위치 0.95×99=${fmt(LI100.pos)}를 씁니다. 0기반 ${LI100.lo}(95번째, ${fmt(SAMPLE_100[LI100.lo])}초)와 ${LI100.lo + 1}(96번째, ${fmt(SAMPLE_100[LI100.lo + 1])}초) 사이의 ${Math.round(LI100.frac * 100)}% 지점이라 ${fmt(LI100.value)}초입니다. 두 값 모두 1.5초 아래입니다.`,
  },
  {
    label: "20개 중 19개가 0초, 마지막이 100초",
    summary: `nearest-rank ${fmt(NR20.value)}초 · 선형 보간 ${fmt(LI20.value)}초`,
    note: `nearest-rank는 ceil(0.95×20)=${NR20.rank}번째의 ${fmt(NR20.value)}초입니다. 선형 보간은 0기반 ${fmt(LI20.pos)}, 곧 0초와 100초 사이 ${Math.round(LI20.frac * 100)}% 지점이라 ${fmt(LI20.value)}초입니다. 1초 이하가 19/20=95%이므로 "1초 이하가 95%"와 맞는 쪽은 nearest-rank입니다.`,
  },
];

const HIT = "#2563eb";
const NEAR = "#d97706";

function Cells({ sample, from, highlight, pair, cols }: { sample: readonly number[]; from: number; highlight: number | null; pair: readonly number[]; cols: string }) {
  const shown = sample.slice(from);
  return (
    <div className={`grid gap-1 ${cols}`}>
      {shown.map((value, i) => {
        const idx = from + i;
        const isHit = highlight === idx;
        const isPair = pair.includes(idx);
        const border = isHit ? HIT : isPair ? NEAR : "#cbd5e1";
        return (
          <div
            key={idx}
            className="rounded-sm border px-0.5 py-1 text-center font-mono leading-4"
            style={{ borderColor: border, borderWidth: isHit || isPair ? 1.25 : 1 }}
          >
            <span className="block text-[10px] text-muted-foreground">{idx + 1}번째</span>
            <span className="block text-[11px] font-bold" style={{ color: isHit ? HIT : isPair ? NEAR : undefined }}>
              {fmt(value)}
            </span>
            <span className="block text-[10px] text-muted-foreground">0기반 {idx}</span>
          </div>
        );
      })}
    </div>
  );
}

function Ruler({ left, right, loIdx, frac, value }: { left: number; right: number; loIdx: number; frac: number; value: number }) {
  return (
    <div className="mt-4 text-xs">
      <p className="font-bold text-muted-foreground">선형 보간 자: 0기반 {loIdx} → {loIdx + 1}</p>
      <div className="relative mx-2 mt-6 h-px bg-[#64748b]">
        <span className="absolute -top-1.5 left-0 h-3 w-px bg-[#64748b]" />
        <span className="absolute -top-1.5 right-0 h-3 w-px bg-[#64748b]" />
        <span className="absolute -top-2 h-4 w-0.5 bg-[#2563eb]" style={{ left: `${frac * 100}%` }} />
        <span className="absolute -top-6 whitespace-nowrap font-mono font-bold text-[#2563eb]" style={{ left: `${frac * 100}%` }}>
          {Math.round(frac * 100)}% 지점 = {fmt(value)}
        </span>
      </div>
      <div className="mx-2 mt-2 flex justify-between font-mono text-muted-foreground">
        <span>{fmt(left)}</span>
        <span>{fmt(right)}</span>
      </div>
    </div>
  );
}

export default function PercentileDefinitionViz() {
  return (
    <LatencySceneShell
      eyebrow="Percentile 정의"
      title="같은 정렬 표본에서 두 정의가 읽는 자리가 다릅니다"
      description="칸 하나가 정렬한 표본 하나입니다(20개 표본의 같은 0초 18개는 한 칸으로 묶음). 위 줄은 1부터 센 순위, 가운데는 값(초, 100개 표본은 TTFT), 아래 줄은 프로그램 배열처럼 0부터 센 위치입니다."
      note="100개 표본과 20개 표본은 모두 본문 9절의 설명용 가정입니다."
      ariaLabel="nearest-rank와 선형 보간 percentile 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 2) {
          return (
            <div className="min-w-0">
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1 text-center font-mono leading-4">
                <div className="rounded-sm border border-[#cbd5e1] px-1 py-1">
                  <span className="block text-[10px] text-muted-foreground">1–{NR20.rank - 1}번째 ({NR20.rank - 1}개)</span>
                  <span className="block text-[11px] font-bold">모두 {fmt(SAMPLE_20[0])}</span>
                  <span className="block text-[10px] text-muted-foreground">0기반 0–{NR20.rank - 2}</span>
                </div>
                <div className="rounded-sm border px-1 py-1" style={{ borderColor: HIT, borderWidth: 1.25 }}>
                  <span className="block text-[10px] text-muted-foreground">{NR20.rank}번째</span>
                  <span className="block text-[11px] font-bold" style={{ color: HIT }}>{fmt(NR20.value)}</span>
                  <span className="block text-[10px] text-muted-foreground">0기반 {NR20.rank - 1}</span>
                </div>
                <div className="rounded-sm border px-1 py-1" style={{ borderColor: NEAR, borderWidth: 1.25 }}>
                  <span className="block text-[10px] text-muted-foreground">{SAMPLE_20.length}번째</span>
                  <span className="block text-[11px] font-bold" style={{ color: NEAR }}>{fmt(SAMPLE_20[SAMPLE_20.length - 1])}</span>
                  <span className="block text-[10px] text-muted-foreground">0기반 {SAMPLE_20.length - 1}</span>
                </div>
              </div>
              <Ruler left={SAMPLE_20[LI20.lo]} right={SAMPLE_20[LI20.lo + 1]} loIdx={LI20.lo} frac={LI20.frac} value={LI20.value} />
            </div>
          );
        }
        return (
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-bold text-muted-foreground">정렬한 100개 중 89–100번째</p>
            <Cells
              sample={SAMPLE_100}
              from={88}
              highlight={NR100.rank - 1}
              pair={active === 1 ? [LI100.lo + 1] : []}
              cols="grid-cols-4 sm:grid-cols-6 lg:grid-cols-12"
            />
            {active === 1 ? (
              <Ruler left={SAMPLE_100[LI100.lo]} right={SAMPLE_100[LI100.lo + 1]} loIdx={LI100.lo} frac={LI100.frac} value={LI100.value} />
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">파란 칸 하나의 값을 그대로 읽습니다. 사이를 잇지 않습니다.</p>
            )}
          </div>
        );
      }}
    />
  );
}
