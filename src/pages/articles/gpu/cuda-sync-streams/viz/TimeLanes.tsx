/**
 * 줄마다 같은 가로 시계를 쓰는 시간표입니다.
 * 같은 가로 위치의 칸은 같은 때의 일이고, 칸의 글자가 어느 일인지 말해 주므로 색만으로 구분하지 않습니다.
 */
export type SegTone = "send" | "run" | "fetch" | "wait" | "bad" | "flag" | "idle" | "barrier";

export interface Seg {
  from: number;
  to: number;
  label?: string;
  tone: SegTone;
}

export interface LaneRow {
  name: string;
  segs: readonly Seg[];
}

export interface TimeMark {
  at: number;
  label: string;
}

const TONE: Record<SegTone, string> = {
  send: "border-primary bg-primary/20 text-foreground",
  run: "border-primary bg-primary text-primary-foreground",
  fetch: "border-amber-600 bg-amber-500/25 text-foreground",
  wait: "border-dashed border-muted-foreground text-muted-foreground",
  bad: "border-dashed border-red-600 bg-red-500/15 text-red-700 dark:text-red-400",
  flag: "border-amber-600 text-amber-700 dark:text-amber-400",
  idle: "border-border bg-muted/50 text-muted-foreground",
  barrier: "border-foreground bg-foreground text-background",
};

const LABEL_COL = "grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[6.5rem_minmax(0,1fr)]";

function edgeAlign(percent: number) {
  if (percent < 6) return "translateX(0)";
  if (percent > 94) return "translateX(-100%)";
  return "translateX(-50%)";
}

export default function TimeLanes({
  lanes,
  max,
  ticks = [],
  unit = "",
  marks = [],
}: {
  lanes: readonly LaneRow[];
  max: number;
  ticks?: readonly number[];
  unit?: string;
  marks?: readonly TimeMark[];
}) {
  const pct = (value: number) => (value / max) * 100;
  return (
    <div className="min-w-0">
      {marks.length > 0 && (
        <div className={LABEL_COL}>
          <span />
          <div className="relative h-5">
            {marks.map((mark) => (
              <span
                key={mark.label}
                className="absolute top-0 whitespace-nowrap text-xs font-bold text-primary"
                style={{ left: `${pct(mark.at)}%`, transform: edgeAlign(pct(mark.at)) }}
              >
                {mark.label}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className={LABEL_COL}>
        <div className="space-y-1.5">
          {lanes.map((lane) => (
            <p key={lane.name} className="flex h-10 items-center text-xs font-semibold leading-tight sm:text-sm">{lane.name}</p>
          ))}
        </div>
        <div className="relative min-w-0 space-y-1.5">
          {lanes.map((lane) => (
            <div key={lane.name} className="relative h-10 border-y border-border/70">
              {lane.segs.map((seg) => (
                <div
                  key={`${seg.from}-${seg.to}-${seg.label ?? seg.tone}`}
                  className={`absolute inset-y-0.5 flex items-center justify-center rounded-sm border px-0.5 text-center text-xs font-semibold leading-tight ${TONE[seg.tone]}`}
                  style={{ left: `${pct(seg.from)}%`, width: `${pct(seg.to - seg.from)}%` }}
                >
                  {seg.label}
                </div>
              ))}
            </div>
          ))}
          {marks.map((mark) => (
            <span key={mark.label} className="absolute inset-y-0 w-px bg-primary" style={{ left: `${pct(mark.at)}%` }} />
          ))}
        </div>
      </div>
      {ticks.length > 0 && (
        <div className={`${LABEL_COL} mt-1`}>
          <span className="text-xs text-muted-foreground">{unit}</span>
          <div className="relative h-5">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute top-0 font-mono text-xs text-muted-foreground"
                style={{ left: `${pct(tick)}%`, transform: edgeAlign(pct(tick)) }}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
