/**
 * 본문 대응: #small-case, #executable-plan, #plan-boundaries — A→B→C 사슬과 별도의 D.
 * 칸 하나가 작업 하나이고, 칸 안에 읽은 입력·만든 결과·현재 상태를 적습니다.
 * 상태는 색과 함께 글자로도 적어 색만으로 구분하지 않습니다.
 */

export type TaskTone = "done" | "update" | "reopen" | "invalid" | "keep" | "fresh" | "stale";

export interface TaskCell {
  id: "A" | "B" | "C" | "D";
  input: string;
  output: string;
  status: string;
  tone: TaskTone;
}

export interface LinkCell {
  label: string;
  /** missing: 기록에서 빠진 연결, extra: 실제로 읽지 않았는데 붙인 연결 */
  kind: "normal" | "missing" | "extra";
}

const TONE_CLASS: Record<TaskTone, string> = {
  done: "border-border bg-background",
  keep: "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
  fresh: "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
  update: "border-sky-600 bg-sky-50 dark:bg-sky-950/40",
  reopen: "border-amber-600 bg-amber-50 dark:bg-amber-950/40",
  invalid: "border-dashed border-amber-600 bg-amber-50/60 dark:bg-amber-950/30",
  stale: "border-dashed border-red-600 bg-red-50 dark:bg-red-950/40",
};

const STATUS_CLASS: Record<TaskTone, string> = {
  done: "text-muted-foreground",
  keep: "text-emerald-700 dark:text-emerald-400",
  fresh: "text-emerald-700 dark:text-emerald-400",
  update: "text-sky-700 dark:text-sky-400",
  reopen: "text-amber-700 dark:text-amber-400",
  invalid: "text-amber-700 dark:text-amber-400",
  stale: "text-red-700 dark:text-red-400",
};

function Card({ task }: { task: TaskCell }) {
  return (
    <div className={`grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 rounded-lg border px-3 py-2 text-xs leading-5 sm:block ${TONE_CLASS[task.tone]}`}>
      <strong className="row-span-3 block text-sm font-bold">작업 {task.id}</strong>
      <span className="block font-mono text-muted-foreground [overflow-wrap:anywhere] sm:mt-1">읽음 {task.input}</span>
      <span className="block font-mono text-muted-foreground [overflow-wrap:anywhere]">만듦 {task.output}</span>
      <span className={`block break-keep font-bold sm:mt-1 ${STATUS_CLASS[task.tone]}`}>{task.status}</span>
    </div>
  );
}

function Arrow({ link }: { link: LinkCell }) {
  const tone = link.kind === "missing" ? "text-red-700 dark:text-red-400" : link.kind === "extra" ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground";
  return (
    <div className={`flex min-w-0 items-center justify-center gap-2 py-1 text-center sm:flex-col sm:gap-0 sm:py-0 ${tone}`}>
      <svg className="sm:hidden" width="12" height="18" viewBox="0 0 12 18" aria-hidden="true">
        <line x1="6" y1="1" x2="6" y2="13" stroke="currentColor" strokeWidth="1.25" strokeDasharray={link.kind === "normal" ? undefined : "3 2"} />
        <path d="M2 12 L6 17 L10 12" fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
      <svg className="hidden sm:block" width="20" height="12" viewBox="0 0 20 12" aria-hidden="true">
        <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.25" strokeDasharray={link.kind === "normal" ? undefined : "3 2"} />
        <path d="M14 2 L19 6 L14 10" fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
      <span className="break-keep font-mono text-[10px] leading-3 sm:mt-0.5">{link.label}</span>
    </div>
  );
}

/** 위 줄은 A→B→C 사슬, 아래 줄은 D와 D에 붙은 연결 설명입니다. */
export function TaskGraph({
  tasks,
  links,
  dLink,
}: {
  tasks: readonly [TaskCell, TaskCell, TaskCell, TaskCell];
  links: readonly [LinkCell, LinkCell];
  dLink: { text: string; kind: LinkCell["kind"] };
}) {
  const [a, b, c, d] = tasks;
  const dTone = dLink.kind === "missing" ? "border-red-600 text-red-700 dark:text-red-400" : dLink.kind === "extra" ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground";
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-1 items-stretch gap-1 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)_3.5rem_minmax(0,1fr)] sm:gap-2">
        <Card task={a} />
        <Arrow link={links[0]} />
        <Card task={b} />
        <Arrow link={links[1]} />
        <Card task={c} />
      </div>
      <div className="mt-3 grid grid-cols-1 items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-3">
        <Card task={d} />
        <p className={`flex items-center break-keep rounded-lg border border-dashed px-3 py-2 text-xs leading-5 ${dTone}`}>{dLink.text}</p>
      </div>
    </div>
  );
}
