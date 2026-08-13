import StepViz from "@/components/ui/step-viz";
import { GATES, STEPS } from "../LogicGateVizData";

const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]] as const;
const meta = [
  { name: "AND", w: [0.5, 0.5], b: -0.7, rule: "두 입력이 모두 1일 때만 positive" },
  { name: "OR", w: [0.5, 0.5], b: -0.2, rule: "입력 하나 이상이 1이면 positive" },
  { name: "NAND", w: [-0.5, -0.5], b: 0.7, rule: "AND의 판정 영역을 뒤집음" },
] as const;

export default function LogicGateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const gate = GATES[step];
        const item = meta[step];
        return (
          <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-border/75 bg-background p-5">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-300">decision boundary</p>
              <h4 className="mt-2 text-xl font-semibold">{item.name}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.rule}</p>
              <p className="mt-5 break-words rounded-lg border border-border/60 bg-muted/25 px-3 py-2 font-mono text-xs">{gate.equation}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">식의 왼쪽이 0보다 크면 1, 그렇지 않으면 0입니다. weight 크기 자체보다 경계가 네 점을 어떻게 나누는지가 핵심입니다.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {inputs.map(([x1, x2], index) => {
                const z = item.w[0] * x1 + item.w[1] * x2 + item.b;
                const output = z > 0 ? 1 : 0;
                return (
                  <div key={`${x1}-${x2}`} className={`min-w-0 rounded-xl border bg-background p-4 ${output ? "border-emerald-500/35" : "border-border/75"}`}>
                    <p className="text-xs text-muted-foreground">input ({x1}, {x2})</p>
                    <p className="mt-2 font-mono text-xs">z = {z.toFixed(1)}</p>
                    <p className={`mt-4 text-lg font-semibold ${output ? "text-emerald-600 dark:text-emerald-300" : "text-muted-foreground"}`}>output {output}</p>
                    <span className="sr-only">{gate.points[index].active ? "positive" : "negative"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </StepViz>
  );
}
