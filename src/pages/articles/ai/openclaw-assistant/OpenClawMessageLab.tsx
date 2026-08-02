import { useState } from 'react';
import {
  Check,
  Database,
  GitBranch,
  RadioTower,
  Send,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

type StageId = 'admission' | 'route' | 'runtime' | 'delivery' | 'evidence';

type Stage = {
  id: StageId;
  number: string;
  label: string;
  icon: LucideIcon;
  owner: string;
  input: string;
  proves: string;
  missing: string;
  failure: string;
  trace: string[];
};

const stages: Stage[] = [
  {
    id: 'admission',
    number: '01',
    label: '입구 승인',
    icon: ShieldCheck,
    owner: 'Channel adapter와 sender admission',
    input: '서명·token이 검증된 channel event, 안정된 sender ID, DM·group policy',
    proves: '이 sender의 message를 agent 경계 안으로 들여도 된다는 사실.',
    missing: '어느 agent와 conversation을 사용할지는 아직 정하지 않았다.',
    failure: '알 수 없는 DM은 pairing code만 받고 private context나 tool loop에 도달하지 않아야 한다.',
    trace: ['channel', 'account', 'sender', 'admission decision'],
  },
  {
    id: 'route',
    number: '02',
    label: '경로·세션',
    icon: GitBranch,
    owner: 'Gateway routing과 session resolver',
    input: '허용된 sender, channel·account·peer·room과 configured bindings',
    proves: '이번 turn의 agentId와 sessionKey, reply route가 정해졌다.',
    missing: 'Session을 찾았다고 model이나 tool이 실행된 것은 아니다.',
    failure: 'DM scope가 너무 넓으면 서로 다른 사용자가 같은 private history를 읽게 된다.',
    trace: ['agentId', 'sessionKey', 'conversation address'],
  },
  {
    id: 'runtime',
    number: '03',
    label: '판단·효과',
    icon: RadioTower,
    owner: 'OpenClaw-owned embedded agent runtime',
    input: 'Session history, bootstrap files, selected skills, model과 허용된 tool surface',
    proves: 'Model proposal이 policy를 통과한 tool effect와 observation으로 이어졌다.',
    missing: 'Agent의 text가 사용자 channel에 보였다는 사실은 아직 없다.',
    failure: 'Skill instruction이 보인다는 사실과 write·exec capability가 허용됐다는 사실을 혼동하면 안 된다.',
    trace: ['prompt context', 'tool proposal', 'policy', 'tool result'],
  },
  {
    id: 'delivery',
    number: '04',
    label: '응답 전달',
    icon: Send,
    owner: 'Outbound normalizer, message adapter와 channel provider',
    input: 'Text·media payload, destination과 delivery policy',
    proves: '어떤 payload가 어디까지 전달됐고 결과가 delivered·suppressed·failed 중 무엇인지 드러났다.',
    missing: 'Timeout만으로 아무것도 전송되지 않았다고 단정할 수 없다.',
    failure: '일부 chunk가 이미 보인 뒤 blind retry하면 사용자는 같은 답을 두 번 받을 수 있다.',
    trace: ['normalized payload', 'message IDs', 'delivery outcome'],
  },
  {
    id: 'evidence',
    number: '05',
    label: '상태·검증',
    icon: Database,
    owner: 'Gateway store, transcript·audit와 운영자',
    input: 'Session row, tool observation, delivery outcome와 restart 이후 조회 결과',
    proves: 'Turn이 어느 상태까지 commit됐는지 재구성하고 안전한 다음 행동을 고를 수 있다.',
    missing: '로그 한 줄이나 agent 최종 문장만으로 end-to-end 성공은 증명되지 않는다.',
    failure: 'Incognito는 session 기록을 memory에 둘 뿐, tool이 쓴 외부 파일까지 휘발시키지는 않는다.',
    trace: ['SQLite row', 'effect evidence', 'delivery evidence'],
  },
];

export default function OpenClawMessageLab() {
  const [activeId, setActiveId] = useState<StageId>('admission');
  const activeIndex = stages.findIndex((stage) => stage.id === activeId);
  const active = stages[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <div
      data-openclaw-message-lab
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">한 message의 책임 이동</p>
        <h3 className="mt-1 text-base font-bold">채널 event가 검증 가능한 응답이 되기까지</h3>
      </header>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-5">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
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
              } ${stage.id === 'evidence' ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <span className="flex items-center gap-2">
                {isDone ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                )}
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-black text-muted-foreground">{stage.number}</span>
                  <span className="block break-words text-xs font-bold leading-4">{stage.label}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.74fr)]">
        <div className="min-w-0 px-4 py-5 sm:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/25 bg-blue-500/[0.06]">
              <ActiveIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">현재 owner</p>
              <p className="mt-1 break-words text-sm font-bold leading-6">{active.owner}</p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">받는 입력</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{active.input}</p>
          </div>

          <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">남겨야 할 trace</p>
            <p className="min-w-0 break-words font-mono text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {active.trace.join(' · ')}
            </p>
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
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">깨질 때 보이는 증상</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{active.failure}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
