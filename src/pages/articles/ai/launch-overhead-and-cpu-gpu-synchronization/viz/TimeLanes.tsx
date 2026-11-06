export interface LaneSpan {
  from: number;
  to: number;
  color: string;
  text?: string;
  dark?: boolean;
  dashed?: boolean;
}
export interface Lane {
  label: string;
  spans: readonly LaneSpan[];
}
export interface LaneMark {
  at: number;
  color: string;
}

const pct = (t: number, max: number) => `${(t / max) * 100}%`;

/** 같은 시간축을 쓰는 여러 줄입니다. 글자가 줄어들지 않도록 SVG 대신 HTML로 그립니다. */
export default function TimeLanes({
  max,
  ticks,
  lanes,
  marks = [],
  unit = "μs",
}: {
  max: number;
  ticks: readonly number[];
  lanes: readonly Lane[];
  marks?: readonly LaneMark[];
  unit?: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      {lanes.map((lane) => (
        <div key={lane.label} className="grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
          <span className="text-[11px] font-bold leading-4 sm:text-xs">{lane.label}</span>
          <div className="relative h-8 rounded-sm border border-border bg-muted/20">
            {lane.spans.map((span) => (
              <div
                key={`${span.from}-${span.to}-${span.color}`}
                className={`absolute inset-y-0.5 flex items-center justify-center overflow-hidden rounded-[2px] text-[10px] font-bold leading-none sm:text-[11px] ${span.dark ? "text-white" : "text-[#0f172a]"}`}
                style={{
                  left: pct(span.from, max),
                  width: pct(span.to - span.from, max),
                  backgroundColor: span.dashed ? "transparent" : span.color,
                  border: span.dashed ? `1px dashed ${span.color}` : undefined,
                  color: span.dashed ? span.color : undefined,
                }}
              >
                {span.text}
              </div>
            ))}
            {marks.map((mark) => (
              <span key={mark.at} className="absolute -inset-y-1 w-0 border-l" style={{ left: pct(mark.at, max), borderColor: mark.color }} />
            ))}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
        <span className="text-[10px] text-muted-foreground">{unit}</span>
        <div className="relative h-4 font-mono text-[10px] text-muted-foreground sm:text-[11px]">
          {ticks.map((tick) => (
            <span key={tick} className="absolute -translate-x-1/2" style={{ left: pct(tick, max) }}>
              {tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 시간표의 색 설명입니다. */
export function LaneLegend({ items }: { items: readonly { color: string; label: string; dashed?: boolean }[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-4 rounded-[2px]" style={item.dashed ? { border: `1px dashed ${item.color}` } : { backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
