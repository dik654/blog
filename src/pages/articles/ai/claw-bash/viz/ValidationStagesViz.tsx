const ROWS = [
  ['01', 'validate_mode', 'Block·Warn', 'ReadOnly 또는 WorkspaceWrite mode heuristic', '호출 안 됨'],
  ['02', 'validate_sed', 'Block', 'ReadOnly에서 첫 command가 sed이고 -i면 차단', '호출 안 됨'],
  ['03', 'check_destructive', 'Warn', 'substring과 첫 command로 파괴 신호 생성', '호출 안 됨'],
  ['04', 'validate_paths', 'Warn', '../, ~/와 $HOME 참조를 heuristic으로 경고', '호출 안 됨'],
];

export default function ValidationStagesViz() {
  return (
    <figure aria-label="현재 Bash validation 후보 함수의 네 단계와 production 미연결 상태" className="not-prose my-7 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">validate_command() 안의 네 단계</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          현재 repository 검색 기준 production execute_bash 경로에는 연결되지 않았다.
        </p>
      </figcaption>
      <div className="divide-y divide-border">
        {ROWS.map((row) => (
          <div
            key={row[0]}
            className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 gap-y-1.5 px-4 py-3 sm:grid-cols-[34px_150px_90px_minmax(0,1fr)_90px] sm:items-center"
          >
            <span className="row-span-4 text-xs font-bold text-muted-foreground sm:row-span-1">{row[0]}</span>
            <code className="break-words whitespace-normal text-[13px] font-semibold">{row[1]}</code>
            <span className={`w-fit rounded-sm border px-1.5 py-0.5 text-xs font-semibold sm:col-auto ${
              row[2].includes('Warn')
                ? 'border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-300'
                : 'border-rose-300 text-rose-700 dark:border-rose-800 dark:text-rose-300'
            }`}>{row[2]}</span>
            <span className="text-xs leading-relaxed text-muted-foreground sm:col-auto">{row[3]}</span>
            <span className="text-xs text-muted-foreground sm:col-auto sm:text-right">{row[4]}</span>
          </div>
        ))}
      </div>
      <p className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        먼저 연결하고, Warn을 누가 Ask·Deny·Allow로 닫는지 정의해야 한다. 그 뒤에도 OS containment는 별도로 필요하다.
      </p>
    </figure>
  );
}
