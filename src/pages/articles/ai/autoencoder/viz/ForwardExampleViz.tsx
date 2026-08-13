import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "1. 입력", body: "두 feature와 encoder weight를 확인합니다." },
  { label: "2. 선형 결합", body: "두 feature의 weighted sum을 구합니다." },
  { label: "3. Latent", body: "Sigmoid를 통과한 code를 얻습니다." },
  { label: "4. Decoder", body: "하나의 code를 두 출력으로 확장합니다." },
  { label: "5. 비교", body: "복원과 입력의 차이를 loss로 잽니다." },
];

const stages = [
  ["입력", "[0.8, 0.4]"],
  ["선형 결합", "0.5×0.8 + 0.3×0.4 = 0.52"],
  ["Latent", "z = σ(0.52) = 0.627"],
  ["Decoder", "[0.6z, 0.7z]"],
  ["복원", "[0.593, 0.608]"],
];

export default function ForwardExampleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <figure data-viz="autoencoder-forward-example" className="min-w-0">
          <figcaption className="mb-5 text-sm font-semibold">숫자 하나가 encoder와 decoder를 통과하는 경로</figcaption>
          <div className="grid gap-3 md:grid-cols-5">
            {stages.map(([title, value], index) => (
              <div key={title} className={`min-w-0 border-t px-1 pt-4 transition-opacity ${index === 2 ? "border-amber-500/55" : index < 2 ? "border-sky-500/45" : "border-emerald-500/45"} ${index <= step ? "opacity-100" : "opacity-25"}`}>
                <p className="text-xs font-bold text-muted-foreground">0{index + 1}</p>
                <p className="mt-2 font-semibold">{title}</p>
                <p className="mt-2 break-words font-mono text-xs leading-5 text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
        </figure>
      )}
    </StepViz>
  );
}
