import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AttentionPatternViz from "./viz/AttentionPatternViz";
import KVCapacityViz from "./viz/KVCapacityViz";

const LAYERWISE_TERMS = [
  {
    symbol: "M_{KV}(T)",
    name: "길이 T 요청의 KV memory",
    description:
      "한 sequence가 모든 attention layer에 남기는 K/V의 총 byte입니다.",
  },
  {
    symbol: "r_l(T)",
    name: "l번째 layer의 보존 길이",
    description:
      "Global layer는 T, local layer는 allocator가 회수할 때 min(T,W_l)입니다.",
  },
  {
    symbol: "e_l",
    name: "l번째 layer의 KV 원소 폭",
    description: "KV head 수와 head dimension을 곱한 K 또는 V의 원소 수입니다.",
  },
  {
    symbol: "a_l",
    name: "l번째 layer의 저장 byte 계수",
    description: "K/V tensor 수와 dtype byte를 곱한 저장 계수입니다.",
  },
  {
    symbol: "c_l",
    name: "Layer별 token byte",
    description:
      "H_KV,l·D_l·N_tensor,l·b_l을 곱한 l번째 layer의 토큰당 KV byte입니다.",
  },
] as const;

export default function KVCache() {
  return (
    <section id="kv-cache" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Local attention은 읽는 범위를 줄이고, allocator는 보관하는 범위를
        줄입니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <a href="/cs/ai/kv-cache-fundamentals#kv-shape-formula">앞 글</a>의
          토큰당 KV byte 식은 모든 layer가 요청의 전체 길이를 보관한다는
          dense-allocation 근사였습니다. Sliding-window layer는 가장 최근{" "}
          <em>W</em>개 token만 참조하므로, runtime이 더 이상 쓰지 않는 block을
          회수한다면 해당 layer의 cache 길이는 <code>min(T, W)</code>에서
          포화됩니다. Global layer만 전체 <em>T</em>를 유지합니다.
        </p>
        <p>
          비교를 위한 첫 근사는 <code>Σ layer_cache_length</code>입니다. Muse는{" "}
          <code>39×min(T, 2048)+13×T</code>, Gemma는{" "}
          <code>50×min(T, 1024)+10×T</code>가 됩니다. 이 값은 byte가 아니라 “몇
          layer가 몇 token을 보존하는가”만 나타내는 topology proxy입니다.
        </p>
        <p>
          실제 byte는 각 layer의 보존 길이와 KV shape를 함께 곱해 합산합니다.
          Gemma처럼 local·global shape가 다르면 하나의 평균값으로 뭉치면 안 됩니다.
        </p>
      </div>
      <TermBreakdown
        title="읽기 범위와 memory 회수를 따로 정의합니다"
        description="Local attention을 쓴다는 사실만으로 오래된 KV block이 다른 요청에 돌아가지는 않습니다."
        items={[
          {
            term: "Global attention layer",
            description: "현재 token이 요청의 전체 prefix에 있는 K/V를 읽는 layer입니다.",
            example: "길이 T 요청이면 이 layer는 T개 token의 KV를 보존합니다.",
            boundary: "Global layer 수가 적어도 이 항은 context와 함께 계속 증가합니다.",
          },
          {
            term: "Sliding-window layer",
            description: "현재 위치에서 최근 W개 token만 attention 대상으로 사용하는 local layer입니다.",
            example: "T=8,192, W=2,048이면 계산의 visibility는 최근 2,048 token입니다.",
            boundary: "읽지 않는다는 규칙과 physical block을 반환한다는 규칙은 다릅니다.",
          },
          {
            term: "Hybrid KV allocator",
            description: "Layer type별 보존 규칙을 physical block 할당·회수로 실제 구현하는 runtime입니다.",
            example: "Window 밖 local blocks를 반환해 다른 sequence가 같은 pool을 사용하게 합니다.",
            boundary: "Grouping·page size·padding과 fallback path 때문에 config 식과 실제 byte가 달라질 수 있습니다.",
          },
        ]}
      />
      <AttentionPatternViz />
      <ExplainedFormula
        question="Local·global layer의 KV shape가 다를 때 요청 하나의 실제 KV memory를 어떻게 계산할까요?"
        idea={
          <>
            Layer마다 남겨 두는 token 수를 먼저 정한 뒤, 그 layer의 KV head·head
            dimension·K/V tensor 수·dtype byte를 곱합니다. 마지막으로 모든
            layer를 더하면 local window와 GQA를 같은 식에서 함께 반영할 수
            있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
c_l &= H_{KV,l}D_lN_{tensor,l}b_l \\
M_{KV}(T) &= \sum_{l=1}^{L}r_l(T)c_l \\
r_l(T) &= T && [\mathrm{G}] \\
r_l(T) &= \min(T,W_l) && [\mathrm{L_R}] \\
r_l(T) &= T && [\mathrm{L_F}]
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}e_l&=\underbrace{H_{KV,l}}_{\text{KV heads}}\underbrace{D_l}_{\text{head 폭}}\\a_l&=\underbrace{N_{tensor,l}}_{\text{K·V 수}}\underbrace{b_l}_{\text{원소 byte}}\\c_l&=\underbrace{e_l}_{\text{KV 원소 폭}}\underbrace{a_l}_{\text{저장 byte 계수}}\\[3pt]M_{KV}(T)&=\sum_{l=1}^{L}\underbrace{r_l(T)}_{\text{보존 tokens}}\underbrace{c_l}_{\text{token byte}}\\[3pt]r_l(T)&=\underbrace{T}_{\text{전체 prefix}}&&[\mathrm G]\\r_l(T)&=\underbrace{\min(T,W_l)}_{\text{최근 window}}&&[\mathrm{L_R}]\\r_l(T)&=\underbrace{T}_{\text{회수 없음}}&&[\mathrm{L_F}]\end{aligned}`}
        operations={[
          {
            expression: String.raw`H_{KV,l}D_lN_{tensor,l}b_l`,
            annotation: ["layer의 KV 원소 폭을 세고", "K/V tensor와 dtype byte를 반영"],
          },
          {
            expression: String.raw`r_l(T)c_l`,
            annotation: ["그 layer가 남긴 token 수에", "token 하나의 byte를 곱함"],
          },
          {
            expression: String.raw`\sum_{l=1}^{L}r_l(T)c_l`,
            annotation: ["shape와 보존 길이가 다른", "모든 layer의 byte를 합산"],
          },
          {
            expression: String.raw`\min(T,W_l)`,
            annotation: ["전체 길이와 window 중", "더 작은 보존 길이를 선택"],
          },
        ]}
        terms={LAYERWISE_TERMS}
        assumptions={[
          "한 request의 logical KV만 계산하며 block rounding·prefix sharing·fragmentation·speculative branch는 제외합니다.",
          "G는 global, L_R은 local block 회수, L_F는 local이지만 full 방식으로 할당한 경우입니다.",
          "Local attention kernel이 오래된 token을 읽지 않는 것과 allocator가 그 block을 실제로 반환하는 것을 구분합니다.",
          "Tensor parallel에서는 model 전체 H_KV,l이 아니라 rank에 배치되거나 복제된 실제 head 수를 사용합니다.",
        ]}
        interpretation="T가 window보다 커지면 local layer의 항은 더 늘지 않지만 global layer의 항은 계속 T에 비례합니다. 반대로 runtime이 local block을 회수하지 않으면 세 번째 경우가 적용되어 모든 layer가 T에 비례하고 hybrid attention의 이론적 memory 절감이 사라집니다."
        title="Layer별 KV memory 식의 역할"
      />
      <KVCapacityViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="spec-vllm-hybrid" className="scroll-mt-20">
          구조상 절감과 runtime 절감은 별개입니다
        </h3>
        <p>
          Model config에 <code>sliding_window</code>가 있다고 해서 모든 engine이
          자동으로 local KV를 회수하는 것은 아닙니다. vLLM의{" "}
          <a href="https://docs.vllm.ai/en/latest/design/hybrid_kv_cache_manager/">
            Hybrid KV Cache Manager 설계 문서
          </a>
          는 full layer에는 모든 token의 block을, sliding layer에는 최근
          window에 필요한 block만 배정한다고 설명합니다.
        </p>
        <p>
          2026년 10월 6일 확인한 이 문서는 commit 458e74를 기준으로 작성됐고,
          기능이 아직 바뀔 수 있다고 명시합니다. 따라서 아래 계산은 고정된
          runtime build의 cache spec과 함께 검증해야 합니다.
        </p>
        <p>
          서로 다른 layer type을 같은 physical page size로 묶으려면 group과
          padding이 필요합니다. 그래서 config 식과 allocator byte는 다를 수 있습니다.
          Hybrid allocator가 비활성화되거나 full-attention cache spec으로 합쳐지면,
          local attention을 계산해도 allocator는 모든 token의 block을 잡습니다.
          현재 <a href="https://docs.vllm.ai/en/latest/api/vllm/v1/kv_cache_interface/">공식 API source</a>의
          <code>FullAttentionSpec</code> 설명도 이 fallback 경계를 명시합니다.
        </p>
        <p>
          이번 Gemma 실측에서는 local window 1,024가 capacity를 눈에 띄게
          끌어올리지 못했습니다. 가장 보수적인 해석은 이 실행 경로에서 sliding
          layer가 dense/full 방식으로 할당됐다는 것입니다.
        </p>
        <p>
          이 상태는 config만 보고 확정할 수 없습니다. Runtime log의
          hybrid-manager 경고, 생성된 KV cache spec, context 길이에 따른 allocated
          block 기울기로 확인해야 합니다. Paged KV cache의 block 관리 자체는{" "}
          <a href="/cs/ai/vllm-paged-attention">PagedAttention·KV cache 글</a>에서
          이어서 설명합니다.
        </p>
        <CitationBlock
          type="paper"
          citeKey={1}
          source="Efficient Memory Management for Large Language Model Serving with PagedAttention"
          href="https://arxiv.org/abs/2309.06180"
        >
          <p><strong>문제:</strong> 동적 request KV의 연속 예약이 만드는 fragmentation과 중복 저장입니다.</p>
          <p><strong>핵심 아이디어:</strong> Logical block table로 non-contiguous physical KV blocks를 연결합니다.</p>
          <p><strong>중요 가정:</strong> 논문의 vLLM version·GPU·model·scheduler 조건입니다.</p>
          <p><strong>근거 범위:</strong> 보고된 memory waste·throughput·prefix/beam sharing 결과입니다.</p>
          <p><strong>일반화 금지:</strong> 임의 hybrid model의 local block 회수가 자동 지원된다는 뜻은 아닙니다.</p>
        </CitationBlock>
        <h3 id="paper-pagedattention" className="scroll-mt-20">
          PagedAttention은 연속 예약을 block table로 바꿉니다
        </h3>
        <p>
          <a href="https://arxiv.org/abs/2309.06180">PagedAttention 논문</a>은
          요청마다 최대 길이만큼 연속 KV memory를 미리 잡는 대신, token이 늘 때
          fixed-size physical block을 배정하고 logical block table로
          연결했습니다.
        </p>
        <p>
          이 방식은 fragmentation을 줄이고 한 prefix의 physical block을 여러
          sequence가 공유하게 합니다. PagedAttention 자체가 local layer의 보존
          정책을 알아내지는 않습니다. 어떤 layer가 어느 block을 계속 소유할지는
          hybrid cache spec과 allocator가 별도로 정합니다.
        </p>
      </div>
    </section>
  );
}
