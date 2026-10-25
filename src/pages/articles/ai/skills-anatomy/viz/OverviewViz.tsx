import VizFrame from "@/components/viz/VizFrame";

const rows = [
  {
    name: "Tool",
    question: "무엇을 실행할 수 있는가?",
    owns: "File·API·browser 같은 개별 action",
    output: "실행 결과와 effect receipt",
  },
  {
    name: "Skill",
    question: "언제 어떤 순서로 일할 것인가?",
    owns: "Instructions·references·optional scripts",
    output: "반복 가능한 workflow와 validation",
  },
  {
    name: "Plugin",
    question: "어떻게 설치·배포할 것인가?",
    owns: "Skills·connectors·presentation assets",
    output: "Versioned distribution package",
  },
] as const;

export default function OverviewViz() {
  return (
    <VizFrame
      eyebrow="세 책임"
      title="실제 동작, 작업 순서, 배포 묶음을 구분합니다"
      description="같은 CI 수정 작업에서도 도구가 만드는 효과, Skill이 알려 주는 순서, Plugin이 설치하는 구성은 서로 다른 책임입니다."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {rows.map((row, index) => (
          <section key={row.name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="text-sm font-bold text-foreground">{row.name}</h4>
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-primary">
              {row.question}
            </p>
            <dl className="mt-4 space-y-3 text-xs leading-5">
              <div>
                <dt className="font-bold text-foreground">소유</dt>
                <dd className="mt-1 break-words text-muted-foreground">{row.owns}</dd>
              </div>
              <div>
                <dt className="font-bold text-foreground">남기는 것</dt>
                <dd className="mt-1 break-words text-muted-foreground">{row.output}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
