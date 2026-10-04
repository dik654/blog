import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ExplainedFormula from "@/components/ui/explained-formula";
import AgentFailureModesAndRecoveryViz from "./agent-failure-modes-and-recovery/viz/AgentFailureModesAndRecoveryViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 응답을 못 받았다고 실행이 없었던 것은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청한 일이 끝나지 않은 것처럼 보이면 다시 실행하고 싶어집니다.
            그러나 응답만 잃어버렸고 실제 변경은 이미 일어났다면 재시도가 같은
            일을 한 번 더 만들 수 있습니다. 잘못된 목표를 계속 수행하는 경우에는
            횟수를 늘려도 해결되지 않습니다.
          </p>
          <p>
            실패 신호를 보고 원인을 구분한 뒤, 실제 상태를 확인하고 안전한 다음
            행동을 고릅니다. 이 글에서는 응답이 끊긴 청구 요청 한 건을 따라가며
            재시도·복구·담당자 인계의 기준을 설명합니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 감지하고 확인한 뒤 다시 할지 멈출지 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실행 중 이상을 감지하면 관련 요청과 마지막 결과를 보관합니다. 실제로
            어떤 변경이 일어났는지 확인하고 반복해도 효과가 늘지 않는지
            판단합니다. 확인이 끝나야 재시도하거나 복구하고 불확실하면 근거와
            함께 다른 담당자에게 넘깁니다.
          </p>
          <p>
            목표를 잘못 이해한 경우에는 요청 내용을 고쳐야 합니다. 통신만 끊긴
            경우에는 이미 실행됐는지 알아야 합니다. 같은 실패 메시지 뒤에도
            필요한 확인이 다르므로 결과를 한 종류로 합치지 않습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>이상 신호를 감지한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>요청과 실제 상태를 확인한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>안전한 복구 경로를 고른다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>결과 또는 미확인을 기록한다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 1만 원 청구 뒤 응답이 끊겼습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            주문 42번에 10,000원을 한 번 청구합니다. 같은 업무를 가리키는
            식별자는 pay-42이며 자동 재시도는 최대 2회입니다. 첫 요청은 서버에서
            처리됐지만 응답이 돌아오는 중 연결이 끊겼다고 합시다. 이 사례는
            가정입니다. (가정)
          </p>
          <p>
            원하는 최종 청구액은 10,000원입니다. 실행 여부를 모르고 새 요청으로
            다시 청구하면 20,000원이 될 수 있습니다. 첫 확인에서 기록이 안
            보이더라도 곧바로 미실행이라고 결론내릴 수 없습니다. 조회가 늦거나
            확인 경로가 장애일 수도 있기 때문입니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="inside-recovery"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 요청의 뜻과 실행 결과를 같이 보관합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            현재 기록에는 주문 42, 금액 10,000원, pay-42, 호출 시각, 응답 없음과
            남은 재시도 횟수가 필요합니다. 확인 담당자는 이 식별자로 기존 결과를
            조회합니다. 복구 담당자는 서비스가 같은 요청의 반복에 어떤 보장을
            주는지 확인합니다. (가정)
          </p>
          <p>
            외부 상태를 바꾸기 전에는 대상과 범위가 승인된 요청과 같은지도
            검사합니다. 중단 지점을 저장하면 나중에 이어받는 담당자가 이미
            일어났을 수 있는 변경을 처음부터 다시 실행하지 않게 됩니다.
          </p>
        </div>
      </section>

      <section id="why-recovery" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 잘못된 목적과 불확실한 결과는 복구법이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            주문 42의 청구를 마치라는 목표에서 벗어나 다른 주문까지 처리한다면
            목표가 잘못된 것입니다. 금액 상한을 잊었다면 앞서 확인한 제약을 다시
            읽어야 합니다. 잘못된 인자나 권한 거부를 같은 값으로 반복해도 문제가
            사라지지 않습니다.
          </p>
          <p>
            이와 달리 응답이 끊긴 사례는 실행 여부를 확인할 문제입니다. 확인되지
            않았다는 상태를 성공이나 실패 중 하나로 억지로 바꾸지 않습니다. 다음
            이름들은 이런 차이를 기록과 복구 절차에서 유지하기 위해 필요합니다.
          </p>
        </div>
      </section>

      <section
        id="failure-taxonomy"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <span id="problem" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          6. 실패의 모습과 복구 수단에 이름을 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실행의 실패 유형을 failure mode라고 부릅니다. 아래 분류는 운영에서
            관측할 수 있는 신호를 설명하기 위한 것이며 모든 연구가 동일한
            분류명을 쓰지는 않습니다. 신뢰도를 수치로 보고할 때도
            성공·실패·안전한 인계를 어떻게 셌는지 먼저 정해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Goal drift",
              description: "진행하면서 원래 목표 대신 다른 목표를 수행합니다.",
              boundary:
                "주문 42 한 건의 처리가 전체 주문 정리로 바뀌는 경우입니다.",
            },
            {
              term: "Context drift",
              description:
                "목표는 같지만 앞서 확인한 제약이나 근거를 잃습니다.",
              boundary: "청구 상한이나 읽기 전용 조건을 잊는 경우입니다.",
            },
            {
              term: "Tool misuse / invalid call",
              description: "잘못된 도구를 고르거나 인자 형식을 어깁니다.",
              boundary:
                "올바른 형식이어도 주문 24처럼 잘못된 대상을 넣을 수 있습니다.",
            },
            {
              term: "Hallucination",
              description: "확인하지 않은 결과나 근거를 사실처럼 만듭니다.",
              boundary:
                "조회 실패를 청구 취소 완료로 바꾸어 보고하면 안 됩니다.",
            },
            {
              term: "Premature termination",
              description: "정해 둔 완료 검사 전에 작업을 끝났다고 선언합니다.",
              boundary: "검사가 없거나 잘못 적용된 경우도 포함합니다.",
            },
            {
              term: "Idempotent action",
              description:
                "동일한 요청을 반복해도 의도한 효과가 한 번과 같습니다.",
              boundary:
                "요청 로그 횟수나 반환 응답까지 같아야 한다는 뜻은 아닙니다.",
            },
            {
              term: "Idempotency key",
              description:
                "서버가 동일한 업무 요청을 식별하도록 보내는 키입니다.",
              boundary:
                "서버 지원·보존 기간·파라미터 조건이 있어야 보장이 작동합니다.",
            },
            {
              term: "Retry loop",
              description:
                "실패 조건과 횟수 상한에 따라 실행을 다시 시도합니다.",
              boundary:
                "키가 존재한다는 사실만으로 재시도가 안전해지지 않습니다.",
            },
            {
              term: "Dry-run / confirmation gate",
              description:
                "변경 예상 결과를 확인하고 필요한 승인 조건을 검사합니다.",
              boundary:
                "예상 결과를 읽는 동안 실제 상태가 바뀔 수 있어 실행 전 조건도 확인합니다.",
            },
            {
              term: "Checkpoint / recovery strategy",
              description:
                "재개에 필요한 상태를 저장하고 확인된 실패에 맞는 복구 경로를 정합니다.",
              boundary: "내부 기록 복원만으로 외부 청구가 취소되지는 않습니다.",
            },
            {
              term: "Human-in-the-loop / escalation",
              description:
                "정해 둔 조건에서 사람이 검토하거나 다른 담당자가 이어받습니다.",
              boundary: "불확실한 외부 효과를 숨긴 채 완료로 넘기지 않습니다.",
            },
          ]}
        />
        <AgentFailureModesAndRecoveryViz />
      </section>

      <section
        id="retry-idempotent"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          7. 같은 pay-42의 실제 결과를 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 호출의 요청은 order=42, amount=10000, key=pay-42입니다. 응답
            없음은 outcome=unknown으로 기록합니다. 조회가 일시적으로 빈 결과를
            돌려줘도 원래 요청이 실행되지 않았다는 보장은 아직 없습니다. (가정)
          </p>
          <p>
            서비스가 같은 키와 같은 인자에 대한 중복 실행 방지를 보장하고 키가
            유효한 기간 안이라면 pay-42를 유지해 재요청할 수 있습니다. 첫 요청의
            처리 결과가 재사용되면 청구는 10,000원 한 번으로 남습니다. pay-43
            같은 새 키를 만들면 같은 업무라는 연결이 끊길 수 있습니다. (가정)
          </p>
          <p>
            그 보장을 확인할 수 없으면 추가 청구를 중단하고 실제 거래 상태를
            조회하거나 담당자에게 넘깁니다. 최대 2회라는 재시도 상한은 안전성을
            대신하지 않습니다. 안전 조건을 만족하는 요청에만 횟수 제한을
            적용합니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="recovery-checkpointing"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 서버의 반복 요청 계약을 그대로 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Stripe의 Idempotent requests 문서는 같은 키로 들어온 요청에 저장된
            상태 코드와 본문을 다시 돌려주는 방식을 설명합니다. 다음 원문은 그
            결과 재사용을 가리킵니다.
          </p>
        </div>
        <div id="paper-stripe-idempotency" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Stripe API — Idempotent requests, 2026-10-04 확인"
            citeKey={1}
            href="https://docs.stripe.com/api/idempotent_requests"
          >
            <q>regardless of whether it succeeds or fails</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              pay-42의 첫 실행 결과가 저장됐다면 같은 키 재요청은 그 결과를
              돌려받습니다. 다만 파라미터 검증 실패나 실행 전 동시 요청 충돌은
              결과를 저장하지 않는다고 문서는 구분합니다. 최소 24시간이 지난
              키는 정리할 수 있고 정리 후 같은 키는 새 요청으로 처리될 수
              있습니다. 같은 키에 다른 인자를 붙이는 것도 오류입니다. 이 보장은
              Stripe의 명시된 계약이며 모든 도구에 일반화하지 않습니다.
            </p>
          </div>
        </div>
        <AlgorithmBlock
          title="실행 결과가 불명확한 요청 복구 (의사코드)"
          input={[
            "원래 요청·업무 식별자·도구 계약·조회 결과",
            "남은 재시도 횟수와 중단 조건",
          ]}
          steps={[
            {
              code: "save(request, key, outcome=unknown)",
              note: "응답 없음과 실행 실패를 구분해 저장합니다.",
            },
            {
              code: "receipt ← query_original_operation(request)",
              note: "원래 업무의 실제 결과를 조회합니다.",
            },
            {
              code: "if receipt proves committed: verify_target_and_amount; return completed",
              note: "실제 대상과 금액이 맞을 때만 완료로 판정합니다.",
            },
            {
              code: "if server_guarantees_deduplication(key, same_arguments) and key_is_valid and retry_budget > 0: retry_same_request_same_key",
              note: "서버 보장과 키 범위·유효 기간을 확인한 뒤 같은 요청을 재시도합니다.",
            },
            {
              code: "else: stop_new_effects; escalate_with_unknown_outcome",
              note: "빈 조회 결과만으로 새 키를 만들거나 미실행이라고 단정하지 않습니다.",
            },
          ]}
          output="검증된 실행 결과 또는 미확인 상태와 안전한 다음 확인 경로"
        />
        <div id="paper-long-running-harness" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Anthropic — Effective harnesses for long-running agents, Progress tracking"
            citeKey={1}
            href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
          >
            <q>incremental progress</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              장기 실행의 진행 기록과 저장 지점은 다시 시작할 위치를 찾는 데
              쓰입니다. 이 사례에서는 pay-42와 unknown 상태를 다음 실행에
              전달합니다. 코드 저장 지점을 복원하는 일과 외부 청구를 되돌리는
              일은 별개이므로 재개 시 실제 거래 결과를 다시 확인합니다. (가정)
            </p>
          </div>
        </div>
      </section>

      <section
        id="side-effect-control"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 복원할 수 있는 상태와 없는 효과를 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dry-run으로 주문 42와 10,000원을 보여 준 뒤에도 실행 전에는
            대상·금액·현재 조건이 그대로인지 확인합니다. 필요한 승인은 이 변경에
            연결합니다. 사전에 이미 허용된 작업의 권한을 매번 새로 묻는 것과는
            다릅니다. (가정)
          </p>
          <p>
            파일 저장 지점으로 돌아가도 이미 전송한 메시지나 처리한 청구는
            사라지지 않습니다. 외부 서비스의 취소·보상 절차가 따로 필요합니다.
            보상도 새로운 외부 효과이므로 권한과 중복 실행 조건을 다시
            확인합니다.
          </p>
          <p>
            실패를 감지하는 검사와 상태 저장은 서로 보완합니다. 저장만 하고
            검사하지 않으면 잘못된 실행을 계속할 수 있고 실패만 알아채고 요청
            식별자를 잃으면 안전하게 이어갈 위치를 찾기 어렵습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="작은 이탈을 더하는 식으로 실제 실패를 예측할 수 있나요?"
          preview="합계식은 가정한 비음수 이탈량의 누적을 보여 주는 학습용 모델이며, agent의 실제 실패율을 추정한 법칙은 아닙니다."
        >
          <p>
            이탈량의 단위와 측정법, 상쇄 여부, 임계값을 먼저 정해야 합계에
            의미가 생깁니다. 아래에서는 비음수 이탈량을 단순히 더한다고
            가정합니다. 이 조건 밖에서는 단계 수만으로 실패를 판정할 수
            없습니다. (가정)
          </p>
          <ExplainedFormula
            question="국소적으로 작은 이탈이 왜 누적되면 실패로 세어지는가"
            idea="매 단계의 이탈량을 재승인 없이 그대로 더하면, 개별 단계는 작아도 합은 임계값을 넘을 수 있습니다"
            formula={String.raw`D_n = \sum_{i=1}^{n} d_i,\quad \text{실패} \iff D_n > \tau`}
            annotatedFormula={String.raw`D_n = \underbrace{\sum_{i=1}^{n} d_i}_{\text{단계별 이탈의 누적합}} ,\quad \text{실패} \iff \underbrace{D_n > \tau}_{\text{누적이 임계값을 넘음}}`}
            operations={[
              {
                expression: String.raw`d_i`,
                annotation: [
                  "i 번째 결정이 직전에 승인된 하위 목표에서 벗어난 정도입니다.",
                  "이 값 자체는 작아도 다음 단계의 새 기준이 됩니다.",
                ],
              },
              {
                expression: String.raw`D_n = \sum_{i=1}^{n} d_i`,
                annotation: [
                  "단계별 이탈이 서로 상쇄되지 않고 그대로 쌓인 누적값입니다.",
                ],
              },
              {
                expression: String.raw`D_n > \tau`,
                annotation: [
                  "누적 이탈이 허용 임계값을 넘으면 원래 목표를 벗어난 것으로 판정합니다.",
                ],
              },
            ]}
            terms={[
              {
                symbol: "d_i",
                name: "단계별 이탈량",
                description: "i 번째 결정과 직전 승인된 하위 목표 사이 차이",
              },
              {
                symbol: "D_n",
                name: "누적 drift",
                description: "n 단계까지 이탈량의 합",
              },
              {
                symbol: "\\tau",
                name: "허용 임계값",
                description: "이 값을 넘으면 goal drift 로 판정하는 기준선",
              },
            ]}
            assumptions={[
              "각 단계의 국소 판단은 그 자체로는 합리적이라고 가정합니다.",
              "d_i 는 매 단계 원래 목표와 다시 대조되지 않고 다음 단계의 기준이 됩니다.",
            ]}
            interpretation="d_i 가 각각 작아도 D_n 은 재승인 없이 계속 커진다는 점이 이 식의 결론이고, 어느 한 단계를 원인으로 지목하는 식은 아닙니다. 학습용 가정 n=8, d_i=0.05에서는 D_8=0.4입니다. τ=0.3과 비교하면 6단계는 정확히 같고, 엄격한 부등호 D_n > τ는 7단계의 0.35부터 성립합니다. 실제 agent 오류를 측정한 값은 아닙니다."
          />
        </ProgressiveDetail>
      </section>

      <section
        id="human-in-the-loop-escalation"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 확인할 수 없는 결과는 근거와 함께 넘깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            자동 재시도를 멈출 조건에는 결과 미확인, 권한 부족, 같은 실패 반복,
            예산 소진을 포함할 수 있습니다. 인계에는 원래 요청, 실행 식별자,
            현재까지 확인한 상태, 아직 모르는 부분과 다음 조회 경로를 담습니다.
          </p>
          <p>
            LangChain의 human-in-the-loop 문서는 approve·edit·reject 같은 결정을
            받고 저장된 실행을 이어가는 구조를 설명합니다. 인자를 바꿔 승인하면
            원래 요청과 의미가 달라지므로 기존 키와 승인 기록을 그대로 재사용할
            수 있는지 다시 판단합니다.
          </p>
          <p>
            실패 분류를 모델 성능으로 일반화하지 않습니다. AgentErrorTaxonomy
            논문은 memory·reflection·planning·action·system 층을 구분하며
            ALFWorld·GAIA·WebShop 조건에서 결과를 보고합니다. 여기의 운영 분류와
            그 논문 분류는 같지 않습니다.
          </p>
        </div>
        <div id="paper-agent-error-taxonomy" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="Where LLM Agents Fail and How They can Learn From Failures, arXiv:2509.25370v1"
            citeKey={1}
            href="https://arxiv.org/html/2509.25370v1"
          >
            <q>AgentErrorTaxonomy</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              논문의 원인 층을 이 사례에 적용하면 주문·금액 제약을 잃은 문제와
              통신 응답을 잃은 문제는 서로 다른 점검 대상입니다. 논문이 보고한
              all-correct accuracy의 24%p 개선을 이 청구 서비스의 신뢰도
              개선으로 옮겨 쓰지 않습니다.
            </p>
          </div>
        </div>
        <div id="paper-human-in-loop" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="LangChain — Human-in-the-loop, 2026-10-04 확인"
            citeKey={1}
            href="https://docs.langchain.com/oss/python/langchain/human-in-the-loop"
          >
            <q>approve</q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              이 예에서 검토자가 실행을 허용하더라도 기존 청구의 결과가
              불명확하면 새 청구부터 만들지 않습니다. 승인과 중복 효과 확인은
              별도 조건입니다. 제품 문서의 중단·재개 기능 자체가 외부 효과의
              exactly-once 보장은 아닙니다. (가정)
            </p>
          </div>
        </div>
        <ContentBoundary article="agent-failure-modes-and-recovery" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          11. 재시도 전에 무엇을 알아야 할까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            10,000원 청구 응답이 끊기고 첫 조회에 기록이 없습니다. 새 키로 다시
            청구해도 되나요? (답: 7절)
          </p>
          <p>
            같은 pay-42가 있어도 서버 보장과 유효 기간을 확인해야 하는 이유는
            무엇인가요? (답: 8절)
          </p>
          <p>
            코드 저장 지점으로 돌아갔습니다. 이미 실행된 외부 청구도 자동으로
            취소되나요? (답: 9절)
          </p>
        </div>
      </section>
    </div>
  );
}
