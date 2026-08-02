import { CircleCheck, TriangleAlert } from 'lucide-react';

const BRANCHES = [
  ['known substring', 'rm -rf / · mkfs · dd if= · fork bomb', 'Warn'],
  ['first command', 'shred · wipefs', 'Warn'],
  ['rm flag combination', 'rm + -r + -f', 'Warn'],
  ['none matched', '그 밖의 command', 'Allow'],
];

export default function DestructiveLevelViz() {
  return (
    <figure
      aria-label="destructive command 검사가 Warn 또는 Allow를 반환하는 실제 branch"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">현재 코드에는 Low·Medium·High·Critical 4단계가 없다</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          세 heuristic branch는 모두 같은 Warn을 반환하고, 나머지만 Allow다.
        </p>
      </figcaption>
      <div className="divide-y divide-border">
        {BRANCHES.map(([branch, example, result], index) => {
          const Icon = result === 'Warn' ? TriangleAlert : CircleCheck;
          const color = result === 'Warn'
            ? 'text-amber-700 dark:text-amber-300'
            : 'text-emerald-700 dark:text-emerald-300';
          return (
            <div
              key={branch}
              className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 gap-y-1.5 px-4 py-3 sm:grid-cols-[34px_150px_minmax(0,1fr)_90px] sm:items-center"
            >
              <span className="text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <code className="text-[13px] font-semibold">{branch}</code>
              <code className="col-start-2 break-words whitespace-normal text-xs sm:col-start-auto">{example}</code>
              <span className={`col-start-2 flex items-center gap-1.5 text-xs font-semibold sm:col-start-auto ${color}`}>
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {result}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
