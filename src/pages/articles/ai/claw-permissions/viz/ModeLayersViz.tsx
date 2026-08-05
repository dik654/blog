import { CircleCheck, CircleHelp, ShieldAlert } from 'lucide-react';

const MODES = [
  {
    name: 'ReadOnly',
    kind: '작업 범위',
    summary: '읽기 중심 도구에 필요한 최소 mode.',
    caution: 'bash의 첫 token 휴리스틱과 별개로 실제 side effect를 보장하지 않는다.',
  },
  {
    name: 'WorkspaceWrite',
    kind: '작업 범위',
    summary: '프로젝트 변경에 필요한 mode.',
    caution: '이름만으로 실제 파일 handle이 workspace 안에 고정되지는 않는다.',
  },
  {
    name: 'DangerFullAccess',
    kind: '작업 범위',
    summary: 'workspace 밖 side effect까지 허용하는 고위험 mode.',
    caution: '격리된 환경과 명시적 운영 경고가 전제되어야 한다.',
  },
  {
    name: 'Prompt',
    kind: '판정 방식',
    summary: '의도상 호출자가 사용자 승인 흐름을 수행해야 하는 상태.',
    caution: '현재 policy의 derived Ord 비교에서는 일반 requirement를 prompt 전에 Allow한다.',
  },
  {
    name: 'Allow',
    kind: '판정 방식',
    summary: 'mode 비교에서 명시적 허용으로 취급되는 상태.',
    caution: 'deny rule과 ask rule보다 우선하지 않는다.',
  },
];

export default function ModeLayersViz() {
  return (
    <figure
      aria-label="Claw의 다섯 permission mode를 작업 범위와 판정 방식으로 나눈 그림"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="min-w-0 border-b border-border px-4 py-3">
        <p className="min-w-0 break-words text-sm font-semibold [overflow-wrap:anywhere]">다섯 variant를 하나의 안전 등급표로 읽지 않는다</p>
        <p className="mt-1 min-w-0 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
          의미상 앞의 세 개는 작업 범위이고 Prompt와 Allow는 특수 상태다. 현재 코드는 이 구분과 달리
          같은 derived order로 비교하므로 Prompt의 묵시적 Allow 결함이 생긴다.
        </p>
      </figcaption>
      <div className="divide-y divide-border">
        {MODES.map((mode, index) => {
          const Icon = mode.kind === '작업 범위' ? CircleCheck : CircleHelp;
          return (
            <div
              key={mode.name}
              className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-4 md:grid-cols-[34px_150px_100px_minmax(0,1fr)_minmax(0,1fr)] md:items-start"
            >
              <span className="text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <code className="text-[13px] font-semibold">{mode.name}</code>
              <span className="col-start-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground md:col-start-auto">
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {mode.kind}
              </span>
              <p className="col-start-2 text-xs leading-relaxed md:col-start-auto">{mode.summary}</p>
              <p className="col-start-2 flex gap-1.5 text-xs leading-relaxed text-muted-foreground md:col-start-auto">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                {mode.caution}
              </p>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
