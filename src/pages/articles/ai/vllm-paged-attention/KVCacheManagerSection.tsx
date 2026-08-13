import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import AllocationContractViz from "./viz/AllocationContractViz";

const ALLOC_TERMS = [
  {
    symbol: "n^{computed}",
    name: "기존 계산 token",
    description: "Request가 현재까지 KV state를 만든 token 수입니다.",
  },
  {
    symbol: "n^{new}",
    name: "이번 scheduled token",
    description: "Scheduler가 이번 iteration에 새로 계산하려는 token 수입니다.",
  },
  {
    symbol: "n^{look}",
    name: "Lookahead token",
    description: "Speculative decoding 등에서 미리 확보해야 하는 추가 slot 수입니다.",
  },
  {
    symbol: "m^{owned}",
    name: "현재 연결된 block 수",
    description: "Prefix hit와 기존 allocation을 포함해 request block table이 이미 가진 block 수입니다.",
  },
  {
    symbol: "m^{alloc}",
    name: "새로 필요한 block 수",
    description: "이번 실행을 안전하게 담기 위해 free pool에서 더 가져와야 하는 block 수입니다.",
  },
] as const;

export default function KVCacheManagerSection() {
  return (
    <section id="kv-cache-manager" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        KVCacheManager는 scheduler의 token 계획을 block allocation으로 변환합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Scheduler는 free queue와 hash map을 직접 수정하지 않습니다. “Request r이
          token을 n개 더 계산하고 lookahead slot도 보존할 수 있는가?”를
          KVCacheManager에 요청합니다. Manager는 이미 cache hit한 prefix, 현재
          block table의 마지막 partial block, 새 scheduled token과 lookahead를
          합쳐 필요한 physical block 수를 계산합니다.
        </p>
      </div>

      <AllocationContractViz />

      <ExplainedFormula
        question="기존 마지막 block의 빈 slot까지 고려해 새로 가져올 block 수를 어떻게 계산할까요?"
        idea={
          <>
            실행 뒤 보존해야 할 전체 token 위치를 block 수로 올림한 다음 이미 연결된
            block 수를 뺍니다. 결과가 0이면 기존 partial block 안에 들어가며,
            양수이면 그만큼 free pool에서 더 필요합니다.
          </>
        }
        formula={String.raw`m^{alloc}=\max\!\left(
0,\;
\left\lceil\frac{n^{computed}+n^{new}+n^{look}}{B}\right\rceil
-m^{owned}
\right)`}
        terms={ALLOC_TERMS}
        assumptions={[
          "단일 full-attention cache group을 설명하는 개념 식이며 실제 manager는 cached token·block alignment·encoder/Mamba state를 추가로 다룹니다.",
          "m_owned의 마지막 block이 partial이면 그 빈 slot을 먼저 사용할 수 있습니다.",
          "필요 block 수가 free block보다 크면 allocation은 실패하고 scheduler가 batch를 줄이거나 preempt합니다.",
        ]}
        interpretation="B=16, computed=30, new=5, lookahead=4이면 총 39 slot이 필요해 3 block입니다. 이미 2 block을 갖고 있으므로 새 block 하나가 필요합니다."
        title="Scheduled token에서 physical block demand로"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="allocation-failure" className="scroll-mt-20">
          Allocation 실패는 manager의 반환값이고, 누구를 멈출지는 scheduler의 policy입니다
        </h3>
        <p className="leading-8">
          Manager가 충분한 block을 확보하지 못하면 scheduler에 실패를 돌려줍니다.
          Manager가 임의로 다른 request를 중단하지는 않습니다. Scheduler가 policy와
          queue order를 보고 victim을 고른 뒤 block을 반환하고 다시 allocation을
          시도합니다. 이 책임을 섞으면 memory bug와 fairness bug를 같은 계층에서
          추적하게 됩니다. Current V1의 state reset은
          <Link to="/ai/vllm-scheduler#preemption"> preemption 글</Link>에서 설명합니다.
        </p>

        <h3 id="hybrid-cache-groups" className="scroll-mt-20">
          Hybrid model에서는 layer마다 보존 길이와 state 형태가 달라질 수 있습니다
        </h3>
        <p className="leading-8">
          Full attention, sliding-window attention, Mamba state가 섞인 model은 모든
          layer가 같은 KV 규칙을 쓰지 않습니다. vLLM은 compatible한 layer를 cache
          group으로 묶고 coordinator가 group별 manager를 함께 움직입니다. 그래서
          단일 block 식은 개념을 이해하는 출발점이고, 실제 capacity는 runtime이
          만든 cache spec·group·block 수를 기준으로 확인해야 합니다.
        </p>
        <p className="leading-8">
          Layer 수·KV head·head dimension·local window가 token당 byte와 유효 token
          capacity에 어떻게 들어가는지는
          <Link to="/ai/hybrid-attention-serving"> KV Cache와 Local·Global Attention</Link>이
          정본입니다. <code>GPU KV cache size</code>와 maximum concurrency log가
          이론 계산과 맞는지도 그 글의 consistency 식으로 검증합니다.
        </p>
      </div>
    </section>
  );
}
