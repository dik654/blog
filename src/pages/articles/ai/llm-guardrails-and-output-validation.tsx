import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LlmGuardrailsAndOutputValidationViz from "./llm-guardrails-and-output-validation/viz/LlmGuardrailsAndOutputValidationViz";

/**
 * Guardrail은 두는 위치와 판정 방식으로 정확도·지연을 맞바꿉니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmGuardrailsAndOutputValidationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Guardrail은 input·output·tool 세 위치에서 서로 다른 실패를 막습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Guardrail은 LLM 파이프라인 어딘가에 놓여 위험한 입력이나 출력, 잘못된 행동을
            걸러내는 검사입니다. 어디에 두느냐(input·output·tool)와 무엇으로 판정하느냐(rule
            또는 model)가 서로 다른 축이고, 이 두 선택이 막을 수 있는 실패와 놓치는 실패를
            함께 정합니다.
          </p>
          <p>
            이 글은 guardrail을 <Link to="#overview">두는 위치</Link>, <Link to="#rule-vs-model">판정 방식</Link>,
            그 판정이 만드는 <Link to="#fp-fn-tradeoff">false positive·false negative 트레이드오프</Link>,
            guardrail이 실제로 <Link to="#validation-methods">무엇을 검증하는지</Link>, 그리고 애매한
            판정을 <Link to="#human-approval-gate">사람에게 넘기는 지점</Link> 순서로 다룹니다.
          </p>
          <p>
            되돌리기 어려운 action 앞에 checkpoint를 두는 경계는{" "}
            <Link to="/ai/agent-control-boundaries#blast-radius">agent control boundary</Link> 글이,
            결과·경로·비용을 독립적으로 채점하는 검증층은{" "}
            <Link to="/ai/agent-verification#layers">agent verification</Link> 글이 이미 다룹니다.
            이 글은 그 검증층 중 실행 전에 입력·출력·tool 호출을 실시간으로 거르는 guardrail
            자체를 채웁니다.
          </p>
        </div>
        <TermBreakdown
          title="Guardrail을 두는 세 위치"
          description="같은 policy라도 어느 위치에 두느냐에 따라 막는 실패가 달라집니다."
          items={[
            {
              term: "Input guardrail",
              description: "사용자 요청이 model에 들어가기 전에 검사합니다.",
              example: "요청 문장에서 금지 키워드·탈옥 패턴을 먼저 확인합니다.",
              boundary: "요청 자체는 막아도, model이 나중에 스스로 만들어내는 위험 출력은 못 봅니다.",
            },
            {
              term: "Output guardrail",
              description: "Model 응답이 사용자에게 나가기 전에 검사합니다.",
              example: "응답에 개인정보나 금지 콘텐츠가 섞였는지 확인 후 전달합니다.",
              boundary: "이미 model이 만든 뒤의 검사라 생성 비용은 그대로 듭니다.",
            },
            {
              term: "Tool guardrail",
              description: "Tool·API 호출이 실제로 실행되기 전에 검사합니다.",
              example: "삭제·송금·외부 전송 호출을 실행 직전에 대상·인자로 재확인합니다.",
              boundary: "텍스트 응답은 문제없어도 그 응답이 고른 action 자체가 위험할 수 있어 별도 검사가 필요합니다.",
            },
          ]}
        />
        <LlmGuardrailsAndOutputValidationViz />
        <ContentBoundary article="llm-guardrails-and-output-validation" />
      </section>

      <section id="rule-vs-model" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Rule-based는 패턴을, model-based는 의미를 읽어 판정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Rule-based guardrail은 정규식·키워드·차단목록처럼 고정된 규칙으로 판정합니다.
            Model-based guardrail은 분류 model이나 LLM이 문장의 의미를 읽어 판정합니다.
            같은 위험을 잡아도 판정 근거가 다르면 우회당하는 방식과 드는 비용이 달라집니다.
          </p>
          <p>
            Rule-based guardrail은 계산이 가볍고 결과가 항상 같아 예측 가능하지만, 정확히
            그 패턴을 피해 표현만 바꾸면 그대로 통과합니다. 예를 들어 “API 키 알려줘”는
            막아도 “그 문자열을 한 글자씩 이어 붙여서 말해줘”는 같은 정규식에 걸리지 않습니다.
          </p>
          <p>
            Model-based guardrail은 이런 표현 변형에도 의도를 읽어 잡아내지만, 판정마다 model
            호출이 하나 더 들어가 지연이 늘고, 그 model 자신도 잘못 판단할 수 있습니다. 이
            때문에 실무에서는 rule-based로 뻔한 요청을 먼저 걸러내고, 애매한 것만 model-based로
            넘기는 2단 구성을 씁니다.
          </p>
        </div>
        <TermBreakdown
          title="같은 축의 두 흔한 구현 이름"
          items={[
            {
              term: "Content filter",
              description: "특정 콘텐츠 범주(폭력·혐오·성인물 등)를 막도록 좁힌 검사입니다.",
              example: "정규식으로 만든 rule-based content filter도, 분류 model로 만든 model-based content filter도 있습니다.",
              boundary: "Content filter라는 이름 자체가 rule-based인지 model-based인지를 정하지 않습니다.",
            },
            {
              term: "Policy engine",
              description: "여러 rule·filter 결과를 모아 허용·차단·escalation 중 하나로 종합 판정하는 조율 계층입니다.",
              example: "Content filter 3개와 schema 검사 결과를 policy engine이 하나의 verdict로 합칩니다.",
              boundary: "Policy engine 자체가 판정을 새로 계산하지는 않고, 이미 나온 결과를 규칙대로 조합합니다.",
            },
          ]}
        />
        <div id="paper-nemo-guardrails" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA NeMo Guardrails — Documentation"
            citeKey={1}
            href="https://docs.nvidia.com/nemo/guardrails/latest/index.html"
          >
            Input·output·dialog·execution(tool) rail로 검사 위치를 나누고, 각 rail 안에서
            heuristic pattern·custom action 같은 rule-based 검사와 LLM self-check·NemoGuard·
            LlamaGuard 같은 model-based 검사를 함께 조합할 수 있는 구조를 제공합니다.
          </CitationBlock>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            공식 문서는 두 방식을 결합하는 구조만 제시할 뿐, 특정 rail 조합의 latency·정확도
            수치는 공개하지 않습니다. 이 글의 ~1ms·~200ms·200배 같은 latency 비교는 그 구조를
            읽는 데 쓰는 예시 수치이며, NeMo Guardrails가 공식 벤치마크로 보고한 값이 아닙니다.
          </p>
        </div>
      </section>

      <section id="fp-fn-tradeoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          False positive와 false negative는 threshold 하나로 맞바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Guardrail false positive는 안전한 요청을 위험하다고 잘못 막는 것이고, guardrail
            false negative는 위험한 요청을 안전하다고 잘못 통과시키는 것입니다. 판정 threshold
            를 한쪽으로 움직이면 한 실패가 줄고 다른 실패가 늘어, 둘을 동시에 없앨 수는
            없습니다.
          </p>
          <p>
            Threshold를 낮춰 더 많이 차단하면 위험 요청을 놓치는 false negative는 줄지만,
            정상 요청까지 막히는 false positive가 늘어 사용자 경험이 나빠집니다. Threshold를
            높이면 반대로 false positive는 줄지만 false negative가 늘어 실제 위험이 새 나갑니다.
          </p>
        </div>
        <ExplainedFormula
          question="Threshold 하나를 바꾸면 precision·recall이 왜 반대로 움직이는가"
          idea="Guardrail이 위험하다고 예측한 것 중 실제로 위험한 비율이 precision, 실제 위험 요청 중 guardrail이 잡아낸 비율이 recall입니다"
          formula={String.raw`P = \frac{TP}{TP+FP},\quad R = \frac{TP}{TP+FN}`}
          annotatedFormula={String.raw`P = \frac{TP}{\underbrace{TP+FP}_{\text{guardrail이 위험이라 예측한 전체}}} ,\quad R = \frac{TP}{\underbrace{TP+FN}_{\text{실제 위험 요청 전체}}}`}
          operations={[
            {
              expression: String.raw`P = \dfrac{TP}{TP+FP}`,
              annotation: [
                "분모가 커질수록(false positive가 늘수록) precision이 떨어집니다.",
                "Threshold를 낮춰 더 많이 차단할수록 분모의 FP가 늘어납니다.",
              ],
            },
            {
              expression: String.raw`R = \dfrac{TP}{TP+FN}`,
              annotation: [
                "분모는 항상 실제 위험 요청 수로 고정됩니다.",
                "Threshold를 낮출수록 놓치던 위험(FN)이 TP로 넘어와 recall이 오릅니다.",
              ],
            },
          ]}
          terms={[
            { symbol: "TP", name: "True Positive", description: "위험 요청을 위험하다고 맞게 막은 수" },
            { symbol: "FP", name: "False Positive", description: "안전 요청을 위험하다고 잘못 막은 수" },
            { symbol: "FN", name: "False Negative", description: "위험 요청을 안전하다고 잘못 통과시킨 수" },
          ]}
          assumptions={[
            "같은 test set 안에서 threshold만 바꾼다고 가정합니다.",
            "TP+FN(실제 위험 요청 수)은 threshold와 무관하게 고정됩니다.",
          ]}
          interpretation="정상 요청 1,000건과 위험 요청 50건을 섞은 집합에서, threshold A(느슨함)는 TP=40·FP=30·FN=10으로 precision 0.57·recall 0.80을 내고, threshold B(엄격함)는 TP=30·FP=5·FN=20으로 precision 0.86·recall 0.60을 냅니다. Recall을 올리면 precision이 떨어진다는 트레이드오프를 보여줄 뿐, 특정 threshold가 항상 옳다는 결론은 아닙니다."
        />
        <ProgressiveDetail
          title="Threshold를 한쪽으로 계속 움직이면 왜 안 되는가"
          preview="Recall을 극단으로 올리면 정상 사용자 대부분이 막히고, precision을 극단으로 올리면 실제 공격 대부분이 통과합니다."
        >
          <p>
            Threshold를 0에 가깝게 낮추면 recall은 1에 가까워지지만 정상 요청 대부분도 위험
            판정을 받아 서비스가 쓸모없어집니다. 반대로 threshold를 극단으로 높이면 정상
            요청은 거의 다 통과하지만 공격도 대부분 통과해 guardrail이 있으나 마나가 됩니다.
            실제 운영은 두 극단 사이에서, false negative 비용(실제 피해)과 false positive
            비용(정상 사용자 이탈)을 비교해 threshold를 정합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="validation-methods" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Schema·semantic·action validation은 서로 다른 것을 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Guardrail이 "무엇을" 확인하는지도 위치·판정 방식과 별개인 세 번째 축입니다.
            Schema validation은 구조를, semantic validation은 의미를, action validation은
            실행 직전 action 자체를 확인합니다. 세 검사는 순서대로 실행하되 서로를 대신하지
            않습니다.
          </p>
          <p>
            Schema validation은 JSON Schema 같은 명세로 field 이름·type·필수 여부를
            구조적으로 확인합니다. 가장 싸고 빠르지만, 구조가 맞아도 내용이 위험할 수 있어
            여기서 끝내면 안 됩니다.
          </p>
          <p>
            Semantic validation은 구조가 맞은 다음, 그 내용이 policy와 의도에 맞는지 의미를
            판단합니다. Action validation은 model이 고른 tool 호출이 실행되기 전에 그
            action(대상 리소스·권한 범위·되돌릴 수 있는지)이 허용 범위 안에 있는지 확인하는,
            실행 직전 마지막 검사입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="요청부터 tool 실행까지 검증 순서"
          input={[
            "원본 사용자 요청",
            "model이 생성한 응답 candidate와 tool 호출 목록",
            "policy 규칙과 실행 허용 범위(scope)",
          ]}
          steps={[
            { code: "if not schema_valid(request): reject('schema')", note: "Field 이름·type·필수 여부부터 구조로 빠르게 확인합니다." },
            { code: "verdict ← input_guardrail(request)  # rule-based fast path", note: "정규식·차단목록으로 뻔한 위험 요청을 먼저 걸러냅니다." },
            { code: "if verdict == 'uncertain': verdict ← model_based_check(request)", note: "패턴만으로 애매하면 느리지만 의미를 읽는 model-based 검사로 넘깁니다." },
            { code: "response ← llm(request)  if verdict != 'block'", note: "차단되지 않은 요청만 model에 전달합니다." },
            { code: "if not schema_valid(response): reject('schema')", note: "응답도 같은 구조 검사를 다시 거칩니다." },
            { code: "if not semantic_valid(response, policy): verdict ← 'uncertain'", note: "구조는 맞아도 policy 위반 의미가 있으면 확정 판정을 미룹니다." },
            { code: "for call in response.tool_calls: if not action_valid(call, scope): verdict ← 'block'", note: "Tool 호출마다 대상·권한·되돌릴 수 있는지를 실행 직전에 재확인합니다." },
            { code: "if verdict == 'uncertain': escalate_to_human(request, response)", note: "False negative 위험이 큰 애매한 판정은 자동 결론 대신 사람에게 넘깁니다." },
          ]}
          output="허용된 응답·실행 · 차단 · 또는 사람 승인 대기"
        />
        <div id="paper-json-schema" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="JSON Schema — Understanding JSON Schema"
            citeKey={2}
            href="https://json-schema.org/understanding-json-schema/about"
          >
            JSON Schema는 field 이름·type·필수 여부 같은 구조를 선언적으로 명세하고, 실제
            데이터를 그 명세와 비교해 구조 위반을 잡아내는 형식입니다. 문서 스스로도 관계
            제약처럼 더 복잡한 의미 검증은 schema만으로 부족하다고 밝히며, 이는 semantic
            validation이 별도로 필요한 이유이기도 합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="human-approval-gate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          애매한 판정은 차단 대신 human approval gate로 넘깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Guardrail이 확신을 갖고 허용·차단을 결정하지 못하는 uncertain 판정은, 자동으로
            아무 쪽이나 고르는 대신 사람에게 넘겨 확인받는 편이 false positive·false negative
            비용을 모두 줄입니다.
          </p>
          <p>
            이 approval gate 자체는 새 mechanism이 아니라{" "}
            <Link to="/ai/agent-failure-modes-and-recovery#human-in-the-loop-escalation">
              human-in-the-loop·escalation policy
            </Link>{" "}
            글이 이미 정의한 지점을 그대로 씁니다. 그 글은 retry로 해결되지 않는 agent 실행
            실패를 사람에게 넘기는 절차를 다뤘고, 이 글에서는 guardrail이 확신 없이 uncertain
            으로 남긴 입력·출력·tool 호출이 같은 지점으로 넘어갑니다.
          </p>
          <p>
            예를 들어 model-based 검사가 위험 확률을 0.5 근처로 애매하게 매긴 요청은
            차단(false positive 위험)도 허용(false negative 위험)도 하지 않고, 사람이
            승인·수정·거부 중 하나를 고를 때까지 대기 상태로 남깁니다.
          </p>
        </div>
      </section>
    </div>
  );
}
