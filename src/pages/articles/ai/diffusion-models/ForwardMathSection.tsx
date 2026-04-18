import M from '@/components/ui/math';

export default function ForwardMathSection() {
  return (
    <div className="not-prose mt-4">
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Forward Process 수학적 정의</h4>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Forward Process — Reparameterization Trick</p>
          <M display>{'x_t = \\underbrace{\\sqrt{\\bar\\alpha_t}}_{\\text{signal}} \\cdot x_0 + \\underbrace{\\sqrt{1-\\bar\\alpha_t}}_{\\text{noise}} \\cdot \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I)'}</M>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Simple Loss — 노이즈 예측 목표</p>
          <M display>{'L_{\\text{simple}} = \\mathbb{E}\\Big[\\|\\underbrace{\\epsilon}_{\\text{실제 노이즈}} - \\underbrace{\\epsilon_\\theta(x_t, t)}_{\\text{네트워크 예측}}\\|^2\\Big]'}</M>
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="text-sm text-muted-foreground">
          Noise Schedule 비교 — Linear(β₁=0.0001→β_T=0.02)는 초기 노이즈가 빠르고,
          Cosine(cos² 기반)은 부드러운 전환으로 품질 개선.
          SD는 linear 학습 + DDIM 추론, GLIDE/Imagen은 cosine 사용.
        </p>
      </div>
    </div>
  );
}
