import {
  CircleAlert,
  Database,
  Eye,
  MessageSquareMore,
  MonitorUp,
  Radio,
} from 'lucide-react';

const stages = [
  {
    kicker: '01 · 명령',
    title: 'WorkerSendPrompt',
    body: 'attempt·in-flight·last prompt를 기록한다. task_receipt가 Some일 때만 caller 입력을 복사한다.',
    Icon: MessageSquareMore,
    tone: 'border-border bg-muted/[0.12] text-muted-foreground',
  },
  {
    kicker: '02 · 상태',
    title: 'Running',
    body: '전송을 시도할 상태가 되었다는 control-plane 기록이다.',
    Icon: Database,
    tone: 'border-border bg-muted/[0.12] text-muted-foreground',
  },
  {
    kicker: '03 · 빠진 소유자',
    title: 'Terminal transport',
    body: 'PTY write, stdin flush, delivery ack는 이 모듈에 없다.',
    Icon: MonitorUp,
    tone: 'border-rose-500/40 bg-rose-500/[0.07] text-rose-800 dark:text-rose-300',
  },
  {
    kicker: '04 · 되먹임',
    title: 'WorkerObserve',
    body: '외부가 캡처한 screen text를 다시 넣어 cue를 판별한다.',
    Icon: Eye,
    tone: 'border-border bg-muted/[0.12] text-muted-foreground',
  },
];

export default function WorkerControlPathViz() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-foreground text-background">
            <Radio className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="m-0 text-sm font-bold text-foreground">상태 기록과 실제 전달 사이</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              오른쪽으로 갈수록 강한 증거가 필요하지만 현재 Worker Boot는 transport를 소유하지 않는다.
            </p>
          </div>
        </div>
      </figcaption>

      <div className="p-4 sm:p-5">
        <div className="grid min-w-0 gap-3 md:grid-cols-2">
          {stages.map((stage) => (
            <div key={stage.title} className={`min-w-0 rounded-md border p-4 ${stage.tone}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase text-current/70">{stage.kicker}</span>
                <stage.Icon className="size-4 shrink-0" aria-hidden="true" />
              </div>
              <p className="mt-4 break-words text-sm font-bold text-foreground">{stage.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex min-w-0 items-start gap-3 rounded-md border border-amber-500/40 bg-amber-500/[0.07] p-4">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          <p className="m-0 min-w-0 text-sm leading-relaxed text-foreground">
            <strong>Running이 증명하는 것:</strong> registry가 attempt·in-flight·last prompt를
            기록했다. <code>task_receipt</code>는 <code>Some</code>일 때만 caller 입력을 복사하며
            자체 생성하지 않는다. <strong>증명하지 못하는 것:</strong> 상대 터미널이 바이트를 받았고,
            flush했고, 실제 작업을 시작했다.
          </p>
        </div>
      </div>
    </figure>
  );
}
