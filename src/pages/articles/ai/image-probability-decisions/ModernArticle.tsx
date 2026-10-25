import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ImageClassificationPathLocator, {
  ImageClassificationMapReturn,
} from "../image-classification-pipeline/ImageClassificationPathLocator";
import {
  DecisionDefinitionViz,
  ProbabilityDecisionTraceViz,
} from "./viz/ProbabilityDecisionTraceViz";

function CalibrationCandidateLedger() {
  const examples = [
    ["cal-01", "(4, 2, 0)", "신발"],
    ["cal-02", "(3, 2, 1)", "가방"],
    ["cal-03", "(2, 1, 0)", "가방"],
    ["cal-04", "(3, 0, 0)", "신발"],
  ] as const;
  const rows = [
    {
      temperature: "T=1.0",
      nll: ".763",
      meaning: "원래 logit 간격을 그대로 사용합니다.",
    },
    {
      temperature: "T=1.5",
      nll: ".753",
      meaning: "세 후보 중 설명용 보정 집합의 평균 NLL이 가장 작습니다.",
    },
    {
      temperature: "T=2.0",
      nll: ".784",
      meaning: "분포를 더 평평하게 만들지만 이 집합에서는 NLL이 다시 커집니다.",
    },
  ] as const;

  return (
    <div
      className="not-prose my-8 border-y border-border"
      aria-label="설명용 보정 집합에서 temperature 후보의 평균 NLL을 비교하는 표"
    >
      <p className="py-3 text-xs font-bold text-primary">
        설명용 보정 집합 · 후보 하나씩 비교
      </p>
      <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
        {examples.map(([id, logits, answer]) => (
          <div key={id} className="min-w-0 bg-background px-3 py-3">
            <strong className="block font-mono text-[10px] text-primary">{id}</strong>
            <code className="mt-1 block break-words text-[10px]">z={logits}</code>
            <span className="mt-1 block text-[10px] text-muted-foreground">
              정답 · {answer}
            </span>
          </div>
        ))}
      </div>
      <div className="divide-y divide-border">
        {rows.map((row, index) => (
          <div
            key={row.temperature}
            className="grid gap-2 py-4 sm:grid-cols-[2rem_6rem_5rem_minmax(0,1fr)] sm:items-start"
          >
            <span className="font-mono text-xs font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="font-mono text-sm">{row.temperature}</strong>
            <code className="text-xs leading-5">NLL {row.nll}</code>
            <p className="break-keep text-xs leading-5 text-muted-foreground">
              {row.meaning}
            </p>
          </div>
        ))}
      </div>
      <p className="border-t border-border py-3 text-xs leading-5 text-muted-foreground">
        이 수치는 네 개 표본으로 만든 설명용 계산입니다. 논문의 실험 결과나 실제
        서비스 측정값이 아닙니다.
      </p>
    </div>
  );
}

function AggregationLedger() {
  const rows = [
    {
      label: "model A · TTA",
      arithmetic: "(.750 + .700) ÷ 2 = .725",
      meaning: "같은 model의 원본 view와 좌우 반전 view를 먼저 평균합니다.",
    },
    {
      label: "model B",
      arithmetic: "신발 probability = .620",
      meaning: "같은 class 순서와 보정 정의를 가진 두 번째 model 출력입니다.",
    },
    {
      label: "model 결합",
      arithmetic: ".7 × .725 + .3 × .620 = .6935",
      meaning: "selection 자료에서 고정한 weight로 같은 class끼리 합칩니다.",
    },
    {
      label: "표시 정밀도",
      arithmetic: ".6935 → .694",
      meaning: "화면에는 반올림해도 판정은 반올림 전 값으로 수행합니다.",
    },
  ] as const;

  return (
    <div
      className="not-prose my-8 border-y border-border"
      aria-label="TTA probability와 두 model의 신발 probability를 결합하는 계산"
    >
      <p className="py-3 text-xs font-bold text-primary">
        pred-184 · 신발 probability 결합
      </p>
      <ol className="divide-y divide-border">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className="grid gap-2 py-4 sm:grid-cols-[2rem_8rem_14rem_minmax(0,1fr)] sm:items-start"
          >
            <span className="font-mono text-xs font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="break-keep text-sm">{row.label}</strong>
            <code className="break-words text-xs leading-5">{row.arithmetic}</code>
            <p className="break-keep text-xs leading-5 text-muted-foreground">
              {row.meaning}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ImageProbabilityDecisionsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <ImageClassificationPathLocator current="probability-action" />
        <h2 className="mb-6 text-2xl font-bold">점수에서 행동까지</h2>
        <ProbabilityDecisionTraceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              가장 큰 logit이 곧 실제 확률이나 자동 처리 명령이 되는 것은 아닙니다.
            </strong>{" "}
            이 글은 예측 <code>pred-184</code> 하나를 따라갑니다. model이 내놓은
            점수 <code>(4, 2, 0)</code>을 보정하고, 여러 view와 model의 출력을
            결합한 뒤, 신발 자동 분류 기준과 비교합니다.
          </p>
          <p>
            최종 top class는 끝까지 신발이지만 업무 행동은 ‘검토 대기’입니다.
            보정 뒤 결합한 신발 확률 <code>.6935</code>가 자동 분류 기준{" "}
            <code>.700</code>보다 작기 때문입니다. 이 차이를 보존해야 model 품질과
            업무 정책을 따로 바꿀 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="서로 다른 세 결과"
          items={[
            {
              term: "Logit",
              description:
                "model head가 class마다 내놓은 raw score입니다. 크기 순서는 prediction을 만들지만 확률의 빈도 의미는 보장하지 않습니다.",
            },
            {
              term: "보정 확률",
              description:
                "비슷한 confidence를 보고한 표본 집단의 실제 정답 빈도와 맞도록 눈금을 조정한 값입니다.",
            },
            {
              term: "Top class",
              description:
                "결합 확률이 가장 큰 class입니다. 자동 처리 여부와는 별개입니다.",
            },
            {
              term: "업무 행동",
              description:
                "threshold나 reject 규칙을 적용해 자동 분류·검토 대기처럼 실제 처리 상태를 정한 결과입니다.",
            },
          ]}
        />
        <ContentBoundary article="image-probability-decisions" />
      </section>

      <section id="temperature" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">온도 선택</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>pred-184</code> 한 건만 보고 temperature를 고르면 그 예측의
            confidence를 원하는 숫자로 바꾸는 데 그칩니다. Temperature는 정답을
            알고 있지만 model weight 학습에는 쓰지 않은 보정 집합 전체에서
            고릅니다. 각 후보의 negative log-likelihood를 계산하고 평균이 가장
            작은 값을 선택합니다.
          </p>
        </div>
        <CalibrationCandidateLedger />
        <ExplainedFormula
          question="보정 집합에서 고른 temperature는 pred-184의 probability를 어떻게 바꿉니까?"
          idea={
            <p>
              모든 class logit을 같은 양수로 나눈 뒤 softmax합니다. 양수로 같은
              비율만큼 나누므로 class 순서는 유지됩니다.
            </p>
          }
          formula={String.raw`p_T(c\mid x)=\frac{e^{z_c/T}}{\sum_j e^{z_j/T}}`}
          annotatedFormula={String.raw`\begin{aligned}T^*&=\underbrace{\arg\min_{T>0}\frac1N\sum_{i=1}^{N}-\log p_T(y_i\mid x_i)}_{\substack{\text{보정 집합의 평균 NLL이}\\\text{가장 작은 양수 T 선택}}}\\[4pt]\widetilde z_c&=\underbrace{z_c/T^*}_{\substack{\text{모든 class 점수를}\\\text{같은 양수로 나눔}}}\\[4pt]p_T(c\mid x)&=\underbrace{\frac{e^{\widetilde z_c}}{\sum_j e^{\widetilde z_j}}}_{\substack{\text{양의 질량을 전체 합으로 나눠}\\\text{합이 1인 vector 생성}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`-\log p_T(y_i\mid x_i)`,
              annotation: [
                "보정 표본의 정답 class probability를 읽어",
                "확신하며 틀린 예측에 큰 비용을 줌",
              ],
            },
            {
              expression: String.raw`\arg\min_{T>0}`,
              annotation: [
                "양수 temperature 후보의 평균 비용을 비교해",
                "가장 작은 후보를 고름",
              ],
            },
            {
              expression: String.raw`z_c/T^*`,
              annotation: [
                "모든 class 점수를 같은 값으로 나눠",
                "순서는 유지하고 간격을 조절함",
              ],
            },
            {
              expression: String.raw`e^{\widetilde z_c}/\sum_j e^{\widetilde z_j}`,
              annotation: [
                "class별 질량을 전체 질량으로 나눠",
                "합이 1인 probability vector를 만듦",
              ],
            },
          ]}
          terms={[
            {
              symbol: "z_c",
              name: "Class logit",
              description: "model이 class c에 부여한 raw score입니다.",
            },
            {
              symbol: "T",
              name: "Temperature",
              description: "모든 class logit에 공통으로 적용하는 양수입니다.",
            },
            {
              symbol: "N",
              name: "보정 표본 수",
              description: "temperature 후보를 비교하는 보정 집합의 크기입니다.",
            },
            {
              symbol: String.raw`p_T`,
              name: "보정 뒤 출력",
              description: "선택한 temperature를 적용한 class probability vector입니다.",
            },
          ]}
          assumptions={[
            "Base model의 weight와 logit은 고정합니다.",
            "하나의 scalar temperature를 모든 class와 표본에 공유합니다.",
            "보정 집합과 배포 입력의 분포 관계가 달라지면 calibration도 달라질 수 있습니다.",
          ]}
          interpretation="설명용 집합에서는 T=1.5를 고릅니다. pred-184의 logits (4,2,0)은 (2.667,1.333,0)이 되고, softmax probability는 약 (.750,.198,.052)입니다."
        />
        <div id="paper-calibration" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Guo et al. — On Calibration of Modern Neural Networks"
            href="https://proceedings.mlr.press/v70/guo17a.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>질문.</strong> Classifier confidence가 실제 correctness
                likelihood와 어긋나는 문제를 어떻게 측정하고 줄입니까?
              </p>
              <p>
                <strong>방법.</strong> 여러 post-hoc calibration 방법을 비교하고,
                하나의 scalar temperature로 logits를 조정하는 방법을 평가합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 논문이 사용한 image·document dataset,
                architecture와 held-out validation 조건입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 하나의 temperature가 모든 class,
                distribution shift와 업무 비용을 해결한다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="aggregation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">확률 결합</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Test-time augmentation(TTA)은 같은 이미지의 의미를 보존하는 view를
            여러 번 평가하는 방법입니다. 먼저 한 model 안에서 같은 class의
            probability를 평균하고, 그다음 같은 class 순서를 쓰는 model끼리
            결합합니다. Logit 평균과 probability 평균은 일반적으로 같지 않으므로
            어느 값을 합쳤는지 판정 정의에 남겨야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="두 TTA view와 두 model의 같은 class probability를 어떤 순서로 합칩니까?"
          idea={
            <p>
              model별 TTA 평균을 먼저 만든 뒤, 합이 1인 model weight로 다시
              결합합니다.
            </p>
          }
          formula={String.raw`v_{m,c}=\frac1A\sum_a p_{m,c}(t_a(x)),\qquad \bar p_c=\sum_mw_mv_{m,c}`}
          annotatedFormula={String.raw`\begin{aligned}v_{m,c}&=\underbrace{\frac1A\sum_{a=1}^{A}p_{m,c}(t_a(x))}_{\substack{\text{한 model의 같은 class를}\\\text{valid TTA views에서 평균}}}\\[4pt]\bar p_c&=\underbrace{\sum_{m=1}^{M}w_mv_{m,c}}_{\substack{\text{같은 class를 뜻하는 model 출력을}\\\text{고정 weight로 결합}}}\\[4pt]\sum_mw_m&=\underbrace{1}_{\text{결합 probability의 눈금 유지}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`A^{-1}\sum_ap_{m,c}(t_a(x))`,
              annotation: [
                "한 model의 같은 class probability를 더해",
                "TTA view 수로 나눔",
              ],
            },
            {
              expression: String.raw`w_mv_{m,c}`,
              annotation: [
                "각 model의 TTA 평균에 고정 weight를 곱해",
                "model별 기여를 정함",
              ],
            },
            {
              expression: String.raw`\sum_mw_mv_{m,c}`,
              annotation: [
                "같은 class index의 weighted output을 더해",
                "최종 probability를 만듦",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`t_a`,
              name: "TTA transform",
              description: "class 의미를 보존한다고 확인한 a번째 입력 변형입니다.",
            },
            {
              symbol: "A",
              name: "TTA view 수",
              description: "한 model이 평가한 입력 view의 개수입니다.",
            },
            {
              symbol: String.raw`w_m`,
              name: "Model weight",
              description: "m번째 model의 보정 출력에 주는 비음수 비중입니다.",
            },
            {
              symbol: String.raw`\bar p_c`,
              name: "결합 probability",
              description: "TTA와 model 결합을 마친 class c의 값입니다.",
            },
          ]}
          assumptions={[
            "모든 model이 같은 class 순서와 class 의미를 사용합니다.",
            "각 출력은 결합 전에 정한 calibration 절차를 거쳤습니다.",
            "TTA가 이미지의 class 의미를 바꾸지 않는다고 확인했습니다.",
          ]}
          interpretation="pred-184의 model A TTA 평균은 (.750+.700)/2=.725입니다. model B가 .620이고 weights가 (.7,.3)이면 최종 신발 probability는 .6935입니다."
        />
        <AggregationLedger />
      </section>

      <section id="action" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">행동 결정</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Argmax는 가장 큰 class를 고르지만, 그 결과를 자동 처리해도 되는지는
            정하지 않습니다. <code>pred-184</code>의 top class는 신발이고 결합
            probability는 <code>.6935</code>입니다. 신발 자동 분류 기준이{" "}
            <code>.700</code>이면 이 예측은 신발로 자동 확정되지 않고 검토 대기로
            갑니다.
          </p>
          <p>
            Threshold는 calibration과 다른 질문에 답합니다. Calibration은
            confidence 눈금이 실제 정답 빈도와 맞는지를 다루고, threshold는
            precision·recall·오류 비용·처리 용량 가운데 무엇을 우선할지 정합니다.
            이 관계는{" "}
            <Link to="/cs/ai/imbalanced-data#thresholding">
              불균형 데이터의 threshold
            </Link>
            와{" "}
            <Link to="/cs/ai/classification-metrics">
              분류 metric
            </Link>
            에서 이어집니다.
          </p>
        </div>
        <DecisionDefinitionViz />
      </section>

      <section id="evidence-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">검증 자료 분리</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 validation 결과를 보면서 temperature, model weight, threshold를
            계속 바꾸면 마지막 test 결과가 어느 선택의 증거인지 알 수 없습니다.
            Model 학습 자료와 보정 자료를 나누고, 결합 weight와 threshold를 고르는
            자료도 기록한 뒤 untouched test는 마지막에 한 번 평가합니다. 이
            분리는{" "}
            <Link to="/cs/ai/train-validation-test#selection-feedback">
              학습·검증·시험 자료의 역할
            </Link>
            에서 더 자세히 설명합니다.
          </p>
          <p>
            실제 환경의 threshold, 검토 인력, latency 예산, 감시와 rollback은 이
            글만으로 정할 수 없습니다. 이 글이 확정한 것은 어떤 값이 어떤 순서로
            행동을 만들었는지 재현할 수 있어야 한다는 개념 경계입니다.
          </p>
        </div>
      </section>

      <section id="self-check" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">확인 질문</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>Temperature를 pred-184 한 건으로 고르면 안 되는 이유는 무엇입니까? (답: 온도 선택)</li>
            <li>Model A의 TTA 평균 .725는 어떻게 계산했습니까? (답: 확률 결합)</li>
            <li>Top class가 신발인데도 검토 대기로 간 이유는 무엇입니까? (답: 행동 결정)</li>
          </ol>
        </div>
        <ImageClassificationMapReturn current="probability-action" />
      </section>
    </div>
  );
}
