import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ServingBenchmarkMethodologyViz from "./serving-benchmark-methodology/viz/ServingBenchmarkMethodologyViz";

/**
 * Serving benchmark 는 offered load 를 올리며 steady state 에서 재야 재현됩니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function ServingBenchmarkMethodologyArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 서버도 benchmark 를 어떻게 돌리느냐에 따라 숫자가 두 배 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Serving benchmark 의 결과는 model 과 GPU 만으로 정해지지 않습니다. 어떤 입력을
            어떤 속도로 넣었는지, 첫 요청의 cold start 를 표본에 넣었는지, 서버가 포화하기
            전이었는지에 따라 같은 서버의 tokens/s 와 P99 TTFT 가 몇 배씩 달라집니다.
          </p>
          <p>
            이 글은 그 조건을 하나씩 고정하는 방법론을 다룹니다. Benchmark 를 재는 범위와
            입력 분포로 분류한 뒤, warm·cold 와 steady state 로 표본을 고르고, 반복 측정의
            분산으로 차이를 판정합니다. 이어서 offered load 를 올리며 saturation point 를
            찾는 utilization–latency 곡선을 M/M/1 직관으로 읽습니다.
          </p>
          <p>
            지표 자체의 정의(TTFT·ITL·TPOT·percentile)는{" "}
            <Link to="/ai/serving-latency-metrics-and-slo#metrics">앞 글</Link>을 전제로 하고,
            여기서 얻은 GPU 당 capacity 를 비용과 headroom 으로 바꾸는 일은 다음 글인
            capacity planning 이 맡습니다.
          </p>
        </div>
        <ContentBoundary article="serving-benchmark-methodology" />
      </section>

      <section id="taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Benchmark 는 재는 범위와 입력 분포로 먼저 분류합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Performance benchmark 는 정해진 workload 를 system 에 넣고 latency 와 throughput
            을 재는 실험입니다. 같은 이름으로 불려도 무엇을 감싸고 재느냐가 다르며, 그 범위가
            좁을수록 원인은 잘 보이고 넓을수록 사용자가 겪는 값에 가까워집니다.
          </p>
          <p>
            Microbenchmark 는 kernel 하나나 decode step 하나처럼 구성 요소 하나만 떼어 잽니다.
            Attention kernel 의 실행 시간을 batch 32, sequence 2k 에서 1.8 ms 로 재는 식이며,
            scheduler 나 network 는 들어 있지 않습니다. 병목이 어느 kernel 인지 가릴 때 씁니다.
          </p>
          <p>
            Macrobenchmark 는 engine 전체를 한 process 안에서 돌립니다. vLLM 의 throughput
            benchmark 처럼 요청 1,000 개를 한꺼번에 넣고 완료까지의 tokens/s 를 재며,
            network 와 도착 간격이 없으므로 scheduler 와 KV cache 가 만드는 상한에 가깝습니다.
          </p>
          <p>
            End-to-end benchmark 는 client 가 HTTP 로 요청을 보내고 streaming 응답을 받는
            경로 전체를 잽니다. vLLM 의 serving benchmark 와 GenAI-Perf 가 이 층이며, 앞 글의
            TTFT·ITL 은 모두 이 층의 client timestamp 에서 나옵니다. 사용자에게 약속할 SLO
            는 이 층에서만 검증됩니다.
          </p>
          <p>
            두 번째 축은 입력 분포입니다. Synthetic benchmark 는 무작위 token 을 정해진 길이로
            만들어 넣고, representative benchmark 는 실제 trace 나 ShareGPT 같은 대화 자료의
            길이 분포를 그대로 씁니다.
          </p>
          <p>
            입력 1,024·출력 128 로 고정한 synthetic 결과는 깔끔하지만, 운영 trace 의 입력이
            200 에서 8,000 token 까지 퍼져 있다면 prefill 혼합 비율이 전혀 달라 그 tokens/s 는
            운영을 대표하지 못합니다.
          </p>
          <p>
            그래서 benchmark distribution, 곧 입력 길이·출력 길이·도착 간격의 분포를 결과와
            함께 적습니다. GenAI-Perf 는 입력 token 의 평균과 표준편차를 flag 로 받고, vLLM 은
            dataset 이름과 random 길이 옵션을 받습니다. 분포가 다른 두 결과는 같은 서버라도
            비교하지 않습니다.
          </p>
        </div>
        <TermBreakdown
          title="Benchmark 를 분류하는 두 축"
          description="범위 축과 입력 축은 독립이라 end-to-end synthetic 도, micro representative 도 있습니다."
          items={[
            { term: "Microbenchmark", description: "Kernel·step 하나만 떼어 잽니다.", example: "Attention kernel 1.8 ms at batch 32.", boundary: "Scheduler·network 가 빠져 있어 사용자 latency 를 말하지 못합니다." },
            { term: "Macrobenchmark", description: "Engine 전체를 한 process 에서 잽니다.", example: "요청 1,000 개 일괄 투입 tokens/s.", boundary: "도착 간격이 없어 queueing 이 보이지 않습니다." },
            { term: "End-to-end benchmark", description: "Client 에서 HTTP·streaming 경로 전체를 잽니다.", example: "vLLM serving benchmark, GenAI-Perf.", boundary: "원인 분해는 되지 않아 micro 층과 함께 봐야 합니다." },
            { term: "Synthetic vs representative", description: "무작위 고정 길이 입력과 실제 trace 분포 입력입니다.", example: "입력 1,024·출력 128 고정 vs ShareGPT 분포.", boundary: "Synthetic 은 재현이 쉽고 representative 는 운영에 가깝지만 자료가 바뀌면 결과도 바뀝니다." },
          ]}
        />
      </section>

      <section id="protocol" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cold 첫 요청을 버리고 steady state 표본만 세어야 비교가 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Cold benchmark 는 process 가 막 뜬 뒤의 첫 요청들을 표본에 넣은 측정이고, warm
            benchmark 는 warmup 요청을 먼저 보내 준비를 끝낸 뒤 재는 측정입니다. 두 값은 같은
            서버에서 수십 배 차이 나므로 어느 쪽인지 적지 않은 TTFT 는 비교할 수 없습니다.
          </p>
          <p>
            차이가 나는 이유는{" "}
            <Link to="/ai/inference-runtime-anatomy#warmup">runtime warmup</Link> 이 하는 일에
            있습니다. 첫 요청은 kernel JIT compile, CUDA graph capture, allocator 의 첫 확장,
            prefix cache 가 비어 있는 상태를 모두 겪습니다. 예를 들어 graph capture 를 lazy 로
            두면 첫 요청의 TTFT 가 6.8 s 이고 그 다음부터는 0.35 s 인 식입니다.
          </p>
          <p>
            Benchmark warmup 은 그 준비를 표본 밖에서 끝내는 요청들입니다. GenAI-Perf 는
            warmup 요청 수를 flag 로 받고, MLPerf 는 측정 전 warm-up run 을 규칙으로 둡니다.
            운영에서는 cold 값도 중요합니다. Autoscaling 으로 새 replica 가 뜰 때 사용자가 겪는
            값이 cold TTFT 이기 때문이며, 그래서 warm 과 cold 를 둘 다 재되 따로 보고합니다.
          </p>
          <p>
            Warmup 이 끝나도 표본을 바로 세지는 않습니다. Steady-state performance 는 대기열
            길이와 batch 크기가 더 이상 한 방향으로 움직이지 않는 구간의 값입니다. Offered load
            를 켠 직후에는 대기열이 0 에서 시작해 차오르므로 초반 요청의 TTFT 는 정상 상태보다
            낮고, 마지막 요청들은 새 도착이 끊겨 batch 가 작아지니 ITL 이 정상 상태보다 빠릅니다.
          </p>
          <p>
            그래서 측정 window 는 ramp-up 뒤에 시작하고 마지막 요청들이 빠져나가는 drain 구간
            전에 끝냅니다. MLPerf 는 scenario 마다 최소 600 s 를 돌리고, percentile 추정에 필요한
            최소 query 수를 신뢰 구간으로 정합니다. 요청 20 개짜리 실행에서 나온 P99 는 정상
            상태의 값이 아니라 ramp-up 의 값입니다.
          </p>
          <p>
            같은 조건에서 다시 돌려도 값은 흔들립니다. Measurement noise 는 GPU clock, 다른
            tenant, network jitter, 무작위 입력 sampling 처럼 측정자가 통제하지 못한 요인이 만드는
            흔들림이고, benchmark variance 는 그 흔들림이 반복 실행의 표준편차로 나타난 크기입니다.
          </p>
          <p>
            설정 A 를 5 회 돌려 P50 TTFT 가 0.80, 0.83, 0.79, 0.84, 0.81 s 가 나왔다면 평균
            0.814 s, 표준편차 0.021 s 입니다. 설정 B 가 0.78, 0.80, 0.76, 0.82, 0.79 s 로 평균
            0.790 s 라면 차이 0.024 s 는 표준편차 한 개 정도라 A 보다 B 가 빠르다고 판정하지
            않습니다. 차이가 표준편차의 두 배를 넘고 반복이 5 회 이상일 때만 결론을 냅니다.
          </p>
          <p>
            GenAI-Perf 가 stability percentage 로 연속 측정 구간의 latency 변동이 정해진 비율 안에
            들 때까지 측정을 이어 가는 것도 같은 이유입니다. 분산이 큰 조건에서는 반복을 늘리거나
            noise 원인(clock 고정, 전용 node) 을 먼저 줄인 뒤 다시 잽니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Warm · steady-state · 반복 표본을 고르는 측정 절차"
          input={["서버 endpoint 와 고정된 설정(model, dtype, max batch, graph capture)", "입력 분포 D(길이 분포·dataset)", "offered load λ 와 측정 길이 T (예: 600 s)", "warmup 요청 수 n_w, 반복 횟수 R (예: 5)"]}
          steps={[
            { code: "cold ← TTFT of first request after process start", note: "Cold 값은 따로 기록합니다. Autoscaling 시 사용자가 겪는 값이며 warm 표본에 섞지 않습니다." },
            { code: "send n_w warmup requests drawn from D; discard", note: "Kernel JIT·graph capture·allocator 확장·prefix cache 채움을 표본 밖에서 끝냅니다." },
            { code: "for r in 1..R:", note: "반복마다 같은 seed 로 같은 요청 순서를 쓰면 입력 sampling noise 가 빠지고 system noise 만 남습니다." },
            { code: "  start load at rate λ; wait until queue length stops trending", note: "Ramp-up 구간입니다. 대기열·batch 크기가 한 방향으로 움직이는 동안의 표본은 버립니다." },
            { code: "  collect samples for T; stop before drain", note: "마지막 도착 뒤 batch 가 작아지는 drain 구간의 ITL 은 정상 상태보다 빠르므로 제외합니다." },
            { code: "  m_r ← metrics(samples)  // P50/P99 TTFT, tokens/s", note: "반복 하나의 값입니다. Percentile 은 앞 글의 정의를 그대로 씁니다." },
            { code: "report mean(m_r), std(m_r), cold, D, λ, T, R", note: "표준편차 없이 평균만 적은 결과는 다른 설정과 비교할 수 없습니다." },
          ]}
          output="설정 하나의 warm steady-state 지표(평균 ± 표준편차) 와 cold TTFT, 그리고 그 값이 나온 조건 전체"
        />
        <ProgressiveDetail
          title="Cold 에는 process cold 말고 어떤 종류가 더 있나요?"
          preview="Process cold(kernel·graph), cache cold(prefix KV 비어 있음), autoscaling cold(replica 가 traffic-ready 가 되기까지) 세 층이며 각각 다른 시간 규모입니다."
        >
          <p>
            Process cold 는 kernel compile 과 graph capture 로 수 초에서 수십 초이고, vLLM 은
            시작 시 profile run 과 capture 를 미리 하므로 첫 요청보다 시작 시간에 실립니다.
            Cache cold 는 prefix cache 가 비어 같은 system prompt 도 다시 prefill 하는 상태로,
            요청 몇 개면 풀립니다.
          </p>
          <p>
            Autoscaling cold 는 새 Pod 가 weight 를 내려받고 warmup 을 끝내 ready 가 되기까지의
            수 분이며, 이 시간은{" "}
            <Link to="/ai/llm-serving-ops#k8s-gpu-fleet">ready-capacity 경로</Link>가 소유합니다.
            Benchmark 보고서에는 어느 층의 cold 인지를 적어야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="load" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Offered load 를 올리면 throughput 은 포화하고 latency 는 꺾여 오릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Offered load 는 client 가 서버에 보내려는 요청의 도착률 λ 입니다. 서버가 실제로
            처리한 throughput 과는 다른 양이며, vLLM serving benchmark 의 request rate 와
            GenAI-Perf 의 request rate 가 이 값을 정합니다. Concurrency 로 부하를 거는 closed
            loop 방식은 요청이 끝나야 다음을 보내므로 offered load 가 서버 속도에 묶입니다.
          </p>
          <p>
            λ 를 낮은 값부터 올리면 처리한 throughput 은 λ 를 그대로 따라 오릅니다. 서버가
            단위 시간에 처리할 수 있는 상한 μ 에 가까워지면 throughput 은 μ 에서 멈추고, 그
            직전부터 latency 가 가파르게 오릅니다. Throughput 이 더 늘지 않기 시작하는 λ 가
            saturation point 이고, 그 너머의 요청은 대기열에 쌓여 결국 timeout 됩니다.
          </p>
          <p>
            Latency 가 왜 saturation 전에 먼저 오르는지는 queueing 으로 설명됩니다. 요청 하나의
            체류 시간은 service time(서버가 실제로 그 요청을 처리한 시간, 평균 1/μ) 과 queueing
            delay(앞 요청이 끝나기를 기다린 시간) 의 합입니다. Utilization ρ = λ/μ 가 오를수록
            도착했을 때 서버가 바쁠 확률이 커져 queueing delay 가 자랍니다.
          </p>
          <p>
            가장 단순한 M/M/1 model(Poisson 도착, 지수 service time, 서버 1 개) 에서 평균
            체류 시간은 W = 1/(μ − λ) 입니다. μ = 10 req/s 서버에 λ = 5 를 넣으면 W = 0.2 s
            로 service time 0.1 s 의 두 배이고, λ = 8 이면 0.5 s, λ = 9.5 면 2.0 s 입니다.
            Utilization 이 80 % 에서 95 % 로 15 %p 오르는 동안 latency 는 네 배가 됩니다.
          </p>
          <p>
            이 곡선을 utilization–latency curve 라고 부릅니다. Throughput 을 ρ 로 놓고 latency
            를 그리면 hockey stick 모양이 되고, 꺾이는 무릎이 운영 가능한 utilization 의 상한을
            정합니다. Serving 에서는 그 무릎 앞의 어떤 점을 고를지가 SLO 로 정해지며, 그 점의
            throughput 이 <Link to="/ai/vllm-serving#serving-goodput">goodput</Link> 입니다.
          </p>
          <p>
            LLM serving 은 M/M/1 보다 복잡합니다. Batch 가 커지면 μ 자체가 오르고, service
            time 은 출력 길이에 비례해 지수 분포가 아니며, KV cache 가 차면 preemption 으로 μ
            가 떨어집니다.
          </p>
          <p>
            그래서 곡선은 식으로 구하지 않고 λ 를 sweep 하며 잽니다. MLPerf Server scenario 가
            Poisson 도착으로 latency 조건을 만족하는 최대 λ 를 이진 탐색하는 것이 바로 이
            측정입니다.
          </p>
        </div>
        <ServingBenchmarkMethodologyViz />
        <ExplainedFormula
          question="Offered load λ 가 처리율 μ 에 가까워질 때 평균 latency 는 얼마나 커지나요?"
          idea="서버 1 개가 평균 1/μ 로 처리하고 요청이 평균 λ 로 무작위 도착하면, 도착 시 서버가 바쁠 확률이 ρ = λ/μ 이고 그만큼 기다림이 누적되어 체류 시간이 1/(μ − λ) 로 자랍니다."
          formula={String.raw`\rho=\frac{\lambda}{\mu},\qquad W=\frac{1}{\mu-\lambda}=\underbrace{\frac{1}{\mu}}_{\text{service}}+\underbrace{\frac{\rho}{\mu-\lambda}}_{\text{queueing}},\qquad L=\lambda W`}
          annotatedFormula={String.raw`\underbrace{\rho=\frac{\lambda}{\mu}}_{\text{utilization: 서버가 바쁜 시간 비율}},\qquad W=\underbrace{\frac{1}{\mu}}_{\text{service time 평균}}+\underbrace{\frac{\rho}{\mu-\lambda}}_{\text{queueing delay 평균}}=\underbrace{\frac{1}{\mu-\lambda}}_{\text{평균 체류 시간}},\qquad \underbrace{L=\lambda W}_{\text{Little's law: 평균 재실 요청 수}}`}
          operations={[
            { expression: String.raw`\rho=\frac{\lambda}{\mu}`, annotation: ["도착률을 처리율로 나눠", "서버가 바쁜 시간 비율 산출"] },
            { expression: String.raw`\frac{\rho}{\mu-\lambda}`, annotation: ["바쁠 확률 ρ 를 남은 여유 μ−λ 로 나눠", "평균 queueing delay 산출"] },
            { expression: String.raw`\frac{1}{\mu-\lambda}`, annotation: ["service 와 queueing 을 더해", "λ→μ 에서 발산하는 평균 체류 시간"] },
            { expression: String.raw`L=\lambda W`, annotation: ["도착률에 체류 시간을 곱해", "system 안 평균 요청 수(대기열 길이) 산출"] },
          ]}
          terms={[
            { symbol: String.raw`\lambda`, name: "Offered load", description: "Client 가 보내려는 평균 도착률(req/s) 입니다. 처리한 throughput 과 다릅니다." },
            { symbol: String.raw`\mu`, name: "Service rate", description: "서버가 쉬지 않을 때의 평균 처리율(req/s) 이며 service time 평균의 역수입니다." },
            { symbol: String.raw`\rho`, name: "Utilization", description: "λ/μ 로, 1 에 가까울수록 queueing delay 가 발산합니다." },
            { symbol: "W", name: "평균 체류 시간", description: "도착부터 완료까지의 평균이며 serving 에서는 E2E 평균에 대응합니다." },
          ]}
          assumptions={["M/M/1: Poisson 도착, 지수 분포 service time, 서버 1 개, 무한 대기열, λ < μ 입니다. λ ≥ μ 에서는 정상 상태가 없어 식이 성립하지 않습니다.", "LLM serving 은 batch 가 μ 를 바꾸고 service time 이 출력 길이를 따르므로 이 식은 곡선의 모양(무릎) 을 설명하는 직관이지 예측식이 아닙니다."]}
          interpretation="Utilization 을 100 % 로 채우려는 계획은 latency 를 무한대로 보내는 계획입니다. 곡선의 무릎(보통 ρ 0.7–0.85) 앞에서 SLO 를 만족하는 최대 λ 를 실측으로 찾고, 그 값이 다음 글에서 GPU 당 capacity 가 됩니다."
        />
        <TermBreakdown
          title="Load 곡선을 읽을 때 구분해야 하는 네 양"
          items={[
            { term: "Offered load λ", description: "Client 가 보내려는 도착률입니다.", example: "request rate 8 req/s.", boundary: "Closed-loop concurrency 부하에서는 서버 속도에 묶여 독립 변수가 아닙니다." },
            { term: "Throughput", description: "서버가 실제로 완료한 비율입니다.", example: "λ 8 에서 8 req/s, λ 12 에서 10 req/s.", boundary: "λ > μ 이면 throughput 은 μ 에 머물고 대기열만 자랍니다." },
            { term: "Service time 1/μ", description: "서버가 요청 하나를 실제로 처리한 시간입니다.", example: "μ = 10 이면 0.1 s.", boundary: "Batch 와 출력 길이에 따라 변하므로 LLM 에서는 상수가 아닙니다." },
            { term: "Queueing delay", description: "앞 요청을 기다린 시간입니다.", example: "λ 9.5 에서 평균 1.9 s.", boundary: "TTFT 안에 들어가 prefill 시간과 섞이므로 queue time 을 따로 계측해야 분리됩니다." },
          ]}
        />
      </section>

      <section id="reproducibility" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Baseline 과 실행 조건을 기록해야 다음 측정이 비교 가능합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Benchmark reproducibility 는 같은 조건을 적어 둔 대로 다시 만들면 같은 분산 안의
            값이 나오는 성질입니다. 재현되지 않는 숫자는 개선인지 noise 인지 가릴 수 없으므로,
            결과보다 조건을 먼저 기록합니다. Model 과 GPU 이름만으로는 조건의 절반도 되지
            않습니다.
          </p>
          <p>
            적어야 하는 조건은 앞 절들이 하나씩 드러낸 것들입니다. Benchmark 층과 도구 버전,
            입력 분포와 seed, warmup 수와 측정 길이, offered load 와 부하 방식(open loop 의
            request rate 인지 closed loop 의 concurrency 인지), 그리고 engine 설정(dtype,
            max batch, KV block 수, graph capture) 입니다.
          </p>
          <p>
            Performance baseline 은 그 조건으로 잰 기준 결과입니다. 이후의 모든 변경(kernel
            교체, 설정 변경, engine 업그레이드) 은 같은 조건으로 다시 재어 baseline 과의 차이를
            분산과 비교해 판정합니다. Baseline 이 없으면 tokens/s 가 12 % 올랐다는 주장은 비교
            대상이 없는 숫자입니다.
          </p>
          <p>
            Baseline 은 조건이 바뀔 때마다 새로 잡습니다. GPU driver 나 engine major 버전이
            바뀌면 이전 baseline 과는 비교하지 않고, 두 버전을 같은 날 같은 node 에서 나란히
            재어 새 baseline 으로 삼습니다. 시간이 떨어진 두 측정의 차이는 개선과 환경 변화가
            섞여 있어 판정에 쓰지 않습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Offered load sweep 으로 SLO 아래 capacity 를 찾고 baseline 으로 기록하기"
          input={["고정 조건 C(engine 설정·입력 분포·warmup·측정 길이·반복 횟수)", "SLO 조건 S (예: P95 TTFT ≤ 1.5 s, P99 ITL ≤ 80 ms)", "offered load 후보 Λ = {λ_1 < λ_2 < …} (예: 1, 2, 4, 6, 8, 9, 9.5 req/s)"]}
          steps={[
            { code: "for λ in Λ ascending:", note: "낮은 부하부터 올립니다. 각 점은 앞 절 절차대로 warm·steady-state·R 회 반복으로 잽니다." },
            { code: "  m(λ) ← mean ± std over R runs of {throughput, P95 TTFT, P99 ITL}", note: "점 하나에 값 하나가 아니라 분산이 붙어야 다음 점과의 차이를 판정할 수 있습니다." },
            { code: "  if throughput(λ) − throughput(λ_prev) < std: saturation ← λ_prev", note: "Throughput 증가가 분산 안에 묻히면 그 앞 점이 saturation point 입니다." },
            { code: "  if not S(m(λ)): break", note: "SLO 를 처음 어긴 λ 에서 멈춥니다. 보통 saturation 보다 앞에서 먼저 어깁니다." },
            { code: "λ_max ← largest λ with S(m(λ))", note: "SLO 를 만족한 마지막 점이 이 설정의 capacity 이며 그 throughput 이 goodput 입니다." },
            { code: "baseline ← {C, S, Λ, m(·), λ_max, saturation, tool versions, date}", note: "조건 전체를 결과와 한 묶음으로 저장합니다. 결과만 남은 baseline 은 재현되지 않습니다." },
          ]}
          output="λ–throughput–latency 곡선, saturation point, SLO 아래 최대 offered load λ_max, 그리고 조건이 붙은 baseline"
        />
        <ProgressiveDetail
          title="Open loop 와 closed loop 부하 중 어느 쪽으로 sweep 해야 하나요?"
          preview="Capacity 를 찾을 때는 open loop(request rate) 가 맞습니다. Closed loop(concurrency) 는 서버가 느려지면 부하도 줄어 saturation 이 가려집니다."
        >
          <p>
            Closed loop 는 동시 요청 수 N 을 고정하고 하나가 끝나면 다음을 보냅니다. 서버가
            포화하면 응답이 늦어져 도착률이 스스로 낮아지므로 대기열이 무한히 자라지 않고,
            latency 는 N 에 비례해 완만하게 늘어납니다. 사용자 N 명이 붙어 있는 상황의 모사에는
            맞지만 saturation 의 무릎은 보이지 않습니다.
          </p>
          <p>
            Open loop 는 서버 상태와 무관하게 λ 로 보냅니다. vLLM 의 request rate 와 burstiness
            (Gamma 분포의 shape, 1 이면 Poisson) 가 이 방식이며, λ &gt; μ 이면 대기열이 자라
            timeout 이 납니다. 곡선의 무릎과 saturation point 는 이 방식에서만 정확히 잡힙니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          절차는 benchmark 도구와 MLPerf 규칙에서, 곡선은 queueing 교과서에서 왔습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Offered load 와 burstiness, dataset 과 ramp-up 옵션은 vLLM benchmarking CLI 문서의
            flag 를, warmup 요청 수와 stability percentage, synthetic 입력 분포는 GenAI-Perf
            문서의 flag 를 그대로 옮겼습니다. 두 도구 모두 flag 이름과 기본값이 버전마다
            바뀝니다.
          </p>
          <p>
            Steady state 를 위한 최소 실행 시간과 query 수, Server scenario 의 Poisson 도착과
            latency 조건 아래 최대 throughput 탐색은 MLPerf Inference 규칙에서 왔습니다.
            M/M/1 의 W = 1/(μ − λ) 와 Little&apos;s law 는 Harchol-Balter 의 교과서 유도를
            따랐으며, LLM serving 에 적용한 한계는 이 글의 해석입니다.
          </p>
        </div>
        <div id="paper-vllm-cli" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM project · Benchmark CLI 문서 (docs/benchmarking/cli.md)"
            citeKey={1}
            href="https://github.com/vllm-project/vllm/blob/main/docs/benchmarking/cli.md"
            type="code"
          >
            Serving benchmark 의 request-rate(inf 면 일괄 투입), burstiness(Gamma shape, 1 이
            Poisson), max-concurrency, num-prompts, dataset-name(sharegpt·random 등) 과 linear·
            exponential ramp-up 옵션을 정의하고 TTFT·ITL·TPOT 의 mean·median·P99 와 request·token
            throughput 을 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-genai-perf-load" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · GenAI-Perf 문서 (load generation 옵션)"
            citeKey={2}
            href="https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html"
          >
            concurrency 와 request-rate 두 부하 방식, measurement-interval, warmup-request-count,
            stability-percentage(연속 측정 구간의 latency 변동 허용 비율), request-count, 그리고
            synthetic-input-tokens 의 mean·stddev 를 flag 로 정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-mlperf-rules" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="MLCommons · MLPerf Inference Rules (inference_rules.adoc)"
            citeKey={3}
            href="https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc"
          >
            SingleStream·MultiStream·Server·Offline 네 scenario 를 정의하고, Server 는 Poisson
            도착에서 benchmark 별 latency 조건(예: LLM 의 TTFT/TPOT 상한) 을 만족하는 최대
            throughput 을 이진 탐색으로 찾습니다. 최소 600 s 실행과 percentile 신뢰 구간에 따른
            최소 query 수를 요구합니다.
          </CitationBlock>
        </div>
        <div id="paper-queueing-text" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Harchol-Balter · Performance Modeling and Design of Computer Systems (Cambridge 2013)"
            citeKey={4}
            href="https://doi.org/10.1017/CBO9781139226424"
          >
            Little&apos;s law, utilization ρ = λ/μ, M/M/1 의 평균 체류 시간 1/(μ − λ) 와
            대기 시간 ρ/(μ − λ) 를 유도하고, utilization 이 1 에 가까울수록 latency 가 발산하는
            이유를 open·closed system 의 차이와 함께 설명합니다. LLM 의 batch 의존 service rate
            는 다루지 않습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: 여기서 찾은 SLO 아래 최대 offered load 를 GPU 당 capacity 로 두고 cost/token 과
          headroom 을 계산하는 <Link to="/ai/inference-cost-and-capacity-planning">추론 비용과 capacity planning</Link>.
          Percentile 과 SLO 의 정의는{" "}
          <Link to="/ai/serving-latency-metrics-and-slo#slo">앞 글</Link>을 참고하세요.
        </p>
      </section>
    </div>
  );
}
