import VizFrame from "@/components/viz/VizFrame";

const decisions = [
  { question: "Output이 독립 binary probability인가?", choice: "Sigmoid + logits-based BCE", warning: "Exclusive class라면 softmax 경로" },
  { question: "Hidden layer가 기존 checkpoint와 호환돼야 하나?", choice: "원래 activation 유지", warning: "교체하면 weight distribution도 달라짐" },
  { question: "CNN rectifier에서 dead unit이 확인됐나?", choice: "Leaky/PReLU를 controlled test", warning: "먼저 LR·initialization 원인 확인" },
  { question: "Transformer FFN 구조를 바꿀 수 있나?", choice: "GELU/SiLU 또는 gated FFN 비교", warning: "SwiGLU는 width·parameter 예산 조정" },
] as const;

export default function ActivationDecisionViz() {
  return (
    <VizFrame eyebrow="Decision path" title="위치와 출력 계약을 먼저 정한 뒤 optimization 선택지를 좁힙니다" description="Activation 이름의 인기보다 model contract·checkpoint·budget을 먼저 고정합니다.">
      <ol className="space-y-7">
        {decisions.map((item, index) => (
          <li key={item.question} className="grid min-w-0 gap-4 border-b border-border/60 pb-7 last:border-0 last:pb-0 md:grid-cols-[2rem_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] md:items-start md:gap-6">
            <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
            <p className="text-sm font-bold leading-6 text-foreground">{item.question}</p>
            <div className="min-w-0"><p className="text-[10px] font-bold text-primary">선택</p><p className="mt-1 text-xs leading-5 text-foreground">{item.choice}</p></div>
            <div className="min-w-0"><p className="text-[10px] font-bold text-muted-foreground">주의</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.warning}</p></div>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
