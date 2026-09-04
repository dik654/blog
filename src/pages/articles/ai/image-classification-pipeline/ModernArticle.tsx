import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ImageIdentityViz } from "./viz/ModernImageClassificationViz";

export default function ImageClassificationDataBoundaryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Image sample은 파일 한 장이 아니라 배포에서 독립적으로 만날 관측
          단위입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 상품을 연속 촬영한 세 장, 한 원본에서 만든 두 crop, 같은 환자의
            좌우 view는 파일 이름이 달라도 서로 독립적이지 않습니다. 먼저
            “배포에서 처음 보는 것으로 세어야 할 대상”을 정해야 합니다. 그
            대상이 <strong>deployment unit</strong>입니다.
          </p>
          <p>
            파일을 먼저 random split하면 같은 대상의 질감·배경·센서 흔적이
            train과 validation 양쪽에 남을 수 있습니다. 모델은 class 규칙을 배운
            것처럼 보이지만 실제로는 identity를 기억합니다. 따라서 model
            architecture보다 먼저 sample lineage와 group key를 고정합니다.
          </p>
        </div>
        <TermBreakdown
          title="파일에서 평가 단위까지"
          items={[
            {
              term: "Source object",
              description:
                "촬영·생성의 출발점이 된 실제 사람·상품·문서·원본 image입니다.",
            },
            {
              term: "Derivative image",
              description:
                "Crop·resize·compression·burst frame처럼 source에서 파생된 파일입니다.",
            },
            {
              term: "Identity group",
              description:
                "같은 deployment unit에 속해 split을 함께 이동해야 하는 samples 집합입니다.",
            },
            {
              term: "Split manifest",
              description:
                "각 group이 train·validation·test 중 어디에 속하는지와 생성 규칙을 고정한 artifact입니다.",
            },
          ]}
        />
        <ImageIdentityViz />
        <ContentBoundary article="image-classification-pipeline" />
      </section>

      <section id="identity" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Identity group을 만든 뒤 group 집합의 교집합을 검사합니다
        </h2>
        <ExplainedFormula
          question="같은 실제 대상이 train과 validation을 건너지 않았는지 어떻게 검사하나요?"
          idea={
            <p>
              각 image를 deployment identity로 투영하고 split별 identity 집합을 만든 뒤 교집합이 비었는지 확인합니다. 마지막 평균 loss도 그 고정된
              validation samples에서만 계산합니다.
            </p>
          }
          formula={String.raw`\mathcal G_{\rm tr}\cap\mathcal G_{\rm val}=\varnothing`}
          annotatedFormula={String.raw`\begin{aligned}g_i&=\underbrace{\operatorname{identity}(x_i)}_{\substack{\text{파일을 실제 배포 단위에}\\\text{연결}}}\\[4pt]\mathcal G_s&=\underbrace{\{g_i:i\in s\}}_{\substack{\text{split 안의 identity만}\\\text{집합으로 모음}}}\\[4pt]O&=\underbrace{\mathcal G_{\rm tr}\cap\mathcal G_{\rm val}}_{\substack{\text{두 split에 동시에 나타난}\\\text{identity를 찾음}}}\\[4pt]\operatorname{pass}&=\underbrace{\mathbf 1[|O|=0]}_{\substack{\text{overlap이 없을 때만}\\\text{평가를 허용}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{identity}(x_i)`,
              annotation: [
                "파일을 source metadata에 연결해",
                "deployment group을 정함",
              ],
            },
            {
              expression: String.raw`\{g_i:i\in s\}`,
              annotation: [
                "split별 group IDs를 모아",
                "비교 가능한 집합을 만듦",
              ],
            },
            {
              expression: String.raw`\mathcal G_{\rm tr}\cap\mathcal G_{\rm val}`,
              annotation: [
                "두 집합의 공통 원소를 찾아",
                "identity leakage를 드러냄",
              ],
            },
            {
              expression: String.raw`\mathbf 1[|O|=0]`,
              annotation: [
                "겹친 group 수가 0인지 검사해",
                "split release를 결정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "x_i",
              name: "Image file",
              description: "i번째 image bytes와 source metadata입니다.",
            },
            {
              symbol: "g_i",
              name: "Identity key",
              description:
                "같은 실제 대상의 derivatives가 공유하는 group ID입니다.",
            },
            {
              symbol: String.raw`\mathcal G_s`,
              name: "Split groups",
              description: "Split s에 배정된 identity key 집합입니다.",
            },
            {
              symbol: "O",
              name: "Overlap",
              description:
                "Train과 validation 양쪽에 나타난 identity 집합입니다.",
            },
          ]}
          assumptions={[
            "Identity rule은 label과 model score를 보기 전에 수집 구조에서 정합니다.",
            "Exact hash뿐 아니라 crop·resize·compression near-duplicate도 검사합니다.",
            "Time·device·site shift가 배포의 핵심이면 identity 외에 별도 holdout axis를 둡니다.",
          ]}
          interpretation="상품 17의 원본과 세 crop을 모두 train에, 상품 42의 views를 모두 validation에 두면 두 group 집합의 교집합은 비어 있습니다."
        />
      </section>

      <section id="baseline" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Baseline receipt는 model weight가 아니라 공정 비교의 전체 입력입니다
        </h2>
        <TermBreakdown
          title="한 generation에 따로 기록할 네 묶음"
          items={[
            {
              term: "Data receipt",
              description:
                "Dataset revision, split digest, identity rule, class-to-index mapping과 excluded rows입니다.",
            },
            {
              term: "Input receipt",
              description:
                "Decode, color order, resize·crop interpolation, normalization과 inference transform입니다.",
            },
            {
              term: "Model receipt",
              description:
                "Architecture config, pretrained weight revision, classifier head와 random seeds입니다.",
            },
            {
              term: "Evaluation receipt",
              description:
                "Metric denominator, slices, NLL, p50·p95 latency, throughput, memory와 hardware입니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="Candidate가 baseline보다 좋아졌다고 말하려면 무엇을 같은 짝으로 비교하나요?"
          idea={
            <p>
              같은 validation examples와 seeds에서 candidate와 baseline의 metric 차이를 먼저 만들고 그 차이를 평균냅니다.
            </p>
          }
          formula={String.raw`\overline\Delta_q=K^{-1}\sum_k(q_k^{\rm cand}-q_k^{\rm base})`}
          annotatedFormula={String.raw`\begin{aligned}\Delta_{q,k}&=\underbrace{q_k^{\rm cand}-q_k^{\rm base}}_{\substack{\text{같은 seed와 split에서}\\\text{candidate gain 계산}}}\\[4pt]\overline\Delta_q&=\underbrace{\frac1K\sum_{k=1}^{K}\Delta_{q,k}}_{\substack{\text{paired gains를 평균내}\\\text{run noise를 분리}}}\\[4pt]\operatorname{release}&=\underbrace{\mathbf1[\overline\Delta_q>0]}_{\text{quality 개선 확인}}\underbrace{\mathbf1[L_{95}\le B_L]}_{\text{latency budget 확인}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`q_k^{\rm cand}-q_k^{\rm base}`,
              annotation: [
                "같은 seed 결과를 빼",
                "candidate의 paired gain을 구함",
              ],
            },
            {
              expression: String.raw`K^{-1}\sum_k\Delta_{q,k}`,
              annotation: ["seed별 차이를 합산·평균해", "비교 noise를 줄임"],
            },
            {
              expression: String.raw`\mathbf1[\overline\Delta_q>0]`,
              annotation: [
                "quality gain의 부호를 검사해",
                "개선 없는 후보를 차단",
              ],
            },
            {
              expression: String.raw`\mathbf1[L_{95}\le B_L]`,
              annotation: [
                "p95 latency를 한도와 비교해",
                "배포 불가능 후보를 차단",
              ],
            },
          ]}
          terms={[
            {
              symbol: "K",
              name: "Paired runs",
              description: "같은 seed 목록으로 실행한 비교 쌍의 수입니다.",
            },
            {
              symbol: "q",
              name: "Quality metric",
              description: "사전에 고정한 macro recall·NLL 등 품질 지표입니다.",
            },
            {
              symbol: String.raw`L_{95}`,
              name: "P95 latency",
              description:
                "Target runtime에서 측정한 95번째 백분위 응답 시간입니다.",
            },
            {
              symbol: String.raw`B_L`,
              name: "Latency budget",
              description: "배포 전에 고정한 허용 latency 상한입니다.",
            },
          ]}
          assumptions={[
            "두 run은 split·input transform·seed·search budget이 같습니다.",
            "Quality metric의 방향과 denominator를 receipt에 고정합니다.",
            "Latency는 같은 hardware·batch·warmup·concurrency 조건에서 측정합니다.",
          ]}
          interpretation="Candidate recall이 올라도 p95 한도를 넘으면 release하지 않습니다. Baseline receipt는 이 판단의 좌우 항이 같은 실험임을 보장합니다."
        />
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Split과 receipt를 재생할 수 있어야 backbone 실험으로 넘어갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Release gate는 group overlap 0, missing source lineage 0, class
            mapping parity, preprocessing replay parity를 검사합니다. 같은
            checkpoint를 다시 불러 raw logits와 metric denominator가
            일치하는지도 확인합니다. 실패하면 model tuning을 계속하지 않고 data
            generation부터 되돌립니다.
          </p>
        </div>
        <div id="paper-group-kfold" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="scikit-learn — GroupKFold"
            href="https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Related samples가 train과 validation
                fold를 함께 건너는 leakage를 막아야 합니다.
              </p>
              <p>
                <strong>기여.</strong> Non-overlapping group을 fold 단위로
                배정하는 splitter contract를 제공합니다.
              </p>
              <p>
                <strong>가정.</strong> Caller가 각 sample의 올바른 group ID를
                이미 제공합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Group-aware cross-validation API와
                non-overlap semantics 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> GroupKFold가 identity key를
                발견하거나 time·site shift를 자동으로 모사한다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <div id="paper-ml-checklist" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Pineau et al. — Improving Reproducibility in Machine Learning Research"
            href="https://www.jmlr.org/papers/v22/20-303.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Data·code·hyperparameter·result reporting
                누락이 ML 결과 재현을 어렵게 합니다.
              </p>
              <p>
                <strong>기여.</strong> 연구 제출과 코드 공개에서 확인할
                reproducibility checklist와 관찰을 제시합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 conference process와 empirical
                survey 범위를 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 재현 가능한 artifact와 reporting
                practice의 근거로 사용합니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> Checklist를 채웠다는 사실만으로
                scientific claim이나 production parity가 증명되지는 않습니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
