import { Eye, FileWarning, PencilLine } from 'lucide-react';

const FLOWS = [
  {
    name: 'read_file',
    icon: Eye,
    steps: ['size', 'binary probe', 'UTF-8 decode', 'line window'],
    risk: '비 UTF-8 파일은 명시 오류로 거부됨(자동 decoding 없음)',
  },
  {
    name: 'write_file',
    icon: FileWarning,
    steps: ['size', 'path', 'mkdir', 'direct write'],
    risk: '부분 갱신과 durability 미보장',
  },
  {
    name: 'edit_file',
    icon: PencilLine,
    steps: ['read', 'match', 'replace', 'direct write'],
    risk: '동시 변경을 덮어쓸 수 있음',
  },
];

export default function ReadWriteViz() {
  return (
    <figure aria-label="read write edit 함수의 단계와 남는 위험 비교" className="not-prose my-7 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">같은 text I/O라도 마지막 보장은 다르다</p>
      </figcaption>
      <div className="grid gap-px bg-border md:grid-cols-3">
        {FLOWS.map((flow) => {
          const Icon = flow.icon;
          return (
            <div
              key={flow.name}
              className="min-w-0 bg-background p-4"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <code className="text-[13px] font-semibold">{flow.name}</code>
              </div>
              <ol className="mt-4 space-y-2">
                {flow.steps.map((step, index) => (
                  <li key={step} className="flex items-center gap-2 text-xs">
                    <span className="w-5 shrink-0 font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                    <span className="break-words">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                남는 위험: {flow.risk}
              </p>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
