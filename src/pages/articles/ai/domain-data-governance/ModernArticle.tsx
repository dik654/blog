import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DomainDataGovernanceViz } from "../domain-finetuning/viz/ModernDomainAdaptationViz";

export default function DomainDataGovernanceArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">전문 데이터에서는 row 수보다 독립된 원인 수가 먼저입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">환자 visit 20개가 서로 다른 파일이어도 같은 환자에게서 나왔다면 독립된 20명은 아닙니다. Gene sequence도 같은 family·homology를 공유할 수 있고 제조 row도 같은 machine·lot·recipe의 한 사건일 수 있습니다.</p><p>이 공유 원인이 train과 test에 나뉘면 model은 새 환경을 일반화한 것이 아니라 가까운 친척을 기억한 점수를 냅니다. 먼저 배포에서 새로 만날 단위를 정한 뒤 split·권리·평가 근거를 설계합니다.</p></div>
      <TermBreakdown title="Row 뒤에서 찾아야 할 네 단위" items={[
        { term: "Entity", description: "여러 record를 만든 같은 환자·고객·장비·조직입니다." },
        { term: "Family·lineage", description: "직접 ID가 달라도 가까운 gene family·source document·파생 sample처럼 원인을 공유하는 묶음입니다." },
        { term: "Event time", description: "Prediction 시점에 실제로 관측 가능했는지를 판정할 timestamp입니다." },
        { term: "Deployment unit", description: "새 환자·새 기관·미래 lot처럼 model이 실제로 일반화해야 할 독립 단위입니다.", boundary: "이 단위가 정해져야 올바른 group key와 time cutoff를 고를 수 있습니다." },
      ]} />
      <DomainDataGovernanceViz />
      <ContentBoundary article="domain-data-governance" />
    </section>

    <section id="group-time-split" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">같은 group은 한 split에 두고 미래 test는 시간상 뒤에 둡니다</h2>
      <ExplainedFormula question="Entity·family가 split 사이에 새지 않고 미래 정보도 거꾸로 흐르지 않았음을 어떻게 검사하나요?" idea={<p>각 split의 row ID가 아니라 상위 group ID 집합을 만들고 교집합이 비었는지 확인합니다. 미래 배포라면 training의 가장 늦은 event가 test의 가장 이른 event보다 앞서야 합니다.</p>} formula={String.raw`G_{\rm train}\cap G_{\rm val}=G_{\rm train}\cap G_{\rm test}=G_{\rm val}\cap G_{\rm test}=\varnothing,\qquad\max t_{\rm train}<\min t_{\rm test}`} annotatedFormula={String.raw`\begin{aligned}O_{tv}&=\underbrace{G_{\rm train}\cap G_{\rm val}}_{\text{train·validation 공유 원인}}\\O_{tt}&=\underbrace{G_{\rm train}\cap G_{\rm test}}_{\text{train·test 공유 원인}}\\O_{vt}&=\underbrace{G_{\rm val}\cap G_{\rm test}}_{\text{validation·test 공유 원인}}\\\text{group-safe}&=\underbrace{\mathbb 1[O_{tv}=O_{tt}=O_{vt}=\varnothing]}_{\text{모든 교집합이 비었는지 판정}}\\\text{time-safe}&=\underbrace{\mathbb 1[\max t_{\rm train}<\min t_{\rm test}]}_{\text{미래 test 정보 역류 차단}}\end{aligned}`} operations={[
        { expression: String.raw`G_a\cap G_b`, annotation: ["두 split의 group ID를 교차해", "같은 공유 원인이 양쪽에 있는지 탐색"] },
        { expression: String.raw`O_{ab}=\varnothing`, annotation: ["교집합을 빈 집합과 비교해", "group leakage가 0인지 판정"] },
        { expression: String.raw`\max t_{\rm train}<\min t_{\rm test}`, annotation: ["가장 늦은 training 시각과 가장 이른 test 시각을 비교해", "미래 정보가 training에 들어오지 않게 함"] },
      ]} terms={[
        { symbol: String.raw`G_{\rm split}`, name: "Group-key set", description: "Patient·family·machine/lot·source lineage ID의 집합입니다." },
        { symbol: String.raw`O_{ab}`, name: "Overlap set", description: "두 split이 공유하는 상위 원인 ID입니다." },
        { symbol: String.raw`t_{\rm train},t_{\rm test}`, name: "Event time", description: "실제 prediction 가용성을 판정하는 timestamp입니다." },
      ]} assumptions={["Group key가 실제 dependency를 충분히 포착합니다.", "Future holdout이 실제 deployment 질문과 맞을 때만 시간 inequality를 요구합니다.", "Near duplicate·homology threshold는 training data에서 정하고 sensitivity를 봅니다."]} interpretation="행 ID가 모두 달라도 같은 환자나 gene family가 양쪽에 있으면 group-safe는 0입니다. Random row split의 높은 점수보다 실제 배포 단위를 닮은 split이 중요합니다." />
    </section>

    <section id="rights-lineage" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Provenance는 출처 URL이 아니라 삭제 경로까지 잇는 권리 장부입니다</h2>
      <TermBreakdown title="한 source record에서 model run까지 남길 것" items={[
        { term: "Source identity", description: "원본 system·record ID·entity·수집 시각과 source revision입니다." },
        { term: "Usage rights", description: "License·consent purpose·지역·보유 기간·재배포·model training 허용 범위입니다." },
        { term: "Derivative lineage", description: "De-identification·chunk·translation·synthetic generation으로 만든 파생 artifact가 어느 source에서 왔는지 잇습니다." },
        { term: "Deletion reach", description: "삭제 요청이 들어오면 영향받는 shard·checkpoint·evaluation fixture·serving model을 역추적하는 경로입니다.", boundary: "공개 URL에 접근 가능하다는 사실과 training·재배포 권리는 같지 않습니다." },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Synthetic data도 lineage 밖에 있지 않습니다. Generator checkpoint·prompt·filter revision과 원본 source 묶음을 기록해야 memorization 문제와 삭제 범위를 조사할 수 있습니다.</p></div>
    </section>

    <section id="coverage-release" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">평균 점수보다 근거가 있는 slice의 범위를 먼저 공개합니다</h2>
      <ExplainedFormula question="기관·계통·장비·희귀 조건 중 독립 근거가 충분한 cell의 비율을 어떻게 계산하나요?" idea={<p>
            각 required cell에서 row가 아니라 독립 group 수를 셉니다. 최소 근거 수를 넘은 cell만 1로 두고 전체 required cell 중 통과 비율과 빈
            cell 목록을 함께 냅니다.
          </p>} formula={String.raw`n_c=|\{g:\operatorname{slice}(g)=c\}|,\qquad\mathrm{Coverage}=\frac1{|\mathcal C|}\sum_{c\in\mathcal C}\mathbb 1[n_c\ge n_{\min}]`} annotatedFormula={String.raw`\begin{aligned}S_c&=\underbrace{\{g:\operatorname{slice}(g)=c\}}_{\text{cell c에 속한 독립 group 집합}}\\n_c&=\underbrace{|S_c|}_{\text{row가 아닌 독립 group 수}}\\I_c&=\underbrace{\mathbb 1[n_c\ge n_{\min}]}_{\text{최소 근거 수 통과 여부}}\\\mathrm{Coverage}&=\underbrace{\frac1{|\mathcal C|}\sum_{c\in\mathcal C}I_c}_{\text{required cell 중 근거가 있는 비율}}\end{aligned}`} operations={[
        { expression: String.raw`\{g:\operatorname{slice}(g)=c\}`, annotation: ["group을 slice 조건으로 걸러", "평가 cell의 독립 표본 집합 생성"] },
        { expression: String.raw`|S_c|`, annotation: ["집합 원소 수를 세어", "중복 row가 아닌 독립 근거 수 계산"] },
        { expression: String.raw`\mathbb 1[n_c\ge n_{\min}]`, annotation: ["근거 수를 최소 기준과 비교해", "주장 가능한 cell만 1로 표시"] },
        { expression: String.raw`\sum_c I_c/|\mathcal C|`, annotation: ["통과 cell을 더하고 required cell 수로 나눠", "전체 coverage 비율 계산"] },
      ]} terms={[
        { symbol: String.raw`\mathcal C`, name: "Required slice cells", description: "기관×시기×장비×condition 등 사전에 평가할 cell 목록입니다." },
        { symbol: String.raw`n_c`, name: "Independent group count", description: "Cell c의 고유 환자·family·lot 수입니다." },
        { symbol: String.raw`n_{\min}`, name: "Minimum evidence count", description: "성능을 주장하기 위해 사전에 정한 최소 독립 group 수입니다." },
      ]} assumptions={["Required cell 목록은 결과를 보기 전에 고정합니다.", "Count threshold가 대표성·confidence interval·fairness를 대신하지 않습니다.", "민감 subgroup는 privacy-safe aggregation과 접근 통제를 적용합니다."]} interpretation="12개 required cell 중 9개만 독립 group 30개 이상이면 coverage는 .75입니다. 나머지 3개를 평균에서 숨기지 않고 배포 제외 또는 human review 범위로 적습니다." />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>최종 model card에는 “의료 전반에서 유효”가 아니라 검증한 기관·기간·장비·condition과 실패 시 abstain·human review 조건을 씁니다. 이 문장이 바로 deployment claim boundary입니다.</p></div>
      <div id="paper-datasheets" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Gebru et al. — Datasheets for Datasets" href="https://arxiv.org/abs/1803.09010">Dataset의 동기·구성·수집·전처리·배포·유지 질문을 문서화하는 제안입니다. Datasheet 작성만으로 consent·독립성·공정성이 자동 보장되지는 않습니다.</CitationBlock></div>
      <div id="paper-model-cards" className="not-prose mt-6 scroll-mt-24"><CitationBlock type="paper" citeKey={2} source="Mitchell et al. — Model Cards" href="https://arxiv.org/abs/1810.03993">Model의 intended use·evaluation condition·subgroup 성능·제한을 함께 보고하는 문서 형식입니다. 보고서가 실제 운영 gate와 monitoring을 대신하지는 않습니다.</CitationBlock></div>
    </section>
  </div>;
}
