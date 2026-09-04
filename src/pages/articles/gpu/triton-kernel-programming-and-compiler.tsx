import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TritonKernelProgrammingAndCompilerViz from "./triton-kernel-programming-and-compiler/viz/TritonKernelProgrammingAndCompilerViz";

/**
 * Triton: block 프로그래밍 모델·autotune·MLIR 컴파일·specialization
 *
 * Triton kernel 이 무엇을 프로그래머에게 남기고 무엇을 compiler 에 넘기는지를 소유한다.
 * CUDA·CUTLASS·CuTe·Triton 의 층 구분은 /gpu/cuda-kernel-fusion#kernel-stack 이,
 * coalescing 과 shared memory 의 하드웨어 규칙은 /gpu/cuda-shared-memory 가 소유한다.
 */
export default function TritonKernelProgrammingAndCompilerArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="block-program" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Triton kernel 은 thread 가 아니라 block 하나를 맡는 program 을 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            CUDA kernel 은 thread 하나가 원소 하나를 다루는 scalar program 이고 Triton kernel 은 program instance 하나가
            BLOCK_SIZE 개의 원소를 한 번에 다루는 block program 입니다. 프로그래머는 block 안의 원소가 어느 thread 에 배정되는지를 쓰지 않습니다. 그
            배정과 메모리 접근 순서는 compiler 가 정합니다.
          </p>
          <p>
            Triton 은 Python 문법 위에 얹힌 kernel DSL 입니다. <code>@triton.jit</code> 을 붙인
            함수가 kernel 이고, 그 안에서는 Python 기본 연산과 <code>triton.language</code>(tl)
            의 builtin, 다른 jit 함수만 부를 수 있습니다. 함수 본문은 실행되지 않고 compiler 의
            입력이 됩니다.
          </p>
          <p>
            Kernel 을 띄우면 grid 크기만큼의 program instance 가 생기고, 각 instance 는
            <code>tl.program_id(axis)</code> 로 자기 번호 pid 를 받습니다. CUDA 의 block index 와
            같은 자리지만 그 아래 thread index 가 없습니다. Instance 가 맡을 원소 범위는 pid 와
            BLOCK_SIZE 로 계산합니다.
          </p>
          <p>
            Vector add 의 공식 예는 N = 98432 원소에 BLOCK_SIZE = 1024 를 씁니다. Grid 는
            <code>triton.cdiv(98432, 1024)</code> = 97 이라 program instance 97개가 뜨고, pid 96
            의 마지막 block 은 98304 부터 시작해 128 원소만 실제 데이터에 걸칩니다.
          </p>
          <p>
            나머지 896 lane 을 걸러 내는 것이 mask 입니다. <code>mask = offsets &lt; N</code> 은
            block 과 같은 모양의 boolean tensor 이고, <code>tl.load(ptr + offsets, mask=mask,
            other=0.0)</code> 는 mask 가 거짓인 lane 을 읽지 않고 other 로 채웁니다.
            <code>tl.store(ptr + offsets, y, mask=mask)</code> 는 그 lane 에 쓰지 않습니다.
          </p>
          <p>
            CUDA 라면 <code>if (i &lt; N)</code> 분기로 thread 마다 처리하던 경계가 Triton 에서는
            block 연산의 인자 하나로 들어갑니다. 경계뿐 아니라 matmul 의 K 꼬리, 대각선 아래만
            읽는 causal mask 도 같은 자리에 들어가므로 masked load/store 가 Triton 의 유일한
            경계 도구입니다.
          </p>
          <p>
            BLOCK_SIZE 는 <code>tl.constexpr</code> 로 선언합니다. <code>tl.arange(0, BLOCK_SIZE)</code>
            의 길이가 곧 tensor 의 shape 이라 compile 시점에 값이 정해져야 하며, 2 의 거듭제곱만
            허용됩니다. 이 값이 specialization 과 autotune 의 축이 되는 이유는 뒤 절에서 이어집니다.
          </p>
        </div>
        <TritonKernelProgrammingAndCompilerViz />
        <ExplainedFormula
          question="Program instance 하나가 맡는 원소 범위와 경계 mask 는 어떻게 정해지나요?"
          idea="pid 에 BLOCK_SIZE 를 곱해 block 의 시작을 얻고 arange 를 더해 block 안의 모든 offset 을 한 번에 만듭니다. 그 offset 이 N 보다 작은지가 lane 마다의 mask 입니다."
          formula={String.raw`\begin{aligned}
\mathrm{offsets} &= \mathrm{pid}\cdot B + \mathrm{arange}(0, B) \\
\mathrm{mask} &= \mathrm{offsets} < N,\qquad G=\left\lceil N / B \right\rceil
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
\mathrm{offsets} &= \underbrace{\mathrm{pid}\cdot B}_{\text{이 instance 의 block 시작}} + \underbrace{\mathrm{arange}(0, B)}_{\text{block 안 lane 번호 0..B-1}} \\
\mathrm{mask} &= \underbrace{\mathrm{offsets} < N}_{\text{lane 별 유효 여부}},\qquad \underbrace{G=\left\lceil N / B \right\rceil}_{\text{grid 의 instance 수}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\mathrm{pid}\cdot B`, annotation: ["pid 96, B 1024 이면 98304", "이 instance 가 맡는 첫 원소"] },
            { expression: String.raw`\mathrm{arange}(0, B)`, annotation: ["길이 B 의 정수 tensor 를 만들어", "block 전체 offset 을 한 연산으로 생성"] },
            { expression: String.raw`\mathrm{offsets} < N`, annotation: ["원소별 비교로 boolean block 을 만들어", "load·store 의 mask 인자로 전달"] },
            { expression: String.raw`\left\lceil N / B \right\rceil`, annotation: ["98432 / 1024 = 96.125 를 올려 97", "마지막 instance 가 꼬리 128 원소를 맡음"] },
          ]}
          terms={[
            { symbol: String.raw`\mathrm{pid}`, name: "Program id", description: "tl.program_id(axis=0) 이 돌려주는 이 instance 의 grid 상 번호입니다." },
            { symbol: String.raw`B`, name: "BLOCK_SIZE", description: "Instance 하나가 맡는 원소 수이며 tl.constexpr 로 compile 시점에 고정되는 2 의 거듭제곱입니다." },
            { symbol: String.raw`N`, name: "원소 수", description: "실제 데이터 길이입니다. Runtime 인자라 instance 마다 같은 값을 받습니다." },
            { symbol: String.raw`G`, name: "Grid 크기", description: "Launch 시 grid lambda 가 meta['BLOCK_SIZE'] 로 계산하는 program instance 수입니다." },
          ]}
          assumptions={["1차원 grid 와 1차원 block 의 경우입니다. Matmul 은 pid 를 (pid_m, pid_n) 두 좌표로 나누고 offsets 를 2차원 broadcast 로 만듭니다.", "N 이 B 의 배수이면 mask 가 항상 참이지만 compiler 는 그 사실을 모르므로 mask 연산은 그대로 남습니다."]}
          interpretation="Offset 과 mask 가 모두 block 모양의 tensor 이므로 경계 처리가 분기가 아니라 데이터가 됩니다. Compiler 는 이 block 을 warp 와 thread 에 나눠 실을 때 offset 이 연속이라는 사실을 보고 coalesced 접근을 고릅니다."
        />
        <ContentBoundary article="triton-kernel-programming-and-compiler" />
      </section>

      <section id="launch-and-autotune" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          num_warps 와 num_stages 는 자원 배치를, autotune 은 그 조합을 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Block 의 원소를 실제로 나눠 갖는 thread 수는 kernel 본문이 아니라 launch 의
            meta-parameter 인 <code>num_warps</code> 가 정합니다. Instance 하나가 num_warps 개의
            warp, 즉 32 × num_warps 개 thread 로 실행됩니다. <code>num_stages</code> 는 K 루프처럼
            반복되는 load 를 몇 단계 앞서 미리 읽을지 정하는 software pipelining 깊이입니다.
          </p>
          <p>
            Matmul tile 을 128 × 128 × 32 로 잡고 num_warps = 8 을 주면 thread 256개가 output
            tile 16384 원소를 나눠 갖습니다. Warp 하나가 2048 원소, thread 하나가 fp32 accumulator
            64개를 register 로 들고 있는 셈입니다. num_warps 를 4 로 줄이면 thread 당 128개가
            되어 register 압박이 커집니다.
          </p>
          <p>
            num_stages = 3 이면 K 루프의 A tile(128 × 32)과 B tile(32 × 128)을 3단계 분량,
            fp16 기준 3 × 8192 × 2 byte = 48 KB 를 shared memory 에 미리 올려 둡니다. 단계를 늘릴수록
            load 지연이 가려지지만 shared memory 가 그만큼 늘어 SM 에 함께 놓일 수 있는
            instance 수가 줄어듭니다. 이 자원 계산은 <Link to="/gpu/cuda-shared-memory#overview">shared memory</Link> 글의
            규칙을 그대로 따릅니다.
          </p>
          <p>
            어느 조합이 빠른지는 GPU 와 입력 shape 에 따라 다르므로 Triton 은 실측으로 고릅니다.
            <code>@triton.autotune(configs=[...], key=["M", "N", "K"])</code> 는 <code>triton.Config</code>
            목록을 받고, key 로 지정한 인자의 값이 처음 보는 조합일 때 config 를 전부 실행해 가장
            빠른 것을 그 key 에 기억합니다.
          </p>
          <p>
            Config 하나는 BLOCK_SIZE_M·BLOCK_SIZE_N·BLOCK_SIZE_K·GROUP_SIZE_M 같은 constexpr 값과
            num_warps·num_stages 의 묶음입니다. 이 묶음 하나가 곧 kernel variant 하나이고 config 목록 전체가 autotuning search space
            입니다.
          </p>
          <p>
            Config 6개에 서로 다른 (M, N, K) 가 2개 들어오면 첫 호출마다 6개 variant 를 컴파일하고
            벤치마크해 12번의 컴파일과 두 번의 탐색이 일어납니다. 같은 (M, N, K) 가 다시 오면
            기억한 config 로 바로 실행합니다. 탐색 비용은 첫 호출에 몰리므로 warmup 없이 잰
            첫 iteration 시간은 kernel 성능이 아닙니다.
          </p>
          <p>
            Search space 를 줄이는 손잡이가 <code>prune_configs_by</code> 입니다. 성능 모델로 상위
            k 개만 남기거나 shape 조건으로 config 를 걸러 컴파일 수를 줄입니다.
            <code>reset_to_zero</code> 와 <code>restore_value</code> 는 벤치마크가 반복 실행되는
            동안 accumulate 되는 출력 인자를 되돌리는 안전장치입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Triton matmul kernel 한 program instance 의 흐름"
          input={["a_ptr, b_ptr, c_ptr 와 M, N, K, stride 들 (runtime 인자)", "BLOCK_SIZE_M, BLOCK_SIZE_N, BLOCK_SIZE_K, GROUP_SIZE_M (tl.constexpr)", "num_warps, num_stages (launch meta-parameter)"]}
          steps={[
            { code: "pid = tl.program_id(0);  num_pid_m = cdiv(M, BM);  num_pid_n = cdiv(N, BN)", note: "Grid 는 1차원이며 output tile 수 num_pid_m × num_pid_n 만큼의 instance 가 뜹니다." },
            { code: "group_id = pid // (GROUP_SIZE_M · num_pid_n);  pid_m, pid_n = grouped ordering(pid)", note: "GROUP_SIZE_M 행씩 묶어 순서를 바꾸면 같은 A·B tile 을 L2 에서 재사용하는 instance 가 이웃이 됩니다. 공식 tutorial 은 이 재배열만으로 A100 에서 220 → 245 TFLOPS 를 보고합니다." },
            { code: "offs_am = pid_m·BM + arange(BM);  offs_bn = pid_n·BN + arange(BN);  offs_k = arange(BK)", note: "1차원 arange 를 [:, None]·[None, :] 로 broadcast 해 2차원 offset block 을 만듭니다." },
            { code: "acc = tl.zeros((BM, BN), float32)", note: "Output tile 전체가 accumulator 입니다. num_warps 개 warp 가 이 tile 을 나눠 register 에 듭니다." },
            { code: "for k in range(cdiv(K, BK)):  a = tl.load(a_ptrs, mask=offs_k[None,:] < K − k·BK, other=0.0)", note: "K 의 꼬리 tile 은 mask 로 잘라 0 을 채웁니다. num_stages 단계만큼 다음 iteration 의 load 가 미리 발행됩니다." },
            { code: "  b = tl.load(b_ptrs, mask=offs_k[:,None] < K − k·BK, other=0.0);  acc = tl.dot(a, b, acc)", note: "tl.dot 은 tensor core 명령으로 낮춰집니다. Shape 이 constexpr 이라 compiler 가 MMA 명령 크기를 정할 수 있습니다." },
            { code: "  a_ptrs += BK·stride_ak;  b_ptrs += BK·stride_bk", note: "Pointer block 을 K 방향으로 한 tile 씩 옮깁니다." },
            { code: "c = acc.to(float16);  c_mask = (offs_cm[:,None] < M) & (offs_cn[None,:] < N);  tl.store(c_ptrs, c, mask=c_mask)", note: "Epilogue 입니다. Activation 이나 bias 를 여기서 곱하면 별도 kernel 없이 fusion 이 됩니다." },
          ]}
          output="Output tile 하나가 C 의 (pid_m, pid_n) 자리에 쓰입니다. Instance 전체가 끝나면 C 가 완성됩니다."
        />
      </section>

      <section id="jit-specialization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          JIT 는 dtype 과 constexpr 과 인자 성질로 variant 를 나눠 컴파일합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>@triton.jit</code> 함수는 정의 시점이 아니라 첫 호출 시점에 컴파일됩니다. 그때
            runtime 이 인자를 보고 cache key 를 만들고, 같은 key 가 cache 에 있으면 컴파일 없이
            바로 launch 합니다. 어떤 인자가 key 에 들어가느냐가 곧 어떤 조건에서 새 variant 가
            생기느냐입니다.
          </p>
          <p>
            Key 의 첫 부분은 인자의 type signature 입니다. fp16 pointer 와 fp32 pointer 는 다른
            kernel 이 됩니다. 둘째는 <code>tl.constexpr</code> 인자의 값 자체입니다. BLOCK_SIZE 1024
            와 512 는 코드가 다르므로 당연히 다른 variant 이고, 이것이 compile-time constant 로서의
            specialization 입니다.
          </p>
          <p>
            셋째가 눈에 덜 띄는 부분입니다. 정수 인자는 값이 16 의 배수인지, 1 과 같은지로 나뉘고 pointer 인자는 16 byte 정렬 여부로 나뉩니다. N = 4096 과 N
            = 4100 은 둘 다 runtime 정수인데 전자만 16 의 배수이므로 서로 다른 variant 로 컴파일됩니다. 이것이 shape specialization 입니다.
          </p>
          <p>
            Compiler 가 이 성질을 원하는 이유는 vectorization 때문입니다. 정렬된 pointer 와 16 의 배수 길이를 알면 lane 여러 개를 128-bit load
            하나로 묶을 수 있고 stride 가 1 이면 곱셈을 없앨 수 있습니다. 성질을 모르는 채 컴파일하면 이 최적화를 포기해야 합니다.
          </p>
          <p>
            비용은 variant 수입니다. 매 호출 길이가 달라지는 workload 에서 16 의 배수 여부가 섞이면 같은 kernel 이 두 번 컴파일되고 autotune 과 곱해지면
            config 수 × 2 가 됩니다. 앞 절의 예에서 (M, N, K) 두 shape 이 하나는 16 의 배수이고 하나는 아니라면 12개 variant 가 전부 별개 코드입니다.
          </p>
          <p>
            둘 다 16 의 배수라면 autotune 의 key 는 두 번 갈리지만 JIT cache key 는 config 마다 하나뿐이라 컴파일은 6번입니다. 두 번째 shape 의
            탐색은 컴파일된 variant 를 다시 실행만 합니다. Autotune key 와 JIT cache key 가 다른 층이라는 점이 컴파일 시간을 셀 때의 핵심입니다.
          </p>
          <p>
            Variant 폭발을 막는 손잡이는 <code>do_not_specialize</code> 입니다. 여기에 넣은 인자는
            16 의 배수 여부를 key 에 넣지 않으므로 하나의 variant 로 모든 값을 받습니다. 대신 그
            인자에 걸린 vectorization 을 포기하므로 어느 쪽이 싼지는 호출 빈도와 길이 분포로
            정해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="JIT cache key 를 이루는 네 층"
          description="한 층이라도 다르면 새 variant 를 컴파일합니다. Autotune 은 이 key 바깥에서 config 를 고르는 별도 층입니다."
          items={[
            { term: "Type signature", description: "Pointer 의 element dtype 과 scalar 인자의 type 입니다.", example: "x_ptr 이 fp16 tensor 면 *fp16, fp32 면 *fp32 로 다른 key.", boundary: "같은 dtype 이면 tensor 의 값이나 크기는 여기에 들어가지 않습니다." },
            { term: "constexpr 값", description: "tl.constexpr 로 선언한 인자의 실제 값입니다. 코드 생성에 그대로 쓰입니다.", example: "BLOCK_SIZE=1024 와 512 는 arange 길이가 달라 다른 코드.", boundary: "constexpr 인자는 Python 값이어야 하며 tensor 를 넣을 수 없습니다." },
            { term: "인자 성질 (specialization)", description: "정수의 16 배수 여부·1 과 같은지, pointer 의 16 byte 정렬 여부입니다.", example: "N=4096 은 divisible_by_16, N=4100 은 아님 → 두 variant.", boundary: "do_not_specialize 에 넣으면 이 층에서 빠지고, 그 인자 기반 vectorization 도 사라집니다." },
            { term: "Launch option", description: "num_warps·num_stages·num_ctas 같은 meta-parameter 입니다.", example: "같은 BLOCK 이라도 num_warps 4 와 8 은 thread 배치가 달라 별개 코드.", boundary: "Autotune 의 config 가 바로 이 층과 constexpr 층을 함께 바꿉니다." },
          ]}
        />
      </section>

      <section id="compiler-pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Compiler 가 IR 을 단계별로 낮추며 schedule 을 대신 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Triton compiler 는 MLIR 위에 지어진 여러 단계의 lowering 입니다. Python AST 가 Triton IR(ttir)이 되고 GPU 배치 정보가 붙은
            TritonGPU IR(ttgir)을 거쳐 LLVM IR 로, 그리고 NVIDIA 라면 PTX 와 cubin 으로 내려갑니다. Block 을 warp 와 thread 에 나누는
            결정은 전부 ttgir 단계에서 일어납니다.
          </p>
          <p>
            MLIR 은 LLVM 프로젝트의 compiler 기반으로, dialect 라는 단위로 연산 집합을 정의하고
            한 dialect 를 더 낮은 dialect 로 점진적으로 바꾸는 pass 를 재사용하게 합니다.
          </p>
          <p>
            Triton 은 자기 연산(tl.load, tl.dot)을 담는 dialect 를 정의하고 MLIR 의 pass 기반 시설과 LLVM backend 를 빌려 씁니다. 2019년
            논문의 Triton-IR 은 LLVM 위에 직접 지어졌고 MLIR 이행은 그 이후입니다.
          </p>
          <p>
            Triton IR 은 hardware 를 모르는 block 연산의 dataflow 입니다. Inlining, 공통식 제거,
            broadcast 재배치, loop unroll 같은 일반 최적화만 합니다. 이 단계의 tensor 에는 아직
            어떤 thread 가 어떤 원소를 드는지에 대한 정보가 없습니다.
          </p>
          <p>
            TritonGPU IR 로 바뀔 때 각 tensor 에 layout 이 붙습니다. Layout 은 block 의 원소를
            num_warps 개 warp 와 그 안의 thread 에 어떻게 배분하는지를 적은 attribute 입니다.
          </p>
          <p>
            coalesce pass 가 연속 offset 의 load 에 맞춘 layout 을 고릅니다. accelerate-matmul 은 tl.dot 의 operand 를 tensor
            core 가 요구하는 layout 으로 바꾸고 그 사이의 불필요한 변환은 remove-layout-conversions 가 지웁니다.
          </p>
          <p>
            num_stages 는 pipeline pass 에서 쓰입니다. K 루프의 load 를 단계 수만큼 앞서 발행하고
            shared memory buffer 를 그만큼 잡아 두는 변환입니다. Hopper 이상에서는
            warp-specialize pass 가 load 를 맡는 warp 와 계산을 맡는 warp 를 나눕니다. 프로그래머가
            쓴 코드에는 이 구조가 한 줄도 없습니다.
          </p>
          <p>
            Halide 나 TVM 은 알고리즘과 schedule(tiling·vectorize·순서)을 분리해 프로그래머가 schedule 을 따로 적게 합니다. Triton 은 그
            schedule 을 언어에서 없앴습니다. Block 크기와 num_warps 만 받고 나머지 배치와 순서를 compiler 가 dataflow 분석으로 정하는 것이 Triton
            의 schedule abstraction 입니다. 대가는 그 결정을 손으로 뒤집을 자리가 거의 없다는 점입니다.
          </p>
          <p>
            Automatic vectorization 은 이 흐름의 결과물입니다. Layout 이 한 thread 에 연속 원소
            여러 개를 배정하고 pointer 정렬과 16 배수 specialization 이 보장되면, LLVM 으로 낮출
            때 그 원소들의 load 가 128-bit 명령 하나로 합쳐집니다. Warp 안의 thread 들이 연속
            주소를 받으므로 <Link to="/gpu/cuda-shared-memory#coalescing">coalescing</Link> 도 함께
            얻습니다.
          </p>
          <p>
            같은 kernel 에서 offset 이 stride 로 띄엄띄엄이면 layout 이 연속 배정을 만들 수 없어 vectorization 이 사라지고 성능이 몇 배 떨어져도
            코드는 그대로 컴파일됩니다. Triton 이 자동으로 해 준다는 말은 조건이 맞을 때 자동이라는 뜻입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="NVIDIA backend 의 단계별 pass 이름"
          preview="ttir 은 inliner·combine·cse·loop-unroll, ttgir 은 coalesce·accelerate-matmul·remove-layout-conversions·pipeline(num_stages)·warp-specialize(SM90+), llir 은 allocate-shared-memory·to-llvmir, 그 뒤 PTX 와 ptxas 입니다."
        >
          <p>
            Triton IR 단계(make_ttir)는 inliner, tensor descriptor 를 pointer 로 되돌리는 rewrite
            (SM90 미만), combine, reorder-broadcast, cse, symbol-dce, loop-unroll 을 돕니다.
            num_warps 와 num_stages 는 이 단계에 영향을 주지 않습니다.
          </p>
          <p>
            TritonGPU IR 단계(make_ttgir)는 convert-to-ttgpuir 로 layout 을 붙인 뒤 coalesce,
            f32-dot-tc, plan-cta, remove-layout-conversions, optimize-thread-locality,
            accelerate-matmul, optimize-dot-operands 를 지납니다.
          </p>
          <p>
            이어 assign-latencies, schedule-loops, pipeline 이 num_stages 를 받고, SM90 이상은
            warp-specialize 와 optimize-partition-warps 가 추가됩니다.
          </p>
          <p>
            LLVM 단계(make_llir)는 allocate-shared-memory 로 shared memory offset 을 확정하고
            to-llvmir 로 LLVM IR 을 만듭니다. make_ptx 가 LLVM 의 NVPTX backend 로 PTX 문자열을
            얻고, make_cubin 이 ptxas 로 SASS 를 담은 cubin 을 만듭니다.
          </p>
          <p>
            Pass 이름은 2026년 8월 기준 main branch 의
            <code>third_party/nvidia/backend/compiler.py</code> 에서 읽었습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="tradeoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          CUDA 와 Triton 의 차이는 속도가 아니라 누가 무엇을 소유하느냐입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 fused softmax 를 두 언어로 쓰면 Triton 쪽은 row 하나를 block 으로 읽어 max·exp·sum 을 tl 연산 몇 줄로 적고 끝납니다. CUDA
            쪽은 warp reduction, shared memory 의 partial sum, 경계 thread 처리를 직접 씁니다. 개발 비용의 차이는 이 코드 양이 아니라
            register 와 shared memory 배치를 누가 검증하느냐에서 옵니다.
          </p>
          <p>
            제어 범위는 반대 방향입니다. CUDA 에서는 warp specialization 으로 load warp 와 MMA warp
            를 손으로 나누고 <Link to="/gpu/gpu-arch-hopper#tma">TMA</Link> descriptor 와 mbarrier
            를 직접 발행할 수 있습니다.
          </p>
          <p>
            Triton 은 같은 구조를 compiler pass 가 만들어 주되, pass 가 그 패턴을 인식하는 kernel
            모양일 때만 만들어 줍니다. Pass 가 놓치면 프로그래머가 개입할 손잡이는
            num_warps·num_stages·block 크기 정도입니다.
          </p>
          <p>
            성능 재현 조건도 다릅니다. Triton 공식 tutorial 은 fused softmax 에서 naive PyTorch 대비 약 4배를 보고하지만 그 조건은 row 하나가
            SRAM 에 들어가는 크기이고 비교 대상이 fusion 없는 구현이라는 점을 함께 적습니다. Matmul 은 cuBLAS 와 비슷한 수준을 저자 자기보고로 제시하며, GPU
            세대와 dtype·shape 이 바뀌면 다시 재야 하는 수치입니다.
          </p>
          <p>
            컴파일 시간도 축 하나입니다. CUDA 는 빌드 시점에 한 번 컴파일되고 Triton 은 첫 호출 시점에 variant 마다 컴파일됩니다. Serving 처럼 shape 이
            다양한 환경에서는 앞 절의 variant 수가 warmup 시간과 cache 크기로 그대로 나타납니다.
          </p>
          <p>
            이 kernel 의 병목이 compiler pass 가 다루는 패턴 안에 있는가, hardware 기능 중 pass 가 아직 내지 못하는 것을 써야 하는가, 이 팀이 CUDA
            의 검증 비용을 감당할 수 있는가. 판정의 축은 이 셋입니다. 세 답이 모두 Triton 쪽이면 Triton 이 싸고 하나라도 CUDA 쪽이면 두 구현을 같은 shape 에서
            재 본 뒤 고릅니다.
          </p>
          <p>
            CUDA·CUTLASS·CuTe·Triton 네 층이 각각 무엇을 소유하는지의 지도는
            <Link to="/gpu/cuda-kernel-fusion#kernel-stack">kernel 선택 층</Link> 글이, 후보를 target
            matrix 에서 채택하는 절차는 그 글의 release gate 절이 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="같은 fused softmax 를 놓고 비교하는 세 축"
          description="어느 한 축의 우위를 다른 축으로 옮기지 않습니다. 세 축을 같은 workload 와 GPU 에서 함께 재야 비교가 성립합니다."
          items={[
            { term: "개발 비용", description: "누가 layout·synchronization·경계를 검증하는가입니다.", example: "Triton 은 mask 와 block 연산으로 끝나고 CUDA 는 warp reduction 과 shared memory partial sum 을 직접 씁니다.", boundary: "Triton 도 num_warps·BLOCK 과 variant 수는 검증해야 합니다." },
            { term: "제어 범위", description: "Warp specialization·TMA·mbarrier 같은 hardware 기능에 직접 닿을 수 있는가입니다.", example: "CUDA 는 descriptor 를 손으로 발행하고 Triton 은 pass 가 인식한 패턴에서만 만듭니다.", boundary: "Pass 가 지원하는 범위는 버전마다 넓어지므로 기준일을 적어야 합니다." },
            { term: "성능 재현 조건", description: "보고된 수치가 어느 GPU·dtype·shape·비교 대상에서 나온 것인가입니다.", example: "Softmax 4배는 row 가 SRAM 에 들어가고 비교 대상이 fusion 없는 구현일 때입니다.", boundary: "다른 세대 GPU 나 shape 으로 옮기면 다시 재야 합니다." },
          ]}
        />
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tillet 의 2019 논문이 tile 모델을, 공식 문서와 runtime 이 지금의 형태를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Block 단위 프로그래밍과 compiler 가 tiling·coalescing·shared memory 를 대신 정한다는
            설계는 Tillet, Kung, Cox 의 MAPL 2019 논문에 있습니다. 당시 언어는 C 계열의 Triton-C
            였고 IR 은 LLVM 위에 직접 지어졌습니다. Python DSL 과 MLIR 기반 pipeline 은 그 뒤의
            구현이며 논문의 주장 범위 밖입니다.
          </p>
          <p>
            이 글의 API 이름과 cache key 구성, pass 이름은 2026년 8월 기준 공식 문서와 main
            branch 의 <code>python/triton/runtime/jit.py</code>,
            <code>third_party/nvidia/backend/compiler.py</code> 에서 읽었습니다. Specialization
            규칙과 pass 목록은 버전에 따라 바뀌므로 배포 중인 버전에서 다시 확인해야 합니다.
          </p>
        </div>
        <div id="paper-triton-mapl" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Tillet, Kung, Cox · Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations (MAPL 2019)"
            citeKey={1}
            href="https://www.eecs.harvard.edu/~htk/publication/2019-mapl-tillet-kung-cox.pdf"
          >
            Tile 단위 연산을 first-class 로 두는 Triton-C 와 Triton-IR, 그리고 hierarchical
            tiling·memory coalescing·shared memory 할당·synchronization 을 자동으로 하는 Triton-JIT
            를 제안했습니다. cuBLAS·cuDNN 대비 성능은 당시 GPU 에서의 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <div id="doc-triton-programming-guide" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Triton documentation · Programming guide chapter 1·2, tutorials 01 vector-add·03 matmul, triton.jit·triton.autotune·triton.Config API"
            citeKey={2}
            href="https://triton-lang.org/main/programming-guide/chapter-1/introduction.html"
          >
            Blocked program 과 scalar thread 의 대비, compiler 가 자동으로 하는 최적화 목록,
            polyhedral·scheduling language 와의 위치, vector add 의 N = 98432 예와 matmul 의
            grouped ordering·autotune config, num_warps·num_stages 의 정의를 이 문서에서
            읽었습니다.
          </CitationBlock>
        </div>
        <div id="source-triton-jit-runtime" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="triton-lang/triton · python/triton/runtime/jit.py, third_party/nvidia/backend/compiler.py"
            citeKey={3}
            href="https://github.com/triton-lang/triton/blob/main/python/triton/runtime/jit.py"
            type="code"
          >
            Cache key 가 (specialization tuple, options) 로 구성되고 specialization 에 type·constexpr·
            16 배수 및 정렬 성질이 들어가는 것, do_not_specialize 의 동작, 그리고 ttir → ttgir →
            llir → ptx → cubin 단계와 pass 이름을 이 소스에서 확인했습니다.
          </CitationBlock>
        </div>
        <div id="doc-mlir" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="LLVM project · MLIR: Multi-Level Intermediate Representation"
            citeKey={4}
            href="https://mlir.llvm.org/"
          >
            Dialect 로 연산 집합을 정의하고 progressive lowering 과 재사용 pass 로 LLVM IR 까지
            내려가는 compiler 기반 시설입니다. Triton 의 dialect 와 pass 는 이 위에 있습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/cuda-kernel-fusion#kernel-stack">CUTLASS·CuTe·Triton 선택 층</Link>,
          그리고 <Link to="/gpu/cuda-matrix-multiply#tiled">CUDA tiled GEMM 의 손으로 짠 tile 재사용</Link>.
        </p>
      </section>
    </div>
  );
}
