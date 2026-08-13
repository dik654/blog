import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Source", "x₁ … xₛ", "길이 S의 관측 sequence"],
  ["Condition", "Eθ(X)", "encoder가 만든 조건 정보"],
  ["Prefix", "y₀ … yₜ₋₁", "이미 주어진·생성한 target prefix"],
  ["Next token", "p(yₜ | y<t, X)", "다음 token의 categorical 분포"],
];

export default function ConditionalSequenceViz() {
  return (
    <VizFrame
      eyebrow="Conditional sequence model"
      title="Seq2Seq는 입력을 고정 길이 label이 아니라 다른 sequence의 조건으로 사용합니다"
      description="입력 길이 S와 출력 길이 T는 독립적이며, EOS가 출력 sequence의 종료도 확률 변수로 만듭니다."
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {stages.map(([label, notation, detail], index) => (
          <article key={label} className="min-w-0 border-l border-border pl-4 first:border-primary">
            <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground">STEP {index + 1}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{label}</p>
            <p className="mt-3 break-words font-mono text-xs text-primary">{notation}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
