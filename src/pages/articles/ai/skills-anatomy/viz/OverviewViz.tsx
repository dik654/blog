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
      eyebrow="책임 경계"
      title="Tool·Skill·Plugin은 같은 사다리의 단계가 아닙니다"
      description="하나의 PR 리뷰 workflow에서도 실행 capability, 작업 절차, 배포 단위는 서로 다른 변경 이유와 검증 방법을 가집니다."
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
