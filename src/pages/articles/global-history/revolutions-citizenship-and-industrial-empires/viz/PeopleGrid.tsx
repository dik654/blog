export interface PeopleCell {
  letter: string;
  color: string | null;
  strong?: boolean;
}

/** 네모 하나가 주민 한 사람입니다. color가 없으면 빈 칸으로 그립니다. */
export default function PeopleGrid({ cells, label }: { cells: readonly PeopleCell[]; label: string }) {
  return (
    <div className="grid grid-cols-10 content-start gap-0.5 sm:gap-1" role="img" aria-label={label}>
      {cells.map((cell, index) => (
        <span
          key={index}
          className="flex aspect-square items-center justify-center text-[9px] font-bold leading-none sm:text-[11px]"
          style={{
            border: `1px solid ${cell.color ?? "#94a3b8"}`,
            borderRadius: 2,
            backgroundColor: cell.color ? `${cell.color}${cell.strong ? "33" : "14"}` : "transparent",
            color: cell.color ?? "#94a3b8",
          }}
        >
          {cell.letter}
        </span>
      ))}
    </div>
  );
}
