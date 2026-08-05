import M from '@/components/ui/math';

export default function UNetCodeSection() {
  return (
    <div className="not-prose mt-4">
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">U-Net block 안에서 세 입력 합치기</h4>

        {/* Step 1: ResBlock */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">1. ResBlock</p>
          <p className="text-xs text-muted-foreground">이미지 feature 를 조금 바꾸고 원래 경로를 더해 안정적으로 학습한다.</p>
          <M display>{'h = \\text{Conv}_1\\big(\\text{SiLU}(\\text{GN}(x))\\big) + \\underbrace{W_t \\cdot \\text{SiLU}(t_{\\text{emb}})}_{\\text{시간 정보 주입}}'}</M>
          <M display>{'\\text{out} = x + \\text{Conv}_2\\big(\\text{SiLU}(h)\\big) \\quad \\leftarrow \\text{residual}'}</M>
          <p className="text-xs text-muted-foreground">
            Residual 은 block 이 아무것도 바꾸지 않는 경로를 남긴다. 그래서 작은 denoise 수정만 필요할 때 update 가 안정적이다.
          </p>
        </div>

        {/* Step 2: Time Embedding */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">2. Time Embedding</p>
          <p className="text-xs text-muted-foreground">스칼라 timestep 을 feature channel 과 더할 수 있는 벡터로 바꾼다.</p>
          <M display>{'t \\;\\xrightarrow{\\text{sinusoidal}}\\; [\\sin, \\cos]_{128d} \\;\\xrightarrow{\\text{MLP + SiLU}}\\; t_{\\text{emb}} \\in \\mathbb{R}^{d}'}</M>
          <p className="text-xs text-muted-foreground">
            Sin/cos 는 작은 <M>{'t'}</M> 차이와 큰 <M>{'t'}</M> 차이를 여러 주파수로 펼친다.
            MLP 는 이 표현을 각 block 이 쓰기 좋은 scale 로 바꾼다.
          </p>
        </div>

        {/* Step 3: Cross-Attention */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">3. Cross-Attention</p>
          <p className="text-xs text-muted-foreground">이미지 위치가 prompt token 을 조회해 조건 정보를 가져온다.</p>
          <M display>{'Q = W_Q \\cdot \\underbrace{x}_{\\text{image}}, \\quad K = W_K \\cdot \\underbrace{c}_{\\text{text}}, \\quad V = W_V \\cdot \\underbrace{c}_{\\text{text}}'}</M>
          <M display>{'\\text{Attn}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right) V'}</M>
          <p className="text-xs text-muted-foreground">
            <M>{'\\sqrt d'}</M> 로 나누면 dot product 크기가 차원 때문에 과하게 커지는 것을 줄인다.
            Softmax 는 어떤 token 을 얼마나 볼지 합 1 비율로 만든다.
          </p>
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="text-sm text-muted-foreground">
          Block 관점에서 필요한 값은 세 개다. 현재 noisy feature <M>{'x_t'}</M>, noise level <M>{'t_{emb}'}</M>,
          prompt 조건 <M>{'c'}</M>. 이 셋이 합쳐져 다음 noise 예측 <M>{'\\epsilon_\\theta'}</M> 를 만든다.
        </p>
      </div>
    </div>
  );
}
