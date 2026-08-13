import VizFrame from "@/components/viz/VizFrame";

export default function RadianMeasureViz() {
  return (
    <VizFrame
      eyebrow="Angle as a ratio"
      title="반지름만큼의 호가 1 radian을 만듭니다"
      description="원을 크게 그려도 s와 r이 같은 비율로 커지므로 각도 θ=s/r은 바뀌지 않습니다."
      note="Degree는 회전을 등분한 단위이고 radian은 길이의 비입니다. Fourier 식에서는 한 바퀴가 2π라는 radian 표현을 사용합니다."
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-lg border border-border/70 bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">반지름</p>
          <p className="mt-4 font-mono text-2xl font-semibold">r</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">중심에서 원 둘레까지의 길이</p>
        </div>
        <p className="hidden text-sm font-semibold text-primary sm:block">s ÷ r</p>
        <div className="rounded-lg border border-border/70 bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">각도</p>
          <p className="mt-4 font-mono text-2xl font-semibold">θ</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">호 길이 s와 반지름 r의 비</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {[["¼ 바퀴", "π/2"], ["½ 바퀴", "π"], ["한 바퀴", "2π"]].map(([turn, radians]) => (
          <div key={turn} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-4 py-3">
            <span className="text-sm text-muted-foreground">{turn}</span>
            <span className="font-mono text-sm font-semibold">{radians} rad</span>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
