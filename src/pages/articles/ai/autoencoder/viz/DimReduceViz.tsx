import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "1. 좌표를 줄인다", body: "고차원 관측을 더 적은 latent 좌표로 바꿉니다." },
  { label: "2. 구조를 보존한다", body: "복원에 필요한 이웃과 variation을 남깁니다." },
  { label: "3. 조건을 비교한다", body: "Linear AE와 nonlinear AE의 보장 범위를 구분합니다." },
];

const rows = [
  ["변환", "직교 선형 projection", "학습된 nonlinear mapping 가능"],
  ["목표", "투영 후 squared error 최소화", "Decoder reconstruction loss 최소화"],
  ["보장", "Top-k principal subspace", "일반적인 의미 좌표 보장 없음"],
  ["위험", "Nonlinear structure를 놓칠 수 있음", "Identity·memorization·folding 가능"],
];

export default function DimReduceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <figure data-viz="autoencoder-dimension-reduction" className="min-w-0">
          <figcaption className="mb-5 text-sm font-semibold">PCA와 autoencoder는 겹치는 조건이 있지만 같은 방법은 아닙니다</figcaption>
          <div className="grid gap-3 sm:grid-cols-[minmax(5.5rem,.7fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="hidden sm:block" />
            <p className="border-t border-sky-500/45 pt-3 text-sm font-semibold">PCA</p>
            <p className="border-t border-amber-500/55 pt-3 text-sm font-semibold">Autoencoder</p>
            {rows.map(([label, pca, ae], index) => (
              <div key={label} className="contents">
                <p className="pt-3 text-xs font-bold text-muted-foreground">{label}</p>
                <p className={`min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground ${step >= Math.min(index, 2) ? "opacity-100" : "opacity-35"}`}>{pca}</p>
                <p className={`min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground ${step >= Math.min(index, 2) ? "opacity-100" : "opacity-35"}`}>{ae}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 border-l border-amber-500/50 pl-4 text-sm leading-6 text-muted-foreground">
            선형 encoder·decoder, centered data, squared error, rank-k bottleneck이라는 제한된 조건에서만 두 방법의 최적 재구성 부분공간이 연결됩니다.
          </p>
        </figure>
      )}
    </StepViz>
  );
}
