import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LlmGatewayAndModelRoutingViz from "./llm-gateway-and-model-routing/viz/LlmGatewayAndModelRoutingViz";

/**
 * LLM gateway: unified API·routing 정책·cascade·fallback
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmGatewayAndModelRoutingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Gateway는 API를 하나로 묶고, router는 그 뒤에서 model을 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여러 LLM provider를 쓰는 애플리케이션이 provider마다 다른 API 형식과 인증
            방식을 그대로 노출하면 코드가 provider 수만큼 갈라집니다. LLM gateway는 이
            형식을 하나의 interface로 통일하고, 그 뒤에서 실제로 어떤 model을 쓸지는
            router가 정책에 따라 고릅니다.
          </p>
          <p>
            <Link to="/ai/llm-serving-ops#litellm-gateway">LLM 서빙 운영</Link> 글은
            이미 gateway를 다뤘지만 그 글의 초점은 호환성 계약을 먼저 걸러낸 뒤
            deadline 안에서 retry·fallback을 안전하게 허용하는 운영 제어면입니다. 이
            글은 그보다 앞선 질문, 즉 gateway가 API를 어떻게 통일하고 router가 어떤
            기준으로 후보를 고르는지, 그리고 순서대로 model을 시도하는 cascade와
            fallback이 무엇인지를 다룹니다.
          </p>
          <p>
            이어지는 절은 gateway와 unified API → routing 정책의 종류 → model
            cascade와 confidence 기반 escalation → fallback model과 provider
            fallback 순서로 갑니다.
          </p>
        </div>
        <ContentBoundary article="llm-gateway-and-model-routing" />
      </section>

      <section id="gateway-unified-api" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Gateway는 provider별 API 차이를 하나의 interface 뒤로 숨깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM gateway는 애플리케이션과 여러 LLM provider 사이에 놓여 요청을 받아
            적절한 model endpoint로 전달하는 중개 계층입니다. Model endpoint는 실제로
            요청을 처리하는 provider의 구체적인 API 주소와 인증 정보를 가리킵니다.
          </p>
          <p>
            Provider abstraction은 OpenAI, Anthropic, Bedrock처럼 서로 다른 요청·응답
            schema를 가진 provider를 같은 코드로 호출할 수 있게 감추는 설계입니다.
            Unified model API는 이 abstraction이 애플리케이션에 보여 주는 결과물로,
            하나의 함수 호출 형식으로 여러 provider를 부를 수 있게 만든 interface입니다.
          </p>
          <p>
            예를 들어 LiteLLM은 100개 이상의 provider를 OpenAI와 같은 요청·응답
            형식으로 호출할 수 있게 하고, OpenRouter는 하나의 API endpoint 뒤에서
            수백 개 model을 자동으로 routing합니다. 두 경우 모두 애플리케이션 코드는
            provider가 바뀌어도 그대로 유지됩니다.
          </p>
          <p>
            <Link to="/ai/llm-serving-ops#litellm-gateway">LLM 서빙 운영</Link> 글의
            gateway 절은 이 unified API 위에서 호환성 계약과 deadline 소유·retry
            budget을 다루는 운영 정책이며, 이 글이 다루는 API 통일 자체와는 층이
            다릅니다.
          </p>
        </div>
        <TermBreakdown
          title="Gateway가 통일하는 네 요소"
          description="같은 요청이 provider마다 다른 API로 갈라지지 않게 감추는 계층입니다."
          items={[
            { term: "LLM Gateway", description: "애플리케이션과 여러 LLM provider 사이에서 요청을 받아 적절한 model endpoint로 전달하는 중개 계층입니다.", example: "LiteLLM Proxy, OpenRouter가 이 역할을 하는 대표적 구현입니다.", boundary: "Gateway 하나만으로는 어떤 model을 고를지의 기준(routing 정책)까지 정해지지 않습니다." },
            { term: "Model Endpoint", description: "실제로 요청을 처리하는 provider의 구체적인 API 주소와 인증 정보입니다.", example: "같은 model alias 뒤에 Azure OpenAI endpoint와 원 OpenAI endpoint가 동시에 등록될 수 있습니다.", boundary: "Endpoint가 여러 개 등록돼 있어도 그 자체가 어느 것을 선택할지 정해 주지는 않습니다." },
            { term: "Provider Abstraction", description: "서로 다른 요청·응답 schema를 가진 provider를 같은 코드로 호출할 수 있게 감추는 설계입니다.", example: "OpenAI, Anthropic, Bedrock의 서로 다른 함수 시그니처를 하나의 completion() 호출로 통일.", boundary: "Schema가 같아진다고 model의 실제 동작(context 길이, tool 지원 여부)까지 같아지는 것은 아닙니다." },
            { term: "Unified Model API", description: "provider abstraction이 애플리케이션에 보여 주는 결과물로, 하나의 interface로 여러 provider를 부를 수 있게 만든 API입니다.", example: "LiteLLM의 completion() 하나로 100개 이상의 provider를 호출.", boundary: "Interface가 하나여도 provider별 요금·속도·정책 차이는 애플리케이션이 별도로 고려해야 합니다." },
          ]}
        />
      </section>

      <section id="routing-policy-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Router는 부하·지연·비용·능력·정책 중 무엇을 기준으로 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Model router는 unified API 뒤에 등록된 여러 model endpoint 후보 중 하나를
            실제로 고르는 구성 요소입니다. Request routing은 이 선택 행위 자체를
            가리키고, 그 기준은 다섯 가지로 나뉩니다.
          </p>
          <p>
            Load-based routing은 각 endpoint가 지금 처리 중인 요청 수나 큐 길이를
            기준으로 가장 한가한 곳을 고릅니다. Latency-aware routing은 최근 응답
            시간을 추적해 가장 빠르게 응답한 endpoint를 고릅니다.
          </p>
          <p>
            Cost-aware routing은 model·provider별 토큰 단가를 비교해 가장 저렴한
            후보를 고릅니다. Capability-aware routing은 요청이 필요로 하는 context
            길이나 tool 지원 여부를 만족하는 후보만 남깁니다. Policy-based routing은
            tenant별 예산이나 data region 같은 조직 규칙으로 후보를 제한합니다.
          </p>
          <p>
            이 다섯 기준은 서로 배타적이지 않고 실무에서는 여러 개를 겹쳐 씁니다.{" "}
            <Link to="/ai/llm-serving-ops#litellm-gateway">LLM 서빙 운영</Link> 글의
            capability-first model routing은 capability-aware routing으로 먼저
            후보를 걸러낸 뒤 나머지 기준으로 순위를 매기는 구체적인 조합 사례입니다.
          </p>
        </div>
        <TermBreakdown
          title="무엇을 기준으로 고르는가로 나눈 다섯 routing 정책"
          items={[
            { term: "Request Routing", description: "Unified API 뒤에 등록된 여러 model endpoint 후보 중 하나를 실제로 선택하는 행위입니다.", example: "같은 model alias 뒤에 3개 provider가 있으면 그중 하나로 요청을 보냅니다.", boundary: "어떤 기준으로 고르는지는 아래 다섯 정책 중 무엇을 쓰는지에 달려 있습니다." },
            { term: "Load-Based Routing", description: "각 endpoint가 처리 중인 요청 수·큐 길이를 기준으로 가장 한가한 곳을 고르는 정책입니다.", example: "Endpoint A가 대기 2건, B가 대기 15건이면 A로 보냅니다.", boundary: "가장 한가한 endpoint가 가격이 가장 비싸거나 필요한 기능을 지원하지 않을 수 있습니다." },
            { term: "Latency-Aware Routing", description: "최근 응답 시간을 추적해 가장 빠르게 응답한 endpoint를 고르는 정책입니다.", example: "최근 10건 평균 응답 시간이 A는 400ms, B는 900ms면 A를 우선합니다.", boundary: "일시적으로 빨랐던 endpoint가 다음 요청에서도 빠르다는 보장은 없습니다." },
            { term: "Cost-Aware Routing", description: "Model·provider별 토큰 단가를 비교해 가장 저렴한 후보를 고르는 정책입니다.", example: "같은 요청에 provider A는 1M output token당 10달러, B는 3달러면 B를 우선합니다.", boundary: "가장 저렴한 후보가 이번 요청에 필요한 context 길이를 지원하지 못할 수 있습니다." },
            { term: "Capability-Aware Routing", description: "요청이 필요로 하는 context 길이·tool 지원 같은 능력 조건을 만족하는 후보만 남기는 정책입니다.", example: "128K context가 필요한 요청에서 32K만 지원하는 endpoint를 후보에서 제외.", boundary: "능력 조건만 걸러내며, 남은 후보 중 무엇을 최종 선택할지는 다른 기준과 함께 써야 합니다." },
            { term: "Policy-Based Routing", description: "Tenant별 예산·data region 같은 조직 규칙으로 후보를 제한하는 정책입니다.", example: "EU 고객 요청은 EU 리전 endpoint로만 제한.", boundary: "조직 규칙은 성능·비용과 무관하게 우선 적용되므로 다른 기준보다 먼저 걸러야 합니다." },
            { term: "Model Router", description: "위 기준 중 하나 이상을 적용해 최종적으로 하나의 model endpoint를 선택하는 구성 요소입니다.", example: "capability로 먼저 거르고 남은 후보를 cost로 정렬하는 router 하나.", boundary: "Router가 정책을 잘못 조합하면(예: cost만 보고 capability를 안 봄) 요청 자체를 수행할 수 없는 후보를 고를 수 있습니다." },
          ]}
        />
      </section>

      <section id="model-cascade" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cascade는 확신이 낮을 때만 더 비싼 model로 넘어갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Cascaded inference는 저렴하고 빠른 model부터 순서대로 시도하다가, 결과가
            충분히 믿을 만하지 않으면 더 크고 비싼 model로 넘어가는 추론 방식입니다.
            이렇게 순서를 정한 model 목록을 model cascade라고 부릅니다.
          </p>
          <p>
            Confidence-based escalation은 각 model의 응답에 확신도를 매겨, 그 값이
            미리 정한 기준보다 낮을 때만 다음 model로 넘어가는 판단 규칙입니다.
            확신도가 충분하면 저렴한 model의 응답을 그대로 쓰고 상위 model은 아예
            호출하지 않습니다.
          </p>
          <p>
            이 방식은 모든 요청에 가장 비싼 model을 쓰는 것과, 모든 요청에 가장 싼
            model만 쓰는 것 사이의 절충입니다. 쉬운 요청은 싼 model이 이미 확신 있게
            답하므로 비싼 model 호출을 건너뛰고, 어려운 요청만 비싼 model로
            넘어갑니다.
          </p>
        </div>
        <LlmGatewayAndModelRoutingViz />
        <ExplainedFormula
          question="Cascade가 저렴한 model을 언제까지 믿고, 언제 다음 model로 넘어가나요?"
          idea="각 단계 model의 응답에 확신도를 매기고, 그 값이 threshold보다 낮으면 다음 단계로 넘어가며, 넘어갈 때마다 그 단계의 비용이 추가로 든다고 봅니다."
          formula={String.raw`\text{stage } i \text{ 채택} \iff \mathrm{conf}(y_i)\ge\theta_i \ \text{ or } \ i=L,\quad C=\sum_{i=1}^{k}c_i`}
          annotatedFormula={String.raw`\underbrace{\text{stage } i \text{ 채택} \iff \mathrm{conf}(y_i)\ge\theta_i \ \text{ or } \ i=L}_{\text{확신도가 기준을 넘거나 마지막 단계면 멈춤}},\quad \underbrace{C=\sum_{i=1}^{k}c_i}_{\text{실제로 호출한 단계까지의 비용 합}}`}
          operations={[
            { expression: String.raw`\mathrm{conf}(y_i)\ge\theta_i`, annotation: ["단계 i model의 응답 확신도가", "그 단계의 threshold 이상인지 비교합니다."] },
            { expression: String.raw`i=L`, annotation: ["더 넘어갈 다음 model이 없는", "마지막 단계인지 확인합니다."] },
            { expression: String.raw`\sum_{i=1}^{k}c_i`, annotation: ["실제로 호출한 1단계부터 k단계까지의", "비용만 더합니다(넘어가지 않은 단계는 제외)."] },
          ]}
          terms={[
            { symbol: "y_i", name: "단계 i 응답", description: "cascade의 i번째 model이 만든 응답입니다." },
            { symbol: "\\mathrm{conf}(y_i)", name: "확신도", description: "그 응답을 얼마나 믿을 수 있는지 매긴 점수입니다." },
            { symbol: "\\theta_i", name: "단계별 threshold", description: "그 단계에서 응답을 채택할 최소 확신도입니다." },
            { symbol: "L", name: "cascade 길이", description: "순서대로 준비된 model 단계의 총 개수입니다." },
            { symbol: "k", name: "실제 호출 단계 수", description: "이번 요청이 실제로 멈춘 단계까지의 번호입니다." },
            { symbol: "c_i", name: "단계 i 비용", description: "단계 i model 호출 한 번의 비용입니다." },
          ]}
          assumptions={[
            "확신도 점수(conf)가 실제 정답률과 상관관계가 있다고 가정합니다. 이 상관이 약하면 escalation 판단 자체가 부정확해집니다.",
            "각 단계는 이전 단계보다 비용이 크거나 같다고 가정합니다(그래야 '저렴한 model 먼저'라는 순서가 의미를 가집니다).",
          ]}
          interpretation="쉬운 요청 다수가 1단계에서 높은 확신도로 멈추면 전체 평균 비용은 마지막 단계 비용보다 훨씬 낮아집니다. FrugalGPT는 이런 cascade 구성으로 GPT-4 단독 사용 대비 최대 98%까지 비용을 줄이면서 비슷한 정확도를 유지하거나, 같은 비용에서 정확도를 더 높일 수 있다고 보고합니다. 다만 확신도 추정 자체가 틀리면 쉬운 요청이 상위 단계로 잘못 넘어가거나, 어려운 요청이 낮은 단계에서 잘못 멈출 수 있습니다."
        />
        <div id="paper-frugalgpt" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Chen, Zaharia, Zou · FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance (arXiv, 2023)"
            citeKey={1}
            href="https://arxiv.org/abs/2305.05176"
          >
            LLM API마다 가격 차이가 최대 두 자릿수에 이른다는 문제에서 출발해, prompt
            adaptation·LLM approximation과 함께 LLM cascade를 비용 절감 전략으로
            제시합니다. 어떤 model 조합을 어떤 질의에 쓸지 학습해, GPT-4 단독 사용과
            비슷한 성능을 최대 98% 낮은 비용으로 내거나 같은 비용에서 정확도를 최대
            4% 개선할 수 있다고 보고합니다. 다만 논문이 공개한 자료에는 confidence
            임계값을 정확히 어떻게 정하는지 구체적 알고리즘까지는 상세히 나오지
            않으며, 보고된 비용·정확도 수치는 논문이 실험한 질의 집합과 model 조합에
            한정된 자기보고 결과입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="fallback-model" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Fallback은 확신이 아니라 실패에 반응해 다른 model로 넘어갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Fallback model은 원래 고른 model이 실패했을 때 대신 요청을 처리하는
            대체 후보입니다. Cascade가 확신도라는 품질 신호로 미리 다음 단계를
            정해 두는 것과 달리, fallback은 timeout·rate limit·5xx 같은 실패
            신호가 실제로 발생했을 때만 반응합니다.
          </p>
          <p>
            Provider fallback은 이 대체가 같은 provider의 다른 model이 아니라 아예
            다른 provider로 넘어가는 경우입니다. 예를 들어 provider A가 장애로
            응답하지 못하면 같은 unified API 뒤에 등록된 provider B로 같은 요청을
            다시 보냅니다.
          </p>
          <p>
            <Link to="/ai/llm-serving-ops#litellm-gateway">LLM 서빙 운영</Link> 글의
            deadline-owned retry budget은 이 fallback을 몇 번까지, 얼마나 남은
            시간 안에서 허용할지를 정하는 운영 규칙입니다. 이 글은 fallback이라는
            개념 자체를, 그 글은 그 개념을 안전하게 실행하는 예산 관리를 다룹니다.
          </p>
        </div>
        <AlgorithmBlock
          title="확신도 기반 cascade와 실패 기반 fallback을 함께 쓰는 절차"
          input={["요청", "cascade 목록[stage 1..L]", "각 stage의 threshold", "provider fallback 목록"]}
          steps={[
            { code: "for stage in cascade:", note: "저렴한 model부터 순서대로 시도합니다." },
            { code: "    try: y ← call(stage.model, request)", note: "이 단계 model을 실제로 호출합니다." },
            { code: "    except (timeout, rate_limit, 5xx):", note: "확신도와 무관한 실행 실패가 나면" },
            { code: "        y ← call(fallback_provider, request); break", note: "cascade를 벗어나 provider fallback으로 즉시 전환합니다." },
            { code: "    if confidence(y) >= stage.threshold: return y", note: "확신도가 기준을 넘으면 여기서 멈추고 결과를 반환합니다." },
            { code: "return y  # 마지막 stage까지 못 넘으면 마지막 응답 사용", note: "더 넘어갈 stage가 없으면 마지막 결과를 그대로 씁니다." },
          ]}
          output="충분히 확신 있는 응답, 또는 fallback provider의 응답"
        />
        <TermBreakdown
          title="Cascade·fallback이 반응하는 신호의 차이"
          description="두 절차 모두 '다른 model로 넘어간다'는 점은 같지만 무엇에 반응하는지가 다릅니다."
          items={[
            { term: "Fallback Model", description: "원래 고른 model이 실패했을 때 대신 요청을 처리하는 대체 후보입니다.", example: "주 model이 rate limit에 걸리면 같은 provider의 다른 model로 재시도.", boundary: "확신도가 낮다는 이유만으로는 fallback이 발동하지 않으며, 실행 자체의 실패가 있어야 발동합니다." },
            { term: "Provider Fallback", description: "실패한 model의 대체가 같은 provider가 아니라 다른 provider로 넘어가는 fallback입니다.", example: "OpenAI가 장애면 같은 unified API 뒤의 Anthropic model로 전환.", boundary: "다른 provider는 응답 형식은 같아도 실제 동작(정책·데이터 처리 위치)이 다를 수 있습니다." },
          ]}
        />
      </section>
    </div>
  );
}
