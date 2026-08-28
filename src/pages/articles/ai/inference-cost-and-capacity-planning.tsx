import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InferenceCostAndCapacityPlanningViz from "./inference-cost-and-capacity-planning/viz/InferenceCostAndCapacityPlanningViz";

/**
 * 추론 비용은 cost/token 으로, capacity 는 peak 와 headroom 으로 계획합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function InferenceCostAndCapacityPlanningArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          GPU 를 몇 장 살지는 peak 와 SLO 아래 GPU 당 처리량이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 추론 비용은 GPU 를 빌린 시간에서 나오고, 그 시간 동안 낸 token 수로 나누면
            cost/token 이 됩니다. 필요한 GPU 수는 가장 바쁜 시간의 요청량(peak) 을 SLO 를
            지키는 GPU 당 처리량으로 나눈 값에 headroom 을 더한 것이며, 이 두 계산이 capacity
            planning 의 전부입니다.
          </p>
          <p>
            이 글은 먼저 GPU-hour 단가에서 cost/token 과 cost/request 를 유도하고, 그 값을
            throughput per dollar·performance per watt·TCO 로 비교하는 법을 봅니다. 다음으로
            peak 와 headroom 에서 GPU 수를 정하고, reserved 와 on-demand 의 분배, scale-up 과
            scale-out, autoscaling 정책, GPU fragmentation 까지 운영 판단을 닫습니다.
          </p>
          <p>
            GPU 당 처리량은 앞 글의{" "}
            <Link to="/ai/serving-benchmark-methodology#reproducibility">λ sweep</Link> 으로 SLO
            아래에서 잰 값을 그대로 씁니다. 이 글의 GPU 시간당 가격은 모두 &quot;예: $2/GPU-h
            가정&quot; 같은 가정값이며 실제 시세를 말하지 않습니다.
          </p>
        </div>
        <ContentBoundary article="inference-cost-and-capacity-planning" />
      </section>

      <section id="cost" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cost/token 은 GPU-hour 단가를 시간당 token 수로 나눈 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Inference cost 는 model 이 응답을 만드는 데 든 자원 비용 전체입니다. GPU 를 시간
            단위로 빌리든 사든 비용은 시간에 비례하고, 그 시간에 서버가 낸 token 수는 benchmark
            의 tokens/s 가 정하므로, 비용을 token 으로 나누면 두 값의 비가 됩니다.
          </p>
          <p>
            GPU-hour 는 GPU 한 장을 한 시간 쓴 양입니다. 8 장을 3 시간 쓰면 24 GPU-h 이고,
            clock 이나 utilization 과 무관하게 점유한 시간만 셉니다. 그래서 GPU 가 놀고 있어도
            GPU-hour 는 그대로 나가고, 그만큼 cost/token 이 오릅니다.
          </p>
          <p>
            GPU-h 단가를 $2 로 가정하고 서버 한 장이 SLO 아래에서 1,000 tokens/s 를 낸다고
            하면, 한 시간에 3,600,000 token 이 나오므로 cost/token 은 2 / 3,600,000 ≈ $0.00000056
            입니다. 숫자가 너무 작아 백만 token 당 비용으로 바꿔 부르며, 이 예에서는 $0.56 per
            million tokens 입니다.
          </p>
          <p>
            같은 model 을 GPU 2 장에 tensor parallel 로 올려 1,800 tokens/s 가 나오면 시간당
            비용은 $4, token 은 6,480,000 개라 $0.62/M 입니다. 처리량은 1.8 배인데 비용은 2 배라
            cost/token 은 오히려 10 % 올랐습니다. Token per GPU-second, 곧 tokens/s 를 GPU 수로
            나눈 값(1,000 → 900) 이 이 차이를 바로 보여 줍니다.
          </p>
          <p>
            Cost per request 는 같은 비용을 완료 요청 수로 나눈 값입니다. Benchmark 의 RPS 가
            3 이면 시간당 10,800 요청이므로 2 / 10,800 ≈ $0.000185, 요청 1,000 건에 약 $0.19
            입니다. 요청당 token 수가 다른 workload 끼리는 cost/token 이, 같은 API 의 가격을
            정할 때는 cost/request 가 읽기 쉽습니다.
          </p>
          <p>
            이 식의 tokens/s 는 어떤 조건의 값인지가 중요합니다. Batch 를 무한히 키운 상한
            tokens/s 로 계산한 cost/token 은 SLO 를 어기며 낸 값이고, 실제 비용은{" "}
            <Link to="/ai/vllm-serving#serving-goodput">goodput</Link> 기준이어야 합니다. 입력
            token 도 prefill 로 GPU 시간을 쓰므로 tokens/s 는 입력·출력 분포가 붙은 값입니다.
          </p>
        </div>
        <ExplainedFormula
          question="GPU 시간당 가격과 처리량에서 token 하나의 비용은 어떻게 나오나요?"
          idea="비용은 GPU 수 × 시간당 단가로 시간에 비례하고, token 수는 tokens/s × 초로 시간에 비례하므로, 둘의 비는 시간과 무관한 상수 cost/token 이 됩니다."
          formula={String.raw`c_{\text{tok}}=\frac{p\cdot G}{r\cdot 3600},\qquad c_{\text{M}}=c_{\text{tok}}\cdot 10^{6},\qquad c_{\text{req}}=\frac{p\cdot G}{\mathrm{RPS}\cdot 3600}`}
          annotatedFormula={String.raw`c_{\text{tok}}=\frac{\overbrace{p\cdot G}^{\text{시간당 비용 (\$/h)}}}{\underbrace{r\cdot 3600}_{\text{시간당 token 수}}},\qquad \underbrace{c_{\text{M}}=c_{\text{tok}}\cdot 10^{6}}_{\text{백만 token 당 비용}},\qquad c_{\text{req}}=\frac{p\cdot G}{\underbrace{\mathrm{RPS}\cdot 3600}_{\text{시간당 완료 요청 수}}}`}
          operations={[
            { expression: String.raw`p\cdot G`, annotation: ["GPU-h 단가에 GPU 수를 곱해", "replica 하나의 시간당 비용 산출"] },
            { expression: String.raw`r\cdot 3600`, annotation: ["SLO 아래 tokens/s 에 3600 을 곱해", "한 시간에 낸 token 수 산출"] },
            { expression: String.raw`\frac{p\cdot G}{r\cdot 3600}`, annotation: ["시간당 비용을 시간당 token 으로 나눠", "시간과 무관한 token 당 비용"] },
            { expression: String.raw`\frac{p\cdot G}{\mathrm{RPS}\cdot 3600}`, annotation: ["같은 비용을 시간당 완료 요청 수로 나눠", "요청 당 비용 산출"] },
          ]}
          terms={[
            { symbol: "p", name: "GPU-hour 단가", description: "GPU 한 장을 한 시간 쓰는 가격(예: $2/GPU-h 가정) 입니다. 소유 장비면 TCO 에서 유도한 시간당 환산값입니다." },
            { symbol: "G", name: "GPU 수", description: "Replica 하나가 점유하는 GPU 수(tensor parallel 도) 입니다." },
            { symbol: "r", name: "tokens/s", description: "SLO 를 지키는 offered load 에서 잰 goodput 기준 output token throughput 입니다." },
            { symbol: String.raw`\mathrm{RPS}`, name: "완료 요청 수/s", description: "같은 benchmark 의 request throughput 입니다." },
          ]}
          assumptions={["GPU 가 측정 조건의 부하로 계속 차 있다는 전제입니다. 평균 utilization 이 50 % 면 실제 cost/token 은 두 배가 됩니다.", "r 은 입력·출력 길이 분포가 붙은 값이며 분포가 바뀌면 cost/token 도 바뀝니다."]}
          interpretation="cost/token 을 줄이는 길은 p 를 낮추거나 r 을 올리는 것뿐이며, r 은 SLO 가 허용하는 batch 상한에 묶여 있습니다. 처리량이 1.8 배 올라도 GPU 가 2 배면 cost/token 은 오릅니다."
        />
        <TermBreakdown
          title="비용을 세는 네 단위"
          items={[
            { term: "GPU-hour", description: "GPU 한 장의 한 시간 점유입니다.", example: "8 장 × 3 h = 24 GPU-h.", boundary: "놀고 있어도 셉니다. Utilization 은 별도로 봐야 합니다." },
            { term: "Token per GPU-second", description: "tokens/s 를 GPU 수로 나눈 GPU 한 장의 처리량입니다.", example: "2 장 1,800 tokens/s → 900.", boundary: "TP 로 묶은 GPU 는 통신 때문에 장당 값이 떨어집니다." },
            { term: "Cost per million tokens", description: "cost/token × 10⁶ 입니다.", example: "$2/GPU-h, 1,000 tokens/s → $0.56/M.", boundary: "입력·출력 token 을 같은 단가로 세면 prefill 비용이 가려집니다." },
            { term: "Cost per request", description: "시간당 비용을 시간당 완료 요청으로 나눈 값입니다.", example: "3 RPS → 요청 1,000 건에 $0.19.", boundary: "요청당 token 수가 다른 workload 끼리는 비교하지 않습니다." },
          ]}
        />
      </section>

      <section id="efficiency" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          서버를 고를 때는 throughput per dollar 와 per watt 로 비교합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Resource efficiency 는 쓴 자원 대비 낸 유효 일의 비입니다. Serving 에서 자원은
            돈과 전력 두 축으로 재며, 각각 throughput per dollar 와 performance per watt 가
            됩니다. 두 값이 높을수록 같은 token 을 더 싸게, 더 적은 전력으로 냅니다.
          </p>
          <p>
            Throughput per dollar 는 tokens/s 를 시간당 비용으로 나눈 값입니다. $2/GPU-h 에서
            1,000 tokens/s 면 500 tokens/s 당 $/h, 다르게 말하면 $1 에 1,800,000 token 입니다.
            $3/GPU-h 인 더 큰 GPU 가 1,800 tokens/s 를 낸다면 600 이라 장당 가격은 비싸도
            효율은 20 % 높습니다.
          </p>
          <p>
            Performance per watt 는 tokens/s 를 소비 전력 W 로 나눈 값입니다. 700 W 에서 1,000
            tokens/s 면 1.43 tokens/J 입니다. 이 W 는 명판의 TDP 가 아니라 부하 중 실제로 잰
            wall power 여야 하며, MLPerf 의 power 측정이 system 전체의 AC 전력을 벽에서 재는
            이유가 그것입니다.
          </p>
          <p>
            Total cost of ownership(TCO) 은 장비를 소유할 때 구매가·전력·냉각·공간·운영 인력을
            수명 전체에 걸쳐 더한 비용입니다. GPU 8 장 서버를 $250,000 에 사서 4 년 쓴다고
            가정하면 장비만 250,000 / (4 × 8,760 × 8) ≈ $0.89/GPU-h 이고, 700 W × 8 × PUE 1.3
            에 $0.12/kWh 를 곱한 전력이 약 $0.11/GPU-h 더해집니다.
          </p>
          <p>
            이 $1/GPU-h 는 GPU 가 4 년 내내 차 있을 때의 값입니다. 평균 utilization 이 40 % 면
            token 당 실제 비용은 2.5 배가 되어 $2/GPU-h 의 임대와 비슷해집니다. 소유와 임대의
            비교는 단가가 아니라 utilization 을 얼마나 높게 유지할 수 있는가의 비교입니다.
          </p>
        </div>
        <TermBreakdown
          title="효율 지표와 TCO 의 분모"
          items={[
            { term: "Throughput per dollar", description: "tokens/s ÷ $/h 입니다.", example: "1,000 / 2 = 500, 1,800 / 3 = 600.", boundary: "SLO 를 어긴 tokens/s 로 계산하면 goodput 기준보다 부풀려집니다." },
            { term: "Performance per watt", description: "tokens/s ÷ W 입니다.", example: "1,000 / 700 = 1.43 tokens/J.", boundary: "TDP 가 아니라 부하 중 wall power 로 재야 합니다." },
            { term: "TCO", description: "구매·전력·냉각·공간·운영을 수명 전체로 더한 비용입니다.", example: "$250k 서버 4 년 → 장비 $0.89/GPU-h 가정.", boundary: "Utilization 이 낮으면 시간당 환산값이 그대로 배수로 오릅니다." },
          ]}
        />
        <ProgressiveDetail
          title="입력 token 과 출력 token 의 비용을 따로 매겨야 하나요?"
          preview="Prefill 은 compute-bound, decode 는 memory-bound 라 token 당 GPU 시간이 다릅니다. 같은 단가로 세면 긴 입력 workload 의 비용이 가려집니다."
        >
          <p>
            입력 1,000 token 의 prefill 은 한 step 에 끝나지만 batch 안 다른 요청의 decode 를
            그만큼 늦춥니다. 출력 300 token 은 300 step 에 걸쳐 weight 를 300 번 읽습니다.
            그래서 API 가격표가 입력과 출력을 다르게 매기는 것이며, 내부 비용도 두 분포를
            붙인 benchmark 에서 나온 tokens/s 로 계산해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="capacity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          필요 GPU 수는 peak 를 목표 utilization 의 GPU 당 처리량으로 나눈 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Capacity planning 은 예상 트래픽을 SLO 안에서 받아 내는 데 필요한 자원의 양과 그
            확보 방식을 정하는 일입니다. 입력은 시간대별 트래픽 예측과 benchmark 가 준 GPU 당
            처리량이고, 출력은 GPU 수와 그것을 언제 어떻게 늘리고 줄일지의 정책입니다.
          </p>
          <p>
            Peak capacity 는 하루 중 가장 바쁜 구간의 요청량을 받아 내는 데 필요한 용량입니다.
            Peak 가 20 RPS, 요청당 300 token 이면 6,000 tokens/s 가 필요하고, GPU 한 장이 SLO
            아래에서 1,000 tokens/s 를 내면 6 장이 딱 맞습니다. 그러나 6 장은 앞 글의 곡선에서
            utilization 100 % 에 해당하므로 latency 가 발산하는 점입니다.
          </p>
          <p>
            그래서 목표 utilization 을 무릎 앞인 0.7 정도로 두고 6,000 / (1,000 × 0.7) = 8.57,
            올림해서 9 장으로 계획합니다. 남는 3 장 분량이 headroom 이며, 용량 9,000 tokens/s
            대 peak 6,000 이므로 headroom 은 50 % 입니다. Headroom 은 예측 오차, 장애 replica
            대체, 배포 중 일시적 용량 감소를 흡수하는 여유입니다.
          </p>
          <p>
            Headroom 을 peak 의 2 배로 잡으면 12 장이고, $2/GPU-h 가정에서 추가 3 장은 한 달에
            3 × 2 × 720 = $4,320 입니다. 평균 트래픽이 8 RPS(2,400 tokens/s) 라면 9 장의 평균
            utilization 은 27 % 이고, 그 시간대의 cost/token 은 만차 기준 $0.56/M 이 아니라
            $2.08/M 입니다.
          </p>
          <p>
            이 상태가 overprovisioning 입니다. 용량이 트래픽보다 많아 GPU-hour 가 비어 나가고
            cost/token 이 오릅니다. 반대로 underprovisioning 은 용량이 peak 보다 적은 상태라,
            그 구간에서 offered load 가 capacity 를 넘어 대기열이 쌓이고 SLO 위반이 나며 결국
            요청이 timeout 됩니다.
          </p>
          <p>
            두 상태는 같은 GPU 수에서 시간대에 따라 번갈아 나타납니다. 낮의 peak 에 맞춘 9 장은
            새벽에 과잉이고, 새벽에 맞춘 3 장은 낮에 부족합니다. 고정 용량으로는 둘 중 하나를
            고를 수밖에 없으며, 그 간격을 메우는 것이 다음 절의 reserved·on-demand 분배와
            autoscaling 입니다.
          </p>
        </div>
        <InferenceCostAndCapacityPlanningViz />
        <ExplainedFormula
          question="Peak 트래픽과 GPU 당 처리량에서 GPU 를 몇 장 두어야 하나요?"
          idea="Peak 요청량을 token 으로 바꾸고, SLO 를 지키는 GPU 당 tokens/s 에 목표 utilization 을 곱한 값으로 나누면 무릎 앞에서 운영할 GPU 수가 나옵니다. 남는 비율이 headroom 입니다."
          formula={String.raw`G=\left\lceil\frac{\mathrm{RPS}_{\text{peak}}\cdot n_{\text{req}}}{r_{\text{gpu}}\cdot u}\right\rceil,\qquad h=\frac{G\cdot r_{\text{gpu}}}{\mathrm{RPS}_{\text{peak}}\cdot n_{\text{req}}}-1`}
          annotatedFormula={String.raw`G=\left\lceil\frac{\overbrace{\mathrm{RPS}_{\text{peak}}\cdot n_{\text{req}}}^{\text{peak 에 필요한 tokens/s}}}{\underbrace{r_{\text{gpu}}\cdot u}_{\text{GPU 한 장이 목표 utilization 에서 내는 tokens/s}}}\right\rceil,\qquad h=\underbrace{\frac{G\cdot r_{\text{gpu}}}{\mathrm{RPS}_{\text{peak}}\cdot n_{\text{req}}}-1}_{\text{peak 대비 남는 용량 비율 (headroom)}}`}
          operations={[
            { expression: String.raw`\mathrm{RPS}_{\text{peak}}\cdot n_{\text{req}}`, annotation: ["peak 요청률에 요청당 token 수를 곱해", "peak 에 필요한 tokens/s 산출"] },
            { expression: String.raw`r_{\text{gpu}}\cdot u`, annotation: ["GPU 당 SLO 처리량에 목표 utilization 을 곱해", "무릎 앞에서 장당 쓸 수 있는 처리량"] },
            { expression: String.raw`\left\lceil\cdot\right\rceil`, annotation: ["나눈 값을 올림해", "정수 GPU 수 결정"] },
            { expression: String.raw`\frac{G\cdot r_{\text{gpu}}}{\mathrm{RPS}_{\text{peak}}\cdot n_{\text{req}}}-1`, annotation: ["총 용량을 peak 필요량으로 나누고 1 을 빼", "headroom 비율 산출"] },
          ]}
          terms={[
            { symbol: String.raw`\mathrm{RPS}_{\text{peak}}`, name: "Peak 요청률", description: "예측 트래픽 곡선의 최댓값(예: 20 req/s) 입니다." },
            { symbol: String.raw`n_{\text{req}}`, name: "요청당 token 수", description: "입력·출력을 benchmark 와 같은 분포로 센 요청당 token(예: 300) 입니다." },
            { symbol: String.raw`r_{\text{gpu}}`, name: "GPU 당 SLO 처리량", description: "앞 글의 λ sweep 에서 SLO 를 만족한 마지막 점의 tokens/s(예: 1,000) 입니다." },
            { symbol: "u", name: "목표 utilization", description: "Utilization–latency 곡선의 무릎 앞 값(예: 0.7) 입니다." },
          ]}
          assumptions={["r_gpu 가 planning 의 트래픽 분포에서 잰 값이라는 전제입니다. 분포가 다르면 다시 재야 합니다.", "u 는 M/M/1 직관의 무릎이며 실제 무릎은 실측 곡선에서 읽습니다. 요청 간 상관(burst) 이 크면 u 를 더 낮춥니다."]}
          interpretation="G 는 peak 기준이라 평균 트래픽에서는 항상 과잉입니다. 그 과잉을 얼마나 오래 유지하는지가 cost/token 을 정하며, 다음 절의 reserved·on-demand 분배와 autoscaling 이 그 시간을 줄이는 도구입니다."
        />
        <TermBreakdown
          title="Capacity 계획에서 구분하는 상태"
          items={[
            { term: "Peak capacity", description: "가장 바쁜 구간을 받아 내는 용량입니다.", example: "20 RPS × 300 token = 6,000 tokens/s.", boundary: "Peak 자체가 예측이라 오차가 headroom 에 들어가야 합니다." },
            { term: "Headroom", description: "Peak 대비 남는 용량 비율입니다.", example: "9 장 9,000 대 6,000 → 50 %.", boundary: "장애 replica 대체와 배포 중 감소분까지 포함해야 실제 여유입니다." },
            { term: "Overprovisioning", description: "용량이 트래픽보다 많아 GPU-hour 가 비는 상태입니다.", example: "평균 8 RPS 에 9 장 → utilization 27 %.", boundary: "SLO 는 안전하지만 cost/token 이 배수로 오릅니다." },
            { term: "Underprovisioning", description: "용량이 peak 보다 적어 대기열이 쌓이는 상태입니다.", example: "peak 20 RPS 에 6 장 → ρ = 1.", boundary: "곡선의 발산 구간이라 위반이 아니라 timeout 으로 끝납니다." },
          ]}
        />
      </section>

      <section id="scaling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          기본 부하는 reserved 로, peak 는 autoscaling 으로 채웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Reserved capacity 는 일정 기간 쓰겠다고 약정하고 할인받는 용량이고, on-demand 는
            약정 없이 시간 단위로 빌리는 용량입니다. Cloud 는 약정형(Savings Plans·Reserved) 과
            무약정 on-demand, 남는 자원을 싸게 파는 spot 을 나란히 두며, 약정은 쓰지 않아도
            비용이 나갑니다.
          </p>
          <p>
            그래서 하루 종일 있는 기본 부하는 reserved 로, 낮에만 있는 peak 는 on-demand 로
            채웁니다. 기본 6 장을 약정 40 % 할인 가정($1.2/GPU-h) 으로 한 달 6 × 1.2 × 720 =
            $5,184, peak 6 시간 동안의 추가 6 장을 on-demand $2 로 6 × 2 × 180 = $2,160, 합
            $7,344 입니다. 12 장을 모두 on-demand 로 두면 $17,280 입니다.
          </p>
          <p>
            늘리는 방향에는 두 가지가 있습니다. Scale-up 은 replica 하나를 더 큰 GPU 나 더
            많은 GPU(tensor parallel) 로 키우는 것이고, scale-out 은 같은 replica 를 여러 개
            복제하는 것입니다. 70B 모델의 fp16 weight 140 GB 는 80 GB GPU 한 장에 들어가지
            않으므로 최소 TP 2 의 scale-up 이 먼저이고, 그 다음 수요는 scale-out 으로 받습니다.
          </p>
          <p>
            둘의 비용 구조가 다릅니다. Scale-up 은 GPU 들이 layer 마다 all-reduce 로 통신해
            장당 처리량이 떨어지지만(1,000 → 900) memory 를 합쳐 쓰므로 KV cache 가 커집니다.
            Scale-out 은 replica 사이 통신이 없어 처리량이 선형으로 늘지만 replica 마다 weight
            사본을 들고 있어 memory 가 중복되고, 앞단에 load balancer 와 prefix 기반 routing 이
            필요합니다.
          </p>
          <p>
            Autoscaling 은 replica 수를 측정치에 따라 자동으로 바꾸는 제어입니다. Kubernetes
            HPA 는 15 초마다 desired = ceil(current × metric/target) 을 계산하고, 비율이 1 에서
            10 % 안이면 움직이지 않으며, 줄일 때는 5 분 안정화 창을 둡니다. 그 mechanism 은{" "}
            <Link to="/ai/llm-serving-ops#serving-deployment">HPA control loop</Link> 이 맡습니다.
          </p>
          <p>
            LLM 에서 정책의 핵심은 metric 과 지연입니다. CPU 가 아니라 대기열 길이나 KV cache
            utilization 을 metric 으로 두고, 새 replica 가 weight 를 내려받아 warmup 을 마치기
            까지 몇 분이 걸리므로 트래픽이 오른 뒤 반응하면 늦습니다. 그래서 시간대 예측으로
            미리 늘리는 scheduled scaling 을 반응형 위에 겹칩니다.
          </p>
          <p>
            마지막 항목은 GPU fragmentation 입니다. 여러 model 이나 job 이 GPU 를 쪼개 쓸 때
            남는 조각이 어느 요청에도 맞지 않아 버려지는 상태이며,{" "}
            <Link to="/ai/vllm-paged-attention#fragmentation-kinds">KV cache fragmentation</Link>
            과는 다른 층입니다. MIG 로 80 GB GPU 를 3g.40gb 와 2g.20gb 로 나누면 남는 slice 는
            1g.10gb 두 개뿐이라 4g.40gb 요청은 합이 맞아도 들어가지 못합니다.
          </p>
          <p>
            Cluster 층에서도 같은 일이 생깁니다. 8 장 node 두 대에 각각 2 장씩 비어 있으면
            합은 4 장이지만 TP 4 replica 는 한 node 에 4 장이 붙어 있어야 해서 뜨지 못합니다.
            Time-slicing 은 memory 격리 없이 시간만 나누므로 조각은 없지만 서로의 latency 를
            침범합니다. Fragmentation 을 줄이는 배치가 곧 utilization 을 올리는 배치입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="트래픽 예측에서 GPU 수·분배·autoscaling 정책까지"
          input={["시간대별 트래픽 예측 T(h) (RPS) 와 요청당 token n_req", "SLO S 와 앞 글의 λ sweep 이 준 GPU 당 처리량 r_gpu", "목표 utilization u, headroom 최소치 h_min, replica 준비 시간 d", "GPU-h 단가 p_res(약정)·p_od(on-demand)"]}
          steps={[
            { code: "need(h) ← T(h) · n_req / (r_gpu · u)", note: "시간대마다 무릎 앞에서 필요한 GPU 수입니다. 앞 글의 곡선에서 r_gpu 를 다시 재지 않으면 이 줄부터 틀립니다." },
            { code: "G_peak ← ceil(max_h need(h) · (1 + h_min))", note: "Peak 에 headroom 을 더한 상한입니다. 장애 replica 하나를 잃어도 SLO 를 지키려면 h_min 에 1/G 를 더합니다." },
            { code: "G_base ← ceil(min_h need(h))  // reserved", note: "하루 내내 있는 기본 부하는 약정 단가로 잡습니다. 쓰지 않아도 비용이 나가는 부분이라 최소치로 둡니다." },
            { code: "G_od(h) ← clamp(need(h) − G_base, 0, G_peak − G_base)", note: "시간대별 추가분입니다. On-demand 나 autoscaling 이 채웁니다." },
            { code: "policy: scale when metric ratio ∉ [1−tol, 1+tol]; lead time d", note: "대기열 길이·KV utilization 을 metric 으로 두고, 준비 시간 d 만큼 앞서 늘리도록 예측 곡선을 겹칩니다." },
            { code: "cost ← Σ_h [G_base · p_res + G_od(h) · p_od]", note: "월 비용 추정입니다. 같은 SLO 를 지키는 후보 (u, h_min, G_base) 조합 중 최소를 고릅니다." },
            { code: "place replicas to avoid fragmentation (TP group on one node)", note: "TP replica 는 한 node 의 연속 GPU 에, 작은 model 은 MIG profile 이 맞는 slice 에 배치해 조각을 줄입니다." },
          ]}
          output="G_base(reserved)·G_peak, 시간대별 G_od(h), autoscaling metric·tolerance·lead time, 월 비용 추정과 배치 제약"
        />
        <TermBreakdown
          title="용량을 늘리는 방식의 비용 구조"
          items={[
            { term: "Reserved vs on-demand", description: "약정 할인과 무약정 시간제입니다.", example: "기본 6 장 약정 + peak 6 장 on-demand → $7,344/월 (가정).", boundary: "약정은 트래픽이 줄어도 비용이 나갑니다." },
            { term: "Scale-up", description: "Replica 하나를 더 큰 GPU·더 많은 TP 로 키웁니다.", example: "70B fp16 → TP 2 필수.", boundary: "Layer 마다 all-reduce 로 장당 처리량이 줄어듭니다." },
            { term: "Scale-out", description: "같은 replica 를 복제합니다.", example: "1 → 3 replica, 처리량 3 배.", boundary: "Weight 사본이 중복되고 routing 이 필요합니다." },
            { term: "GPU fragmentation", description: "쪼개 쓴 GPU 의 남는 조각이 어느 요청에도 맞지 않는 상태입니다.", example: "3g + 2g 배치 뒤 4g 요청 불가.", boundary: "KV cache 의 block fragmentation 과는 다른 층입니다." },
          ]}
        />
        <ProgressiveDetail
          title="Autoscaling 이 있으면 headroom 을 0 으로 둬도 되나요?"
          preview="아닙니다. 새 replica 가 ready 가 되기까지의 준비 시간 동안 트래픽 증가분을 받아 낼 headroom 이 있어야 하고, 그 시간은 수 분입니다."
        >
          <p>
            HPA 가 15 초마다 계산해도 GPU replica 는 scheduling, weight 다운로드, warmup 을
            지나야 traffic-ready 가 되며 그 경로는{" "}
            <Link to="/ai/llm-serving-ops#k8s-gpu-fleet">ready-capacity path</Link> 가 다룹니다.
            준비 시간 d 가 5 분이고 트래픽이 5 분에 30 % 오를 수 있다면 headroom 은 최소 30 %
            여야 그 사이 SLO 를 지킵니다.
          </p>
          <p>
            줄이는 쪽도 마찬가지입니다. 5 분 안정화 창 없이 줄이면 트래픽이 잠깐 내려갔다
            돌아올 때 다시 cold replica 를 띄우게 되고, 그 사이 사용자는 cold TTFT 를 겪습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          가격 구조와 autoscaling 규칙은 공식 문서에서, 단가는 가정값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Reserved·on-demand·spot 의 구분은 AWS EC2 가격 문서의 구매 옵션에서, HPA 의 계산식과
            기본값은 Kubernetes 문서에서 가져왔습니다. MIG profile 과 time-slicing 의 격리 차이는
            NVIDIA 문서를, wall power 기준의 전력 측정은 MLPerf Power 설명을 따랐습니다.
          </p>
          <p>
            본문의 $2/GPU-h, 40 % 약정 할인, $250,000 서버, 1,000 tokens/s 같은 숫자는 모두
            계산을 보이기 위한 가정값입니다. 실제 시세와 처리량은 시점과 model 에 따라 달라지므로
            독자의 benchmark 와 견적으로 바꿔 넣어야 합니다.
          </p>
        </div>
        <div id="paper-hpa" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Kubernetes · Horizontal Pod Autoscaling 문서"
            citeKey={1}
            href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/"
          >
            desiredReplicas = ceil(currentReplicas × currentMetric / desiredMetric) 계산식, 기본
            sync 주기 15 초, tolerance 0.1, scale-down 안정화 창 5 분과 custom·external metric 의
            비율 계산 방식을 정의합니다. GPU replica 의 준비 시간은 다루지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-gpu-sharing" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · GPU Operator GPU sharing 문서 · MIG User Guide supported profiles"
            citeKey={2}
            href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-sharing.html"
          >
            Time-slicing 은 MIG 와 달리 replica 사이에 memory·fault 격리가 없고 시간을 균등하게
            나눌 뿐이라고 명시합니다. MIG User Guide 는 A100·H100 80 GB 에서 1g.10gb 7 개,
            2g.20gb 3 개, 3g.40gb 2 개, 4g.40gb 1 개, 7g.80gb 1 개의 profile 을 정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-aws-pricing" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="AWS · Amazon EC2 pricing (구매 옵션)"
            citeKey={3}
            href="https://aws.amazon.com/ec2/pricing/"
          >
            무약정 시간제 On-Demand, 사용량 약정으로 할인받는 Savings Plans·Reserved, 남는
            용량을 싸게 파는 Spot, 특정 zone 의 용량을 미리 잡는 Capacity Reservations 와 ML 용
            Capacity Blocks 를 구분합니다. 본문의 할인율은 이 문서의 상한이 아니라 가정값입니다.
          </CitationBlock>
        </div>
        <div id="paper-mlperf-power" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="MLCommons · MLPerf Inference Datacenter (Power 측정 설명)"
            citeKey={4}
            href="https://mlcommons.org/benchmarks/inference-datacenter/"
          >
            Server·Offline 은 system power 를, SingleStream·MultiStream 은 stream 당 energy 를
            보고하며, 전력은 benchmark 실행 동안 system 전체의 AC 전력을 벽에서 잰 값이라고
            정의합니다. TDP 명판값이 아니라 실측 전력으로 performance per watt 를 세는 근거입니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          앞 글: GPU 당 처리량 r_gpu 를 SLO 아래에서 재는{" "}
          <Link to="/ai/serving-benchmark-methodology#load">serving benchmark 방법론</Link>.
          Replica 가 traffic-ready 가 되는 경로와 HPA 의 상태는{" "}
          <Link to="/ai/llm-serving-ops#k8s-gpu-fleet">LLM serving 운영</Link>을 참고하세요.
        </p>
      </section>
    </div>
  );
}
