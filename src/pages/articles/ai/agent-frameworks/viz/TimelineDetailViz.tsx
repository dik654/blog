import VizFrame from "@/components/viz/VizFrame";

const responsibilities = [
  ["Tool loop", "decide · act · observe", "short task execution"],
  ["Stateful workflow", "branch · approval · checkpoint", "multi-step state"],
  ["Harness", "context · permission · verify · recover", "product behavior"],
  ["Durable runtime", "event · queue · trace · resume", "operational lifetime"],
] as const;

export default function TimelineDetailViz() {
  return (
    <VizFrame
      eyebrow="Responsibility expansion"
      title="Agent system이 길어질수록 기존 loop 위에 별도의 운영 책임이 추가됩니다"
      description="네 항목은 우열이나 세대 순위가 아닙니다. 단순한 task에는 tool loop만으로 충분하고, 필요한 책임만 선택해 더합니다."
    >
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
        {responsibilities.map(([name, owns, boundary], index) => (
          <section key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex min-w-0 items-baseline justify-between gap-4">
              <h4 className="min-w-0 text-sm font-bold [overflow-wrap:anywhere]">{name}</h4>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                +{index + 1}
              </span>
            </div>
            <p className="mt-3 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              책임 · {owns}
            </p>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              범위 · {boundary}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
