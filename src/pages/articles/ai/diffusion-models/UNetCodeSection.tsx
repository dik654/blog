import M from '@/components/ui/math';

export default function UNetCodeSection() {
  return (
    <div className="not-prose mt-4">
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">ResBlock + CrossAttention 구현</h4>

        {/* Step 1: ResBlock */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">1. ResBlock</p>
          <p className="text-xs text-muted-foreground">
            GroupNorm → Conv → time embedding 주입 → Conv → residual connection
          </p>
          <M display>{'h = \\text{Conv}_1\\big(\\text{SiLU}(\\text{GN}(x))\\big) + \\underbrace{W_t \\cdot \\text{SiLU}(t_{\\text{emb}})}_{\\text{시간 정보 주입}}'}</M>
          <M display>{'\\text{out} = x + \\text{Conv}_2\\big(\\text{SiLU}(h)\\big) \\quad \\leftarrow \\text{residual}'}</M>
        </div>

        {/* Step 2: Time Embedding */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">2. Time Embedding</p>
          <p className="text-xs text-muted-foreground">
            sinusoidal embedding → MLP(SiLU) → t_emb, 각 ResBlock에 주입
          </p>
          <M display>{'t \\;\\xrightarrow{\\text{sinusoidal}}\\; [\\sin, \\cos]_{128d} \\;\\xrightarrow{\\text{MLP + SiLU}}\\; t_{\\text{emb}} \\in \\mathbb{R}^{d}'}</M>
          <p className="text-xs text-muted-foreground">
            Transformer positional encoding과 동일 원리 — 각 블록에서 시간 조건 부여
          </p>
        </div>

        {/* Step 3: Cross-Attention */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">3. Cross-Attention</p>
          <p className="text-xs text-muted-foreground">
            image features → Q, text embedding → K,V, scaled dot-product
          </p>
          <M display>{'Q = W_Q \\cdot \\underbrace{x}_{\\text{image}}, \\quad K = W_K \\cdot \\underbrace{c}_{\\text{text}}, \\quad V = W_V \\cdot \\underbrace{c}_{\\text{text}}'}</M>
          <M display>{'\\text{Attn}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right) V'}</M>
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="text-sm text-muted-foreground">
          Timestep Embedding: t → sinusoidal embedding (cos/sin 128dim) → MLP (SiLU) → t_emb.
          각 ResBlock에 t_emb 주입: h = h + t_proj(t_emb) — Transformer positional encoding과 동일 원리.
        </p>
      </div>
    </div>
  );
}
