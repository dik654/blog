import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ParallelismStrategyAndPlacementViz from "./parallelism-strategy-and-placement/viz/ParallelismStrategyAndPlacementViz";

/**
 * Parallelism 전략은 통신 대 계산 비율을 topology 안에서 최소화하는 배치입니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "네 parallel 축의 degree 를 어느 link 위에 어떻게 배치하고 그 결과를 scaling efficiency 와
 * 통신 대 계산 비율로 판정하는가"만 소유한다. 각 축이 layer 마다 보내는 byte 는
 * tensor-and-pipeline-parallel-inference 가, NVLink·PCIe 경계는 gpu-interconnects 가 소유한다.
 */
export default function ParallelismStrategyAndPlacementArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="strategy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Parallelism 전략은 GPU mesh 의 각 축에 degree 를 배정하는 결정입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            model 하나를 GPU 여러 장에 올릴 때는 TP·PP·DP 의 degree 를 각각 얼마로 둘지, 어느 GPU 묶음이 어느 축을 맡을지 정합니다. 그렇게 정한 결과가
            parallelism strategy 입니다. 그 GPU 묶음을 축 이름이 붙은 격자로 그린 것이 parallelism mesh 이고, 축을 둘 이상 동시에 쓰면 hybrid
            parallelism 이라 부릅니다.
          </p>
          <p>
            같은 16 GPU 라도 mesh 는 여러 가지입니다. TP 16 하나로 둘 수도 있고 TP 8 × PP 2 나 TP 8 × DP 2 로 나눌 수도 있습니다. 세 mesh 는
            GPU 당 weight 가 비슷합니다. 다른 것은 어느 link 로 몇 byte 를 보내는지이고, 그 차이가 token 당 시간과 초당 token 을 정합니다.
          </p>
          <p>
            판정 기준은 두 수입니다. 하나는 GPU 를 N 배로 늘렸을 때 얻은 이득의 비율인 scaling efficiency, 다른 하나는 계산 시간 대비 통신 시간의 비율인
            communication-to-computation ratio 입니다. 이 글은 70B FP16 을 8 × 80 GB node 두 대에 놓는 mesh 후보 셋을 그 두 수로
            비교하고 마지막에 degree 를 고르는 절차를 pseudocode 로 닫습니다.
          </p>
          <p>
            각 축이 layer 마다 보내는 byte 와 μs 는{" "}
            <Link to="/ai/tensor-and-pipeline-parallel-inference#decode-impact">앞 글의 통신 계산</Link>
            을 그대로 씁니다. 여기서는 그 숫자를 실제 node 와 link 위에 올립니다.
          </p>
        </div>
        <ParallelismStrategyAndPlacementViz />
        <ContentBoundary article="parallelism-strategy-and-placement" />
      </section>

      <section id="fabric-tiers" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Node 안의 NVSwitch 와 node 밖의 InfiniBand 는 대역폭이 18 배 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Mesh 를 hardware 에 올릴 때 가장 큰 경계는 node 입니다. node 안의 GPU 8 장은 NVSwitch 로 서로 직접 이어져 있습니다. NVIDIA 는
            Hopper 세대의 GPU 당 NVLink 대역폭을 900 GB/s 로 적습니다. NVSwitch 는 그 link 들을 모아 node 안 모든 GPU 쌍이 같은 속도로 통신하게
            하는 switch chip 입니다.
          </p>
          <p>
            Node 를 넘으면 GPU 마다 붙은 network adapter 를 지납니다. InfiniBand 는 RDMA 로 CPU 를 거치지 않고 원격 GPU memory 에 쓰는
            fabric 입니다. 400 Gb/s adapter 는 방향당 50 GB/s 입니다. 같은 byte 를 옮기는 데 NVSwitch 보다 18 배 오래 걸리고 고정 latency
            도 수 μs 에서 십수 μs 로 올라갑니다.
          </p>
          <p>
            이 두 계층이 배치의 첫 규칙을 만듭니다. layer 마다 통신하는 TP 는 NVSwitch 도메인 안에 가둡니다. stage 경계에서만 통신하는 PP 와 통신이 없는 DP 는
            node 경계에 놓습니다. vLLM 공식 문서도 TP 크기를 node 당 GPU 수로, PP 크기를 node 수로 두라고 적습니다.
          </p>
          <p>
            NVLink 와 PCIe 의 device 경계, GPU 와 adapter 사이의 경로는{" "}
            <Link to="/gpu/gpu-interconnects#nvlink-device-fabric-boundary">gpu-interconnects</Link>{" "}
            글이, InfiniBand 와 RoCE 의 선택은{" "}
            <Link to="/gpu/gpu-collective-network#infiniband">gpu-collective-network</Link> 글이
            소유합니다. 여기서는 두 계층의 대역폭과 latency 만 숫자로 씁니다.
          </p>
        </div>
        <TermBreakdown
          title="배치 계산에 쓰는 두 fabric 계층의 수치"
          description="사양표와 현장 값을 섞은 계산 예시이며 실제 α 와 B 는 nccl-tests 로 재야 합니다."
          items={[
            { term: "NVSwitch 도메인 (node 안)", description: "GPU 8 장이 NVLink 로 NVSwitch 에 붙어 모든 쌍이 같은 속도입니다.", example: "B = 900 GB/s (Hopper 사양), α ≈ 5 μs", boundary: "8 장을 넘는 순간 이 도메인을 벗어납니다. NVL72 같은 rack 급 도메인은 별도 hardware 입니다." },
            { term: "InfiniBand (node 사이)", description: "GPU 마다 붙은 400 Gb/s adapter 로 RDMA 를 합니다.", example: "B = 50 GB/s (방향당), α ≈ 15 μs", boundary: "adapter 수와 rail 구성에 따라 GPU 당 대역폭이 달라지며 switch 를 지나면 α 가 더 오릅니다." },
          ]}
        />
        <div id="paper-nvlink" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · NVLink and NVLink Switch (product page)"
            citeKey={1}
            href="https://www.nvidia.com/en-us/data-center/nvlink/"
            type="code"
          >
            NVIDIA 는 4 세대 NVLink 의 GPU 당 대역폭을 900 GB/s, 5 세대를 1,800 GB/s 로 적고, NVLink
            Switch chip 이 여러 NVLink 를 모아 rack 전체에서 all-to-all GPU 통신을 full NVLink 속도로
            제공한다고 설명합니다. 이 글은 그 900 GB/s 를 계산 예시의 B 로만 쓰며, 실제 collective 가
            그 값에 얼마나 가까운지는 nccl-tests 의 busbw 로 따로 재야 합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="placement" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Shard placement 는 통신이 잦은 축을 빠른 link 에 놓는 문제입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            mesh 의 각 좌표를 물리 GPU 에 대응시키는 일을 shard placement 라 부릅니다. mesh 가 TP 8 × PP 2 라고 해도 TP 그룹 여덟 장이 한 node
            에 모이는지, 두 node 에 네 장씩 흩어지는지는 별개의 결정입니다. 후자는 layer 마다의 all-reduce 가 InfiniBand 를 건너게 만듭니다.
          </p>
          <p>
            Topology-aware placement 는 그 대응을 link 지도에 맞춰 고르는 방법입니다. 규칙은 하나로
            줄어듭니다. 통신 횟수가 많은 축일수록 빠른 link 에 놓습니다. TP 는 layer 당 두 번이므로
            NVSwitch, PP 는 stage 당 한 번이므로 InfiniBand, DP 는 0 번이므로 어디든 됩니다.
          </p>
          <p>
            70B FP16 을 8 × 80 GB node 두 대, 즉 16 GPU 에 놓는 후보 셋을 decode batch 64, hidden 8192
            의 all-reduce 1 MB 기준으로 비교합니다. 후보 A 는 TP 16 으로 all-reduce 의 ring 이 node
            경계를 두 번 지나 한 번에 약 52 μs, token 당 160 번이면 8.4 ms 입니다. weight 읽기 2.6 ms
            에 더해 TPOT 은 11 ms 이고 통신이 계산의 3 배입니다.
          </p>
          <p>
            후보 B 는 TP 8 × PP 2 입니다. all-reduce 는 NVSwitch 안에서 한 번에 7 μs, token 당 1.1 ms 입니다. node 경계는 stage 사이
            activation 1 MB 가 한 번 지나 35 μs 입니다. 대신 한 token 이 두 stage 를 직렬로 지나 weight 읽기가 5.2 ms 씩 두 번이라 TPOT 은
            약 11.6 ms 로 A 와 비슷합니다. 다만 microbatch 둘을 겹치면 throughput 은 두 배입니다.
          </p>
          <p>
            후보 C 는 TP 8 × DP 2 입니다. replica 하나가 node 하나에 들어가므로 node 경계 통신은 0 이고 TPOT 은 5.2 + 1.1 = 6.3 ms,
            throughput 은 replica 둘이라 C 가 A 의 1.7 배 빠른 token 을 두 배로 냅니다. 70B 는 node 하나의 weight 140 GB 와 KV pool
            을 감당하므로 C 가 답입니다. B 는 replica 가 node 에 들어가지 않는 405B 급에서 답이 됩니다.
          </p>
          <p>
            같은 mesh 라도 placement 를 틀리면 C 가 A 가 됩니다. TP 그룹이 두 node 에 걸치게 rank 를 배정하면 통신량은 후보 A 와 같아집니다. runtime
            이 rank 를 node 순서로 채우는 기본값은 믿지 않습니다. 기동 log 의 rank 와 GPU·host 대응을 확인하는 것이 placement 점검의 전부입니다.
          </p>
        </div>
        <TermBreakdown
          title="70B FP16 을 16 GPU 에 놓는 세 mesh 의 token 당 통신"
          description="decode batch 64, hidden 8192, 80 layer, NVSwitch 900 GB/s · α 5 μs, InfiniBand 50 GB/s · α 15 μs 의 계산 예시입니다."
          items={[
            { term: "A · TP 16", description: "all-reduce ring 이 node 경계를 지나 매 layer 두 번씩 InfiniBand 를 탑니다.", example: "통신 8.4 ms + weight 2.6 ms = TPOT 11 ms, 비율 3.2", boundary: "GPU 당 weight 가 가장 작지만 통신이 이득을 다 먹습니다." },
            { term: "B · TP 8 × PP 2", description: "all-reduce 는 node 안, node 경계는 stage 당 activation 1 MB 한 번입니다.", example: "통신 1.1 ms + 경계 0.035 ms, TPOT 약 11.6 ms, throughput 2 배", boundary: "한 요청의 latency 는 줄지 않고 microbatch 가 찰 때만 이득입니다." },
            { term: "C · TP 8 × DP 2", description: "replica 하나가 node 하나에 들어가 node 경계 통신이 없습니다.", example: "통신 1.1 ms + weight 5.2 ms = TPOT 6.3 ms, throughput 2 배", boundary: "replica 가 node 하나에 들어갈 때만 가능합니다." },
          ]}
        />
      </section>

      <section id="scaling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Strong scaling 은 같은 일을 빨리, weak scaling 은 더 많은 일을 같은 시간에 하는 척도입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GPU 를 N 배로 늘리면 이상적으로는 N 배 이득이 나옵니다. 그중 실제로 얻은 비율이 scaling efficiency 입니다. 문제 크기를 고정하고 시간이 얼마나 줄었는지
            재면 strong scaling, GPU 수에 비례해 문제를 키우고 시간이 그대로인지 재면 weak scaling 입니다. 둘은 같은 배치에 대해 다른 값을 냅니다.
          </p>
          <p>
            추론에서 TP 는 strong scaling 의 축입니다. 요청 하나의 batch 를 고정한 채 GPU 를 늘려
            token 당 시간을 줄입니다. 앞 절의 후보 C 에서 TP 8 은 GPU 한 장에 다 들어간다고 가정한
            42 ms 대비 6.3 ms 이므로 strong scaling efficiency 는 42 / (8 × 6.3) = 83% 입니다.
          </p>
          <p>
            DP 는 weak scaling 의 축입니다. GPU 묶음을 두 배로 늘리며 요청도 두 배로 받아 token 당 시간은 그대로 두고 초당 token 을 두 배로 만듭니다.
            router 가 균등하고 replica 가 독립이면 효율은 100% 에 가깝습니다. 그래서 replica 가 들어가기만 하면 DP 가 가장 싼 축입니다.
          </p>
          <p>
            Strong scaling 이 100% 에 못 미치는 이유는 Amdahl 의 법칙입니다. 나눌 수 없는 부분이 남고,
            여기서는 layer 마다 붙는 all-reduce latency 가 그 부분입니다. 식과 20 배 상한의 예는{" "}
            <Link to="/gpu/cuda-perf-analysis#amdahl">cuda-perf-analysis 의 Amdahl 절</Link> 이
            소유하며, 아래 식은 그 상한을 통신 비율로 다시 쓴 것입니다.
          </p>
          <p>
            Megatron-LM 은 512 V100 에서 8.3B model 을 훈련하며 단일 GPU baseline 대비 74% 의 weak scaling 을, 8-way model
            parallel 만으로는 77% 를 보고했습니다. training 의 수치라 추론에 옮겨 적을 수는 없지만 TP 8 이 node 안에서도 4 분의 1 가까이를 통신과 중복
            계산에 잃는다는 크기 감각은 유효합니다.
          </p>
        </div>
        <ExplainedFormula
          question="GPU 를 N 배로 늘렸을 때 얻은 이득은 이상값의 몇 퍼센트인가요?"
          idea="strong scaling 은 같은 일을 N 배 GPU 로 했을 때 시간이 N 분의 1 이 되면 100% 입니다. weak scaling 은 일을 N 배로 키웠을 때 시간이 그대로면 100% 입니다. 둘 다 이상값을 실제값으로 나눈 비율이라 1 이 상한입니다."
          formula={String.raw`E_{\text{strong}}(N) = \frac{T(1)}{N\,T(N)},\qquad E_{\text{weak}}(N) = \frac{T(1,\,W)}{T(N,\,N W)}`}
          annotatedFormula={String.raw`\underbrace{E_{\text{strong}}(N)}_{\text{같은 일을 빨리}} = \frac{\underbrace{T(1)}_{\text{GPU 1 장의 시간}}}{\underbrace{N\,T(N)}_{\text{N 장 시간 × N}}},\qquad \underbrace{E_{\text{weak}}(N)}_{\text{N 배 일을 같은 시간에}} = \frac{\underbrace{T(1,\,W)}_{\text{1 장이 일 W 를 하는 시간}}}{\underbrace{T(N,\,N W)}_{\text{N 장이 일 NW 를 하는 시간}}}`}
          operations={[
            { expression: String.raw`N\,T(N)`, annotation: ["N 장의 시간에 N 을 곱해", "GPU-시간으로 환산한 실제 비용"] },
            { expression: String.raw`\frac{T(1)}{N\,T(N)}`, annotation: ["1 장의 GPU-시간을 실제 비용으로 나눠", "strong scaling efficiency"] },
            { expression: String.raw`T(N,\,N W)`, annotation: ["일을 N 배로 키운 채 N 장으로 잰 시간", "weak scaling 의 실제값"] },
            { expression: String.raw`\frac{T(1,\,W)}{T(N,\,N W)}`, annotation: ["1 장의 시간을 그 값으로 나눠", "weak scaling efficiency"] },
          ]}
          terms={[
            { symbol: "N", name: "GPU 배수", description: "baseline 대비 몇 배의 GPU 를 썼는지입니다." },
            { symbol: "T(N)", name: "N 장의 시간", description: "같은 요청·batch 를 N 장으로 처리한 token 당 시간입니다. TP 를 늘릴 때 재는 값입니다." },
            { symbol: "T(N, NW)", name: "N 배 일의 시간", description: "요청을 N 배로 받으며 N 장으로 처리한 token 당 시간입니다. DP 를 늘릴 때 재는 값입니다." },
            { symbol: "W", name: "일의 양", description: "동시 요청 수나 초당 요청 수처럼 GPU 수에 비례해 키우는 부하입니다." },
          ]}
          assumptions={["T(1) 은 GPU 한 장에 model 이 들어간다고 가정한 계산값이며 실제로 들어가지 않으면 더 작은 model 이나 더 큰 GPU 로 baseline 을 잡습니다.", "weak scaling 의 부하가 replica 사이에 균등하게 나뉜다고 가정합니다."]}
          interpretation="TP 8 의 6.3 ms 는 가상의 단일 GPU 42 ms 대비 strong scaling 83% 이고, 잃은 17% 가 all-reduce latency 입니다. DP 2 는 요청 두 배에 TPOT 그대로라 weak scaling 약 100% 입니다. TP 를 16 으로 올려 node 를 넘기면 11 ms 로 strong scaling 이 24% 까지 떨어지는데, GPU 는 두 배인데 token 당 시간은 오히려 늘어난 결과입니다."
        />
        <div id="paper-megatron-scaling" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Shoeybi et al. · Megatron-LM (arXiv 1909.08053) · Section 5.1 Scaling Analysis"
            citeKey={2}
            href="https://arxiv.org/abs/1909.08053"
          >
            DGX-2H 32 대, V100 512 장에서 node 안 NVSwitch 300 GB/s 와 node 사이 InfiniBand 100 GB/s
            구성으로, 8-way model parallel 은 77%, model + data parallel 512 GPU 는 강한 단일 GPU
            baseline 대비 74% 의 weak scaling 을 보고합니다. 저자 자기보고이며 training throughput
            이므로 이 글은 TP 가 node 안에서도 잃는 비율의 크기 감각으로만 인용하고 추론 효율로 옮기지
            않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="overlap-bottleneck" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          통신 대 계산 비율이 1 을 넘으면 GPU 를 더 넣어도 빨라지지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Communication-to-computation ratio 는 한 step 의 통신 시간을 계산 시간으로 나눈 값입니다. 비율이 0.2 면 통신이 계산의 5 분의 1
            입니다. 1 을 넘으면 GPU 가 계산보다 기다리는 시간이 깁니다. 후보 C 는 1.1 / 5.2 = 0.21, 후보 A 는 8.4 / 2.6 = 3.2 입니다.
          </p>
          <p>
            Distributed inference bottleneck 은 이 비율이 정합니다. 비율이 작으면 병목은 여전히 각 GPU 의 weight 읽기이고 TP 를 더 올리면
            빨라집니다. 비율이 1 근처를 넘으면 병목이 link 로 옮겨 가 GPU 를 더 넣어도 token 당 시간이 줄지 않습니다. 후보 A 가 후보 C 보다 GPU 는 두 배인데
            느린 이유가 그것입니다.
          </p>
          <p>
            비율을 줄이는 방법은 통신을 계산 뒤에 숨기는 것입니다. Communication–compute overlap 은 한 layer 의 all-reduce 를 다음 GEMM 과
            다른 CUDA stream 에 올려 동시에 돌리는 기법입니다. 겹쳐진 비율 o 만큼 통신 시간이 사라집니다. 앞 글의 Ring Attention 이 KV 전송을
            attention 계산 뒤에 숨긴 것이 그 예입니다.
          </p>
          <p>
            겹치려면 의존성이 없어야 합니다. TP 의 all-reduce 결과는 바로 다음 layer 의 입력이라 그
            layer 와는 겹칠 수 없고, GEMM 을 chunk 로 잘라 앞 chunk 의 all-reduce 를 뒤 chunk 의 GEMM 과
            겹치는 식으로 의존성을 쪼개야 합니다. stream 이 겹침을 허용하는 조건은{" "}
            <Link to="/gpu/cuda-sync-streams#streams">CUDA stream ordering</Link> 글이 소유합니다.
          </p>
          <p>
            Decode 에서 overlap 의 한계는 α 입니다. 1 MB all-reduce 의 7 μs 중 5 μs 가 고정 latency 라 chunk 로 잘라도 각 chunk 에
            α 가 다시 붙습니다. 그래서 decode 의 통신 비율은 overlap 보다 TP 를 NVSwitch 안에 가두는 placement 가 먼저입니다. overlap 은
            prefill 처럼 byte 항이 큰 곳에서 효과가 큽니다.
          </p>
        </div>
        <ExplainedFormula
          question="통신 비율과 overlap 이 주어졌을 때 계산 대비 효율은 얼마인가요?"
          idea="한 step 의 시간은 계산 시간에 숨기지 못한 통신 시간을 더한 값입니다. 통신을 계산 시간의 비율 R 로 쓰고 그중 o 만큼 겹쳐졌다면 남는 통신은 R(1−o) 배이며, 계산만 있을 때 대비 효율은 그 역수입니다."
          formula={String.raw`R = \frac{T_{\text{comm}}}{T_{\text{comp}}},\qquad E = \frac{1}{1 + R\,(1-o)}`}
          annotatedFormula={String.raw`\underbrace{R}_{\text{통신 대 계산 비율}} = \frac{\underbrace{T_{\text{comm}}}_{\text{step 당 통신 시간}}}{\underbrace{T_{\text{comp}}}_{\text{step 당 계산 시간}}},\qquad \underbrace{E}_{\text{계산 대비 효율}} = \frac{1}{1 + \underbrace{R\,(1-o)}_{\text{숨기지 못한 통신의 비율}}}`}
          operations={[
            { expression: String.raw`\frac{T_{\text{comm}}}{T_{\text{comp}}}`, annotation: ["통신 시간을 계산 시간으로 나눠", "통신 대 계산 비율 R"] },
            { expression: String.raw`R\,(1-o)`, annotation: ["비율에 겹치지 못한 몫을 곱해", "step 에 그대로 더해지는 통신 비율"] },
            { expression: String.raw`\frac{1}{1 + R\,(1-o)}`, annotation: ["1 에 그 몫을 더한 값의 역수를 취해", "계산만 있을 때 대비 실제 효율"] },
          ]}
          terms={[
            { symbol: String.raw`T_{\text{comm}}`, name: "통신 시간", description: "step 하나에서 collective 와 stage 경계 전송에 쓰는 시간의 합입니다. 앞 글의 α + n/B 로 셉니다." },
            { symbol: String.raw`T_{\text{comp}}`, name: "계산 시간", description: "step 하나의 weight 읽기와 GEMM 시간입니다. decode 는 weight byte 를 HBM 대역폭으로 나눈 값이 지배합니다." },
            { symbol: "o", name: "Overlap 비율", description: "통신 시간 중 계산과 동시에 진행돼 사라진 비율로 0 과 1 사이입니다." },
            { symbol: "E", name: "계산 대비 효율", description: "통신이 전혀 없을 때를 1 로 둔 step 효율입니다." },
          ]}
          assumptions={["통신과 계산이 같은 GPU 자원을 두고 경쟁하지 않는다고 가정합니다. copy engine 과 SM 이 실제로 겹칠 수 있는 조건은 stream 글의 범위입니다.", "α 가 지배하는 작은 message 는 chunk 로 잘라도 o 가 오르지 않습니다."]}
          interpretation="후보 C 는 R = 0.21, o = 0 이면 E = 83% 이고 이것이 strong scaling 83% 와 같은 수입니다. 후보 A 는 R = 3.2 에서 E = 24% 이며 o 를 0.5 로 올려도 38% 에 그칩니다. R 이 1 을 넘는 배치는 overlap 으로 구제되지 않고 placement 를 바꿔 R 자체를 낮춰야 합니다."
        />
        <ProgressiveDetail
          title="통신 비율이 낮은데도 throughput 이 GPU 수만큼 안 오르면 무엇을 의심하나요?"
          preview="비율이 낮으면 병목은 link 가 아니므로 router 편중, replica 별 prefix cache 미스, PP 의 bubble, KV pool 부족 순으로 봅니다."
        >
          <p>
            DP 에서는 요청이 replica 에 고르게 가지 않으면 한 replica 의 queue 만 길어집니다. 같은
            prompt 가 다른 replica 로 가면 prefix cache 가 빗나가 prefill 이 반복됩니다. 둘 다 통신
            비율에는 나타나지 않는 routing 문제입니다.
          </p>
          <p>
            PP 에서는 동시 요청이 microbatch 를 채우지 못하면 bubble 이 throughput 을 먹습니다. stage 수 p 와 microbatch 수 m 에서
            (p−1)/(m+p−1) 을 다시 계산합니다. m 이 작으면 PP 대신 DP 로 축을 바꾸는 쪽이 낫습니다. KV pool 이 작아 admission 이 막히는 경우는
            capacity 글의 범위입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="procedure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Degree 는 memory 로 TP 를, node 로 PP 를, 남는 GPU 로 DP 를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            지금까지의 규칙을 한 절차로 묶으면 순서가 정해집니다. 먼저 replica 하나가 들어가는 최소 GPU 수를 memory 로 구합니다. 그 수가 node 안에 들어가면 TP 로
            두고, 넘으면 node 안은 TP 로 채우고 node 수만큼 PP 로 나눕니다. 남는 GPU 는 전부 DP 에 줍니다.
          </p>
          <p>
            이 순서는 vLLM 공식 문서의 권고와 같습니다. model 이 한 GPU 에 안 들어가지만 한 node 에 들어가면 TP, 한 node 에도 안 들어가면 TP 를 node 당
            GPU 수로 두고 PP 를 node 수로 두라고 적습니다. NVLink 가 없는 node 에서는 TP 대신 PP 를 쓰라고 합니다. 아래 pseudocode 는 그 권고에
            memory 와 통신 비율 검산을 붙인 것입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="TP·PP·DP degree 선택 (memory → node 경계 → throughput)"
          input={["model weight byte W_model, 요청당 KV byte 와 목표 동시 요청 수로 구한 KV 예산 K", "GPU memory C, utilization u, node 당 GPU 수 g, node 수 n", "node 안 link (B_in, α_in), node 사이 link (B_out, α_out), layer 수 L, hidden h, decode batch T", "목표 TPOT 과 목표 초당 token"]}
          steps={[
            { code: "g_min ← ceil((W_model + K) / (u·C))  — replica 하나에 필요한 최소 GPU 수", note: "weight 와 KV 예산이 utilization 안에 들어가는 가장 작은 GPU 수입니다. 70B FP16 140 GB + KV 200 GB, 72 GB 예산이면 5 → NVLink 도메인 정렬로 8." },
            { code: "if g_min ≤ g: TP ← g_min 을 2 의 거듭제곱으로 올림; PP ← 1", note: "replica 가 node 안에 들어가면 layer 마다의 all-reduce 를 전부 NVSwitch 에 둡니다. head 수가 TP 로 나뉘어야 합니다." },
            { code: "else: TP ← g; PP ← ceil(g_min / g)", note: "node 를 넘어야 하면 node 안은 TP 로 꽉 채우고 stage 경계만 InfiniBand 를 지나게 합니다. NVLink 없는 node 면 TP 를 줄이고 PP 를 올립니다." },
            { code: "T_comm ← L·2·(α_in + 2(TP−1)/TP · T·h·2 / B_in) + (PP−1)·(α_out + T·h·2 / B_out)", note: "앞 글의 α + n/B 로 token 당 통신 시간을 셉니다. TP 가 node 를 넘으면 α_in·B_in 대신 α_out·B_out 이 들어가 이 항이 급증합니다." },
            { code: "T_comp ← (W_model / TP) / HBM 대역폭 (decode 기준); R ← T_comm / T_comp", note: "R 이 1 을 넘으면 TP 를 낮추고 PP 나 DP 로 축을 옮깁니다. TPOT ≈ PP·T_comp + T_comm 이 목표를 넘으면 TP 를 올려 T_comp 를 줄입니다." },
            { code: "DP ← floor(g·n / (TP·PP))", note: "남는 GPU 는 모두 replica 로 만들어 throughput 을 곱합니다. 초당 token 이 목표에 못 미치면 node 를 늘려 DP 를 키우는 것이 TP 를 올리는 것보다 쌉니다." },
            { code: "placement: TP 그룹의 rank 를 같은 host 의 연속 GPU 에, PP stage 를 host 순서로 배정; 기동 log 에서 rank↔host 대응 확인", note: "mesh 가 맞아도 rank 가 node 에 걸치면 후보 A 의 통신량이 됩니다." },
          ]}
          output="TP·PP·DP degree 와 rank↔GPU 배치, 그 배치의 예상 TPOT 과 통신 비율 R"
          repeatUntil="TPOT 이 목표 안이고 R < 1 이며 초당 token 이 목표 이상일 때까지 TP·PP·DP 를 조정"
        />
        <div id="paper-vllm-parallelism" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM project · Parallelism and Scaling (docs)"
            citeKey={3}
            href="https://docs.vllm.ai/en/latest/serving/parallelism_scaling.html"
            type="code"
          >
            model 이 한 GPU 에 안 들어가지만 한 node 에 들어가면 tensor parallelism 을, 한 node 에도 안
            들어가면 tensor_parallel_size 를 node 당 GPU 수로, pipeline_parallel_size 를 node 수로 두라고
            적고, NVLink 없는 L40S 같은 node 에서는 통신 overhead 가 낮은 pipeline parallelism 을
            권합니다. node 를 넘는 TP 는 InfiniBand 같은 빠른 adapter 가 있어야 한다는 문장도 있습니다.
            이 글의 절차는 그 권고에 memory 와 통신 비율 검산을 덧붙인 것이며 vLLM 의 자동 선택 기능을
            뜻하지 않습니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 읽기는 replica 하나의 KV pool 이 몇 개의 동시 요청을 감당하는지 셈하는{" "}
            <Link to="/ai/llm-serving-capacity#capacity">serving capacity</Link> 글과, 그 KV pool 이
            기동 때 어떻게 확정되는지 다루는{" "}
            <Link to="/ai/inference-runtime-anatomy#memory-plan">inference runtime 해부</Link> 글입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
