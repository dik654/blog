import { CheckCircle2, FolderTree, LockKeyhole, ScanSearch, TriangleAlert } from 'lucide-react';

const PHASES = [
  {
    n: '01',
    title: '문자열·경로 요소 필터',
    text: '절대 경로와 .. 같은 명백한 이탈을 일찍 거른다. Path::starts_with는 전체 component를 비교하지만 실제 inode를 고정하지는 않는다.',
    result: '빠른 거절',
    icon: ScanSearch,
  },
  {
    n: '02',
    title: '해석된 실제 대상 확인',
    text: 'canonicalize로 중간 심링크까지 해석한 현재 대상을 workspace root와 비교한다. 새 파일은 존재하는 부모를 기준으로 해석한다.',
    result: '현재 대상 확인',
    icon: FolderTree,
  },
  {
    n: '03',
    title: '파일을 여는 순간 경계 강제',
    text: '검사한 경로 문자열을 다시 여는 대신 dirfd 기준 openat2 RESOLVE_* 같은 제약으로 kernel이 여는 순간 경계를 강제한다.',
    result: 'race를 닫는 단계',
    icon: LockKeyhole,
  },
];

export default function SymlinkEscapeViz() {
  return (
    <figure
      aria-label="워크스페이스 경계를 세 단계로 강제하는 그림"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border bg-muted/15 px-4 py-3">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">workspace/link → /etc/passwd</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              문자열은 안쪽처럼 보여도 해석된 대상은 바깥일 수 있고, 확인한 뒤에도 다시 바뀔 수 있다.
            </p>
          </div>
        </div>
      </figcaption>
      <div className="divide-y divide-border">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.n}
              className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-4 sm:grid-cols-[36px_34px_minmax(0,1fr)_120px] sm:items-start"
            >
              <div className="flex flex-col items-center gap-2 sm:contents">
                <span className="text-xs font-bold text-muted-foreground">{phase.n}</span>
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="min-w-0 sm:col-start-3">
                <p className="text-sm font-semibold">{phase.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{phase.text}</p>
              </div>
              <div className="col-start-2 flex items-center gap-2 text-xs font-medium sm:col-start-4 sm:justify-end">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                {phase.result === 'race를 닫는 단계' ? '경쟁 조건을 닫는 단계' : phase.result}
              </div>
            </div>
          );
        })}
      </div>
      <p className="border-t border-border bg-amber-500/[0.04] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        현재 Claw에는 1·2단계 helper가 있지만 production read/write/edit 경로에는 배선되지 않았다.
        먼저 배선 invariant를 만들고, 3단계 open-time 강제를 추가해야 한다.
      </p>
    </figure>
  );
}
