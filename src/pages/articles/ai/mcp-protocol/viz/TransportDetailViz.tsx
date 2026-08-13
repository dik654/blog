import VizFrame from "@/components/viz/VizFrame";

const events = [
  { event: "Complete", request: "tools/call", channel: "JSON 또는 SSE", next: "resultType=complete" },
  { event: "Need input", request: "tools/call", channel: "새 id로 retry", next: "inputResponses + requestState" },
  { event: "Cancel", request: "진행 중 request", channel: "HTTP stream close / stdio notification", next: "cleanup·effect 확인" },
  { event: "Subscribe", request: "subscriptions/listen", channel: "독립 장기 stream", next: "변경 notification 수신" },
] as const;

export default function TransportDetailViz() {
  return (
    <VizFrame
      eyebrow="Async lifecycle"
      title="완료·추가 입력·취소·구독은 서로 다른 state transition입니다"
      description="모든 장기 동작을 하나의 SSE session으로 뭉치지 않고 request와 subscription 수명을 분리합니다."
    >
      <div className="divide-y divide-border/70">
        {events.map((item) => (
          <section key={item.event} className="grid min-w-0 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_10rem_1fr_1fr] sm:items-baseline">
            <h4 className="text-sm font-bold">{item.event}</h4>
            <p className="break-words font-mono text-xs text-primary">{item.request}</p>
            <p className="text-xs leading-5 text-muted-foreground">{item.channel}</p>
            <p className="text-xs leading-5 text-muted-foreground">{item.next}</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
