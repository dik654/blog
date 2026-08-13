import M from "@/components/ui/math";
import VizFrame from "@/components/viz/VizFrame";

const steps = [
  { index: "01", input: "x₁ · 개가", previous: "h₀", state: "h₁", output: "y₁" },
  { index: "02", input: "x₂ · 사람을", previous: "h₁", state: "h₂", output: "y₂" },
  { index: "03", input: "x₃ · 물었다", previous: "h₂", state: "h₃", output: "y₃" },
] as const;

export default function RNNUnrollViz() {
  return (
    <VizFrame
      eyebrow="시간축으로 펼치기"
      title="보이는 cell은 세 개지만 학습하는 weight는 한 벌이다"
      description="각 시점은 현재 input과 직전 state를 기다립니다. 같은 transition을 반복 호출하므로 time depth가 늘어도 parameter set은 늘지 않습니다."
      note="Stacked layer의 depth와 sequence를 펼친 time depth는 다른 축입니다. 아래 세 column은 서로 다른 layer가 아닙니다."
    >
      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        {steps.map((step) => (
          <div key={step.index} className="min-w-0 border-l border-border pl-4">
            <p className="text-xs font-bold text-primary">STEP {step.index}</p>
            <dl className="mt-4 grid min-w-0 gap-3 text-sm">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">현재 input</dt>
                <dd className="mt-1 break-words font-semibold">{step.input}</dd>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-4">
                <dt className="text-xs text-muted-foreground">공유 transition</dt>
                <dd className="mt-2 font-mono text-xs leading-5">
                  <M>{`${step.state}=\tanh(W_{xh}x_t+W_{hh}${step.previous}+b_h)`}</M>
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">다음 state</dt>
                  <dd className="mt-1 font-semibold text-primary">{step.state}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">시점 output</dt>
                  <dd className="mt-1 font-semibold">{step.output}</dd>
                </div>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-7 border-t border-border/60 pt-5">
        <p className="text-xs font-bold text-muted-foreground">모든 시점이 공유</p>
        <p className="mt-2 break-words font-mono text-sm font-semibold text-foreground">
          W<sub>xh</sub> · W<sub>hh</sub> · b<sub>h</sub>
        </p>
      </div>
    </VizFrame>
  );
}
