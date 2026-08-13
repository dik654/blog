import VizFrame from "@/components/viz/VizFrame";

const decisions = [
  ["사람이 읽는가?", "Markdown 또는 plain text"],
  ["typed API가 받는가?", "JSON + Schema"],
  ["반복 section과 source id가 핵심인가?", "XML을 검토"],
] as const;

const parserChecks = [
  "DTD·external entity·network access 비활성화",
  "input bytes·depth·element count에 상한 설정",
  "schema와 domain validator를 parser 뒤에 연결",
  "parse 실패를 typed error로 기록하고 retry 상한 설정",
] as const;

export default function BestPracticesDetailViz() {
  return (
    <VizFrame
      eyebrow="Secure format decision"
      title="XML이 필요한지 먼저 판단하고, 선택했다면 parser의 공격 표면을 제한합니다"
      description="format 선택과 안전한 parsing은 한 묶음의 production contract입니다. 관대한 fallback으로 깨진 입력을 조용히 통과시키지 않습니다."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <section className="min-w-0">
          <h4 className="text-xs font-bold text-muted-foreground">Format questions</h4>
          <div className="mt-4 divide-y divide-border/70">
            {decisions.map(([question, choice]) => (
              <div key={question} className="min-w-0 py-3 first:pt-0 last:pb-0">
                <p className="text-xs leading-5 text-foreground [overflow-wrap:anywhere]">{question}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
                  {choice}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="min-w-0 border-l border-border pl-4 sm:pl-6">
          <h4 className="text-xs font-bold text-muted-foreground">XML parser checklist</h4>
          <ol className="mt-4 space-y-4">
            {parserChecks.map((check, index) => (
              <li key={check} className="grid min-w-0 grid-cols-[1.5rem_1fr] gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
                <p className="min-w-0 text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
                  {check}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </VizFrame>
  );
}
