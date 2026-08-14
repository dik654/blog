const stages = [
  ["01", "Tool 요청", "Bash · git push origin main"],
  ["02", "PreToolUse", "matcher가 맞는 hook을 순서대로 실행"],
  ["03", "판정", "allow · ask · deny · failed"],
  ["04", "Tool 실행", "허용된 입력만 executor로 전달"],
  ["05", "Post hook", "성공/실패 event를 따로 전달"],
] as const;

export function HookLifecycleViz() {
  return (
    <figure data-viz="claw-hook-lifecycle" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">Hook은 tool 실행 전후에 끼어드는 subprocess 경계다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Pinned 구현의 event는 PreToolUse, PostToolUse, PostToolUseFailure 세 가지입니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-3 md:grid-cols-5">
        {stages.map(([n, title, detail], index) => (
          <div key={n} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-primary">{n}</span>
            <p className="mt-2 break-keep text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p>
            {index < stages.length - 1 && <span aria-hidden className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2">→</span>}
          </div>
        ))}
      </div>
    </figure>
  );
}

const outcomes = [
  ["exit 0", "JSON decision을 해석", "명시적 deny가 없으면 계속"],
  ["exit 2", "거부", "뒤 hook과 tool 실행을 중단"],
  ["그 밖의 exit", "실패", "오류로 중단"],
  ["cancel signal", "child kill + wait", "descendant 정리는 별도 검증"],
] as const;

export function HookProtocolViz() {
  return (
    <figure data-viz="claw-hook-protocol" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">같은 stdout이라도 exit status와 JSON field가 결과를 바꾼다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">표준 입력은 JSON이고, 표준 출력은 구조화 결과 또는 일반 message로 읽습니다.</p>
      </figcaption>
      <div className="grid gap-px bg-border/70 sm:grid-cols-2">
        {outcomes.map(([signal, result, boundary]) => (
          <div key={signal} className="min-w-0 bg-background p-4">
            <p className="text-xs font-semibold text-primary">{signal}</p>
            <p className="mt-2 break-words text-sm font-semibold text-foreground">{result}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{boundary}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
