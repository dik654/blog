import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CudaCompilationAndIsaAnalysisViz from "./cuda-compilation-and-isa-analysis/viz/CudaCompilationAndIsaAnalysisViz";

/**
 * CUDA 컴파일 경로: PTX 는 가상 ISA 이고 SASS 가 실제로 돕니다
 *
 * nvcc 가 소스를 PTX 와 SASS 로 내리는 두 단계, fatbin 과 compute capability 가
 * runtime 의 JIT·AOT 선택을 정하는 규칙, ptxas 의 register allocation·scheduling·
 * unrolling 과 고전 최적화가 PTX–SASS 차이를 만드는 이유, cuobjdump·nvdisasm 으로
 * 그 차이를 읽는 절차를 소유한다. Register pressure 의 occupancy·spill 비용은
 * /gpu/cuda-register-pressure, 측정 절차는 /gpu/cuda-perf-analysis 가 소유한다.
 */
export default function CudaCompilationAndIsaAnalysisArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          nvcc 는 소스를 PTX 로 한 번, SASS 로 한 번 더 컴파일합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <code>nvcc</code> 는 하나의 compiler 가 아니라 여러 도구를 순서대로 부르는 driver 입니다.
            <code>.cu</code> 파일은 host 코드와 device 코드로 갈라지고, device 코드는 먼저 가상
            ISA 인 PTX 로, 그다음 실제 GPU 가 실행하는 SASS 로 두 번 내려갑니다. 두 결과물은
            fatbinary 하나에 함께 담겨 host 실행 파일 안에 묻힙니다.
          </p>
          <p>
            첫 도구는 CUDA frontend 인 <code>cudafe++</code> 입니다. <code>__global__</code> 과
            <code>__device__</code> 가 붙은 함수를 device 쪽으로 떼어 내고, host 쪽에는 kernel 을
            launch 하는 stub 코드를 남깁니다. 이 stub 이 나중에 fatbinary 를 registry 에 등록하고
            <code>&lt;&lt;&lt;&gt;&gt;&gt;</code> 문법을 runtime API 호출로 바꿉니다.
          </p>
          <p>
            떼어 낸 device 코드는 <code>cicc</code> 가 받습니다. cicc 는 LLVM 기반의 NVVM
            compiler 로, C++ 의미를 해석하고 inlining 과 대부분의 machine-independent 최적화를 한 뒤
            PTX 텍스트를 냅니다. 여기까지가 특정 GPU 세대와 무관한 앞단이며, 결과는 사람이 읽을 수
            있는 assembly 처럼 생겼습니다.
          </p>
          <p>
            <code>ptxas</code> 는 그 PTX 를 받아 특정 GPU 의 기계어인 SASS 로 바꿉니다. Register 를
            실제 번호에 배정하고 instruction 순서를 정하는 일이 이 단계에서 일어나므로, 성능을
            좌우하는 결정 대부분은 PTX 가 아니라 ptxas 이후에 보입니다. 결과 파일이
            <code>cubin</code> 이고, <code>fatbinary</code> 도구가 PTX 와 cubin 을 한 컨테이너에 묶습니다.
          </p>
          <p>
            마지막으로 host compiler(gcc·clang·cl.exe) 가 stub 이 붙은 host 코드와 fatbinary 를
            함께 컴파일합니다. 그래서 nvcc 의 결과는 평범한 host object 이며, 그 안에 GPU 코드가
            데이터처럼 들어 있습니다. Runtime 은 kernel 이 처음 launch 될 때 그 fatbinary 를 열어
            현재 GPU 에 맞는 이미지를 고릅니다.
          </p>
          <p>
            이 구조를 알면 두 가지 질문이 저절로 생깁니다. PTX 와 SASS 는 어디까지 같고 어디서
            달라지는지, 그리고 fatbinary 안에 무엇을 넣어야 다른 세대의 GPU 에서도 도는지입니다.
            Host 쪽 실행 경로는 <Link to="/gpu/cuda-basics#execution-path">CUDA 실행 기초</Link> 가 다룹니다.
          </p>
        </div>
        <AlgorithmBlock
          title="nvcc 가 .cu 하나를 처리하는 단계"
          input={["kernel.cu (host 코드 + __global__ kernel)", "-gencode arch=compute_XX,code=sm_XX 또는 -arch=sm_XX", "host compiler 경로와 -O 수준"]}
          steps={[
            { code: "cudafe++ kernel.cu → kernel.cudafe1.cpp (host) + kernel.cudafe1.gpu (device)", note: "CUDA frontend 가 host 와 device 코드를 가르고 host 쪽에 launch stub 을 심습니다." },
            { code: "cicc kernel.cudafe1.gpu -arch compute_XX → kernel.ptx", note: "NVVM 이 C++ 을 해석하고 inlining·CSE·DCE 같은 machine-independent 최적화를 한 뒤 PTX 를 냅니다." },
            { code: "ptxas -arch sm_XX kernel.ptx → kernel.cubin", note: "가상 register 를 실제 register 에 배정하고 instruction 을 고르고 순서를 정해 SASS 를 만듭니다." },
            { code: "fatbinary --create kernel.fatbin --image=profile=sm_XX,file=kernel.cubin --image=profile=compute_XX,file=kernel.ptx", note: "-gencode 마다 하나씩 cubin 과 PTX 를 한 컨테이너에 담습니다." },
            { code: "host compiler kernel.cudafe1.cpp + kernel.fatbin.c → kernel.o", note: "Fatbinary 는 host object 안에 byte 배열로 들어가고 stub 이 이를 runtime 에 등록합니다." },
          ]}
          output="host object 하나. 안에 sm_XX SASS 와 compute_XX PTX 가 fatbinary 로 들어 있습니다."
        />
        <ContentBoundary article="cuda-compilation-and-isa-analysis" />
      </section>

      <section id="ptx-and-sass" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          PTX 는 register 수에 제한이 없는 가상 ISA 이고 SASS 는 세대마다 다른 기계어입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            PTX(Parallel Thread Execution) 는 NVIDIA 가 문서로 공개하고 세대를 넘어 유지하는 가상
            instruction set 입니다. 실제 GPU 는 PTX 를 직접 실행하지 않습니다. PTX 를 읽는 것은
            항상 ptxas 이거나 driver 안의 JIT compiler 이며, 그들이 낸 SASS 만 SM 위에서 돕니다.
          </p>
          <p>
            PTX instruction 은 <code>@p opcode.type d, a, b, c;</code> 꼴입니다. 앞의
            <code>@p</code> 는 predicate register 가 참일 때만 실행하라는 guard 이고,
            <code>.type</code> 은 <code>.f32</code> 나 <code>.s32</code> 처럼 피연산자의 형을 적습니다.
            <code>fma.rn.f32 %f4, %f3, %f1, %f2</code> 는 round-to-nearest 로 f3·f1+f2 를 계산해 f4 에 넣습니다.
          </p>
          <p>
            PTX register 는 <code>%r</code>·<code>%f</code>·<code>%rd</code>·<code>%p</code> 처럼
            형별로 이름이 붙은 가상 register 입니다. PTX ISA 문서는 register 수가 사실상 무제한이며
            allocation 은 backend 인 ptxas 가 한다고 적습니다. 그래서 PTX 의 <code>%f&lt;5&gt;</code>
            같은 선언은 "값 5개를 구분했다"는 뜻이지 실제 register 5개를 쓴다는 뜻이 아닙니다.
          </p>
          <p>
            <code>a[i] = b[i] * c + d</code> 를 계산하는 kernel 을 nvcc 로 내리면 PTX 는 대략 아래와
            같은 모양이 됩니다. 이 형태는 PTX ISA 문서의 syntax 예제와 nvcc 가 이런 kernel 에 내는
            전형적 출력에서 옮긴 것이며, 실제 이름과 줄 수는 CUDA 버전에 따라 조금씩 다릅니다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto border border-border bg-muted/40 p-4 font-mono text-[12px] leading-5">
{`.visible .entry saxpy(.param .u64 a, .param .u64 b, .param .f32 c, .param .f32 d, .param .u32 n)
{
  .reg .pred %p<2>;   .reg .f32 %f<5>;   .reg .b32 %r<6>;   .reg .b64 %rd<8>;
  ld.param.u64  %rd1, [a];          ld.param.u64  %rd2, [b];
  ld.param.f32  %f1,  [c];          ld.param.f32  %f2,  [d];
  ld.param.u32  %r2,  [n];
  mov.u32       %r3, %ctaid.x;      mov.u32 %r4, %ntid.x;     mov.u32 %r5, %tid.x;
  mad.lo.s32    %r1, %r3, %r4, %r5;             // i = blockIdx.x*blockDim.x + threadIdx.x
  setp.ge.s32   %p1, %r1, %r2;
  @%p1 bra      $L__BB0_2;                       // if (i >= n) return
  cvta.to.global.u64 %rd3, %rd2;
  mul.wide.s32  %rd4, %r1, 4;       add.s64 %rd5, %rd3, %rd4;
  ld.global.f32 %f3, [%rd5];                     // b[i]
  fma.rn.f32    %f4, %f3, %f1, %f2;              // b[i]*c + d
  cvta.to.global.u64 %rd6, %rd1;    add.s64 %rd7, %rd6, %rd4;
  st.global.f32 [%rd7], %f4;                     // a[i] = ...
$L__BB0_2:
  ret;
}`}
        </pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 kernel 을 <code>cuobjdump -sass</code> 로 열면 SASS 가 나옵니다. 아래 줄은 CUDA
            Binary Utilities 문서가 cuobjdump 출력 예로 보여 주는 형태에서 가져온 것으로, 세대에
            따라 opcode 와 operand 표기가 바뀝니다. 곱셈과 덧셈이 붙은 부분은 <code>FFMA</code>
            하나가 되고 index 계산은 <code>IMAD</code> 로 접힙니다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto border border-border bg-muted/40 p-4 font-mono text-[12px] leading-5">
{`/*0000*/  LDC  R1, c[0x0][0x37c] ;              // stack pointer 초기화
/*0010*/  S2R  R9, SR_TID.X ;                   // threadIdx.x
/*0020*/  S2UR UR6, SR_CTAID.X ;                // blockIdx.x (uniform register)
/*0040*/  LDC  R0, c[0x0][0x360] ;              // blockDim.x
/*0050*/  LDC.64 R2, c[0x0][0x380] ;            // param b
/*0060*/  LDC.64 R4, c[0x0][0x388] ;            // param a
/*0070*/  IMAD R9, R0, UR6, R9 ;                // i = blockDim.x*blockIdx.x + threadIdx.x
/*0080*/  ISETP.GE.AND P0, PT, R9, c[0x0][0x390], PT ;
/*0090*/  @P0 EXIT ;                            // predicated exit — branch 가 아님
/*00a0*/  IMAD.WIDE R2, R9, 0x4, R2 ;           // &b[i]
/*00b0*/  LDG.E R2, desc[UR4][R2.64] ;          // b[i]
/*00c0*/  IMAD.WIDE R4, R9, 0x4, R4 ;           // &a[i]
/*00e0*/  FFMA R9, R2, c[0x0][0x394], c[0x0][0x398] ; // b[i]*c + d, c·d 는 constant bank 에서
/*00f0*/  STG.E desc[UR4][R4.64], R9 ;          // a[i] = ...
/*0100*/  EXIT ;
/*0110*/  BRA 0x110;`}
        </pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 목록을 나란히 놓으면 차이가 보입니다. PTX 의 <code>%r</code>·<code>%rd</code>·<code>%f</code>
            열아홉 개는 SASS 에서 <code>R0</code> 부터 <code>R9</code> 까지 열 개 남짓으로 줄고, 64-bit
            주소는 <code>R2.64</code> 처럼 인접한 32-bit register 쌍이 됩니다. Kernel parameter 는
            <code>ld.param</code> 대신 constant bank <code>c[0x0][...]</code> 에서 직접 읽습니다.
          </p>
          <p>
            <code>@%p1 bra</code> 는 SASS 에서 <code>@P0 EXIT</code> 로 바뀌어 분기 자체가 사라졌습니다.
            Instruction 수는 PTX 본문 18줄에서 SASS 16줄로 크게 줄지 않았지만, 무엇을 몇 번 읽는지와
            어느 register 가 언제 살아 있는지는 전혀 다른 답이 됐습니다. 이 차이를 만드는 것이 다음
            두 절의 ptxas 입니다.
          </p>
        </div>
        <CudaCompilationAndIsaAnalysisViz />
      </section>

      <section id="fatbin-and-jit" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Fatbin 에 맞는 SASS 가 없으면 driver 가 PTX 를 그 자리에서 JIT 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Runtime 은 kernel 을 처음 launch 할 때 fatbinary 를 뒤져 현재 GPU 의 compute capability
            와 맞는 cubin 을 찾습니다. 있으면 그대로 올리고(AOT 경로), 없으면 담겨 있는 PTX 중
            실행 가능한 가장 높은 것을 driver 가 그 자리에서 SASS 로 컴파일합니다(JIT 경로).
            둘 다 없으면 launch 는 <code>cudaErrorNoKernelImageForDevice</code> 로 실패합니다.
          </p>
          <p>
            Compute capability 는 GPU 세대를 <code>major.minor</code> 로 적은 번호입니다. Major 가
            core architecture 를, minor 가 그 안의 개선을 뜻합니다. A100 은 8.0, A10·RTX 30 은 8.6,
            L40·RTX 40 은 8.9, H100 은 9.0, B200 은 10.0 입니다.
          </p>
          <p>
            nvcc 의 <code>sm_80</code> 은 real architecture 8.0 을 가리키고, <code>compute_80</code> 은
            그 세대의 feature 집합만 뜻하는 virtual architecture 를 가리킵니다. 앞의 것으로는
            cubin 을, 뒤의 것으로는 PTX 를 만듭니다.
          </p>
          <p>
            호환 규칙은 두 줄입니다. cubin 은 같은 major 안에서 minor 가 같거나 큰 GPU 에서만
            돕니다. 즉 sm_80 cubin 은 8.6·8.9 에서 돌지만 9.0 에서는 돌지 않습니다. PTX 는 자신의
            compute_XX 이상 어떤 GPU 에서든 JIT 될 수 있습니다. compute_80 PTX 는 9.0 에서도 JIT
            되지만 그 세대에만 있는 instruction 은 쓰지 못합니다.
          </p>
          <p>
            <code>-gencode arch=compute_80,code=sm_80 -gencode arch=compute_90,code=compute_90</code>
            으로 빌드한 파일을 H100 에서 돌린다고 합시다. Fatbin 에 sm_90 cubin 은 없고 sm_80
            cubin 은 major 가 달라 탈락합니다.
          </p>
          <p>
            남은 것은 compute_90 PTX 입니다. Driver 가 이를 JIT 해 sm_90 SASS 를 만들고, 그 결과를
            <code>~/.nv/ComputeCache</code> 에 넣어 두 번째 실행부터 다시 쓰게 합니다.
          </p>
          <p>
            같은 파일을 A100 에서 돌리면 sm_80 cubin 이 바로 맞아 JIT 없이 올라갑니다. RTX 4090
            (8.9) 이라면 sm_80 cubin 이 같은 major 라 그대로 돕니다. 흔히 쓰는 <code>-arch=sm_80</code>
            은 <code>arch=compute_80,code=sm_80,compute_80</code> 의 축약이라, H100 에서는 compute_80
            PTX 를 JIT 하는 경로로 빠지고 Hopper 전용 기능은 하나도 쓰지 않습니다.
          </p>
          <p>
            JIT 의 비용은 첫 launch 의 지연과, ptxas 버전이 driver 의 것으로 바뀐다는 점입니다.
            빌드 때 쓴 ptxas 와 다른 register allocation 이 나올 수 있어 성능이 조용히 달라집니다.
            그래서 배포 대상 GPU 세대가 정해져 있으면 그 sm_XX cubin 을 넣고, 미래 GPU 를 위해
            가장 높은 compute_XX PTX 하나를 덧붙이는 것이 표준 조합입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Runtime 이 fatbinary 에서 kernel 이미지를 고르는 절차"
          input={["현재 GPU 의 compute capability (major.minor)", "fatbinary 안의 cubin 목록 (각각 sm_XY)", "fatbinary 안의 PTX 목록 (각각 compute_XY)", "driver 의 JIT cache (CUDA_CACHE_PATH)"]}
          steps={[
            { code: "cc = device.major, device.minor", note: "GPU 마다 하나의 번호입니다. H100 은 9.0, A100 은 8.0 입니다." },
            { code: "for cubin in cubins:  if cubin.major == cc.major and cubin.minor <= cc.minor: load(cubin); return", note: "같은 major 안에서 minor 가 같거나 낮은 cubin 만 후보이며, 후보 중 가장 높은 것을 고릅니다. 이것이 AOT 경로입니다." },
            { code: "ptx = max(p for p in ptxs if p.cc <= cc)", note: "PTX 는 자신의 compute_XX 이상이면 어느 GPU 에서든 후보입니다. 가장 높은 것을 고릅니다." },
            { code: "if ptx is None: raise cudaErrorNoKernelImageForDevice", note: "cubin 도 PTX 도 없으면 launch 가 실패합니다. 이 오류가 새 GPU 에서 오래된 binary 를 돌릴 때 나옵니다." },
            { code: "sass = cache.get(hash(ptx, cc, driver)) or driver.ptxas(ptx, sm=cc)", note: "Driver 안의 ptxas 가 그 자리에서 SASS 를 만들고 cache 에 넣습니다. 첫 launch 가 이만큼 늦습니다." },
            { code: "load(sass)", note: "이후 launch 는 cache 된 SASS 를 그대로 씁니다. Driver 를 바꾸면 cache 는 다시 만들어집니다." },
          ]}
          output="현재 GPU 에 올라간 SASS 이미지. AOT 였는지 JIT 였는지는 cuobjdump 로 fatbin 의 내용을 열어 보면 미리 알 수 있습니다."
        />
        <TermBreakdown
          title="Compute capability 8.0 과 9.0 이 갈리는 지점"
          description="같은 소스라도 두 세대에서 SASS 가 달라지는 이유는 SM 자원과 사용할 수 있는 instruction 이 다르기 때문입니다. 수치는 CUDA C++ Programming Guide 의 technical specification 표에서 가져왔습니다."
          items={[
            { term: "SM 당 register file", description: "두 세대 모두 32-bit register 64K 개, thread 당 최대 255개입니다. 이 한도가 같아 register allocation 의 상한은 같지만 scheduling 은 다릅니다.", example: "128 register/thread 이면 두 세대 모두 SM 당 512 thread 가 상한입니다.", boundary: "한도가 같아도 ptxas 가 세대별로 다른 latency 표를 쓰므로 실제 배정 수는 달라질 수 있습니다." },
            { term: "Shared memory", description: "8.0 은 SM 당 최대 164 KB(block 당 opt-in 163 KB), 9.0 은 228 KB(block 당 227 KB) 입니다.", example: "196 KB tile 을 쓰는 kernel 은 sm_90 에서만 launch 됩니다.", boundary: "기본 48 KB 를 넘기려면 cudaFuncSetAttribute 로 opt-in 해야 하며 이는 두 세대 모두 같습니다." },
            { term: "9.0 전용 instruction", description: "Thread block cluster, distributed shared memory, TMA(cp.async.bulk.tensor), warpgroup MMA(wgmma) 는 compute_90 PTX 에만 있습니다.", example: "compute_80 PTX 를 H100 에서 JIT 하면 이 instruction 은 한 줄도 나오지 않습니다.", boundary: "sm_90a 처럼 a 가 붙은 target 은 그 세대에만 묶이는 feature 를 담으며 다음 세대로 forward compatible 하지 않습니다." },
            { term: "PTX ISA version", description: "sm_80 은 PTX ISA 7.0(CUDA 11.0) 에서, sm_90 은 7.8(CUDA 11.8) 에서 들어왔습니다. PTX 파일 첫 줄의 .version 이 이를 적습니다.", example: ".version 7.0 인 PTX 는 CUDA 11.0 driver 부터 JIT 할 수 있습니다.", boundary: "PTX version 이 driver 가 아는 것보다 높으면 JIT 이 실패하므로 forward compatibility 는 driver 버전에도 묶입니다." },
          ]}
        />
      </section>

      <section id="ptxas-optimizations" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          ptxas 의 allocation 과 scheduling 이 unrolling 의 대가를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            ptxas 는 두 가지 결정을 합니다. 어떤 값을 어느 register 에 언제까지 둘지(register
            allocation) 와 instruction 을 어떤 순서로 낼지(instruction scheduling) 입니다. 이 둘은
            서로를 밀어냅니다. Load 를 앞당겨 latency 를 숨기면 그 값이 더 오래 살아 있어 register
            가 늘고, register 를 아끼려 하면 load 를 미뤄야 해서 stall 이 늘어납니다.
          </p>
          <p>
            Register allocation 의 입력은 각 값의 live range 입니다. 값이 정의된 instruction 부터
            마지막으로 읽히는 instruction 까지가 그 값의 생존 구간이고, 어느 시점에 겹쳐 살아 있는
            값의 수가 그 시점의 register 요구량입니다.
          </p>
          <p>
            ptxas 는 그 최댓값을 물리 register 에 담되, <code>-maxrregcount</code> 나
            <code>__launch_bounds__</code> 가 준 상한을 넘으면 일부를 local memory 로 spill 합니다.
            Live range 와 spill 의 비용은
            <Link to="/gpu/cuda-register-pressure#live-range">register pressure 글</Link> 이 다룹니다.
          </p>
          <p>
            Instruction scheduling 은 dependency 를 지키는 범위 안에서 순서를 바꿉니다. GPU 는
            in-order issue 라 한 warp 안에서는 앞 instruction 의 결과를 기다리는 동안 다음
            instruction 을 내지 못합니다. 그래서 ptxas 는 global load 를 최대한 앞으로 끌어올리고
            그 결과를 쓰는 FFMA 를 뒤로 미뤄, 같은 warp 안에서도 여러 load 가 동시에 날아가게 합니다.
          </p>
          <p>
            Loop unrolling 은 이 두 결정을 한꺼번에 흔드는 최적화입니다. Loop 본문을 U 번 복사해
            counter 증가·비교·branch 를 U 번에 한 번만 하게 만들면 instruction 수가 줄고, U 개의
            load 를 한 덩어리로 앞당길 수 있어 scheduling 여지가 커집니다. 대신 그 U 개의 값이
            동시에 살아 있으니 register 가 늘어납니다.
          </p>
          <p>
            <code>a[i] = b[i]*c + d</code> 를 thread 하나가 여러 i 에 대해 stride loop 으로 돌린다고
            합시다. 본문은 주소 계산과 load, FFMA, store 의 4개이고 loop 제어는 counter 증가와
            비교, branch 의 3개라 element 하나에 7 instruction 이 듭니다.
          </p>
          <p>
            <code>#pragma unroll 4</code> 를 붙이면 본문 16개에 제어 3개로 element 하나에 4.75
            instruction 이 되어 32% 줄어듭니다.
          </p>
          <p>
            같은 순간 register 는 늘어납니다. Unroll 전에는 load 한 값 하나와 주소 하나가 살아
            있었지만, unroll 4 에서 ptxas 가 네 load 를 앞으로 모으면 값 4개와 주소 4개가 같이
            살아 있어 thread 당 6개 안팎이 더 필요합니다. 이 산수는 ptxas 의 실제 배정이 아니라
            상한의 크기 관계를 보이는 것이며, 정확한 수는 <code>-Xptxas -v</code> 가 알려 줍니다.
          </p>
          <p>
            그래서 unrolling 의 손익은 register 가 occupancy 를 깎기 시작하는 지점에서 갈립니다.
            Register 가 32개에서 40개로 늘어도 SM 당 warp 수가 그대로면 이득만 남고, 64개를 넘겨
            resident warp 가 반으로 줄면 latency 를 숨길 warp 가 없어져 loop 제어를 아낀 것보다
            더 잃습니다.
          </p>
          <p>
            nvcc 는 trip count 가 상수인 작은 loop 를 기본으로 unroll 합니다.
            <code>#pragma unroll 1</code> 이 이를 막고, <code>#pragma unroll N</code> 이 배수를 지정합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Loop 를 U 배 unroll 하면 instruction 수와 register 수가 어떻게 바뀌나요?"
          idea="본문 instruction 은 element 마다 그대로 필요하고 loop 제어만 U 번에 한 번으로 줄어듭니다. 대신 ptxas 가 U 개의 load 를 함께 앞당기면 U 개의 값이 동시에 살아 있어 register 가 그만큼 늘어납니다."
          formula={String.raw`\begin{aligned}
I(U) &= \left\lceil \tfrac{n}{U} \right\rceil \,(U\,b + o) \;\approx\; n\left(b + \tfrac{o}{U}\right) \\
R(U) &\approx R_0 + (U-1)\,\ell
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
I(U) &= \underbrace{\left\lceil \tfrac{n}{U} \right\rceil}_{\text{loop 반복 횟수}} \,\Big(\underbrace{U\,b}_{\text{본문 U 벌}} + \underbrace{o}_{\text{loop 제어}}\Big) \;\approx\; n\Big(b + \underbrace{\tfrac{o}{U}}_{\text{element 당 제어 비용}}\Big) \\
R(U) &\approx \underbrace{R_0}_{\text{unroll 전 register}} + \underbrace{(U-1)\,\ell}_{\text{함께 살아 있는 값이 늘어난 몫}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\left\lceil \tfrac{n}{U} \right\rceil`, annotation: ["n 개 element 를 U 개씩 묶은 반복 횟수", "n 이 U 의 배수가 아니면 남은 element 를 처리할 꼬리 loop 가 따로 붙습니다"] },
            { expression: String.raw`U\,b + o`, annotation: ["한 반복에 본문 b 를 U 번, loop 제어 o 를 한 번 내는 instruction 수", "b=4, o=3, U=4 이면 19, element 당 4.75"] },
            { expression: String.raw`\tfrac{o}{U}`, annotation: ["Element 당 loop 제어 비용이 U 로 나뉘어 줄어드는 몫", "U 를 키울수록 이득이 작아지는 이유"] },
            { expression: String.raw`(U-1)\,\ell`, annotation: ["Unroll 로 동시에 살아 있게 된 값 하나당 register ℓ 개가 U−1 벌 더 필요", "ℓ 은 값과 주소를 합친 수이며 scheduler 가 load 를 얼마나 앞당기느냐에 따라 달라집니다"] },
          ]}
          terms={[
            { symbol: String.raw`b`, name: "본문 instruction 수", description: "Element 하나를 처리하는 데 필요한 instruction 수입니다. 예의 kernel 에서는 주소 계산·load·FFMA·store 의 4개입니다." },
            { symbol: String.raw`o`, name: "Loop 제어 instruction 수", description: "Counter 증가·비교·branch 처럼 element 와 무관하게 반복마다 드는 instruction 수입니다. 예에서는 3개입니다." },
            { symbol: String.raw`\ell`, name: "Element 당 동시 생존 값", description: "Load 를 앞당겼을 때 element 하나가 붙들고 있는 register 수입니다. 값 1개와 64-bit 주소 1개(register 2개)면 ℓ=3 입니다." },
            { symbol: String.raw`R_0`, name: "Unroll 전 register 수", description: "-Xptxas -v 가 보고하는 원래 kernel 의 thread 당 register 수입니다." },
          ]}
          assumptions={["ptxas 가 U 개의 load 를 실제로 한 덩어리로 앞당긴다고 가정합니다. Register 상한에 걸리면 scheduler 가 load 를 미뤄 R 은 덜 늘고 latency 이득도 줄어듭니다.", "본문 b 안에서 CSE 나 strength reduction 으로 instruction 이 더 줄어드는 효과는 별도로 봅니다.", "정확한 수는 -Xptxas -v 와 cuobjdump -sass 로 읽어야 하며 이 식은 크기 관계만 보입니다."]}
          interpretation="U 를 키울수록 instruction 은 b 에 수렴하며 이득이 줄고, register 는 U 에 비례해 계속 늘어납니다. 손익 분기는 R(U) 가 SM 당 resident warp 수를 한 단계 깎는 register 경계에 닿는 U 이며, 그 경계는 compute capability 와 block 크기에 따라 다릅니다."
        />
      </section>

      <section id="classic-optimizations" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          고전 최적화는 cicc 와 ptxas 두 곳에 나뉘어 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            CPU compiler 에서 익숙한 고전 최적화가 CUDA 경로에도 두 곳에 나뉘어 들어 있습니다.
            값의 의미만 보고 할 수 있는 것은 cicc 가 PTX 를 내기 전에 하고, 어떤 기계 instruction
            을 쓸지 골라야 하는 것은 ptxas 가 SASS 를 만들며 합니다. 어느 단계의 출력을 열어야
            원하는 최적화가 일어났는지 볼 수 있는지가 이 구분에서 정해집니다.
          </p>
          <p>
            Common subexpression elimination(CSE) 은 같은 식을 두 번 계산하지 않고 첫 결과를
            재사용합니다. <code>b[i]*c + d</code> 와 <code>b[i]*c - d</code> 를 같은 kernel 에서
            계산하면 <code>b[i]*c</code> 는 한 번만 곱해집니다.
          </p>
          <p>
            Dead code elimination(DCE) 은 결과가 어디에도 쓰이지 않는 계산을 지웁니다. 결과를
            global memory 에 쓰지 않는 microbenchmark kernel 이 0 ms 로 측정되는 이유가 이것입니다.
          </p>
          <p>
            Constant folding 은 상수끼리의 계산을 컴파일 시점에 끝냅니다. <code>x * 2.0f * 0.5f</code>
            는 <code>x</code> 가 되고, <code>blockDim.x</code> 처럼 launch 때 정해지는 값은 상수가
            아니라 접히지 않습니다. 이 셋은 PTX 에서 이미 사라진 뒤라, <code>cuobjdump -ptx</code>
            로 열었을 때 중복 <code>mul</code> 이 없으면 CSE 가 됐다는 뜻입니다.
          </p>
          <p>
            Strength reduction 은 비싼 연산을 같은 결과의 싼 연산으로 바꿉니다. <code>i * 4</code>
            는 <code>i &lt;&lt; 2</code> 로, 상수로 나누는 정수 나눗셈은 곱셈과 shift 로 바뀝니다.
            GPU 에서는 정수 나눗셈이 수십 instruction 짜리 subroutine 이라 이 변환의 효과가 CPU 보다
            큽니다. Index 계산에서 <code>% blockDim.x</code> 를 쓰면 접히지 않아 그 subroutine 이
            SASS 에 그대로 남습니다.
          </p>
          <p>
            Instruction selection 은 PTX 한 줄을 어떤 SASS instruction 으로 낼지 고르는 단계입니다.
            앞 절의 예에서 <code>mad.lo.s32</code> 와 <code>mul.wide.s32</code> 는 모두 <code>IMAD</code>
            계열이 됐고, <code>mul.f32</code> 와 <code>add.f32</code> 가 떨어져 있어도 ptxas 는
            <code>FFMA</code> 하나로 합칩니다. <code>-fmad=false</code> 는 이 합침을 막는 옵션이며
            결과 bit 가 달라지므로 CPU 와 parity 를 비교할 때 먼저 확인해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="고전 최적화가 CUDA 경로의 어느 단계에서 일어나는가"
          description="같은 이름의 최적화라도 어느 도구가 하느냐에 따라 확인할 파일이 다릅니다. 왼쪽 셋은 PTX 에서, 오른쪽 둘은 SASS 에서 확인합니다."
          items={[
            { term: "CSE", description: "같은 식의 중복 계산을 한 번으로 줄입니다. cicc 가 PTX 를 내기 전에 합니다.", example: "b[i]*c 를 두 식이 공유하면 PTX 에 mul 이 한 줄만 남습니다.", boundary: "volatile 읽기나 memory fence 사이의 load 는 같은 주소라도 합치지 않습니다." },
            { term: "DCE", description: "결과가 쓰이지 않는 계산과 도달할 수 없는 코드를 지웁니다. cicc 단계입니다.", example: "Store 가 없는 benchmark kernel 은 본문이 통째로 사라져 ret 만 남습니다.", boundary: "asm volatile 과 global store 는 부작용으로 취급되어 지워지지 않습니다." },
            { term: "Constant folding", description: "상수끼리의 연산을 컴파일 시점에 계산합니다. cicc 단계이며 template 인자와 constexpr 이 접힙니다.", example: "sizeof(float)*4 는 16 으로, 2.0f*0.5f 는 1 로 접혀 mul 이 사라집니다.", boundary: "blockDim·gridDim 은 launch 때 정해지므로 접히지 않고 constant bank 읽기가 남습니다." },
            { term: "Strength reduction", description: "곱셈을 shift 로, 상수 나눗셈을 곱셈·shift 로 바꿉니다. cicc 와 ptxas 양쪽에서 일어납니다.", example: "i*4 는 shl 로, i/16 은 shr 4 로 바뀌지만 i/blockDim.x 는 나눗셈 subroutine 으로 남습니다.", boundary: "부호 있는 나눗셈은 반올림 방향 보정이 붙어 shift 하나로 끝나지 않습니다." },
            { term: "Instruction selection", description: "PTX 연산을 target 세대의 SASS instruction 으로 고릅니다. ptxas 가 세대별 table 로 합니다.", example: "mul.f32 + add.f32 → FFMA 하나, mad.lo.s32 → IMAD, ld.global → LDG.E.", boundary: "-fmad=false 면 FMUL·FADD 로 분리되고 결과 bit 가 달라집니다." },
          ]}
        />
        <ProgressiveDetail
          title="왜 PTX 에서 안 보이던 최적화가 SASS 에서 나타나거나 사라지나요?"
          preview="cicc 가 PTX 를 낼 때 -O3 를 적용하고 ptxas 가 SASS 를 낼 때 다시 -O3 를 적용합니다. 두 단계가 각각 최적화하므로 PTX 는 최종 결과가 아니라 중간 결과입니다."
        >
          <p>
            nvcc 는 device 코드에 기본으로 <code>-O3</code> 를 씁니다. cicc 는 LLVM pass 로 앞 절의
            의미 최적화와 inlining, loop unrolling 을 하고, ptxas 는 자체 pass 로 scheduling 과
            register allocation, instruction selection 을 합니다.
          </p>
          <p>
            ptxas 도 dead code 를 지우고 constant 를 접으므로 PTX 에 남아 있던 계산이 SASS 에서
            사라지는 일이 흔합니다.
          </p>
          <p>
            <code>-G</code> 로 debug build 를 하면 두 단계 모두 최적화를 끄고 <code>-lineinfo</code> 는
            최적화를 유지한 채 source line 만 붙입니다. 성능을 읽을 때는 <code>-lineinfo</code> 로 빌드해
            nvdisasm 과 Nsight Compute 가 SASS 줄을 소스 줄에 대응시키게 하는 것이 맞고, <code>-G</code> 의
            SASS 는 배포 binary 와 다른 코드라 그 수치를 옮기면 안 됩니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="isa-analysis" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          PTX 로는 성능을 읽을 수 없고 cuobjdump·nvdisasm 으로 SASS 를 열어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            PTX–SASS gap 은 PTX 에서 세었던 것이 SASS 에서 다른 수가 되는 현상입니다. Register 수,
            instruction 수, load 의 개수와 순서, 분기의 유무가 모두 ptxas 를 거치며 바뀌므로, PTX
            를 보고 "register 20개를 쓴다"거나 "load 가 두 번이다"라고 말하면 틀립니다. 성능을
            판단하는 유일한 근거는 실제 GPU 에 올라가는 SASS 입니다.
          </p>
          <p>
            <code>cuobjdump</code> 는 host 실행 파일과 cubin 양쪽에서 내용을 꺼내는 도구입니다.
            <code>-sass</code> 는 SASS 를, <code>-ptx</code> 는 PTX 를, <code>-lelf</code> 는
            fatbin 에 어떤 sm_XX cubin 이 들었는지, <code>-res-usage</code> 는 kernel 별 register·
            shared memory·spill 을 보여 줍니다. 배포 binary 가 H100 에서 JIT 를 타는지 확인하려면
            <code>cuobjdump -lelf -lptx a.out</code> 한 번이면 됩니다.
          </p>
          <p>
            <code>nvdisasm</code> 은 cubin 만 받지만 더 많이 보여 줍니다. <code>-cfg</code> 는
            control flow graph 를 Graphviz 형식으로 내고, <code>-plr</code> 은 각 SASS 줄 옆에 어느
            register 가 그 시점에 살아 있는지를 열로 붙이며, <code>-g</code> 는 <code>-lineinfo</code>
            로 빌드한 cubin 에서 SASS 줄을 소스 줄에 대응시킵니다. Register 가 왜 많은지 볼 때는
            <code>-plr</code> 열에서 동시에 살아 있는 register 가 가장 많은 줄을 찾으면 됩니다.
          </p>
          <p>
            ISA-level analysis 는 이 도구로 세 질문에 답하는 절차입니다. 원하는 instruction 이
            나왔는가, register 가 어디서 가장 많이 겹치는가, 그리고 load 와 그 소비자 사이에 몇
            instruction 이 있어 latency 를 얼마나 숨기는가입니다.
          </p>
          <p>
            첫 질문은 FFMA 로 합쳐졌는지, LDG.128 로 vectorize 됐는지, 나눗셈 subroutine 이
            남았는지를 봅니다. 세 답이 바뀌지 않은 최적화는 소스를 바꿔도 binary 가 같은 것이므로
            측정 차이를 noise 로 봐야 합니다.
          </p>
          <p>
            한계도 분명합니다. SASS instruction 의 의미는 문서에 이름과 한 줄 설명만 있고 latency
            와 issue 규칙은 공개되지 않습니다. 그래서 SASS 를 읽어 얻는 것은 "무엇이 나왔는가"이지
            "몇 cycle 인가"가 아니며, 시간은 반드시 <Link to="/gpu/cuda-perf-analysis#profiling">profiler 와 timing 절차</Link> 로 재야 합니다.
            분석 대상 cubin 이 실제 GPU 에 올라가는 것과 같은 sm_XX 인지도 매번 확인해야 합니다.
          </p>
        </div>
        <AlgorithmBlock
          title="소스 변경 하나를 ISA 수준에서 검증하는 절차"
          input={["기준 kernel 과 변경한 kernel 의 .cu", "배포 대상 sm_XX", "-lineinfo 를 켠 nvcc 빌드"]}
          steps={[
            { code: "nvcc -O3 -lineinfo -gencode arch=compute_XX,code=sm_XX -Xptxas -v k.cu -o k", note: "-Xptxas -v 가 kernel 별 register·spill·shared memory 를 stderr 에 적습니다. 두 빌드의 이 줄을 먼저 비교합니다." },
            { code: "cuobjdump -lelf -lptx k", note: "Fatbin 에 대상 sm_XX cubin 이 들어 있는지 확인합니다. 없으면 실제 GPU 에서는 JIT 결과가 돌아 아래 분석이 그 binary 와 다릅니다." },
            { code: "cuobjdump -xelf all k  →  nvdisasm -plr -g k.sm_XX.cubin > k.sass", note: "Cubin 을 꺼내 register liveness 열과 source line 이 붙은 SASS 를 만듭니다." },
            { code: "grep -c 'LDG\\|STG\\|FFMA\\|BRA\\|CALL' k.sass", note: "메모리 instruction·FMA·분기·subroutine 호출 수를 두 빌드에서 셉니다. 나눗셈이 남았으면 CALL 이 보입니다." },
            { code: "nvdisasm -cfg k.sm_XX.cubin | dot -Tsvg", note: "Loop 가 unroll 됐는지, 분기가 predication 으로 바뀌었는지를 basic block 수로 봅니다." },
            { code: "diff <(grep -o '^ *R[0-9]*' ...)  /  -plr 열의 최대 동시 생존 register", note: "Register 가 어느 줄에서 가장 많이 겹치는지 찾아 unroll 이나 scheduling 이 늘린 몫을 확인합니다." },
            { code: "변경 전후 SASS 가 같으면 측정 차이는 noise; 다르면 profiler 로 시간을 잰다", note: "ISA 분석은 무엇이 바뀌었는지까지만 말하고, 몇 ms 인지는 timing 절차의 몫입니다." },
          ]}
          output="두 빌드의 register·spill·instruction 구성 차이와, 그 차이가 의도한 최적화(FMA 합침·vectorize·unroll)에서 온 것인지에 대한 판정"
        />
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          nvcc·PTX ISA·Binary Utilities 문서가 이 글의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            컴파일 단계와 <code>-gencode</code> 의미, JIT 와 fatbinary 규칙은 NVCC 문서의 GPU
            Compilation 장에서, PTX 의 가상 register 와 instruction 문법은 PTX ISA 문서에서, cuobjdump·
            nvdisasm 의 옵션과 SASS 예제는 CUDA Binary Utilities 문서에서 읽었습니다. Compute
            capability 별 수치는 CUDA C++ Programming Guide 의 표입니다.
          </p>
          <p>
            본문의 PTX 예제는 nvcc 가 해당 kernel 에 내는 전형적 형태를 옮긴 것이고 SASS 예제는
            Binary Utilities 문서의 cuobjdump 출력 예입니다. Unroll 의 instruction·register 산수는
            측정이 아니라 크기 관계를 보이는 계산이며, 실제 수는 독자의 CUDA 버전과 sm_XX 에서
            <code>-Xptxas -v</code> 로 다시 확인해야 합니다.
          </p>
        </div>
        <div id="doc-nvcc-gpu-compilation" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA Compiler Driver NVCC — GPU Compilation"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html"
          >
            cudafe++·cicc·ptxas·fatbinary 단계, virtual(compute_XX)·real(sm_XX) architecture 의 두 단계
            compile, 임베드된 PTX 가 현재 GPU 용 binary 가 없을 때 runtime 에 동적으로 compile 된다는
            JIT 규칙, cubin 이 같은 major 안에서만 forward compatible 하다는 규칙의 출처입니다.
          </CitationBlock>
        </div>
        <div id="doc-ptx-isa" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · Parallel Thread Execution ISA"
            citeKey={2}
            href="https://docs.nvidia.com/cuda/parallel-thread-execution/index.html"
          >
            PTX 가 세대를 넘어 안정된 가상 machine·ISA 라는 목표, .reg state space 의 register 수가
            사실상 무제한이며 allocation 은 ptxas 가 한다는 문장, @p opcode.type d, a, b, c 문법,
            sm_80·sm_90 이 들어온 PTX ISA version 의 출처입니다.
          </CitationBlock>
        </div>
        <div id="doc-cuda-binary-utilities" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA Binary Utilities (cuobjdump, nvdisasm)"
            citeKey={3}
            href="https://docs.nvidia.com/cuda/cuda-binary-utilities/index.html"
          >
            cuobjdump 의 -sass·-ptx·-lelf·-xelf·-res-usage, nvdisasm 의 -cfg·-plr·-g 옵션, 두 도구의
            입력 차이, 본문 SASS 예제의 출처입니다. 세대별 instruction set 표는 opcode 이름과 한 줄
            설명만 제공하며 latency 는 적혀 있지 않습니다.
          </CitationBlock>
        </div>
        <div id="doc-compute-capabilities" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · CUDA C++ Programming Guide — Compute Capabilities"
            citeKey={4}
            href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities"
          >
            Compute capability 의 major.minor 의미, GPU 별 번호, 8.0 과 9.0 의 register file·shared
            memory 한도, 9.0 에서 추가된 cluster·DSM·TMA·wgmma 의 출처입니다. 수치는 공식 표의 값이며
            특정 제품의 실측이 아닙니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/cuda-register-pressure#residency">Register 수가 occupancy 를 깎는 경계</Link>,
          그리고 <Link to="/gpu/cuda-perf-analysis#measurement-protocol">SASS 차이를 시간으로 확인하는 timing 절차</Link>.
        </p>
      </section>
    </div>
  );
}
