import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { SelectionProtocolViz } from "../evaluation-metrics/viz/ModernEvaluationViz";

export default function MetricSelectionProtocolArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Training loss와 최종 metric은 서로 다른 결정을 맡습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Surrogate loss</strong>는 gradient로 model parameters를
            학습하기 쉬운 대체 목표입니다. <strong>Selection metric</strong>은
            checkpoint와 configuration을 고릅니다.{" "}
            <strong>Decision policy</strong>는 threshold나 top-k를 정하고,{" "}
            <strong>outer test</strong>는 이 선택이 모두 끝난 procedure를
            마지막으로 평가합니다.
          </p>
          <p>
            NDCG·F1·처리 용량처럼 실제 목표가 미분 불가능하거나 batch 전체
            순서에 의존하면 training에서는 cross-entropy·pairwise loss 같은
            surrogate를 씁니다. Training loss가 계속 내려가도 validation
            metric이 멈출 수 있으므로 네 역할을 한 score로 섞지 않습니다.
          </p>
        </div>
        <TermBreakdown
          title="후보 하나가 release되기까지의 네 역할"
          items={[
            {
              term: "Fit",
              description:
                "Training data와 surrogate gradient로 model parameters θ를 학습합니다.",
              boundary:
                "Validation metric을 직접 미분하지 않는 경우가 많습니다.",
            },
            {
              term: "Select",
              description:
                "Validation/OOF에서 architecture·regularization·checkpoint λ를 고릅니다.",
              boundary:
                "반복해서 본 validation은 adaptive selection data입니다.",
            },
            {
              term: "Policy",
              description:
                "같은 selection boundary에서 calibrator·threshold·top-k τ를 고릅니다.",
              boundary: "Test에서 τ를 다시 맞추면 독립 평가가 사라집니다.",
            },
            {
              term: "Report",
              description:
                "모든 선택을 고정한 뒤 untouched outer data에서 procedure를 평가합니다.",
              boundary:
                "결과를 본 뒤 수정하면 새 outer evaluation이 필요합니다.",
            },
          ]}
        />
        <SelectionProtocolViz />
        <ContentBoundary article="metric-selection-protocol" />
      </section>

      <section id="information-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Data마다 바꿀 수 있는 값을 하나씩 제한합니다
        </h2>
        <ExplainedFormula
          question="Parameter 학습·configuration 선택·threshold 선택·최종 보고를 어떻게 분리하나요?"
          idea={
            <p>
              Train은 θ만 맞추고 validation은 λ와 τ를 선택합니다. Test는 이미
              완성된 θ, λ, τ를 다시 평가할 뿐 어떤 값도 고르지 않습니다.
            </p>
          }
          formula={String.raw`\hat\theta_\lambda=\arg\min_\theta L_{sur}(D_{tr};\theta,\lambda),\quad(\hat\lambda,\hat\tau)=\arg\min_{\lambda,\tau}M(D_{val};\hat\theta_\lambda,\tau),\quad R_{out}=M(D_{test};\hat\theta_{\hat\lambda},\hat\tau)`}
          annotatedFormula={String.raw`\begin{aligned}\widehat\theta_\lambda&=\underbrace{\arg\min_\theta L_{\rm sur}(D_{\rm train};\theta,\lambda)}_{\substack{\text{training data와 surrogate로}\\\text{model parameters만 학습}}}\\(\widehat\lambda,\widehat\tau)&=\underbrace{\arg\min_{\lambda,\tau}M(D_{\rm val};\widehat\theta_\lambda,\tau)}_{\substack{\text{validation에서 configuration과}\\\text{decision policy를 함께 선택}}}\\\widehat R_{\rm outer}&=\underbrace{M(D_{\rm test};\widehat\theta_{\widehat\lambda},\widehat\tau)}_{\substack{\text{고정된 전체 procedure를}\\\text{untouched data에서 한 번 평가}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\arg\min_\theta L_{\rm sur}(D_{\rm train})`,
              annotation: [
                "training examples의 differentiable loss를 줄여",
                "model parameters를 학습",
              ],
            },
            {
              expression: String.raw`\arg\min_{\lambda,\tau}M(D_{\rm val})`,
              annotation: [
                "validation candidates와 policies를 비교해",
                "configuration과 policy를 선택",
              ],
            },
            {
              expression: String.raw`M(D_{\rm test};\widehat\theta_{\widehat\lambda},\widehat\tau)`,
              annotation: [
                "이미 고정한 procedure를 untouched data에 적용해",
                "selection bias 밖의 final risk를 보고",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\theta`,
              name: "Model parameters",
              description: "Training gradient로 학습하는 weights입니다.",
            },
            {
              symbol: String.raw`\lambda`,
              name: "Configuration",
              description:
                "Architecture·regularization·checkpoint처럼 validation으로 고르는 값입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "Policy parameter",
              description: "Threshold·top-k·post-processing strength입니다.",
            },
            {
              symbol: "M",
              name: "Frozen evaluation function",
              description:
                "Reducer·slice·guardrail을 포함한 사전 정의 metric입니다.",
            },
          ]}
          assumptions={[
            "Train·validation·test의 entity/time 경계가 배포 문제에 맞습니다.",
            "Validation을 반복 사용한 모든 선택을 하나의 adaptive procedure로 봅니다.",
            "Test를 본 뒤 값을 바꾸지 않습니다.",
          ]}
          interpretation="Test F1을 보고 threshold를 다시 고르는 순간 Dtest는 validation 역할을 하게 됩니다. 수정된 procedure에는 새로운 outer data가 필요합니다."
        />
      </section>

      <section id="guardrails" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Hard guardrail을 먼저 통과시키고 primary metric을 비교합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여러 metrics를 임의의 weighted sum으로 합치면 치명적인 subgroup
            하락이 작은 평균 개선에 가려질 수 있습니다. 안전·공정성·latency처럼
            반드시 지킬 조건은 <strong>guardrail</strong>로 분리하고, 모두
            통과한 feasible candidates만 primary score 순위에 올립니다.
          </p>
        </div>
        <ExplainedFormula
          question="Primary score가 좋지만 latency 또는 worst-slice가 기준을 넘은 후보를 어떻게 제외하나요?"
          idea={
            <p>
              각 hard constraint를 통과한 후보들의 교집합을 feasible set으로
              만들고, 그 집합 안에서만 primary metric을 최적화합니다.
            </p>
          }
          formula={String.raw`\mathcal F=\{h:G_j(h)\le b_j\ \forall j\},\quad h^*=\arg\min_{h\in\mathcal F}M_{primary}(h)`}
          annotatedFormula={String.raw`\begin{aligned}g_j(h)&=\underbrace{\mathbf1[G_j(h)\le b_j]}_{\text{후보가 j번째 hard bound를 통과했는지 표시}}\\g_{\rm all}(h)&=\underbrace{\prod_jg_j(h)}_{\text{모든 guardrail 통과의 논리적 AND}}\\\mathcal F&=\underbrace{\{h:g_{\rm all}(h)=1\}}_{\text{비교가 허용된 feasible candidates}}\\h^*&=\underbrace{\arg\min_{h\in\mathcal F}M_{\rm primary}(h)}_{\substack{\text{통과 후보 안에서만}\\\text{primary metric 최적 선택}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[G_j(h)\le b_j]`,
              annotation: [
                "후보 metric을 사전 bound와 비교해",
                "한 guardrail의 pass/fail을 생성",
              ],
            },
            {
              expression: String.raw`\prod_jg_j(h)`,
              annotation: [
                "0/1 guardrail indicators를 곱해",
                "하나라도 실패하면 전체를 0으로 만듦",
              ],
            },
            {
              expression: String.raw`\arg\min_{h\in\mathcal F}M_{\rm primary}`,
              annotation: [
                "feasible set 밖 후보를 제외하고",
                "남은 후보의 primary metric만 비교",
              ],
            },
          ]}
          terms={[
            {
              symbol: "h",
              name: "Complete candidate",
              description:
                "Checkpoint·preprocessing·calibration·policy·serving config를 묶은 후보입니다.",
            },
            {
              symbol: String.raw`G_j`,
              name: "Guardrail metric",
              description:
                "Worst-slice error·latency·memory·coverage miss입니다.",
            },
            {
              symbol: String.raw`b_j`,
              name: "Hard bound",
              description: "Candidate 결과 전에 정한 허용 한도입니다.",
            },
            {
              symbol: String.raw`\mathcal F`,
              name: "Feasible set",
              description: "모든 hard guardrail을 통과한 후보 집합입니다.",
            },
          ]}
          assumptions={[
            "Metric 방향을 작은 값이 좋은 형태로 통일하거나 부등호를 명시합니다.",
            "Measurement noise용 tolerance·confidence rule·sample minimum을 정합니다.",
            "Feasible 후보가 없으면 bound를 몰래 완화하지 않고 reject 또는 redesign합니다.",
          ]}
          interpretation="전체 error가 1% 줄어도 worst-language recall이 .80 아래이거나 p95 latency가 100ms를 넘으면 해당 후보는 primary 순위에서 제외됩니다."
        />
      </section>

      <section id="receipt" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          최종 숫자가 아니라 selection procedure를 receipt로 남깁니다
        </h2>
        <TermBreakdown
          title="Metric selection receipt"
          items={[
            {
              term: "Data boundary",
              description:
                "Train·validation/OOF·outer test revision과 entity/time cutoff입니다.",
            },
            {
              term: "Candidate lineage",
              description:
                "Code·data·preprocessing·checkpoint·calibrator·threshold checksum입니다.",
            },
            {
              term: "Metric contract",
              description:
                "Positive/relevance 정의, reducer, weights, k, missing-label 처리입니다.",
            },
            {
              term: "Release rule",
              description:
                "Primary direction, guardrail bounds, tolerance, sample minimum과 rollback owner입니다.",
            },
          ]}
        />
        <div
          id="standard-selection-metrics"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            type="paper"
            citeKey={1}
            source="scikit-learn — Metrics and scoring"
            href="https://scikit-learn.org/stable/modules/model_evaluation.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Cross-validation에서 scorer
                방향·parameter·multi-metric 결과를 일관되게 사용해야 합니다.
              </p>
              <p>
                <strong>기여.</strong> Scoring parameter, callable scorer,
                negative-loss convention과 multi-metric evaluation을
                문서화합니다.
              </p>
              <p>
                <strong>가정.</strong> 현재 stable API와 설치 version의
                estimator·label semantics를 전제로 합니다.
              </p>
              <p>
                <strong>증거 범위.</strong> 공식 문서가 명시한 scorer와 metric
                API behavior입니다.
              </p>
              <p>
                <strong>말하지 않는 것.</strong> Library가 train/select/test
                경계나 조직의 guardrail을 자동으로 설계하지는 않습니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Data 역할의 바닥 개념은{" "}
          <Link to="/ai/train-validation-test">train·validation·test</Link>,
          search procedure는{" "}
          <Link to="/ai/hyperparameter-tuning">hyperparameter tuning</Link>에서
          이어집니다.
        </p>
      </section>
    </div>
  );
}
