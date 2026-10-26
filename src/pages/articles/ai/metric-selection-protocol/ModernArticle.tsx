import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import MetricSelectionProtocolViz from "./MetricSelectionProtocolViz";
import {
  MetricSelectionLocator,
  MetricSelectionReturn,
} from "../shared/MetricDecisionPathLocator";

export default function MetricSelectionProtocolArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <MetricSelectionLocator />
        <MetricSelectionProtocolViz />

        <h2 className="mb-6 text-2xl font-bold">
          학습 손실이 가장 낮은 후보가 출시 후보라는 뜻은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고객 문의의 긴급도를 분류하는 <code>release-27</code>을 만든다고
            하겠습니다. train-v12로 만든 학습 산출물(artifact) 후보 C17·C24·C29의 학습 손실은
            각각 0.38·0.31·0.28입니다.
            하지만 출시 질문은 “학습 자료를 얼마나 잘 맞췄는가”가 아니라 “놓치면
            위험한 문의를 충분히 잡으면서 정해진 응답 시간 안에 동작하는가”입니다.
          </p>
          <p>
            그래서 학습, 측정, 선택, 고정, 승인을 서로 다른 상태 전이로
            둡니다. 학습 자료는 가중치만 바꿉니다. 검증 자료는 학습 산출물과
            행동 기준, 실행 설정을 묶은 정책 후보를 같은 조건으로 측정합니다.
            안전·지연 기준을 모두 통과한 후보끼리만 비용을 비교합니다. 마지막 독립 최종 자료인
            <code>outer-v3</code>는 이미 고정된 정책을 승인하거나 거절할 뿐 다시 조정하지
            않습니다.
          </p>
          <p>
            이 글의 자료 이름, 후보 ID, 손실, 비용, recall과 latency는 모두 계산
            흐름을 설명하기 위한 가정입니다. 특정 서비스에서 측정한 결과가 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="출시 후보 하나를 만드는 다섯 단계"
          items={[
            {
              term: "학습",
              description: "train-v12와 미분 가능한 손실로 가중치 θ를 바꿉니다.",
              boundary: "학습 손실은 업무 비용·안전·지연을 혼자 증명하지 않습니다.",
            },
            {
              term: "측정",
              description: "validation-v7에서 학습 산출물과 행동 기준, 실행 설정을 묶은 정책 후보를 같은 조건으로 측정합니다.",
              boundary: "반복해서 본 검증 자료는 이미 선택에 사용된 자료입니다.",
            },
            {
              term: "선택",
              description: "안전과 지연 기준을 모두 통과한 정책 가운데 비용이 가장 낮은 하나를 고릅니다.",
              boundary: "결과를 본 뒤 기준을 낮추면 사전 규칙이 사라집니다.",
            },
            {
              term: "고정",
              description: "선택한 정책, 후보 집합과 최종 승인 규칙을 출시 결정 기록에 고정합니다.",
              boundary: "독립 최종 자료를 보기 전에 고정해야 합니다.",
            },
            {
              term: "승인",
              description: "고정된 release-27을 독립 최종 자료 outer-v3에서 한 번 승인하거나 거절합니다.",
              boundary: "결과를 보고 값을 바꾸거나 다음 정책을 다시 시험하려면 새 실험과 새 독립 최종 자료가 필요합니다.",
            },
          ]}
        />
        <ContentBoundary article="metric-selection-protocol" />
      </section>

      <section id="information-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          자료마다 바꿀 수 있는 값을 하나씩 제한합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            C17·C24·C29는 학습 단계가 만든 산출물 후보입니다. validation-v7에서는
            산출물만 고르지 않습니다. 행동 기준과 실행 설정까지 묶은 완전한 정책을
            서로 비교합니다.
          </p>
          <ul>
            <li>P17은 C17, 행동 기준 0.62, 단일 실행을 사용합니다.</li>
            <li>P24-H는 C24, 행동 기준 0.71, 단일 실행을 사용합니다.</li>
            <li>P24-L은 C24, 행동 기준 0.60, 단일 실행을 사용합니다.</li>
            <li>P29는 C29, 행동 기준 0.58, 3회 평균 실행을 사용합니다.</li>
          </ul>
          <p>
            이 네 정책은 결과를 보기 전에 <code>policy-grid-v4</code>로 고정한
            설명용 후보 집합입니다. P24-H의 1,000건당 비용 31도 검증 자료에서
            관찰한 값일 뿐입니다. 안전 기준 통과나 독립 자료의 최종 성능을 뜻하지
            않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="가중치 학습, 정책 선택, 최종 승인의 정보 경계를 어떻게 분리하나요?"
          idea={
            <p>
              Train은 산출물별 가중치를 만들고 validation은 산출물·행동 기준·실행
              설정을 묶은 정책 후보를 고릅니다. 독립 최종 자료는 고정된 선택
              결과를 그대로 실행해 보고만 합니다.
            </p>
          }
          formula={String.raw`\hat\theta_h=\arg\min_\theta L_{sur}(D_{train};\theta,h),\quad c=(h,\tau,s),\quad c^*=Select(D_{val};\{c\},\mathcal R),\quad R_{outer}=Evaluate(D_{outer};c^*,\mathcal A)`}
          annotatedFormula={String.raw`\begin{aligned}\widehat\theta_h&=\underbrace{\arg\min_\theta L_{sur}(D_{train};\theta,h)}_{\substack{\text{train에서 산출물 후보 h의}\\\text{가중치만 학습}}}\\c&=\underbrace{(h,\tau,s)}_{\substack{\text{산출물·행동 기준·실행 설정을}\\\text{하나의 정책으로 결합}}}\\c^*&=\underbrace{Select(D_{val};\{c\},\mathcal R)}_{\substack{\text{validation에서 사전 선택 규칙 R로}\\\text{완전한 정책 하나를 선택}}}\\R_{outer}&=\underbrace{Evaluate(D_{outer};c^*,\mathcal A)}_{\substack{\text{고정 정책을 독립 자료에서}\\\text{사전 승인 규칙 A로 판정}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\arg\min_\theta L_{sur}(D_{train};\theta,h)`,
              annotation: [
                "학습 자료의 미분 가능한 손실을 줄여",
                "각 후보의 가중치를 만듦",
              ],
            },
            {
              expression: String.raw`c=(h,\tau,s)`,
              annotation: [
                "학습 산출물과 행동 기준, 실행 설정을 결합해",
                "평가할 완전한 정책 후보를 만듦",
              ],
            },
            {
              expression: String.raw`Select(D_{val};\{c\},\mathcal R)`,
              annotation: [
                "검증 자료에서 선택 기준을 적용해",
                "출시할 한 절차를 고름",
              ],
            },
            {
              expression: String.raw`Evaluate(D_{outer};c^*,\mathcal A)`,
              annotation: [
                "고정된 정책을 독립 자료에 그대로 적용해",
                "사전 승인 규칙으로 출시 여부를 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\theta`,
              name: "가중치",
              description: "학습 gradient로 바뀌는 model parameters입니다.",
            },
            {
              symbol: "h",
              name: "학습 산출물 후보",
              description: "학습 중 저장한 가중치와 그 설정을 가리킵니다.",
            },
            {
              symbol: "c",
              name: "정책 후보",
              description: "학습 산출물 h, 행동 기준 τ와 실행 설정 s를 함께 고정한 정책입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "행동 기준",
              description: "긴급 문의로 분류하는 행동을 시작할 점수 경계입니다.",
            },
            {
              symbol: "s",
              name: "실행 설정",
              description: "단일 실행·3회 평균처럼 비용과 지연을 바꾸는 추론 절차입니다.",
            },
            {
              symbol: String.raw`\mathcal R`,
              name: "선택 규칙",
              description: "검증 자료에서 적용할 주 지표, 기준, 집계와 동점 처리 계약입니다.",
            },
            {
              symbol: String.raw`\mathcal A`,
              name: "최종 승인 규칙",
              description: "독립 최종 자료에서 고정 정책을 승인하거나 거절하는 사전 계약입니다.",
            },
          ]}
          assumptions={[
            "Train·validation·outer의 사용자·시간 경계가 실제 배포 문제와 맞습니다.",
            "Validation을 보며 바꾼 전처리·학습 산출물·보정기·행동 기준·실행 설정을 모두 선택 절차에 포함합니다.",
            "outer-v3 결과를 본 뒤 release-27의 값을 바꾸지 않습니다.",
          ]}
          interpretation="outer-v3의 recall을 보고 행동 기준 0.62를 다시 맞추는 순간 outer-v3도 validation 역할을 하게 됩니다. 바뀐 정책에는 새 독립 최종 자료가 필요합니다."
        />

        <div className="not-prose mt-8 border-y border-border py-5">
          <p className="text-[10px] font-bold text-primary">한 후보를 끝까지 추적하기</p>
          <p className="mt-2 break-keep text-sm leading-7 text-muted-foreground">
            C17은 train-v12에서 손실 0.38로 생성됩니다. C17·행동 기준 0.62·단일
            실행을 묶은 P17은 validation-v7에서 비용 38, 최저 집단 recall 0.86,
            p95 92ms를 기록해 두 선택 기준을 통과합니다. 그 뒤에야 release-27로
            고정되며 어느 단계에서도 outer-v3를 정책 선택에 쓰지 않습니다.
          </p>
        </div>
      </section>

      <section id="guardrails" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          주 지표보다 먼저 반드시 지킬 기준을 적용합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            P24-H는 비용 31로 가장 낮지만 최저 집단 recall이 0.74라서 사전 하한
            0.80을 넘지 못합니다. P29는 recall 0.83이지만 p95 121ms로 100ms
            상한을 넘습니다. 3회 평균 실행으로 정확도를 높이는 대신 지연이
            길어진 경우입니다.
          </p>
          <p>
            P17은 비용 38, recall 0.86, p95 92ms입니다. P24-L은 같은 C24에 더
            낮은 행동 기준을 적용해 비용 42, recall 0.81, p95 91ms를 기록합니다.
            두 정책만 필수 기준을 통과합니다.
          </p>
          <p>
            이제 통과한 정책끼리 비용을 비교합니다. 38이 42보다 낮으므로 P17을
            선택합니다. 이 순서 때문에 비용 31인 P24-H가 다시 후보로 들어오지
            못합니다.
          </p>
          <p>
            이 규칙은 여러 수치를 임의의 가중합으로 뭉개지 않습니다. 평균 비용의
            작은 개선이 특정 집단의 큰 하락을 상쇄할 수 없게 먼저 통과 여부를
            결정합니다. 측정 잡음이 크다면 반복 횟수, 표본 최솟값, 허용 오차와
            불확실할 때의 보류 규칙도 결과를 보기 전에 정해야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="비용이 가장 낮아도 안전 또는 지연 기준을 어긴 후보를 어떻게 제외하나요?"
          idea={
            <p>
              모든 hard bound를 통과한 후보의 교집합을 먼저 만들고, 그 안에서만
              주 지표를 비교합니다.
            </p>
          }
          formula={String.raw`\mathcal F=\{c:Recall_{worst}(c)\ge.80\ \land\ p95(c)\le100ms\},\quad c^*=\arg\min_{c\in\mathcal F}Cost(c)`}
          annotatedFormula={String.raw`\begin{aligned}g_{safe}(c)&=\underbrace{\mathbf1[Recall_{worst}(c)\ge.80]}_{\text{가장 약한 집단의 안전 하한 검사}}\\g_{latency}(c)&=\underbrace{\mathbf1[p95(c)\le100ms]}_{\text{응답 지연 상한 검사}}\\\mathcal F&=\underbrace{\{c:g_{safe}(c)g_{latency}(c)=1\}}_{\text{두 기준을 모두 통과한 후보 집합}}\\c^*&=\underbrace{\arg\min_{c\in\mathcal F}Cost(c)}_{\text{통과 후보 안에서만 비용 비교}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[Recall_{worst}\ge.80]`,
              annotation: [
                "가장 낮은 집단 recall을 사전 하한과 비교해",
                "안전 통과 여부를 만듦",
              ],
            },
            {
              expression: String.raw`\mathbf1[p95\le100ms]`,
              annotation: [
                "긴 꼬리 지연을 사전 상한과 비교해",
                "응답 시간 통과 여부를 만듦",
              ],
            },
            {
              expression: String.raw`g_{safe}g_{latency}`,
              annotation: [
                "두 0·1 판정을 곱해",
                "하나라도 실패한 후보를 제외",
              ],
            },
            {
              expression: String.raw`\arg\min_{c\in\mathcal F}Cost(c)`,
              annotation: [
                "통과한 후보 집합만 남긴 뒤",
                "그 안에서 업무 비용을 최소화",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathcal F`,
              name: "통과 후보 집합",
              description: "모든 선택 기준을 만족해 비교가 허용된 정책들입니다.",
            },
            {
              symbol: String.raw`Recall_{worst}`,
              name: "최저 집단 recall",
              description: "사전에 정한 집단들 가운데 가장 낮은 recall입니다.",
            },
            {
              symbol: "p95",
              name: "95백분위 지연",
              description: "요청 95%가 이 시간 안에 끝나는 지연 경계입니다.",
            },
            {
              symbol: "Cost",
              name: "주 지표",
              description: "놓침과 잘못된 경보에 비용을 붙인 1,000건당 값입니다.",
            },
          ]}
          assumptions={[
            "Recall과 latency의 방향, 표본 집단과 측정 환경을 결과 전에 고정합니다.",
            "모든 후보를 같은 validation-v7과 같은 serving 조건에서 비교합니다.",
            "통과 후보가 없으면 기준을 몰래 낮추지 않고 보류하거나 새 후보를 만듭니다.",
          ]}
          interpretation="P24-H는 비용 31이어도 recall 0.74라 탈락하고 P29는 p95 121ms라 탈락합니다. 통과한 P17과 P24-L 가운데 비용 38인 P17이 비용 42인 P24-L보다 낮으므로 P17을 선택합니다."
        />
      </section>

      <section id="receipt" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          숫자 하나가 아니라 선택 절차 전체를 고정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            출시 결정 기록은 “비용 38”만 남기지 않습니다. 어떤 자료에서 어떤
            학습 산출물과 행동 기준, 실행 설정을 어떻게 묶었는지, 놓침과 잘못된 경보를 어떤 비용으로
            계산했는지, 어느 집단과 실행 환경에서 지연을 쟀는지, 최종 승인 책임자가
            누구인지까지 함께 남깁니다.
          </p>
          <pre><code>{`# 이 출시 판단을 다시 찾을 식별자
release_id: release-27

# 검증 결과를 보기 전에 고정한 후보 집합
candidate_set_revision: policy-grid-v4
# 후보 집합에 포함된 정책 식별자
candidate_policy_ids: [P17, P24-H, P24-L, P29]

# 검증 자료에서 선택한 완전한 정책
policy_id: P17
# 정책이 가리키는 학습 산출물 후보
artifact_candidate: C17
# 실제 산출물 바이트의 식별값
artifact_digest: sha256:3fd...

# 검증 자료에서 고정한 행동 기준
threshold: 0.62
# 지연과 비용 계산에 포함되는 실행 설정
serving_strategy: single_pass

# 가중치 학습에 사용한 자료
train_revision: train-v12
# 정책 선택에 사용한 자료
validation_revision: validation-v7
# 고정 정책 판정에 사용할 독립 자료, 결과 미열람
outer_revision: outer-v3

# 업무 비용과 집단·실행 환경을 정의한 평가 계약
metric_contract:
  # 1,000건당 기대 업무 비용을 최소화
  primary: expected_cost_per_1000
  # 긴급 문의 한 건을 놓친 비용
  fn_cost: 2
  # 일반 문의를 긴급으로 잘못 분류한 비용
  fp_cost: 0.1
  # 집계와 재표집의 독립 단위
  evaluation_unit: customer_case
  # 최저 집단 recall을 계산할 집단 키
  slice_key: language
  # 지연을 재는 고정 실행 환경
  serving_profile: cpu-profile-a
  # 고객 사례 하나가 만드는 추론 요청 수
  requests_per_case: 1

# 검증 자료에서 정책 후보를 거르는 선택 기준
selection_guardrails:
  # 최저 집단 recall 하한
  worst_slice_recall_min: 0.80
  # 95백분위 지연 상한
  p95_latency_ms_max: 100

# 독립 최종 자료에서 고정 정책을 승인하는 규칙
outer_approval:
  # 신뢰구간을 계산할 신뢰 수준
  confidence_level: 0.95
  # 독립 평가를 끝낼 고정 고객 사례 수
  evaluation_case_target: 200000
  # 언어 집단별 positive 표본 최솟값
  positive_per_slice_min: 5000
  # 1,000건당 비용 신뢰구간 상한의 허용값
  cost_interval_upper_max: 45
  # 최저 집단 recall 신뢰구간 하한의 허용값
  recall_interval_lower_min: 0.80
  # 지연 측정을 끝낼 고정 요청 수
  latency_request_target: 200000
  # p95 지연 신뢰구간 상한의 허용값
  p95_latency_interval_upper_ms_max: 100
  # recall 구간 계산법
  recall_interval_method: wilson
  # 비용 구간 계산법과 재표집 단위
  cost_interval_method: bootstrap
  cost_bootstrap_unit: customer_case
  # 지연은 같은 환경을 다섯 번 독립 실행해 실행 간 변동도 포함
  latency_interval_method: hierarchical_bootstrap
  latency_profile_runs: 5
  latency_requests_per_run: 40000
  # 먼저 실행을 뽑고, 선택된 실행 안에서 고객 사례를 다시 뽑음
  latency_bootstrap_units: [profile_run, customer_case]
  # bootstrap 재표집 횟수
  bootstrap_resamples: 2000
  # 같은 구간을 재현할 난수 seed
  bootstrap_seed: 27
  # 최소 표본을 못 채웠을 때의 상태
  insufficient_evidence_status: hold
  # 고정 표본 수에 도달하기 전에 결과를 열지 않는 중단 규칙
  stop_rule: fixed_target_no_peeking
  # 거절된 뒤 같은 독립 자료의 재사용 여부
  reuse_after_rejection: forbidden

# 최종 출시 승인 책임자
approval_owner: model-platform

# 독립 평가 뒤 덧붙이는 읽기 전용 결과 문서
outer_result_ref: outer-report-v3`}</code></pre>
          <p>
            독립 최종 자료 outer-v3는 서로 다른 고객 사례 200,000건으로 고정합니다.
            네 언어 집단에는 positive가 각각 5,000건 이상 있어야 합니다. 이 조건은
            결과를 보기 전에 정합니다.
          </p>
          <p>
            전체 1,000건으로 정규화한 혼동행렬을 TP 102, FN 18, FP 50, TN 830이라고
            놓겠습니다. 전체 recall은 102÷120=0.85입니다. 실제 20만 건에서는
            positive가 24,000건이므로 네 집단의 최소 5,000건을 채우고도 여유가
            있습니다. 놓침 비용을 2, 잘못된 경보 비용을 0.1로 두면 업무 비용은
            18×2+50×0.1=41입니다.
          </p>
          <p>
            가장 약한 언어 집단은 positive 5,000건 중 4,100건을 잡아 recall이
            0.82이고, 그 95% Wilson 하한은 0.809라고 놓습니다. 각 고객 사례가
            추론 요청 하나를 만듭니다. 비용은 고객 사례를 재표집해 상한 42.2를
            얻었다고 놓습니다. 지연은 같은 cpu-profile-a 환경을 다섯 번 독립
            실행하고 회차마다 40,000건을 측정합니다. 실행과 사례를 차례로
            재표집한 결과 p95 점추정은 96ms, 상한은 99ms라고 가정합니다. 세
            불리한 경계는 사전 허용값
            45, 0.80, 100ms를 모두 통과하므로 release-27을 승인합니다. 이 수치는
            실제 측정값이 아니라 계산을 설명하기 위한 가정입니다.
          </p>
          <p>
            전체 또는 집단별 최소 표본을 채우지 못하면 보류합니다. 하나라도 경계를
            실패하면 출시를 거절하고 새 실험과 새 독립 최종 자료를 마련합니다.
            결과를 보고 기준을 바꾸거나 다음 정책을 같은 outer-v3에서 다시 고르지
            않습니다.
          </p>
        </div>

        <ExplainedFormula
          question="점추정이 기준을 넘는지만 보지 않고 최종 승인을 어떻게 판정하나요?"
          idea={
            <p>
              나쁜 방향의 95% 신뢰구간 경계를 사용합니다. 비용과 지연은 상한이,
              recall은 하한이 사전 허용값을 통과해야 합니다.
            </p>
          }
          formula={String.raw`L_{recall}^{worst}=\min_g L_{recall,g},\quad Approve=\mathbf1[U_{cost}\le45]\,\mathbf1[L_{recall}^{worst}\ge.80]\,\mathbf1[U_{p95}\le100]`}
          annotatedFormula={String.raw`\begin{aligned}L_{recall}^{worst}&=\underbrace{\min_g L_{recall,g}=.809}_{\text{모든 언어 집단의 recall 하한 중 최솟값}}\\Approve&=\underbrace{\mathbf1[42.2\le45]}_{\text{비용 95\% 상한 통과}}\cdot\underbrace{\mathbf1[.809\ge.80]}_{\text{최저 recall 하한 통과}}\cdot\underbrace{\mathbf1[99\le100]}_{\text{p95 지연 95\% 상한 통과}}\\&=1\cdot1\cdot1=1\end{aligned}`}
          operations={[
            {
              expression: String.raw`U_{cost}=42.2\le45`,
              annotation: ["비용의 불리한 상한을 사용해", "비용 기준 통과 여부를 판정"],
            },
            {
              expression: String.raw`\min_g L_{recall,g}=.809\ge.80`,
              annotation: ["모든 언어 집단의 recall 하한 중 최솟값을 사용해", "안전 기준 통과 여부를 판정"],
            },
            {
              expression: String.raw`U_{p95}=99\le100`,
              annotation: ["p95 지연의 불리한 상한을 사용해", "지연 기준 통과 여부를 판정"],
            },
            {
              expression: String.raw`1\cdot1\cdot1=1`,
              annotation: ["세 판정을 모두 만족해야", "최종 승인 상태를 만듦"],
            },
          ]}
          terms={[
            { symbol: String.raw`U_{cost}`, name: "비용 상한", description: "1,000건당 업무 비용의 95% 신뢰구간 상한입니다." },
            { symbol: String.raw`L_{recall}^{worst}`, name: "최저 Recall 하한", description: "모든 언어 집단의 95% Wilson recall 하한 가운데 가장 작은 값입니다." },
            { symbol: String.raw`U_{p95}`, name: "지연 상한", description: "95백분위 지연의 bootstrap 95% 구간 상한입니다." },
          ]}
          assumptions={[
            "후보 집합과 정책 선택은 outer-v3를 보기 전에 끝났습니다.",
            "전체 200,000개 고객 사례와 각 언어 집단 positive 5,000건이라는 최소 표본 조건을 충족합니다.",
            "고객 사례 하나가 추론 요청 하나를 만듭니다. 비용은 고객 사례를, 지연은 다섯 profile run과 각 run의 고객 사례를 계층적으로 재표집합니다.",
            "재표집 횟수와 random seed는 outer 결과를 보기 전에 고정합니다.",
            "41·42.2·0.82·0.809·96·99는 흐름을 설명하기 위한 가정이며 실제 서비스 측정값이 아닙니다.",
          ]}
          interpretation="세 신뢰구간 경계 가운데 하나라도 실패하면 최종 상태는 거절입니다. 그 결과를 보고 P17을 조정하거나 다른 정책을 같은 outer-v3에서 선택하지 않습니다."
        />

        <TermBreakdown
          title="출시 결정 기록에 남길 네 묶음"
          items={[
            {
              term: "자료 경계",
              description: "Train·validation·outer revision과 사용자·시간 기준입니다.",
            },
            {
              term: "후보 계보",
              description: "Code·전처리·학습 산출물·보정기·행동 기준·실행 설정 식별값입니다.",
            },
            {
              term: "평가 계약",
              description: "Positive 정의, 비용, 집단, reducer와 측정 환경입니다.",
            },
            {
              term: "출시 규칙",
              description: "신뢰수준·최소 표본·신뢰구간 경계·보류 조건과 승인 주체입니다.",
            },
          ]}
        />

        <div id="standard-selection-metrics" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="scikit-learn 1.9.1 — Metrics and scoring"
            href="https://scikit-learn.org/1.9/modules/model_evaluation.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>확인한 범위.</strong> 여러 scorer를 동시에 계산하고 scorer의 방향과 parameter를 명시하는 공식 API를 확인했습니다.</p>
              <p><strong>이 글의 적용.</strong> 주 지표와 guardrail을 같은 후보 표에 기록하되, 어떤 하나의 가중합으로 자동 합치지 않습니다.</p>
              <p><strong>말하지 않는 것.</strong> 라이브러리가 조직의 출시 기준이나 outer 자료 경계를 대신 결정한다는 뜻은 아닙니다.</p>
            </div>
          </CitationBlock>
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Cawley & Talbot — On Over-fitting in Model Selection and Subsequent Selection Bias"
            href="https://www.jmlr.org/papers/volume11/cawley10a/cawley10a.pdf"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>확인한 범위.</strong> 유한한 자료의 선택 기준 자체도 반복 최적화하면 과적합될 수 있고, 같은 자료로 선택과 평가를 하면 낙관적 편향이 생길 수 있음을 분석합니다.</p>
              <p><strong>이 글의 적용.</strong> 학습 산출물·행동 기준·실행 설정을 고르는 validation-v7과 고정 정책을 판정하는 outer-v3를 분리합니다.</p>
              <p><strong>말하지 않는 것.</strong> 이 논문의 실험 크기가 release-27의 수치나 실제 개선 폭을 증명하는 것은 아닙니다.</p>
            </div>
          </CitationBlock>
        </div>

        <p className="prose prose-neutral max-w-none dark:prose-invert">
          자료 역할의 기초는{" "}
          <Link to="/cs/ai/train-validation-test">train·validation·test</Link>,
          후보 탐색 과정은{" "}
          <Link to="/cs/ai/hyperparameter-tuning">하이퍼파라미터 탐색</Link>에서
          이어집니다.
        </p>
        <MetricSelectionReturn />
      </section>
    </div>
  );
}
