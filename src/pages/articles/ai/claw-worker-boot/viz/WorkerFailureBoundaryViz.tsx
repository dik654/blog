import { Clock3, FileWarning, RefreshCcw, Square } from 'lucide-react';

const cases = [
  {
    title: 'restart',
    Icon: RefreshCcw,
    current: 'status와 prompt bookkeeping을 Spawning으로 초기화',
    missing: 'process respawn, PTY 재연결, old process 정리',
  },
  {
    title: 'terminate',
    Icon: Square,
    current: 'status를 Finished로 기록하고 event 추가',
    missing: 'cancel token, SIGTERM/SIGKILL, child wait, resource 회수',
  },
  {
    title: 'startup timeout',
    Icon: Clock3,
    current: '호출 시 state·pane·prompt/gate·transport/MCP evidence를 분류',
    missing: '내부 deadline owner와 자동 timeout trigger',
  },
  {
    title: 'worker-state.json',
    Icon: FileWarning,
    current: 'temp file을 쓴 뒤 rename 시도',
    missing: 'I/O 실패 전파, durability 확인, 재시작 복원',
  },
];

export default function WorkerFailureBoundaryViz() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-3 sm:px-5">
        <p className="m-0 text-sm font-bold text-foreground">이름보다 실제 side effect를 읽기</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          lifecycle처럼 들리는 API 이름과 현재 구현이 실제로 수행하는 동작을 분리한다.
        </p>
      </figcaption>
      <div className="grid min-w-0 gap-px bg-border sm:grid-cols-2">
        {cases.map((item) => (
          <div key={item.title} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <item.Icon className="size-4 shrink-0 text-foreground" aria-hidden="true" />
              <p className="m-0 break-words font-mono text-sm font-bold text-foreground">{item.title}</p>
            </div>
            <div className="mt-4 border-l-2 border-emerald-500/60 pl-3">
              <p className="m-0 text-xs font-bold text-emerald-700 dark:text-emerald-300">현재 보장</p>
              <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{item.current}</p>
            </div>
            <div className="mt-3 border-l-2 border-rose-500/60 pl-3">
              <p className="m-0 text-xs font-bold text-rose-700 dark:text-rose-300">이 모듈 밖의 책임</p>
              <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{item.missing}</p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
