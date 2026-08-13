import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Tokenizer", "목표 문자열을 만드는 token·subword 후보 식별", "candidate ids"],
  ["Target likelihood", "후보 조합이 목표 문자를 낼 가능성 추정", "token scores"],
  ["lm_head row scaling", "선택된 output row에 완만한 scale 적용", "derived checkpoint"],
  ["Paired evaluation", "동일 prompt·decoding으로 원본과 변환본 비교", "leakage + task quality"],
] as const;

export default function SmoothieQwenViz() {
  return (
    <VizFrame
      eyebrow="Post-hoc smoothing"
      title="Tokenizer에서 목표 token을 찾고 lm_head row를 보정한 뒤 원본 checkpoint와 짝지어 평가합니다"
      description="Smoothie 계열 개입은 출력 확률 경로를 조정합니다. Reasoning 언어 전체를 새로 학습하는 방법과는 책임이 다릅니다."
      note="원본 weight는 보존하고 변환본을 별도 version으로 관리합니다. Leakage가 줄어도 한국어 자연스러움·과제 정확도·정상 다국어 예외가 나빠지면 채택하지 않습니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map(([stage, action, artifact], index) => (
          <li key={stage} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-2 min-w-0 text-sm font-bold [overflow-wrap:anywhere]">{stage}</h4>
            <p className="mt-3 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {action}
            </p>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              Artifact · {artifact}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
