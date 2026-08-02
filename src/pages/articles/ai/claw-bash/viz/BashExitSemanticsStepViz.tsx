const CASES = [
  ['grep / rg', '1', '패턴 없음', '도구 오류가 아니라 빈 검색 결과일 수 있다.'],
  ['diff', '1', '파일이 다름', '비교는 수행됐고 차이가 존재한다.'],
  ['test / [', '1', '조건 false', 'shell 분기 조건의 정상 결과다.'],
];

export default function BashExitSemanticsStepViz() {
  return (
    <figure
      aria-label="같은 exit code 1이 명령별로 다른 의미를 갖는 예"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">exit code는 숫자 하나가 아니라 command contract다</p>
      </figcaption>
      <div className="divide-y divide-border">
        {CASES.map(([command, code, meaning, interpretation]) => (
          <div
            key={command}
            className="grid gap-2 px-4 py-3 sm:grid-cols-[130px_70px_120px_minmax(0,1fr)] sm:items-center"
          >
            <code className="text-[13px] font-semibold">{command}</code>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">exit {code}</span>
            <span className="text-sm font-semibold">{meaning}</span>
            <span className="text-xs leading-relaxed text-muted-foreground">{interpretation}</span>
          </div>
        ))}
      </div>
      <p className="border-t border-border bg-muted/20 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        현재 runner는 non-zero를 <code className="text-xs">exit_code:N</code>으로 기록할 뿐 command별
        의미를 자동 해석하지 않는다. 해석은 caller나 더 높은 semantic layer의 책임이다.
      </p>
    </figure>
  );
}
