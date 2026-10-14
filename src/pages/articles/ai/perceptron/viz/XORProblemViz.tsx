import StepViz from "@/components/ui/step-viz";
import { STEPS, XOR_POINTS } from "../XORVizData";

function Point({ x, y, value }: { x: number; y: number; value: number }) {
  return (
    <div
      className={`absolute flex h-12 w-12 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-xl border bg-background font-semibold ${value ? "border-emerald-500/45 text-emerald-600 dark:text-emerald-300" : "border-rose-500/35 text-rose-600 dark:text-rose-300"}`}
      style={{ left: `${20 + x * 60}%`, bottom: `${20 + y * 60}%` }}
    >
      {value}
      <span className="absolute -top-6 whitespace-nowrap text-[10px] font-normal text-muted-foreground">
        ({x}, {y})
      </span>
    </div>
  );
}

function Plane({ boundaries }: { boundaries: 0 | 1 | 2 }) {
  return (
    <div className="relative aspect-square w-full max-w-sm rounded-xl border border-border/75 bg-background">
      <div className="absolute inset-x-[20%] bottom-[20%] h-px bg-border" />
      <div className="absolute bottom-[20%] left-[20%] top-[20%] w-px bg-border" />
      {boundaries >= 1 && (
        <div className="absolute left-[8%] top-1/2 h-px w-[84%] -rotate-[32deg] bg-rose-500" />
      )}
      {boundaries === 2 && (
        <div className="absolute left-[8%] top-[35%] h-px w-[84%] -rotate-[32deg] bg-amber-500" />
      )}
      {XOR_POINTS.map((p) => (
        <Point key={`${p.x}-${p.y}`} x={p.x} y={p.y} value={p.val} />
      ))}
    </div>
  );
}

export default function XORProblemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="grid w-full max-w-4xl items-center gap-6 md:grid-cols-[minmax(16rem,0.85fr)_1fr]">
          <Plane boundaries={step === 0 ? 0 : step === 1 ? 1 : 2} />
          <div className="rounded-xl border border-border/75 bg-background p-5">
            <p className="text-xs font-semibold text-primary">
              {step === 0
                ? "정답 배치"
                : step === 1
                  ? "아핀 점수 하나"
                  : "은닉 특성값"}
            </p>
            <h4 className="mt-2 text-lg font-semibold">
              {step === 0
                ? "정답 1인 두 점이 대각선으로 떨어져 있다"
                : step === 1
                  ? "직선을 움직여도 한 점은 반드시 틀린다"
                  : "두 경계의 결과를 새 좌표로 사용한다"}
            </h4>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {step === 0
                ? "(0,1)과 (1,0)은 1이고 나머지는 0입니다."
                : step === 1
                  ? "퍼셉트론 하나가 1로 판정하는 영역은 한 반평면입니다. 그래서 대각선의 두 점만 골라낼 수 없습니다."
                  : "은닉 뉴런이 OR과 NAND 같은 특성값을 만들면 출력 뉴런은 그 특성 공간에서 AND 하나로 XOR을 판정할 수 있습니다."}
            </p>
          </div>
        </div>
      )}
    </StepViz>
  );
}
