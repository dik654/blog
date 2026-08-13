import ExplainedFormula from "@/components/ui/explained-formula";
import ApplicationViz from "./viz/ApplicationViz";

export default function Application() {
  return (
    <section id="application" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">실전에서는 pair audit와 downstream 평가가 하나의 loop를 이룹니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          먼저 target task에서 보존해야 할 정보와 무시해도 되는 변화를 문장으로 적습니다. 그 정의를 positive transformation, multi-positive label과 negative filtering rule로 옮긴 뒤 sample pair를 사람이 직접 검토합니다. Pair가 잘못되면 더 큰 encoder나 복잡한 loss로도 의미 공간을 바로잡기 어렵습니다.
        </p>
        <p>
          학습 중에는 loss뿐 아니라 embedding norm, 차원별 variance와 positive·negative similarity 분포를 기록합니다. 평가는 linear probe, retrieval, clustering 가운데 실제 downstream task에 맞는 지표를 주지표로 정하고, class·domain·length 같은 slice에서 개선이 일관적인지 확인합니다.
        </p>
      </div>
      <div className="not-prose my-8"><ApplicationViz /></div>
      <ExplainedFormula
        question="Hard-negative 후보가 실제 negative인지, 새 encoder가 실제로 좋아졌는지 어떻게 분리해 확인할까요?"
        idea={<>난이도 구간별 후보를 사람이 검토해 false-negative 비율을 계산하고, 동일 split과 seed에서 baseline 대비 downstream metric 차이를 구합니다. 둘을 함께 보아야 miner가 어려운 오답을 찾았는지 숨은 정답을 오염시켰는지 구분할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
\widehat r_{\mathrm{FN}}^{(b)}&=F_b/R_b,\\
M_s^{(\mathrm{ctr})}&=M(\theta_{\mathrm{ctr}},s),\\
M_s^{(\mathrm{base})}&=M(\theta_{\mathrm{base}},s),\\
\Delta_s&=M_s^{(\mathrm{ctr})}-M_s^{(\mathrm{base})},\\
\overline\Delta&=\frac1S\sum_{s=1}^{S}\Delta_s.
\end{aligned}`}
        terms={[
          { symbol: "b", name: "difficulty or domain bucket", description: "Similarity·source·class 등으로 나눈 audit 구간입니다." },
          { symbol: "R_b", name: "reviewed candidates", description: "구간 b에서 사람이 관계를 확인한 negative 후보 수입니다." },
          { symbol: "F_b", name: "false negatives", description: "검토 결과 실제로는 positive 또는 관련 문서였던 후보 수입니다." },
          { symbol: "M", name: "downstream metric", description: "Retrieval NDCG·linear-probe accuracy 등 사전에 정한 최종 지표입니다." },
          { symbol: "Δ_s", name: "paired seed gain", description: "같은 seed·split에서 contrastive 후보와 baseline의 지표 차이입니다." },
        ]}
        assumptions={["Audit 표본은 각 bucket에서 무작위로 뽑고 판정 기준과 annotator agreement를 기록합니다.", "Baseline과 후보는 같은 data split·evaluation code·seed set을 사용합니다.", "평균 gain뿐 아니라 seed별 분산과 domain slice의 최악값도 확인합니다."]}
        interpretation="가장 가까운 bucket의 loss 기여가 커도 false-negative 비율이 높다면 miner를 강화할 근거가 아닙니다. 반대로 pair 품질이 좋아도 downstream gain이 없다면 invariance가 task와 맞지 않거나 encoder·optimization이 병목일 수 있습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Embedding 실험도 artifact를 남깁니다</h3>
        <p>
          Encoder checkpoint만 저장해서는 결과를 재현할 수 없습니다. Augmentation version, sampler seed, miner model과 index, normalization 여부, pooling과 projection head 구성을 함께 남깁니다. 새 hard-negative miner를 도입했다면 같은 evaluation set에서 이전 pair policy와 분리해 비교합니다.
        </p>
        <p>
          마지막으로 가장 어려운 error pair를 다시 pair audit에 넣습니다. 이 closed loop를 통해 모델 용량을 늘리기 전에 데이터 정의가 틀렸는지, representation이 부족한지, 평가 label이 불완전한지를 구분할 수 있습니다. 여기서 closed loop는 내부 조어가 아니라 결과를 다음 데이터 수정에 다시 반영하는 일반적인 피드백 구조를 뜻합니다.
        </p>
      </div>
    </section>
  );
}
