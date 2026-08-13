import ExplainedFormula from "@/components/ui/explained-formula";
import CosineViz from "./viz/CosineViz";

export default function Cosine() {
  return (
    <section id="cosine" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Cosine annealing은 종료 시점까지 부드럽게 감소합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cosine annealing은 peak LR에서 minimum LR까지 cosine의 반 주기를 따라
          움직입니다. 초반에는 완만하게, 중간에는 빠르게, 끝에서는 다시 완만하게
          감소하므로 milestone을 여러 개 고르지 않아도 정해진 budget 전체를 한
          곡선으로 사용할 수 있습니다.
        </p>
        <p>
          부드러운 모양 자체가 더 높은 정확도를 보장하지는 않습니다.
          <code>T_max</code>가 실제 optimizer step 수와 맞지 않으면 최솟값에 너무
          빨리 도달하거나 학습이 끝났는데도 큰 rate가 남습니다. Warmup을 앞에
          붙일 때는 cosine 구간의 길이에서 warmup steps를 제외해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Peak와 minimum을 고정했을 때 cosine LR는 update마다 어떻게 정해질까?"
        idea={<>현재 cycle에서 진행한 비율 t/T를 0에서 π까지 보내 cosine을 1에서 −1로 움직입니다. ½(1+cos)은 이를 1에서 0으로 바꾸므로 peak와 minimum 사이를 정확히 보간합니다.</>}
        formula={String.raw`\begin{aligned}r_t&=\frac{t}{T},\\\eta_t&=\eta_{\mathrm{min}}+\frac{\eta_{\mathrm{max}}-\eta_{\mathrm{min}}}{2}\\&\qquad\cdot\left[1+\cos(\pi r_t)\right].\end{aligned}`}
        terms={[
          { symbol: "r_t", name: "cycle progress", description: "현재 cycle에서 0부터 1까지 증가하는 무차원 진행률입니다." },
          { symbol: "T", name: "cycle length", description: "Peak에서 minimum까지 이동하는 scheduler 호출 횟수입니다." },
          { symbol: String.raw`\eta_{\mathrm{max}}`, name: "peak LR", description: "Cosine 구간 첫 update에서 사용할 가장 큰 learning rate입니다." },
          { symbol: String.raw`\eta_{\mathrm{min}}`, name: "minimum LR", description: "Cycle 끝에서 접근하는 learning-rate 하한입니다." },
        ]}
        assumptions={["t는 warmup을 제외한 cosine 구간 내부의 update index입니다.", "T번째 값 포함 여부와 scheduler 호출 시점을 framework 구현에 맞춰 확인합니다.", "Cosine 모양이 non-convex neural-network objective의 수렴을 자동으로 보장하지는 않습니다."]}
        interpretation="Warmup W 뒤 cosine을 붙이면 T는 전체 updates가 아니라 남은 Ttotal−W여야 합니다. 그렇지 않으면 종료 시 ηmin에 도달하지 않습니다."
      />
      <div className="not-prose my-8"><CosineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Warm restart는 여러 cosine cycle을 잇는 별도 정책입니다</h3>
        <p>
          SGDR의 warm restart는 cycle 경계에서 LR를 다시 높이지만 model parameter와
          optimizer의 학습을 처음부터 시작하지는 않습니다. PyTorch의
          <code>CosineAnnealingLR</code>은 restart 없는 단일 감소이고,
          <code>CosineAnnealingWarmRestarts</code>가 반복 cycle을 구현합니다. 이름이
          비슷해도 state transition이 다르므로 config에 class와 cycle length를 남깁니다.
        </p>
      </div>
      <div id="paper-sgdr" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · SGDR</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Loshchilov와 Hutter는 SGD의 LR를 cosine으로 낮춘 뒤 warm restart하는 방법을 제안하고 CIFAR-10/100·EEG·downsampled ImageNet에서 anytime performance를 평가했습니다. 이 실험은 모든 optimizer·architecture에서 restart가 단일 decay보다 낫다는 보편적 보장이 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1608.03983" target="_blank" rel="noreferrer">Cycle 정의와 실험 범위 보기</a>
      </div>
    </section>
  );
}
