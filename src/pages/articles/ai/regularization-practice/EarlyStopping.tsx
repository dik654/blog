import ExplainedFormula from "@/components/ui/explained-formula";
import EarlyStoppingViz from "./viz/EarlyStoppingViz";

export default function EarlyStopping() {
  return (
    <section id="early-stopping" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Early stopping은 validation policy로 checkpoint를 선택합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Early stopping은 감시 metric이 충분히 개선되지 않는 상태가 일정
          evaluation 횟수 동안 이어지면 학습을 멈춥니다. 종료 자체보다 중요한
          것은 최적 step의 checkpoint를 별도로 저장하는 것입니다. Patience를
          기다린 마지막 model이 best model과 같지는 않습니다.
        </p>
        <p>
          Monitor, direction, <code>min_delta</code>, patience와 evaluation
          frequency를 실험 전에 고정합니다. AUC나 F1처럼 noisy한 metric은 작은
          validation set에서 쉽게 흔들리므로 반복 실행의 분산과 confidence
          interval을 고려하고, test set을 stopping signal로 사용하지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Best checkpoint와 stop 시점을 어떻게 서로 다른 state로 관리할까?"
        idea={<>Evaluation index j마다 validation loss v_j를 읽습니다. 이전 best보다 δ 이상 좋아지면 best와 counter를 갱신하고 snapshot을 저장하며, 그렇지 않으면 counter를 늘립니다. Counter가 patience P를 넘는 시점은 stop이고, 반환할 model은 j*의 snapshot입니다.</>}
        formula={String.raw`\begin{aligned}
j^*&=\arg\min_{0\le k\le j}v_k,\\
c_j&=\begin{cases}
0,&v_j<v_{j^*-1}-\delta,\\
c_{j-1}+1,&\text{otherwise},
\end{cases}\\
j_{\mathrm{stop}}&=\min\{j:c_j>P\}.
\end{aligned}`}
        terms={[
          { symbol: "v_j", name: "validation metric", description: "j번째 evaluation에서 같은 frozen policy로 계산한 loss입니다. Max metric이면 부등호 방향을 바꿉니다." },
          { symbol: "δ", name: "minimum improvement", description: "Noise와 무의미한 작은 변화를 새 best로 인정하지 않는 임계값입니다." },
          { symbol: "c_j", name: "bad-evaluation counter", description: "의미 있는 개선 없이 이어진 evaluation event 수입니다." },
          { symbol: "P", name: "patience", description: "Stop 전에 허용할 bad evaluations 수이며 training updates가 아닙니다." },
        ]}
        assumptions={["식은 minimize하는 metric을 예로 들며 best-before-current indexing convention을 구현 test로 고정합니다.", "Evaluation cadence와 validation sample은 run 동안 동일합니다.", "Best snapshot은 deep copy 또는 durable checkpoint로 저장하고 마지막 in-memory model과 분리합니다."]}
        interpretation="Early stopping은 마지막 checkpoint를 선택하는 규칙이 아닙니다. Stop은 더 기다리지 않을 시점이고, deploy candidate는 그보다 앞선 best evaluation의 snapshot입니다."
      />
      <div className="not-prose my-8"><EarlyStoppingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Scheduler와 stopping의 순서를 정합니다</h3>
        <p>
          ReduceLROnPlateau가 먼저 learning rate를 낮추고 개선을 기다리도록
          설계했다면 early stopping patience가 그 기회를 포함해야 합니다.
          Cosine restart처럼 metric이 주기적으로 흔들리는 schedule에서는 cycle
          경계를 무시한 단순 patience가 너무 일찍 종료할 수 있습니다.
        </p>
        <p>
          PyTorch에서는 best <code>state_dict</code>를 메모리의 얕은 참조로
          보관하면 이후 update와 함께 값이 바뀔 수 있습니다. 디스크 checkpoint나
          deep copy로 snapshot을 남기고, 종료 후 새 process에서 불러와 동일한
          metric을 재현하는지 확인합니다.
        </p>
      </div>
      <div id="paper-early-stopping" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Early Stopping — but when?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Prechelt는 validation trajectory를 이용한 여러 stopping criteria를 비교하며 더 오래 기다리는 기준이 평균적으로 작은 generalization 개선과 훨씬 긴 training time을 맞바꿀 수 있음을 분석했습니다. 당시 neural-network 실험의 수치를 현대 model의 patience 기본값으로 그대로 옮겨서는 안 됩니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://pubmed.ncbi.nlm.nih.gov/12662814/" target="_blank" rel="noreferrer">Stopping criterion과 cost trade-off 보기</a>
      </div>
    </section>
  );
}
