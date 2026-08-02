import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DATA = [12, 15, 13, 18, 20, 22, 19, 25, 28, 30, 27, 32];
const WINDOW = 4;

export default function WindowSliding() {
  const [position, setPosition] = useState(0);
  const maxPosition = DATA.length - WINDOW - 1;

  return (
    <figure
      data-window-sliding
      className="foundation-viz-explorer not-prose my-7 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">Causal window lab</p>
        <h3 className="mt-1 text-base font-bold sm:text-lg">
          입력 {WINDOW}개 뒤의 한 값을 정답으로 옮겨 본다
        </h3>
      </figcaption>

      <div className="grid h-44 min-w-0 grid-cols-12 items-end gap-1 px-3 pb-8 pt-5 sm:gap-2 sm:px-5">
        {DATA.map((value, index) => {
          const input = index >= position && index < position + WINDOW;
          const target = index === position + WINDOW;
          const color = input
            ? 'border-blue-700/35 bg-blue-600/65 dark:bg-blue-400/60'
            : target
              ? 'border-rose-700/35 bg-rose-600/65 dark:bg-rose-400/60'
              : 'border-border bg-muted/55';
          return (
            <div key={`${index}-${value}`} className="flex min-w-0 flex-col items-center justify-end gap-2">
              <div
                aria-label={`${index + 1}번째 값 ${value}${input ? ', 입력' : target ? ', 정답' : ''}`}
                className={`w-full min-w-0 rounded-t-sm border transition-[height,background-color] duration-200 ${color}`}
                style={{ height: `${Math.max(24, value * 3)}px` }}
              />
              <span
                className={`font-mono text-xs font-semibold ${
                  input ? 'text-blue-700 dark:text-blue-300' : target ? 'text-rose-700 dark:text-rose-300' : 'text-muted-foreground'
                }`}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 border-t border-border bg-muted/15 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-blue-600/70" aria-hidden="true" />
              입력 X
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-rose-600/70" aria-hidden="true" />
              정답 y
            </span>
          </div>
          <p aria-live="polite" className="mt-3 break-words font-mono text-xs font-semibold sm:text-sm">
            X = [{DATA.slice(position, position + WINDOW).join(', ')}] → y = {DATA[position + WINDOW]}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="윈도우를 한 칸 이전으로 이동"
            title="이전 window"
            onClick={() => setPosition(Math.max(0, position - 1))}
            disabled={position === 0}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="윈도우를 한 칸 다음으로 이동"
            title="다음 window"
            onClick={() => setPosition(Math.min(maxPosition, position + 1))}
            disabled={position === maxPosition}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </figure>
  );
}
