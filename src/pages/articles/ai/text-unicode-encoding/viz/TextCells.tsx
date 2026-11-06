import type { ReactNode } from "react";

export interface RulerItem {
  glyph: string;
  cluster: number;
  bytes: readonly string[];
  u16: number;
}

export type RowKind = "cluster" | "number" | "unit" | "byte";
export type Tone = "none" | "accent" | "warn" | "bad" | "ok" | "faint";

const TONE: Record<Tone, { background: string; borderColor: string }> = {
  none: { background: "transparent", borderColor: "#94a3b866" },
  accent: { background: "#2563eb2e", borderColor: "#2563eb" },
  warn: { background: "#d9770633", borderColor: "#d97706" },
  bad: { background: "#dc262629", borderColor: "#dc2626" },
  ok: { background: "#16a34a29", borderColor: "#16a34a" },
  faint: { background: "#94a3b81f", borderColor: "#94a3b866" },
};

/** 글자·값 한 칸. 위 줄은 내용, 아래 줄은 그 줄에서의 위치입니다. */
export function Cell({ top, bottom, tone = "none", dashed = false, className = "" }: { top: ReactNode; bottom?: ReactNode; tone?: Tone; dashed?: boolean; className?: string }) {
  const strong = tone !== "none" && tone !== "faint";
  return (
    <span
      className={`flex min-h-9 min-w-0 flex-col items-center justify-center rounded-sm border px-0 py-0.5 text-center leading-4 ${dashed ? "border-dashed" : ""} ${strong ? "font-bold" : ""} ${className}`}
      style={TONE[tone]}
    >
      <span className="block whitespace-nowrap font-mono text-[11px] sm:text-xs">{top}</span>
      {bottom !== undefined && <span className="block font-mono text-[10px] leading-3 text-muted-foreground">{bottom}</span>}
    </span>
  );
}

interface RulerCell {
  col: number;
  span: number;
  top: string;
  bottom: string;
}

function itemStarts(items: readonly RulerItem[]) {
  return items.reduce<number[]>((acc, item, index) => [...acc, acc[index] + item.bytes.length], [0]);
}

function rulerCells(items: readonly RulerItem[], kind: RowKind): RulerCell[] {
  const starts = itemStarts(items);
  if (kind === "byte") {
    return items.flatMap((item) => item.bytes).map((hex, index) => ({ col: index, span: 1, top: hex, bottom: String(index) }));
  }
  if (kind === "number") {
    return items.map((item, index) => ({ col: starts[index], span: item.bytes.length, top: item.glyph, bottom: String(index) }));
  }
  if (kind === "unit") {
    return items
      .flatMap((item, index) => Array.from({ length: item.u16 }, (_, unit) => ({ col: starts[index] + unit * (item.bytes.length / item.u16), span: item.bytes.length / item.u16 })))
      .map((cell, index) => ({ ...cell, top: String(index), bottom: "" }));
  }
  const clusters = Array.from(new Set(items.map((item) => item.cluster)));
  return clusters.map((cluster, index) => {
    const members = items.map((item, at) => ({ item, at })).filter(({ item }) => item.cluster === cluster);
    const span = members.reduce<number>((sum, { item }) => sum + item.bytes.length, 0);
    const shown = members.length === 2 && members[0].item.glyph === "e" ? "é" : members.length === 2 ? "가" : members[0].item.glyph;
    return { col: starts[members[0].at], span, top: shown, bottom: String(index) };
  });
}

/** 같은 글의 여러 줄을 파일 칸 폭에 맞춰 위아래로 겹칩니다. */
export function AlignedRows({
  items,
  rows,
  marks = {},
  tones = {},
  notes = {},
}: {
  items: readonly RulerItem[];
  rows: readonly { kind: RowKind; title: string }[];
  marks?: Partial<Record<RowKind, readonly number[]>>;
  tones?: Partial<Record<RowKind, Tone>>;
  notes?: Partial<Record<RowKind, string>>;
}) {
  const total = items.reduce<number>((sum, item) => sum + item.bytes.length, 0);
  return (
    <div className="space-y-2">
      {rows.map(({ kind, title }) => {
        const cells = rulerCells(items, kind);
        return (
          <div key={kind} className="min-w-0">
            <p className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-xs text-muted-foreground">
              <span>
                {title} · <strong className="font-mono text-foreground">{cells.length}칸</strong>
              </span>
              {notes[kind] && <span>{notes[kind]}</span>}
            </p>
            <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
              {cells.map((cell, index) => (
                <span key={index} className="min-w-0" style={{ gridColumn: `${cell.col + 1} / span ${cell.span}` }}>
                  <Cell
                    top={cell.top}
                    bottom={cell.bottom === "" ? undefined : cell.bottom}
                    tone={marks[kind]?.includes(index) ? (tones[kind] ?? "accent") : "none"}
                    dashed={cell.top.startsWith("◌")}
                    className="h-full"
                  />
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
