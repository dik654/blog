import { Link } from "react-router-dom";
import SchedulerContractViz from "./viz/SchedulerContractViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Scheduler는 “누구를 먼저 처리할까?”보다 더 구체적인 실행 계약을 만듭니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          온라인 LLM은 요청 하나를 끝까지 실행한 뒤 다음 요청으로 넘어가지
          않습니다. 이미 답을 stream하는 요청, 아직 prompt를 읽는 요청, 새로
          도착해 기다리는 요청이 같은 시점에 섞입니다. vLLM scheduler는 model
          iteration이 시작될 때마다 이 상태를 읽고, <strong>어느 요청의 token을
          몇 개 계산할지</strong>와 그 결과를 저장할 <strong>KV block을 어디에
          배정할지</strong>를 결정합니다.
        </p>
        <p className="leading-8">
          그래서 scheduler의 출력은 단순한 request ID 목록이 아닙니다. 요청별 scheduled token 수, 새 KV block, speculative token,
          multimodal encoder input처럼 이번 실행에 필요한 정보를 worker가 소비할 수 있는 형태로 묶습니다. Model 실행이 끝나면 생성·수락·완료 결과가
          request state로 돌아오고 다음 iteration은 갱신된 상태에서 다시 시작합니다.
        </p>
      </div>

      <SchedulerContractViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="scheduler-boundary" className="scroll-mt-20">
          이 글은 policy와 state transition을 다루고, memory 구조는 이웃 글에 맡깁니다
        </h3>
        <p className="leading-8">
          <Link to="/ai/vllm-serving#resource-feasibility">Serving 입문 글</Link>에서
          한 iteration이 token·sequence·KV라는 세 hard budget을 모두 통과해야
          한다는 조건을 만들었습니다. 이 글은 그 예산을 RUNNING과 WAITING 요청에
          어떤 순서로 배정하는지, 긴 prefill을 왜 나누는지, KV가 부족할 때 어떤
          state transition이 일어나는지를 추적합니다.
        </p>
        <p className="leading-8">
          KV의 logical·physical block mapping과 prefix sharing은{" "}
          <Link to="/ai/vllm-paged-attention">PagedAttention</Link>, KV tensor 한
          token의 실제 byte는 <Link to="/ai/kv-cache-fundamentals#kv-shape">KV
          cache와 hybrid attention</Link>이 정본입니다.
        </p>
        <p className="leading-8">
          구현 세부는 빠르게 바뀌므로 이 글의 코드 설명은 2026년 8월에 확인한
          vLLM V1 <code>scheduler.py</code>와 <code>SchedulerConfig</code>를 기준으로
          합니다. 반면 “진행량의 차이를 계산하고, 예산을 배정하고, 결과로 상태를
          갱신한다”는 구조는 version이 달라도 scheduler를 읽는 안정적인 관점입니다.
        </p>
      </div>
    </section>
  );
}
