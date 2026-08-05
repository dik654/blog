import { useState } from 'react';
import {
  Check,
  FileSearch,
  Play,
  ScanSearch,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

type StageId = 'request' | 'proposal' | 'decision' | 'observation';

type Stage = {
  id: StageId;
  index: string;
  label: string;
  short: string;
  icon: LucideIcon;
  owner: string;
  handoff: string;
  proves: string;
  missing: string;
  trace: string[];
};

const stages: Stage[] = [
  {
    id: 'request',
    index: '01',
    label: '요청 구성',
    short: '목표와 문맥',
    icon: FileSearch,
    owner: '사용자와 Claude Code session',
    handoff: '요청, 현재 대화, CLAUDE.md, 필요한 파일·도구 설명',
    proves: '모델이 다음 행동을 고를 입력이 구성됐다.',
    missing: '파일 수정이나 명령 실행은 아직 없다.',
    trace: ['사용자 목표', 'project context', 'available tools'],
  },
  {
    id: 'proposal',
    index: '02',
    label: '행동 제안',
    short: 'tool call',
    icon: ScanSearch,
    owner: '선택한 Claude model',
    handoff: '도구 이름과 구조화된 인자. 예: Edit(path, old, new)',
    proves: '모델이 어떤 행동을 원하며 인자가 무엇인지 드러났다.',
    missing: '제안은 승인도 실행 결과도 아니다.',
    trace: ['assistant turn', 'tool name', 'arguments'],
  },
  {
    id: 'decision',
    index: '03',
    label: '허용과 격리',
    short: 'policy + sandbox',
    icon: ShieldCheck,
    owner: 'permission rules, 현재 mode, Bash sandbox',
    handoff: 'allow·ask·deny 결정 또는 승인 요청. Bash라면 허용된 filesystem·network 경계',
    proves: '이 session에서 이 행동이 통과할 조건과 실행 경계가 정해졌다.',
    missing: '허용됐다는 사실만으로 명령 성공이나 업무 성공은 증명되지 않는다.',
    trace: ['rule match', 'mode decision', 'sandbox boundary'],
  },
  {
    id: 'observation',
    index: '04',
    label: '결과 관찰',
    short: 'result → next turn',
    icon: Play,
    owner: 'tool executor와 agent loop',
    handoff: 'stdout·stderr, exit status, 파일 diff 같은 observation을 다음 model turn에 전달',
    proves: '실제 실행 결과를 바탕으로 반복할지 최종 응답할지 판단할 수 있다.',
    missing: '최종 문장만으로 제품 acceptance와 부작용 부재가 자동 증명되지는 않는다.',
    trace: ['tool result', 'updated context', 'repeat or stop'],
  },
];

export default function ClaudeCodeBoundaryLab() {
  const [activeId, setActiveId] = useState<StageId>('request');
  const activeIndex = stages.findIndex((stage) => stage.id === activeId);
  const active = stages[activeIndex];
  const Icon = active.icon;

  return (
    <div
      data-claude-code-boundary-lab
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">한 번의 coding turn</p>
        <h3 className="mt-1 text-base font-bold">제안과 외부 효과 사이의 네 경계</h3>
      </header>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {stages.map((stage, index) => {
          const StageIcon = stage.icon;
          const isActive = stage.id === activeId;
          const isDone = index < activeIndex;
          return (
            <button
              key={stage.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveId(stage.id)}
              className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left transition-colors ${
                isActive ? 'bg-blue-500/[0.07]' : 'hover:bg-muted/35'
              }`}
            >
              <span className="flex items-center gap-2">
                {isDone ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <StageIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                )}
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-black text-muted-foreground">{stage.index}</span>
                  <span className="block break-words text-xs font-bold leading-4">{stage.label}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)]">
        <div className="min-w-0 px-4 py-5 sm:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/25 bg-blue-500/[0.06]">
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{active.short}</p>
              <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{active.handoff}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">현재 owner</p>
              <p className="mt-1 break-words text-sm font-semibold leading-6">{active.owner}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">남기는 trace</p>
              <p className="mt-1 break-words font-mono text-[11px] leading-6 text-muted-foreground">
                {active.trace.join(' · ')}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 border-t border-border bg-muted/[0.12] px-4 py-5 lg:border-l lg:border-t-0">
          <div className="border-l-2 border-emerald-500/60 pl-3">
            <p className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">여기까지 증명</p>
            <p className="mt-1 break-words text-sm leading-6">{active.proves}</p>
          </div>
          <div className="mt-5 border-l-2 border-amber-500/60 pl-3">
            <p className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">아직 증명하지 않음</p>
            <p className="mt-1 break-words text-sm leading-6">{active.missing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
