const lifecycle = [
  ["등록", "server config·name"], ["연결", "stdio child spawn"], ["초기화", "initialize"],
  ["발견", "tools/list"], ["호출", "tools/call"], ["종료", "kill·wait"],
] as const;

export function McpLifecycleViz() {
  return (
    <figure data-viz="claw-mcp-lifecycle" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">MCP tool은 발견되기 전에 transport lifecycle을 통과한다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Tool schema와 subprocess의 생존 상태를 한 가지 “연결됨”으로 합치지 않습니다.</p>
      </figcaption>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {lifecycle.map(([title, detail], index) => (
          <div key={title} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
            <span className="text-[11px] font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function McpCorrelationViz() {
  return (
    <figure data-viz="claw-mcp-correlation" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">Frame, JSON-RPC ID, tool identity는 서로 다른 세 경계다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">하나라도 잃으면 byte를 읽었어도 어느 요청의 어느 tool 결과인지 확정할 수 없습니다.</p>
      </figcaption>
      <div className="grid gap-px bg-border/70 md:grid-cols-3">
        <div className="bg-background p-5"><p className="text-xs font-semibold text-primary">Transport</p><p className="mt-2 text-sm font-semibold">Content-Length: 84</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Header 뒤 정확히 84 byte를 한 message로 읽습니다.</p></div>
        <div className="bg-background p-5"><p className="text-xs font-semibold text-primary">Correlation</p><p className="mt-2 text-sm font-semibold">request id 3 ↔ response id 3</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Version과 ID가 다르면 해당 response를 받아들이지 않습니다.</p></div>
        <div className="bg-background p-5"><p className="text-xs font-semibold text-primary">Registry</p><p className="mt-2 break-all text-sm font-semibold">mcp__docs__search</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Server와 tool 이름을 정규화해 model-facing identity를 만듭니다.</p></div>
      </div>
    </figure>
  );
}
