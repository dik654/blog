import StepViz from "@/components/ui/step-viz";
import { STEPS, H, EXP, SUM, PROB, LABELS } from "./softmaxData";

const colors = [
  "bg-rose-500 border-rose-500/30 text-rose-700 dark:text-rose-300",
  "bg-sky-500 border-sky-500/30 text-sky-700 dark:text-sky-300",
  "bg-emerald-500 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
] as const;

function ValueBar({ value, maximum, color }: { value: number; maximum: number; color: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-sm bg-muted/55">
      <div className={`h-full rounded-sm ${color.split(" ")[0]}`} style={{ width: `${Math.max(2, (Math.abs(value) / maximum) * 100)}%` }} />
    </div>
  );
}

export default function SoftmaxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full max-w-4xl">
          <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8">
            <section className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground">01 · LOGITS</p>
              <p className="mt-1 text-sm font-semibold">범위 제한이 없는 class score</p>
              <div className="mt-5 space-y-4">
                {H.map((value, index) => (
                  <div key={LABELS[index]} className="min-w-0">
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-semibold">{LABELS[index]}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">{value.toFixed(2)}</span>
                    </div>
                    <ValueBar value={value} maximum={Math.max(...H.map(Math.abs))} color={colors[index]} />
                  </div>
                ))}
              </div>
            </section>

            <section className={`min-w-0 border-t border-border/60 pt-5 transition-opacity md:border-l md:border-t-0 md:pl-8 md:pt-0 ${step >= 1 ? "opacity-100" : "opacity-25"}`}>
              <p className="text-[10px] font-bold text-muted-foreground">02 · POSITIVE WEIGHTS</p>
              <p className="mt-1 text-sm font-semibold">지수 함수로 양수 weight 만들기</p>
              <div className="mt-5 space-y-3">
                {EXP.map((value, index) => (
                  <div key={LABELS[index]} className="flex items-center justify-between gap-4 border-b border-border/50 pb-3 text-xs last:border-0">
                    <span className="font-mono text-muted-foreground">exp({H[index]})</span>
                    <span className="font-mono font-bold tabular-nums">{value.toFixed(value < 1 ? 3 : 2)}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 flex items-center justify-between border-t border-border pt-3 text-xs transition-opacity ${step >= 2 ? "opacity-100" : "opacity-25"}`}>
                <span className="font-semibold">공유 분모 Σ exp(z)</span>
                <span className="font-mono font-bold tabular-nums">{SUM}</span>
              </div>
            </section>

            <section className={`min-w-0 border-t border-border/60 pt-5 transition-opacity md:border-l md:border-t-0 md:pl-8 md:pt-0 ${step >= 3 ? "opacity-100" : "opacity-25"}`}>
              <p className="text-[10px] font-bold text-primary">03 · PROBABILITY</p>
              <p className="mt-1 text-sm font-semibold">같은 분모로 나눠 합을 1로 정규화</p>
              <div className="mt-5 space-y-4">
                {PROB.map((value, index) => (
                  <div key={LABELS[index]} className="min-w-0">
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-semibold">{LABELS[index]}</span>
                      <span className="font-mono font-bold tabular-nums">{(value * 100).toFixed(0)}%</span>
                    </div>
                    <ValueBar value={value} maximum={1} color={colors[index]} />
                  </div>
                ))}
              </div>
              <p className="mt-5 border-l border-rose-500/40 pl-3 text-xs leading-5 text-muted-foreground">
                예측 class가 정답과 다르면, 다음 cross-entropy가 그 차이를 scalar loss로 바꿉니다.
              </p>
            </section>
          </div>
        </div>
      )}
    </StepViz>
  );
}
