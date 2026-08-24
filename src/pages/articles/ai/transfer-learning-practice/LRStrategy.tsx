import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import LRStrategyViz from "./viz/LRStrategyViz";

export default function LRStrategy() {
  return (
    <section id="lr-strategy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Discriminative LR은 같은 gradient라도 layer별 이동량을 다르게 정합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Random initialization인 head와 이미 유용한 representation을 가진 lower
          backbone이 같은 learning rate를 써야 할 이유는 없습니다. Param group을
          lower·upper·head로 나누고 head에는 큰 후보 LR, lower block에는 작은 후보
          LR을 둘 수 있습니다. 다만 “층마다 10배”는 법칙이 아니므로 실제 update가
          parameter 크기에 비해 얼마나 큰지 측정합니다.
        </p>
      </div>
      <ExplainedFormula
        question="서로 scale이 다른 layer의 update 충격을 어떤 무차원 비율로 비교할까?"
        idea={<>Learning rate와 update direction norm의 곱을 현재 parameter norm으로 나눕니다. 같은 η라도 gradient와 weight scale이 다르면 상대 이동량은 달라집니다.</>}
        formula={String.raw`\rho_{\ell}=\frac{\|\Delta\theta_{\ell}\|_2}{\|\theta_{\ell}\|_2+\varepsilon}=\frac{\eta_{\ell}\|g_{\ell}\|_2}{\|\theta_{\ell}\|_2+\varepsilon}`}
        annotatedFormula={String.raw`\rho_{\ell}=\underbrace{\frac{\|\Delta\theta_{\ell}\|_2}{\|\theta_{\ell}\|_2+\varepsilon}=\frac{\eta_{\ell}\|g_{\ell}\|_2}{\|\theta_{\ell}\|_2+\varepsilon}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{\|\Delta\theta_{\ell}\|_2}{\|\theta_{\ell}\|_2+\varepsilon}=\frac{\eta_{\ell}\|g_{\ell}\|_2}{\|\theta_{\ell}\|_2+\varepsilon}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Learning rate와 update direction","norm의 곱을 현재 parameter norm으로 나눕니다."] },
        ]}
        terms={[
          { symbol: "Δθ_ℓ", name: "one-update displacement", description: "Optimizer update 한 번으로 layer parameter가 움직인 vector입니다." },
          { symbol: "ρ_ℓ", name: "relative update ratio", description: "현재 parameter scale 대비 update 크기인 dimensionless 진단값입니다." },
          { symbol: "ε", name: "numerical floor", description: "Norm이 매우 작은 새 parameter에서 분모가 0이 되는 것을 막습니다." },
        ]}
        assumptions={["Optimizer의 momentum·adaptive scaling·weight decay를 반영한 실제 Δθ를 쓰는 편이 정확합니다.", "ρ가 작다고 validation gain이나 representation 보존이 자동으로 보장되지는 않습니다.", "Layer별 histogram과 loss spike를 같은 optimizer-update clock에 맞춥니다."]}
        interpretation="Unfreeze 직후 lower block의 ρ가 head보다 훨씬 크다면 작은 LR·warmup 또는 optimizer state 재설계를 검토할 근거가 됩니다."
      />
      <div className="not-prose my-8"><LRStrategyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Warmup은 새 head·optimizer state·큰 effective batch가 만나는 초기 update의
          충격을 완화하는 후보입니다. Peak 뒤 linear·cosine decay를 쓰더라도 scheduler는
          micro-batch가 아니라 optimizer update clock과 맞춰야 합니다. Schedule 수식과
          warm restart의 가정은 <Link to="/ai/lr-scheduling">learning-rate scheduling 글</Link>에서
          이어서 설명합니다.
        </p>
        <div id="paper-ulmfit-transfer" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · ULMFiT</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">ULMFiT은 AWD-LSTM language model transfer에서 discriminative fine-tuning, slanted triangular learning rate와 gradual unfreezing을 함께 제안했습니다. 이 recipe는 중요한 역사적 근거지만, 현재의 모든 Transformer·vision backbone에도 같은 layer ratio와 순서가 최적이라는 뜻은 아닙니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/P18-1031/" target="_blank" rel="noreferrer">논문의 세 fine-tuning 기법과 실험 범위 보기</a>
        </div>
      </div>
    </section>
  );
}
