import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LaunchOverheadAndCpuGpuSynchronizationViz from "./launch-overhead-and-cpu-gpu-synchronization/viz/LaunchOverheadAndCpuGpuSynchronizationViz";

/**
 * Launch overhead 는 CPU 의 고정 비용이고 GPU 는 그것을 기다리다 굶습니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "CPU 가 GPU 에 일을 넘기는 속도와 GPU 가 소비하는 속도의 관계, 그리고 동기화가 그 관계를 끊는 방식"만 소유한다.
 * capture·replay 의 계약과 node·edge·instantiate·padding 은 ai/cuda-graph-capture 가, runtime 기동 warmup 은 ai/inference-runtime-anatomy 가 소유한다.
 */
export default function LaunchOverheadAndCpuGpuSynchronizationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          GPU 가 노는 시간의 원인은 일이 없어서가 아니라 CPU 가 아직 안 보내서입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            GPU 는 CPU 가 queue 에 넣어 준 kernel 만 실행합니다. kernel 하나를 넣는 데 드는 CPU
            쪽 고정 비용이 host launch overhead 이고, 그 비용이 GPU 가 kernel 을 끝내는 시간보다
            길면 GPU 는 다음 일을 기다리며 비어 있습니다. 이 빈 시간이 GPU starvation 입니다.
          </p>
          <p>
            decode 한 step 에 kernel 이 300개이고 launch 하나에 5 µs 가 들면 CPU 는 step 마다 1.5
            ms 를 제출에만 씁니다. batch 가 커서 GPU 실행이 4 ms 라면 이 1.5 ms 는 GPU 실행
            뒤에 완전히 숨습니다. batch 가 작아 GPU 실행이 1.2 ms 라면 숨지 못하고 step 시간을
            CPU 가 정합니다.
          </p>
          <p>
            <Link to="/ai/cuda-graph-capture">CUDA graph</Link> 는 launch 300개를 하나로
            줄여 이 병목을 지우지만, scheduler 와 sampler 가 쓰는 CPU 시간과{" "}
            <code>.item()</code> 같은 동기화 지점은 그대로 남습니다. 이 글은 CPU 제출 속도와
            GPU 소비 속도의 관계를 timeline 으로 놓고, 어디서 starvation 이 생기고 무엇이 그것을
            지우는지 봅니다.
          </p>
          <p>
            이어지는 절은 launch overhead 의 크기와 상각, CPU 제출 병목과 starvation 의 조건,
            동기화가 pipeline 을 비우는 방식, graph replay 의 latency 와 warmup, capture 가
            실패했을 때의 증상 순서로 갑니다.
          </p>
        </div>
        <LaunchOverheadAndCpuGpuSynchronizationViz />
        <ContentBoundary article="launch-overhead-and-cpu-gpu-synchronization" />
      </section>

      <section id="launch-overhead" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Launch overhead 는 kernel 크기와 무관한 µs 단위 고정 비용입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            host launch overhead 는 Python 이 인자를 준비하고 C++ dispatcher 를 거쳐 driver 가
            command 를 GPU queue 에 쓰기까지의 CPU 시간입니다. kernel 이 얼마나 큰 일을 하든 이
            비용은 거의 같아서, 일이 작을수록 비중이 커집니다.
          </p>
          <p>
            NVIDIA blog 의 V100 측정에서는 2.9 µs 짜리 kernel 을 stream 에 연달아 넣을 때
            kernel 당 3.8 µs 가 걸렸습니다. kernel 자체보다 launch 가 0.9 µs 를 더 먹은 셈이고,
            launch 마다 동기화를 넣으면 9.6 µs 로 뜁니다. PyTorch 처럼 Python 층이 위에 있으면
            kernel 당 수 µs 에서 수십 µs 까지 늘어납니다.
          </p>
          <p>
            이 비용을 지우는 방법은 모두 상각입니다. launch amortization 은 고정 비용 하나를 더
            많은 일에 나눠 붙이는 것으로, kernel fusion 은 launch 한 번당 일을 키우고, batch 는
            같은 launch 로 더 많은 token 을 처리하며, graph 는 launch 300개를 하나로 묶습니다.
            어느 쪽이든 kernel 당 CPU 비용은 그대로이고 나눠지는 분모가 커집니다.
          </p>
          <p>
            CPU 가 kernel 을 넣는 속도와 GPU 가 비우는 속도를 비율로 보면 starvation 이 바로
            보입니다. launch 하나에 5 µs 면 CPU 는 초당 20만 개를 넣고, GPU 가 kernel 하나를 4
            µs 에 끝내면 초당 25만 개를 비웁니다. 들어오는 속도가 나가는 속도의 80% 이므로 GPU 는
            시간의 20% 를 빈 queue 앞에서 보냅니다.
          </p>
        </div>
        <ExplainedFormula
          question="Launch 를 연달아 넣기만 할 때 GPU 는 얼마나 바쁜가요?"
          idea="Queue 에 들어오는 속도가 나가는 속도보다 느리면 queue 는 비어 있고 GPU 는 도착 간격만큼 쉽니다. 바쁜 비율은 두 속도의 비로 정해지고 1 을 넘지 못합니다."
          formula={String.raw`\rho_{\rm GPU}=\min\!\left(1,\ \frac{\lambda_{\rm CPU}}{\mu_{\rm GPU}}\right)=\min\!\left(1,\ \frac{\tau_E}{\tau_L}\right)`}
          annotatedFormula={String.raw`\rho_{\rm GPU}=\min\!\left(1,\ \frac{\underbrace{\lambda_{\rm CPU}}_{\text{CPU 가 초당 넣는 launch 수}=1/\tau_L}}{\underbrace{\mu_{\rm GPU}}_{\text{GPU 가 초당 끝내는 kernel 수}=1/\tau_E}}\right)`}
          operations={[
            { expression: String.raw`\lambda_{\rm CPU}=1/\tau_L`, annotation: ["launch 하나의 CPU 시간의 역수를 취해", "CPU 제출 속도 계산"] },
            { expression: String.raw`\mu_{\rm GPU}=1/\tau_E`, annotation: ["kernel 하나의 GPU 시간의 역수를 취해", "GPU 소비 속도 계산"] },
            { expression: String.raw`\min(1,\ \lambda_{\rm CPU}/\mu_{\rm GPU})`, annotation: ["두 속도의 비를 1 로 자르면", "GPU 가 바쁜 시간 비율 확정"] },
          ]}
          terms={[
            { symbol: String.raw`\tau_L`, name: "Launch 당 CPU 시간", description: "kernel 하나를 queue 에 넣는 host 쪽 고정 비용입니다. 예시 5 µs." },
            { symbol: String.raw`\tau_E`, name: "Kernel 당 GPU 시간", description: "GPU 가 kernel 하나를 실행하는 시간입니다. 예시 4 µs." },
            { symbol: String.raw`\rho_{\rm GPU}`, name: "GPU 바쁜 비율", description: "1 이면 GPU 가 병목이고 1 미만이면 그만큼 starvation 입니다." },
          ]}
          assumptions={["launch 사이에 동기화가 없고 queue 상한에 걸리지 않는다고 가정합니다.", "kernel 시간이 고르다고 두었으며 실제로는 kernel 마다 다르므로 평균으로 봅니다."]}
          interpretation="τ_L=5 µs, τ_E=4 µs 면 ρ=0.8 이라 GPU 가 20% 를 쉽니다. batch 를 키워 τ_E 가 13 µs 가 되면 ρ=1 로 GPU 가 병목이 되고 launch 비용은 숨습니다. graph 는 τ_L 을 300개당 60 µs, 즉 kernel 당 0.2 µs 로 낮춰 같은 효과를 냅니다."
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="Alan Gray · Getting Started with CUDA Graphs (NVIDIA Technical Blog, 2019)"
            citeKey={1}
            href="https://developer.nvidia.com/blog/cuda-graphs/"
            type="code"
          >
            V100 에서 2.9 µs kernel 을 반복할 때 launch 와 동기화를 포함하면 kernel 당 9.6 µs,
            launch 만 겹치면 3.8 µs, graph 로 묶으면 3.4 µs 였다는 저자 자기보고입니다. launch
            overhead 가 kernel 크기와 무관한 고정 비용이라는 근거로만 쓰며, 다른 GPU 와 driver 로
            일반화한 수치가 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="submission-pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          CPU 한 step 이 GPU 한 step 보다 길면 step 시간은 CPU 가 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            CPU submission bottleneck 은 CPU 가 step 하나를 제출하는 데 드는 시간이 GPU 가 그
            step 을 실행하는 시간보다 긴 상태입니다. 제출 시간에는 launch 만이 아니라 scheduler 가
            batch 를 고르고 sampler 가 token 을 뽑고 detokenize 하는 Python 시간도 들어갑니다.
            이 몫이 runtime CPU bottleneck 입니다.
          </p>
          <p>
            Viz 의 첫 장면이 그 예입니다. scheduling 1.0 ms 에 launch 1.5 ms 를 더한 CPU step 이
            2.5 ms 인데 GPU 실행은 2.0 ms 라서, GPU 는 step 마다 0.5 ms 를 빈 queue 앞에서
            기다립니다. GPU 가 바쁜 비율은 2.0/2.5 = 80% 이고 TPOT 은 2.0 ms 가 아니라 2.5 ms
            입니다.
          </p>
          <p>
            반대로 batch 가 커서 GPU 실행이 4 ms 면 CPU 2.5 ms 는 그 뒤에 숨고 CPU 는 step 마다
            1.5 ms 를 기다립니다. 이때는 launch 를 줄여도 step 시간이 줄지 않습니다. 어느 쪽이
            병목인지는 두 timeline 을 profiler 로 나란히 놓아야 보이며, GPU 쪽만 보면 kernel 사이
            빈틈으로 나타납니다.
          </p>
          <p>
            graph replay 는 launch 1.5 ms 를 수십 µs 로 줄이므로 CPU step 이 1.06 ms 가 되고 GPU
            2.0 ms 가 병목이 됩니다. 그러나 scheduling 1.0 ms 는 그대로이므로, model 이 작아
            GPU 실행이 0.8 ms 로 내려오면 다시 CPU 가 병목입니다. 그 다음 수단은 launch 가 아니라
            scheduling 자체를 GPU 실행과 겹치는 것입니다.
          </p>
          <p>
            겹치려면 step n 의 GPU 실행 중에 step n+1 의 scheduling 을 돌려야 하고, 그러려면
            step n 의 결과를 CPU 가 기다리지 않아야 합니다.{" "}
            <Link to="/ai/inference-runtime-anatomy#process-anatomy">process 분리</Link> 와 비동기
            scheduling 이 그 장치이며, 다음 절의 동기화 지점이 그것을 막는 첫 번째 원인입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Step 시간은 CPU 제출과 GPU 실행 중 무엇이 정하나요?"
          idea="CPU 가 다음 step 을 미리 제출할 수 있으면 두 timeline 이 겹쳐 긴 쪽이 step 시간이 됩니다. 동기화가 있으면 scheduling 이 GPU 앞에 직렬로 놓여 그만큼 더해집니다."
          formula={String.raw`T_{\rm async}=\max\!\big(T_{\rm sched}+N\tau_L,\ T_{\rm GPU}\big),\qquad T_{\rm sync}=T_{\rm sched}+\max\!\big(N\tau_L,\ T_{\rm GPU}\big)`}
          annotatedFormula={String.raw`\begin{aligned}T_{\rm async}&=\max\!\big(\underbrace{T_{\rm sched}+N\tau_L}_{\text{CPU 한 step 의 제출 시간}},\ \underbrace{T_{\rm GPU}}_{\text{GPU 한 step 의 실행 시간}}\big)\\T_{\rm sync}&=\underbrace{T_{\rm sched}}_{\text{동기화 뒤 직렬로 놓인 scheduling}}+\max\!\big(N\tau_L,\ T_{\rm GPU}\big)\end{aligned}`}
          operations={[
            { expression: String.raw`T_{\rm sched}+N\tau_L`, annotation: ["scheduling 시간에 launch N 개의 비용을 더해", "CPU 가 한 step 을 제출하는 시간 계산"] },
            { expression: String.raw`\max(\cdot,\ T_{\rm GPU})`, annotation: ["CPU 제출과 GPU 실행 중 긴 쪽을 골라", "겹쳐서 실행될 때의 step 시간 확정"] },
            { expression: String.raw`T_{\rm sched}+\max(N\tau_L,\ T_{\rm GPU})`, annotation: ["동기화로 scheduling 이 겹치지 못하면 앞에 더해", "직렬화된 step 시간 계산"] },
          ]}
          terms={[
            { symbol: String.raw`T_{\rm sched}`, name: "Scheduling 시간", description: "scheduler·sampler·detokenize 처럼 launch 전후에 CPU 가 쓰는 시간입니다. 예시 1.0 ms." },
            { symbol: String.raw`N\tau_L`, name: "Launch 총 비용", description: "kernel N 개를 넣는 시간입니다. eager 300 × 5 µs = 1.5 ms, graph 는 60 µs." },
            { symbol: String.raw`T_{\rm GPU}`, name: "GPU 실행 시간", description: "step 의 kernel 이 GPU 에서 실제로 도는 시간의 합입니다. 예시 2.0 ms." },
          ]}
          assumptions={["CPU 가 최대 한 step 앞까지만 제출한다고 가정하며 더 앞서 가면 queue 상한에서 막힙니다.", "GPU 실행이 CPU 제출보다 늦게 시작하는 첫 kernel 의 지연은 무시했습니다."]}
          interpretation="예시 수치로 async eager 는 max(2.5, 2.0)=2.5 ms, sync eager 는 1.0+max(1.5, 2.0)=3.0 ms, async graph 는 max(1.06, 2.0)=2.0 ms, sync graph 는 1.0+2.0=3.0 ms 입니다. graph 의 이득은 동기화를 없앴을 때만 온전히 나타납니다."
        />
        <AlgorithmBlock
          title="CPU 제출 loop 와 GPU queue 의 timeline"
          input={["요청 상태와 KV block 을 쥔 scheduler", "kernel N 개로 이루어진 forward", "깊이 D 의 GPU command queue"]}
          steps={[
            { code: "t_cpu = 0; t_gpu = 0; queue = []", note: "CPU 와 GPU 는 각자의 시계를 가진 두 timeline 입니다." },
            { code: "loop step: t_cpu += T_sched  # batch 선택·sampler 준비", note: "이 시간 동안 GPU 는 queue 에 남은 kernel 만 실행합니다. queue 가 비면 starvation 입니다." },
            { code: "for k in kernels: t_cpu += tau_L; queue.push(k, ready=t_cpu)", note: "launch 하나마다 CPU 시간이 흐르고 kernel 은 ready 시각 이후에만 GPU 가 집을 수 있습니다." },
            { code: "GPU: while queue: k = queue.pop(); t_gpu = max(t_gpu, k.ready) + tau_E[k]", note: "max 가 starvation 입니다. ready 가 t_gpu 보다 늦으면 GPU 는 그 차이만큼 쉽니다." },
            { code: "if sync_at_step_end: t_cpu = max(t_cpu, t_gpu)  # .item() 또는 synchronize", note: "CPU 가 GPU 를 따라잡을 때까지 멈추고 다음 step 의 T_sched 는 그 뒤에 시작합니다." },
            { code: "if len(queue) >= D: t_cpu = queue[0].start  # queue 상한", note: "CPU 가 너무 앞서면 driver 가 launch 호출을 block 해 CPU 쪽 wait 가 생깁니다." },
          ]}
          output="step 마다의 t_cpu 증가분(제출 시간)과 t_gpu 증가분(실행 시간), 그 차이로 읽는 starvation"
        />
      </section>

      <section id="sync-points" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          동기화 한 번은 queue 를 비우고 다음 제출을 GPU 뒤로 밀어냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            CPU–GPU synchronization 은 CPU 가 GPU 의 결과를 실제로 기다리는 지점입니다.{" "}
            <code>torch.cuda.synchronize()</code> 와 <code>cudaDeviceSynchronize</code> 가
            명시적 지점이고, <code>.item()</code>, <code>.cpu()</code>, <code>print(tensor)</code>,{" "}
            <code>if tensor:</code> 처럼 GPU 값을 CPU 로 가져오는 모든 호출이 암묵적 지점입니다.
          </p>
          <p>
            동기화가 비싼 이유는 기다리는 시간 자체가 아니라 pipeline 이 비기 때문입니다.
            PyTorch 는 GPU 작업을 queue 에 넣고 바로 돌아오므로 평소에는 CPU 가 GPU 보다 앞서
            달립니다. 동기화 지점에서 CPU 는 queue 가 다 빌 때까지 멈추고, 그 뒤 다음 step 의
            scheduling 을 시작하는 동안 GPU 는 할 일이 없습니다.
          </p>
          <p>
            Viz 의 두 번째 장면이 그 비용입니다. 동기화가 없을 때 2.5 ms 였던 step 이 step 끝
            <code>.item()</code> 하나로 3.0 ms 가 됩니다. scheduling 1.0 ms 가 GPU 실행과 겹치지
            못하고 앞에 직렬로 놓이기 때문이며, graph 를 써도 네 번째 장면처럼 같은 3.0 ms 로
            돌아갑니다.
          </p>
          <p>
            serving 에서 흔한 암묵적 동기화는 sampler 가 뽑은 token id 를 CPU 로 가져와 stop
            token 인지 판정하는 곳, 길이 초과를 CPU 값으로 검사하는 곳, 그리고 logging 이나
            metric 을 위해 tensor 값을 읽는 곳입니다. 세 곳 모두 판정을 GPU 위에서 하거나 결과를
            한 step 늦게 읽으면 지점이 사라집니다.
          </p>
          <p>
            CUDA Best Practices Guide 는 CPU–GPU 동기화 지점이 GPU pipeline 의 stall 을 뜻하므로
            드물게 써야 한다고 적습니다. 반대로 timing 을 잴 때는 동기화 없이는 CPU timer 가
            제출 시간만 재므로, 측정에서는 일부러 넣되 그 값이 serving 의 step 시간이 아님을
            구분해야 합니다.
          </p>
          <p>
            host 와 device 사이 copy 도 동기화 지점이 될 수 있습니다. pageable memory 에서의{" "}
            <code>cudaMemcpy</code> 는 CPU 를 붙잡지만 pinned memory 와{" "}
            <code>non_blocking=True</code> 를 쓰면 copy 가 stream 에 들어가 다른 일과 겹칩니다.
            stream 사이의 순서와 event 규칙은{" "}
            <Link to="/gpu/cuda-sync-streams#streams">CUDA 동기화 & 스트림</Link> 글이 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="동기화 지점의 종류와 대체 방법"
          items={[
            { term: "명시적 동기화", description: "torch.cuda.synchronize(), cudaDeviceSynchronize(), stream.synchronize() 처럼 GPU 완료를 기다리는 호출입니다.", example: "benchmark 의 timer 앞뒤", boundary: "측정에서는 필요하지만 serving loop 안에서는 step 마다 pipeline 을 비웁니다." },
            { term: "암묵적 동기화", description: ".item(), .cpu(), .numpy(), print, bool(tensor) 처럼 GPU 값을 CPU 가 읽는 호출입니다.", example: "if next_token.item() == eos: break", boundary: "판정을 GPU tensor 연산으로 바꾸거나 한 step 뒤에 읽으면 지점이 사라집니다." },
            { term: "Blocking copy", description: "pageable host memory 와의 cudaMemcpy 는 CPU 가 copy 를 끝낼 때까지 돌아오지 않습니다.", example: "tensor.to('cuda') without non_blocking", boundary: "pinned memory 와 non_blocking=True 로 stream 에 넣으면 겹칩니다." },
          ]}
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="PyTorch · CUDA semantics (Asynchronous execution, CUDA Graphs)"
            citeKey={2}
            href="https://docs.pytorch.org/docs/stable/notes/cuda.html"
            type="code"
          >
            GPU 연산이 enqueue 만 되고 나중에 실행된다는 비동기 의미론, .item() 등이 동기화를
            일으킨다는 목록, 정확한 timing 에는 synchronize 나 CUDA event 가 필요하다는 설명,
            graph replay 가 Python·C++·driver 의 인자 준비와 dispatch 를 건너뛴다는 서술의
            출처입니다.
          </CitationBlock>
          <CitationBlock
            source="NVIDIA · CUDA C++ Best Practices Guide, Timing"
            citeKey={3}
            href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html"
            type="code"
          >
            kernel launch 와 Async copy 가 비동기라는 서술과, CPU–GPU 동기화 지점이 GPU 처리
            pipeline 의 stall 을 뜻하므로 드물게 써야 한다는 권고의 출처입니다. 이 문서는 launch
            overhead 를 µs 수치로 적지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="graph-replay" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Graph replay 는 수십 µs 짜리 launch 하나이고 첫 replay 는 더 느립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            graph replay latency 는 <code>cudaGraphLaunch</code> 를 부른 시점부터 그 graph 의
            마지막 kernel 이 끝나기까지의 시간입니다. 그중 CPU 쪽 launch 비용은 kernel 수와 거의
            무관한 수십 µs 이고, 나머지는 GPU 실행 시간이라 replay 가 줄이는 것은 앞부분뿐입니다.
          </p>
          <p>
            NVIDIA blog 의 예시로 셈하면 kernel 20개 graph 의 kernel 당 시간이 3.4 µs 이고 kernel
            실행이 2.9 µs 이므로 graph launch 의 몫은 20 × 0.5 = 10 µs 입니다. kernel 300개
            decode step 이라면 eager launch 1.5 ms 가 수십 µs 로 내려오고, GPU 실행 1.2 ms 가
            step 시간이 됩니다.
          </p>
          <p>
            첫 replay 는 이후보다 느립니다. blog 는 첫 graph launch 가 그 뒤보다 약 33% 느리다고
            보고하며, executable graph 를 device 에 올리는 upload 가 첫 launch 에 섞이기 때문
            입니다. 수천 번 반복하면 무시할 수 있지만 첫 요청의 TPOT 에는 그대로 보입니다.
          </p>
          <p>
            graph warmup 은 이 두 가지 첫 실행 비용을 요청 전에 치르는 일입니다. capture 전에는
            PyTorch 문서가 side stream 에서 eager 로 몇 번 돌리라고 적는데, JIT compile, lazy
            init, allocator 의 pool 확장이 capture 안에 들어가지 않게 하기 위해서입니다. vLLM
            은 <code>cudagraph_num_of_warmups</code> 만큼 eager 를 돈 뒤 기록합니다.
          </p>
          <p>
            capture 뒤에는 replay 를 한 번 더 돌려 첫 launch 의 upload 를 끝냅니다. capture size
            가 60개면 size 마다 warmup 과 capture 와 첫 replay 가 붙어 기동이 수 초 늘어나고, 이
            시간은 <Link to="/ai/inference-runtime-anatomy#warmup">runtime warmup</Link> 의 한
            항목입니다. 어느 size 를 capture 할지는{" "}
            <Link to="/ai/cuda-graph-capture#shape-padding">capture size padding</Link> 이 정합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Replay 가 줄이지 않는 것은 무엇인가요?"
          preview="GPU 실행 시간, scheduling 시간, 동기화 지점은 replay 와 무관하게 남습니다."
        >
          <p>
            replay 는 launch 를 하나로 만들 뿐 kernel 이 GPU 에서 도는 시간은 그대로입니다. batch
            가 커서 GPU 가 이미 병목이면 replay 의 이득은 TPOT 에 나타나지 않습니다.
          </p>
          <p>
            scheduler 와 sampler 의 CPU 시간도 그대로입니다. graph 로 launch 를 지운 뒤 CPU 가 여전히
            병목이면 다음 수단은 scheduling 을 GPU 실행과 겹치는 비동기 scheduling 입니다.
          </p>
          <p>
            step 끝의 동기화가 남아 있으면 Viz 네 번째 장면처럼 replay 의 이득이 사라집니다.
            graph 를 켜고도 TPOT 이 그대로라면 먼저 동기화 지점을 찾아야 합니다.
          </p>
        </ProgressiveDetail>
        <div className="not-prose my-8">
          <CitationBlock
            source="vLLM · vllm/config/compilation.py (CompilationConfig)"
            citeKey={4}
            href="https://github.com/vllm-project/vllm/blob/main/vllm/config/compilation.py"
            type="code"
          >
            <code>cudagraph_num_of_warmups</code> 가 처음 몇 번의 실행을 warmup 으로 취급하고 그
            뒤에야 기록한다는 docstring, capture size 상한을 두는 이유가 기동 시간과 메모리라는
            설명의 출처입니다. size 당 기동 시간과 replay launch 수십 µs 는 개념 예시이며 실측이
            아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="capture-failure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Capture 실패는 기동 오류보다 조용한 eager fallback 으로 더 자주 나타납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            graph capture failure 는{" "}
            <Link to="/ai/cuda-graph-capture#graph-compatibility">graph-compatible execution</Link>{" "}
            의 조건이 깨져 capture 가 오류로 끝나거나, 기록은 됐지만 replay 가 틀린 경로나 값을
            재생하거나, runtime 이 그 shape 를 graph 없이 eager 로 돌리는 세 가지 결과를 모두
            가리킵니다. 셋 중 가장 찾기 어려운 것은 마지막입니다.
          </p>
          <p>
            오류로 끝나는 경우는 capture 안에서 동기화가 일어날 때입니다. CUDA 는 capture 중인
            stream 에서 허용되지 않는 연산이라는 오류를 내고 PyTorch 는 그것을 예외로 올립니다.
            원인은 대개 <code>.item()</code> 이나 pageable memory copy 이며, 예외의 stack 에 그
            호출이 그대로 찍히므로 가장 빨리 잡힙니다.
          </p>
          <p>
            틀린 값을 재생하는 경우는 capture 가 성공했기 때문에 더 위험합니다. CPU 값에 따른 분기가
            capture 때의 경로로 굳어 있거나, capture 밖에서 만든 tensor 를 replay 가 계속 읽거나,
            graph pool 을 공유한 graph 를 순서 없이 replay 한 경우입니다. 증상은 오류가 아니라
            품질 저하나 간헐적 이상 출력입니다.
          </p>
          <p>
            eager fallback 은 runtime 이 호환되지 않는 backend 나 상한을 넘는 batch 를 만나 graph
            없이 돌리는 경우입니다. 오류가 없으니 기동은 성공하고 TPOT 만 나빠집니다. 300개
            launch 가 돌아오면 첫 절의 예시대로 step 이 1.2 ms 에서 1.5 ms 이상으로 늘어나며,
            낮은 batch 에서만 나타나므로 부하 시험에서는 놓치기 쉽습니다.
          </p>
          <p>
            진단 순서는 세 가지입니다. 먼저 profiler 에서 step 마다 launch 수가 1 인지 300 인지
            보고, 다음으로 <code>enforce_eager</code> 로 graph 를 끈 값과 비교해 차이가 없으면
            fallback 을 의심하며, 마지막으로 <code>CUDA_LAUNCH_BLOCKING=1</code> 로 비동기 오류의
            위치를 고정합니다. 복구는 문제 연산을 capture 밖으로 빼거나 piecewise 로 그 구간만
            eager 에 남기는 것입니다.
          </p>
        </div>
        <TermBreakdown
          title="Capture failure 의 세 증상과 첫 번째 확인"
          items={[
            { term: "Capture 오류", description: "capture 중 동기화나 허용되지 않는 연산으로 예외가 납니다.", example: "sampler 안의 .item(), pageable copy", boundary: "stack trace 에 호출이 찍히므로 가장 빨리 찾지만 기동 자체가 실패합니다." },
            { term: "잘못된 replay", description: "capture 는 성공했지만 경로·주소·pool 순서가 어긋나 값이 틀립니다.", example: "CPU 값 분기, capture 밖 tensor 참조, pool 순서 위반", boundary: "오류가 없어 품질 지표나 eager 와의 출력 비교로만 드러납니다." },
            { term: "Eager fallback", description: "호환되지 않는 backend 나 상한 초과 batch 를 graph 없이 돌립니다.", example: "cascade attention, max capture size 초과", boundary: "낮은 batch 의 TPOT 만 나빠지므로 부하 시험에서 놓치기 쉽습니다." },
          ]}
        />
        <ProgressiveDetail
          title="어떤 연산이 capture 를 깨뜨리나요?"
          preview="동기화, CPU 값 분기, capture 밖 할당, 호환되지 않는 backend, capture 중 OOM 다섯 갈래입니다."
        >
          <p>
            동기화: <code>.item()</code>, <code>.cpu()</code>, <code>synchronize()</code>,
            pageable memory copy. capture 중 GPU 가 실행하지 않으므로 값이 오지 않아 오류가 납니다.
          </p>
          <p>
            CPU 값 분기: <code>if seq_len &gt; t:</code> 처럼 host 값으로 kernel 수나 순서가
            달라지는 코드. capture 때의 경로만 기록되어 replay 가 다른 조건에서 틀린 경로를 돕니다.
          </p>
          <p>
            capture 밖 할당: capture 안에서 만든 tensor 를 밖으로 내보내거나 밖의 tensor 를 새로
            할당해 넘기는 경우. replay 는 capture 때의 주소만 읽으므로 옛 값을 재생합니다.
          </p>
          <p>
            호환되지 않는 backend: 요청 구성에 따라 경로가 갈리는 attention backend 나 host
            callback 을 쓰는 연산. runtime 이 capture 를 건너뛰고 eager 로 남깁니다.
          </p>
          <p>
            capture 중 OOM: graph pool 이 size 마다 커져 KV pool 예산을 침범하면 capture 가
            실패하거나 KV block 수가 줄어듭니다. capture size 상한을 낮추거나 utilization 예산을
            다시 잡아야 합니다.
          </p>
        </ProgressiveDetail>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글:{" "}
          <Link to="/ai/inference-optimization-layers">
            추론 최적화의 층: model·kernel·runtime·system 과 ROI
          </Link>
        </p>
      </section>
    </div>
  );
}
