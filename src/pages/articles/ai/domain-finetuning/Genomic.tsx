import ExplainedFormula from "@/components/ui/explained-formula";
import GenomicViz from "./viz/GenomicViz";

export default function Genomic() {
  return <section id="genomic" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">전문 도메인에서는 row가 아니라 공유 원인과 이용 권한을 먼저 분리합니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>유전체 sequence는 서로 다른 파일이어도 같은 gene family나 가까운 homology를 공유할 수 있고, 의료 record는 같은 환자·기관·장비에서 반복 생성됩니다. 제조 데이터도 같은 machine·lot·시간대의 공정 원인을 공유합니다. 이런 관계가 split을 넘으면 model이 처음 보는 원리를 일반화한 것이 아니라 가까운 친척이나 환경 shortcut을 기억한 점수가 됩니다.</p>
      <p>먼저 deployment에서 새로 만날 단위를 정합니다. 새로운 환자인지, 새로운 기관인지, 미래 lot인지에 따라 group key와 time cutoff가 달라집니다. Exact duplicate만 지우지 말고 sequence similarity·source document lineage·환자와 장비 관계를 이용해 파생 sample을 같은 group에 둡니다.</p>
    </div>
    <div className="not-prose my-8"><GenomicViz /></div>
    <ExplainedFormula
      question="Entity·family·time 관계가 train과 test 사이에 새지 않았음을 어떻게 검사할까요?"
      idea={<>각 split의 row를 상위 group key 집합으로 바꾸고 교집합이 비었는지 확인합니다. 시간축이 있는 경우 training의 가장 늦은 event가 test의 가장 이른 event보다 앞서야 합니다.</>}
      formula={String.raw`\begin{aligned}
G_{\mathrm{train}}\cap G_{\mathrm{val}}&=\varnothing\\
G_{\mathrm{train}}\cap G_{\mathrm{test}}&=\varnothing\\
G_{\mathrm{val}}\cap G_{\mathrm{test}}&=\varnothing\\
\max t_{\mathrm{train}}&<\min t_{\mathrm{test}}
\end{aligned}`}
      terms={[
        { symbol: "Gsplit", name: "group-key set", description: "Patient·gene family·machine/lot·source lineage처럼 독립성 단위의 ID 집합입니다." },
        { symbol: "ttrain,t_test", name: "event time", description: "실제 prediction 시점에서 이용 가능성을 판정할 timestamp입니다." },
        { symbol: String.raw`\cap=\varnothing`, name: "disjoint groups", description: "동일 공유 원인이 두 split에 동시에 나타나지 않는 조건입니다." },
      ]}
      assumptions={["Group key가 실제 dependency를 충분히 포착하며 unknown identity를 한 임의 group으로 숨기지 않습니다.", "Temporal inequality는 미래 예측 deployment에 해당하며 random historical deployment에는 다른 split이 필요할 수 있습니다.", "Near-duplicate와 homology threshold 자체는 training data에서 정하고 sensitivity analysis를 합니다."]}
      interpretation="행 ID가 모두 달라도 같은 환자나 gene family가 양쪽에 있으면 조건을 통과하지 못합니다. Group-disjoint와 future holdout을 동시에 요구할지 여부는 실제 배포 시나리오로 정합니다."
    />
    <ExplainedFormula
      question="기관·계통·장비·희귀 조건 중 평가 근거가 비어 있는 곳을 어떻게 드러낼까요?"
      idea={<>Coverage cell마다 독립 group 수를 세고, 최소 기준 nmin 이상인 cell 비율을 계산합니다. Frame·row 수가 아니라 공유 원인을 제거한 group 수를 사용합니다.</>}
      formula={String.raw`\begin{aligned}
n_c&=|\{g:\operatorname{slice}(g)=c\}|\\
I_c&=\mathbb 1[n_c\ge n_{\min}]\\
\mathrm{Coverage}&=\frac{1}{|\mathcal C|}\sum_{c\in\mathcal C}I_c
\end{aligned}`}
      terms={[
        { symbol: "C", name: "required slice cells", description: "기관×시기×장비×condition 등 사전에 평가해야 한다고 정한 cell 집합입니다." },
        { symbol: "n_c", name: "independent groups in cell", description: "Cell c에 속한 고유 환자·family·lot 등 독립 group 수입니다." },
        { symbol: "I_c", name: "coverage indicator", description: "Cell c의 독립 group 수가 최소 근거 기준을 넘으면 1, 아니면 0입니다." },
        { symbol: "nmin", name: "minimum evidence count", description: "Metric을 보고할 최소 group 수로 통계적·운영적 요구에서 정합니다." },
      ]}
      assumptions={["Required cell 목록을 결과를 보기 전에 정하고 empty/unknown cell을 삭제하지 않습니다.", "Count threshold만으로 representative sampling과 confidence interval이 보장되지는 않습니다.", "민감 subgroup는 privacy 때문에 충분한 aggregation과 접근 통제가 필요합니다."]}
      interpretation="전체 sample이 많아도 특정 기관의 rare condition에 독립 환자가 두 명뿐이면 그 cell의 성능 근거는 약합니다. 평균 점수와 coverage를 함께 보고 배포 범위를 제한합니다."
    />
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h3>Provenance는 출처 URL보다 넓은 실행 계약입니다</h3>
      <p>Dataset·source·entity·수집 시각·license·consent purpose·보유 기간·삭제 요청·파생 artifact·split을 하나의 manifest로 연결합니다. Synthetic data도 원본 lineage, generator/checkpoint, prompt와 filtering revision을 기록해야 삭제나 재학습 범위를 역추적할 수 있습니다.</p>
      <p>Adapted model은 전문가 판단을 대체한다는 결론이 아니라, 검증된 기관·계통·장비·시기와 실패 시 abstain·human review로 넘어가는 조건이 명시된 component로 배포합니다.</p>
    </div>
  </section>;
}
