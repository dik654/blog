import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import BudgetPipelineViz from "./viz/BudgetPipelineViz";
import WeightVramViz from "./viz/WeightVramViz";

const WEIGHT_TERMS = [
  { symbol: "N_d", name: "dtype별 parameter 수", description: "Checkpoint 안에서 dtype d로 저장된 tensor 원소 수입니다." },
  { symbol: "B_d", name: "원소당 byte", description: "BF16은 2, FP8·INT8은 1, packed INT4 payload는 0.5 byte입니다." },
  { symbol: "M_W", name: "Weight payload", description: "dtype별 tensor payload를 더한 load 전후의 첫 memory floor입니다." },
] as const;

const STATE_TERMS = [
  { symbol: "M_{KV}(T)", name: "Attention KV", description: "과거 token별 key·value를 보관하므로 context T에 비례합니다." },
  { symbol: "M_R", name: "고정 request state", description: "DeltaNet·SSM·RNN처럼 token history 대신 request마다 고정 shape로 유지하는 state입니다." },
  { symbol: "R", name: "동시 active request 수", description: "Request마다 독립 state가 필요한 횟수입니다." },
  { symbol: "M_{work}", name: "Runtime overhead", description: "CUDA graph, kernel temporary, activation, allocator padding·fragmentation의 합입니다." },
] as const;

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>“27B니까 54GB”는 첫 줄 계산이지, GPU 적재 판정이 아닙니다</h2>
          <p className="text-lg leading-8">
            모델별 VRAM을 직관적으로 보는 출발점은 간단합니다. <strong>parameter 수×저장 byte</strong>가 가중치의 대략적인 바닥입니다. 그래서 BF16 1B는 약 2 GB, FP8 1B는 약 1 GB, packed INT4 1B는 약 0.5 GB입니다. 하지만 이 숫자에는 아직 KV cache·recurrent state·activation·CUDA graph·kernel workspace가 없습니다.
          </p>
          <p className="leading-8">
            더 중요한 점은 “FP8 모델”도 모든 tensor를 1 byte로 저장하지 않을 수 있다는 것입니다. Embedding·normalization·vision block이나 민감한 tensor를 BF16으로 남기고, scale tensor를 더할 수 있습니다. 따라서 이름의 dtype이 아니라 <strong>checkpoint index와 tensor dtype histogram</strong>을 읽어야 합니다.
          </p>
          <p className="leading-8">
            이 글은 parameter headline에서 바로 결론내리지 않습니다. 먼저 weight payload를 계산하고, 다음으로 request가 만드는 KV·고정 state를 더합니다. 마지막에 runtime이 실제 예약한 peak를 확인해 GPU에 넣을지 결정합니다.
          </p>
        </div>

        <BudgetPipelineViz />
        <ContentBoundary article="model-vram-budgeting" />
      </section>

      <section id="weight-residency" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>1단계 · Parameter는 개수이고, dtype이 그 개수의 byte 폭을 정합니다</h2>
          <p className="leading-8">
            <strong>Parameter</strong>는 학습된 scalar 원소 하나입니다. 27B는 약 270억 개라는 뜻이지 27GB라는 뜻이 아닙니다. 각 원소를 BF16으로 저장하면 2 byte, FP8이면 1 byte를 차지합니다. 서로 다른 dtype이 섞였다면 dtype별 원소 수를 따로 세어야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="Weight 계산에 등장하는 단위를 하나씩 고정합니다"
          items={[
            { term: "B · billion parameters", description: "모델 규모를 말할 때 쓰는 십진 단위입니다. 1B는 10억 원소입니다.", example: "27.781B BF16은 27.781×2≈55.56 GB입니다.", boundary: "GB와 GiB는 같은 단위가 아닙니다." },
            { term: "GB · decimal bytes", description: "저장소와 checkpoint 설명에서 흔한 10⁹ byte 단위입니다.", example: "55.56GB를 GPU 표기에 가까운 GiB로 바꾸면 약 51.75GiB입니다.", boundary: "숫자가 줄어도 실제 byte가 줄어든 것은 아닙니다." },
            { term: "GiB · binary bytes", description: "2³⁰ byte이며 GPU capacity·allocator 보고에서 흔히 사용합니다.", example: "48GiB GPU는 51.75GiB BF16 weight를 KV 이전부터 수용하지 못합니다.", boundary: "판매명 48GB와 runtime 48GiB 표기를 혼용하지 않습니다." },
            { term: "Quantization metadata", description: "낮은 bit payload를 복원하는 scale·zero-point·group 정보입니다.", example: "INT4 payload가 0.5 byte/parameter여도 group scale과 packing overhead가 더해집니다.", boundary: "P×0.5는 checkpoint 전체와 runtime peak의 정확한 값이 아닙니다." },
          ]}
        />

        <div id="weight-estimate" className="scroll-mt-20">
          <ExplainedFormula
            question="Mixed-dtype checkpoint의 weight payload는 어떻게 계산하나요?"
            idea={<>같은 dtype끼리 원소 수를 묶고 각 묶음에 해당 byte 폭을 곱한 뒤, 그 결과만 합칩니다.</>}
            formula={String.raw`M_W=\sum_d N_dB_d`}
            annotatedFormula={String.raw`\begin{aligned}
P_{FP8}
 &=\underbrace{N_{FP8}}_{\text{FP8 원소 수}}
   \times\underbrace{1\ \mathrm B}_{\text{원소 폭}}\\
P_{BF16}
 &=\underbrace{N_{BF16}}_{\text{BF16 원소 수}}
   \times\underbrace{2\ \mathrm B}_{\text{원소 폭}}\\
M_W
 &=\underbrace{P_{FP8}+P_{BF16}}_{\text{dtype별 payload 합산}}
\end{aligned}`}
            operations={[
              { expression: String.raw`N_{FP8}\times1`, annotation: ["FP8로 변환된 원소에만", "1 byte 폭을 적용"] },
              { expression: String.raw`N_{BF16}\times2`, annotation: ["남겨 둔 BF16 원소에는", "2 byte 폭을 유지"] },
              { expression: String.raw`(N_{FP8}\times1)+(N_{BF16}\times2)`, annotation: ["dtype별 payload를 합쳐", "weight memory floor 계산"] },
            ]}
            terms={WEIGHT_TERMS}
            assumptions={["Tensor payload 기준이며 file header·alignment·runtime conversion은 별도입니다.", "Parameter count는 checkpoint metadata 또는 모든 tensor shape의 곱에서 구합니다."]}
            interpretation="Headline×단일 dtype은 빠른 상한·하한 감각에 유용하지만, 실제 admission에는 dtype histogram으로 계산한 payload를 사용합니다."
          />
        </div>

        <div id="dtype-ledger" className="scroll-mt-20">
          <WeightVramViz />
        </div>
      </section>

      <section id="runtime-state" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>2단계 · 가중치가 들어간 뒤에는 request가 만드는 state를 더합니다</h2>
          <p className="leading-8">
            <strong>KV cache</strong>는 attention layer가 과거 token의 key와 value를 다시 쓰지 않도록 보관한 tensor입니다. Context가 길어지면 token 축이 늘어납니다. 반면 DeltaNet·SSM·RNN 계열의 <strong>recurrent state</strong>는 과거를 고정 shape에 압축하므로 길이보다 active request 수에 따라 늘어납니다.
          </p>
          <p className="leading-8">
            따라서 hybrid model에서는 “layer 수×KV” 하나로 계산하면 안 됩니다. KV를 실제로 저장하는 attention layer만 token 비례식에 넣고, recurrent layer의 state는 request당 고정 항으로 따로 더합니다. <Link to="/ai/qwen36-hybrid-architecture">Qwen3.6-27B 아키텍처 글</Link>은 이 분리가 왜 48 DeltaNet·16 Attention에서 생기는지 설명합니다.
          </p>
        </div>

        <div id="kv-state" className="scroll-mt-20">
          <ExplainedFormula
            question="동시 request와 context가 바뀔 때 known memory floor는 어떻게 자라나요?"
            idea={<>Weight는 한 번 resident하고, token-growing KV와 request당 고정 state는 각 request의 길이와 개수에 맞춰 더합니다.</>}
            formula={String.raw`M_{known}=M_W+\sum_{r=1}^{R}\left(M_{KV}(T_r)+M_R\right)`}
            annotatedFormula={String.raw`\begin{aligned}
m_r
 &=\underbrace{M_{KV}(T_r)}_{\text{길이에 따라 증가}}
  +\underbrace{M_R}_{\text{request당 고정}}\\
M_{req}
 &=\underbrace{\sum_{r=1}^{R}m_r}_{\text{active requests 합산}}\\
M_{known}
 &=\underbrace{M_W}_{\text{공유 weights}}+M_{req}
\end{aligned}`}
            operations={[
              { expression: String.raw`M_{KV}(T_r)`, annotation: ["request r의 token 길이를 넣어", "attention history 비용 계산"] },
              { expression: String.raw`M_{KV}(T_r)+M_R`, annotation: ["길이 비례 cache와 고정 state를", "같은 request 소유량으로 결합"] },
              { expression: String.raw`\sum_{r=1}^{R}(\cdots)`, annotation: ["동시에 살아 있는 request별 state를", "서로 공유하지 않고 모두 합산"] },
              { expression: String.raw`M_W+\sum_{r=1}^{R}(\cdots)`, annotation: ["공통 model weights 위에", "request별 memory를 적재"] },
            ]}
            terms={STATE_TERMS}
            assumptions={["Tensor parallel·prefix sharing·offload가 없는 logical device-local 계산입니다.", "Request마다 다른 T를 허용하고 recurrent state shape는 동일하다고 가정합니다."]}
            interpretation="한 request의 최대 context와 여러 짧은 request의 concurrency는 같은 문제가 아닙니다. Scheduler admission은 실제 T₁…Tᴿ 분포로 계산해야 합니다."
          />
        </div>

        <div id="known-floor" className="scroll-mt-20">
          <ExplainedFormula
            question="Known floor가 device보다 작으면 바로 안전하다고 말할 수 있나요?"
            idea={<>아닙니다. Shape로 계산하지 못한 workspace와 안전 여유가 들어갈 자리를 capacity에서 먼저 남겨야 합니다.</>}
            formula={String.raw`M_{peak}=M_{known}+M_{work}\le C_{GPU}-M_{headroom}`}
            annotatedFormula={String.raw`\begin{aligned}
M_{peak}
 &=\underbrace{M_{known}}_{\text{계산한 바닥}}
  +\underbrace{M_{work}}_{\text{실측 overhead}}\\
C_{use}
 &=\underbrace{C_{GPU}-M_{headroom}}_{\text{안전 여유를 먼저 제외}}\\
&\underbrace{M_{peak}\le C_{use}}_{\text{admit 또는 reject 판정}}
\end{aligned}`}
            operations={[
              { expression: String.raw`M_{known}+M_{work}`, annotation: ["논리적으로 계산한 바닥과", "runtime에서 측정한 overhead를 합산"] },
              { expression: String.raw`C_{GPU}-M_{headroom}`, annotation: ["device 전체를 다 쓰지 않고", "운영 안전 여유를 먼저 예약"] },
              { expression: String.raw`M_{peak}\le C_{GPU}-M_{headroom}`, annotation: ["예상 peak와 usable capacity를 비교해", "profile을 승인하거나 거절"] },
            ]}
            terms={STATE_TERMS}
            assumptions={["같은 model revision·engine·kernel·batch profile에서 warmup 후 peak를 측정합니다.", "OOM 한 번이 아니라 반복 실행과 fragmentation 조건을 포함합니다."]}
            interpretation="Known floor가 44.89GiB이고 48GiB GPU가 있어도 3.11GiB 안에 모든 workspace가 들어간다는 증거는 없습니다. Load 성공과 production admission을 구분합니다."
          />
        </div>
      </section>

      <section id="admission-logs" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>3단계 · 기동 로그는 나중에 memory 미지수를 되살리는 receipt입니다</h2>
          <p className="leading-8">
            OOM 뒤에 model 이름과 마지막 오류만 남으면 dtype upcast, fallback kernel, 생성된 KV pool, CUDA graph capture가 얼마를 예약했는지 알 수 없습니다. 첫 140줄 요약은 빠른 확인용으로 남기되, 원본 stdout·stderr는 rotation된 별도 파일이나 journal에 보존해야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="한 줄에 나열하지 않고 판정 순서대로 네 receipt를 남깁니다"
          items={[
            { term: "Identity receipt", description: "Model ID·exact revision·checkpoint format·quantization config·text-only/vision mode를 줄마다 남깁니다.", example: "Qwen/Qwen3.6-27B-FP8 · commit · safetensors · language-model-only=false", boundary: "같은 이름이라도 conversion revision이 다르면 같은 artifact가 아닙니다." },
            { term: "Geometry receipt", description: "Dtype별 parameter 수·loaded weight bytes·attention layer·KV heads·head dim·KV dtype·recurrent state shape를 기록합니다.", example: "weights 28.75GiB · KV 64KiB/token · Delta core 144MiB/request", boundary: "FP8 weights 한 줄로 KV dtype을 대신하지 않습니다." },
            { term: "Runtime receipt", description: "Max length·KV pool·graph capture sizes·backend/fallback·TP/PP·load 전후 reserved와 peak를 기록합니다.", example: "128K logical floor와 warmup peak의 차이로 runtime overhead를 확인합니다.", boundary: "nvidia-smi 한 시점 값을 KV 하나의 비용으로 부르지 않습니다." },
            { term: "Retention · redaction receipt", description: "첫 140줄과 원본 로그의 보관 위치·rotation·기한·redaction test를 함께 고정합니다.", example: "Summary 140 lines + size/time rotation + secret filter + incident retention", boundary: "Access token·prompt secret·signed URL을 원본 보존 명목으로 남기지 않습니다." },
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Qwen3.6-27B를 48GiB 한 장에 놓는 적용 예</h3>
          <p className="leading-8">
            공식 BF16 index의 55,562,855,904 bytes는 51.75GiB라 weight만으로 한 장을 넘습니다. 공식 mixed-FP8 checkpoint는 FP8 약 24.699B와 BF16 약 3.084B를 합쳐 tensor payload가 약 28.75GiB입니다. 여기에 BF16 attention KV가 32K/128K/262K에서 약 2/8/16GiB, Delta core state가 request당 약 144MiB 들어갑니다. Known floor는 약 30.89/36.89/44.89GiB지만, 마지막 값은 workspace를 넣기 전이라 262K 안전 운용을 보장하지 않습니다.
          </p>
        </div>

        <div id="paper-safetensors" className="scroll-mt-20">
          <CitationBlock source="Hugging Face · Safetensors documentation" citeKey={1} type="paper" href="https://huggingface.co/docs/safetensors/index">
            <p><strong>문제:</strong> Tensor shape·dtype·payload를 안전하고 빠르게 읽는 checkpoint format이 필요합니다.</p>
            <p><strong>핵심 기여:</strong> Header와 contiguous tensor data를 분리해 tensor metadata와 byte 범위를 확인할 수 있게 합니다.</p>
            <p><strong>전제:</strong> 해당 safetensors artifact와 metadata가 실제 runtime에 로드되는 revision과 같아야 합니다.</p>
            <p><strong>근거 범위:</strong> Checkpoint dtype·shape 장부를 읽는 format 근거입니다.</p>
            <p><strong>비주장:</strong> File payload가 GPU resident peak·KV·workspace까지 포함한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-qwen-weights" className="scroll-mt-20">
          <CitationBlock source="Qwen3.6-27B · official BF16 safetensors index" citeKey={2} type="code" href="https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/model.safetensors.index.json">
            <p><strong>문제:</strong> 27B라는 반올림 이름을 실제 tensor payload로 바꿉니다.</p>
            <p><strong>핵심 기여:</strong> total_size 55,562,855,904 bytes를 공개해 BF16 weight floor를 직접 검산하게 합니다.</p>
            <p><strong>전제:</strong> 공식 BF16 checkpoint의 해당 revision입니다.</p>
            <p><strong>근거 범위:</strong> Weight payload 하한입니다.</p>
            <p><strong>비주장:</strong> Runtime peak나 FP8 artifact의 크기가 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-vllm-memory" className="scroll-mt-20">
          <CitationBlock source="vLLM · Hybrid KV Cache Manager" citeKey={3} type="paper" href="https://docs.vllm.ai/en/stable/design/hybrid_kv_cache_manager/">
            <p><strong>문제:</strong> 서로 다른 cache type이 섞인 model의 blocks를 한 allocator에서 관리해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Cache groups·page size·padding과 hybrid allocation의 설계 제약을 문서화합니다.</p>
            <p><strong>전제:</strong> 사용한 vLLM revision과 model cache spec입니다.</p>
            <p><strong>근거 범위:</strong> Logical model shape와 physical allocation이 달라지는 이유입니다.</p>
            <p><strong>비주장:</strong> 모든 hybrid model이 같은 physical overhead를 갖는다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
