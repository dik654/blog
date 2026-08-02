import { useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  FileJson2,
  ListChecks,
  Users,
} from 'lucide-react';

type TabId = 'packet' | 'task' | 'team' | 'cron';
type PacketCase = 'workspace' | 'module';

const tabs = [
  { id: 'packet', label: 'Packet', icon: FileJson2 },
  { id: 'task', label: 'Task', icon: ListChecks },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'cron', label: 'Cron', icon: CalendarClock },
] as const;

const panels: Record<TabId, {
  input: string;
  path: string[];
  result: string;
  proved: string;
  missing: string[];
  tone: 'ok' | 'warn';
}> = {
  packet: {
    input: 'scope = workspace · schema에 공개된 필드만 전송',
    path: ['JSON → TaskPacket', 'validate_required', 'validate_scope_requirements', 'ValidatedPacket'],
    result: '검증 통과',
    proved: 'workspace scope는 별도 scope_path 없이 현재 schema와 validator를 함께 통과한다.',
    missing: ['module용 scope_path가 schema에 없음', 'worktree가 schema에 없음', 'repo가 실제 존재하는지', 'branch policy를 누가 강제하는지'],
    tone: 'ok',
  },
  task: {
    input: 'RunTaskPacket(valid packet)',
    path: ['create_from_packet', 'HashMap insert', 'status = Created', 'JSON 반환'],
    result: 'task_… / created',
    proved: '프로세스 메모리에 작업 기록이 생겼다.',
    missing: ['worker spawn', 'Running 전이', 'acceptance test 실행', 'terminal receipt'],
    tone: 'warn',
  },
  team: {
    input: 'tasks = [{ prompt, description }]',
    path: ['문서화된 item 입력', 'run_team_create', '각 object에서 task_id 탐색', '없는 값은 filter_map으로 제거'],
    result: 'task_ids = []',
    proved: 'Prompt·description만 보낸 호출은 Team 레코드를 만들지만 task를 연결하지 못한다.',
    missing: ['task_id를 문서화하는 item schema', 'prompt에서 task를 생성하는 wiring', 'worker pool', 'team completion reducer'],
    tone: 'warn',
  },
  cron: {
    input: 'schedule = "*/5 * * * *"',
    path: ['CronCreate', 'schedule 문자열 저장', 'enabled = true', 'JSON 반환'],
    result: 'cron_… / enabled',
    proved: 'schedule 문자열을 가진 레코드가 생겼다.',
    missing: ['cron parser', 'clock loop', 'lease·중복 실행 방지', 'task spawn', 'record_run 연결'],
    tone: 'warn',
  },
};

const modulePacketPanel = {
  input: 'scope = module · scope_path는 schema에 없어 보낼 수 없음',
  path: ['JSON Schema는 module 문자열 허용', 'TaskPacket.scope_path = None', 'validate_scope_requirements', 'validation error'],
  result: '검증 실패 · scope_path is required',
  proved: 'model-facing schema와 runtime validator의 계약이 서로 맞지 않는다.',
  missing: ['scope_path를 공개하는 schema repair', 'worktree 공개 여부 결정', 'schema와 validator 통합 테스트'],
  tone: 'warn' as const,
};

export default function TaskControlPlaneLab() {
  const [active, setActive] = useState<TabId>('packet');
  const [packetCase, setPacketCase] = useState<PacketCase>('workspace');
  const panel = active === 'packet' && packetCase === 'module' ? modulePacketPanel : panels[active];

  return (
    <div
      data-task-control-plane-lab
      data-active-tab={active}
      data-packet-case={packetCase}
      className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">CONTROL RECORD OR EXECUTION?</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Task control plane 단계">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(tab.id)}
                className={`flex min-h-11 min-w-0 items-center justify-center gap-2 rounded border px-3 py-2 text-xs font-semibold transition-colors ${
                  selected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="min-w-0 border-b border-border p-4 lg:border-b-0 lg:border-r sm:p-5">
          <p className="text-xs font-bold text-muted-foreground">INPUT</p>
          {active === 'packet' && (
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-md border border-border p-1" aria-label="Packet scope 사례">
              <button
                type="button"
                onClick={() => setPacketCase('workspace')}
                aria-pressed={packetCase === 'workspace'}
                className={`min-h-11 rounded px-2 text-xs font-bold ${packetCase === 'workspace' ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
              >
                workspace · 통과
              </button>
              <button
                type="button"
                onClick={() => setPacketCase('module')}
                aria-pressed={packetCase === 'module'}
                className={`min-h-11 rounded px-2 text-xs font-bold ${packetCase === 'module' ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
              >
                module · 실패
              </button>
            </div>
          )}
          <code className="mt-2 block break-words text-xs font-semibold leading-6 [overflow-wrap:anywhere]">
            {panel.input}
          </code>

          <ol className="mt-5 grid gap-2 sm:grid-cols-2">
            {panel.path.map((step, index) => (
              <li key={step} className="min-w-0 border-l-2 border-border py-1 pl-3">
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-1 break-words text-xs font-semibold leading-5">{step}</p>
              </li>
            ))}
          </ol>

          <div className={`mt-5 flex min-w-0 items-start gap-3 rounded-md border p-3 ${
            panel.tone === 'ok'
              ? 'border-emerald-600/30 bg-emerald-500/[0.04]'
              : 'border-amber-600/30 bg-amber-500/[0.04]'
          }`}>
            {panel.tone === 'ok'
              ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />}
            <div className="min-w-0">
              <p className="break-words font-mono text-xs font-bold [overflow-wrap:anywhere]">{panel.result}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{panel.proved}</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <p className="text-xs font-bold text-muted-foreground">STILL MISSING</p>
          <ul className="mt-3 space-y-2">
            {panel.missing.map((item) => (
              <li key={item} className="flex min-w-0 gap-2 text-xs leading-5 text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" aria-hidden="true" />
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-border pt-4 text-xs leading-5">
            <strong>판정:</strong>{' '}
            {active === 'packet'
              ? packetCase === 'workspace'
                ? '입력 계약을 통과했다. 아직 실행은 아니다.'
                : '입력 계약 자체가 닫히지 않았다. 실행 단계로 갈 수 없다.'
              : '레코드가 생겼다. 외부 효과와 완료 증거는 아직 없다.'}
          </p>
        </div>
      </div>
    </div>
  );
}
