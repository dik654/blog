export interface Seg {
  value: number;
  color: string;
  text?: string;
  /** 금액은 있지만 성격을 확정하지 않은 칸은 점선 칸으로 그립니다. */
  open?: boolean;
}

/** 금액을 폭으로 그리는 막대입니다. scale이 전체 폭에 해당하는 달러입니다. */
export function PriceBar({ segs, scale = 100 }: { segs: readonly Seg[]; scale?: number }) {
  return (
    <div className="flex h-9 min-w-0">
      {segs.map((seg, index) => (
        <div
          key={index}
          className="flex min-w-0 items-center justify-center overflow-hidden border-r-2 border-background font-mono text-xs font-bold last:border-r-0"
          style={
            seg.open
              ? { width: `${(seg.value / scale) * 100}%`, color: seg.color, outline: `1px dashed ${seg.color}`, outlineOffset: "-2px" }
              : { width: `${(seg.value / scale) * 100}%`, backgroundColor: seg.color, color: "#ffffff" }
          }
        >
          {seg.text ?? seg.value}
        </div>
      ))}
    </div>
  );
}

/** 막대 칸의 이름입니다. 색만으로 구분하지 않도록 금액과 이름을 함께 적습니다. */
export function Legend({ items }: { items: readonly { color: string; text: string }[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
      {items.map((item) => (
        <li key={item.text} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.text}
        </li>
      ))}
    </ul>
  );
}

/** 막대 위에 얹는 괄호입니다. 왼쪽 끝부터 value까지의 구간을 가리킵니다. */
export function Bracket({ value, scale = 100, text, color }: { value: number; scale?: number; text: string; color: string }) {
  return (
    <div style={{ width: `${(value / scale) * 100}%` }} className="min-w-0">
      <p className="mb-1 text-xs font-bold leading-5" style={{ color }}>{text}</p>
      <div className="h-2 border-x border-t" style={{ borderColor: color }} />
    </div>
  );
}
