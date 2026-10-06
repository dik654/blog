import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveVizTableProps {
  columns: readonly ReactNode[];
  rows: ReadonlyArray<ReadonlyArray<ReactNode>>;
  className?: string;
  desktopMinWidthClassName?: string;
  firstColumnClassName?: string;
}

/**
 * 비교표형 Viz의 모바일 표현입니다.
 *
 * 좁은 화면에서는 한 행을 한 카드로 바꿔 모든 값을 화면 폭 안에서 읽게 하고,
 * 표의 열 관계가 한눈에 필요한 화면에서는 원래 표를 유지합니다.
 */
export default function ResponsiveVizTable({
  columns,
  rows,
  className,
  desktopMinWidthClassName = "min-w-[36rem]",
  firstColumnClassName,
}: ResponsiveVizTableProps) {
  return (
    <div className={cn("mt-5", className)}>
      <div data-viz-mobile-table className="grid min-w-0 gap-3 sm:hidden">
        {rows.map((row, rowIndex) => (
          <article
            key={`${String(row[0])}-${rowIndex}`}
            className="min-w-0 rounded-lg border border-border bg-background p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              {columns[0]}
            </p>
            <h4 className={cn("mt-1 break-words text-sm font-bold", firstColumnClassName)}>
              {row[0]}
            </h4>
            <dl className="mt-3 grid min-w-0 gap-2.5 text-xs leading-5">
              {columns.slice(1).map((column, columnIndex) => (
                <div key={columnIndex} className="min-w-0 border-t border-border/60 pt-2">
                  <dt className="font-semibold text-muted-foreground">{column}</dt>
                  <dd className="mt-0.5 min-w-0 break-words [overflow-wrap:anywhere]">
                    {row[columnIndex + 1]}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div data-viz-desktop-table className="hidden overflow-x-auto sm:block">
        <table
          className={cn(
            "w-full border-collapse text-left text-xs",
            desktopMinWidthClassName,
          )}
        >
          <thead>
            <tr className="border-y border-border bg-muted/20 text-muted-foreground">
              {columns.map((column, columnIndex) => (
                <th key={columnIndex} className="px-3 py-2 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${String(row[0])}-${rowIndex}`} className="border-b border-border/70">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "px-3 py-3 align-top",
                      cellIndex === 0
                        ? cn("font-semibold", firstColumnClassName)
                        : "text-muted-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
