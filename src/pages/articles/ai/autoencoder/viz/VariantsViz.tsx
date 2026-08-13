import { useState } from "react";

const variants = [
  {
    id: "denoise",
    title: "Denoising AE",
    intervention: "입력에 corruption 추가",
    latent: "Deterministic z",
    objective: "x̃에서 clean x 복원",
    use: "Robust representation",
  },
  {
    id: "sparse",
    title: "Sparse AE",
    intervention: "Activation sparsity penalty",
    latent: "대부분 0인 z",
    objective: "복원 + sparsity",
    use: "Feature decomposition",
  },
  {
    id: "vae",
    title: "VAE",
    intervention: "Posterior와 prior regularization",
    latent: "Distribution에서 sample한 z",
    objective: "Reconstruction NLL + KL",
    use: "Sampling 가능한 생성 모델",
  },
  {
    id: "mae",
    title: "Masked AE",
    intervention: "Input patch를 높은 비율로 숨김",
    latent: "Visible token representation",
    objective: "가린 patch 복원",
    use: "Vision pretraining",
  },
];

export default function VariantsViz() {
  const [selected, setSelected] = useState(0);
  const variant = variants[selected];

  return (
    <figure data-viz="autoencoder-variants" className="not-prose my-8 min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold">이름보다 어떤 제약과 target을 추가했는지 비교합니다</figcaption>
      <div className="mb-5 flex max-w-full gap-2 overflow-x-auto pb-1">
        {variants.map((item, index) => (
          <button key={item.id} type="button" onClick={() => setSelected(index)} className={`shrink-0 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${selected === index ? "border-primary/45 bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
            {item.title}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["추가한 제약", variant.intervention], ["Latent", variant.latent], ["Objective", variant.objective], ["주된 용도", variant.use]].map(([label, value]) => (
          <div key={label} className="min-w-0 border-t border-border bg-background px-1 pt-4">
            <p className="text-xs font-bold text-primary/70">{label}</p>
            <p className="mt-2 text-sm font-semibold leading-6">{value}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
