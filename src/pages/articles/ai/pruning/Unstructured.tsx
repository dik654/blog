import ExplainedFormula from "@/components/ui/explained-formula";
import UnstructuredViz from "./viz/UnstructuredViz";

export default function Unstructured() {
  return (
    <section id="unstructured" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        개별 weight를 제거하려면 중요도뿐 아니라 index 비용과 sparse kernel의 손익분기를 함께 봐야 합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          가장 단순한 magnitude pruning은 <code>|w_i|</code>가 작은 weight부터 제거합니다. 계산이 빠르고 calibration data가 필요 없지만, 서로 다른 layer의 scale이 다르면 같은 절대값이 같은 영향력을 뜻하지 않습니다. Global pruning은 모든 대상 layer를 한 순위로 놓고, layer-wise pruning은 layer마다 정해진 비율을 제거하므로 어느 쪽을 택했는지 결과와 함께 기록해야 합니다.
        </p>
        <p>
          Fine-tuning 중에는 현재 크기보다 weight가 움직이는 방향이 더 유용할 수 있습니다. Movement Pruning은 mask score를 학습하면서 task loss가 weight를 0에서 멀어지게 하는지, 0 쪽으로 보내는지를 누적해 high-sparsity subnetwork를 고릅니다. 이는 magnitude 하나로 끝나는 PTQ가 아니라 gradient와 fine-tuning data에 의존하는 pruning입니다.
        </p>
      </div>
      <ExplainedFormula
        question="왜 sparse tensor가 dense tensor보다 항상 작지는 않을까요?"
        idea={<>Dense format은 모든 값만 저장하지만, 일반 sparse format은 남은 값마다 위치 index도 보관합니다. 남은 비율이 충분히 낮아져야 index 비용을 상쇄합니다.</>}
        formula={String.raw`\begin{aligned}b_{\mathrm{pair}}&=b_v+b_i,\\B_{\mathrm{dense}}&=Nb_v,\\B_{\mathrm{sparse}}&\approx\rho Nb_{\mathrm{pair}}+B_{\mathrm{meta}},\\q&=b_v-B_{\mathrm{meta}}/N,\\\rho_{\max}&=q/b_{\mathrm{pair}},\\B_{\mathrm{sparse}}<B_{\mathrm{dense}}&\iff\rho<\rho_{\max}.\end{aligned}`}
        terms={[
          { symbol: "N", name: "dense element count", description: "원래 tensor의 전체 weight 수입니다." },
          { symbol: "b_v", name: "value bytes", description: "남은 weight 값 하나를 저장하는 byte 수입니다." },
          { symbol: "b_i", name: "index bytes", description: "Sparse 위치 하나를 표현하는 평균 byte 수입니다." },
          { symbol: "rho", name: "density", description: "남은 weight 비율이며 rho=1−sparsity입니다." },
          { symbol: "B_meta", name: "structure metadata", description: "Row pointer·block descriptor·alignment처럼 값과 index 외에 필요한 byte입니다." },
        ]}
        assumptions={[
          "이 식은 값과 index 비용을 단순화한 근사입니다. CSR·CSC·block sparse·압축 index마다 metadata 구조가 다릅니다.",
          "In-memory allocator·alignment·workspace와 on-disk compression은 별도로 측정합니다.",
          "저장량 손익분기가 kernel latency 손익분기를 보장하지 않습니다. Irregular gather와 낮은 occupancy가 남을 수 있습니다.",
        ]}
        interpretation="FP16 값 2 byte와 32-bit index 4 byte를 단순 가정하고 metadata를 무시하면 density가 2/(2+4)=1/3보다 낮아야 sparse payload가 더 작습니다. 즉 이 형식에서는 sparsity가 66.7%를 넘어야 값+index만으로도 이득입니다."
      />
      <ExplainedFormula
        question="Movement score는 단순한 weight 크기와 무엇이 다를까요?"
        idea={<>Task loss의 gradient와 현재 weight를 곱하면 그 연결을 mask로 약하게 만들 때 loss가 어느 방향으로 변하는지 1차로 근사할 수 있습니다. 여러 update의 신호를 누적해 fine-tuning 동안의 움직임을 봅니다.</>}
        formula={String.raw`\begin{aligned}g_i^{(t)}&=\partial\mathcal L^{(t)}/\partial w_i^{(t)},\\S_i^{(T)}&\propto-\sum_{t=0}^{T-1}g_i^{(t)}w_i^{(t)},\\M_i&=\mathbf1[S_i^{(T)}\text{ selected}].\end{aligned}`}
        terms={[
          { symbol: "L^(t)", name: "task loss", description: "Fine-tuning update t에서 계산한 training objective입니다." },
          { symbol: "dL/dw", name: "weight gradient", description: "Weight를 조금 움직였을 때 loss가 변하는 국소 방향입니다." },
          { symbol: "S_i", name: "movement score", description: "Mask parameter의 straight-through 학습으로 누적되는 1차 importance 신호의 직관적 형태입니다." },
          { symbol: "M_i", name: "selected mask", description: "전체 또는 layer별 sparsity budget 안에서 score가 선택되면 1이 됩니다." },
        ]}
        assumptions={[
          "표시한 식은 Movement Pruning score update의 1차 직관이며 실제 구현은 hard/soft mask, threshold schedule과 regularization을 포함합니다.",
          "Gradient는 fine-tuning data·objective·optimizer path에 의존하므로 다른 domain에 고정된 중요도가 아닙니다.",
          "1차 score는 여러 weight를 동시에 제거한 뒤의 상호작용과 최종 runtime을 직접 예측하지 않습니다.",
        ]}
        interpretation="Weight가 작아도 task gradient가 계속 0에서 멀어지는 방향이면 남길 수 있고, 큰 pretrained weight라도 fine-tuning 동안 0 쪽으로 움직이면 제거 후보가 될 수 있습니다."
      />
      <div className="not-prose my-8">
        <UnstructuredViz />
      </div>
      <div id="paper-movement-pruning" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Movement Pruning</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문의 핵심 문제는 pretrained Transformer를 downstream task로 fine-tune할 때 작은 pretrained weight를 지우는 magnitude 기준이 task 적응 방향을 놓친다는 점입니다. Mask score를 task loss와 함께 학습해 weight의 움직임을 반영했고, BERT 계열 transfer task와 높은 sparsity 조건에서 비교했습니다. 논문의 “3% parameters” 결과는 distillation·task·schedule을 포함한 실험 범위이며 모든 model의 일반적인 무손실 비율이 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2005.07683" target="_blank" rel="noreferrer">
          Score update·hard/soft movement·실험 범위 보기
        </a>
      </div>
    </section>
  );
}
