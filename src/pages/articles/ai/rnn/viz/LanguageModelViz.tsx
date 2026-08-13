import VizFrame from "@/components/viz/VizFrame";

const predictions = [
  { token: "물었다", probability: 0.58 },
  { token: "보았다", probability: 0.24 },
  { token: "따랐다", probability: 0.12 },
  { token: "기타", probability: 0.06 },
] as const;

export default function LanguageModelViz() {
  return (
    <VizFrame
      eyebrow="다음-token 조건부 분포"
      title="Prefix를 state 하나에 접은 뒤 vocabulary 전체를 채점한다"
      description="입력 token과 target token은 한 칸 어긋납니다. ‘개가 사람을’까지 처리한 state가 그 다음 token의 probability를 냅니다."
      note="막대는 계산 예시입니다. Probability 값은 실제 학습 결과나 특정 corpus의 통계가 아닙니다."
    >
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">PREFIX → RECURRENT SUMMARY</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-background p-4">
              <p className="text-xs text-muted-foreground">입력 token</p>
              <p className="mt-2 break-keep text-sm font-semibold">개가 · 사람을</p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-background p-4">
              <p className="text-xs font-bold text-primary">hidden state h₂</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">두 token을 처리한 고정 차원 요약</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Output projection은 h₂를 vocabulary 크기의 logits로 바꾸고 softmax가 합이 1인 분포를 만듭니다.
          </p>
        </div>

        <div className="min-w-0 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-xs font-bold text-muted-foreground">P(w₃ | w₁, w₂)</p>
          <div className="mt-4 space-y-4">
            {predictions.map((item, index) => (
              <div key={item.token} className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-xs">
                <span className={index === 0 ? "font-bold text-primary" : "text-foreground"}>{item.token}</span>
                <div className="h-1.5 min-w-0 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${item.probability * 100}%` }} />
                </div>
                <span className="text-right font-mono text-muted-foreground">{item.probability.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
