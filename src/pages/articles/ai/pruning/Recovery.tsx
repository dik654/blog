import ExplainedFormula from "@/components/ui/explained-formula";
import RecoveryViz from "./viz/RecoveryViz";

export default function Recovery() {
  return (
    <section id="recovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Recovery는 제거한 연결을 되살리는 단계가 아니라, 같은 mask 안에서 남은 model을 다시 적응시키는 단계입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Pruning 직후 quality가 떨어지면 작은 learning rate의 fine-tuning, knowledge distillation 또는 점진적인 prune–recover schedule을 사용할 수 있습니다. 이때 핵심 불변식은 제거한 weight가 optimizer update·weight decay·momentum으로 다시 0이 아닌 값이 되지 않는 것입니다. Gradient만 0으로 만드는 데 그치지 말고 parameter와 optimizer state, export mask를 같은 기준으로 관리합니다.
        </p>
        <p>
          Structured pruning에서는 tensor shape와 graph가 달라졌으므로 새 parameter에 맞춰 optimizer state를 다시 구성합니다. Recovery data가 특정 domain에 치우치면 sparse model이 그 domain에만 다시 맞춰질 수 있으므로 pruning 전과 같은 general·domain·language·length suite를 사용하고 마지막 test는 선택에 쓰지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Optimizer가 update를 해도 제거된 weight를 계속 0으로 유지하려면 어떻게 해야 할까요?"
        idea={<>일반 update를 계산한 뒤 같은 binary mask를 다시 곱합니다. Momentum 같은 optimizer state도 mask 밖을 0으로 유지해야 다음 step에서 제거된 연결이 되살아나지 않습니다.</>}
        formula={String.raw`\begin{aligned}\widetilde W_{t+1}&=W_t-\eta g_t,\\W_{t+1}&=M\odot\widetilde W_{t+1},\\\widetilde U_{t+1}&=\operatorname{OptStateUpdate}(U_t,g_t),\\U_{t+1}&=M\odot\widetilde U_{t+1}.\end{aligned}`}
        terms={[
          { symbol: "W_t", name: "remaining weights", description: "Recovery step t의 parameter tensor입니다." },
          { symbol: "g_t", name: "gradient", description: "Fine-tuning 또는 distillation loss에서 계산한 update 방향입니다." },
          { symbol: "eta", name: "learning rate", description: "한 step에서 weight를 움직이는 크기입니다." },
          { symbol: "M", name: "fixed mask", description: "Pruning에서 확정한 0/1 mask이며 recovery 동안 바꾸지 않는 경우의 불변식입니다." },
          { symbol: "U_t", name: "optimizer state", description: "Momentum·Adam moment처럼 과거 gradient를 저장하는 상태입니다." },
        ]}
        assumptions={[
          "Fixed-mask recovery를 설명합니다. Dynamic sparse training처럼 연결을 다시 배정하는 방법은 다른 계약입니다.",
          "Framework의 parametrization·hook·optimizer가 실제 update와 checkpoint export 모두에 mask를 적용하는지 test합니다.",
          "Mask를 유지해도 남은 weight가 overfit하거나 numerical zero가 sparse artifact에서 누락되는 문제는 별도로 확인합니다.",
        ]}
        interpretation="M_i=0인 위치는 update 전 값과 gradient가 무엇이든 다음 W와 optimizer state가 0입니다. 이 불변식이 깨지면 보고한 sparsity와 실제 checkpoint가 달라집니다."
      />
      <div className="not-prose my-8">
        <RecoveryViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>최종 승인은 세 숫자를 한 표에서 비교합니다</h3>
        <p>
          첫째는 대상 tensor와 전체 model 각각의 sparsity·parameter·artifact byte입니다. 둘째는 held-out perplexity나 task metric뿐 아니라 language·domain·long-context worst slice입니다. 셋째는 target engine의 build log, sparse tactic coverage, peak memory, prefill/decode latency와 throughput입니다. 이 세 축에서 dense baseline보다 운영 목표를 만족하는 후보만 배포합니다.
        </p>
        <p>
          Prune–recover cycle은 공짜가 아니므로 각 cycle의 추가 training 시간과 quality 회복, 실제 latency 개선을 기록합니다. Sparsity가 늘었는데 compiler가 dense tactic을 선택하거나 quality gate를 넘지 못한다면 숫자상 더 sparse한 checkpoint를 선택할 이유가 없습니다.
        </p>
      </div>
    </section>
  );
}
