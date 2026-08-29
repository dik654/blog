import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LlmMonitoringObservabilityAndDriftViz from "./llm-monitoring-observability-and-drift/viz/LlmMonitoringObservabilityAndDriftViz";

/**
 * LLM 운영 관측: trace·token/latency 분해·drift monitoring
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmMonitoringObservabilityAndDriftArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          관측은 대상 층을 나누고, drift는 분포 변화와 성능 변화를 나눠서 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 운영에서 “관측한다”는 말은 두 가지 서로 다른 질문에 답합니다. 하나는{" "}
            <em>무엇을 관측 대상으로 삼는가</em>이고, 다른 하나는{" "}
            <em>그 대상이 시간에 따라 어떻게 달라지는가</em>입니다. 두 질문을 섞으면
            “느려졌다”와 “틀리기 시작했다”를 구분하지 못합니다.
          </p>
          <p>
            앞의 질문은 production monitoring 아래 model, system, input, output monitoring
            네 층을 나누는 문제이고, 뒤의 질문은 data drift, concept drift, performance
            drift라는 세 가지 변화 축을 나누는 문제입니다.
          </p>
          <p>
            <Link to="/ai/llm-serving-ops#observability-aiops">LLM 서빙 운영</Link> 글은 이미
            SLI·error budget·burn rate로 “언제 사람을 호출할지”를 다뤘습니다. 이 글은 그 SLI를
            채우는 원재료, 즉 request 하나가 남기는 trace span 구조와 token/latency 분해, 그리고
            SLI가 서서히 나빠지는 원인을 가리키는 drift 축을 다룹니다. 겹치는 것은 링크로
            재사용하고 다시 정의하지 않습니다.
          </p>
          <p>
            이어지는 절은 관측 층 구분 → drift 세 종류 → trace/span 구조와 LLM observability →
            token·latency 분해 → GPU·queue 신호 → error classification과 trace sampling 순서로
            갑니다.
          </p>
        </div>
        <ContentBoundary article="llm-monitoring-observability-and-drift" />
      </section>

      <section id="monitoring-layers" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          관측 대상은 production 아래 네 개의 좁은 층으로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Production monitoring은 배포된 서비스가 실제 traffic 아래서 어떻게 동작하는지 보는
            가장 넓은 우산입니다. 그 안에 네 개의 좁은 층이 들어갑니다.
          </p>
          <p>
            Model monitoring은 모델이 만드는 output의 품질과 분포를 보고, system monitoring은
            GPU, queue, network 같은 infra 자원을 봅니다. Input monitoring은 들어오는 prompt와
            context의 분포를, output monitoring은 나가는 completion의 분포와 형식을 봅니다.
          </p>
          <p>
            층을 나누는 이유는 같은 증상이 다른 층에서 다른 원인을 가지기 때문입니다. p95
            latency가 늘었다면 system monitoring은 GPU utilization과 queue depth를 보고, input
            monitoring은 prompt 길이 분포가 길어졌는지를 봅니다. 둘 다 “느려졌다”는 같은
            production 증상을 만들지만 고치는 방법은 다릅니다.
          </p>
          <p>
            Output monitoring은 특히 LLM에서 중요합니다. Completion의 길이·형식·거부율·toxicity
            score 분포가 바뀌면, 모델 자체는 그대로여도 사용자가 받는 답이 달라진 것입니다. 이
            신호는 다음 절 drift 판정의 입력이 됩니다.
          </p>
        </div>
        <TermBreakdown
          title="관측 대상을 나누는 다섯 층"
          description="넓은 production monitoring 아래 네 개의 좁은 층이 있습니다. 층마다 지표와 원인이 다릅니다."
          items={[
            { term: "Production Monitoring", description: "배포된 서비스 전체를 실제 traffic 아래서 관측하는 가장 넓은 층입니다.", example: "요청 성공률, p50/p95 latency, 초당 요청 수.", boundary: "이 층만 보면 latency 증가가 GPU 부족 때문인지 prompt가 길어진 탓인지 구분하지 못합니다." },
            { term: "Model Monitoring", description: "모델이 만드는 output 자체의 품질·분포를 관측 대상으로 좁힌 층입니다.", example: "응답의 정답률, hallucination rate, 거부(refusal) 비율.", boundary: "모델 checkpoint를 바꾸지 않아도 input이 바뀌면 이 지표가 함께 움직입니다." },
            { term: "System Monitoring", description: "GPU·network·storage 같은 infra 자원 사용을 관측 대상으로 좁힌 층입니다.", example: "GPU utilization, queue depth, KV cache 사용량.", boundary: "Infra가 건강해도 model output 품질 문제는 이 층에서 보이지 않습니다." },
            { term: "Input Monitoring", description: "들어오는 prompt·context의 길이·주제·언어 분포를 관측 대상으로 좁힌 층입니다.", example: "이번 주 평균 prompt token 수가 지난주보다 3배로 늘어남.", boundary: "Input 분포 변화 자체는 아직 output 품질 저하를 증명하지 않습니다." },
            { term: "Output Monitoring", description: "나가는 completion의 길이·형식·유효성 분포를 관측 대상으로 좁힌 층입니다.", example: "JSON 형식 응답 중 parsing 실패 비율이 0.2%에서 4%로 증가.", boundary: "Output 분포가 바뀌었다는 사실만으로는 그 원인이 input 변화인지 model 자체 문제인지 알 수 없습니다." },
          ]}
        />
      </section>

      <section id="drift-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          세 drift는 입력, 관계, 결과 중 무엇이 변했는지로 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 drift는 같은 “시간이 지나며 뭔가 달라졌다”는 증상을 서로 다른 자리에서 가리킵니다.
            Data drift는 입력 분포 P(X)가 바뀐 것이고, concept drift는 입력과 정답 사이의 관계
            P(y|X)가 바뀐 것이며, performance drift는 실제로 측정한 model quality metric이
            떨어진 것입니다. 앞의 둘은 원인 쪽 분포이고 마지막은 결과 쪽 관측입니다.
          </p>
          <p>
            Gama 등의 concept drift survey는 이 구분을 결합분포 p(X,y)의 시점별 비교로
            정식화합니다. p(X)만 바뀌고 p(y|X)는 그대로면 virtual drift(이 글의 data drift에
            대응), p(y|X)가 바뀌면 real concept drift입니다. LLM 맥락에서 X는 prompt·context,
            y는 사용자가 만족할 정답이나 그 정답의 판정 기준입니다.
          </p>
          <p>
            예를 들어 지난달 평균 prompt 길이가 200 token이었는데 이번 달 600 token으로
            늘었다면 이것은 data drift입니다. 같은 질문 형식인데 사용자가 기대하는 답의 형식이
            “한 문장 요약”에서 “단계별 설명”으로 바뀌었다면 concept drift입니다.
          </p>
          <p>
            두 drift가 전혀 없어도 evaluator 자체의 noise나 계절적 사용 패턴만으로 정답률이
            흔들릴 수 있습니다. 그래서 performance drift는 둘의 결과이면서 동시에 독립적으로
            관측해야 하는 model quality metric입니다.
          </p>
        </div>
        <ExplainedFormula
          question="입력·출력 분포가 변했다는 관측 하나를 어떻게 서로 다른 두 원인으로 나눠 볼 수 있나요?"
          idea="한 시점의 결합분포는 입력 분포와 조건부 관계의 곱으로 쓸 수 있습니다. 두 시점을 비교할 때 어느 항이 바뀌었는지로 drift 종류를 가릅니다."
          formula={String.raw`p_t(X,y)=p_t(X)\,p_t(y\mid X)`}
          annotatedFormula={String.raw`p_t(X,y)=\underbrace{p_t(X)}_{\text{입력 분포 · data drift 대상}}\;\underbrace{p_t(y\mid X)}_{\text{입력-출력 관계 · concept drift 대상}}`}
          operations={[
            { expression: String.raw`p_t(X)`, annotation: ["시점 t의 prompt·context 분포로", "이 항만 시점 간에 달라지면 data drift입니다."] },
            { expression: String.raw`p_t(y\mid X)`, annotation: ["같은 입력 X에서 기대되는 정답·판정 기준의 분포로", "이 항이 달라지면 concept drift입니다."] },
          ]}
          terms={[
            { symbol: "X", name: "입력", description: "prompt, 첨부 context, 도구 결과처럼 모델이 받는 조건입니다." },
            { symbol: "y", name: "출력·판정", description: "사용자가 기대하는 응답이거나 그 응답을 맞다고 볼 기준입니다." },
            { symbol: "p_t(X)", name: "입력 분포", description: "시점 t에서 관측되는 입력들의 분포입니다." },
            { symbol: "p_t(y\\mid X)", name: "조건부 관계", description: "같은 입력에서 무엇을 정답으로 볼지 정하는 분포입니다." },
          ]}
          assumptions={[
            "p(X)와 p(y|X)는 embedding 분포·output 분포 같은 관측 가능한 proxy로 근사한다고 가정합니다.",
            "실제 정답 y는 지연되거나 아예 관측되지 않을 수 있어(delayed label), concept drift는 종종 proxy 판정 기준으로 대신 측정합니다.",
          ]}
          interpretation="p(X)만 바뀌면 항상 성능이 나빠지는 것은 아닙니다. 모델이 넓은 입력 범위를 이미 잘 처리한다면 data drift가 있어도 performance drift는 나타나지 않을 수 있습니다. 반대로 둘 다 안정적이어도 evaluator noise만으로 model quality metric이 흔들릴 수 있습니다."
        />
        <div id="paper-concept-drift-survey" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Gama, Žliobaitė, Bifet, Pechenizkiy, Bouchachia · A Survey on Concept Drift Adaptation (ACM Computing Surveys, 2014)"
            citeKey={1}
            href="https://doi.org/10.1145/2523813"
          >
            온라인 지도학습에서 입력과 목표 변수의 관계가 시간에 따라 변하는 현상을 concept
            drift로 정식화하고, 결합분포 p(X,y) 비교를 통해 입력 분포만 바뀌는 virtual
            drift(이 글의 data drift)와 조건부 관계가 바뀌는 real concept drift를 구분합니다.
            적응 전략의 분류와 평가 방법론을 다루지만, 특정 model·데이터셋에 대한 drift
            발생 여부를 보장하지는 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="trace-tree" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Request는 중첩된 trace span tree로 남고, 이것이 LLM observability입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Distributed tracing은 요청 하나가 여러 component를 거치는 경로를{" "}
            <span className="whitespace-nowrap">trace id</span>로 묶어 남기는 방법이고, 그
            경로의 각 작업 단위가 trace span입니다. Span은 같은 trace id를 공유하면서
            parent span id로 부모-자식 관계를 표현하므로, 한 trace는 평평한 목록이 아니라
            루트 span 아래 여러 자식 span이 중첩된 tree입니다.
          </p>
          <p>
            LLM observability는 이 일반적인 distributed tracing을 LLM 요청의 구조에 맞게
            구체화한 것입니다. 하나의 사용자 요청은 request trace라는 루트 span으로
            시작합니다.
          </p>
          <p>
            그 아래 retrieval trace(문서 검색), generation trace(모델 forward 호출), tool
            trace(외부 API나 함수 호출), agent trace(여러 generation·tool 호출을 묶는 상위
            루프)로 나뉜 자식 span이 붙습니다.
          </p>
          <p>
            예를 들어 “이 코드의 버그를 찾아줘”라는 요청은 request span 아래 retrieval
            span(관련 파일 검색) → generation span(원인 분석 생성) → tool span(테스트 실행)
            → 다시 generation span(결과 요약)이 순서대로 중첩됩니다. 이 tree가 있어야 “전체가
            8초 걸렸다”가 아니라 “테스트 실행에 5초를 썼다”를 알 수 있습니다.
          </p>
        </div>
        <LlmMonitoringObservabilityAndDriftViz />
        <TermBreakdown
          title="한 trace tree를 이루는 span 종류"
          items={[
            { term: "Distributed Tracing", description: "요청 하나가 여러 component를 거치는 경로를 trace id로 묶어 남기는 방법입니다.", example: "gateway → runtime → GPU worker를 지나는 요청 전체를 하나의 trace id로 연결.", boundary: "Trace id만으로는 각 구간이 얼마나 걸렸는지 알 수 없고 span이 있어야 합니다." },
            { term: "Trace Span", description: "trace 안에서 시작·종료 시각과 parent span id를 갖는 하나의 작업 단위입니다.", example: "retrieval 호출 하나가 120ms짜리 span 하나로 기록됩니다.", boundary: "Span 하나만 보면 그 작업이 전체 요청에서 사용자 latency에 얼마나 기여했는지는 tree 구조를 봐야 압니다." },
            { term: "LLM Observability", description: "request/retrieval/generation/tool/agent trace를 하나의 trace tree로 구성해 LLM 애플리케이션 실행을 재구성하는 관측 방식입니다.", example: "Langfuse·Arize Phoenix 같은 도구가 이 tree를 UI로 보여 줍니다.", boundary: "Tree를 남긴다고 원인이 자동으로 분류되지는 않으며, 다음 절의 error classification이 별도로 필요합니다." },
            { term: "Request Trace", description: "사용자 요청 하나 전체를 감싸는 루트 span입니다.", example: "채팅 메시지 하나가 도착한 순간 시작됩니다.", boundary: "루트 span의 총 시간은 자식 span 시간의 단순 합이 아니라 병렬 구간을 뺀 wall time입니다." },
            { term: "Generation Trace", description: "모델 forward 호출 한 번을 감싸는 span입니다.", example: "TTFT와 이후 token 생성 구간이 이 span 안에 들어갑니다.", boundary: "Generation span 하나가 여러 tool span 사이에 여러 번 나타날 수 있습니다." },
            { term: "Agent Trace", description: "여러 generation·tool 호출을 묶는 상위 루프를 감싸는 span입니다.", example: "코드 수정 agent가 5번 generation과 3번 tool 호출을 반복하는 구간 전체.", boundary: "Agent span은 하위 span들의 부모일 뿐 자체 계산 시간은 거의 없는 경우가 많습니다." },
            { term: "Tool Trace", description: "외부 API·함수 호출 한 번을 감싸는 span입니다.", example: "테스트 실행 명령이 끝날 때까지의 5초 구간.", boundary: "Tool span의 지연은 모델과 무관한 외부 시스템 원인일 수 있어 latency breakdown에서 따로 분리해야 합니다." },
            { term: "Retrieval Trace", description: "문서·context 검색 호출 한 번을 감싸는 span입니다.", example: "vector search 호출이 80ms 걸린 구간.", boundary: "Retrieval span이 빨라도 검색된 문서 품질(정확도)까지 보장하지는 않습니다." },
          ]}
        />
        <AlgorithmBlock
          title="요청 처리와 주기적 drift 점검을 함께 도는 절차"
          input={["incoming request", "trace collector", "reference window (기준 분포)", "sampling rate r"]}
          steps={[
            { code: "root_span ← start_span(request_id)  # request trace 시작", note: "trace id 하나를 이 요청 전체에 부여합니다." },
            { code: "for stage in [retrieval, generation, tool, ...]:", note: "요청이 실제로 거치는 구간만 자식 span으로 남깁니다." },
            { code: "    child ← start_span(parent=root_span, kind=stage)", note: "parent span id로 tree 위치를 고정합니다." },
            { code: "    run(stage); child.end()  # duration·token count·status 기록", note: "각 span에 latency와 error status를 함께 남깁니다." },
            { code: "root_span.end()", note: "루트 span 종료 시각이 사용자 체감 전체 latency의 끝입니다." },
            { code: "if sample(r): export(root_span, all_children)", note: "sampling rate r로 export할 trace만 고릅니다(다음 절)." },
            { code: "buffer.append(root_span.output_features)  # input/output 분포용 feature", note: "monitoring layer가 쓰는 input/output 분포 feature를 누적합니다." },
            { code: "every window_interval: compare(buffer, reference_window)", note: "input monitoring·output monitoring 신호로 data/concept drift 여부를 주기적으로 비교합니다." },
          ]}
          output="요청별 trace tree(디버깅용) + 주기적 drift 신호(운영 판단용)"
          repeatUntil="다음 window_interval마다 buffer를 비우고 반복합니다."
        />
        <div id="paper-opentelemetry-traces" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="OpenTelemetry · Traces (공식 문서)"
            citeKey={2}
            href="https://opentelemetry.io/docs/concepts/signals/traces/"
          >
            Trace를 요청이 애플리케이션을 통과하는 경로로, span을 그 경로를 이루는 작업
            단위로 정의합니다. 여러 span이 같은 trace id를 공유하면서 parent span id로
            부모-자식 관계를 맺어 tree를 이루며, 각 span은 이름·timestamp·attribute·event·
            status를 갖습니다. Vendor-neutral한 계측 표준이며 어떤 span 구조가 “올바른” LLM
            trace인지는 규정하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-langfuse-observability" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Langfuse · Observability Data Model (공식 문서)"
            citeKey={3}
            href="https://langfuse.com/docs/observability/data-model"
          >
            Trace를 “하나의 요청이나 작업을 나타내며 같은 trace id를 공유하는 모든
            observation의 논리적 그룹”으로 정의하고, LLM 호출·tool 호출·retrieval 단계 같은
            observation이 애플리케이션 구조를 반영해 중첩될 수 있다고 설명합니다. 이 글의
            request/generation/tool/retrieval trace 이름은 Langfuse의 정확한 API 이름이
            아니라 그 nested 구조를 일반화한 표현입니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="llm-monitoring-observability-and-drift" />
      </section>

      <section id="token-latency-breakdown" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Token throughput과 latency breakdown은 수와 시간을 나눠서 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Token usage는 한 요청이 소비·생성한 token 수 전체를 가리키며, input token count(
            prompt·context가 차지한 token 수)와 output token count(생성된 completion의 token
            수)로 나뉩니다. 이 둘은 비용과 latency 예산을 정하는 가장 기본적인 단위입니다.
          </p>
          <p>
            <Link to="/ai/vllm-serving#prefill-decode">vLLM 서빙</Link> 글은 이미 TTFT·ITL·
            TPOT로 latency를 시간 축에서 나눴습니다. 이 글이 추가하는 것은 <em>누구의
            시계로 재는가</em>라는 축입니다.
          </p>
          <p>
            Model latency breakdown은 GPU forward 계산만(prefill 계산 + decode 계산) 재고,
            application latency breakdown은 여기에 gateway routing, queue 대기, network
            전송까지 더한 사용자 체감 전체 시간을 잽니다. 같은 요청도 두 시계는 다른 숫자를
            보여 줍니다.
          </p>
          <p>
            Token throughput은 이 시간과 token 수를 하나의 비율로 묶습니다. Output token
            256개를 만드는 데 generation 구간이 3.2초 걸렸다면 throughput은 초당 80 token
            입니다. 같은 모델이라도 batch 크기나 KV cache 압박에 따라 이 값은 달라집니다.
          </p>
        </div>
        <ExplainedFormula
          question="TTFT와 output token 수가 주어졌을 때 전체 latency와 token throughput은 어떻게 계산되나요?"
          idea="전체 latency는 첫 token까지 걸린 TTFT에 나머지 token 사이 간격(ITL)을 더한 값이고, throughput은 실제로 만든 output token 수를 그 생성 구간 시간으로 나눈 비율입니다."
          formula={String.raw`T_{\mathrm{total}}=T_{\mathrm{TTFT}}+(N_{\mathrm{out}}-1)\,T_{\mathrm{ITL}},\quad R_{\mathrm{tok}}=\dfrac{N_{\mathrm{out}}}{T_{\mathrm{total}}-T_{\mathrm{TTFT}}}`}
          annotatedFormula={String.raw`T_{\mathrm{total}}=\underbrace{T_{\mathrm{TTFT}}}_{\text{첫 token까지}}+\underbrace{(N_{\mathrm{out}}-1)\,T_{\mathrm{ITL}}}_{\text{이후 token 생성 구간}},\quad R_{\mathrm{tok}}=\underbrace{\dfrac{N_{\mathrm{out}}}{T_{\mathrm{total}}-T_{\mathrm{TTFT}}}}_{\text{token throughput}}`}
          operations={[
            { expression: String.raw`T_{\mathrm{TTFT}}`, annotation: ["queue·prefill을 포함해 첫 token이 나올 때까지의 시간을", "전체 latency의 앞부분으로 고정합니다."] },
            { expression: String.raw`(N_{\mathrm{out}}-1)\,T_{\mathrm{ITL}}`, annotation: ["첫 token 이후 나머지 token 사이 평균 간격을", "생성한 token 수만큼 누적합니다."] },
            { expression: String.raw`\dfrac{N_{\mathrm{out}}}{T_{\mathrm{total}}-T_{\mathrm{TTFT}}}`, annotation: ["생성 구간에서 만든 output token 수를", "그 구간의 wall time으로 나눠 처리율을 얻습니다."] },
          ]}
          terms={[
            { symbol: "T_{\\mathrm{TTFT}}", name: "Time to first token", description: "요청 도착부터 첫 output token까지의 시간입니다." },
            { symbol: "T_{\\mathrm{ITL}}", name: "Inter-token latency", description: "연속된 두 output token 사이의 평균 간격입니다." },
            { symbol: "N_{\\mathrm{out}}", name: "Output token count", description: "이번 요청이 생성한 output token 수입니다." },
            { symbol: "R_{\\mathrm{tok}}", name: "Token throughput", description: "생성 구간에서 초당 만들어 낸 output token 수입니다." },
          ]}
          assumptions={[
            "T_ITL은 요청 하나 안에서 token마다 크게 다르지 않다고 가정한 평균값입니다.",
            "Model latency breakdown은 이 식에서 queue·network를 뺀 GPU 계산 시간만을 가리키므로, application latency breakdown과는 같은 요청에서도 값이 다릅니다.",
          ]}
          interpretation="Output 256 token, TTFT 0.4초, 전체 3.6초라면 생성 구간은 3.2초이고 throughput은 초당 80 token입니다. 이 숫자가 낮아졌을 때 model latency breakdown이 그대로라면 원인은 GPU가 아니라 queue·network 쪽 application 오버헤드에 있습니다."
        />
        <ProgressiveDetail
          title="Input token count는 왜 latency보다 비용·context budget에 먼저 영향을 주나요"
          preview="Input token count는 prefill 계산량을 늘리지만, 사용자가 체감하는 지연에는 output token 생성 구간만큼 직접적이지 않습니다."
        >
          <p>
            Input token count가 늘면 prefill 연산량이 늘어 TTFT가 함께 늘어날 수 있지만,
            증가 폭은 architecture와 batch 상황에 따라 다릅니다. 반면 context window budget과
            비용은 input token count에 거의 선형으로 비례하므로, 같은 latency SLO 안에서도
            input token count 상한을 별도로 관리해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="gpu-queue-monitoring" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          GPU 자원 신호와 queue 신호는 system monitoring 층의 두 축입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            GPU utilization monitoring은 GPU가 실제로 연산 중인 시간 비율을 재고, GPU memory
            monitoring은 KV cache·weight·activation이 차지한 메모리 양을 잽니다. 두 신호는
            같은 GPU에서 나오지만 병목이 다릅니다. Utilization은 낮은데 memory가 가득 찼다면
            batch를 못 키워서 GPU를 놀리고 있다는 뜻입니다.
          </p>
          <p>
            Queue depth는 지금 처리를 기다리는 요청 수이고, queue time은 한 요청이 그 줄에서
            실제로 기다린 시간입니다. Queue depth가 늘어도 처리 속도가 함께 빨라지면 queue
            time은 늘지 않을 수 있으므로, 두 지표를 같이 봐야 “밀리고 있다”를 확인할 수
            있습니다.
          </p>
          <p>
            이 네 신호는 system monitoring 층에 속하지만 앞 절의 trace span과 연결됩니다.
            Queue time은 request span의 시작 구간에, GPU utilization은 generation span이
            실행되는 동안의 배경 상태에 대응합니다.
          </p>
        </div>
        <TermBreakdown
          title="System monitoring을 이루는 GPU·queue 네 지표"
          items={[
            { term: "GPU Utilization Monitoring", description: "GPU가 실제로 연산 중인 시간의 비율을 재는 관측입니다.", example: "1초 중 780ms 동안 kernel이 실행되면 78%.", boundary: "Utilization이 높다고 그 연산이 유용한 batch를 처리 중이라는 뜻은 아닙니다(idle spin 등)." },
            { term: "GPU Memory Monitoring", description: "KV cache·weight·activation이 차지한 GPU 메모리 양을 재는 관측입니다.", example: "80GB 중 KV cache가 52GB를 사용.", boundary: "메모리 여유가 있어도 utilization이 낮으면 batch 크기 자체가 아니라 scheduling이 원인일 수 있습니다." },
            { term: "Queue Depth", description: "현재 처리를 기다리는 요청 수입니다.", example: "동시에 40개 요청이 대기 중.", boundary: "Queue depth 하나만으로는 그 요청들이 얼마나 오래 기다렸는지 알 수 없습니다." },
            { term: "Queue Time", description: "한 요청이 실제로 대기열에서 기다린 시간입니다.", example: "평균 대기 120ms, p99 대기 900ms.", boundary: "Queue time은 request trace의 앞부분(TTFT 이전 구간)에 포함되므로 latency breakdown과 이중 집계하지 않아야 합니다." },
          ]}
        />
      </section>

      <section id="error-sampling-debugging" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Trace sampling은 비용을, error classification은 원인을 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            모든 요청의 trace를 그대로 저장하면 저장·전송 비용이 traffic과 함께 커집니다. Trace
            sampling은 일부 요청(예: 1~10%)만 골라 전체 span을 export하고 나머지는 요약
            지표만 남기는 절충입니다. Sampling rate를 낮추면 비용은 줄지만 드문 실패를 잡을
            확률도 함께 줄어듭니다.
          </p>
          <p>
            Error classification은 실패한 요청을 timeout, invalid output, tool failure,
            upstream 5xx 같은 원인별 범주로 나누는 절차입니다. 같은 “실패율 2%”도 timeout이
            대부분이면 queue·GPU 문제이고, invalid output이 대부분이면 model이나 prompt 문제로
            원인이 갈립니다.
          </p>
          <p>
            Production debugging은 이 분류와 trace tree를 실제 사고 조사에 쓰는 활동입니다.
            Error 분류로 “어떤 종류가 늘었는지”를 좁히고, 그 종류에 해당하는 sampled trace를
            열어 “그 요청에서 어느 span이 실패를 만들었는지”를 확인하는 순서로 진행합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Sampling rate를 낮추면 드문 실패를 놓칠 위험은 얼마나 커지나요?"
          idea="실패율이 낮은 사건일수록 표본에 한 번도 걸리지 않을 확률이 커집니다. 요청 N개 중 sampling rate r로 뽑았을 때, 발생률 p인 실패가 표본에 한 번도 안 걸릴 확률은 기하적으로 줄어듭니다."
          formula={String.raw`P(\text{놓침})=(1-p\,r)^{N}`}
          annotatedFormula={String.raw`P(\text{놓침})=\underbrace{(1-\underbrace{p\,r}_{\text{한 요청이 실패이면서 표본에 걸힐 확률}})^{N}}_{\text{N개 요청 모두에서 놓칠 확률}}`}
          operations={[
            { expression: String.raw`p\,r`, annotation: ["실패 발생률 p와 sampling rate r을 곱해", "한 요청이 표본에 걸리는 실패일 확률을 만듭니다."] },
            { expression: String.raw`(1-p\,r)^{N}`, annotation: ["한 번도 안 걸릴 확률을", "N개 요청에 걸쳐 반복 곱합니다."] },
          ]}
          terms={[
            { symbol: "p", name: "실패 발생률", description: "전체 요청 중 문제의 실패가 실제로 발생하는 비율입니다." },
            { symbol: "r", name: "Trace sampling rate", description: "요청 중 전체 span을 export하는 비율입니다(예: 0.05)." },
            { symbol: "N", name: "관측 기간의 요청 수", description: "같은 기간 동안 들어온 전체 요청 수입니다." },
          ]}
          assumptions={[
            "각 요청의 실패 여부와 sampling 선택이 독립이라고 가정합니다.",
            "실제 sampling은 균일 무작위가 아니라 error·latency 기반 tail sampling을 섞는 경우가 많아 이 식은 균일 sampling의 하한 추정치입니다.",
          ]}
          interpretation="실패율 0.1%, sampling rate 5%, 요청 2,000건이면 그 실패를 한 번도 못 볼 확률은 약 90%입니다. 드문 실패를 확실히 잡으려면 균일 sampling만으로는 부족하고, error 발생 시 100% 강제 export하는 tail sampling을 함께 둬야 합니다."
        />
        <AlgorithmBlock
          title="Error classification으로 production debugging 범위를 좁히는 절차"
          input={["실패한 요청 집합", "원인 범주 목록(timeout, invalid output, tool failure, upstream error)", "sampled trace store"]}
          steps={[
            { code: "for r in failed_requests: r.category ← classify(r.status, r.span_tree)", note: "trace tree의 어느 span이 실패 status를 냈는지로 범주를 정합니다." },
            { code: "counts ← group_by(category)", note: "범주별 건수를 세어 어떤 원인이 늘었는지 비교합니다." },
            { code: "top ← argmax(counts)", note: "가장 많이 늘어난 범주부터 조사합니다." },
            { code: "sample ← pick_traces(top, force_exported=True)", note: "해당 범주의 실패는 sampling rate와 무관하게 강제로 열람 가능해야 합니다." },
            { code: "root_cause ← inspect(sample.span_tree)  # 어느 span, 몇 ms, 어떤 error", note: "trace tree를 열어 실패를 만든 구체적 span과 시점을 확인합니다." },
          ]}
          output="원인 범주별 우선순위와, 그 범주를 설명하는 구체적 trace 근거"
        />
        <TermBreakdown
          title="이미 다룬 개념과의 경계"
          description="이 절의 개념은 앞 절의 trace tree·drift 신호를 실제 조사에 쓰는 마지막 단계입니다."
          items={[
            { term: "Trace Sampling", description: "일부 요청만 전체 span을 export하고 나머지는 요약 지표만 남기는 비용·커버리지 절충입니다.", example: "평시 5% sampling, error 발생 시 100% 강제 export.", boundary: "Sampling rate가 낮으면 드문 실패를 통계적으로 놓칠 확률이 커집니다(위 식 참고)." },
            { term: "Error Classification", description: "실패 요청을 원인 범주로 나누는 절차입니다.", example: "timeout 62%, invalid output 21%, tool failure 17%.", boundary: "범주 정의가 성기면 서로 다른 원인이 같은 범주에 뒤섞입니다." },
            { term: "Production Debugging", description: "error classification과 trace tree를 함께 써서 실제 사고의 원인 span을 찾는 활동입니다.", example: "timeout 급증 원인이 queue time 증가임을 trace로 확인.", boundary: <>이 글이 다루는 것은 원인을 찾는 관측 구조까지이며, 자동 rollback·scale 같은 대응은 <Link to="/ai/llm-serving-ops#observability-aiops">LLM 서빙 운영</Link> 글의 범위입니다.</> },
          ]}
        />
      </section>
    </div>
  );
}
