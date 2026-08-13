import ExplainedFormula from "@/components/ui/explained-formula";
import PruningViz from "./viz/PruningViz";

export default function Pruning() {
  return (
    <section id="pruning" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">조기 중단은 나쁜 모델 판정기가 아니라, 낮은 fidelity에서 자원을 재배분하는 정책입니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Epoch 2의 score로 trial을 멈추려면 모든 trial의 “2”가 같은 양의 계산을 뜻해야 합니다. Dataset 크기와 batch가 다르면 epoch
          하나의 optimizer update 수가 달라지므로 processed token·sample·update처럼 비교 가능한 resource를 사용합니다. Warmup이 긴
          설정이나 후반에 개선되는 schedule은 초기 순위가 낮을 수 있어 completed pilot에서 early-to-final rank 관계를 먼저 봅니다.
        </p>
        <p>
          Successive Halving은 많은 설정에 작은 예산을 주고 상위 일부에 더 큰 예산을 반복 배정합니다. Hyperband는 처음 후보 수와
          initial resource를 다르게 둔 여러 bracket을 실행해 “많이 얕게 볼지, 적게 깊게 볼지”의 선택에도 예산을 분산합니다. 이때
          resource가 늘면 같은 target에 점진적으로 가까워진다는 multi-fidelity 전제가 중요합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Successive Halving 한 단계에서 몇 개를 남기고 각 후보의 자원을 얼마나 늘릴까요?"
        idea={<>현재 n개의 trial을 같은 resource r에서 비교하고 상위 약 1/η만 유지한 뒤, 살아남은 trial에는 η배 resource를 줍니다.</>}
        formula={String.raw`\begin{aligned}
          n_{j+1}&=\left\lceil\frac{n_j}{\eta}\right\rceil \\
          r_{j+1}&=\eta r_j,\qquad \eta>1
        \end{aligned}`}
        terms={[
          { symbol: "n_j", name: "active configurations", description: "j번째 rung에서 같은 resource까지 평가한 후보 수입니다." },
          { symbol: "r_j", name: "comparable resource", description: "각 후보가 받은 optimizer updates·processed tokens·data fraction 같은 fidelity입니다." },
          { symbol: "eta", name: "reduction factor", description: "한 단계에서 후보를 줄이고 자원을 늘리는 비율입니다." },
        ]}
        assumptions={[
          "같은 rung score가 동일한 metric·split·resource semantics에서 계산됩니다.",
          "작은 r의 순위가 최종 r의 순위와 어느 정도 관련되어야 계산 절약이 의미를 가집니다.",
          "Checkpoint를 이어 학습하는지 처음부터 재학습하는지를 일관되게 정합니다.",
        ]}
        interpretation="η=3이면 27개를 r에서 보고 약 9개를 3r, 약 3개를 9r로 올립니다. 계산은 줄지만 늦게 좋아지는 후보를 놓칠 수 있습니다."
      />

      <ExplainedFormula
        question="Quality·latency·memory를 함께 볼 때 어떤 후보를 Pareto frontier에서 제외할 수 있을까요?"
        idea={<>모든 비용 축에서 A가 B보다 나쁘지 않고 적어도 한 축에서 더 좋다면 A가 B를 지배합니다. 지배당한 B는 추가 선호가 없어도 제외할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
          A\prec B\iff {}&\forall k,\ f_k(A)\le f_k(B),\\
                         &\exists k,\ f_k(A)<f_k(B)
        \end{aligned}`}
        terms={[
          { symbol: "f_k", name: "minimized objective k", description: "Loss·latency·memory처럼 작을수록 좋게 방향을 맞춘 k번째 목적입니다." },
          { symbol: "A ≺ B", name: "A dominates B", description: "A가 모든 목적에서 B 이상이고 적어도 하나에서 더 좋다는 뜻입니다." },
          { symbol: "frontier", name: "non-dominated set", description: "다른 feasible 후보에 지배되지 않아 실제 trade-off 선택이 필요한 집합입니다." },
        ]}
        assumptions={[
          "Safety·compatibility 같은 hard constraint를 먼저 통과한 후보끼리 비교합니다.",
          "Metric noise가 크면 point estimate 대신 반복 분산과 실질 차이 tolerance를 적용합니다.",
          "Throughput처럼 클수록 좋은 값은 음수나 reciprocal로 방향을 맞추거나 dominance 정의를 바꿉니다.",
        ]}
        interpretation="A가 loss .20·10ms·4GB이고 B가 .22·12ms·5GB라면 A가 B를 지배합니다. C가 .18·15ms·3GB라면 A와 C는 trade-off라 둘 다 남습니다."
      />

      <div className="not-prose my-8"><PruningViz /></div>

      <div id="paper-hyperband" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Hyperband</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Hyperband의 핵심은 random configuration 생성 자체보다 제한된 자원을 설정들 사이에 어떻게 나눌지를 bandit 문제로 다룬
          것입니다. 여러 bracket으로 탐색 폭과 개별 학습 깊이를 바꾸고 successive halving으로 자원을 재배분합니다. 논문의
          속도 향상은 실험한 deep-learning·kernel task와 resource–quality 관계 안의 결과이며, 초기 score가 최종 순위와 무관한
          workload에서는 같은 이득을 보장하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jmlr.org/papers/v18/16-558.html" target="_blank" rel="noreferrer">논문의 bandit formulation과 전제 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          최종 후보는 pruning을 끄고 full budget·여러 seed로 다시 실행합니다. 선택된 checkpoint만 남기지 말고 PRUNED·FAIL까지 포함한
          trial table, intermediate curve, peak memory, wall time, code/data/search-space version을 보존해야 중단 정책이 어떤
          후보군을 체계적으로 불리하게 만들었는지 나중에 확인할 수 있습니다.
        </p>
        <p>
          Pruner를 켜기 전에는 completed pilot에서 같은 resource step의 early rank와 final rank를 비교합니다. Warmup이 긴 후보에
          grace period를 주고, 실제로 중단됐을 후보 일부를 full budget까지 보내 false-prune rate와 절약한 update·wall time을 함께
          계산합니다. PRUNED cohort와 COMPLETE cohort의 schedule·model family 분포가 한쪽으로 치우쳤다면 policy를 수정하고 version을
          올립니다. 마지막으로 hard constraint를 먼저 적용하고, 남은 Pareto 후보를 반복 seed와 untouched outer data에서 확인한 뒤
          운영 담당자가 실질 차이 tolerance와 SLA에 맞춰 최종 configuration을 고릅니다.
        </p>
      </div>
    </section>
  );
}
