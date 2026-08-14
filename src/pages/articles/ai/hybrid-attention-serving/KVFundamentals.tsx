import ExplainedFormula from "@/components/ui/explained-formula";
import Math from "@/components/ui/math";
import KVHeadSharingViz from "./viz/KVHeadSharingViz";
import KVShapeComparisonViz from "./viz/KVShapeComparisonViz";

const SHAPE_TERMS = [
  {
    symbol: "T",
    name: "현재 sequence 길이",
    description:
      "지금까지 처리한 token 수입니다. Decode가 진행될수록 한 칸씩 늘어납니다.",
  },
  {
    symbol: "H_Q",
    name: "Query head 수",
    description:
      "현재 token이 서로 다른 관점으로 과거를 조회하는 head 수입니다.",
  },
  {
    symbol: "H_{KV}",
    name: "Key/value head 수",
    description: "과거 token마다 cache에 실제로 남기는 K/V head 수입니다.",
  },
  {
    symbol: "D_{head}",
    name: "Head dimension",
    description: "Head 하나가 token 하나를 표현하는 scalar 원소 수입니다.",
  },
] as const;

const BYTE_TERMS = [
  {
    symbol: "E_{KV}",
    name: "Layer당 KV 원소 수",
    description:
      "KV head 수와 head dimension을 곱한 token·tensor 하나의 폭입니다.",
  },
  {
    symbol: "B_{token}",
    name: "토큰당 KV cache byte",
    description:
      "과거 token 하나를 모든 KV layer에 보존할 때 필요한 memory입니다.",
  },
  {
    symbol: "L_{KV}",
    name: "KV를 저장하는 layer 수",
    description:
      "일반 attention model에서는 대체로 text transformer layer 수와 같습니다.",
  },
  {
    symbol: "H_{KV}",
    name: "KV head 수",
    description: "Q head 수가 아닙니다. GQA·MQA가 직접 줄이는 축입니다.",
  },
  {
    symbol: "D_{head}",
    name: "head dimension",
    description: "K 또는 V head 하나가 token마다 저장하는 원소 수입니다.",
  },
  {
    symbol: "N_{tensor}",
    name: "저장 tensor 수",
    description:
      "K와 V를 따로 저장하면 2입니다. 일부 구조는 K=V 공유나 latent cache를 사용합니다.",
  },
  {
    symbol: "b_{dtype}",
    name: "원소당 byte",
    description:
      "BF16·FP16은 2 byte, FP8은 보통 1 byte이며 scale·alignment 비용은 별도입니다.",
  },
] as const;

const MEMORY_LEVERS = [
  [
    "Weight quantization",
    "고정 weight memory를 줄여 KV pool에 남길 수 있는 총 예산을 바꿉니다.",
    "M_KV 변화",
  ],
  [
    "KV cache dtype",
    "K/V 원소 하나의 byte 수를 바꿉니다. Weight dtype과 별도 설정입니다.",
    "b_dtype 변화",
  ],
  [
    "GQA·head_dim",
    "과거 token마다 저장하는 K/V의 폭을 직접 줄입니다.",
    "H_KV · D_head 변화",
  ],
  [
    "Sliding allocator",
    "Local layer가 보존하는 과거 token의 수를 window로 제한합니다.",
    "보존 길이 변화",
  ],
] as const;

export default function KVFundamentals() {
  return (
    <section id="kv-shape" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Weight 크기보다 먼저, token 하나가 남기는 K/V의 모양을 계산합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Autoregressive decode는 지금까지 만든 문장을 조건으로 다음 token을
          하나 생성하고, 그 token을 문장 끝에 붙여 같은 과정을 반복합니다. 이때
          과거 token의 attention projection을 매번 다시 계산하면 문장이
          길어질수록 같은 계산을 계속 반복하게 됩니다. 그래서 runtime은 각
          layer에서 이미 계산한 Key와 Value를 KV cache에 저장한 뒤 다음 step에서
          다시 사용합니다. 반면 Query는{" "}
          <em>현재 token이 과거의 무엇을 찾는가</em>를 표현하므로 그 step에서
          만들고 사용하되 다음 step을 위해 저장하지 않습니다.
        </p>
        <p>
          따라서 parameter 수가 비슷한 30B model이라도 KV cache는 크게 다를 수
          있습니다. Weight quantization은 model weight가 차지하는 고정 memory를
          줄이지만, KV cache의 원소당 byte는 <code>kv_cache_dtype</code>가
          결정합니다. 이번 비교처럼 cache dtype과 병렬화 조건을 맞췄다면
          weight가 FP8이라는 사실보다 <code>num_key_value_heads</code>와{" "}
          <code>head_dim</code>이 먼저 capacity를 가릅니다.
        </p>
      </div>

      <div id="kv-shape-sharing" className="scroll-mt-20">
        <KVHeadSharingViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Tensor shape로 쓰면 공유되는 축이 더 분명합니다</h3>
        <p>
          여기서 <em>head</em>는 같은 입력을 서로 다른 learned projection으로
          바라보는 attention의 병렬 통로입니다. Sequence 길이를{" "}
          <Math>{"T"}</Math>, Q head 수를 <Math>{"H_Q"}</Math>, KV head 수를{" "}
          <Math>{"H_{KV}"}</Math>라고 두면 어떤 축을 공유하는지 tensor shape에서
          바로 볼 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="왜 GQA는 attention의 Q 계산을 유지하면서도 KV cache를 줄일 수 있을까요?"
        idea={
          <>
            각 token에는 Q·K·V가 모두 생기지만 decode 뒤에도 남는 것은 K와
            V입니다. 따라서 Q head 수는 유지하고 여러 Q head가 같은 K/V head를
            읽도록 만들면, 현재 조회 관점은 여러 개로 유지하면서 과거 기록의
            사본 수만 줄일 수 있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
Q &\in \mathbb{R}^{T \times H_Q \times D_{head}} \\
K,V &\in \mathbb{R}^{T \times H_{KV} \times D_{head}}
\end{aligned}`}
        terms={SHAPE_TERMS}
        assumptions={[
          "Batch와 tensor-parallel rank 축은 표시하지 않은 한 sequence의 logical shape입니다.",
          "K와 V의 head 수와 head dimension이 같다고 쓴 기본 attention 구조입니다.",
          "이 식은 tensor의 모양을 나타내며 실제 memory에는 dtype·alignment·block metadata가 더 필요합니다.",
        ]}
        interpretation="MHA는 H_Q=H_KV, GQA는 1<H_KV<H_Q, MQA는 H_KV=1입니다. Cache의 head 축은 H_Q가 아니라 H_KV이므로 같은 T와 D_head에서 H_KV를 8에서 2로 줄이면 K/V 원소 수도 4분의 1이 됩니다."
        title="Q와 K/V shape의 각 축"
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          MHA에서는 <Math>{"H_Q=H_{KV}"}</Math>이고, GQA에서는{" "}
          <Math>{"H_{KV}<H_Q"}</Math>입니다. Group 크기{" "}
          <Math>{"g=H_Q/H_{KV}"}</Math>만큼의 Q head가 같은 K/V head를 사용하며,
          MQA는 <Math>{"H_{KV}=1"}</Math>인 GQA의 끝점으로 볼 수 있습니다.
          Attention score 계산은 계속 각 Q head마다 이뤄지지만 cache에 남는
          K/V의 head 축만 작아지므로, decode 품질을 크게 잃지 않으면서 memory
          bandwidth와 capacity를 줄이는 절충이 됩니다.
        </p>

        <h3 id="paper-mqa" className="scroll-mt-20">
          MQA의 핵심 아이디어: decode의 memory bandwidth를 먼저 줄인다
        </h3>
        <p>
          <a href="https://arxiv.org/abs/1911.02150">
            Multi-Query Attention 논문
          </a>
          은 모든 Q head가 K/V head 하나를 공유하도록 만들었습니다. 문제의
          출발점은 attention FLOPs만이 아니었습니다. Batch가 작고 한 번에 token
          하나를 만드는 decode에서는 매 step마다 과거 K/V와 weight를 memory에서
          읽는 비용이 커지므로, cache의 폭과 memory traffic을 줄이면 generation
          속도가 좋아질 수 있다는 아이디어였습니다. 다만 하나의 K/V 표현을 모든
          Q head가 공유하므로 model과 task에 따라 MHA보다 품질이 떨어질 수
          있습니다.
        </p>
        <h3 id="paper-gqa" className="scroll-mt-20">
          GQA의 핵심 아이디어: MHA와 MQA 사이를 연속적인 설계 공간으로 만든다
        </h3>
        <p>
          <a href="https://arxiv.org/abs/2305.13245">
            Grouped-Query Attention 논문
          </a>
          은 K/V head를 하나로 고정하지 않고 Q head보다 적은 여러 group으로
          나눴습니다. 논문은 기존 MHA checkpoint의 K/V head를 group별로 묶어
          짧게 uptraining하는 방법도 함께 제안했고, 해당 실험 범위에서 MHA에
          가까운 품질과 MQA에 가까운 속도를 보고했습니다. 이것은 모든 모델에서
          같은 KV head 수가 최적이라는 주장이 아니라, 품질과 decode 비용 사이에
          조절 가능한 축을 만든 결과입니다.
        </p>

        <h3 id="kv-shape-formula" className="scroll-mt-20">
          토큰당 KV byte는 다섯 항의 곱입니다
        </h3>
        <p>
          모든 layer가 같은 KV shape를 쓰고 K와 V를 별도 tensor로 저장하는 가장
          단순한 model부터 보면 식은 다음과 같습니다.
        </p>
      </div>
      <ExplainedFormula
        question="과거 token 하나를 cache에 더 넣을 때 GPU memory는 몇 byte 늘어날까요?"
        idea={
          <>
            한 layer에서 K/V tensor의 head 수와 head당 원소 수를 세고, K와 V의
            tensor 수와 원소당 byte를 곱합니다. 모든 KV layer가 같은 shape라면
            마지막으로 layer 수를 곱하면 됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
E_{KV} &= H_{KV}D_{head} \\
B_{token} &= L_{KV}E_{KV}N_{tensor}b_{dtype}
\end{aligned}`}
        terms={BYTE_TERMS}
        assumptions={[
          "비교하는 model이 같은 tensor parallel·pipeline parallel 구성과 cache dtype을 사용합니다.",
          "Sliding-window block 회수, block padding, allocator metadata는 아직 반영하지 않은 dense-allocation 근사입니다.",
          "Layer별 KV head 수나 head_dim이 다르면 한 번 곱하지 않고 layer별 byte를 합산합니다.",
        ]}
        interpretation="Q head 수나 전체 hidden size가 아니라 실제로 cache에 남기는 KV head의 수와 폭을 세어야 합니다. 같은 KV 예산에서는 이 값의 역수 방향으로 보관 가능한 token 수가 늘어납니다."
        title="KV cache 식에서 각 항이 맡는 역할"
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          예를 들어 BF16 cache라면 K와 V가 각각 2 byte이므로 마지막 두 항은{" "}
          <code>2×2=4 byte</code>입니다. Qwen3.6-27B는 64개 layer 중 실제 KV를
          남기는 full-attention layer가 16개이므로 token당{" "}
          <code>16×4×256×2×2 = 65,536 byte</code>, 즉 64 KiB입니다. Muse
          Glimmer는 <code>52×2×128×2×2 = 53,248 byte</code>, 즉 52 KiB여서 같은
          dense-allocation 가정에서 Qwen attention KV의 81.25%입니다. Qwen의
          나머지 48개 DeltaNet layer는 별도의 fixed recurrent state를 사용하며,
          이 계산은 <a href="/ai/qwen36-hybrid-architecture#state-bytes">Qwen3.6 hybrid architecture 글</a>에서 분리합니다.
        </p>
      </div>

      <KVShapeComparisonViz />

      <div
        data-viz="kv-memory-levers"
        className="not-prose my-8 grid gap-3 sm:grid-cols-2"
      >
        {MEMORY_LEVERS.map(([title, description, effect], index) => (
          <article
            key={title}
            className="rounded-xl border border-border/70 bg-card p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-sm">{title}</strong>
              <span className="rounded-lg bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                {effect}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
            <span className="mt-4 block font-mono text-[10px] font-bold text-muted-foreground">
              0{index + 1}
            </span>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="kv-shape-runtime" className="scroll-mt-20">
          Gemma 4는 config와 runtime proxy를 분리해서 읽어야 합니다
        </h3>
        <p>
          위의 Gemma <code>60×16×256</code>은 이번 allocator 관측을 설명하기
          위한 uniform proxy입니다. 공식 text config는 더 세밀합니다. 50개
          sliding layer는 <code>KV head 16 · head_dim 256</code>을 쓰지만, 10개
          global layer는 <code>KV head 4 · global_head_dim 512</code>를 쓰고{" "}
          <code>attention_k_eq_v=true</code>도 선언합니다. 따라서 이 구조를 byte
          단위로 정확히 계산하려면 layer별 KV spec과 engine이 K=V 공유를 실제
          cache layout에 반영하는지까지 확인해야 합니다.
        </p>
        <p>
          이 구분이 중요한 이유는 config의 이론적 절감과 runtime의 실제 할당이
          다를 수 있기 때문입니다. 이번 실측에서는 Gemma의 local window 1,024가
          총 capacity에 뚜렷한 이점으로 나타나지 않았고, 16개의 local KV head와
          256차원 head가 만든 넓은 cache shape가 먼저 관측됐습니다. 반면 Muse는
          모든 text layer에서 KV head 2개와 head_dim 128을 사용하므로, 공격적인
          GQA가 capacity에 직접 드러났습니다.
        </p>

        <h3>
          Tensor parallel에서는 GPU 한 장이 실제로 저장하는 head 수를 봅니다
        </h3>
        <p>
          위 식은 model 전체 기준입니다. Tensor parallel에서는 KV head가 rank
          사이에 나뉘면 GPU 한 장의 <code>H_KV</code>가 줄지만, KV head 수가 TP
          size보다 작으면 일부 runtime은 head를 복제합니다. Pipeline parallel은
          layer를 나누므로 rank별 <code>L_KV</code>가 달라집니다. 그래서 서로
          다른 TP·PP 설정의 startup log를 비교할 때는 model config의 총 head
          수만 넣지 말고, engine이 만든 rank별 KV cache spec을 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
