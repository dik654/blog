import { Activity, Braces, Clock3, LockKeyhole, ScrollText, ShieldCheck, TerminalSquare } from 'lucide-react';

const STAGES = [
  ['01', 'Parse', '구조화된 input', '현재', Braces],
  ['02', 'Permission', '분류 후 선택적 enforcer', '부분', ShieldCheck],
  ['03', 'Validate', '별도 모듈, 실행 경로 미연결', '미연결', ScrollText],
  ['04', 'Sandbox', 'unshare, filesystem 강제 공백', '부분', LockKeyhole],
  ['05', 'Spawn', 'process group 없이 spawn', '부분', TerminalSquare],
  ['06', 'Watch', 'foreground timeout·후처리 절단', '부분', Clock3],
  ['07', 'Audit', '일부 exit/status, signal 의미 공백', '부분', Activity],
] as const;

export default function BashPipelineViz() {
  return (
    <figure aria-label="Bash 실행을 parse부터 audit까지 일곱 단계로 보여 주는 그림" className="not-prose my-7 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">필요한 경계와 현재 snapshot의 구현 상태</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          “부분”은 field나 분기가 존재한다는 뜻이며 production 보장이 완성됐다는 뜻이 아니다.
        </p>
      </figcaption>
      <div className="divide-y divide-border">
        {STAGES.map(([number, title, text, status, Icon]) => (
          <div
            key={number}
            className="grid grid-cols-[28px_24px_minmax(0,1fr)_58px] gap-x-3 gap-y-1 px-4 py-3 sm:grid-cols-[34px_28px_110px_minmax(0,1fr)_70px] sm:items-center"
          >
            <span className="text-xs font-bold text-muted-foreground">{number}</span>
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <strong className="text-sm">{title}</strong>
            <span className="col-start-3 text-sm leading-relaxed text-muted-foreground sm:col-start-auto">{text}</span>
            <span className={`col-start-4 row-span-2 row-start-1 h-fit self-center justify-self-end rounded-sm border px-1.5 py-0.5 text-xs font-semibold sm:col-start-auto sm:row-span-1 ${
              status === '현재'
                ? 'border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300'
                : status === '미연결'
                  ? 'border-rose-300 text-rose-700 dark:border-rose-800 dark:text-rose-300'
                  : 'border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-300'
            }`}>{status}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
