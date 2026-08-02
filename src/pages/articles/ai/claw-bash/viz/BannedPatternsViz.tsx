import { TriangleAlert } from 'lucide-react';

const SIGNALS = [
  ['root/home deletion', 'rm -rf / · rm -rf ~ · rm -rf *', 'substring match'],
  ['raw device / format', 'mkfs · dd if= · > /dev/sd', 'substring match'],
  ['permission / resource', 'chmod -R 777 · chmod -R 000 · fork bomb', 'substring match'],
  ['always destructive', 'shred · wipefs', 'first command match'],
  ['broad recursive delete', 'rm + -r + -f', 'fallback combination'],
];

export default function BannedPatternsViz() {
  return (
    <figure
      aria-label="destructive command warning이 찾는 신호와 실제 결과"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">이 목록은 “절대 차단”이 아니라 Warn 신호다</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              caller가 Warn을 사용자 decision으로 닫지 않으면 문자열 탐지만으로 실행을 막지 못한다.
            </p>
          </div>
        </div>
      </figcaption>
      <div className="divide-y divide-border">
        {SIGNALS.map(([group, examples, method], index) => (
          <div
            key={group}
            className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 gap-y-1.5 px-4 py-3 md:grid-cols-[34px_150px_minmax(0,1fr)_140px] md:items-center"
          >
            <span className="text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <p className="text-sm font-semibold">{group}</p>
            <code className="col-start-2 break-words whitespace-normal text-xs md:col-start-auto">{examples}</code>
            <span className="col-start-2 text-xs text-muted-foreground md:col-start-auto md:text-right">{method}</span>
          </div>
        ))}
      </div>
      <p className="border-t border-border bg-rose-500/[0.035] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        더 큰 현재 격차: 이 <code className="text-xs">validate_command()</code> pipeline은 production{' '}
        <code className="text-xs">execute_bash()</code> 경로에 아직 배선되지 않았다.
      </p>
    </figure>
  );
}
