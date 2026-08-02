import { FilePenLine, FileSearch, FileText, FolderSearch, ShieldCheck } from 'lucide-react';

const TOOLS = [
  { name: 'read_file', role: '줄 창을 읽는다', boundary: 'ReadOnly', icon: FileText },
  { name: 'glob_search', role: '경로 후보를 좁힌다', boundary: 'ReadOnly', icon: FolderSearch },
  { name: 'grep_search', role: '내용 후보를 좁힌다', boundary: 'ReadOnly', icon: FileSearch },
  { name: 'edit_file', role: '일치한 문자열을 바꾼다', boundary: 'WorkspaceWrite', icon: FilePenLine },
  { name: 'write_file', role: '파일 전체를 교체한다', boundary: 'WorkspaceWrite', icon: ShieldCheck },
];

export default function FileOpsToolsViz() {
  return (
    <figure
      aria-label="파일 도구를 관찰에서 변경 순서로 배치한 그림"
      className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">side effect가 커지는 순서</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          검색은 후보를 줄이고, 읽기는 내용을 관찰하며, edit와 write만 workspace를 변경한다.
        </p>
      </figcaption>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isWrite = tool.boundary === 'WorkspaceWrite';
          return (
            <div
              key={tool.name}
              className="min-w-0 bg-background p-4 last:col-span-2 sm:last:col-span-1"
            >
              <div className="flex items-center justify-between gap-3">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className={`h-2 w-2 rounded-full ${isWrite ? 'bg-amber-500' : 'bg-emerald-500'}`} aria-hidden="true" />
              </div>
              <code className="mt-4 block break-all text-[13px] font-semibold">{tool.name}</code>
              <p className="mt-2 min-h-10 text-xs leading-relaxed text-muted-foreground">{tool.role}</p>
              <p className="mt-3 text-xs font-medium">{tool.boundary}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-3 border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:grid-cols-3">
        <p><strong className="text-foreground">정책</strong><br />이 action을 요청해도 되는가</p>
        <p><strong className="text-foreground">경로</strong><br />대상이 workspace 안인가</p>
        <p><strong className="text-foreground">변경</strong><br />실패·경합 때 파일이 온전한가</p>
      </div>
    </figure>
  );
}
