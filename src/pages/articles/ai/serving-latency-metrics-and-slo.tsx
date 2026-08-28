import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ServingLatencyMetricsAndSloViz from "./serving-latency-metrics-and-slo/viz/ServingLatencyMetricsAndSloViz";
import LatencyPercentileHistogramViz from "./serving-latency-metrics-and-slo/viz/LatencyPercentileHistogramViz";

/**
 * TTFT·TPOT·ITL 은 분포로 읽고 SLO 는 percentile 로 계약합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function ServingLatencyMetricsAndSloArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          평균 latency 한 줄로는 LLM serving 의 품질을 말할 수 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 요청 하나는 첫 token 이 나오기까지의 시간과 그 뒤 token 사이의 간격이
            전혀 다른 원인으로 정해집니다. 그래서 serving 품질은 latency 하나가 아니라
            TTFT·TPOT·ITL·E2E 네 지표를 따로 재고, 각 지표를 평균이 아닌 분포로 읽은 뒤,
            percentile 에 대한 약속인 SLO 로 계약합니다.
          </p>
          <p>
            이 글은 그 세 단계를 순서대로 다룹니다. 먼저 vLLM 과 GenAI-Perf 가 실제로
            계산하는 식으로 네 지표와 throughput 을 정의하고, 다음으로 요청 100개의 표본에서
            P50·P95·P99 를 손으로 뽑아 꼬리가 왜 생기는지 봅니다. 마지막으로 SLO 를
            window 와 violation budget 으로 판정하는 절차를 씁니다.
          </p>
          <p>
            지표가 어느 timestamp 에서 나오는지는{" "}
            <Link to="/ai/vllm-serving#prefill-decode">vLLM 입문</Link>의 request lifecycle 을
            전제로 합니다. Benchmark 를 어떻게 돌려야 이 숫자가 재현되는지(warm·cold,
            saturation 곡선)는 다음 배치의 serving benchmark methodology 글이 맡습니다.
          </p>
        </div>
        <ServingLatencyMetricsAndSloViz />
        <ContentBoundary article="serving-latency-metrics-and-slo" />
      </section>

      <section id="metrics" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          E2E 는 TTFT 와 (n−1) 개의 token 간격으로 정확히 분해됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청이 서버에 도착한 시각을 0 으로 두면, 첫 token 이 client 에 닿는 시각이
            Time to First Token(TTFT) 이고 마지막 token 이 닿는 시각이 End-to-End latency(E2E)
            입니다. 그 사이에 token 이 n 개 흘러갔다면 간격은 n−1 개이며, 간격 하나하나가
            Inter-Token Latency(ITL) 입니다.
          </p>
          <p>
            Time per Output Token(TPOT) 은 그 간격들의 요청 단위 평균입니다. vLLM 의
            benchmark 는 <code>(latency − ttft) / (output_len − 1)</code> 로 TPOT 를 계산하고,
            ITL 은 streaming 응답에서 chunk 가 도착할 때마다 잰 간격을 목록 그대로 모읍니다.
            같은 요청에서 TPOT 는 값 하나, ITL 은 n−1 개의 값입니다.
          </p>
          <p>
            숫자를 넣어 보면 TTFT 1 s, TPOT 50 ms 인 서버가 200 token 을 내면 E2E 는
            1 + 199 × 0.05 = 10.95 s 입니다. 같은 서버에서 TPOT 만 30 ms 로 줄이면 E2E 는
            6.97 s 가 되고, TTFT 를 0.3 s 로 줄여도 E2E 는 10.25 s 에 머뭅니다. 긴 응답에서는
            decode 간격이, 짧은 응답에서는 TTFT 가 E2E 를 지배합니다.
          </p>
          <p>
            TTFT 안에는 gateway 와 queue 에서 기다린 시간, prefill 계산 시간이 함께 들어
            있습니다. 그래서 TTFT 가 나빠졌을 때 prompt 가 길어진 것인지 대기열이 길어진
            것인지는 TTFT 만으로 구분되지 않고, 그 분해는{" "}
            <Link to="/ai/vllm-serving#prefill-decode">latency decomposition</Link> 계약이
            맡습니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 요청의 E2E latency 는 어떤 항으로 정확히 나뉘나요?"
          idea="첫 token 까지의 시간과 그 뒤 token 사이 간격의 합으로 나누면, 두 항이 서로 다른 원인(queue·prefill 대 decode step)을 가리킵니다."
          formula={String.raw`\mathrm{E2E}=\mathrm{TTFT}+\sum_{k=1}^{n-1}\mathrm{ITL}_k=\mathrm{TTFT}+(n-1)\cdot\mathrm{TPOT}`}
          annotatedFormula={String.raw`\mathrm{E2E}=\underbrace{\mathrm{TTFT}}_{\text{queue + prefill + 첫 token 전송}}+\underbrace{\sum_{k=1}^{n-1}\mathrm{ITL}_k}_{\text{decode 간격 n−1 개의 합}},\qquad \underbrace{\mathrm{TPOT}=\frac{\mathrm{E2E}-\mathrm{TTFT}}{n-1}}_{\text{간격의 요청 단위 평균}}`}
          operations={[
            { expression: String.raw`\mathrm{TTFT}`, annotation: ["요청 도착부터 첫 token 수신까지를 재어", "대기·prefill 병목을 한 값으로 요약"] },
            { expression: String.raw`\sum_{k=1}^{n-1}\mathrm{ITL}_k`, annotation: ["n−1 개의 token 간격을 모두 더해", "decode 구간의 총 시간 구성"] },
            { expression: String.raw`\mathrm{TPOT}=\frac{\mathrm{E2E}-\mathrm{TTFT}}{n-1}`, annotation: ["decode 총 시간을 간격 수로 나눠", "요청 하나의 평균 token 간격 산출"] },
          ]}
          terms={[
            { symbol: "n", name: "Output token 수", description: "요청이 실제로 생성한 token 수입니다. 첫 token 도 포함하므로 간격은 n−1 개입니다." },
            { symbol: String.raw`\mathrm{ITL}_k`, name: "k 번째 token 간격", description: "k 번째와 k+1 번째 token 이 client 에 도착한 시각의 차입니다." },
            { symbol: String.raw`\mathrm{TPOT}`, name: "Time per Output Token", description: "간격들의 산술평균이며 vLLM 은 output_len 이 2 이상인 요청에서만 계산합니다." },
          ]}
          assumptions={["Token 도착 시각을 client 쪽에서 잰다는 전제입니다. 서버 내부 timestamp 로 재면 network 전송 시간이 빠집니다.", "Streaming 이 chunk 하나에 token 여러 개를 실어 보내면 GenAI-Perf 처럼 간격을 chunk 의 token 수로 나눠야 ITL 이 됩니다."]}
          interpretation="E2E 가 같아도 TTFT 가 큰 요청과 TPOT 가 큰 요청은 다른 병목을 가리킵니다. 두 항을 항상 따로 보고해야 하고, 평균 TPOT 가 같다는 사실이 간격이 고르다는 뜻은 아닙니다."
        />
        <TermBreakdown
          title="네 latency 지표가 각각 무엇을 재는지"
          description="같은 요청 timeline 위에서 잰 값이지만 표본의 단위가 다릅니다."
          items={[
            { term: "TTFT", description: "요청 도착부터 첫 token 수신까지의 시간입니다. 요청당 값 하나입니다.", example: "Queue 0.2 s + prefill 0.3 s 면 TTFT 0.5 s 입니다.", boundary: "Non-streaming 응답에서는 첫 token 시각을 잴 수 없어 E2E 와 같아집니다." },
            { term: "ITL", description: "연속한 두 token 의 도착 시각 차입니다. 요청당 n−1 개의 값입니다.", example: "간격이 40, 45, 200, 42 ms 면 ITL 표본 4개입니다.", boundary: "Chunk 에 token 여러 개가 묶이면 chunk 간격을 token 수로 나눠 씁니다." },
            { term: "TPOT", description: "한 요청의 ITL 평균입니다. 요청당 값 하나입니다.", example: "위 표본의 TPOT 는 (40+45+200+42)/4 ≈ 82 ms 입니다.", boundary: "200 ms 의 멈춤이 평균 속에 묻히므로 streaming 체감을 대표하지 못합니다." },
            { term: "E2E", description: "요청 도착부터 마지막 token 수신까지의 시간입니다.", example: "TTFT 1 s + 199 × 50 ms = 10.95 s 입니다.", boundary: "응답 길이에 비례하므로 길이 분포가 다른 두 workload 의 E2E 는 직접 비교하지 않습니다." },
          ]}
        />
      </section>

      <section id="throughput" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Batch 를 키우면 tokens/s 는 오르고 ITL 은 같이 늘어납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Throughput 은 서버 전체가 단위 시간에 처리한 양입니다. vLLM benchmark 는 완료된
            요청 수를 측정 시간으로 나눈 request throughput(RPS) 과, 생성한 output token 총수를
            측정 시간으로 나눈 output token throughput(tokens/s) 을 따로 냅니다. 둘 다
            benchmark 한 번에 값 하나이며 요청별 분포가 없습니다.
          </p>
          <p>
            Latency 와 throughput 이 맞서는 이유는 decode step 의 비용 구조에 있습니다.
            Decode 는 weight 를 한 번 읽어 batch 안의 모든 요청에 token 하나씩을 주므로,
            batch 가 커져도 step 시간은 요청 수에 비례해 늘지 않습니다. 대신 그 step 시간이
            batch 안 모든 요청의 ITL 이 됩니다.
          </p>
          <p>
            Step 시간이 batch 1 에서 20 ms, 8 에서 28 ms, 32 에서 50 ms 라고 두면 tokens/s 는
            50, 286, 640 으로 오르고 ITL 은 20, 28, 50 ms 로 늘어납니다. 요청 하나만 보면
            batch 32 는 2.5 배 느린 서버이고, GPU 전체로 보면 12.8 배 많은 일을 하는
            서버입니다. 어느 쪽이 맞는지는 SLO 가 정합니다.
          </p>
          <p>
            Batch 가 채워지는 것 자체가 두 번째 비용을 만듭니다. 도착률이 처리율에 가까워지면
            요청은 batch 자리를 기다리고, 그 대기가 TTFT 에 더해집니다.{" "}
            <Link to="/ai/llm-serving-ops#paper-little-law">Little&apos;s law</Link> 대로
            대기열 길이는 도착률 × 체류 시간이므로, 처리율의 90 % 를 넘긴 구간에서는 throughput
            이 거의 늘지 않는데 TTFT 만 가파르게 오르는 구간이 나타납니다.
          </p>
          <p>
            그래서 throughput 은 항상 어떤 latency 조건 아래의 값인지 붙여 말합니다. 조건을
            통과한 요청만 세는 <Link to="/ai/vllm-serving#serving-goodput">goodput</Link> 이
            그 표기이며, 조건 없는 tokens/s 는 batch 를 무한히 키운 상한에 가깝습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Batch 크기 B 에서 tokens/s 와 ITL 은 같은 양에서 어떻게 갈라지나요?"
          idea="한 decode step 시간 t(B) 는 batch 안 모든 요청이 공유합니다. 그 값을 요청 하나가 보면 ITL 이고, 서버 전체가 보면 B 개 token 을 t(B) 마다 낸 throughput 입니다."
          formula={String.raw`\mathrm{ITL}(B)=t(B),\qquad \mathrm{tokens/s}(B)=\frac{B}{t(B)},\qquad \mathrm{RPS}=\frac{N_{\text{done}}}{T}`}
          annotatedFormula={String.raw`\underbrace{\mathrm{ITL}(B)=t(B)}_{\text{요청 하나가 겪는 step 시간}},\qquad \underbrace{\mathrm{tokens/s}(B)=\frac{B}{t(B)}}_{\text{step 마다 B 개 token 을 내는 서버 처리량}},\qquad \underbrace{\mathrm{RPS}=\frac{N_{\text{done}}}{T}}_{\text{측정 시간 T 동안 완료한 요청 수}}`}
          operations={[
            { expression: String.raw`t(B)`, annotation: ["batch B 의 한 decode step 시간을 재어", "그 값을 모든 요청의 ITL 로 배정"] },
            { expression: String.raw`\frac{B}{t(B)}`, annotation: ["step 당 token 수 B 를 step 시간으로 나눠", "서버 단위 output token throughput 산출"] },
            { expression: String.raw`\frac{N_{\text{done}}}{T}`, annotation: ["완료 요청 수를 측정 시간으로 나눠", "요청 단위 throughput 산출"] },
          ]}
          terms={[
            { symbol: "B", name: "Decode batch 크기", description: "한 step 에 함께 token 을 내는 요청 수입니다." },
            { symbol: "t(B)", name: "Step 시간", description: "Weight 읽기 비용이 지배해 B 에 대해 sublinear 하게 늘어나는 한 iteration 의 시간입니다." },
            { symbol: String.raw`N_{\text{done}}`, name: "완료 요청 수", description: "측정 구간 T 안에 마지막 token 까지 받은 요청의 수입니다." },
          ]}
          assumptions={["Prefill 이 끼어들지 않는 순수 decode step 을 가정합니다. Chunked prefill 이 섞이면 t(B) 에 prefill chunk 비용이 더해집니다.", "t(B) 가 sublinear 한 구간은 memory-bound 인 동안만이며, batch 가 compute-bound 로 넘어가면 tokens/s 증가가 멈춥니다."]}
          interpretation="tokens/s 와 ITL 은 같은 t(B) 의 두 얼굴이라 한쪽만 좋게 만들 수 없습니다. 운영 질문은 ITL 상한을 정한 뒤 그 아래에서 B 를 얼마나 키울 수 있는가로 바뀝니다."
        />
        <ProgressiveDetail
          title="Tokens/s 가 두 배인데 사용자가 더 느리다고 느끼는 일이 왜 생기나요?"
          preview="서버 tokens/s 는 batch 합산이고 사용자는 자기 요청의 ITL 만 봅니다. 두 숫자는 같은 step 시간을 다른 분모로 나눈 값입니다."
        >
          <p>
            Batch 8 과 batch 32 를 비교하면 서버 tokens/s 는 286 에서 640 으로 오르지만
            각 사용자가 받는 속도는 1/0.028 ≈ 36 token/s 에서 1/0.05 = 20 token/s 로
            떨어집니다. 사용자당 token/s 를 따로 적지 않으면 두 서버의 체감 차이가 보고서에서
            사라집니다.
          </p>
          <p>
            같은 이유로 "tokens/s 2 배" 라는 주장은 batch 크기, 입력·출력 길이 분포, 어떤
            latency 조건 아래였는지가 붙어야 비교 가능합니다. 이 조건을 고정하는 실행 절차는
            다음 배치의 benchmark methodology 글에서 다룹니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="distribution" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Latency 는 오른쪽 꼬리가 긴 분포라 percentile 로 읽어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            요청마다 latency 가 다르므로 한 benchmark 는 TTFT 표본 수백 개를 남깁니다.
            그 표본을 작은 값부터 정렬했을 때 p % 위치의 값이 Pp percentile latency 이고,
            P50 이 중앙값입니다. 요청의 절반은 P50 보다 빠르고, 95 % 는 P95 보다 빠르며,
            100 명 중 한 명은 P99 보다 오래 기다립니다.
          </p>
          <p>
            요청 100개의 TTFT 를 정렬했더니 50 번째가 0.7 s, 95 번째가 1.45 s, 99 번째가
            2.4 s, 가장 느린 값이 4.0 s 였다고 합시다. Nearest-rank 정의로 P50 = 0.7 s,
            P95 = 1.45 s, P99 = 2.4 s 이고 평균은 0.90 s 입니다. 평균이 중앙값보다 큰 것은
            오른쪽 꼬리 몇 개가 평균을 끌어올렸기 때문입니다.
          </p>
          <p>
            이 꼬리 부분이 tail latency 입니다. Serving 에서 꼬리는 우연이 아니라 구조에서
            나옵니다. 긴 prompt 는 prefill 이 길고, 대기열 뒤에 선 요청은 앞 요청의 prefill 을
            기다리며, KV cache 가 차서 preempt 된 요청은 다시 prefill 을 겪습니다. 꼬리를
            줄이려면 그 원인을 하나씩 찾아야 하고, 평균을 줄이는 최적화는 꼬리에 거의 닿지
            않습니다.
          </p>
          <p>
            Streaming UX 에서는 ITL 의 분산이 P50 보다 먼저 보입니다. 평균 간격 50 ms 로
            고르게 흐르는 응답과, 40 ms 로 흐르다 300 ms 씩 멈추는 응답은 TPOT 가 비슷해도
            사용자는 후자를 끊긴다고 느낍니다. 그래서 ITL 은 요청별 평균이 아니라 간격
            전체를 표본으로 두고 P99 를 봅니다. vLLM 이 TPOT 와 별도로 ITL 목록을 모아 두는
            이유가 이것입니다.
          </p>
          <p>
            Google SRE Book 의 SLO 장이 latency 에 평균 대신 percentile 을 쓰라고 하는 근거도
            같습니다. 사용자는 조금 느리지만 일정한 시스템을 분산이 큰 시스템보다 선호하며,
            99.9 번째 percentile 이 좋으면 전형적 경험은 확실히 좋습니다.
          </p>
        </div>
        <LatencyPercentileHistogramViz />
        <ExplainedFormula
          question="정렬한 latency 표본에서 P95 는 정확히 몇 번째 값인가요?"
          idea="표본 N 개를 오름차순으로 정렬한 뒤, 전체의 p % 가 그 아래에 오도록 순위를 올림해서 고릅니다."
          formula={String.raw`P_p=x_{(\lceil p\cdot N/100\rceil)},\qquad x_{(1)}\le x_{(2)}\le\cdots\le x_{(N)}`}
          annotatedFormula={String.raw`P_p=\underbrace{x_{(\lceil p\cdot N/100\rceil)}}_{\text{정렬 표본에서 올림한 순위의 값}},\qquad \underbrace{x_{(1)}\le\cdots\le x_{(N)}}_{\text{오름차순 order statistics}}`}
          operations={[
            { expression: String.raw`\lceil p\cdot N/100\rceil`, annotation: ["p % 에 해당하는 순위를 올림해", "N=100, p=95 이면 95 번째 순위 결정"] },
            { expression: String.raw`x_{(\lceil p\cdot N/100\rceil)}`, annotation: ["그 순위의 정렬 표본을 읽어", "P95 latency 값 산출"] },
          ]}
          terms={[
            { symbol: "N", name: "표본 수", description: "측정 window 안에서 완료된 요청(또는 ITL 간격)의 수입니다." },
            { symbol: String.raw`x_{(k)}`, name: "k 번째 order statistic", description: "정렬한 표본의 k 번째 값입니다." },
            { symbol: "p", name: "Percentile", description: "50 이면 중앙값, 95·99 는 꼬리 근처의 값입니다." },
          ]}
          assumptions={["Nearest-rank 정의입니다. NumPy 기본값과 vLLM benchmark 는 인접 두 순위를 선형 보간하므로 표본이 적으면 소수점 둘째 자리에서 값이 다를 수 있습니다.", "P99 는 표본이 100 개면 값 하나에 좌우됩니다. 꼬리 percentile 일수록 window 안 표본 수가 충분해야 안정합니다."]}
          interpretation="P95 는 가장 느린 5 % 의 경계이지 그 5 % 가 얼마나 느린지는 말하지 않습니다. 최댓값이나 P99.9 까지 함께 봐야 꼬리의 길이가 드러납니다."
        />
      </section>

      <section id="slo" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          SLO 는 percentile 과 window 와 허용 위반율을 함께 적은 약속입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Service-Level Objective(SLO) 는 측정 지표(SLI) 에 대한 목표값입니다. SRE Book 의
            표기는 "Get RPC 의 99 % 가 100 ms 안에 완료된다" 처럼 percentile, 임계값, 그리고
            그것을 어느 기간에 걸쳐 만족해야 하는지를 한 문장에 담습니다. LLM serving 에서는
            "5 분 window 마다 P95 TTFT ≤ 1.5 s, 하루 window 의 99 % 만족" 이 그 꼴입니다.
          </p>
          <p>
            SLO 위반은 두 층으로 나뉩니다. 한 window 에서 P95 TTFT 가 1.5 s 를 넘으면 그
            window 가 위반이고, 하루 288 개 window 중 위반 window 가 허용 비율 1 %(2.88 개,
            내림해 2 개) 를 넘으면 SLO 자체가 위반입니다. 위반 window 가 5 개면 위반율
            1.74 % 로 SLO 를 어긴 것이고 3 개면 아직 budget 안입니다.
          </p>
          <p>
            앞의 100 표본 예에서는 P95 가 1.45 s 라 그 window 는 통과합니다. 같은 표본을
            요청 단위로 세면 1.5 s 를 넘긴 요청이 5 개, 즉 95 % 가 목표 안에 있어 "요청의
            95 % 가 1.5 s 안" 이라는 다른 표기로도 경계에서 통과합니다. 두 표기는 표본이 클 때 같아지지만
            window 당 표본이 적을 때 percentile 표기가 더 요동칩니다.
          </p>
          <p>
            허용 위반율이 곧 error budget 입니다. 100 % 만족을 요구하면 어떤 배포도 할 수
            없으므로 1 % 의 window 는 나쁠 수 있다고 미리 인정하고, 그 budget 을 얼마나 빨리
            쓰는지는 <Link to="/ai/llm-serving-ops#observability-aiops">burn rate</Link> 로
            봅니다. 외부에 약속한 SLO 보다 조금 엄격한 내부 SLO 를 두면 budget 이 바닥나기 전에
            손쓸 여유가 생깁니다.
          </p>
          <p>
            SLO 는 앞 절의 trade-off 를 닫는 열쇠이기도 합니다. "P99 ITL ≤ 80 ms" 를 정하면
            step 시간이 80 ms 를 넘지 않는 최대 batch 가 정해지고, 그 batch 에서 나오는
            tokens/s 가 이 서버의 goodput 입니다.{" "}
            <Link to="/ai/llm-serving-capacity#capacity-admission">Admission 상한</Link>도 memory
            가 아니라 이 SLO 에서 먼저 막힙니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Window 단위 SLO 판정과 violation budget 계산"
          input={["SLI 정의(예: TTFT, client 수신 시각 기준)", "percentile p 와 임계값 θ (예: P95 ≤ 1.5 s)", "window 길이 W 와 평가 기간 D (예: 5 분, 1 일)", "허용 위반율 β (예: 1 %)", "window 당 최소 표본 수 N_min"]}
          steps={[
            { code: "for each window w in D:", note: "평가 기간을 겹치지 않는 window 로 자릅니다. 기간 D 에는 D/W 개의 window 가 있습니다." },
            { code: "  samples ← SLI values of requests completed in w", note: "완료 시각 기준으로 표본을 모읍니다. 진행 중인 긴 요청은 다음 window 로 밀려 꼬리를 숨길 수 있습니다." },
            { code: "  if |samples| < N_min: mark w as insufficient; continue", note: "표본이 적은 window 의 P95 는 값 하나에 흔들리므로 판정에서 제외하고 따로 셉니다." },
            { code: "  sort samples; P ← samples[ceil(p·|samples|/100)]", note: "Nearest-rank 로 percentile 을 뽑습니다. 보간 방식은 SLO 문서에 고정해 둡니다." },
            { code: "  violated[w] ← (P > θ)", note: "Window 하나의 SLO 위반 여부입니다." },
            { code: "budget ← floor(β · |windows|)", note: "1 일 288 개 window, β = 1 % 면 budget 은 2 개입니다." },
            { code: "violation_rate ← count(violated) / |windows|", note: "위반 window 수를 전체 window 수로 나눈 값이 SLO 위반율입니다." },
          ]}
          repeatUntil="평가 기간 D 가 끝나거나 count(violated) 가 budget 을 넘는 순간 알림을 냅니다."
          output="SLO 만족 여부(violation_rate ≤ β), 남은 budget, insufficient window 수"
        />
        <TermBreakdown
          title="SLO 문장을 쓸 때 빠뜨리면 판정이 달라지는 항목"
          items={[
            { term: "SLI 와 측정 지점", description: "무엇을 어디서 재는지입니다.", example: "TTFT 를 client 수신 시각으로 잴지 서버 첫 token 생성 시각으로 잴지.", boundary: "측정 지점이 다르면 같은 서버의 P95 가 수백 ms 차이 납니다." },
            { term: "Percentile 과 임계값", description: "분포의 어느 지점을 얼마 이하로 둘지입니다.", example: "P95 TTFT ≤ 1.5 s, P99 ITL ≤ 80 ms.", boundary: "P50 만 적은 SLO 는 꼬리를 전혀 제약하지 않습니다." },
            { term: "Window 와 평가 기간", description: "표본을 묶는 길이와 위반율을 세는 기간입니다.", example: "5 분 window, 1 일 평가.", boundary: "Window 를 길게 잡으면 짧은 장애가 평균에 묻혀 위반이 사라집니다." },
            { term: "허용 위반율", description: "위반 window 를 얼마나 허용하는지, 곧 error budget 입니다.", example: "1 % → 하루 2 개 window.", boundary: "0 % 는 배포·재시작을 모두 위반으로 만들어 운영이 불가능합니다." },
          ]}
        />
        <ProgressiveDetail
          title="Percentile 표기와 요청 비율 표기 중 어느 것을 SLO 로 쓰는 것이 좋은가요?"
          preview="둘은 같은 분포를 다르게 자른 표기입니다. 표본이 적은 window 에서는 요청 비율 표기가, 대시보드 해석에는 percentile 표기가 안정합니다."
        >
          <p>
            "P95 TTFT ≤ 1.5 s" 와 "TTFT ≤ 1.5 s 인 요청이 95 % 이상" 은 표본이 충분히
            크면 같은 조건입니다. 표본 20 개짜리 window 에서 P95 는 두 번째로 느린 값 하나로
            정해지므로 요청 하나가 window 전체를 뒤집습니다. 요청 비율 표기는 그 window 를
            19/20 = 95 % 로 세어 같은 요동을 덜 겪습니다.
          </p>
          <p>
            SRE Book 은 목표를 현재 성능에서 역산하지 말고 단순하게 유지하라고 권합니다.
            LLM serving 에서는 TTFT 와 ITL 에 각각 하나의 percentile 조건, E2E 에는 응답
            길이별 조건을 두는 정도가 읽히는 범위입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          지표 정의는 benchmark 구현에서, SLO 문법은 SRE 실무에서 가져왔습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글의 TTFT·TPOT·ITL·E2E 계산식은 vLLM 의 serving benchmark 구현이 실제로
            쓰는 식이고, chunk 당 token 수로 간격을 나누는 ITL 정의는 NVIDIA GenAI-Perf
            문서를 따랐습니다. 두 도구는 percentile 목록과 기본값이 다르므로 결과를 나란히
            놓을 때는 어느 percentile 을 어떤 보간으로 냈는지 함께 적어야 합니다.
          </p>
          <p>
            Percentile 을 SLO 로 계약하는 문법과 error budget 의 논리는 Google SRE Book 의
            SLO 장에서 왔습니다. 그 장은 일반 RPC 서비스를 다루므로, TTFT 와 ITL 을 별도
            SLI 로 두는 것은 LLM serving 에서 이 글이 적용한 해석입니다.
          </p>
        </div>
        <div id="paper-vllm-bench" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM project · vllm/benchmarks/serve.py (serving benchmark 구현)"
            citeKey={1}
            href="https://github.com/vllm-project/vllm/blob/main/vllm/benchmarks/serve.py"
            type="code"
          >
            TPOT 를 (latency − ttft)/(output_len − 1) 로, ITL 을 streaming chunk 간격
            목록으로, request throughput 과 output token throughput 을 완료 수·token 총수를
            측정 시간으로 나눈 값으로 계산합니다. Mean·median 과 선택한 percentile(기본
            P99)을 보고하며, 보고 형식은 버전마다 바뀔 수 있습니다.
          </CitationBlock>
        </div>
        <div id="paper-genai-perf" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · GenAI-Perf metrics 문서"
            citeKey={2}
            href="https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html"
          >
            TTFT, inter token latency(중간 응답 간격을 그 응답의 token 수로 나눈 값), request
            latency, output token throughput, request throughput 을 정의하고 avg·min·max 와
            p99·p90·p75 를 보고합니다. vLLM 과 percentile 집합이 달라 두 도구의 표를 같은
            열로 합치지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-sre-slo" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Beyer et al. · Site Reliability Engineering, Ch. 4 Service Level Objectives"
            citeKey={3}
            href="https://sre.google/sre-book/service-level-objectives/"
          >
            SLI·SLO·SLA 를 구분하고, latency 는 평균보다 percentile 로 목표를 세우며, 100 %
            만족 대신 error budget 을 두고 외부 SLO 보다 엄격한 내부 SLO 로 여유를 확보하라고
            권합니다. 일반 서비스 기준이므로 LLM 지표를 어떻게 나눌지는 말하지 않습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          이어지는 글: 이 지표를 재현 가능하게 측정하는 benchmark 방법론(warm·cold, request
          rate sweep 과 saturation 곡선)은 다음 배치에서 다룹니다. 지표가 나오는 scheduler 쪽
          원인은 <Link to="/ai/vllm-scheduler">vLLM scheduler</Link> 를 참고하세요.
        </p>
      </section>
    </div>
  );
}
