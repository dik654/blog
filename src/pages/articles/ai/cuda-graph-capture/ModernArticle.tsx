import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { vllmTree } from "./fileTree";
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
            안에서만 수백 개 kernel이 CPU에서 GPU로 넘어갑니다. Batch가
            크고 kernel 하나의 실제 연산(exec) 시간이 길면 이 launch
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
            객체 안에 하나의 실행 그래프로 기록합니다. Context를 벗어나면
            capture가 끝나고, 이후 <code>graph.replay()</code>는 이 기록된
            그래프를 CPU 쪽 재해석 없이 GPU에 그대로 다시 실행합니다.
          </p>
          <p>
            여기서 지켜야 할 제약이 하나 있습니다 — replay는{" "}
            <strong>capture 시점에 고정된 GPU 메모리 주소</strong>를
            그대로 읽고 씁니다. Capture가 끝난 뒤 새 input tensor를
            만들어 넘겨도 graph는 그 tensor를 보지 않습니다. 대신 새
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
            일부만 나눠 capture하면(<code>PIECEWISE</code>) 그 다양한
            부분을 eager로 남기고 나머지만 graph로 묶어, 유연성과 절감을
            맞바꿉니다. 여러 graph를 capture할 때는 각 graph가 자기 GPU
            memory pool을 따로 잡는 대신 <strong>같은 pool을
            공유</strong>해, capture 개수가 늘어도 중복 할당을 줄입니다.
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
