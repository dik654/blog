import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AgentFailureModesAndRecoveryViz from "./agent-failure-modes-and-recovery/viz/AgentFailureModesAndRecoveryViz";

/**
 * 복구는 idempotent 여부로 retry 나 escalation 으로 갈립니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function AgentFailureModesAndRecoveryArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Agent 실패는 유형마다 다른 신호를 남기고 다른 복구를 요구합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Agent reliability 는 한 번의 정답률이 아니라, 여러 번 실행했을 때 실패가 나더라도
            그 실패를 알아채고 되돌리거나 사람에게 넘겨 전체 작업이 안전하게 끝나는 비율입니다.
            같은 “실패”라는 말 아래에는 목표를 잊는 것, 도구를 잘못 쓰는 것, 끝났다고 착각하는 것처럼
            서로 다른 원인과 서로 다른 복구법을 가진 여러 유형이 섞여 있습니다.
          </p>
          <p>
            이 글은 그 유형을 <Link to="#failure-taxonomy">agent failure mode</Link> 로 나누고,
            그중 <Link to="#retry-idempotent">retry loop</Link> 가 idempotent 하지 않은 action 에서
            왜 위험한지, <Link to="#side-effect-control">side-effect control</Link> 이 그 위험을
            실행 전에 어떻게 낮추는지, <Link to="#recovery-checkpointing">failure detection</Link>
            과 <Link to="#recovery-checkpointing">checkpoint</Link> 가 어떻게 복구 지점을 만드는지,
            마지막으로 자동 복구가 불확실할 때 <Link to="#human-in-the-loop-escalation">사람에게
            넘기는 기준</Link> 을 순서대로 다룹니다.
          </p>
          <p>
            Agent 실행 자체의 state·action·observation 반복은{" "}
            <Link to="/ai/agent-loop-foundations#overview">agent loop 기초</Link> 글이,
            deterministic checkpoint 로 언제 사람 승인을 끼워 넣을지의 경계는{" "}
            <Link to="/ai/agent-control-boundaries#workflow-agent">agent control boundary</Link>{" "}
            글이 이미 다룹니다. 이 글은 그 실행 도중에 무엇이 실패로 세어지고, 실패마다 어떤 복구
            절차를 고르는지를 채웁니다.
          </p>
        </div>
        <AgentFailureModesAndRecoveryViz />
        <ContentBoundary article="agent-failure-modes-and-recovery" />
      </section>

      <section id="failure-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Goal drift 는 목표 자체가 밀리는 것이고, context drift 는 근거를 잊는 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Goal drift 는 매 단계의 판단은 그 자체로 그럴듯한데, 그 판단들이 이전 목표를 다시
            확인하지 않고 이어 붙으면서 전체 방향이 처음 목표에서 조금씩 밀리는 현상입니다.
            Context drift 는 방향은 그대로인데, 앞서 확인한 제약이나 근거를 이후 단계가 다시
            불러오지 못해 그 근거와 어긋나는 행동을 하는 현상입니다. 하나는 목표가 바뀌는 것이고
            다른 하나는 목표는 그대로인데 기억이 새는 것입니다.
          </p>
          <p>
            예를 들어 “지난달 매출 요약 보고서를 쓰라”는 목표로 시작한 8 단계짜리 작업에서, 3
            단계까지는 요청대로 매출 수치를 정리합니다. 4 단계부터 “더 유용해 보인다”는 이유로
            원가·재고까지 분석을 넓히고, 8 단계에 이르면 원래 요청에 없던 전체 재무 detail
            분석을 내놓습니다. 각 단계의 확장은 국소적으로는 합리적이지만 원래 acceptance
            조건과는 멀어졌습니다.
          </p>
          <p>
            반면 context drift 는 1 단계에서 “이 서버는 read-only replica 라 write 금지”를
            확인해 두고도, 20 턴 뒤 context 가 요약(compaction)되며 그 제약이 압축 대상에서
            빠져 15 단계째 write tool 을 호출하는 경우입니다. 목표(“replica 점검”)는 바뀌지
            않았고, 앞서 세운 제약을 다시 불러오지 못한 것이 원인입니다.
          </p>
        </div>
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
              annotation: ["단계별 이탈이 서로 상쇄되지 않고 그대로 쌓인 누적값입니다."],
            },
            {
              expression: String.raw`D_n > \tau`,
              annotation: ["누적 이탈이 허용 임계값을 넘으면 원래 목표를 벗어난 것으로 판정합니다."],
            },
          ]}
          terms={[
            { symbol: "d_i", name: "단계별 이탈량", description: "i 번째 결정과 직전 승인된 하위 목표 사이 차이" },
            { symbol: "D_n", name: "누적 drift", description: "n 단계까지 이탈량의 합" },
            { symbol: "\\tau", name: "허용 임계값", description: "이 값을 넘으면 goal drift 로 판정하는 기준선" },
          ]}
          assumptions={[
            "각 단계의 국소 판단은 그 자체로는 합리적이라고 가정합니다.",
            "d_i 는 매 단계 원래 목표와 다시 대조되지 않고 다음 단계의 기준이 됩니다.",
          ]}
          interpretation="d_i 가 각각 작아도 D_n 은 재승인 없이 계속 커진다는 점이 이 식의 결론이고, 어느 한 단계를 원인으로 지목하는 식은 아닙니다. n=8, d_i≈0.05 라면 D_8≈0.4 로 τ=0.3 을 6 단계쯤에서 넘습니다."
        />
        <TermBreakdown
          title="Agent failure mode: 실행 중 실패가 드러나는 여섯 모양"
          description="원인은 다르지만 실행 로그에서 서로 다른 신호로 구분됩니다."
          items={[
            {
              term: "Goal drift",
              description: "매 단계 국소 판단이 누적되며 원래 목표에서 방향이 밀리는 실패입니다.",
              example: "매출 요약 요청이 8 단계 뒤 전체 재무 분석으로 확장됨",
              boundary: "목표 자체가 바뀝니다. 근거를 잊는 context drift 와는 다릅니다.",
            },
            {
              term: "Context drift",
              description: "목표는 그대로인데 앞서 확인한 제약·근거를 이후 단계가 불러오지 못하는 실패입니다.",
              example: "20 턴 전 확인한 write 금지 제약이 요약 과정에서 빠져 write 를 호출함",
              boundary: "compounding error(누적 오차)와 long-horizon drift(긴 실행에서 서서히 벌어지는 이탈)는 goal·context drift 가 실제로 관찰되는 두 축의 공통 이름입니다.",
            },
            {
              term: "Tool misuse",
              description: "존재하는 tool 을 스키마나 상태에 맞지 않게 호출하는 실패의 상위 범주입니다.",
              example: "필수 파라미터 누락, 문자열 자리에 숫자 전달",
              boundary: "Invalid tool call(스키마 위반)과 tool hallucination(존재하지 않는 tool·파라미터를 지어냄)이 대표 mechanism 입니다.",
            },
            {
              term: "Premature termination",
              description: "Verifier 를 통과하지 못했는데 model 이 스스로 완료를 선언해 loop 를 끝내는 실패입니다.",
              example: "기능 일부만 구현하고 end-to-end 테스트 없이 “완료”라고 보고",
              boundary: "Verifier 부재가 원인이지, tool 호출 자체가 잘못된 것은 아닙니다.",
            },
          ]}
        />
        <div id="paper-agent-error-taxonomy" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Xu et al. · Where LLM Agents Fail and How They can Learn From Failures (arXiv 2509.25370, 2025)"
            citeKey={1}
            href="https://arxiv.org/abs/2509.25370"
          >
            ALFWorld, GAIA, WebShop 세 환경에서 실패 trace 를 memory, reflection, planning, action,
            system-level 다섯 층으로 분류한 AgentErrorTaxonomy 를 제시합니다. 층별 원인을 표시해
            재학습에 쓰는 AgentErrorBench 도 함께 내놓습니다.
          </CitationBlock>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            보고된 개선폭(all-correct accuracy 기준 24%p)은 이 세 환경의 자기보고 수치입니다. 이
            글의 goal drift·context drift·tool misuse 구분은 그 다섯 층을 실행 로그에서 흔히 보이는
            이름으로 재정리한 것이며, 논문 자체의 범주 이름은 아닙니다.
          </p>
        </div>
      </section>

      <section id="retry-idempotent" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Idempotent 하지 않은 action 에 retry loop 를 걸면 부작용이 중복됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Idempotent action 은 같은 요청을 몇 번 다시 보내도 실제 효과가 한 번 실행한 것과
            똑같이 남는 action 입니다. Retry loop 는 실패 신호를 보고 같은 action 을 다시 시도하는
            절차인데, action 이 idempotent 하지 않으면 “다시 시도”가 아니라 “한 번 더 실행”이 되어
            부작용이 그대로 중복됩니다.
          </p>
          <p>
            결제 tool 호출을 생각해 봅니다. Agent 가 카드 청구 API 를 호출했는데 응답이 오기 전에
            연결이 끊깁니다. Agent 는 이 요청이 실패했다고 판단해 같은 청구를 다시 호출합니다.
            하지만 첫 요청이 서버에서는 이미 처리돼 카드가 청구된 뒤였다면, 사용자는 같은 금액을
            두 번 청구받습니다. Action 자체가 idempotent 하지 않으면 “실패로 보였다”는 판단만으로는
            안전하게 재시도할 수 없습니다.
          </p>
          <p>
            이 문제를 실제로 막는 방식은 action 을 부르기 전에 클라이언트가 고유한 idempotency
            key 를 만들어 함께 보내는 것입니다. 서버는 그 key 로 들어온 첫 요청의 결과(성공이든
            실패든)를 저장해 두고, 같은 key 로 다시 요청이 오면 실제로 다시 실행하지 않고 저장된
            결과를 그대로 돌려줍니다. Retry 는 안전해지지만 key 를 만드는 몫은 여전히 호출하는
            쪽(agent 나 harness)에 있습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="실패 감지부터 retry 또는 escalation까지"
          input={[
            "직전 action 의 실행 결과(성공/timeout/error code)",
            "action 유형별 idempotency 여부와 idempotency key 발급 여부",
            "지금까지의 재시도 횟수와 실패 유형 이력",
          ]}
          steps={[
            {
              code: "signal ← detect_failure(last_result)",
              note: "Timeout·error code·verifier 실패·같은 action 반복 호출을 실패 신호로 모읍니다.",
            },
            {
              code: "mode ← classify(signal, trace)",
              note: "Goal drift·context drift·tool misuse·invalid call·hallucination·premature termination·infra error 중 하나로 분류합니다.",
            },
            {
              code: "if mode == infra_error:",
              note: "일시적 네트워크·rate limit 실패만 retry 후보로 남깁니다.",
            },
            {
              code: "  if is_idempotent(action) or has_idempotency_key(action):",
              note: "같은 key 로 다시 보내도 side effect 가 중복되지 않는지 확인합니다.",
            },
            {
              code: "    retry(action, backoff=next_backoff())",
              note: "지수 backoff 로 같은 action 을 다시 시도합니다.",
            },
            {
              code: "  else:",
              note: "Idempotent 하지 않고 실행 여부가 불확실하면 재시도 대신 확인을 먼저 합니다.",
            },
            {
              code: "    receipt ← lookup_effect_receipt(action)",
              note: "결제 영수증·생성된 레코드 id 처럼 이미 실행됐는지 확인할 외부 증거를 조회합니다.",
            },
            {
              code: "    if receipt is None: retry(action, fresh_key=True) else: mark_done(action)",
              note: "증거가 없으면 새 key 로 한 번만 다시 시도하고, 있으면 이미 완료로 처리합니다.",
            },
            {
              code: "else:",
              note: "Goal/context drift·tool misuse·premature termination 은 재시도로 고쳐지지 않습니다.",
            },
            {
              code: "  escalate(mode, checkpoint=save_state())",
              note: "현재 state 를 checkpoint 로 남기고 escalation policy 에 따라 사람에게 넘깁니다.",
            },
          ]}
          output="Retry 성공 · idempotent 확인 후 완료 처리 · 또는 checkpoint 를 남긴 escalation"
          repeatUntil="Verifier 통과 또는 escalation 확정"
        />
        <div id="paper-stripe-idempotency" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Stripe · Idempotent requests (API Reference)"
            citeKey={2}
            href="https://docs.stripe.com/api/idempotent_requests"
          >
            클라이언트가 만든 idempotency key 를 요청에 실어 보내면, Stripe 는 그 key 로 들어온
            첫 요청의 상태 코드와 본문을 저장해 두고 같은 key 의 후속 요청에는 실제 처리 없이 같은
            결과를 돌려줍니다. Key 는 최소 24 시간 보관되고, 같은 key 에 다른 파라미터가 오면
            오용으로 보고 오류를 냅니다. 이 mechanism 은 Stripe 자신의 API 계약이며, 모든 외부
            서비스가 idempotency key 를 지원한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="side-effect-control" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Dry-run 과 confirmation gate 가 되돌릴 수 없는 action 을 막습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Side-effect control 은 idempotent 여부를 따지기 전에, 애초에 되돌리기 어려운 action 이
            검토 없이 실행되지 않도록 실행 경로 자체에 문턱을 두는 방법입니다. Retry 가 “이미 실행된
            뒤”의 위험을 다룬다면, side-effect control 은 “아직 실행되지 않은 순간”의 위험을
            다룹니다.
          </p>
          <p>
            Dry-run 은 실제 side effect 를 만들지 않고 그 action 이 무엇을 바꿀지만 계산해
            보여주는 실행입니다. 예를 들어 “오래된 레코드를 삭제하라”는 요청에서 실제 DELETE 대신
            영향받을 행(row) 수와 예시 몇 건을 먼저 보여주면, 조건절 실수로 테이블 전체가 대상이
            되는 경우를 실행 전에 알아챌 수 있습니다.
          </p>
          <p>
            Confirmation gate 는 그 dry-run 결과를 사람에게 보여주고 승인·거부·수정 중 하나를
            받은 뒤에만 실제 action 을 진행하는 문턱입니다. 위험도가 낮은 read 성격 tool 은
            gate 없이 자동 실행하고, 삭제·결제·외부 발송처럼 되돌릴 수 없는 tool 에만 gate 를 두면
            같은 자동화 안에서 위험만 골라 낮출 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="언제 되돌릴 수 있고 언제 그렇지 않은지"
          items={[
            {
              term: "Dry-run",
              description: "실제 상태를 바꾸지 않고 변경 예상 결과만 계산해 보여주는 실행입니다.",
              example: "DELETE 대신 영향받을 행 수와 예시를 반환",
              boundary: "결과를 보여줄 뿐 승인 여부를 판단하지는 않습니다.",
            },
            {
              term: "Confirmation gate",
              description: "Dry-run 결과를 사람에게 보이고 승인을 받은 뒤에만 실제 action 을 진행하는 문턱입니다.",
              example: "삭제·결제·외부 발송 tool 에만 gate 를 걸고 조회 tool 은 자동 통과",
              boundary: "모든 tool 에 걸면 자동화 이점이 사라지므로 되돌릴 수 없는 action 에만 좁혀 적용합니다.",
            },
          ]}
        />
        <ProgressiveDetail
          title="Gate 를 model 프롬프트 지시로만 두면 왜 새는가"
          preview="“실행 전에 먼저 물어봐”라는 지시는 model 이 프롬프트를 잊거나 확신을 갖는 순간 그대로 무시될 수 있습니다."
        >
          <p>
            자연어 지시 “먼저 확인을 구하라”는 model 의 판단에 기대는 방식이라 항상 지켜진다는
            보장이 없습니다. 안정적인 방식은 tool 실행 경로 자체(runtime·harness)에 gate 를 두어
            model 이 무엇을 요청하든 위험 tool 은 승인 없이 물리적으로 실행되지 않게 하는
            것입니다. Model 에게는 “gate 를 통과해야 한다”는 사실을 알릴 필요조차 없습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="recovery-checkpointing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Checkpoint 가 있어야 failure detection 이 recovery 로 이어집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Failure detection 은 verifier 실패·반복 action·timeout 같은 신호로 “지금 잘못되고
            있다”를 알아채는 단계이고, checkpointing 은 되돌아갈 수 있는 안전한 state 를 미리
            저장해 두는 준비입니다. Recovery strategy 는 이 둘을 전제로, 감지된 실패를 checkpoint
            시점으로 되돌리거나 그 지점부터 다른 경로를 다시 시도하는 절차 전체를 가리킵니다.
          </p>
          <p>
            Checkpoint 가 없으면 failure detection 은 “실패를 알아챘다”는 사실만 남기고 되돌릴
            지점이 없어 처음부터 다시 시작하거나 잘못된 state 위에서 복구를 시도하게 됩니다.
            반대로 checkpoint 만 있고 감지가 늦으면, 이미 여러 단계 더 진행된 뒤에야 되돌리게 되어
            그사이의 정상적인 작업까지 함께 버립니다. 두 요소는 서로의 효과를 제한합니다.
          </p>
          <p>
            실제 harness 에서는 매 단계 git commit 과 진행 기록 파일을 checkpoint 로 쓰는 방식이
            보고돼 있습니다. 각 세션을 시작할 때 이전 진행 기록과 commit 로그를 읽고 실제
            개발 서버에서 기본 end-to-end 테스트를 한 번 돌려, model 이 “완료됐다”고 적어 둔
            내용과 실제 동작이 어긋나는 premature termination 을 세션 경계에서 걸러 냅니다.
          </p>
        </div>
        <div id="paper-effective-harnesses" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Anthropic Engineering · Effective harnesses for long-running agents (2025-11-26)"
            citeKey={3}
            href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
          >
            장기 실행 harness 실험에서 model 이 기능을 절반만 구현하고도 완료라고 보고하는
            premature termination 사례를 관찰했고, git commit 과 진행 기록 파일을 checkpoint 로
            남기고 세션 시작마다 기본 end-to-end 테스트를 돌려 되돌릴 지점과 재검증을 함께 두는
            방식으로 대응했다고 보고합니다. 이 결과는 Anthropic 자신의 harness 실험 범위이며, 모든
            failure detection 방식을 대표하지는 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="human-in-the-loop-escalation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Escalation policy 는 자동 복구가 불확실할 때 결정을 사람에게 넘기는 기준입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Human-in-the-loop(HITL) 은 agent 가 제안한 action 을 실행 전에 사람이 검토·승인·수정·
            거부할 수 있게 실행을 멈추는 지점입니다.
          </p>
          <p>
            Escalation policy 는 그 지점을 “언제” 둘지 정하는 규칙입니다. Retry 로 해결되지 않는
            실패(goal drift, context drift, tool misuse, premature termination)나 되돌릴 수 없는
            action 앞에서 자동 진행을 멈추고 사람에게 넘기라고 지시합니다.
          </p>
          <p>
            공개된 구현 하나는 실행을 멈추는 primitive 를 호출해 graph 를 일시 정지하고, 사람이
            승인(approve)·인자 수정(edit)·거부(reject)·직접 답변(respond) 중 하나를 정해 재개
            명령과 함께 돌려주는 방식입니다. 이때 state 는 checkpoint 저장소에 남아 있어 사람이
            바로 응답하지 않고 몇 시간 뒤에 돌아와도 같은 지점에서 이어집니다.
          </p>
          <p>
            Escalation 은 실패의 최종 처리 방식이 아니라 checkpoint·recovery strategy 와 이어지는
            한 경로입니다. 사람이 거부하면 agent 는 그 checkpoint 로 되돌아가 다른 경로를 다시
            시도하거나, 애초에 이 유형의 실패는 retry 대상이 아니라는 판단을 그대로 유지합니다.
          </p>
        </div>
        <div id="paper-human-in-the-loop" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="LangChain · Human-in-the-loop (docs.langchain.com)"
            citeKey={4}
            href="https://docs.langchain.com/oss/python/langchain/human-in-the-loop"
          >
            Interrupt primitive 로 tool 실행 직전 graph 를 멈추고 approve·edit·reject·respond 네
            결정 중 허용된 것만 받아 재개(Command(resume=...))합니다. Thread id 로 실행을 식별해
            checkpoint 저장소 위에서 승인 대기 상태를 유지합니다. 이 mechanism 은 LangGraph 구현
            기준이며, escalation 규칙 자체(무엇을 위험으로 볼지)는 이 문서가 아니라 운영자가
            정합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          실패 원인을 layer(objective·context·schema·capability·verifier)별로 나눠 재현하고
          장치를 하나씩 바꿔 기여도를 재는 방법은{" "}
          <Link to="/ai/harness-failure-ablation#failure-layer">harness failure ablation</Link>{" "}
          글이 다룹니다. 이 글의 taxonomy 는 실행 중 실시간으로 무엇을 감지하고 어떻게 복구할지를
          다루고, 그 글은 배포 뒤 재현된 실패를 사후에 분류하고 개선하는 절차를 다룹니다.
        </p>
      </section>
    </div>
  );
}
