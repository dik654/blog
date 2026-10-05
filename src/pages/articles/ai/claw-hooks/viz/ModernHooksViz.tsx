const stages = [
  ["01 · REQUEST", "Bash 제안", "git push origin main · 기본 판정 Ask"],
  ["02 · HOOK 1", "Ask를 남기고 계속", "변경 티켓 확인 이유를 합성한 뒤 다음 hook으로 갑니다."],
  ["03 · HOOK 2", "Deny에서 조기 중단", "main 직접 push 금지 판정이 terminal result가 됩니다."],
  ["04 · EXECUTOR", "실행되지 않음", "Shell process와 push side effect가 생기지 않습니다."],
  ["05 · REMAINDER", "도달하지 않음", "뒤 pre-hook과 tool 성공 뒤 PostToolUse도 실행되지 않습니다."],
] as const;

export function HookLifecycleViz() {
  return (
    <figure data-viz="claw-hook-lifecycle" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">Ask 뒤 Deny가 오면 executor 앞에서 흐름이 끊긴다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">로그인 401 작업 중 main push를 제안한 한 요청입니다. Pinned matching hook은 등록 순서대로 실행되고 Deny에서 중단됩니다.</p>
      </figcaption>
      <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-5">
        {stages.map(([n, title, detail], index) => (
          <div key={n} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-primary">{n}</span>
            <p className="mt-2 break-keep text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p>
            {index < stages.length - 1 && <span aria-hidden className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:block md:translate-x-0 md:-translate-y-1/2">→</span>}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        <code>updatedInput</code>이 나오면 바뀐 command를 대상으로 schema와 permission을 다시 검사해야 합니다. 원래 입력의 승인을 새 effect에 넘기지 않습니다.
      </p>
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
