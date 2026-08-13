import Math from "@/components/ui/math";
import VizFrame from "@/components/viz/VizFrame";

const cases = [
  {
    factor: "0.7",
    after: "0.7^8 \\approx 0.058",
    title: "vanishing",
    detail: "먼 시점의 학습 신호가 거의 도착하지 않습니다.",
    tone: "border-sky-500/30 text-sky-700 dark:text-sky-300",
  },
  {
    factor: "1.0",
    after: "1.0^8 = 1",
    title: "stable path",
    detail: "이상적인 직관이지만 실제 Jacobian은 시점마다 달라집니다.",
    tone: "border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  },
  {
    factor: "1.3",
    after: "1.3^8 \\approx 8.16",
    title: "exploding",
    detail: "일부 방향의 gradient norm이 빠르게 커집니다.",
    tone: "border-rose-500/30 text-rose-700 dark:text-rose-300",
  },
] as const;

export default function RNNGradientMechanismViz() {
  return (
    <VizFrame
      eyebrow="BPTT의 핵심"
      title="시간 거리가 길어질수록 local Jacobian이 반복해서 곱해진다"
      description="아래 숫자는 방향 하나의 크기를 단순화한 예입니다. 실제 RNN에서는 matrix의 singular direction과 tanh derivative가 함께 작용합니다."
      note="gradient clipping은 커진 norm을 잘라 exploding을 완화하지만, 이미 0에 가까워진 gradient를 되살리지는 않습니다."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {cases.map((item) => (
          <div key={item.title} className={`min-w-0 rounded-lg border bg-background p-5 ${item.tone}`}>
            <p className="text-xs font-bold">시점당 대표 배율</p>
            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="contents">
                  <span className="flex h-8 min-w-0 flex-1 items-center justify-center rounded-md border border-border/70 bg-muted/20 text-xs font-semibold text-foreground">
                    <Math>{item.factor}</Math>
                  </span>
                  {index < 4 && <span className="text-xs text-muted-foreground">×</span>}
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-border/60 pt-4">
              <p className="text-sm font-bold text-foreground"><Math>{item.after}</Math></p>
              <p className="mt-2 text-xs font-bold">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
