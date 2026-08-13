import VizFrame from "@/components/viz/VizFrame";

const groups = [
  { step: "01", label: "Host", title: "AI application", body: "사용자·model·정책과 연결 범위를 소유" },
  { step: "02", label: "MCP", title: "Shared contract", body: "기능 발견·typed request·result를 표준화" },
  { step: "03", label: "Server", title: "Domain capability", body: "Tool·Resource·Prompt를 좁은 책임으로 제공" },
] as const;

export default function OverviewViz() {
  return (
    <VizFrame
      eyebrow="통합 경계"
      title="MCP는 host와 server 사이의 message contract를 표준화합니다"
      description="호환 가능한 연결 지점은 만들지만 권한·업무 의미·sandbox를 대신 결정하지는 않습니다."
      note="화살표가 나타내는 것은 신뢰 위임이 아니라 protocol message의 왕복입니다."
    >
      <div className="grid gap-7 md:grid-cols-3 md:gap-6">
        {groups.map((group) => (
          <section key={group.label} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-xs font-bold text-primary">{group.label}</p>
              <span className="font-mono text-[11px] text-muted-foreground">{group.step}</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-foreground">{group.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{group.body}</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
