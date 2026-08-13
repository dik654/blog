import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "1. 압축", body: "Encoder가 입력에서 복원에 필요한 정보를 추립니다." },
  { label: "2. 병목", body: "제한된 latent code가 정보 선택을 강제합니다." },
  { label: "3. 복원", body: "Decoder가 code만 보고 입력을 다시 구성합니다." },
];

const stages = [
  { label: "입력 x", detail: "관측값 · n차원", tone: "border-sky-500/45" },
  { label: "Encoder fθ", detail: "필요한 특징을 추림", tone: "border-sky-500/45" },
  { label: "Latent z", detail: "제약된 표현 · k차원", tone: "border-amber-500/55" },
  { label: "Decoder gφ", detail: "표현에서 관측값 복원", tone: "border-emerald-500/45" },
  { label: "복원 x̂", detail: "입력과 같은 shape", tone: "border-emerald-500/45" },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <figure data-viz="autoencoder-overview" className="min-w-0">
          <figcaption className="mb-5 text-sm font-semibold">
            복사 장치가 아니라, 제약을 둔 복원 학습
          </figcaption>
          <div className="grid gap-3 md:grid-cols-5">
            {stages.map((stage, index) => {
              const visible = index === 0 || index <= step + 2;
              return (
                <div
                  key={stage.label}
                  className={`min-w-0 border-t bg-background px-1 pt-4 transition-opacity ${stage.tone} ${visible ? "opacity-100" : "opacity-25"}`}
                >
                  <p className="text-xs font-bold text-muted-foreground">0{index + 1}</p>
                  <p className="mt-2 font-semibold">{stage.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{stage.detail}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2">
            <p className="text-sm leading-6 text-muted-foreground">
              학습 신호: <strong className="text-foreground">x와 x̂의 차이</strong>
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              핵심 조건: <strong className="text-foreground">병목·noise·sparsity 중 하나 이상의 제약</strong>
            </p>
          </div>
        </figure>
      )}
    </StepViz>
  );
}
