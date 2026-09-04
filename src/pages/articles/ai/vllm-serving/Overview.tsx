import ExplainedFormula from "@/components/ui/explained-formula";

import { Link } from "react-router-dom";
import RequestLifecycleViz from "./viz/RequestLifecycleViz";
import PrefillDecodeViz from "./viz/PrefillDecodeViz";

const LATENCY_TERMS = [
  {
    symbol: "t_{queue}",
    name: "Queue time",
    description: "요청이 engine에 들어온 뒤 처음 scheduling될 때까지 기다린 시간입니다.",
  },
  {
    symbol: "t_{prefill}",
    name: "Prefill time",
    description: "Prompt token을 처리하고 첫 output token을 낼 준비를 마치는 시간입니다.",
  },
  {
    symbol: "TTFT",
    name: "Time to first token",
    description: "Client가 요청을 보낸 뒤 첫 output token을 받을 때까지의 시간입니다.",
  },
  {
    symbol: "ITL_j",
    name: "Inter-token latency",
    description: "j번째 output token과 다음 output token 사이의 시간입니다.",
  },
  {
    symbol: "N_{out}",
    name: "Output token 수",
    description: "요청이 완료될 때까지 실제 생성해 stream한 token 수입니다.",
  },
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        vLLM은 model을 한 번 실행하는 도구가 아니라, 끝나는 시간이 다른 요청을 계속 조립하는 engine입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          한 사용자의 문장 생성은 prompt를 읽고 다음 token을 반복해서 만드는 과정입니다. 온라인 서비스에서는 수십 개의 요청이 서로 다른 시점에 들어오고 prompt와
          output 길이도 모두 다릅니다. “batch size 32로 model을 실행한다”는 설명만으로는 어느 요청이 기다리고, 언제 batch에 합류하며, 완료된 자리의
          memory가 언제 반환되는지 알 수 없습니다.
        </p>
        <p className="leading-8">
          vLLM은 각 요청을 <em>sequence state</em>로 보관하고, scheduler가 GPU
          iteration마다 이번에 계산할 token들을 다시 선택하도록 만듭니다. 선택된
          token은 model executor가 worker의 batch로 내리고, 결과 token과 KV cache
          상태가 engine으로 돌아오면 완료·중단·다음 iteration을 결정합니다. 이
          글에서는 이 전체 수명주기를 먼저 잡은 뒤 scheduler·PagedAttention·
          speculative decoding으로 범위를 확장합니다.
        </p>
      </div>

      <RequestLifecycleViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="prefill-decode" className="scroll-mt-20">
          Prefill과 decode는 같은 model을 쓰지만 GPU에 주는 일이 다릅니다
        </h3>
        <p className="leading-8">
          <strong>Prefill</strong>은 prompt의 여러 token을 처리해 각 layer의 KV
          cache를 만들며 첫 output token까지 준비합니다. 긴 prompt는 한 번에 큰
          matrix multiplication을 만들 수 있어 compute 활용이 좋아지는 대신 한
          요청이 많은 token budget을 차지합니다. <strong>Decode</strong>는 이미
          만든 cache를 읽으며 요청마다 새 token을 보통 하나씩 처리합니다. 낮은
          batch에서는 weight·KV를 읽는 memory traffic과 iteration overhead가
          상대적으로 두드러집니다.
        </p>
      </div>

      <PrefillDecodeViz />

      <ExplainedFormula
        question="사용자가 느낀 지연을 queue·prefill·decode 중 어디에서 잃었는지 어떻게 나눌까요?"
        idea={
          <>
            첫 token까지의 시간과 그 뒤 token 사이의 시간을 나눕니다. TTFT가
            나빠졌다면 queue나 prefill을 먼저 보고, 첫 token은 빠른데 답 전체가
            느리다면 decode iteration의 ITL 분포를 확인합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
TTFT &\approx t_{queue}+t_{prefill}+t_{front} \\
T_{E2E} &= TTFT+\sum_{j=1}^{N_{out}-1}ITL_j \\
TPOT &= \frac{T_{E2E}-TTFT}{\max(N_{out}-1,1)}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
TTFT &\approx t_{queue}+t_{prefill}+t_{front} \\
T_{E2E} &= \underbrace{TTFT+\sum_{j=1}^{N_{out}-1}ITL_j}_{\text{오른쪽 항으로 결과 계산}} \\
TPOT &= \underbrace{\frac{T_{E2E}-TTFT}{\max(N_{out}-1,1)}}_{\text{기준량당 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`TTFT+\sum_{j=1}^{N_{out}-1}ITL_j`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","첫 token까지의 시간과 그 뒤 token 사이의 시간을","나눕니다."] },
          { expression: String.raw`\frac{T_{E2E}-TTFT}{\max(N_{out}-1,1)}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","첫 token까지의 시간과 그 뒤 token 사이의 시간을","나눕니다."] },
        ]}
        terms={LATENCY_TERMS}
        assumptions={[
          "Client·gateway·frontend 시간을 t_front에 포함하거나 별도 span으로 측정한다고 먼저 정합니다.",
          "Streaming response에서 token timestamp가 있고 tokenizer·stop 처리 기준이 동일합니다.",
          "TPOT는 평균 간격이므로 p95 ITL spike나 burst 전송을 숨길 수 있어 ITL histogram도 함께 봅니다.",
        ]}
        interpretation="같은 E2E latency라도 긴 queue 뒤 빠른 decode와 즉시 시작한 느린 decode는 원인이 다릅니다. vLLM 설정을 바꿀 때 TTFT·queue time·ITL·output length를 같은 request trace에 묶어야 합니다."
        title="온라인 generation latency의 분해"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          이 글은 engine 전체의 입구입니다. GPU iteration을 어떻게 채우는지는
          <Link to="/ai/vllm-scheduler">vLLM Scheduler</Link>, KV cache를
          block으로 소유하는 방식은
          <Link to="/ai/vllm-paged-attention"> PagedAttention</Link>, 한 target
          실행에서 여러 token을 확정하는 방식은
          <Link to="/ai/vllm-spec-decode"> Speculative Decoding</Link>에서
          이어집니다.
        </p>
      </div>
    </section>
  );
}
