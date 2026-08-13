import ExplainedFormula from "@/components/ui/explained-formula";
import PrefixHashViz from "./viz/PrefixHashViz";
import PrefixScopeViz from "./viz/PrefixScopeViz";

const HASH_TERMS = [
  {
    symbol: "H_i",
    name: "i번째 block hash",
    description: "현재 token block까지의 prefix identity를 나타내는 cache key입니다.",
  },
  {
    symbol: "H_{i-1}",
    name: "Parent block hash",
    description: "바로 앞 full block까지의 prefix identity로 token 순서와 ancestry를 연결합니다.",
  },
  {
    symbol: "x_i",
    name: "현재 block token IDs",
    description: "Tokenizer와 chat template를 거친 i번째 full block의 실제 token ID sequence입니다.",
  },
  {
    symbol: "e_i",
    name: "Extra identity",
    description: "LoRA ID·multimodal hash·cache salt처럼 같은 token이라도 KV 계산을 달라지게 하는 조건입니다.",
  },
] as const;

const SAVING_TERMS = [
  {
    symbol: "n_{prompt}",
    name: "Prompt token",
    description: "새 request가 원래 prefill해야 하는 전체 prompt 길이입니다.",
  },
  {
    symbol: "n_{hit}",
    name: "Cached full-block token",
    description: "Hash chain이 연속으로 일치해 prefill을 건너뛸 수 있는 prefix token 수입니다.",
  },
  {
    symbol: "n_{miss}",
    name: "새로 prefill할 token",
    description: "Prompt에서 cached prefix를 제외한 suffix token 수입니다.",
  },
] as const;

export default function PrefixCaching() {
  return (
    <section id="prefix-caching" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Automatic Prefix Caching은 같은 token prefix의 KV만 재사용합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          같은 model에서 동일한 prefix token은 causal attention의 같은 K·V를
          만듭니다. vLLM Automatic Prefix Caching(APC)은 이전 request가 계산한
          full KV block을 hash table에 남겨 두었다가, 새 request의 hash chain이
          같은 동안 block을 touch하고 prefill을 생략합니다. 긴 system prompt,
          반복 문서 QA, multi-turn conversation처럼 앞부분이 자주 반복되는 traffic에서
          TTFT를 줄일 수 있습니다.
        </p>
      </div>

      <PrefixHashViz />

      <ExplainedFormula
        question="같은 token block이 다른 위치나 다른 adapter의 KV와 잘못 섞이지 않게 cache key를 어떻게 만들까요?"
        idea={
          <>
            현재 block token만 hash하지 않고 parent hash를 함께 넣어 앞선 전체 prefix
            순서를 연결합니다. 같은 token이라도 KV를 바꾸는 adapter·multimodal input·
            tenant salt 같은 identity도 key에 포함합니다.
          </>
        }
        formula={String.raw`H_i=\operatorname{Hash}\!\left(H_{i-1},\;x_i,\;e_i\right)`}
        terms={HASH_TERMS}
        assumptions={[
          "같은 cache key는 같은 model weights·tokenizer/template·position semantics·KV computation을 뜻하도록 version boundary를 포함합니다.",
          "Hash collision이 실질적 보안·격리 위험이면 SHA-256 같은 stronger hash와 cache salt 비용을 함께 검토합니다.",
          "연속된 full block까지만 hit로 확정하며 partial 마지막 block은 다음 token과 합쳐질 수 있어 다시 계산할 수 있습니다.",
        ]}
        interpretation="현재 block token이 같아도 parent hash가 다르면 앞 문맥이 다르므로 hit가 아닙니다. LoRA나 image가 달라 KV가 바뀐다면 extras가 달라져야 하며, 그렇지 않으면 잘못된 state를 재사용합니다."
        title="Prefix block의 chained cache key"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="full-block-boundary" className="scroll-mt-20">
          사람이 보기 같은 문장보다 실제 token·template·block boundary가 중요합니다
        </h3>
        <p className="leading-8">
          공백·Unicode normalization·chat template·special token이 달라지면 token ID가
          바뀝니다. 같은 글자처럼 보여도 hash chain은 달라질 수 있습니다. 반대로
          긴 prefix가 같더라도 block size에 못 미치는 마지막 partial block은 완전히
          cache하지 못할 수 있으므로, “문장 재사용률”과 “cached token 비율”은 같은
          지표가 아닙니다.
        </p>
      </div>

      <PrefixScopeViz />

      <ExplainedFormula
        question="Prefix hit가 생기면 새 request가 실제로 prefill할 token은 몇 개 남을까요?"
        idea={
          <>
            Prompt 전체에서 연속으로 hit한 full-block prefix를 뺍니다. 이 절감은
            prompt prefill에만 적용되고 새 output token의 decode 횟수는 그대로입니다.
          </>
        }
        formula={String.raw`\begin{aligned}
n_{miss} &= n_{prompt}-n_{hit} \\
0 &\le n_{hit}\le n_{prompt}
\end{aligned}`}
        terms={SAVING_TERMS}
        assumptions={[
          "Hit block의 KV가 eviction되지 않았고 request가 scheduling될 때 touch·reference count 갱신에 성공합니다.",
          "n_hit은 첫 block부터 연속으로 일치한 prefix 길이이며 중간 block만 같은 경우를 더하지 않습니다.",
          "TTFT 절감은 token 수에 정확히 선형이지 않으므로 cached token histogram과 실제 prefill span을 함께 측정합니다.",
        ]}
        interpretation="4,096-token prompt에서 3,072 token이 full-block hit라면 1,024 token만 새로 prefill합니다. 이후 500-token output을 생성하는 decode 작업 500회가 사라지는 것은 아닙니다."
        title="APC가 줄이는 prefill 범위"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-radixattention" className="scroll-mt-20">
          SGLang·RadixAttention이 보여 주는 대안: prefix reuse를 radix tree로 직접 표현합니다
        </h3>
        <p className="leading-8">
          <a href="https://papers.nips.cc/paper_files/paper/2024/file/724be4472168f31ba1c9ac630f15dec8-Paper-Conference.pdf">
            SGLang: Efficient Execution of Structured Language Model Programs
          </a>
          은 multi-call LLM program에서 반복되는 prefix의 KV를 radix tree에 보관하고
          longest-prefix match와 cache-aware scheduling을 결합한 RadixAttention을
          제안했습니다. 공통 prefix가 tree path로 합쳐지므로 여러 branch의 공유
          관계를 명시적으로 표현합니다.
        </p>
        <p className="leading-8">
          이는 vLLM APC가 radix tree를 사용한다는 뜻이 아닙니다. vLLM은 chained
          block hash와 block pool을 이용해 tree를 별도로 유지하지 않고 cache hit를
          찾습니다. 두 연구를 함께 보면 prefix reuse라는 목적과 hash table·radix
          tree라는 data structure 선택, 그리고 cache-aware scheduling을 구분할 수
          있습니다.
        </p>

        <h3 id="prefix-operations" className="scroll-mt-20">
          운영에서는 hit rate보다 cached token·routing·TTFT를 함께 봅니다
        </h3>
        <ul className="leading-8">
          <li>Request hit 비율과 함께 prompt 중 몇 token이 hit했는지 histogram을 기록합니다.</li>
          <li>Replica별 cache가 독립이면 같은 prefix를 같은 replica로 보내는 routing policy와 imbalance를 함께 봅니다.</li>
          <li>Model·tokenizer·chat template·adapter·multimodal processor가 바뀌면 cache identity를 분리합니다.</li>
          <li>KV pressure가 높아 cached block이 빠르게 eviction되면 높은 논리적 반복률이 실제 TTFT 개선으로 이어지지 않을 수 있습니다.</li>
        </ul>
      </div>
    </section>
  );
}
