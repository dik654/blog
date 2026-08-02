import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, Check, Database, Scissors, ShieldCheck } from 'lucide-react';

type Mode = 'manual' | 'auto';
type ScenarioId = 'plain' | 'tool-pair' | 'recompact';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool' | 'system';
  label: string;
  startsWithToolResult?: boolean;
  hasToolUse?: boolean;
}

const scenarios: Record<ScenarioId, {
  label: string;
  description: string;
  estimatedTokens: number;
  messages: Message[];
}> = {
  plain: {
    label: '일반 대화',
    description: '역할 관계를 가르지 않는 평범한 경계',
    estimatedTokens: 12_200,
    messages: [
      { id: 'u1', role: 'user', label: '요구사항' },
      { id: 'a1', role: 'assistant', label: '설계' },
      { id: 'u2', role: 'user', label: '수정 요청' },
      { id: 'a2', role: 'assistant', label: '수정' },
      { id: 'u3', role: 'user', label: '테스트 요청' },
      { id: 'a3', role: 'assistant', label: '테스트' },
      { id: 'u4', role: 'user', label: '검증 요청' },
      { id: 'a4', role: 'assistant', label: '현재 작업' },
    ],
  },
  'tool-pair': {
    label: '도구 경계',
    description: 'raw boundary가 tool_result에서 시작',
    estimatedTokens: 13_500,
    messages: [
      { id: 'u1', role: 'user', label: '파일 검색' },
      { id: 'a1', role: 'assistant', label: '검색 계획' },
      { id: 'u2', role: 'user', label: '범위 지정' },
      { id: 'call', role: 'assistant', label: 'ToolUse(search)', hasToolUse: true },
      { id: 'result', role: 'tool', label: 'ToolResult(5 files)', startsWithToolResult: true },
      { id: 'u3', role: 'user', label: '수정 요청' },
      { id: 'a3', role: 'assistant', label: '현재 작업' },
    ],
  },
  recompact: {
    label: '재압축',
    description: '첫 system summary는 trigger에서 제외',
    estimatedTokens: 9_800,
    messages: [
      { id: 'summary', role: 'system', label: '기존 compact summary' },
      { id: 'u1', role: 'user', label: '후속 요청 1' },
      { id: 'a1', role: 'assistant', label: '작업 1' },
      { id: 'u2', role: 'user', label: '후속 요청 2' },
      { id: 'a2', role: 'assistant', label: '작업 2' },
      { id: 'u3', role: 'user', label: '테스트 요청' },
      { id: 'a3', role: 'assistant', label: '테스트' },
      { id: 'u4', role: 'user', label: '현재 요청' },
    ],
  },
};

const roleStyle: Record<Message['role'], string> = {
  user: 'border-sky-600/25 bg-sky-500/[0.06]',
  assistant: 'border-emerald-600/25 bg-emerald-500/[0.06]',
  tool: 'border-amber-600/30 bg-amber-500/[0.07]',
  system: 'border-violet-600/25 bg-violet-500/[0.06]',
};

export default function CompactPipelineViz() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('tool-pair');
  const [mode, setMode] = useState<Mode>('manual');
  const [preserve, setPreserve] = useState(3);
  const [threshold, setThreshold] = useState(10_000);

  const result = useMemo(() => {
    const scenario = scenarios[scenarioId];
    const summaryPrefix = scenario.messages[0]?.role === 'system' ? 1 : 0;
    const compactableCount = scenario.messages.length - summaryPrefix;
    const countGate = compactableCount > preserve;
    const tokenGate = mode === 'auto' || scenario.estimatedTokens >= threshold;
    const shouldCompact = countGate && tokenGate;
    const rawKeepFrom = Math.max(summaryPrefix, scenario.messages.length - preserve);
    let safeKeepFrom = rawKeepFrom;

    if (shouldCompact) {
      while (safeKeepFrom > summaryPrefix) {
        const firstPreserved = scenario.messages[safeKeepFrom];
        if (!firstPreserved?.startsWithToolResult) break;
        const preceding = scenario.messages[safeKeepFrom - 1];
        safeKeepFrom -= 1;
        if (preceding?.hasToolUse) break;
      }
    }

    return {
      scenario,
      summaryPrefix,
      compactableCount,
      countGate,
      tokenGate,
      shouldCompact,
      rawKeepFrom,
      safeKeepFrom,
      removed: shouldCompact ? scenario.messages.slice(summaryPrefix, safeKeepFrom) : [],
      preserved: shouldCompact ? scenario.messages.slice(safeKeepFrom) : scenario.messages.slice(summaryPrefix),
      boundaryMoved: shouldCompact && safeKeepFrom !== rawKeepFrom,
      installed: shouldCompact && mode === 'auto',
    };
  }, [mode, preserve, scenarioId, threshold]);

  return (
    <div data-compaction-contract-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
          <Scissors className="h-4 w-4" aria-hidden="true" />
          Compaction boundary lab
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          transcript, 보존 개수와 실행 경로를 바꾸며 실제 분기 조건을 추적한다.
        </p>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-muted-foreground">Transcript</legend>
            <div className="grid gap-1">
              {(Object.keys(scenarios) as ScenarioId[]).map((id) => {
                const scenario = scenarios[id];
                const active = scenarioId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setScenarioId(id)}
                    aria-pressed={active}
                    className={`min-h-14 border px-3 py-2 text-left transition-colors ${active ? 'border-foreground bg-muted/45' : 'border-border hover:bg-muted/25'}`}
                  >
                    <span className="block text-sm font-semibold">{scenario.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{scenario.description}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-muted-foreground">적용 경로</legend>
            <div className="grid grid-cols-2 gap-1">
              {([
                ['manual', '수동 결과'],
                ['auto', '자동 설치'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={`min-h-10 border px-2 text-sm font-semibold ${mode === value ? 'border-foreground bg-muted/45' : 'border-border hover:bg-muted/25'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <label className="min-w-0 text-xs font-semibold text-muted-foreground">
              보존 개수
              <select
                aria-label="preserve recent messages"
                value={preserve}
                onChange={(event) => setPreserve(Number(event.target.value))}
                className="mt-2 h-10 w-full border border-border bg-background px-2 text-sm text-foreground"
              >
                <option value={1}>1개</option>
                <option value={3}>3개</option>
                <option value={4}>4개</option>
              </select>
            </label>
            <label className="min-w-0 text-xs font-semibold text-muted-foreground">
              수동 threshold
              <select
                aria-label="manual token threshold"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                disabled={mode === 'auto'}
                className="mt-2 h-10 w-full border border-border bg-background px-2 text-sm text-foreground disabled:opacity-45"
              >
                <option value={8_000}>8,000</option>
                <option value={10_000}>10,000</option>
                <option value={14_000}>14,000</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
            <Gate label="메시지 수" pass={result.countGate} detail={`${result.compactableCount} > ${preserve}`} />
            <Gate
              label={mode === 'auto' ? '자동 호출' : '추정 토큰'}
              pass={result.tokenGate}
              detail={mode === 'auto' ? 'max = 0' : `${result.scenario.estimatedTokens.toLocaleString()} >= ${threshold.toLocaleString()}`}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <p className="text-sm font-bold">경계 계산 결과</p>
            <span
              data-compaction-result={result.shouldCompact ? 'compacted' : 'unchanged'}
              className={`text-xs font-semibold ${result.shouldCompact ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}
            >
              {result.shouldCompact ? 'COMPACT' : 'UNCHANGED'}
            </span>
          </div>

          <div className="mt-4 grid gap-2">
            {result.summaryPrefix === 1 && (
              <div className="border border-violet-600/25 bg-violet-500/[0.06] px-3 py-2">
                <p className="text-[10px] font-semibold uppercase text-violet-700 dark:text-violet-300">merge input · trigger 제외</p>
                <p className="mt-1 text-sm font-medium">기존 compact summary</p>
              </div>
            )}

            <Lane title="요약으로 이동" count={result.removed.length} muted={!result.shouldCompact}>
              {result.removed.map((message) => <MessageChip key={message.id} message={message} />)}
              {!result.removed.length && <EmptyLabel>{result.shouldCompact ? '제거할 메시지 없음' : 'gate가 닫혀 원문 유지'}</EmptyLabel>}
            </Lane>

            <div className="flex items-center justify-center gap-2 py-0.5 text-xs text-muted-foreground">
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              raw {result.rawKeepFrom} → safe {result.safeKeepFrom}
              {result.boundaryMoved && <span className="font-semibold text-amber-700 dark:text-amber-300">tool pair 보존</span>}
            </div>

            <Lane title="원문 그대로 보존" count={result.preserved.length}>
              {result.preserved.map((message) => <MessageChip key={message.id} message={message} />)}
            </Lane>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <Outcome
                icon={<Database className="h-4 w-4" aria-hidden="true" />}
                label="반환값"
                value={result.shouldCompact ? `system summary + 원문 ${result.preserved.length}개` : '원본 Session clone'}
              />
              <Outcome
                icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                label="runtime state"
                value={result.installed ? 'compacted_session 설치됨' : '변경되지 않음'}
                strong={result.installed}
                dataState={result.installed ? 'installed' : 'not-installed'}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {mode === 'manual'
                ? '수동 compact(&self)는 결과를 계산한다. 호출자가 채택하기 전까지 실행 중 Session은 그대로다.'
                : '자동 경로는 제거 개수가 0보다 클 때만 self.session을 compacted_session으로 교체한다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Gate({ label, pass, detail }: { label: string; pass: boolean; detail: string }) {
  return (
    <div className="min-w-0 bg-background p-3">
      <div className="flex items-center gap-2">
        <span className={`flex h-4 w-4 items-center justify-center border ${pass ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-border text-muted-foreground'}`}>
          {pass && <Check className="h-3 w-3" aria-hidden="true" />}
        </span>
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-2 break-words font-mono text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}

function Lane({ title, count, muted = false, children }: { title: string; count: number; muted?: boolean; children: ReactNode }) {
  return (
    <div className={`border px-3 py-3 ${muted ? 'border-border bg-muted/10' : 'border-border bg-muted/20'}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold">{title}</p>
        <span className="font-mono text-[10px] text-muted-foreground">{count}</span>
      </div>
      <div className="grid gap-1 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function MessageChip({ message }: { message: Message }) {
  return (
    <div className={`min-w-0 border px-2.5 py-2 ${roleStyle[message.role]}`}>
      <p className="text-[9px] font-semibold uppercase text-muted-foreground">{message.role}</p>
      <p className="mt-0.5 break-words text-xs font-medium">{message.label}</p>
    </div>
  );
}

function EmptyLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">{children}</p>;
}

function Outcome({
  icon,
  label,
  value,
  strong = false,
  dataState,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  strong?: boolean;
  dataState?: string;
}) {
  return (
    <div data-runtime-state={dataState} className="min-w-0 border border-border px-3 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className={`mt-2 break-words text-sm font-semibold ${strong ? 'text-emerald-700 dark:text-emerald-300' : ''}`}>{value}</p>
    </div>
  );
}
