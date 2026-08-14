import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import Math from "@/components/ui/math";
import CacheStateViz from "./viz/CacheStateViz";
import HybridScheduleViz from "./viz/HybridScheduleViz";
import ServingPathViz from "./viz/ServingPathViz";

const KV_TERMS = [
  {
    symbol: "L_{attn}",
    name: "Full-attention layer 수",
    description: "과거 token의 K/V를 실제로 저장하는 layer만 셉니다. Qwen3.6-27B에서는 64가 아니라 16입니다.",
  },
  {
    symbol: "T",
    name: "현재 context token 수",
    description: "Text와 vision encoder가 만든 image·video token을 합쳐 attention이 읽는 sequence 길이입니다.",
  },
  {
    symbol: "H_{KV}",
    name: "KV head 수",
    description: "과거 token마다 저장하는 K/V 사본 수입니다. Q head 24가 아니라 GQA의 KV head 4를 사용합니다.",
  },
  {
    symbol: "d_h",
    name: "Attention head dimension",
    description: "K 또는 V head 하나의 원소 수이며 공식 config에서는 256입니다.",
  },
  {
    symbol: "B_{KV}",
    name: "KV 원소당 byte",
    description: "BF16·FP16이면 2 byte입니다. KV quantization을 쓰면 이 값과 scale metadata가 달라집니다.",
  },
] as const;

const DELTA_TERMS = [
  {
    symbol: "S_{t-1},S_t",
    name: "이전·현재 recurrent state",
    description: "한 head의 key→value association을 담는 고정 shape matrix입니다. 과거 token 열을 그대로 모은 tensor가 아닙니다.",
  },
  {
    symbol: String.raw`\gamma_t`,
    name: "Retention gate",
    description: "이전 state를 이번 step에 얼마나 남길지 정합니다. Reference code에서는 exp(g) 형태의 head별 decay가 먼저 곱해집니다.",
  },
  {
    symbol: "k_t",
    name: "현재 key",
    description: "State에서 어느 association을 읽고 고칠지 가리키는 주소 역할의 vector입니다.",
  },
  {
    symbol: "v_t",
    name: "현재 value",
    description: "현재 key와 연결해 state에 기록하려는 내용 vector입니다.",
  },
  {
    symbol: String.raw`\beta_t`,
    name: "Correction strength",
    description: "현재 prediction error를 얼마나 강하게 반영할지 정하는 0과 1 사이 gate입니다.",
  },
  {
    symbol: "q_t",
    name: "현재 query",
    description: "업데이트된 state에서 현재 token에 필요한 value를 읽는 vector입니다.",
  },
] as const;

const STATE_TERMS = [
  {
    symbol: "L_\Delta",
    name: "DeltaNet layer 수",
    description: "공식 layer_types에서 linear_attention으로 표시된 48개 layer입니다.",
  },
  {
    symbol: "H_S",
    name: "State head 수",
    description: "Reference kernel이 value head와 맞춰 사용하는 48개 state head입니다. 16개 QK head는 1:3으로 반복됩니다.",
  },
  {
    symbol: "d_k,d_v",
    name: "State matrix의 두 축",
    description: "각 head에서 key와 value 방향의 길이이며 둘 다 128입니다.",
  },
  {
    symbol: "B_S",
    name: "State 원소당 byte",
    description: "Config의 mamba_ssm_dtype과 reference recurrence가 FP32를 사용하므로 core state 계산에서는 4 byte입니다.",
  },
] as const;

const RUNTIME_TERMS = [
  { symbol: "M_W", name: "Model weights", description: "27B dense text backbone과 vision encoder weight의 고정 memory입니다." },
  { symbol: "M_{KV}(T)", name: "Attention KV", description: "16개 attention layer에서 context T에 비례해 늘어나는 memory입니다." },
  { symbol: "M_\Delta", name: "DeltaNet states", description: "48개 recurrent matrix와 짧은 convolution history를 request마다 유지합니다." },
  { symbol: "M_{work}", name: "Runtime workspace", description: "Attention·Delta kernel temporary, CUDA graph, allocator metadata와 padding을 포함합니다." },
] as const;

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-6">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Qwen3.6-27B는 64층짜리 Transformer가 아니라 두 memory를 번갈아 쓰는 hybrid decoder입니다</h2>
          <p className="text-lg leading-8">
            먼저 이름부터 바로잡아야 합니다. 이 글에서 다루는 공식 공개 모델은 <strong>Qwen3.6-27B</strong>입니다. 2026년 8월 15일 기준 공식 Qwen 자료에서 같은 사양의 “Qwen3.8-27B”는 확인되지 않습니다. Qwen3.6-27B는 27B dense model이고, text·image·video 입력과 native 262,144-token context를 지원합니다. Model card는 별도 확장 설정에서 1,010,000 token까지의 범위도 안내하지만, native와 extended context는 같은 보장이 아닙니다.
          </p>
          <p className="leading-8">
            이 구조를 이해하는 첫 질문은 “layer가 몇 개인가?”가 아니라 <strong>각 layer가 과거를 어떤 형태로 들고 있는가?</strong>입니다. 64개 layer 중 48개 Gated DeltaNet layer는 과거를 고정 크기 recurrent state로 압축합니다. 나머지 16개 Gated Attention layer만 과거 token별 K/V를 보존합니다. 그래서 전체 layer 수 64를 KV 공식에 그대로 넣으면 긴 context memory를 네 배로 과대계산합니다. 반대로 DeltaNet state를 0으로 놓으면 active request마다 드는 고정 memory를 빠뜨립니다.
          </p>
          <p className="leading-8">
            아래에서는 먼저 token·attention·KV cache를 복습합니다. 그 다음 DeltaNet이 “과거를 저장하지 않는다”가 아니라 “다른 shape로 압축한다”는 뜻을 delta rule로 확인합니다. 두 memory를 이해한 뒤에야 hybrid cache manager, prefill·decode, RoPE·FFN·MTP·vision token이 한 request 안에서 어떻게 만나는지 조합합니다.
          </p>
        </div>

        <HybridScheduleViz />

        <TermBreakdown
          title="전체 구조를 보기 전에, 네 용어만 한 줄씩 고정합니다"
          description="처음부터 GQA·MTP·mRoPE를 한 문장에 쌓지 않습니다. 지금은 과거를 보존하는 두 방식과 layer의 역할만 구분합니다."
          items={[
            {
              term: "Token",
              description: "모델이 sequence에서 한 위치로 처리하는 단위입니다. Text tokenizer가 만든 token뿐 아니라 vision encoder가 만든 image·video token도 language model의 context budget에 들어갑니다.",
              example: "Text 30K와 visual token 2K가 함께 들어가면 attention이 읽는 T는 대략 32K입니다.",
              boundary: "Token 수는 글자 수·단어 수·원본 image pixel 수와 같지 않습니다.",
            },
            {
              term: "Mixer layer",
              description: "현재 hidden state에 sequence 정보를 섞는 sublayer입니다. Qwen3.6에서는 이 자리에 Gated DeltaNet 또는 Gated Attention이 오고, 그 뒤에 FFN과 residual update가 이어집니다.",
              example: "한 hybrid block은 DeltaNet→FFN을 세 번 거친 뒤 Attention→FFN을 한 번 거칩니다.",
              boundary: "64 layer가 64개의 full attention이라는 뜻은 아닙니다.",
            },
            {
              term: "Attention memory",
              description: "과거 token마다 만든 key와 value를 sequence 축에 그대로 붙여 두고 현재 query가 다시 조회하는 explicit token memory입니다.",
              example: "Context가 4K에서 8K로 늘면 같은 shape·dtype에서 KV memory도 두 배가 됩니다.",
              boundary: "FlashAttention은 이 softmax attention을 효율적으로 계산하는 kernel이지 고정 recurrent state로 바꾸는 DeltaNet이 아닙니다.",
            },
            {
              term: "Recurrent state",
              description: "지금까지의 입력을 매 token마다 같은 shape의 matrix에 갱신한 상태입니다. 다음 token은 과거 K/V 전체 대신 이 state를 읽습니다.",
              example: "4K를 읽었을 때도 262K를 읽었을 때도 core state matrix의 shape는 같습니다.",
              boundary: "고정 크기라는 말은 정보 손실이 없다는 뜻이 아닙니다. 서로 다른 과거가 같은 state에서 간섭할 수 있습니다.",
            },
          ]}
        />

        <ContentBoundary article="qwen36-hybrid-architecture" />
      </section>

      <section id="attention-kv" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Attention: 현재 query가 과거 token의 key와 value를 직접 다시 읽습니다</h2>
          <p className="leading-8">
            Standard attention에서 현재 token은 query <Math>{"q_t"}</Math>를 만들고, 과거 각 token은 key와 value를 남깁니다. Query와 key의 내적은 “현재 위치가 이 과거 위치를 얼마나 읽을까?”라는 score를 만들고, softmax weight로 value를 합칩니다. Autoregressive decode에서 과거 K/V를 다시 계산하지 않기 위해 cache에 보존하므로 sequence 길이 <Math>{"T"}</Math>가 늘 때 memory도 함께 늘어납니다. Attention의 Q·K·V 자체가 낯설다면 <Link to="/ai/attention-theory">Attention 정본</Link>의 score와 value 합부터 읽으면 됩니다.
          </p>
        </div>

        <TermBreakdown
          title="GQA는 query의 수와 저장하는 K/V의 수를 분리합니다"
          items={[
            {
              term: "Query head · 24개",
              description: "현재 token이 과거를 바라보는 24개의 learned 관점입니다. Query는 현재 step에 계산해 쓰고, 다음 decode step을 위해 token history로 저장하지 않습니다.",
              example: "24개 Q head가 각기 score를 계산해도 cache 폭을 직접 정하는 수는 아닙니다.",
              boundary: "Q head가 많다는 사실만으로 KV cache가 같은 수만큼 늘지는 않습니다.",
            },
            {
              term: "KV head · 4개",
              description: "과거 token마다 실제로 저장하는 key/value 표현의 사본 수입니다. 여러 Q head가 같은 KV head를 공유합니다.",
              example: "24÷4=6이므로 여섯 Q head가 한 K/V group을 공유하는 GQA입니다.",
              boundary: "공유가 memory를 줄이지만 모든 model·task에서 MHA와 정확히 같은 품질을 보장하지 않습니다.",
            },
            {
              term: "Head dimension · 256",
              description: "Attention K 또는 V head 하나가 token마다 저장하는 scalar 원소 수입니다.",
              example: "한 layer의 한 token은 K 4×256개와 V 4×256개 원소를 남깁니다.",
              boundary: "DeltaNet의 key/value head dimension 128과 섞어 계산하지 않습니다.",
            },
          ]}
        />

        <div id="kv-bytes" className="scroll-mt-20">
          <ExplainedFormula
            question="Qwen3.6-27B에서 context token 하나가 늘 때 logical BF16 attention KV는 몇 byte 늘어날까요?"
            idea={<>KV를 저장하는 16개 layer만 세고, 각 layer에서 K와 V 두 tensor, KV head 4개, head당 256개 원소, BF16 2 byte를 곱합니다. 48개 DeltaNet layer는 이 식에 들어가지 않습니다.</>}
            formula={String.raw`M_{KV}(T)=L_{attn}\times 2\times T\times H_{KV}\times d_h\times B_{KV}`}
            annotatedFormula={String.raw`\begin{aligned}
M_{KV}(T)
  &=\underbrace{16}_{\text{KV layer}}\times\underbrace{2}_{\text{K와 V}}\\
  &\quad\times\underbrace{T}_{\text{token 열 수}}\\
  &\quad\times\underbrace{(4\times256)}_{\text{KV head 폭}}\times\underbrace{2\ \mathrm{byte}}_{\text{BF16}}\\
  &=64\ \mathrm{KiB}\times T
\end{aligned}`}
            operations={[
              { expression: String.raw`16`, annotation: ["64개 전체가 아니라", "K/V를 남기는 layer만 선택"] },
              { expression: String.raw`2\times T`, annotation: ["K와 V 두 기록을", "과거 token마다 보존"] },
              { expression: String.raw`4\times256`, annotation: ["한 token에서 저장하는", "KV head의 실제 폭"] },
              { expression: String.raw`16\times2\times4\times256\times2`, annotation: ["token 하나가 추가될 때", "65,536 byte = 64 KiB"] },
            ]}
            terms={KV_TERMS}
            assumptions={[
              "Batch 1, prefix sharing 없음, block padding·allocator metadata를 제외한 unsharded logical cache입니다.",
              "16개 attention layer가 모두 공식 config의 KV head 4·head dimension 256을 사용합니다.",
              "Tensor parallel을 적용하면 rank별 physical allocation은 shard 방식에 따라 달라지지만 전체 logical bytes는 이 식으로 검산합니다.",
            ]}
            interpretation="Token당 65,536 byte, 즉 64 KiB입니다. 32,768 token이면 2 GiB, 131,072 token이면 8 GiB, native 262,144 token이면 16 GiB입니다. 64 attention layer로 잘못 계산하면 각각 네 배가 됩니다."
            title="Attention KV의 각 곱이 세는 대상"
          />
        </div>

        <CacheStateViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            이 숫자는 “Qwen3.6을 262K로 띄우면 무조건 GPU 16 GiB만 더 든다”는 운영 보장이 아닙니다. Batch와 beam이 늘면 request 축이 곱해지고, allocator block의 빈칸·prefix cache·CUDA graph와 temporary activation이 더해집니다. 반대로 tensor parallel로 KV head를 나누면 device 한 장이 부담하는 몫은 줄 수 있습니다. 그러므로 model config의 logical shape는 startup log와 memory snapshot을 검산하는 기준이지 physical VRAM의 최종 답이 아닙니다.
          </p>
        </div>

        <div id="paper-qwen36-config" className="scroll-mt-20">
          <CitationBlock source="Qwen · Qwen3.6-27B model card" citeKey={1} href="https://huggingface.co/Qwen/Qwen3.6-27B">
            <p><strong>문제:</strong> 공개 checkpoint의 architecture·modalities·context와 권장 runtime 범위를 식별합니다.</p>
            <p><strong>핵심 기여:</strong> 27B dense, 64 layer, 16×(3 Gated DeltaNet + 1 Gated Attention), native 262,144와 extended 1,010,000 context, multi-step MTP를 명시합니다.</p>
            <p><strong>전제:</strong> 해당 model repository의 공개 revision과 model card를 2026-08-15에 확인한 snapshot입니다.</p>
            <p><strong>근거 범위:</strong> Model identity와 공개 configuration·지원 범위를 확인하는 공식 근거입니다.</p>
            <p><strong>비주장:</strong> 모든 runtime에서 1M 품질·latency·VRAM을 보장하거나 “Qwen3.8-27B”라는 별도 model의 존재를 증명하지 않습니다.</p>
          </CitationBlock>
          <CitationBlock source="Qwen3.6-27B · official config.json" citeKey={2} type="code" href="https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/config.json">
            <p><strong>문제:</strong> Marketing 이름이 아니라 layer_types·head shape·dtype을 기계적으로 읽어야 합니다.</p>
            <p><strong>핵심 기여:</strong> 48 linear_attention과 16 full_attention, Q 24/KV 4/head 256, linear QK 16/V 48/head 128, FP32 SSM state, FFN 17,408과 partial RoPE 0.25를 고정합니다.</p>
            <p><strong>전제:</strong> Config와 실제 weight/runtime implementation revision이 호환된다는 조건입니다.</p>
            <p><strong>근거 범위:</strong> 이 글의 shape와 logical byte 계산에 쓰는 직접 artifact입니다.</p>
            <p><strong>비주장:</strong> Config만으로 kernel workspace·allocator padding·TP shard·실제 throughput을 알 수는 없습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="deltanet-state" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>DeltaNet: 과거 K/V를 없애는 것이 아니라 고정 matrix에 읽고 고쳐 씁니다</h2>
          <p className="leading-8">
            단순한 linear attention은 key와 value의 outer product를 state에 계속 더해 current query로 읽을 수 있습니다. 그러나 같은 key 방향에 새 value가 들어와도 과거 association이 남아 있으면 충돌합니다. Delta rule은 먼저 현재 state가 그 key에서 예측하는 value를 읽고, 실제 value와의 오차만 다시 씁니다. Gating은 오래된 state를 얼마나 남길지와 correction을 얼마나 적용할지 조절합니다.
          </p>
          <p className="leading-8">
            여기서 <em>fast weight</em>는 학습된 model parameter가 아닙니다. Model weight는 checkpoint에서 고정되지만 recurrent state <Math>{"S_t"}</Math>는 request의 token을 읽을 때마다 바뀝니다. “Inference 중 빠르게 갱신되는 association matrix”라는 뜻으로 fast-weight memory라고 부를 수 있습니다. 사람의 요약 기억에 비유할 수는 있지만, 실제로 문장 의미를 사람이 하듯 요약한다는 주장은 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="Delta update 한 step은 읽기·오차·수정의 세 동작입니다"
          items={[
            {
              term: "Retention · 먼저 남길 양",
              description: "이전 state에 γₜ를 곱해 오래된 association을 head별로 감쇠합니다.",
              example: "γₜ=0.9이면 이번 update 전에 이전 state의 각 성분을 90% 남깁니다.",
              boundary: "한 step의 gate가 0.9여도 많은 step을 곱하면 정보는 크게 줄 수 있습니다.",
            },
            {
              term: "Prediction error · 이미 아는 양",
              description: "감쇠한 state를 현재 key로 읽어 예측 value를 만들고 실제 vₜ에서 뺍니다.",
              example: "State가 key k에서 3을 예측하고 실제 value가 5라면 correction 대상은 2입니다.",
              boundary: "v 전체를 매번 더하는 단순 누적과 다릅니다.",
            },
            {
              term: "Delta write · 틀린 만큼만 수정",
              description: "오차에 βₜ를 곱하고 현재 key 방향의 outer product로 state에 다시 씁니다.",
              example: "βₜ=0.25, error=2라면 우선 0.5만 correction content로 사용합니다.",
              boundary: "여러 key가 비슷한 방향이면 수정이 다른 association에도 영향을 줄 수 있습니다.",
            },
          ]}
        />

        <div id="delta-update" className="scroll-mt-20">
          <ExplainedFormula
            question="왜 Gated DeltaNet은 새 value를 그대로 더하지 않고, 기존 prediction을 뺀 오차를 쓰나요?"
            idea={<>같은 key 방향에 이미 기록된 value를 먼저 읽습니다. 실제 value와의 차이만 쓰면 이미 맞는 association을 중복 누적하지 않고 틀린 부분을 targeted correction할 수 있습니다.</>}
            formula={String.raw`\bar S_t=\gamma_tS_{t-1},\quad e_t=v_t-\bar S_t^\top k_t,\quad S_t=\bar S_t+k_t(\beta_te_t)^\top,\quad y_t=S_t^\top q_t`}
            annotatedFormula={String.raw`\begin{aligned}
\bar S_t&=\underbrace{\gamma_tS_{t-1}}_{\substack{\text{오래된 state를}\text{먼저 감쇠}}}\\
e_t&=\underbrace{v_t}_{\text{새로 쓸 내용}}-\underbrace{\bar S_t^\top k_t}_{\substack{\text{현재 key에서}\text{이미 예측한 내용}}}\\
S_t&=\underbrace{\bar S_t}_{\text{남긴 state}}+\underbrace{k_t(\beta_te_t)^\top}_{\substack{\text{key 방향에}\text{오차만 correction}}}\\
y_t&=\underbrace{S_t^\top q_t}_{\substack{\text{현재 query로}\text{갱신 state를 읽기}}}
\end{aligned}`}
            operations={[
              { expression: String.raw`\gamma_tS_{t-1}`, annotation: ["이전 association을", "head별 gate만큼 보존"] },
              { expression: String.raw`v_t-\bar S_t^\top k_t`, annotation: ["실제 value에서 기존 예측을 빼", "중복 대신 prediction error 계산"] },
              { expression: String.raw`k_t(\beta_te_t)^\top`, annotation: ["오차를 key 방향에만", "outer product로 다시 기록"] },
              { expression: String.raw`S_t^\top q_t`, annotation: ["현재 query가 필요한", "value 방향을 state에서 읽음"] },
            ]}
            terms={DELTA_TERMS}
            assumptions={[
              "한 request·한 head의 직관식이며 실제 tensor에는 batch와 48 state head가 있습니다.",
              "Reference implementation은 q/k L2 normalization, causal convolution과 output gate를 더 사용합니다.",
              "이 recurrence는 decode form입니다. Training·prefill에서는 같은 결과를 내는 chunkwise parallel form을 사용합니다.",
            ]}
            interpretation="State shape은 T와 함께 늘지 않아 decode의 sequence-length 축 memory가 O(1)입니다. 그러나 과거 token 원본을 보존하지 않으므로 exact UUID·needle retrieval에서 full attention과 다른 trade-off가 생깁니다."
            title="Delta rule에서 각 연산이 맡는 의도"
          />
        </div>

        <div id="state-bytes" className="scroll-mt-20">
          <ExplainedFormula
            question="Qwen3.6-27B의 48개 DeltaNet core recurrent matrix는 request 하나당 몇 byte인가요?"
            idea={<>Reference kernel은 16개 QK head를 value head 비율 1:3으로 반복해 48개 state head를 만들고, 각 head에 128×128 FP32 matrix를 둡니다. 이 shape를 48개 linear-attention layer에 곱합니다.</>}
            formula={String.raw`M_\Delta=L_\Delta\times H_S\times d_k\times d_v\times B_S`}
            annotatedFormula={String.raw`\begin{aligned}
M_\Delta
  &=\underbrace{48}_{\Delta\text{ layers}}\times\underbrace{48}_{\text{state heads}}\\
  &\quad\times\underbrace{(128\times128)}_{\text{key}\times\text{value matrix}}\\
  &\quad\times\underbrace{4\ \mathrm{byte}}_{\text{FP32 state}}\\
  &=144\ \mathrm{MiB}
\end{aligned}`}
            operations={[
              { expression: String.raw`48\times48`, annotation: ["모든 DeltaNet layer와", "각 layer의 state head를 셈"] },
              { expression: String.raw`128\times128`, annotation: ["key 주소와 value 내용을", "matrix association으로 결합"] },
              { expression: String.raw`37{,}748{,}736\times4\ \mathrm{byte}`, annotation: ["core state 원소 수에", "FP32 byte 폭을 적용"] },
            ]}
            terms={STATE_TERMS}
            assumptions={[
              "Hugging Face reference implementation의 repeated head layout과 FP32 recurrent state를 기준으로 합니다.",
              "짧은 causal-convolution history는 별도이며 BF16 logical shape만 약 3.75 MiB입니다.",
              "vLLM·SGLang의 packed layout, TP partition, alignment와 graph capture는 physical allocation을 바꿀 수 있습니다.",
            ]}
            interpretation="Context가 4K에서 262K로 늘어도 core recurrent matrix는 144 MiB로 같습니다. 대신 active request가 10개면 logical core state도 대략 열 배가 되므로, fixed per-request state는 concurrency admission에서 중요합니다."
            title="고정 state의 shape와 dtype"
          />
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            이 계산은 DeltaNet memory가 공짜라는 뜻이 아닙니다. 144 MiB는 context와 무관하지만 request 수에는 비례합니다. 또 single-token decode는 같은 matrix를 읽고 다시 쓰므로 sequence 길이 기준 O(1)이어도 matrix dimension의 FLOPs와 memory bandwidth는 남습니다. “O(1)”은 token history T에 대한 표현이지 절대 비용 1을 뜻하지 않습니다.
          </p>
        </div>

        <div id="paper-gated-deltanet" className="scroll-mt-20">
          <CitationBlock source="Yang et al. · Gated Delta Networks" citeKey={3} href="https://arxiv.org/abs/2412.06464">
            <p><strong>문제:</strong> Linear attention의 고정 state 효율을 유지하면서 associative recall·long-context 성능과 parallel training 효율을 개선합니다.</p>
            <p><strong>핵심 기여:</strong> Adaptive forgetting gate와 targeted delta update를 결합하고 hardware-efficient parallel algorithm과 hybrid architecture를 제시합니다.</p>
            <p><strong>전제:</strong> 논문의 model scale·training data·benchmark·kernel과 gated delta recurrence 조건입니다.</p>
            <p><strong>근거 범위:</strong> Gating과 delta rule이 상보적이라는 method·evaluation 근거입니다.</p>
            <p><strong>비주장:</strong> Qwen3.6의 3:1 비율이 보편적으로 최적이거나 fixed state가 모든 exact retrieval에서 full attention을 대체한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="hybrid-runtime" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Hybrid runtime: request 하나가 token-growing KV와 fixed recurrent state를 동시에 소유합니다</h2>
          <p className="leading-8">
            Qwen이 DeltaNet만 쓰지 않는 이유는 압축의 대가 때문입니다. DeltaNet은 대부분의 sequence mixing을 고정 state로 처리하지만, 특정 과거 token의 정확한 표현을 다시 찾아야 하는 작업에서는 explicit K/V가 유리합니다. 그래서 3개의 DeltaNet 뒤에 full attention을 배치해 저렴한 연속 state와 direct token retrieval을 함께 사용합니다. 이 역할 분담은 architecture 직관이지 layer별 neuron이 인간의 “요약 기억”과 “기록 검색”으로 깔끔히 분리됐다는 해석 증거는 아닙니다.
          </p>
        </div>

        <ExplainedFormula
          question="Hybrid model의 request memory는 어떤 덩어리로 나눠야 하나요?"
          idea={<>Weight처럼 모든 request가 공유하는 고정 예산과, context에 따라 커지는 attention KV, request마다 고정되는 DeltaNet state, 실행 shape에 따라 변하는 workspace를 분리합니다.</>}
          formula={String.raw`M_{runtime}(T,N)=M_W+N\!\left[M_{KV}(T)+M_\Delta\right]+M_{vision}+M_{work}`}
          annotatedFormula={String.raw`\begin{aligned}
M_{runtime}
  &=\underbrace{M_W}_{\text{공유 weights}}\\
  &\quad+\underbrace{N\,M_{KV}(T)}_{\text{request}\times\text{token 길이}}\\
  &\quad+\underbrace{N\,M_\Delta}_{\text{request당 fixed state}}\\
  &\quad+\underbrace{M_{vision}+M_{work}}_{\text{encoder와 workspace}}
\end{aligned}`}
          operations={[
            { expression: String.raw`N\,M_{KV}(T)`, annotation: ["active request 각각의", "길이가 다른 KV를 합산"] },
            { expression: String.raw`N\,M_\Delta`, annotation: ["context 길이와 무관해도", "request마다 state 하나를 예약"] },
            { expression: String.raw`M_W+M_{vision}+M_{work}`, annotation: ["cache 밖의 공유·temporary 예산을", "admission 전에 따로 남김"] },
          ]}
          terms={RUNTIME_TERMS}
          assumptions={[
            "동일 device group에서 active request N개를 서빙하는 logical decomposition입니다.",
            "Prefix sharing·offload·preemption·beam branching과 TP/PP shard는 별도 정책으로 반영합니다.",
            "Vision token은 KV의 T에도 들어갈 수 있고 vision encoder activation은 M_vision/workspace에도 영향을 줍니다.",
          ]}
          interpretation="긴 request 하나는 KV가 지배할 수 있고, 짧은 request를 매우 많이 동시 처리하면 fixed recurrent state가 admission을 제한할 수 있습니다. Weight size 하나로 concurrency를 결정할 수 없습니다."
          title="Hybrid request memory의 성장 축"
        />

        <div id="prefill-decode" className="scroll-mt-20">
          <ServingPathViz />
        </div>

        <TermBreakdown
          title="Prefill과 decode는 같은 recurrence를 다른 실행 형태로 계산합니다"
          items={[
            {
              term: "Prefill",
              description: "Prompt의 많은 token을 한 번에 처리하는 구간입니다. Full attention layer는 token pair를 계산하고, DeltaNet은 recurrence를 chunk·scan 형태로 재배열해 GPU 병렬성을 얻습니다.",
              example: "262K prompt를 16K chunk로 나누더라도 각 chunk 뒤의 KV와 recurrent state는 같은 request generation에 이어 붙여야 합니다.",
              boundary: "DeltaNet이라고 prefill cost가 0이 아니며 fast kernel이 없으면 reference fallback이 느리고 memory를 더 쓸 수 있습니다.",
            },
            {
              term: "Decode",
              description: "새 token 하나를 만들 때 attention layer는 지금까지의 KV를 읽고 한 칸을 추가하며, DeltaNet layer는 fixed state를 한 step update합니다.",
              example: "T가 길어질수록 attention read는 길어지지만 DeltaNet recurrence의 state shape는 변하지 않습니다.",
              boundary: "DeltaNet decode가 T에 O(1)이어도 state matrix read/write와 FFN weight traffic은 남습니다.",
            },
            {
              term: "Hybrid cache manager",
              description: "크기와 성장 규칙이 다른 attention KV block과 recurrent/convolution state를 request lifecycle·rollback·preemption에 맞춰 함께 관리합니다.",
              example: "Speculative token이 reject되면 attention KV와 recurrent state가 같은 accepted prefix로 돌아가야 합니다.",
              boundary: "KV block manager만 구현하고 recurrent state를 별도 commit하지 않으면 request state가 어긋납니다.",
            },
          ]}
        />

        <div id="paper-vllm-hybrid" className="scroll-mt-20">
          <CitationBlock source="vLLM · Hybrid KV Cache Manager design" citeKey={4} type="code" href="https://docs.vllm.ai/en/stable/design/hybrid_kv_cache_manager/">
            <p><strong>문제:</strong> Attention KV와 Mamba·linear-attention state처럼 서로 다른 cache spec을 같은 block allocator에서 관리합니다.</p>
            <p><strong>핵심 기여:</strong> Cache group의 physical memory per block을 맞추고 layer grouping·block size 조정으로 hybrid allocation을 구성합니다.</p>
            <p><strong>전제:</strong> 확인한 vLLM stable design과 지원 model·cache spec·runtime revision입니다.</p>
            <p><strong>근거 범위:</strong> Hybrid cache group의 allocator 설계와 padding trade-off를 설명하는 공식 문서입니다.</p>
            <p><strong>비주장:</strong> 모든 model에서 padding waste가 0이거나 이 글의 logical 64 KiB·144 MiB가 device allocation과 그대로 같다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="model-stack" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>나머지 stack: 위치·feature 변환·미래 token 후보·visual token은 서로 다른 문제를 풉니다</h2>
          <p className="leading-8">
            Hybrid memory가 긴 context의 저장·sequence mixing 비용을 줄인다고 해서 위치 표현, token 내부 feature 변환, generation throughput, multimodal input 문제가 함께 해결되는 것은 아닙니다. 같은 64-layer residual stream 위에서 RoPE, FFN, RMSNorm, MTP와 vision encoder가 각각 다른 역할을 맡습니다.
          </p>
        </div>

        <TermBreakdown
          title="서로 다른 역할을 한 문장에 섞지 않고 하나씩 놓습니다"
          items={[
            {
              term: "Partial multimodal RoPE",
              description: "Full-attention head 256차원 중 25%, 즉 64차원에 rotary position을 적용합니다. mRoPE section은 temporal·height·width 위치를 나눠 image·video token의 축을 보존합니다.",
              example: "Text는 sequence 위치를, image patch는 세로·가로 좌표를 같은 rotary machinery의 다른 section으로 전달합니다.",
              boundary: "RoPE가 262K token의 memory cost를 줄이지는 않습니다. 위치 표현과 cache 비용은 다른 문제입니다.",
            },
            {
              term: "RMSNorm · residual stream",
              description: "각 sublayer 입력의 RMS scale을 안정화하고, mixer·FFN output을 5,120차원 residual stream에 더해 64층을 통과시킵니다.",
              example: "Layer는 이전 representation을 통째로 버리지 않고 xₗ₊₁=xₗ+f(xₗ) 형태로 update를 보탭니다.",
              boundary: "Residual이 정보 보존을 자동 보장하거나 각 layer의 기능을 독립적으로 만들지는 않습니다.",
            },
            {
              term: "FFN · 5,120 → 17,408 → 5,120",
              description: "Attention·DeltaNet이 token 사이를 섞은 뒤, 각 token 위치에서 feature를 넓혀 변환하고 다시 hidden width로 내립니다. SiLU 기반 gated path가 사용됩니다.",
              example: "Sequence memory shape와 무관하게 모든 64개 layer의 token representation을 feature 방향으로 변환합니다.",
              boundary: "Qwen3.6-27B는 dense model이라 token별 expert router가 있는 MoE와 다릅니다.",
            },
            {
              term: "MTP · Multi-Token Prediction",
              description: "Training에서 다음 token 하나뿐 아니라 여러 미래 step의 prediction signal을 사용하고, serving에서는 speculative candidate를 제안하는 데 연결할 수 있습니다.",
              example: "MTP가 여러 후보를 내면 target model이 accepted prefix를 검증한 뒤 cache와 recurrent state를 commit합니다.",
              boundary: "Config의 mtp_num_hidden_layers=1은 보조 module 깊이이며 실제 acceptance length·speedup을 보장하지 않습니다.",
            },
            {
              term: "Vision encoder · visual tokens",
              description: "Image·video를 patch와 temporal chunk로 처리해 5,120차원 language-model token space에 맞는 visual embedding을 만듭니다.",
              example: "Image가 만든 visual token도 text prompt와 interleave되어 attention context T를 소비합니다.",
              boundary: "262K가 text token 전용 별도 예산이 아니며 raw pixel 수를 token 수로 그대로 넣지 않습니다.",
            },
          ]}
        />

        <div id="paper-transformers-qwen35" className="scroll-mt-20">
          <CitationBlock source="Hugging Face Transformers · Qwen3.5/Qwen3.6 reference" citeKey={5} type="code" href="https://huggingface.co/docs/transformers/model_doc/qwen3_5">
            <p><strong>문제:</strong> Qwen3.6 checkpoint를 실제 cache·kernel·multimodal inputs로 실행할 reference path가 필요합니다.</p>
            <p><strong>핵심 기여:</strong> layer_types 기반 3:1 hybrid, Gated DeltaNet fast kernel/fallback, multimodal RoPE와 text-only·conditional-generation class 경계를 문서화합니다.</p>
            <p><strong>전제:</strong> 사용한 Transformers revision, optional causal_conv1d·FLA/Hub kernel, GPU architecture와 dtype을 함께 기록해야 합니다.</p>
            <p><strong>근거 범위:</strong> Reference implementation의 state shape·chunk/recurrent path와 지원 API를 확인합니다.</p>
            <p><strong>비주장:</strong> Reference PyTorch fallback benchmark가 vLLM·SGLang·모든 GPU의 production throughput을 대표하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="release-check" className="scroll-mt-20">
          <TermBreakdown
            title="배포 계산은 config 표에서 끝내지 않고 네 receipt로 닫습니다"
            items={[
              {
                term: "Architecture receipt",
                description: "Model revision, layer_types 64개, attention·linear head shape, dtype, RoPE·vision config와 MTP module을 한 artifact로 보존합니다.",
                example: "48 linear + 16 full, KV 4×256, state 48×128×128가 build에서 실제 인식되는지 startup dump로 대조합니다.",
                boundary: "Model 이름만 같은 quantized conversion이 원 config shape를 보존한다고 가정하지 않습니다.",
              },
              {
                term: "Memory receipt",
                description: "Weight, attention KV, recurrent·conv state, workspace, CUDA graph를 요청 길이·concurrency별로 따로 측정합니다.",
                example: "32K/128K/262K에서 logical KV 2/8/16 GiB와 device peak·reserved bytes의 차이를 기록합니다.",
                boundary: "nvidia-smi 한 시점의 used memory를 KV만의 값으로 부르지 않습니다.",
              },
              {
                term: "Kernel receipt",
                description: "Prefill과 decode를 나눠 active attention backend와 DeltaNet chunk/recurrent kernel, fallback 여부를 기록합니다.",
                example: "같은 output fixture에서 fast kernel on/off의 TTFT·tokens/s·peak memory를 비교합니다.",
                boundary: "단일 layer microbenchmark를 end-to-end speedup으로 확대하지 않습니다.",
              },
              {
                term: "Quality·rollback receipt",
                description: "Native와 extended context, text와 multimodal, exact retrieval과 summarization, MTP on/off를 같은 dataset revision에서 비교합니다.",
                example: "Needle 위치·video token 수·accepted MTP length와 error를 함께 기록하고 threshold 미달이면 native length·non-MTP profile로 rollback합니다.",
                boundary: "262K를 load할 수 있다는 사실과 262K에서 필요한 정보를 정확히 회수한다는 사실은 다릅니다.",
              },
            ]}
          />
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            이 글 다음에는 <Link to="/ai/hybrid-attention-serving">KV cache와 serving capacity 비교</Link>에서 실제 allocator·concurrency log를 검산하고, <Link to="/ai/vllm-paged-attention">PagedAttention</Link>에서 token-growing KV block을, <Link to="/ai/vllm-spec-decode">Speculative decoding</Link>에서 MTP 후보의 verify·commit 경계를 더 깊게 볼 수 있습니다. 이제 “64층이니 KV도 64층분”이라는 한 줄 계산 대신, model config에서 <code>layer_types</code>를 먼저 나누고 request state를 두 덩어리로 보는 것이 출발점입니다.
          </p>
        </div>
      </section>
    </article>
  );
}
