import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import TrainingMemoryBudgetViz from "./training-memory-budget/viz/TrainingMemoryBudgetViz";

/**
 * 학습 메모리는 weight·gradient·optimizer state 합으로 커진다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function TrainingMemoryBudgetArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">GPU가 부족한 이유는 weight 하나가 아니라 그 옆의 세 그림자 때문이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            모델 하나를 학습하는 데 필요한 메모리는 parameter 크기만으로 가늠할 수
            없습니다. Weight마다 gradient·optimizer state가 따라붙고, forward에서
            계산한 activation도 backward가 끝날 때까지 어딘가 저장돼 있어야
            합니다. 이 네 항목을 각각 세는 것이 <strong>training memory
            math</strong>입니다.
          </p>
          <p>
            이 글은 <Link to="/ai/adam-optimizer#moments">Adam 정본</Link>의
            momentum·variance state와 <Link to="/ai/reverse-mode-autodiff#save-recompute">
            reverse-mode autodiff 정본</Link>의 save–recompute 경계를 이어받아,
            그 네 항목이 실제로 몇 byte인지 계산하고, activation 항을
            <strong> activation checkpointing</strong>이 어떻게 줄이는지 봅니다.
          </p>
        </div>
        <TrainingMemoryBudgetViz />
        <ContentBoundary article="training-memory-budget" />
      </section>

      <section id="memory-math" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Adam mixed-precision 학습은 parameter 하나당 16byte를 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Mixed-precision 학습에서는 FP16 weight·FP16 gradient 각 2byte에,
            optimizer가 FP32로 유지하는 master weight·momentum(m)·variance(v)
            각 4byte가 더해집니다. Adam은 이 세 FP32 buffer를 모두 쓰므로
            parameter 하나당 2+2+4+4+4=16byte입니다.
          </p>
          <p>
            Parameter 수 Ψ=7.5×10⁹(75억)인 모델이면 weight·gradient·optimizer
            state만으로 16×7.5×10⁹=1.2×10¹¹byte, 약 120GB가 필요합니다. 여기에
            activation이 아직 더해지지 않았습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Adam으로 mixed-precision 학습할 때 parameter 하나당 메모리는 몇 byte일까요?"
          idea={<>Forward·backward에 쓰는 FP16 사본과, optimizer가 정밀도를 위해 따로 유지하는 FP32 master weight·momentum·variance를 모두 더합니다. Adam은 momentum과 variance 두 state를 모두 쓰므로 optimizer state만 12byte(=4×3)입니다.</>}
          formula={String.raw`M_{\text{states}}=(2+2+K)\Psi,\qquad K=12\ (\text{Adam}),\qquad M_{\text{states}}=16\Psi`}
          annotatedFormula={String.raw`M_{\text{states}}=(\underbrace{2}_{\text{FP16 weight}}+\underbrace{2}_{\text{FP16 gradient}}+\underbrace{K}_{\text{FP32 optimizer state}})\Psi,\qquad K=12\ (\text{Adam}),\qquad M_{\text{states}}=\underbrace{16\Psi}_{\text{parameter당 byte}}`}
          operations={[
            { expression: String.raw`2+2+K`, annotation: ["FP16 weight·gradient 2byte씩과","FP32 optimizer state K byte를","parameter 하나 기준으로 더합니다."] },
            { expression: "K=12", annotation: ["Adam의 FP32 master weight·momentum·variance","세 buffer가 각 4byte씩이라 3×4=12입니다."] },
          ]}
          terms={[
            { symbol: String.raw`\Psi`, name: "parameter count", description: "모델의 전체 학습 가능 parameter 수입니다." },
            { symbol: "K", name: "optimizer state multiplier", description: "Optimizer가 parameter 하나당 추가로 유지하는 FP32 buffer의 byte 합입니다." },
            { symbol: String.raw`M_{\text{states}}`, name: "model-state memory", description: "Activation을 제외한 weight·gradient·optimizer state의 총 byte입니다." },
          ]}
          assumptions={["FP16 forward·backward와 FP32 optimizer state를 쓰는 표준 mixed-precision 설정입니다.", "SGD·momentum만 쓰는 optimizer는 K가 더 작고(예: momentum만이면 K=4~8), activation·temporary buffer·fragmentation은 별도 항목입니다."]}
          interpretation="16Ψ는 activation을 제외한 하한선입니다. 실제 필요한 GPU 메모리는 여기에 activation과 CUDA workspace·fragmentation을 더해야 하며, 후자는 batch size·sequence length·layer 수에 따라 달라집니다."
        />
        <div id="paper-zero" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">근거 논문 · Model-state memory</p>
          <p className="mt-2 text-sm font-semibold">Rajbhandari, Rasley, Ruwase & He — ZeRO: Memory Optimizations Toward Training Trillion Parameter Models</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Mixed-precision Adam 학습의 model-state memory를 (2+2+K)Ψ로 정식화하고,
            Ψ=7.5B·K=12 예시에서 baseline 120GB를 Figure 1로 제시합니다. 이 수치는
            model states(weight·gradient·optimizer state)만의 하한이며, 논문은 이
            중복을 data-parallel rank에 나누는 ZeRO-DP로 줄이는 것이 본 기여입니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1910.02054" target="_blank" rel="noreferrer">
            논문과 Figure 1 memory breakdown 보기
          </a>
        </div>
      </section>

      <section id="checkpointing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Activation checkpointing은 저장을 sqrt(n)으로 줄이고 forward를 다시 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Backward는 각 layer의 local derivative를 계산하려면 forward에서
            만든 activation이 있어야 합니다. 이걸 layer마다 그대로 저장하면
            activation 메모리는 layer 수 n에 비례해 커집니다.
            <strong> Activation checkpointing</strong>은 일부 layer의
            activation만 저장(checkpoint)하고 나머지는 버린 뒤, backward에서
            그 구간이 필요해지면 가장 가까운 checkpoint부터 forward를 다시
            실행해 복원합니다.
          </p>
          <p>
            Checkpoint 간격을 √n으로 고르면 저장하는 activation 수와 구간당
            재계산 비용이 둘 다 √n 근처에서 균형을 이뤄, 전체 activation
            메모리가 O(√n)으로 줄어듭니다. 1,000-layer residual network
            실험에서는 이 방법으로 activation 메모리가 48GB에서 7GB로
            줄었고, 대신 forward를 한 번 더 실행한 만큼 학습 시간이 약 30%
            늘었습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Checkpoint 간격 √n으로 activation을 저장·재계산하는 절차"
          input={["layers: n개 layer로 이뤄진 forward 계산 graph", "checkpoint_interval: 저장 간격 k (보통 round(sqrt(n)))"]}
          steps={[
            { code: "forward: 매 k번째 layer의 activation만 저장하고 나머지는 즉시 버림", note: "저장하는 activation 수가 n/k=O(√n)이 되도록 k=√n을 고릅니다." },
            { code: "backward: 마지막 구간부터 역순으로 진행", note: "Chain rule은 항상 뒤에서 앞으로 진행되므로 순서는 그대로입니다." },
            { code: "  if 현재 구간의 activation이 없으면: 가장 가까운 checkpoint에서 forward를 다시 실행", note: "이 재계산이 구간당 최대 k개 layer의 forward이며 O(√n) 비용입니다." },
            { code: "  복원된 activation으로 그 구간의 local gradient 계산 후 이전 구간으로 전달", note: "재계산된 activation은 이 구간의 backward가 끝나면 다시 버립니다." },
          ]}
          output="grads: 모든 layer의 gradient, peak activation memory O(√n), 추가 비용은 forward 1회분(약 30~33%)"
          repeatUntil="가장 앞 layer의 gradient까지 도달할 때까지"
        />
        <div id="paper-gradient-checkpointing" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">근거 논문 · Activation checkpointing</p>
          <p className="mt-2 text-sm font-semibold">Chen, Xu, Zhang & Guestrin — Training Deep Nets with Sublinear Memory Cost</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            n-layer network를 O(√n) 메모리로 학습하는 checkpointing 알고리즘을
            제시하고, 1,000-layer residual network에서 activation 메모리를
            48GB에서 7GB로 줄이면서 학습 시간은 약 30%만 늘어난다는 실험을
            보였습니다. 더 극단적인 O(log n) 메모리도 가능하지만 그 경우 추가
            비용이 O(n log n)으로 커진다고 명시합니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1604.06174" target="_blank" rel="noreferrer">
            논문과 O(√n) 증명·실험 보기
          </a>
        </div>
      </section>

      <section id="applications" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이 메모리 예산이 실제로 쓰이는 곳</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글이 정리한 model-state memory·activation checkpointing은 각각
            다른 글에서 구체적인 구현으로 이어집니다. 아래는 정의를 반복하지
            않고 각 응용이 이 원리를 어디에 쓰는지로 이어갑니다.
          </p>
        </div>
        <div className="not-prose mt-7 grid gap-5 md:grid-cols-3">
          {[
            ["QLoRA training-memory ledger", "Base low-bit payload·adapter·activation을 더 세분화한 byte 장부로 이 memory math를 확장합니다.", "/ai/lora-finetuning#qlora"],
            ["Reverse-mode autodiff", "Save–recompute 경계라는 일반 개념이 이 글의 checkpoint 간격 선택으로 구체화됩니다.", "/ai/reverse-mode-autodiff#save-recompute"],
            ["PyTorch 학습 파이프라인", "AMP autocast의 FP16·FP32 dtype 선택이 이 글의 16byte breakdown과 맞물립니다.", "/ai/training-pipeline#loop"],
          ].map(([title, body, href]) => (
            <Link key={href} to={href} className="min-w-0 border-t border-border/80 pt-4 hover:border-primary/60">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
              <span className="mt-3 block text-xs font-bold text-primary">원리가 쓰이는 곳으로 이동 →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
