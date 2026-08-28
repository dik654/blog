import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { vllmTree } from "./fileTree";
import CaptureSizePaddingViz from "./viz/CaptureSizePaddingViz";
import CudaGraphTimelineViz from "./viz/CudaGraphTimelineViz";

export default function CudaGraphCaptureArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          디코딩 한 step은 GPU 연산보다 커널 launch 횟수가 더 큰 비용일 수
          있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            LLM decode는 매 step 같은 forward를 반복합니다. Attention·MLP·
            normalization마다 별도 CUDA kernel이 launch되므로, 한 step
            안에서만 수백 개 kernel이 CPU에서 GPU로 넘어갑니다.
          </p>
          <p>
            Batch가 크고 kernel 하나의 실제 연산(exec) 시간이 길면 이 launch
            비용은 무시할 만합니다. 하지만 decode처럼 batch가 작고 layer당
            연산량이 적으면, 커널 하나를 GPU에 올리는 데 드는 고정
            overhead(CPU가 driver를 호출하고 GPU queue에 넣는 시간)가
            실제 연산 시간보다 커질 수 있습니다 — GPU가 노는 시간의
            대부분이 "일할 게 없어서"가 아니라 "다음 일이 아직 도착하지
            않아서"입니다.
          </p>
          <p>
            같은 kernel 시퀀스를 매 step 반복한다면, 그 시퀀스를 한 번
            녹화해두고 이후에는 녹화된 것을 그대로 재생하면 어떨까요? CUDA
            Graphs는 정확히 이 아이디어입니다 — <strong>capture</strong>는
            kernel launch 시퀀스 전체를 한 번 기록하고, <strong>
              replay
            </strong>는 그 시퀀스를 CPU 쪽 재해석 없이 GPU에 그대로
            재생합니다.
          </p>
        </div>
        <ExplainedFormula
          question="왜 kernel 수가 많을수록 launch overhead가 exec 시간을 압도할까요?"
          idea="한 step의 총 시간은 kernel마다의 launch 비용과 exec 비용을 더한 것입니다. Launch 비용은 kernel 크기와 거의 무관한 고정 비용이라, kernel이 작고 많을수록 전체 시간에서 차지하는 비중이 커집니다."
          formula={String.raw`T_{\rm eager}=N(\tau_L+\tau_E),\qquad T_{\rm replay}\approx N\tau_E+\tau_{L,\rm graph}`}
          annotatedFormula={String.raw`\begin{aligned}
T_{\rm eager}&=\underbrace{N(\tau_L+\tau_E)}_{\text{매 kernel마다 launch+exec을 반복}}\\
T_{\rm replay}&=\underbrace{N\tau_E+\tau_{L,\rm graph}}_{\text{exec은 그대로, launch는 graph 하나로 상각}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`N(\tau_L+\tau_E)`,
              annotation: [
                "kernel마다 launch와 exec 비용을 더해",
                "eager 실행의 총 step 시간 계산",
              ],
            },
            {
              expression: String.raw`N\tau_E`,
              annotation: [
                "replay는 kernel마다 exec 비용만 남기고",
                "launch 비용을 개별 kernel에서 제거",
              ],
            },
            {
              expression: String.raw`\tau_{L,\rm graph}`,
              annotation: [
                "N개 launch 대신 graph launch 하나만 issue해",
                "launch 비용을 O(N)에서 O(1)로 상각",
              ],
            },
          ]}
          terms={[
            { symbol: String.raw`N`, name: "Kernel count", description: "한 step(예: decode forward)이 launch하는 kernel 수입니다." },
            { symbol: String.raw`\tau_L`, name: "Per-kernel launch overhead", description: "CPU가 kernel 하나를 GPU queue에 넣는 데 드는 고정 비용입니다." },
            { symbol: String.raw`\tau_E`, name: "Kernel exec time", description: "GPU가 실제로 그 kernel을 실행하는 시간입니다." },
            { symbol: String.raw`\tau_{L,\rm graph}`, name: "Graph launch overhead", description: "captured graph 전체를 한 번에 issue하는 비용으로, kernel 수 N과 거의 무관합니다." },
          ]}
          assumptions={[
            "Kernel 수와 kernel당 exec 시간이 step마다 거의 고정됩니다(shape가 같은 replay 대상).",
            "Launch overhead가 CPU-bound이고 kernel 크기와 거의 무관하다고 가정합니다.",
            "N·τ_E 자체는 capture로 줄지 않습니다 — 줄어드는 것은 launch 비용뿐입니다.",
          ]}
          interpretation="N=200, τ_L=5µs, τ_E=2µs라는 예시라면 eager는 200×7µs=1.4ms, replay는 200×2µs+graph launch 한 번(예: 10µs)≈0.41ms입니다. 이 숫자는 개념 설명용 예시이며, 실제 배율은 hardware·kernel·batch에 따라 다릅니다."
        />
      </section>

      <section id="mechanics" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Replay는 Python을 다시 실행하지 않고, 고정된 GPU 주소를 그대로
          재생합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>torch.cuda.graph(graph, ...)</code> context 안에서 실행한
            코드는 평소처럼 즉시 GPU에서 계산되지 않습니다. CUDA의 stream
            capture 메커니즘이 그 구간에서 issue되는 모든 kernel launch와
            메모리 연산을 가로채, 실제로 실행하는 대신 <code>graph</code>{" "}
            객체 안에 하나의 실행 그래프로 기록합니다.
          </p>
          <p>
            Context를 벗어나면
            capture가 끝나고, 이후 <code>graph.replay()</code>는 이 기록된
            그래프를 CPU 쪽 재해석 없이 GPU에 그대로 다시 실행합니다.
          </p>
          <p>
            여기서 지켜야 할 제약이 하나 있습니다 — replay는{" "}
            <strong>capture 시점에 고정된 GPU 메모리 주소</strong>를
            그대로 읽고 씁니다. Capture가 끝난 뒤 새 input tensor를
            만들어 넘겨도 graph는 그 tensor를 보지 않습니다.
          </p>
          <p>
            대신 새
            데이터를 capture 때 쓰인 바로 그 buffer에{" "}
            <code>copy_</code>로 덮어써야 replay가 실제로 새 입력을
            반영합니다. 이 static-address 제약 때문에 batch size나
            sequence 길이가 매 step 달라지는 자유로운 dynamic shape는
            그대로 capture할 수 없습니다.
          </p>
        </div>
        <TermBreakdown
          title="Capture / Replay 계약"
          items={[
            { term: "capture", description: "Kernel launch 시퀀스를 한 번 녹화. 이 구간의 실행 결과 자체는 신뢰하지 않습니다." },
            { term: "static address", description: "Capture 시점 input/output tensor의 GPU 메모리 주소. Replay는 이 주소만 읽고 씁니다." },
            { term: "replay", description: "녹화된 kernel 시퀀스를 그대로 재생. 새 입력은 같은 주소에 in-place copy로 반영합니다." },
          ]}
        />
      </section>

      <section id="graph-anatomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Graph는 node와 edge로 정의되고, instantiate 한 번 뒤 replay를 반복합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            CUDA graph의 node는 GPU에 시킬 작업 하나입니다. kernel launch가 대부분이지만
            memcpy, memset, event record, host callback, child graph도 node가 됩니다. edge는 두
            node 사이의 의존 관계이고, edge로 이어지지 않은 node끼리는 driver가 실행 순서를
            보장하지 않습니다.
          </p>
          <p>
            여기서 말하는 node와 edge는 CUDA graph의 용어이며 이 블로그의 knowledge graph와는
            관계가 없습니다. 같은 이름이라도 한쪽은 GPU 작업 단위이고 다른 쪽은 개념 단위입니다.
          </p>
          <p>
            그래프 하나는 정의, instantiate, 실행의 세 단계를 거칩니다. 정의는 node와 edge의
            template을 만드는 일이고, instantiate는 그 template을 검증해 실행 가능한 executable
            graph(<code>cudaGraphExec_t</code>)로 굳히는 일이며, 실행은 그 executable graph를
            stream에 launch하는 일입니다.
          </p>
          <p>
            programming guide는 instantiate가 setup과 initialization의 대부분을 미리 끝낸다고
            적습니다. 그래서 executable graph는 몇 번을 launch해도 instantiate를 다시 하지
            않습니다.
          </p>
          <p>
            이 executable graph가 static execution graph입니다. topology와 각 node의 인자, 메모리
            주소가 모두 고정돼 있어서 launch 한 번의 비용이 node 수와 거의 무관하게 작습니다.
            대신 instantiate 자체는 비쌉니다.
          </p>
          <p>
            NVIDIA blog의 V100 예시는 kernel 20개짜리 graph를
            만들고 instantiate하는 데 약 400 µs가 들었고, 이후에는 launch 한 번당 kernel 하나
            비용이 3.4 µs였다고 보고합니다.
          </p>
          <p>
            같은 예시에서 stream launch만 겹쳐 쓰면 kernel당 3.8 µs이므로 graph는 kernel당 0.4
            µs, launch 한 번(kernel 20개)당 8 µs를 아낍니다. 400 µs를 8 µs로 나누면 50이니 그
            graph를 50번 넘게 replay해야 instantiate 비용을 회수합니다. decode처럼 같은 shape를
            수천 step 반복하면 회수가 빠르고, 한 번 쓰고 버리는 shape라면 손해입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Graph를 몇 번 replay해야 instantiate 비용을 회수하나요?"
          idea="instantiate는 한 번 내는 고정 비용이고 replay 한 번은 eager launch N개 대신 graph launch 하나를 냅니다. 고정 비용을 replay 한 번이 아끼는 양으로 나누면 손익분기 횟수가 나옵니다."
          formula={String.raw`n^{\star}=\left\lceil\frac{T_{\rm inst}}{N\tau_L-\tau_{L,\rm graph}}\right\rceil`}
          annotatedFormula={String.raw`n^{\star}=\left\lceil\frac{\underbrace{T_{\rm inst}}_{\text{instantiate 한 번의 고정 비용}}}{\underbrace{N\tau_L}_{\text{eager 가 내던 launch 비용}}-\underbrace{\tau_{L,\rm graph}}_{\text{replay 한 번의 launch 비용}}}\right\rceil`}
          operations={[
            { expression: String.raw`N\tau_L`, annotation: ["kernel 수에 kernel당 launch 비용을 곱해", "eager가 step마다 내던 launch 비용 계산"] },
            { expression: String.raw`N\tau_L-\tau_{L,\rm graph}`, annotation: ["거기서 graph launch 한 번의 비용을 빼", "replay 한 번이 실제로 아끼는 시간 계산"] },
            { expression: String.raw`\left\lceil T_{\rm inst}/(\cdot)\right\rceil`, annotation: ["고정 비용을 replay당 절감으로 나눠 올림해", "손익분기 replay 횟수 확정"] },
          ]}
          terms={[
            { symbol: String.raw`T_{\rm inst}`, name: "Instantiate 비용", description: "template을 검증하고 executable graph로 굳히는 한 번의 시간입니다. blog 예시에서는 약 400 µs입니다." },
            { symbol: String.raw`N`, name: "Kernel 수", description: "graph 하나에 들어 있는 kernel node 수입니다." },
            { symbol: String.raw`\tau_L`, name: "Kernel당 launch 비용", description: "eager에서 kernel 하나를 issue하는 CPU 쪽 고정 비용입니다." },
            { symbol: String.raw`\tau_{L,\rm graph}`, name: "Graph launch 비용", description: "executable graph 하나를 stream에 넣는 비용이며 N과 거의 무관합니다." },
          ]}
          assumptions={["replay마다 같은 graph를 쓰고 update나 re-capture가 없다고 가정합니다.", "GPU exec 시간은 양쪽이 같으므로 식에서 상쇄됩니다."]}
          interpretation="blog 예시 N=20, τ_L=0.9 µs(3.8−2.9), τ_L,graph=10 µs를 넣으면 분모가 8 µs이고 n*=50입니다. decode 한 step에 kernel 300개가 있고 τ_L=5 µs라면 분모가 1.5 ms에 가까워져 instantiate 수 ms도 몇 step 안에 회수됩니다. 이 수치는 V100 blog 자기보고와 개념 예시이며 hardware마다 다시 재야 합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p id="stream-capture" className="scroll-mt-24">
            node와 edge를 API로 하나씩 그리는 대신, 이미 있는 stream 코드를 그대로 돌리면서
            기록하는 방법이 stream capture입니다. <code>cudaStreamBeginCapture</code>부터{" "}
            <code>cudaStreamEndCapture</code>까지 그 stream에 issue된 작업은 실행되지 않고 node가
            되며, 같은 stream에 넣은 순서가 edge가 됩니다.
          </p>
          <p>
            PyTorch의 <code>torch.cuda.graph</code>는 이 두 호출을 side stream 위에서 감싼
            것입니다. 사용자는 forward를 한 번 부르기만 하고 capture 구간의 시작과 끝은 context
            manager가 맡습니다.
          </p>
          <p>
            다른 stream이 event로 capture 중인 stream을 기다리면 그 stream도 capture에 합류하고,
            EndCapture 전에는 원래 stream으로 다시 join해야 합니다. 이 규칙이{" "}
            <Link to="/gpu/cuda-sync-streams#events">event dependency</Link>를 그대로 edge로
            옮기는 장치이며, join하지 않은 stream이 남아 있으면 EndCapture가 실패합니다.
          </p>
          <p id="graph-update" className="scroll-mt-24">
            capture한 그래프의 인자만 바꾸고 싶을 때는 다시 instantiate하는 대신{" "}
            <code>cudaGraphExecUpdate</code>로 executable graph를 갱신합니다. 조건은 topology가
            완전히 같아야 한다는 것입니다. node 수나 종류, edge가 하나라도 다르면 update는
            거부되고, kernel node의 context와 memcpy의 device 위치도 바꿀 수 없습니다.
          </p>
          <p>
            바꿀 수 있는 것은 kernel 인자와 grid 크기 같은 node parameter뿐입니다. batch size가
            달라져 kernel 수나 tensor shape가 바뀌는 serving에서는 update가 아니라 shape별 새
            capture가 필요하고, 그래서 다음 절의 batch shape dispatch가 등장합니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Graph lifecycle: warmup → stream capture → instantiate → replay / update"
          input={["forward f(x)와 고정 주소의 입력 buffer x_buf", "side stream s", "warmup 횟수 W"]}
          steps={[
            { code: "for _ in range(W): f(x_buf) on s", note: "JIT compile, allocator, lazy init을 capture 밖에서 끝내 첫 실행의 부수 작업이 graph에 섞이지 않게 합니다." },
            { code: "cudaStreamBeginCapture(s); f(x_buf); g = cudaStreamEndCapture(s)", note: "이 구간의 launch는 실행되지 않고 node가 되며 stream 순서와 event wait가 edge가 됩니다." },
            { code: "gExec = cudaGraphInstantiate(g)", note: "검증과 setup을 한 번에 치릅니다. 수백 µs 단위의 고정 비용입니다." },
            { code: "each step: x_buf.copy_(new_x); cudaGraphLaunch(gExec, s)", note: "같은 주소에 새 입력을 덮어쓰고 executable graph를 한 번 launch합니다." },
            { code: "if only node params changed and topology same: cudaGraphExecUpdate(gExec, g2) else: re-capture", note: "shape가 바뀌어 kernel 수나 주소가 달라지면 update가 거부되므로 새 capture로 갑니다." },
          ]}
          output="step마다 CPU launch 1회로 실행되는 executable graph"
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="NVIDIA · CUDA C++ Programming Guide, CUDA Graphs"
            citeKey={1}
            href="https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html"
            type="code"
          >
            node·edge 정의, 정의·instantiate·실행의 세 단계, stream capture의 cross-stream event
            규칙, <code>cudaGraphExecUpdate</code>의 topology 동일 조건과 바꿀 수 없는 항목은 이
            문서의 서술을 따랐습니다. 문서는 launch overhead를 µs 단위 수치로 적지 않으므로 이
            글의 수치는 아래 blog와 개념 예시에서 가져왔습니다.
          </CitationBlock>
          <CitationBlock
            source="Alan Gray · Getting Started with CUDA Graphs (NVIDIA Technical Blog, 2019)"
            citeKey={2}
            href="https://developer.nvidia.com/blog/cuda-graphs/"
            type="code"
          >
            V100에서 2.9 µs짜리 kernel 20개를 반복할 때 launch와 동기화를 포함하면 kernel당 9.6
            µs, launch만 겹치면 3.8 µs, graph로 묶으면 3.4 µs였고 graph 생성과 instantiate에 약
            400 µs가 들었다는 저자 자기보고입니다. 다른 GPU 세대나 driver 버전으로 일반화한
            수치가 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="graph-compatibility" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Capture 안에서는 CPU 동기화와 값에 따른 분기가 없어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            graph-compatible execution은 capture 구간에서 돌려도 되는 코드의 조건입니다. PyTorch
            문서는 세 가지를 금지합니다. <code>.item()</code>처럼 CPU가 GPU 값을 기다리는 동기화,
            CPU나 GPU 값에 따라 갈라지는 dynamic control flow, 그리고 replay마다 주소가 바뀌는
            메모리입니다.
          </p>
          <p>
            동기화가 안 되는 이유는 capture 중에는 GPU가 아무것도 실행하지 않기 때문입니다. 값을
            기다리는 호출은 영원히 오지 않을 결과를 기다리다 오류로 끝납니다. 분기가 안 되는
            이유는 capture가 그 순간 택한 한 경로만 기록하기 때문입니다. 다음 step에 다른
            경로로 갔어야 해도 replay는 기록된 경로를 그대로 돌립니다.
          </p>
          <p>
            주소를 고정하는 장치가 graph pool입니다. capture 중 allocator가 준 tensor를 일반
            pool에 돌려주면 다음 step에 다른 tensor가 그 주소를 받아 replay가 엉뚱한 값을
            읽습니다. 그래서 PyTorch는 capture마다 private memory pool을 두고 그 안의 virtual
            address를 replay 내내 보존합니다.
          </p>
          <p>
            여러 graph를 만들 때 <code>graph_pool_handle()</code>로 같은 pool을 넘기면 그래프들이
            중간 buffer 주소를 나눠 씁니다. capture size가 35개이고 size마다 scratch 200 MB를
            따로 잡으면 7 GB이지만, pool을 공유하면 가장 큰 size 하나 분 200 MB 남짓으로
            줄어듭니다. 조건은 공유하는 그래프를 capture한 순서대로만 replay한다는 것입니다.
          </p>
          <p>
            serving engine에서 이 조건을 못 지키는 대표 구간이 attention입니다. cascade attention
            처럼 요청 구성에 따라 경로가 갈리는 backend는 vLLM 문서가 graph와 호환되지 않는다고
            적으며, 그런 부분은 eager로 남기고 나머지만 묶는 piecewise capture가 답입니다. 조건이
            깨졌을 때 나타나는 capture failure의 증상과 복구는{" "}
            <Link to="/ai/launch-overhead-and-cpu-gpu-synchronization#capture-failure">
              다음 글
            </Link>
            이 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="Graph-compatible execution의 세 조건"
          items={[
            { term: "CPU 동기화 금지", description: ".item(), .cpu(), torch.cuda.synchronize()처럼 GPU 결과를 CPU가 기다리는 호출이 capture 안에 없어야 합니다.", example: "sampler에서 `if logits.max().item() > t:` 같은 판정은 capture 밖으로 뺍니다.", boundary: "capture 밖의 동기화는 허용되지만 매 step 부르면 pipeline을 비웁니다." },
            { term: "Dynamic control flow 금지", description: "CPU·GPU 값에 따라 kernel 수나 순서가 달라지는 분기는 한 경로만 기록됩니다.", example: "early exit, 길이에 따라 kernel을 고르는 backend 분기", boundary: "shape별로 graph를 따로 두면 shape 분기는 dispatch 쪽으로 옮겨 처리할 수 있습니다." },
            { term: "Graph pool 주소 보존", description: "capture 중 할당된 tensor는 private pool에 남아 replay 내내 같은 virtual address를 유지합니다.", example: "여러 size의 graph가 graph_pool_handle() 하나를 공유", boundary: "공유 pool의 graph는 capture 순서대로만 replay해야 중간 buffer가 겹치지 않습니다." },
          ]}
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="PyTorch · CUDA semantics, CUDA Graphs"
            citeKey={3}
            href="https://docs.pytorch.org/docs/stable/notes/cuda.html"
            type="code"
          >
            replay가 Python·C++·driver의 인자 준비와 dispatch를 모두 건너뛴다는 설명, capture 전
            side stream warmup, CPU 동기화와 dynamic control flow 금지, private memory pool과{" "}
            <code>graph_pool_handle()</code> 공유 조건은 이 문서의 서술을 따랐습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="implementation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          vLLM은 batch shape마다 그래프를 하나씩 capture하고 재사용합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실제 serving engine은 이 capture/replay 계약을 손으로 매번
            맞추지 않고 wrapper로 감쌉니다. vLLM의{" "}
            <code>CUDAGraphWrapper</code>는 forward context가 넘겨주는{" "}
            <code>batch_descriptor</code>(패딩된 batch shape)를 key로
            삼아, 처음 보는 shape면 capture하고 이미 capture한 shape면
            저장해둔 <code>torch.cuda.CUDAGraph</code>를 replay합니다.
          </p>
          <p>
            Debug 모드에서는 매 replay마다 capture 때 기록해 둔 input
            주소와 실제 주소를 비교해, static-address 제약이 깨지면
            즉시 assert로 잡습니다.
          </p>
        </div>
        <CudaGraphTimelineViz />
        <div className="not-prose my-8">
          <CodeViewButton
            label="CUDAGraphWrapper.__call__ — capture/replay 실제 구현"
            onClick={() => sidebar.open("cudagraph-wrapper-call", codeRefs["cudagraph-wrapper-call"])}
          />
        </div>
      </section>

      <section id="shape-padding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Batch 5는 capture size 8로 올라가고 세 행 분 계산을 버립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            dynamic shape problem은 replay가 shape를 바꿀 수 없다는 데서 옵니다. decode는 step마다
            batch에 든 요청 수가 달라지는데, executable graph는 capture 때의 kernel 수와 주소를
            그대로 돌리므로 그래프 하나로 모든 step을 처리할 수 없습니다. 모든 크기를 capture하면
            graph 수와 instantiate 시간, pool 메모리가 batch 상한만큼 늘어납니다.
          </p>
          <p>
            해법이 padding to captured shape입니다. capture size 목록을 정해 두고, 도착한 batch보다
            크거나 같은 가장 작은 size로 입력을 채워 그 graph를 replay합니다. 목록이 [1, 2, 4, 8,
            16, 32]이고 batch가 5이면 8로 올라가며, dummy 행 3개는 결과를 버립니다. 행 수 기준
            낭비는 (8 − 5)/8 = 37.5%입니다.
          </p>
          <p>
            vLLM 기본 목록은 훨씬 촘촘합니다. <code>compilation.py</code>는 [1, 2, 4] 뒤로 8부터
            248까지 8 단위, 256부터 상한까지 16 단위로 size를 만들고, 상한은 기본 512(data center
            Blackwell은 1024)입니다. 이 목록에서 최악은 9가 16으로 올라가는 43.75%이고, 65가
            72로 올라가면 9.7%로 줄어듭니다. size가 커질수록 padding 폭이 batch에 비해 작아지기
            때문입니다.
          </p>
          <p>
            낭비 비율이 그대로 step 시간 증가로 이어지지는 않습니다. decode가{" "}
            <Link to="/ai/prefill-decode-phase-dynamics#arithmetic-intensity">memory-bound</Link>
            인 구간에서는 padded 행도 같은 weight read를 나눠 쓰고 KV read는 길이 0이라 거의
            공짜입니다. 그래서 행 기준 40%를 버려도 step 시간은 몇 % 늘어나는 데 그치는 경우가
            흔하지만, batch가 커져 compute-bound로 넘어가면 낭비가 시간으로 그대로 나타납니다.
          </p>
          <p>
            상한보다 큰 batch는 graph 없이 eager나 piecewise로 실행됩니다. 목록을 촘촘히 할수록
            낭비는 줄지만 기동 때 size마다 forward 한 번과 instantiate를 치러야 하고,{" "}
            <code>cudagraph_num_of_warmups</code>만큼 warmup run이 앞에 붙습니다. size 60개에
            size당 100 ms면 기동이 6 초 늘어나는 셈이며, 이 준비 시간은{" "}
            <Link to="/ai/inference-runtime-anatomy#warmup">runtime warmup</Link>의 일부입니다.
          </p>
        </div>
        <ExplainedFormula
          question="도착한 batch가 얼마나 padding되고 그중 얼마를 버리나요?"
          idea="capture size 목록에서 batch보다 크거나 같은 가장 작은 값을 고르면 그 차이가 dummy 행 수이고, 그것을 padded size로 나누면 행 기준 낭비 비율입니다."
          formula={String.raw`S(b)=\min\{s\in\mathcal{C}: s\ge b\},\qquad w(b)=\frac{S(b)-b}{S(b)}`}
          annotatedFormula={String.raw`w(b)=\frac{\underbrace{S(b)-b}_{\text{dummy 행 수}}}{\underbrace{S(b)}_{\text{replay 하는 padded size}}},\qquad \underbrace{S(b)=\min\{s\in\mathcal{C}: s\ge b\}}_{\text{batch 이상인 가장 작은 capture size}}`}
          operations={[
            { expression: String.raw`\min\{s\in\mathcal{C}: s\ge b\}`, annotation: ["capture size 목록에서 b 이상인 값 중 가장 작은 것을 골라", "replay할 graph의 size 결정"] },
            { expression: String.raw`S(b)-b`, annotation: ["padded size에서 실제 batch를 빼", "결과를 버릴 dummy 행 수 계산"] },
            { expression: String.raw`\frac{S(b)-b}{S(b)}`, annotation: ["dummy 행 수를 padded size로 나눠", "행 기준 낭비 비율 확정"] },
          ]}
          terms={[
            { symbol: String.raw`\mathcal{C}`, name: "Capture size 목록", description: "기동 때 graph를 capture해 둔 batch size 집합입니다. vLLM의 cudagraph_capture_sizes입니다." },
            { symbol: String.raw`b`, name: "실제 batch", description: "이번 step에 scheduler가 고른 요청 수 또는 token 수입니다." },
            { symbol: String.raw`S(b)`, name: "Padded size", description: "b 이상인 가장 작은 capture size입니다. 이 size의 graph를 replay합니다." },
            { symbol: String.raw`w(b)`, name: "낭비 비율", description: "행 수 기준으로 버리는 계산의 비율입니다. 시간 기준 손실은 memory-bound 구간에서 이보다 작습니다." },
          ]}
          assumptions={["b가 목록의 최대값 이하라고 가정하며, 넘으면 graph 없이 실행됩니다.", "행 기준 비율이며 padded 행의 실제 시간 비용은 workload의 bound 종류에 따라 다릅니다."]}
          interpretation="C=[1,2,4,8,16,32]에서 b=5는 S=8, w=37.5%이고 b=17은 S=32, w=46.9%입니다. vLLM 기본 목록(8 단위)에서는 b=9가 S=16, w=43.75%로 최악이고 b=65는 S=72, w=9.7%입니다. 목록을 촘촘히 하면 w는 줄고 graph 수와 기동 시간은 늘어납니다."
        />
        <CaptureSizePaddingViz />
        <div className="not-prose my-8">
          <CitationBlock
            source="vLLM · vllm/config/compilation.py (CompilationConfig) 와 design/cuda_graphs"
            citeKey={4}
            href="https://github.com/vllm-project/vllm/blob/main/vllm/config/compilation.py"
            type="code"
          >
            <code>cudagraph_capture_sizes</code>의 기본 생성 규칙 [1, 2, 4] + range(8, 256, 8) +
            range(256, max + 1, 16), 상한 512(data center Blackwell 1024), 상한을 두는 이유가
            기동 시간과 메모리라는 설명, <code>cudagraph_num_of_warmups</code>의 의미는 이 파일의
            docstring을 따랐습니다. size당 100 ms 같은 기동 시간은 개념 예시이며 실측이 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="tradeoffs" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Dynamic shape는 graph 개수로, 캡처 범위는 유연성으로 대가를
          치릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Static-address 제약 때문에 batch size가 다르면 다른 graph가
            필요합니다. 매 요청마다 정확한 batch size로 capture하면 graph
            수가 무한히 늘어나므로, 실전에서는 batch size를{" "}
            <strong>미리 정한 몇 개 크기로 패딩</strong>해 그 크기들만
            capture합니다 — capture 개수는 줄지만, 실제 batch가 패딩
            크기보다 작으면 남는 자리만큼 연산을 낭비합니다.
          </p>
          <p>
            Capture 범위도 선택입니다. Forward 전체를 하나의 graph로
            묶으면(<code>FULL</code>) launch 절감은 최대지만, capture할
            수 없는 dynamic한 부분(예: attention backend의 조건 분기)이
            forward 어디에든 있으면 전체를 capture할 수 없습니다.
          </p>
          <p>
            일부만 나눠 capture하면(<code>PIECEWISE</code>) 그 다양한
            부분을 eager로 남기고 나머지만 graph로 묶어, 유연성과 절감을
            맞바꿉니다. 여러 graph를 capture할 때는 각 graph가 자기 GPU
            memory pool을 따로 잡는 대신 <strong>같은 pool을
            공유</strong>해, capture 개수가 늘어도 중복 할당을 줄입니다.
          </p>
          <p>
            graph가 launch 비용을 지운 뒤에도 CPU 쪽 병목은 남을 수 있습니다. scheduler와 sampler가
            step마다 쓰는 시간, <code>.item()</code> 하나가 pipeline을 비우는 순간, capture가
            실패해 eager로 떨어졌을 때의 증상은 다음 글{" "}
            <Link to="/ai/launch-overhead-and-cpu-gpu-synchronization">
              Launch overhead와 CPU–GPU 동기화
            </Link>
            가 이어서 다룹니다.
          </p>
        </div>
        <ContentBoundary article="cuda-graph-capture" />
      </section>
    </div>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ vllm: vllmTree }}
      projectMetas={{
        vllm: {
          id: "vllm",
          label: "vLLM · Python",
          badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
        },
      }}
    />
    </>
  );
}
