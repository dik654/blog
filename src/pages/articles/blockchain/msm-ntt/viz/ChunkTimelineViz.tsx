import SceneShell from "./SceneShell";

/**
 * 본문 대응: #residency-budget — H2D 4ms, kernel 7ms, barrier 1ms.
 * 같은 resource라 직렬이면 4+7+1=12ms, 다음 chunk 전송과 현재 kernel이 겹치면 max(4,7)+1=8ms.
 */
const H2D = 4;
const KERNEL = 7;
const BARRIER = 1;
const SPAN = H2D + KERNEL + BARRIER;
const OVERLAP = Math.max(H2D, KERNEL) + BARRIER;

interface Bar {
  lane: 0 | 1;
  start: number;
  length: number;
  label: string;
  color: string;
}

const COPY = "#0891b2";
const COMPUTE = "#7c3aed";
const SERIAL = "#dc2626";

const LAYOUTS: readonly (readonly Bar[])[] = [
  [
    { lane: 0, start: 0, length: H2D, label: `H2D ${H2D}ms`, color: COPY },
    { lane: 1, start: H2D, length: KERNEL, label: `kernel ${KERNEL}ms`, color: COMPUTE },
    { lane: 1, start: H2D + KERNEL, length: BARRIER, label: `${BARRIER}`, color: SERIAL },
  ],
  [
    { lane: 0, start: 0, length: H2D, label: `H2D ${H2D}ms`, color: COPY },
    { lane: 1, start: 0, length: KERNEL, label: `kernel ${KERNEL}ms`, color: COMPUTE },
    { lane: 1, start: KERNEL, length: BARRIER, label: `${BARRIER}`, color: SERIAL },
  ],
];
const ENDS = [SPAN, OVERLAP] as const;

const SCENES = [
  { label: "같은 resource를 쓰면 직렬", summary: `${H2D} + ${KERNEL} + ${BARRIER} = ${SPAN}ms`, note: "전송이 끝나야 kernel이 시작하고, kernel이 끝나야 barrier가 옵니다. 세 구간이 한 줄로 이어지므로 시간을 그대로 더합니다." },
  { label: "copy engine과 stream이 갈리면 겹침", summary: `max(${H2D}, ${KERNEL}) + ${BARRIER} = ${OVERLAP}ms`, note: "copy 줄은 다음 chunk의 전송, compute 줄은 현재 chunk의 kernel입니다. 다음 chunk 전송이 다른 copy engine·stream에서 현재 kernel과 실제로 겹치면 짧은 4ms는 7ms 안에 숨습니다. barrier 1ms는 겹칠 수 없어 뒤에 붙습니다. 겹침은 profiler timeline에서 확인해야 하는 조건입니다." },
] as const;

const LANES = ["copy", "compute"] as const;
const TICKS = [0, H2D, KERNEL, OVERLAP, H2D + KERNEL, SPAN] as const;

export default function ChunkTimelineViz() {
  return (
    <SceneShell
      eyebrow="chunk timeline"
      title="같은 세 구간도 겹치느냐에 따라 12ms와 8ms로 갈립니다"
      description="본문의 H2D 4ms, kernel 7ms, barrier 1ms를 같은 시간 축에 놓습니다. 가로 한 칸 길이가 시간이고, 빨간 칸이 겹칠 수 없는 직렬 경계(barrier)입니다."
      ariaLabel="전송·kernel·barrier가 직렬이면 12밀리초, 전송과 kernel이 겹치면 8밀리초인 timeline 비교"
      scenes={SCENES}
      render={(active) => {
        const bars = LAYOUTS[active];
        const end = ENDS[active];
        return (
          <div className="space-y-3">
            {LANES.map((lane, li) => (
              <div key={lane} className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{lane}</span>
                <div className="relative h-10 rounded-md bg-muted/40">
                  {bars
                    .filter((bar) => bar.lane === li)
                    .map((bar) => (
                      <div
                        key={bar.label}
                        className="absolute inset-y-1 flex items-center justify-center overflow-hidden rounded-sm px-1 text-[11px] font-bold text-white"
                        style={{ left: `${(bar.start / SPAN) * 100}%`, width: `${(bar.length / SPAN) * 100}%`, backgroundColor: bar.color }}
                      >
                        <span className="truncate">{bar.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-2">
              <span className="text-[11px] text-muted-foreground">ms</span>
              <div className="relative h-5">
                {TICKS.map((t) => (
                  <span
                    key={t}
                    className={`absolute -translate-x-1/2 font-mono text-[11px] ${t === end ? "font-bold text-foreground" : "text-muted-foreground"}`}
                    style={{ left: `${(t / SPAN) * 100}%` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-2">
              <span />
              <div className="space-y-1">
                <div className="h-2 rounded-sm border border-t-0 border-[#2563eb]" style={{ width: `${(end / SPAN) * 100}%` }} />
                <p className="font-mono text-xs font-bold text-[#2563eb]">chunk 하나 = {end}ms</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
