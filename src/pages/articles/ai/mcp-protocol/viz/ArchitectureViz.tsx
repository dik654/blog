import VizFrame from "@/components/viz/VizFrame";

const servers = ["Filesystem", "Database", "Issue tracker"] as const;

export default function ArchitectureViz() {
  return (
    <VizFrame
      eyebrow="Architecture"
      title="Host 하나가 server마다 분리된 client 연결을 관리합니다"
      description="연결별로 전달할 context와 capability를 줄이면 server 사이의 불필요한 정보 공유를 막을 수 있습니다."
      note="별도 process는 topology일 뿐입니다. 실제 격리는 OS permission·sandbox·network policy가 만듭니다."
    >
      <section className="border-t border-border/80 pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h4 className="text-sm font-bold">Host · policy owner</h4>
          <p className="text-xs leading-5 text-muted-foreground">User · model · context · consent · credential</p>
        </div>
      </section>
      <div className="mt-7 grid gap-6 md:grid-cols-3">
        {servers.map((server, index) => (
          <section key={server} className="min-w-0 border-l border-border pl-4">
            <p className="font-mono text-[11px] text-primary">CLIENT 0{index + 1}</p>
            <h4 className="mt-2 text-sm font-bold">{server} server</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">독립된 request metadata와 최소 context</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
