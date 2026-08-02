import { ArrowDown, Braces, CircleAlert, MessageSquareText } from 'lucide-react';

const OUTCOMES = [
  {
    exit: '0',
    process: 'JSON 또는 text를 parse',
    chain: 'deny가 아니면 다음 command 계속',
    final: 'message·override·updatedInput 누적',
    tone: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    exit: '2',
    process: '명시적 Deny',
    chain: '즉시 chain 중단',
    final: 'Pre면 tool 차단, Post면 result error',
    tone: 'text-rose-700 dark:text-rose-300',
  },
  {
    exit: '기타 / signal',
    process: 'Failed',
    chain: '즉시 chain 중단',
    final: 'Pre면 fail-closed, Post면 result error',
    tone: 'text-amber-700 dark:text-amber-300',
  },
] as const;

export default function HookOutputSemanticsViz() {
  return (
    <figure
      aria-label="Hook stdout JSON과 process exit code가 chain 결과로 변환되는 방식"
      className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background [&_code]:text-xs"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">stdout 내용과 process exit는 서로 다른 두 신호다</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          JSON의 의미를 먼저 읽고, exit code가 그 결과를 계속·거부·실패 중 하나로 닫는다.
        </p>
      </figcaption>

      <div className="grid gap-px bg-border md:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)]">
        <div className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2">
            <Braces className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-semibold">stdout object</p>
          </div>
          <div className="mt-4 space-y-3 text-xs">
            <p><code>systemMessage</code> · <code>reason</code> → feedback message</p>
            <p><code>continue: false</code> · <code>decision: "block"</code> → deny</p>
            <p className="leading-relaxed">
              <code>hookSpecificOutput</code> → <code>additionalContext</code>,{' '}
              <code>permissionDecision</code>, <code>updatedInput</code>
            </p>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-background md:flex">
          <ArrowDown className="h-4 w-4 -rotate-90 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-semibold">parse 규칙</p>
          </div>
          <div className="mt-4 space-y-3 text-xs leading-relaxed">
            <p>빈 stdout은 변경 없는 allow 결과다.</p>
            <p>JSON처럼 시작한 malformed output은 diagnostic message가 된다.</p>
            <p>JSON이 아닌 plain text는 그대로 feedback message가 된다.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 bg-muted/15 px-4 py-2 text-xs font-semibold text-muted-foreground sm:grid-cols-[72px_150px_150px_minmax(0,1fr)]">
          <span>exit</span>
          <span>process 결과</span>
          <span className="hidden sm:block">command chain</span>
          <span className="hidden sm:block">conversation에 미치는 영향</span>
        </div>
        <div className="divide-y divide-border">
          {OUTCOMES.map((item) => (
            <div
              key={item.exit}
              className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-3 text-xs sm:grid-cols-[72px_150px_150px_minmax(0,1fr)]"
            >
              <code className={`font-bold ${item.tone}`}>{item.exit}</code>
              <span>{item.process}</span>
              <span className="col-start-2 text-muted-foreground sm:col-start-3">{item.chain}</span>
              <span className="col-start-2 leading-relaxed sm:col-start-4">{item.final}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 border-t border-border bg-amber-500/[0.04] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong className="text-foreground">Allow는 first-decision이 아니다.</strong> 다음 command도 실행한다.
          뒤 command의 non-empty override나 updatedInput이 앞 값을 교체할 수 있다.
        </p>
      </div>
    </figure>
  );
}
