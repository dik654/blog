import { useState } from 'react';
import { Archive, GitFork, Radio, ShieldAlert } from 'lucide-react';

type StateId = 'live' | 'saved' | 'forked' | 'effect';

const states = [
  { id: 'live', label: 'Live turn', icon: Radio },
  { id: 'saved', label: 'Saved', icon: Archive },
  { id: 'forked', label: 'Forked', icon: GitFork },
  { id: 'effect', label: 'Effect', icon: ShieldAlert },
] as const;

const stateDetails: Record<StateId, {
  headline: string;
  preserved: string[];
  external: string[];
  conclusion: string;
}> = {
  live: {
    headline: '메모리 안의 Session이 다음 model request를 준비한다.',
    preserved: ['role과 Text·ToolUse·ToolResult', 'token usage', 'workspace root와 model'],
    external: ['권한 판정 기록', '파일·API의 현재 상태', 'grader verdict'],
    conclusion: '대화는 이어지지만 외부 세계의 진실은 별도 owner가 관찰해야 한다.',
  },
  saved: {
    headline: 'snapshot과 JSONL append가 대화 순서를 디스크에 남긴다.',
    preserved: ['session metadata', 'compaction summary', 'prompt history와 messages'],
    external: ['실행 중 process', '미완료 tool의 idempotency 상태', '사람 승인'],
    conclusion: 'load할 수 있다는 것과 같은 실행을 안전하게 resume한다는 것은 다르다.',
  },
  forked: {
    headline: '새 id가 같은 대화 과거를 복제하고 parent lineage를 남긴다.',
    preserved: ['messages와 compaction', 'workspace와 model', 'parent session id와 branch name'],
    external: ['두 branch의 file diff merge', 'side effect rollback', 'conflict resolution'],
    conclusion: 'fork는 다른 미래의 대화 시작점이지 외부 effect를 병합하는 protocol이 아니다.',
  },
  effect: {
    headline: 'ToolResult는 executor return이나 hook·permission failure를 observation으로 붙인다.',
    preserved: ['tool_use_id 연결', 'result content', 'is_error 여부'],
    external: ['executor가 실제 호출됐는지', '배포·파일의 재조회 결과', 'terminal artifact hash'],
    conclusion: 'error result는 실행 전 denial일 수도 있고, “ok”도 effect truth가 아니므로 owner 재관찰이 필요하다.',
  },
};

export default function SessionStateLab() {
  const [active, setActive] = useState<StateId>('live');
  const detail = stateDetails[active];

  return (
    <div
      data-session-state-lab
      data-active-state={active}
      className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">WHAT SURVIVES?</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Session 상태 경계">
          {states.map((state) => {
            const Icon = state.icon;
            const selected = state.id === active;
            return (
              <button
                key={state.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(state.id)}
                className={`flex min-h-11 min-w-0 items-center justify-center gap-2 rounded border px-3 py-2 text-xs font-semibold ${
                  selected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{state.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <p className="text-sm font-bold leading-6">{detail.headline}</p>
        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="min-w-0 bg-background p-4">
            <p className="text-[10px] font-bold text-muted-foreground">SESSION이 보존</p>
            <ul className="mt-3 space-y-2">
              {detail.preserved.map((item) => (
                <li key={item} className="text-xs leading-5">{item}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 bg-background p-4">
            <p className="text-[10px] font-bold text-muted-foreground">외부 OWNER가 필요</p>
            <ul className="mt-3 space-y-2">
              {detail.external.map((item) => (
                <li key={item} className="text-xs leading-5 text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 border-l-2 border-foreground pl-3 text-xs font-medium leading-5">
          {detail.conclusion}
        </p>
      </div>
    </div>
  );
}
