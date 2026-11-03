import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function SoftwareAxis() {
  return (
    <section id="software-axis" className="scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        Framework 지원 표시는 출발점일 뿐, 필요한 serving 경로를 보장하지 않습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          70B model artifact가 load된다고 비교가 끝나지 않습니다. 먼저 같은 tokenizer와
          precision으로 품질을 통과해야 합니다. 그다음 32K·동시 8 요청에서 attention
          kernel과 collective가 실제 accelerator에서 실행되는지 확인합니다.
        </p>
        <p className="leading-7">
          Production 기능도 별도 관문입니다. Batching과 prefix cache가 필요한지 먼저
          정하고, quantization·LoRA·speculative decoding과 관측 기능을 하나씩 켭니다.
          필요한 기능이 빠지거나 느린 경로로 돌아가면 같은 성능 비교가 아닙니다.
        </p>
        <p className="leading-7">
          NVIDIA는 CUDA 계열, AMD는 ROCm, Intel Gaudi는 SynapseAI, Google TPU는
          TPU compiler·runtime을 사용합니다. AWS Trainium은 Neuron stack을 사용합니다.
          모두 PyTorch 경로를 제공할 수 있어도 지원 operator와 shape 제약은 다릅니다.
          Compile 시간과 serving 기능 범위도 같지 않습니다. “Model code는 거의 그대로
          간다”는 문장만 믿고 일정을 잡으면 fallback과 재컴파일 비용을 놓칩니다.
        </p>
      </div>

      <TermBreakdown
        title="지원 여부를 네 단계로 쪼개 확인합니다"
        items={[
          {
            term: "Load",
            description: "동일 model·tokenizer artifact가 해당 runtime에서 열리고 memory에 배치됩니다.",
            example: "Artifact hash, tokenizer hash, revision과 precision을 후보마다 동일하게 고정합니다.",
            boundary: "Load 성공은 모든 operator가 accelerator에서 실행된다는 뜻이 아닙니다.",
          },
          {
            term: "Correctness",
            description: "고정 evaluation set에서 허용 오차 안의 품질과 token 결과를 냅니다.",
            example: "Quantization이나 compiler graph rewrite 뒤 정확도 gate를 먼저 통과합니다.",
            boundary: "처리량이 높아도 품질 gate가 실패하면 성능 후보가 아닙니다.",
          },
          {
            term: "Feature parity",
            description: "운영에 필요한 scheduler, cache, adapter와 decoding 기능이 실제 경로에서 켜집니다.",
            example: "Continuous batching과 prefix cache가 꺼진 fallback 결과를 기존 stack과 비교하지 않습니다.",
            boundary: "Engine이 해당 backend를 지원한다는 사실과 특정 기능 조합의 지원은 다릅니다.",
          },
          {
            term: "Operational parity",
            description: "Metric·trace·profile·upgrade·rollback·장애 격리 절차가 운영 기준을 만족합니다.",
            example: "Compile cache가 사라진 cold start와 장치 한 개 장애 뒤 복구 시간도 측정합니다.",
            boundary: "한 번의 benchmark 성공은 장기 운영 가능성을 증명하지 않습니다.",
          },
        ]}
      />

      <h3 id="acceptance-run" className="mt-10 mb-3 scroll-mt-24 break-keep text-xl font-semibold">
        동일 artifact를 정확도부터 성능까지 한 번에 통과시킵니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ol className="leading-7">
          <li>Model·tokenizer hash, precision, 32K 입력 분포와 동시 요청 8개를 고정합니다.</li>
          <li>Compile log와 profiler에서 unsupported operator·CPU fallback·재컴파일을 찾습니다.</li>
          <li>같은 evaluation set으로 정확도 gate를 먼저 통과시킵니다.</li>
          <li>필수 serving 기능을 하나씩 켜고 기능별 결과와 memory 증가를 기록합니다.</li>
          <li>Warm과 cold를 나눠 p50·p95 TTFT, TPOT, throughput, error와 전력을 잽니다.</li>
          <li>Driver·runtime·engine 버전과 compile artifact를 결과 원장에 묶습니다.</li>
        </ol>
        <p className="leading-7">
          이 순서에서는 peak 성능이 높아도 CPU fallback이나 기능 누락이 있으면 탈락
          이유를 설명할 수 있습니다. 같은 accelerator라도 runtime·driver·engine 버전이
          달라지면 결과를 새 run으로 취급합니다. 측정 조건과 percentile 해석은{" "}
          <Link to="/cs/ai/serving-benchmark-methodology">서빙 벤치마크 방법론</Link>을
          따릅니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="API 변환이 됐는데도 이식이 끝나지 않는 이유"
          preview="Source API, 실행 kernel, collective, serving feature와 운영 도구는 서로 다른 층입니다."
        >
          <p className="leading-7">
            CUDA 호출을 HIP으로 바꾸거나 PyTorch backend만 교체해도 source가 실행될 수
            있습니다. 그러나 attention·quantization custom kernel, collective algorithm,
            graph compiler의 지원 shape와 memory planner가 달라지면 같은 성능 경로가
            재현되지 않습니다.
          </p>
          <p className="leading-7">
            그래서 source 변환 성공, 정확도 통과, 기능 동등성, 목표 p95 통과를 별도
            evidence로 남깁니다. 작은 CUDA·HIP 원문 비교는{" "}
            <Link to="/cs/gpu/amd-gpu-execution-and-hip#source">실행 모델과 HIP</Link>에서,
            collective 계층은{" "}
            <Link to="/cs/gpu/gpu-collective-network">GPU collective network</Link>에서
            이어서 볼 수 있습니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
