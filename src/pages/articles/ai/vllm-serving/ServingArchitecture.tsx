import ExplainedFormula from "@/components/ui/explained-formula";
import EngineBoundaryViz from "./viz/EngineBoundaryViz";
import ParallelLayoutViz from "./viz/ParallelLayoutViz";

const PARALLEL_TERMS = [
  {
    symbol: "G",
    name: "총 worker GPU 수",
    description: "같은 deployment의 regular model-worker layout에 참여하는 GPU 수입니다.",
  },
  {
    symbol: "D_P",
    name: "Data-parallel replica 수",
    description: "독립 request batch와 KV pool을 가진 model replica의 개수입니다.",
  },
  {
    symbol: "T_P",
    name: "Tensor-parallel size",
    description: "각 layer의 weight와 계산을 함께 나누는 GPU 수입니다.",
  },
  {
    symbol: "P_P",
    name: "Pipeline-parallel size",
    description: "연속 layer 묶음을 서로 다른 stage에 배치한 개수입니다.",
  },
] as const;

const GOODPUT_TERMS = [
  {
    symbol: "y_r",
    name: "요청 r의 output token",
    description: "측정 구간에 완료된 요청 r이 생성한 token 수입니다.",
  },
  {
    symbol: "\mathbf{1}[SLO_r]",
    name: "SLO 통과 indicator",
    description: "요청 r이 정한 TTFT·ITL·E2E·오류율 기준을 모두 통과하면 1입니다.",
  },
  {
    symbol: "\Delta t",
    name: "측정 시간",
    description: "Warm-up과 종료 drain 규칙을 고정한 workload replay 구간입니다.",
  },
] as const;

export default function ServingArchitecture() {
  return (
    <section id="serving-architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Endpoint 한 개 안에서도 frontend·engine core·executor·worker의 실패 원인은 다릅니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          API frontend는 request validation·tokenization·HTTP streaming을 맡고,
          engine core는 request state와 scheduling을 소유합니다. Model executor는
          worker 실행과 collective communication을 조정하며, GPU worker는 실제
          model forward·attention kernel·sampling을 수행합니다. 이 경계를 지키면
          느린 client connection, engine queue 증가, collective stall, kernel
          regression을 같은 “latency 문제”로 뭉개지 않고 각 span과 metric으로
          좁힐 수 있습니다.
        </p>
      </div>

      <EngineBoundaryViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="v1-boundary" className="scroll-mt-20">
          V1의 세부 class 이름보다 request state의 소유권을 먼저 봅니다
        </h3>
        <p className="leading-8">
          <a href="https://docs.vllm.ai/en/stable/usage/v1_guide/">vLLM V1 공식
          가이드</a>와 engine core code는 계속 바뀔 수 있습니다. 운영 문서에는
          “scheduler class가 무엇이다”만 적기보다 request ID·token count·KV block·
          sampling result를 어느 process가 소유하고 어떤 message로 넘기는지,
          runtime version과 feature flag가 무엇인지 남기는 편이 안전합니다.
        </p>

        <h3 id="parallel-layout" className="scroll-mt-20">
          GPU를 늘리는 세 방식은 같은 scale-out이 아닙니다
        </h3>
      </div>

      <ParallelLayoutViz />

      <ExplainedFormula
        question="Regular deployment에서 data·tensor·pipeline parallelism은 GPU 수와 어떻게 연결될까요?"
        idea={
          <>
            한 replica의 model을 TP×PP GPU에 놓고, 그 replica를 DP개 복제한다고
            보면 총 GPU 수는 세 축의 곱입니다. 무엇을 늘렸는지에 따라 request
            routing·collective traffic·pipeline bubble·KV locality가 다르게
            변합니다.
          </>
        }
        formula={String.raw`G=D_P\times T_P\times P_P`}
        terms={PARALLEL_TERMS}
        assumptions={[
          "모든 replica가 같은 TP·PP 크기를 쓰는 regular homogeneous layout입니다.",
          "Expert parallel·context parallel·standby rank·disaggregated prefill 같은 추가 축은 표시하지 않았습니다.",
          "GPU 수가 식에 맞는다는 사실은 model memory 적합성이나 interconnect latency가 충분하다는 보장이 아닙니다.",
        ]}
        interpretation="예를 들어 DP=2, TP=4, PP=1이면 4-GPU model replica가 두 개이고 총 8 GPU입니다. TP를 늘리면 한 request의 layer마다 collective가 늘고, DP를 늘리면 독립 queue·KV pool이 늘어 routing이 중요해집니다."
        title="Regular model-worker topology"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="serving-goodput" className="scroll-mt-20">
          최대 tokens/s보다 SLO를 지킨 goodput을 승인 기준으로 둡니다
        </h3>
        <p className="leading-8">
          Batch를 계속 키우면 aggregate throughput은 오르면서 TTFT나 ITL tail이
          나빠질 수 있습니다. 그래서 실제 prompt/output/arrival trace를 replay하고,
          latency와 오류율 기준을 통과한 요청이 만든 token만 goodput으로 셉니다.
          이렇게 해야 느린 요청을 무시해 얻은 높은 처리량을 성공으로 착각하지
          않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="처리량이 높아도 사용자 latency 기준을 어긴 결과를 어떻게 제외할까요?"
        idea={
          <>
            측정 구간의 모든 output token을 더하는 대신, 사전에 정한 SLO를 통과한
            요청의 token에만 1을 곱합니다. SLO에는 workload에 맞는 TTFT·ITL·E2E와
            오류 조건을 함께 고정합니다.
          </>
        }
        formula={String.raw`\mathrm{Goodput}_{SLO}
=\frac{\sum_r y_r\,\mathbf{1}[SLO_r]}{\Delta t}`}
        terms={GOODPUT_TERMS}
        assumptions={[
          "SLO threshold와 workload distribution을 tuning 전에 고정합니다.",
          "완료·취소·timeout·오류 요청의 포함 규칙과 output-token counting 기준을 명시합니다.",
          "Quality regression·비용·energy·운영 안정성은 goodput 밖의 별도 guardrail입니다.",
        ]}
        interpretation="두 설정의 raw tokens/s가 같아도 p95 TTFT를 넘는 요청이 많은 설정은 SLO goodput이 더 낮습니다. 최종 설정은 quality와 readiness를 통과한 후보의 goodput–latency Pareto frontier에서 고릅니다."
        title="SLO를 만족한 serving goodput"
      />
    </section>
  );
}
