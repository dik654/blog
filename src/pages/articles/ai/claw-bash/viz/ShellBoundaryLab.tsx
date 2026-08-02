import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, CircleX, TerminalSquare } from 'lucide-react';
import { useMemo, useState } from 'react';

type ScenarioId = 'permission' | 'unwired' | 'fallback' | 'filesystem' | 'timeout' | 'background';
type Tone = 'ok' | 'warn' | 'stop';

const scenarios = [
  { id: 'permission', label: '현재 실행 경로' },
  { id: 'unwired', label: '검증 미연결' },
  { id: 'fallback', label: 'launcher 없음' },
  { id: 'filesystem', label: 'workspace-only' },
  { id: 'timeout', label: 'timeout' },
  { id: 'background', label: 'background' },
] as const;

const scenarioData: Record<ScenarioId, {
  state: string;
  stateTone: 'partial' | 'risk' | 'current';
  summary: string;
  stages: Array<{ label: string; value: string; tone: Tone }>;
  invariant: string;
}> = {
  permission: {
    state: 'PARTIAL GATE',
    stateTone: 'partial',
    summary: 'production dispatcher는 동적 mode를 분류하고 enforcer가 있을 때만 확인한 뒤 실행한다.',
    stages: [
      { label: 'CLASSIFY', value: '첫 command + path heuristic', tone: 'warn' },
      { label: 'ENFORCER', value: 'Option이 Some일 때 검사', tone: 'warn' },
      { label: 'PREFLIGHT', value: 'branch 상태에 따라 조기 반환', tone: 'warn' },
      { label: 'EXECUTE', value: '그 외에만 execute_bash', tone: 'ok' },
    ],
    invariant: 'permission 분류는 authorization 신호이고 branch preflight는 containment가 아니다.',
  },
  unwired: {
    state: 'UNWIRED',
    stateTone: 'risk',
    summary: '별도 validate_command의 네 단계는 존재하지만 production execute path가 호출하지 않는다.',
    stages: [
      { label: 'MODULE', value: 'mode → sed → destructive → path', tone: 'ok' },
      { label: 'CALL SITES', value: '동일 파일 tests뿐', tone: 'stop' },
      { label: 'RUN_BASH', value: 'validation call 없음', tone: 'stop' },
      { label: 'EFFECT', value: 'Warn/Block이 실행을 막지 않음', tone: 'stop' },
    ],
    invariant: '함수 존재, unit test, production enforcement는 서로 다른 증거다.',
  },
  fallback: {
    state: 'FAIL-OPEN',
    stateTone: 'risk',
    summary: 'probe 실패나 namespace·network가 모두 비활성이어서 launcher가 없으면 host의 sh -lc로 내려간다.',
    stages: [
      { label: 'REQUEST', value: 'sandbox disabled 또는 격리 둘 다 비활성', tone: 'warn' },
      { label: 'PROBE', value: 'unshare 불가일 수도 있음', tone: 'warn' },
      { label: 'LAUNCHER', value: 'None', tone: 'stop' },
      { label: 'FALLBACK', value: 'host sh -lc', tone: 'stop' },
    ],
    invariant: 'fallback_reason 기록과 실제 위험 실행 거부는 같은 보장이 아니다.',
  },
  filesystem: {
    state: 'NOT ENFORCED',
    stateTone: 'risk',
    summary: 'filesystem_active가 true여도 launcher는 workspace bind boundary를 구성하지 않는다.',
    stages: [
      { label: 'MODE', value: 'workspace-only', tone: 'ok' },
      { label: 'STATUS', value: 'filesystem_active = true', tone: 'warn' },
      { label: 'ENV', value: 'HOME · TMPDIR · allowed mounts', tone: 'warn' },
      { label: 'MOUNT POLICY', value: '실제 bind enforcement 없음', tone: 'stop' },
    ],
    invariant: '환경변수는 절대 경로 접근을 막는 kernel containment가 아니다.',
  },
  timeout: {
    state: 'TREE UNKNOWN',
    stateTone: 'risk',
    summary: 'foreground timeout은 기다림을 끝내지만 전체 process group을 종료하고 reap하는 코드는 없다.',
    stages: [
      { label: 'SPAWN', value: 'command.output()', tone: 'ok' },
      { label: 'WAIT', value: 'tokio::time::timeout', tone: 'warn' },
      { label: 'RETURN', value: 'interrupted = true', tone: 'warn' },
      { label: 'DESCENDANTS', value: 'kill / wait 증거 없음', tone: 'stop' },
    ],
    invariant: 'timeout 응답과 자식·손자 프로세스 소멸을 따로 테스트해야 한다.',
  },
  background: {
    state: 'PID ONLY',
    stateTone: 'risk',
    summary: 'background 분기는 표준 스트림을 버리고 spawn한 PID 문자열을 즉시 반환한다.',
    stages: [
      { label: 'STDIO', value: 'stdin/out/err = null', tone: 'warn' },
      { label: 'SPAWN', value: 'host 또는 unshare command', tone: 'ok' },
      { label: 'RETURN', value: 'backgroundTaskId = PID', tone: 'ok' },
      { label: 'LIFECYCLE', value: 'registry · logs · cancel 없음', tone: 'stop' },
    ],
    invariant: 'PID를 반환하는 것만으로 관리 가능한 background task가 완성되지는 않는다.',
  },
};

const stateClass = {
  partial: 'border-amber-600/30 bg-amber-500/[0.06] text-amber-800 dark:text-amber-200',
  risk: 'border-rose-600/30 bg-rose-500/[0.06] text-rose-800 dark:text-rose-200',
  current: 'border-sky-600/30 bg-sky-500/[0.06] text-sky-800 dark:text-sky-200',
} as const;

const railClass: Record<Tone, string> = {
  ok: 'border-teal-600/55',
  warn: 'border-amber-600/55',
  stop: 'border-rose-600/55',
};

export default function ShellBoundaryLab() {
  const [scenario, setScenario] = useState<ScenarioId>('permission');
  const selected = useMemo(() => scenarioData[scenario], [scenario]);

  return (
    <div data-shell-boundary-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-4 w-4 text-sky-700 dark:text-sky-300" aria-hidden="true" />
          <p className="text-[10px] font-bold text-muted-foreground">SHELL EXECUTION BOUNDARY LAB</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="셸 실행 시나리오">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={scenario === item.id}
              onClick={() => setScenario(item.id)}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                scenario === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scenario}
          data-shell-scenario={scenario}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="min-w-0"
        >
          <div className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_12rem]">
            <p className="min-w-0 break-words px-4 py-4 text-sm leading-relaxed sm:px-5">{selected.summary}</p>
            <div className="flex items-center border-t border-border px-4 py-3 lg:border-l lg:border-t-0 sm:px-5">
              <span className={`inline-flex items-center gap-2 rounded border px-2.5 py-1.5 font-mono text-[10px] font-bold ${stateClass[selected.stateTone]}`}>
                {selected.stateTone === 'risk' ? <CircleX className="h-3.5 w-3.5" /> : selected.stateTone === 'partial' ? <CircleAlert className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                {selected.state}
              </span>
            </div>
          </div>

          <div className="grid min-w-0 px-4 py-5 sm:grid-cols-4 sm:px-5">
            {selected.stages.map((stage, index) => (
              <div key={`${scenario}-${stage.label}`} className={`min-w-0 border-l-2 py-2 pl-3 sm:border-l-0 sm:border-t-2 sm:pb-0 sm:pl-0 sm:pr-3 sm:pt-3 ${railClass[stage.tone]}`}>
                <p className="font-mono text-[9px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')} · {stage.label}</p>
                <p className="mt-1 break-words text-xs font-semibold leading-relaxed [overflow-wrap:anywhere]">{stage.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-border bg-muted/15 px-4 py-3 sm:px-5">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">검증할 invariant.</strong> {selected.invariant}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
