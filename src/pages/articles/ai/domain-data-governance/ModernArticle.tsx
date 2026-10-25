import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import DomainAdaptationPathLocator, {
  DomainAdaptationMapReturn,
} from "../domain-finetuning/DomainAdaptationPathLocator";
import {
  DataGovernanceTraceViz,
  EvidenceCoverageViz,
  GroupTimeSplitViz,
  RightsLineageViz,
} from "./DataGovernanceViz";

export default function DomainDataGovernanceArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="patient-visit-governance"
        className="scroll-mt-20"
      >
        <DomainAdaptationPathLocator current="data-governance" />
        <h2 className="mb-5 text-2xl font-bold">
          1. 열두 row가 있어도 독립된 환자는 네 명일 수 있습니다
        </h2>

        <DataGovernanceTraceViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            환자 A·B·C·D가 각각 세 번 방문해 열두 row를 만들었다고 가정하겠습니다. 행 ID는
            모두 다르지만 실제 배포에서 새로 만날 독립 단위는 네 환자입니다. 같은 환자의
            visit을 train과 test에 나누면 기록이 양쪽에 남습니다. 이때 모델은 새 환자에게
            일반화한 것이 아니라 이미 본 환자의 가까운 기록을 다시 읽을 수 있습니다.
          </p>
          <p>
            이 글은 열두 row를 네 환자 group으로 되돌립니다. 환자 A·B·C의 아홉 visit을
            train에, D의 세 visit을 test에 둡니다. 이어서 source S-17이 만든 shard와 run,
            checkpoint를 잇습니다. Required evaluation cell은 12개로 둡니다. 이 가운데 독립
            group 30개 이상인 9개만 근거가 있는 범위로 남깁니다.
          </p>
          <p>
            환자·row·날짜·cell 수와 threshold는 계산 순서를 보여 주기 위한 가정 [A]입니다.
            실제 의료 데이터의 충분한 표본 수나 배포 기준을 주장하지 않습니다.
          </p>
        </div>

        <TermBreakdown
          title="Row 뒤에서 찾아야 할 네 단위"
          items={[
            { term: "Entity", description: "여러 record를 만든 같은 환자·고객·장비·조직입니다." },
            { term: "Family·lineage", description: "ID가 달라도 같은 gene family·source document·파생 sample처럼 원인을 공유하는 묶음입니다." },
            { term: "Event time", description: "Prediction 시점에 실제로 관측 가능했는지를 판정할 timestamp입니다." },
            {
              term: "Deployment unit",
              description: "새 환자·새 기관·미래 lot처럼 모델이 실제로 일반화해야 할 단위입니다.",
              boundary: "이 단위를 먼저 정해야 올바른 group key와 time cutoff를 고를 수 있습니다.",
            },
          ]}
        />
        <ContentBoundary article="domain-data-governance" />
      </section>

      <section id="group-time-split" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. 같은 group은 한 split에 두고 미래 test는 시간상 뒤에 둡니다
        </h2>

        <GroupTimeSplitViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            왼쪽의 random row split에서는 네 환자가 train과 test 양쪽에 나타납니다. 행 ID의
            교집합은 비어도 환자 ID의 교집합은 비어 있지 않습니다. 오른쪽처럼 환자 D의 세
            visit을 모두 test에 두어야 새 환자라는 배포 질문에 가까워집니다.
          </p>
          <p>
            미래 사건을 예측하려면 group 격리만으로 충분하지 않습니다. Training에서 사용한
            가장 늦은 event가 test의 가장 이른 event보다 앞서야 합니다. Diagnosis 뒤에
            기록된 treatment나 discharge 결과는 미래 정보입니다. 이 값이 training feature로
            들어오면 환자가 분리돼도 시간 누수가 남습니다.
          </p>
        </div>

        <ExplainedFormula
          question="같은 환자가 split 사이에 새지 않고 미래 정보도 거꾸로 흐르지 않았음을 어떻게 검사합니까?"
          idea={(
            <p>
              각 split의 row ID가 아니라 상위 group ID 집합을 만듭니다. 모든 교집합이
              비었는지 확인한 뒤 training의 마지막 event와 test의 첫 event를 비교합니다.
            </p>
          )}
          formula={String.raw`G_{\rm train}\cap G_{\rm val}=G_{\rm train}\cap G_{\rm test}=G_{\rm val}\cap G_{\rm test}=\varnothing,\qquad\max t_{\rm train}<\min t_{\rm test}`}
          annotatedFormula={String.raw`\begin{aligned}O_{tv}&=\underbrace{G_{\rm train}\cap G_{\rm val}}_{\text{train·validation 공유 원인}}\\O_{tt}&=\underbrace{G_{\rm train}\cap G_{\rm test}}_{\text{train·test 공유 원인}}\\O_{vt}&=\underbrace{G_{\rm val}\cap G_{\rm test}}_{\text{validation·test 공유 원인}}\\\text{group-safe}&=\underbrace{\mathbb 1[O_{tv}=O_{tt}=O_{vt}=\varnothing]}_{\text{모든 교집합이 비었는지 판정}}\\\text{time-safe}&=\underbrace{\mathbb 1[\max t_{\rm train}<\min t_{\rm test}]}_{\text{미래 test 정보의 역류 차단}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`G_a\cap G_b`,
              annotation: ["두 split의 group ID를 교차해", "같은 공유 원인이 양쪽에 있는지 찾습니다."],
            },
            {
              expression: String.raw`O_{ab}=\varnothing`,
              annotation: ["교집합을 빈 집합과 비교해", "group leakage가 없는지 판정합니다."],
            },
            {
              expression: String.raw`\max t_{\rm train}<\min t_{\rm test}`,
              annotation: ["가장 늦은 training 시각과 가장 이른 test 시각을 비교해", "미래 정보가 training에 들어오지 않게 합니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`G_{\rm split}`, name: "Group-key set", description: "Patient·family·machine/lot·source lineage ID의 집합입니다." },
            { symbol: String.raw`O_{ab}`, name: "Overlap set", description: "두 split이 공유하는 상위 원인 ID입니다." },
            { symbol: String.raw`t_{\rm train},t_{\rm test}`, name: "Event time", description: "실제 prediction 가용성을 판정하는 timestamp입니다." },
          ]}
          assumptions={[
            "Group key가 실제 dependency를 충분히 포착합니다.",
            "Future holdout이 실제 deployment 질문과 맞을 때만 시간 부등식을 요구합니다.",
            "Near duplicate·homology 기준은 training data에서 정하고 민감도도 확인합니다.",
          ]}
          interpretation="행 ID가 모두 달라도 같은 환자가 양쪽에 있으면 group-safe는 0입니다. 환자 A·B·C와 D를 분리하고 시간 방향도 맞을 때만 두 조건이 1입니다."
        />
      </section>

      <section id="rights-lineage" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. 출처에서 checkpoint까지 권리와 삭제 경로를 이어 둡니다
        </h2>

        <RightsLineageViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Provenance는 원본 URL을 한 칸에 적는 것으로 끝나지 않습니다. Source S-17의
            consent와 보유 기간이 바뀔 수 있습니다. 이때 de-identification 결과 d2와 shard
            04를 거쳐 run r8까지 찾아야 합니다. Checkpoint v2의 영향도 역방향으로 확인합니다.
          </p>
          <p>
            Synthetic data도 lineage 밖에 있지 않습니다. Generator checkpoint와 prompt를
            기록합니다. Filter revision과 원본 source 묶음도 이어야 memorization과 삭제
            범위를 조사할 수 있습니다. 공개 URL에 접근 가능하다는 사실도 학습·재배포 권리를
            뜻하지 않습니다.
          </p>
        </div>

        <TermBreakdown
          title="한 source에서 모델까지 남길 네 상태"
          items={[
            { term: "Source identity", description: "원본 system·record ID·entity·수집 시각과 source revision입니다." },
            { term: "Usage rights", description: "License·consent purpose·지역·보유 기간·재배포·model training 허용 범위입니다." },
            { term: "Derivative lineage", description: "정제·chunk·번역·합성으로 만든 파생물이 어느 source에서 왔는지 잇습니다." },
            {
              term: "Deletion reach",
              description: "삭제 요청이 영향을 주는 shard·checkpoint·evaluation fixture·serving model을 찾는 경로입니다.",
              boundary: "Checkpoint에서 원본 source로 돌아가지 못하면 삭제 완료를 증명할 수 없습니다.",
            },
          ]}
        />
      </section>

      <section id="coverage-release" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. 근거가 충분한 evaluation cell까지만 배포 범위로 주장합니다
        </h2>

        <EvidenceCoverageViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기관·시기·장비·condition을 조합해 required cell 12개를 미리 정했다고
            가정하겠습니다. 아홉 cell에는 독립 환자 group이 30개 이상 있지만, 나머지
            세 cell은 20·21·22개뿐입니다. Coverage는 9/12=0.75입니다.
          </p>
          <p>
            세 cell을 전체 평균 속에 숨기면 안 됩니다. 이 cell들은 낮은 성능이 확인된
            상태가 아니라 충분히 확인하지 못한 상태입니다. 자동 배포 범위에서 제외하거나
            abstention·human review로 보내고, model card에도 검증하지 못한 범위를 적습니다.
          </p>
        </div>

        <ExplainedFormula
          question="Required cell 가운데 독립 근거가 충분한 cell의 비율을 어떻게 계산합니까?"
          idea={(
            <p>
              각 cell에서 row가 아니라 독립 group 수를 셉니다. 최소 수를 넘은 cell만 1로
              두고 전체 required cell 중 통과 비율을 계산합니다.
            </p>
          )}
          formula={String.raw`n_c=|\{g:\operatorname{slice}(g)=c\}|,\qquad\mathrm{Coverage}=\frac1{|\mathcal C|}\sum_{c\in\mathcal C}\mathbb 1[n_c\ge n_{\min}]`}
          annotatedFormula={String.raw`\begin{aligned}S_c&=\underbrace{\{g:\operatorname{slice}(g)=c\}}_{\text{cell c에 속한 독립 group 집합}}\\n_c&=\underbrace{|S_c|}_{\text{row가 아닌 독립 group 수}}\\I_c&=\underbrace{\mathbb 1[n_c\ge n_{\min}]}_{\text{최소 근거 수 통과 여부}}\\\mathrm{Coverage}&=\underbrace{\frac1{|\mathcal C|}\sum_{c\in\mathcal C}I_c}_{\text{required cell 중 근거가 있는 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{g:\operatorname{slice}(g)=c\}`,
              annotation: ["Group을 cell 조건으로 걸러", "평가 cell의 독립 표본 집합을 만듭니다."],
            },
            {
              expression: String.raw`|S_c|`,
              annotation: ["집합 원소 수를 세어", "중복 row가 아닌 독립 근거 수를 계산합니다."],
            },
            {
              expression: String.raw`\mathbb 1[n_c\ge n_{\min}]`,
              annotation: ["근거 수를 사전 기준과 비교해", "주장 가능한 cell만 1로 표시합니다."],
            },
            {
              expression: String.raw`\sum_c I_c/|\mathcal C|`,
              annotation: ["통과 cell을 더하고 required cell 수로 나눠", "전체 coverage 비율을 계산합니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`\mathcal C`, name: "Required slice cells", description: "기관×시기×장비×condition처럼 사전에 평가할 cell 목록입니다." },
            { symbol: String.raw`n_c`, name: "Independent group count", description: "Cell c의 고유 환자·family·lot 수입니다." },
            { symbol: String.raw`n_{\min}`, name: "Minimum evidence count", description: "성능을 주장하기 위해 사전에 정한 최소 독립 group 수입니다." },
          ]}
          assumptions={[
            "Required cell 목록과 최소 수는 결과를 보기 전에 정합니다.",
            "Count threshold가 대표성·신뢰 구간·공정성 검사를 대신하지 않습니다.",
            "민감 subgroup에는 privacy-safe aggregation과 접근 통제를 적용합니다.",
          ]}
          interpretation="Required cell 12개 중 9개만 최소 30 group을 넘으면 coverage는 0.75입니다. 나머지 3개는 배포 제외 또는 human review 범위로 남깁니다."
        />

        <div id="paper-datasheets" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Gebru et al. — Datasheets for Datasets"
            href="https://arxiv.org/abs/1803.09010"
          >
            Dataset의 동기·구성·수집·전처리·배포·유지 질문을 문서화하는 틀을
            제안합니다. Datasheet 작성만으로 consent·독립성·공정성이 자동으로 보장되지는
            않습니다.
          </CitationBlock>
        </div>
        <div id="paper-model-cards" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Mitchell et al. — Model Cards"
            href="https://arxiv.org/abs/1810.03993"
          >
            Model의 intended use·평가 조건·subgroup 결과·제한을 함께 보고하는 형식입니다.
            보고서가 실제 runtime gate와 monitoring을 대신하지는 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="return" data-teach-level="5" className="scroll-mt-20">
        <DomainAdaptationMapReturn current="data-governance" />
      </section>

      <section id="self-check" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">5. 스스로 확인하기</h2>
        <ol className="space-y-4 border-y border-border py-5 text-sm leading-7">
          <li><strong>열두 visit row를 만든 환자가 네 명이면 독립 deployment unit은 몇 개입니까?</strong> <span className="text-muted-foreground">(답: 1절)</span></li>
          <li><strong>행 ID의 교집합이 비어도 환자 ID 교집합을 따로 검사해야 하는 이유는 무엇입니까?</strong> <span className="text-muted-foreground">(답: 2절)</span></li>
          <li><strong>Required cell 12개 가운데 9개가 최소 근거 수를 넘으면 coverage는 얼마입니까?</strong> <span className="text-muted-foreground">(답: 4절)</span></li>
        </ol>
      </section>
    </div>
  );
}
