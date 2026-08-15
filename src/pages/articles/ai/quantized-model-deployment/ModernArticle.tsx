import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { QuantizedDeploymentViz } from "../quantization/viz/ModernQuantizationViz";

export default function QuantizedModelDeploymentArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          27B라는 parameter 수를 GPU에 들어갈 byte 장부로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Model 크기를 볼 때 첫 직관은{" "}
            <strong>parameter count × parameter당 byte</strong>입니다. 27B
            BF16은 약 54 GB라서 48 GB 카드 한 장에 raw weights조차 들어가지
            않습니다. FP8이면 약 27 GB부터 시작하지만 mixed-dtype tensor·scale
            metadata·KV·workspace를 더해야 합니다.
          </p>
          <p>
            정확한 checkpoint 계산은{" "}
            <a href="/ai/model-vram-budgeting">모델 VRAM 계산</a>, hybrid
            KV·recurrent state는{" "}
            <a href="/ai/qwen36-hybrid-runtime">Qwen 하이브리드 런타임</a>에서
            더 깊게 다룹니다. 이 글은 quantized artifact를 release하는 공통
            절차를 세웁니다.
          </p>
        </div>
        <TermBreakdown
          title="VRAM을 서로 다른 성장축으로 분리"
          items={[
            {
              term: "Weight payload",
              description:
                "Request가 없어도 resident하는 checkpoint tensors입니다.",
              example: "27B×2 byte≈54 GB BF16 floor입니다.",
              boundary:
                "Optimizer state가 필요한 training과 inference를 구분합니다.",
            },
            {
              term: "Quantization metadata",
              description: "Scale·zero-point·block header·alignment입니다.",
              example: "Group size가 작아질수록 scale 수가 늘 수 있습니다.",
              boundary: "Nominal bit width 계산에서 빠지기 쉽습니다.",
            },
            {
              term: "Request state",
              description:
                "Context·batch·concurrency에 따라 생기는 KV·recurrent state입니다.",
              example: "Full attention KV는 token 수에 비례합니다.",
              boundary: "FP8 weights가 FP8 KV를 뜻하지 않습니다.",
            },
            {
              term: "Runtime overhead",
              description:
                "Activation·workspace·allocator reserve·CUDA graph입니다.",
              example: "Engine startup 뒤 peak를 실제로 측정합니다.",
              boundary: "Checkpoint file size에서 알 수 없습니다.",
            },
          ]}
        />
        <QuantizedDeploymentViz />
        <ContentBoundary article="quantized-model-deployment" />
      </section>
      <section id="weight-budget" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Parameter headline은 weight floor의 첫 항일 뿐입니다
        </h2>
        <ExplainedFormula
          question="27B model은 BF16·FP8·INT4에서 대략 몇 GB의 raw weights인가요?"
          idea={
            <p>
              Parameter 수에 element당 bit를 곱하고 8로 나눠 byte로 바꿉니다. 그
              다음 scale·mixed dtype 예외를 별도 항으로 더합니다.
            </p>
          }
          formula={String.raw`M_{W,\rm raw}=P\,b/8,\quad M_W=\sum_d P_d b_d/8+M_{\rm meta}`}
          annotatedFormula={String.raw`\begin{aligned}B_d&=\underbrace{P_d b_d}_{\text{dtype별 total bits}}\\R_d&=\underbrace{B_d/8}_{\text{bits를 bytes로}}\\M_{\rm raw}&=\underbrace{\sum_d R_d}_{\text{dtype payload 합산}}\\M_W&=\underbrace{M_{\rm raw}+M_{\rm meta}}_{\text{metadata 추가}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`P b`,
              annotation: [
                "parameter 개수마다 bit 폭을 적용해",
                "전체 bit 수 계산",
              ],
            },
            {
              expression: String.raw`P b/8`,
              annotation: ["8 bit가 1 byte이므로", "raw byte payload로 변환"],
            },
            {
              expression: String.raw`\sum_d P_d b_d/8`,
              annotation: [
                "dtype별 tensor payload를 계산한 뒤",
                "mixed checkpoint 전체를 합산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "P",
              name: "Parameter count",
              description: "Checkpoint tensor 원소의 합입니다.",
            },
            {
              symbol: "b",
              name: "Bits per element",
              description:
                "BF16=16, FP8=8, packed INT4=4 같은 nominal bit 폭입니다.",
            },
            {
              symbol: "d",
              name: "Dtype class",
              description: "FP8·BF16 exception 등 tensor 그룹입니다.",
            },
            {
              symbol: String.raw`M_{\rm meta}`,
              name: "Quantization metadata",
              description: "Scale·zero-point·packing overhead입니다.",
            },
          ]}
          assumptions={[
            "Decimal GB 감각 계산이며 GiB는 2^30으로 다시 나눕니다.",
            "Tied/shared weights는 checkpoint tensor ledger로 확인합니다.",
            "Runtime dequant buffer와 workspace는 이 항 밖입니다.",
          ]}
          interpretation="27B는 BF16 약 54 GB, FP8 약 27 GB, packed INT4 약 13.5 GB의 raw floor입니다. 실제 artifact는 tensor dtype histogram으로 다시 계산합니다."
        />
      </section>
      <section id="resident-ledger" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Weights와 context-dependent state를 따로 합산합니다
        </h2>
        <ExplainedFormula
          question="Weight-only quantization 뒤 peak VRAM이 4분의 1이 아닌 이유는 무엇인가요?"
          idea={
            <p>
              줄어든 weight 항에 scale metadata, activation, KV·recurrent state,
              workspace와 headroom을 다시 더합니다.
            </p>
          }
          formula={String.raw`M_{\rm peak}=M_{W,q}+M_{\rm meta}+M_{\rm act}+M_{\rm request}+M_{\rm workspace}+M_{\rm headroom}`}
          annotatedFormula={String.raw`\begin{aligned}M_{\rm peak}=&\underbrace{M_{W,q}+M_{\rm meta}}_{\text{artifact가 고정하는 resident model}}\\&+\underbrace{M_{\rm act}+M_{\rm request}}_{\substack{\text{batch·context·concurrency가 만드는}\\\text{activation·KV·recurrent state}}}\\&+\underbrace{M_{\rm workspace}+M_{\rm headroom}}_{\text{kernel·allocator 실행 여유}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`M_{W,q}+M_{\rm meta}`,
              annotation: [
                "low-bit weights와 필수 metadata를 더해",
                "model resident floor 계산",
              ],
            },
            {
              expression: String.raw`M_{\rm act}+M_{\rm request}`,
              annotation: [
                "실행 중 tensor와 request state를 더해",
                "workload-dependent memory 계산",
              ],
            },
            {
              expression: String.raw`M_{\rm workspace}+M_{\rm headroom}`,
              annotation: [
                "kernel scratch와 안전 여유를 포함해",
                "실제 admission 예산 완성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`M_{W,q}`,
              name: "Quantized weights",
              description: "Packed weight tensors입니다.",
            },
            {
              symbol: String.raw`M_{\rm request}`,
              name: "Request state",
              description: "Attention KV와 recurrent state 등입니다.",
            },
            {
              symbol: String.raw`M_{\rm workspace}`,
              name: "Workspace",
              description:
                "Kernel scratch·temporary buffer·CUDA graph reserve입니다.",
            },
            {
              symbol: String.raw`M_{\rm headroom}`,
              name: "Headroom",
              description: "Fragmentation과 runtime 변동을 위한 여유입니다.",
            },
          ]}
          assumptions={[
            "같은 batch·context·concurrency로 비교합니다.",
            "Offload가 있으면 host/device resident와 transfer를 분리합니다.",
            "Startup 이후 measured peak로 계산을 교정합니다.",
          ]}
          interpretation="Weights 14→3.5 GB여도 metadata .3, activation+state 7, workspace+headroom 3 GB이면 peak는 24→13.8 GB입니다."
        />
      </section>
      <section id="runtime-release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          압축률과 request speedup을 분리해 release합니다
        </h2>
        <ExplainedFormula
          question="Low-bit kernel이 2배 빨라도 전체가 왜 2배보다 느릴 수 있나요?"
          idea={
            <p>
              Baseline 중 실제로 교체된 구간 p만 줄고
              sampling·communication·fallback 시간은 그대로 남기 때문입니다.
            </p>
          }
          formula={String.raw`S_{\rm e2e}\le[(1-p)+p/S_q]^{-1}`}
          annotatedFormula={String.raw`\begin{aligned}T_{\rm keep}&=\underbrace{1-p}_{\text{그대로 남은 시간}}\\T_{\rm fast}&=\underbrace{p/S_q}_{\text{가속 뒤 대상 시간}}\\T_{\rm new}&=\underbrace{T_{\rm keep}+T_{\rm fast}}_{\text{새 total time}}\\S_{\rm e2e}&\le\underbrace{1/T_{\rm new}}_{\text{time의 역수}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-p`,
              annotation: ["가속되지 않은 baseline 비율을", "그대로 남김"],
            },
            {
              expression: String.raw`p/S_q`,
              annotation: [
                "가속 대상 시간만 speedup으로 나눠",
                "개선 뒤 시간 계산",
              ],
            },
            {
              expression: String.raw`[(1-p)+p/S_q]^{-1}`,
              annotation: [
                "개선 뒤 전체 시간을 합하고 역수로 바꿔",
                "end-to-end speedup 상한 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "p",
              name: "Accelerated fraction",
              description:
                "실제로 low-bit kernel로 대체된 baseline 시간 비율입니다.",
            },
            {
              symbol: String.raw`S_q`,
              name: "Kernel speedup",
              description: "같은 shape의 대상 operator 가속 배수입니다.",
            },
            {
              symbol: String.raw`S_{\rm e2e}`,
              name: "Request speedup",
              description: "전체 요청 latency의 최대 개선 배수입니다.",
            },
          ]}
          assumptions={[
            "동일한 output workload·quality 조건입니다.",
            "Overlap과 batch topology 변화를 단순화합니다.",
            "Fallback·dequant cost를 p와 measured trace에 반영합니다.",
          ]}
          interpretation="p=.6,Sq=2면 1/(.4+.3)=1.43배입니다. File size 4배 축소와 latency 4배 향상은 전혀 다른 주장입니다."
        />
        <div id="paper-transformer-engine-fp8" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA Transformer Engine · FP8 and FP4"
            citeKey={1}
            href="https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/examples/fp8_primer.html"
          >
            <strong>문제:</strong> Transformer의 low-precision 실행에서
            format·scale·hardware recipe를 연결함. <strong>기여:</strong>{" "}
            FP8·MXFP8·NVFP4 scaling granularity와 지원 조건을 문서화.{" "}
            <strong>전제:</strong> Transformer Engine 2.16과 대상 GPU.{" "}
            <strong>근거 범위:</strong> 지원 recipe·format·shape.{" "}
            <strong>과장 금지:</strong> Model label만으로 모든 operator가 해당
            kernel을 사용한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
