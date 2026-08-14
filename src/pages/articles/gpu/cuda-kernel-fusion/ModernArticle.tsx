import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FusionMegakernelViz } from "../cuda-perf-analysis/viz/FusionResourceViz";

const PRACTICES =
  "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";
const FLASH_ATTENTION = "https://arxiv.org/abs/2205.14135";

export default function ModernCudaKernelFusionArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Fusion boundary first
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Kernel fusion은 “크게 합치기”가 아니라 중간값을 어디에 남길지 고르는
            일이다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Separate kernels는 A의 output을 HBM에 쓴 뒤 B가 다시 읽습니다.
          Fusion은 같은 값을 register나 shared memory에 두고 다음 연산으로 넘겨
          launch와 intermediate traffic을 줄입니다. 하지만 합친 code가 붙잡는
          값과 자원도 함께 늘기 때문에 모든 연산을 하나로 만드는 것이 목표는
          아닙니다.
        </p>
        <TermBreakdown
          title="먼저 세 가지 범위를 구분합니다"
          description="이름이 비슷해도 줄이는 비용과 새로 소유하는 계약이 다릅니다."
          items={[
            {
              term: "Small kernel fusion",
              description:
                "Data shape·thread mapping이 비슷한 인접 연산 몇 개를 한 kernel로 연결합니다.",
              example:
                "Bias → GELU → multiply의 중간 HBM write/read와 launch를 줄입니다.",
              boundary:
                "Numerical parity, registers, actual traffic와 end-to-end를 다시 측정합니다.",
            },
            {
              term: "Megakernel",
              description:
                "서로 다른 compute·control stages를 하나의 큰 scheduling envelope가 소유합니다.",
              example:
                "GEMM·softmax·Top-K·sampling을 같은 persistent schedule 안에서 이어 처리하는 후보입니다.",
              boundary:
                "Source code가 길다는 뜻이 아니라 stage별 lifetime·resource·launch 선택권을 한 kernel이 소유하는 경계입니다.",
            },
            {
              term: "Persistent kernel",
              description:
                "Kernel을 오래 살려 두고 내부 worker가 queue에서 다음 task를 소비하는 수명 모델입니다.",
              example:
                "수백 개의 작은 host launches를 resident workers의 dequeue·execute 반복으로 바꿉니다.",
              boundary:
                "Megakernel과 함께 쓸 수 있지만 동의어가 아니며 queue·termination 계약은 별도 수업입니다.",
            },
          ]}
        />
        <FusionMegakernelViz />
        <ContentBoundary article="cuda-kernel-fusion" />
      </section>

      <section id="small-fusion" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Small fusion
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            같은 element를 짧게 변환하는 경계부터 시작한다
          </h2>
        </header>
        <p>
          Bias, activation, residual multiply처럼 같은 element를 읽고 짧게
          변환하는 연산은 block mapping과 data layout이 비슷합니다. Separate
          kernels라면 각 단계가 output tensor를 HBM에 쓰고 다음 단계가 다시
          읽지만, fused epilogue는 중간값을 register에 둔 채 이어 계산할 수
          있습니다.
        </p>
        <p>
          이 이점은 “launch가 하나 줄었다”만으로 증명되지 않습니다. Compiler가
          만든 register count와 spill, actual DRAM traffic, numerical rounding
          order와 최종 elapsed를 확인합니다. 100 ms inference에서 5 μs를
          줄인다면 0.005%이므로 유지보수·debug 비용을 정당화하지 못할 수
          있습니다.
        </p>
        <ExplainedFormula
          question="작은 fusion이 전체 workload에서 차지하는 개선 비율은 어떻게 읽을까요?"
          idea={
            <>
              줄인 시간을 같은 end-to-end baseline으로 나눈 뒤 100을 곱합니다.
              단위 변환을 먼저 맞춰야 μs 절감을 ms 전체 시간과 비교할 수
              있습니다.
            </>
          }
          formula={String.raw`G_{e2e}=100\,\Delta t/T_{base}`}
          annotatedFormula={String.raw`G_{e2e}=\underbrace{100}_{\text{percent 변환}}\times\frac{\underbrace{\Delta t}_{\text{줄인 시간}}}{\underbrace{T_{base}}_{\text{전체 baseline}}}`}
          operations={[
            {
              expression: String.raw`\Delta t/T_{base}`,
              annotation: ["절감 시간을", "같은 단위의 전체 시간으로 정규화"],
            },
            {
              expression: String.raw`100(\Delta t/T_{base})`,
              annotation: ["정규화된 비율을", "percent로 바꿉니다"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\Delta t`,
              name: "Saved elapsed time",
              description: "Fusion candidate가 줄인 end-to-end 시간입니다.",
            },
            {
              symbol: "T_{base}",
              name: "Baseline elapsed time",
              description: "같은 workload의 전체 baseline 시간입니다.",
            },
            {
              symbol: "G_{e2e}",
              name: "End-to-end gain percent",
              description: "전체 baseline 중 줄어든 시간의 백분율입니다.",
            },
          ]}
          assumptions={[
            "Baseline과 candidate의 workload·correctness·measurement boundary가 같습니다.",
            "Δt와 T_base를 같은 시간 단위로 변환합니다.",
          ]}
          interpretation="Δt=5 μs=0.005 ms, T_base=100 ms이면 G_e2e=0.005%입니다. 반대로 3–5 μs kernels가 수천 번 반복되면 합산 비중이 커질 수 있습니다."
        />
      </section>

      <section id="megakernel" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Megakernel</p>
          <h2 className="mt-2 text-2xl font-bold">
            HBM·launch 절감과 resource·scheduling 손실을 한 장부에 둔다
          </h2>
        </header>
        <p>
          서로 성격이 다른 stages를 계속 합치면 A output의 live range와 B·C
          temporaries가 겹칩니다. Thread당 register와 block shared memory가 늘어
          resident warps가 줄고, 더 심하면 spill이 생깁니다. Instruction
          footprint, dependency, divergence와 synchronization도 커질 수
          있습니다.
        </p>
        <p>
          GEMM, softmax, Top-K와 sampling은 각각 원하는 block size·warp
          역할·shared layout이 다를 수 있습니다. 하나로 합치면 stage별 최적
          launch configuration과 scheduler flexibility를 포기할 수 있습니다.
          그래서 spill이 0이어도 occupancy와 eligible warps가 먼저 줄어 느려질
          수 있습니다.
        </p>
        <ExplainedFormula
          question="Fusion 후보의 절감과 새 자원 비용을 어떤 방향으로 비교할까요?"
          idea={
            <>
              없앤 launch와 HBM intermediate 시간을 이익으로 묶고,
              occupancy·spill·divergence·scheduling 손실을 비용으로 빼서 net
              time 방향을 봅니다.
            </>
          }
          formula={String.raw`\begin{aligned}G_L&=(N_L-1)t_L\\C_R&=T_{occ}+T_{spill}+T_{div}+T_{sched}\\\Delta T&=G_L+T_{HBM,saved}-C_R\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}G_L&=\underbrace{(N_L-1)}_{\text{없앤 launches}}\underbrace{t_L}_{\text{launch당 시간}}\\[3pt]C_R&=\underbrace{T_{occ}+T_{spill}}_{\text{residency·memory 비용}}+\underbrace{T_{div}+T_{sched}}_{\text{control·배치 비용}}\\[3pt]\Delta T&=\underbrace{G_L+T_{HBM,saved}}_{\text{줄인 시간}}-\underbrace{C_R}_{\text{새로 낸 비용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`(N_L-1)t_L`,
              annotation: [
                "없앤 launch 수에",
                "launch당 비용을 곱해 절감 추정",
              ],
            },
            {
              expression: String.raw`T_{occ}+T_{spill}+T_{div}+T_{sched}`,
              annotation: [
                "fusion이 새로 만든",
                "resource와 control 비용을 합산",
              ],
            },
            {
              expression: String.raw`G_L+T_{HBM,saved}-C_R`,
              annotation: [
                "launch·HBM 이익에서",
                "새 자원 비용을 빼 net 방향 확인",
              ],
            },
          ]}
          terms={[
            {
              symbol: "N_L",
              name: "Baseline launches",
              description: "Fusion 전 연속 launch 수입니다.",
            },
            {
              symbol: "t_L",
              name: "Launch cost",
              description:
                "고정 workload에서 관찰한 launch·dependency 비용입니다.",
            },
            {
              symbol: "T_{HBM,saved}",
              name: "Saved HBM time",
              description: "없어진 intermediate traffic의 시간 기여입니다.",
            },
            {
              symbol: "T_{occ}",
              name: "Residency loss",
              description:
                "Register·shared 증가로 latency hiding이 줄어든 비용입니다.",
            },
            {
              symbol: "T_{spill}",
              name: "Spill cost",
              description: "Local load/store와 cache·DRAM traffic 비용입니다.",
            },
            {
              symbol: "T_{div}",
              name: "Divergence cost",
              description: "서로 다른 control path의 serialization 비용입니다.",
            },
            {
              symbol: "T_{sched}",
              name: "Scheduling loss",
              description: "Stage별 launch·resource 선택권을 잃은 비용입니다.",
            },
          ]}
          assumptions={[
            "이 식은 예측 모델이 아니라 같은 workload에서 측정할 항목을 빠뜨리지 않는 ledger입니다.",
            "Correctness·numerical tolerance와 output boundary가 같습니다.",
          ]}
          interpretation="ΔT가 양수일 가능성이 보여도 실제 채택은 profiler가 없는 end-to-end 반복으로 확인합니다. 큰 compute kernel이 지배하면 launch 절감보다 resource 손실이 더 클 수 있습니다."
        />
        <p>
          Register·residency·spill 자체는
          <a
            className="ml-1 text-primary hover:underline"
            href="/gpu/cuda-register-pressure"
          >
            register pressure 수업
          </a>
          에서 먼저 설명합니다. 이 글에서는 그 자원을 fusion boundary의 입력으로
          조합합니다.
        </p>
      </section>

      <section id="flash-attention" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · Tile-budgeted fusion
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            FlashAttention은 model 전체 Megakernel이 아니다
          </h2>
        </header>
        <p>
          Naive attention은 QKᵀ, softmax, PV 사이의 큰 attention matrix를 HBM에
          materialize할 수 있습니다. FlashAttention은 Q·K·V tiles를 on-chip
          memory에 stage하고 online softmax와 V 곱을 tile budget 안에서 연결해
          full matrix HBM 왕복을 피합니다. Exact attention semantics를
          유지하면서 fusion 범위를 자원에 맞춰 설계한 사례입니다.
        </p>
        <p>
          이를 “attention 전체를 아무 제약 없이 한 거대한 kernel에 넣었다”고
          읽으면 핵심을 놓칩니다. Tile size, register·shared memory, warp 역할과
          occupancy를 함께 조절해 가능한 boundary를 찾았기 때문입니다. LLM에서도
          GEMM+epilogue, norm+elementwise, quant/dequant처럼 ROI가 높은 작은
          경계가 일반적입니다.
        </p>
        <div id="paper-flashattention-io-fusion">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"
            href={FLASH_ATTENTION}
          >
            <p>
              <strong>문제:</strong> Full attention matrix materialization이
              많은 HBM↔on-chip IO를 만듭니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> Tiling과 online softmax로 exact
              attention의 HBM access를 줄입니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 논문의 memory hierarchy
              model·attention semantics·GPU와 shape 범위를 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Attention 내부 tile fusion과 IO
              complexity의 알고리즘·실험 근거입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Model 전체를 한 Megakernel로 만들면
              보편적으로 빨라진다는 주장이 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · Fusion release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Unfused·small fusion·Megakernel을 같은 receipt에서 비교한다
          </h2>
        </header>
        <p>
          Reference parity와 tolerance를 통과한 뒤, 아래 항목을 같은
          GPU·compiler·shape receipt에 나눠 기록합니다.
        </p>
        <ul className="space-y-3 pl-5 text-sm leading-7">
          <li>
            <strong>시간:</strong> warm-up 뒤 end-to-end median·p95와 kernel
            elapsed
          </li>
          <li>
            <strong>저장 자원:</strong> registers/thread, spill bytes와 block
            shared memory
          </li>
          <li>
            <strong>실행 여유:</strong> resident·eligible warps와 divergence
          </li>
          <li>
            <strong>데이터 이동:</strong> requested·actual traffic과 cache·DRAM
            변화
          </li>
        </ul>
        <p>
          Shape·batch·sequence slices 중 일부가 회귀하면 rollback하거나 더 작은
          fusion boundary로 되돌립니다.
        </p>
        <p>
          Kernel을 오래 살려 launch 자체를 다른 공급 모델로 바꾸는 설계는
          <a
            className="ml-1 text-primary hover:underline"
            href="/gpu/cuda-persistent-kernels"
          >
            persistent kernel 수업
          </a>
          에서 이어집니다.
        </p>
        <div id="paper-cuda-fusion-measurement">
          <CitationBlock
            type="code"
            citeKey={2}
            source="NVIDIA CUDA C++ Best Practices Guide 12.8.1"
            href={PRACTICES}
          >
            <p>
              <strong>문제:</strong> Optimization candidate를 correctness와
              achieved timing·bandwidth로 반복 검증해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어:</strong> APOD·effective bandwidth·reference
              comparison 지침을 제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> CUDA 12.8.1과 동일
              workload·target·precision을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> CUDA optimization의 공식 measurement
              process입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Fusion이나 특정 block
              configuration의 speedup을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
