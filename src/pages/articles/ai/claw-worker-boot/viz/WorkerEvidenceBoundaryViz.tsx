import { Check, CircleDashed, Eye, LockKeyhole, ShieldAlert, X } from 'lucide-react';

const stateGroups = [
  {
    label: '시작',
    states: [{ name: 'Spawning', detail: 'registry record 생성 또는 gate 해제 뒤 대기' }],
    className: 'border-border bg-muted/[0.08]',
  },
  {
    label: '차단',
    states: [
      { name: 'TrustRequired', detail: '신뢰 확인 화면 cue 발견' },
      { name: 'ToolPermissionRequired', detail: '도구 승인 화면 cue 발견' },
    ],
    className: 'border-border bg-muted/[0.08]',
  },
  {
    label: '핸드셰이크',
    states: [{ name: 'ReadyForPrompt', detail: 'ready cue 또는 복구 조건 충족' }],
    className: 'border-border bg-muted/[0.08]',
  },
  {
    label: '진행',
    states: [{ name: 'Running', detail: 'send_prompt가 attempt와 in-flight 상태를 기록' }],
    className: 'border-border bg-muted/[0.08]',
  },
  {
    label: '종료',
    states: [
      { name: 'Finished', detail: 'completion 또는 terminate API가 표시' },
      { name: 'Failed', detail: '오류 completion 또는 startup timeout' },
    ],
    className: 'border-border bg-muted/[0.08]',
  },
];

const evidence = [
  {
    title: 'screen text',
    can: 'trust·permission·ready·running cue를 추론',
    cannot: 'terminal write와 process 생존을 직접 증명',
  },
  {
    title: 'prompt bookkeeping',
    can: 'attempt 수·last_prompt·선택적 task context를 추적',
    cannot: '상대 프로그램의 수신 acknowledgement를 증명',
  },
  {
    title: 'completion input',
    can: '호출자가 준 finish reason과 출력 token 수를 상태로 기록',
    cannot: 'Worker Boot 자체가 프로세스를 wait하거나 reap',
  },
  {
    title: 'startup timeout',
    can: '상태, pane command, prompt·gate, transport·MCP, elapsed를 분류',
    cannot: '내부 timer가 deadline을 자동 집행',
  },
];

export default function WorkerEvidenceBoundaryViz() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-foreground text-background">
            <Eye className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="m-0 text-sm font-bold text-foreground">7개 상태와 증거의 경계</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              enum은 상태 어휘를 고정하지만 모든 전이를 검증하는 상태 머신 엔진은 아니다.
            </p>
          </div>
        </div>
      </figcaption>

      <div className="p-4 sm:p-5">
        <div className="grid min-w-0 gap-3 md:grid-cols-2">
          {stateGroups.map((group, index) => (
            <div
              key={group.label}
              className={`min-w-0 rounded-md border p-3 ${group.className} ${index === stateGroups.length - 1 ? 'md:col-span-2' : ''}`}
            >
                <p className="m-0 text-xs font-bold text-muted-foreground">{group.label}</p>
                <div className="mt-3 space-y-2">
                  {group.states.map((state) => (
                    <div key={state.name} className="min-w-0 rounded border border-border/70 bg-background/85 p-3">
                      <p className="m-0 break-words font-mono text-xs font-bold text-foreground">{state.name}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{state.detail}</p>
                    </div>
                  ))}
                </div>
            </div>
          ))}
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-bold text-muted-foreground">관찰값이 말할 수 있는 범위</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid min-w-0 gap-3 md:grid-cols-2">
          {evidence.map((item, index) => (
            <div key={item.title} className="min-w-0 rounded-md border border-border p-4">
              <div className="flex items-center gap-2">
                {index === 0 ? (
                  <LockKeyhole className="size-4 shrink-0 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                ) : index === 3 ? (
                  <CircleDashed className="size-4 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                ) : (
                  <ShieldAlert className="size-4 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                )}
                <p className="m-0 break-words font-mono text-xs font-bold text-foreground">{item.title}</p>
              </div>
              <div className="mt-3 grid gap-2">
                <div className="flex min-w-0 items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span className="text-xs leading-relaxed text-muted-foreground">{item.can}</span>
                </div>
                <div className="flex min-w-0 items-start gap-2">
                  <X className="mt-0.5 size-3.5 shrink-0 text-rose-600" aria-hidden="true" />
                  <span className="text-xs leading-relaxed text-muted-foreground">{item.cannot}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
