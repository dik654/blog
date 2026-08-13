import VizFrame from "@/components/viz/VizFrame";

export default function GradientDirectionViz() {
  return (
    <VizFrame eyebrow="Multivariable sensitivity" title="Gradient는 좌표별 민감도와 가장 가파른 방향을 함께 담습니다" description="f(x,y)=x²+3y, (2,−1)에서 x 손잡이의 기울기는 4, y 손잡이는 3입니다.">
      <div className="grid gap-7 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10">
        <div className="min-w-0 space-y-4">
          <div className="border-t border-border/80 pt-3">
            <p className="text-xs font-bold text-foreground">x만 움직이기</p>
            <p className="mt-1 font-mono text-sm text-primary">∂f/∂x = 4</p>
          </div>
          <div className="border-t border-border/80 pt-3">
            <p className="text-xs font-bold text-foreground">y만 움직이기</p>
            <p className="mt-1 font-mono text-sm text-primary">∂f/∂y = 3</p>
          </div>
        </div>
        <div className="hidden h-16 w-px bg-border md:block" />
        <div className="min-w-0 border-l border-primary/60 pl-5">
          <p className="text-xs font-bold text-muted-foreground">같은 좌표 순서로 묶기</p>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">∇f = (4, 3)</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">길이는 민감도의 크기 5, 방향은 가장 빠른 증가 방향입니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
