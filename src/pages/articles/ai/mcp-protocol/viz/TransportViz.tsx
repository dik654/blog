import VizFrame from "@/components/viz/VizFrame";

const transports = [
  { label: "stdio", place: "Local subprocess", wire: "stdin/stdout JSON-RPC", owner: "Host가 process 수명 관리", security: "OS identity · permission · sandbox" },
  { label: "Streamable HTTP", place: "Remote/shared service", wire: "POST → JSON 또는 request-scoped SSE", owner: "Service가 endpoint 수명 관리", security: "TLS · OAuth · Origin · tenant policy" },
] as const;

export default function TransportViz() {
  return (
    <VizFrame
      eyebrow="Transport boundary"
      title="같은 MCP message가 local pipe와 remote HTTP를 통해 이동합니다"
      description="선택 기준은 기능 종류가 아니라 배포 위치·수명·인증·관측 책임입니다."
      note="Legacy HTTP+SSE는 deprecated입니다. Streamable HTTP response의 SSE와 구분합니다."
    >
      <div className="grid gap-8 md:grid-cols-2">
        {transports.map((item) => (
          <section key={item.label} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h4 className="text-sm font-bold">{item.label}</h4>
              <p className="text-xs font-semibold text-primary">{item.place}</p>
            </div>
            <dl className="mt-5 space-y-4 text-xs leading-5">
              <div><dt className="font-bold">Wire</dt><dd className="mt-1 break-words font-mono text-muted-foreground">{item.wire}</dd></div>
              <div><dt className="font-bold">Lifecycle</dt><dd className="mt-1 text-muted-foreground">{item.owner}</dd></div>
              <div><dt className="font-bold">Security</dt><dd className="mt-1 text-muted-foreground">{item.security}</dd></div>
            </dl>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
