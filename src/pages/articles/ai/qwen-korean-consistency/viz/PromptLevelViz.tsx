import VizFrame from "@/components/viz/VizFrame";

const steps = [
  ["Define", "응답·노출 reasoning의 목표 언어", "인용·고유명사·코드 예외도 함께 명시"],
  ["Control", "model·sampling·eval set 고정", "prompt 문구만 바꾼 paired run"],
  ["Measure", "문자·segment·reasoning별 오류", "정상 예외와 자연스러움도 같이 측정"],
  ["Escalate", "목표 미달의 실패 위치 확인", "runtime·weight·post-training 후보로 이동"],
] as const;

export default function PromptLevelViz() {
  return (
    <VizFrame
      eyebrow="Prompt boundary"
      title="Prompt는 이번 request의 언어 정책을 전달하지만 model weight의 분포를 바꾸지는 않습니다"
      description="먼저 가장 싼 개입으로 정책과 예외를 명확히 한 뒤, 같은 조건의 paired evaluation에서 실제 변화만 확인합니다."
      note="Prompt가 효과가 없다는 뜻은 아닙니다. 다만 지속적인 분포 문제를 문구만으로 해결했다고 가정하지 않고, 실패가 남을 때 책임 계층을 옮깁니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([stage, action, check], index) => (
          <li key={stage} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-2 text-sm font-bold">{stage}</h4>
            <p className="mt-3 min-w-0 text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
              {action}
            </p>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              Check · {check}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
