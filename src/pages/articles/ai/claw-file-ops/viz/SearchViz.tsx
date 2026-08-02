import { FileSearch, Files, ScanText } from 'lucide-react';

const STEPS = [
  { title: '파일 후보', tool: 'glob_search', text: '이름·확장자·디렉터리로 후보를 줄인다.', icon: Files },
  { title: '줄 후보', tool: 'grep_search', text: 'regex가 맞는 파일과 줄을 찾는다.', icon: FileSearch },
  { title: '완전한 문맥', tool: 'read_file', text: '정의와 호출부의 필요한 줄 구간을 읽는다.', icon: ScanText },
];

export default function SearchViz() {
  return (
    <figure aria-label="glob grep read 순서로 검색 범위를 좁히는 그림" className="not-prose my-7 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">검색은 세 단계 funnel이다</p>
      </figcaption>
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.tool}
              className="min-w-0 bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-4 text-sm font-semibold">{step.title}</p>
              <code className="mt-1 block break-all text-xs">{step.tool}</code>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          );
        })}
      </div>
      <p className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        limit에 걸리거나 읽기 실패 파일이 있으면 결과가 완전하지 않다는 사실을 다음 단계에 전달해야 한다.
      </p>
    </figure>
  );
}
