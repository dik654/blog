import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "1. 출력층", body: "복원 오차가 decoder weight에 미치는 영향을 계산합니다." },
  { label: "2. Latent", body: "Decoder Jacobian을 거쳐 latent gradient가 생깁니다." },
  { label: "3. Encoder", body: "Chain rule로 encoder까지 책임을 전달합니다." },
];

const gradients = [
  { label: "decoder w₁", value: "−0.0313", size: "w-full", tone: "bg-emerald-500/65" },
  { label: "decoder w₂", value: "+0.0310", size: "w-[99%]", tone: "bg-emerald-500/65" },
  { label: "encoder w₁", value: "−0.0025", size: "w-[32%]", tone: "bg-sky-500/65" },
  { label: "encoder w₂", value: "−0.0012", size: "w-[16%]", tone: "bg-sky-500/65" },
];

export default function BackpropViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <figure data-viz="autoencoder-backprop" className="min-w-0">
          <figcaption className="mb-5 flex flex-wrap items-baseline justify-between gap-2 text-sm font-semibold">
            <span>복원 loss에서 encoder까지 이어지는 gradient</span>
            <span className="font-mono text-xs text-muted-foreground">MSE = 0.043</span>
          </figcaption>
          <div className="space-y-4">
            {gradients.map((gradient, index) => {
              const visible = index < 2 ? step >= 0 : step >= 2;
              return (
                <div key={gradient.label} className={`grid min-w-0 gap-2 transition-opacity sm:grid-cols-[8rem_minmax(0,1fr)_4.5rem] sm:items-center ${visible ? "opacity-100" : "opacity-25"}`}>
                  <p className="text-sm font-medium">{gradient.label}</p>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${gradient.size} ${gradient.tone}`} />
                  </div>
                  <p className="font-mono text-xs text-muted-foreground sm:text-right">{gradient.value}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-5 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">
            부호는 어느 방향으로 weight를 움직일지, 절댓값은 같은 learning rate에서 얼마나 크게 움직일지를 정합니다.
          </p>
        </figure>
      )}
    </StepViz>
  );
}
