import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
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

const HIT_TERMS = [
  {
    symbol: "n^{query}_q",
    name: "Query q의 조회 token 수",
    description: "새 request q가 cache에 물어본 prompt token 수입니다. vLLM은 query마다 이 값을 기록합니다.",
  },
  {
    symbol: "n^{hit}_q",
    name: "Query q의 hit token 수",
    description: "조회한 token 중 시작부터 연속으로 cache에 있던 full-block token 수입니다.",
  },
  {
    symbol: "h_{tok}",
    name: "Token hit rate",
    description: "일정 구간의 hit token 합을 조회 token 합으로 나눈 값입니다. vLLM log와 Prometheus counter가 쓰는 정의입니다.",
  },
  {
    symbol: "h_{req}",
    name: "Request hit rate",
    description: "한 token이라도 hit한 request의 비율입니다. 절감량을 말해 주지 않습니다.",
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

export default function PrefixCaching({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="prefix-caching" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Automatic Prefix Caching은 같은 token prefix의 KV만 재사용합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          같은 model에서 동일한 prefix token은 causal attention의 같은 K·V를 만듭니다. vLLM Automatic Prefix Caching(APC)은 이전
          request가 계산한 full KV block을 hash table에 남겨 두었다가 새 request의 hash chain이 같은 동안 block을 touch하고 prefill을
          생략합니다.
        </p>
        <p className="leading-8">
          긴 system prompt,
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
        annotatedFormula={String.raw`H_i=\underbrace{\operatorname{Hash}\!\left(H_{i-1},\;x_i,\;e_i\right)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\operatorname{Hash}\!\left(H_{i-1},\;x_i,\;e_i\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","현재 block token만 hash하지 않고 parent","hash를 함께 넣어 앞선 전체 prefix 순서를","연결합니다."] },
        ]}
        terms={HASH_TERMS}
        assumptions={[
          "같은 cache key는 같은 model weights·tokenizer/template·position semantics·KV computation을 뜻하도록 version boundary를 포함합니다.",
          "Hash collision이 실질적 보안·격리 위험이면 SHA-256 같은 stronger hash와 cache salt 비용을 함께 검토합니다.",
          "연속된 full block까지만 hit로 확정하며 partial 마지막 block은 다음 token과 합쳐질 수 있어 다시 계산할 수 있습니다.",
        ]}
        interpretation="현재 block token이 같아도 parent hash가 다르면 앞 문맥이 다르므로 hit가 아닙니다. LoRA나 image가 달라 KV가 바뀐다면 extras가 달라져야 하며, 그렇지 않으면 잘못된 state를 재사용합니다."
        title="Prefix block의 chained cache key"
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("block-hash-chain", codeRefs["block-hash-chain"])
        }
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="full-block-boundary" className="scroll-mt-20">
          사람이 보기 같은 문장보다 실제 token·template·block boundary가 중요합니다
        </h3>
        <p className="leading-8">
          공백·Unicode normalization·chat template·special token이 달라지면 token ID가 바뀝니다. 같은 글자처럼 보여도 hash chain은
          달라질 수 있습니다. 반대로 긴 prefix가 같더라도 block size에 못 미치는 마지막 partial block은 완전히 cache하지 못할 수 있으므로 “문장 재사용률”과
          “cached token 비율”은 같은 지표가 아닙니다.
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
        annotatedFormula={String.raw`\begin{aligned}
n_{miss} &= \underbrace{n_{prompt}-n_{hit}}_{\text{오른쪽 항으로 결과 계산}} \\
0 &\le \underbrace{n_{hit}\le n_{prompt}}_{\text{허용 경계 판정}}
\end{aligned}`}
        operations={[
          { expression: String.raw`n_{prompt}-n_{hit}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Prompt 전체에서 연속으로 hit한 full-block","prefix를 뺍니다."] },
          { expression: String.raw`n_{hit}\le n_{prompt}`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Prompt 전체에서 연속으로 hit한 full-block","prefix를 뺍니다."] },
        ]}
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
        <h3 id="prefix-sharing" className="scroll-mt-20">
          Prefix sharing은 prefill 생략과 함께 physical block 자체를 나눠 씁니다
        </h3>
        <p className="leading-8">
          Prefix sharing은 같은 prefix를 가진 여러 request의 block table이 같은
          physical block을 가리키는 상태입니다. 계산을 건너뛰는 것과 memory를
          아끼는 것은 같은 hit에서 나오는 두 가지 효과인데, 동시 request가 많을수록
          memory 쪽 효과가 더 큽니다.
        </p>
        <p className="leading-8">
          1,000-token system prompt를 B=16으로 나누면 full block 62개(992 token)와 8 token짜리 partial block 하나가 나옵니다.
          동시에 들어온 request 10개가 이 prompt를 공유하면 62 block의 ref는 10이 되고 공유 없이 620 block을 쓰는 대신 62 block으로 충분합니다.
          마지막 8 token은 request마다 자기 block에 다시 계산합니다.
        </p>
        <p className="leading-8">
          Fork와 다른 점은 공유를 찾는 방법입니다. Fork는 부모가 누구인지 알고 table을 복사하므로 partial block까지 copy-on-write로 공유합니다.
          Prefix sharing은 hash lookup으로 낯선 request 사이의 일치를 찾기 때문에 full block만 공유하고 공유 block에 쓰기가 일어날 일이 없어
          CoW가 필요 없습니다. 새 token은 언제나 자기 소유의 새 block에 들어갑니다.
        </p>
        <p className="leading-8">
          공유 block이 free queue에 있다가 재활성화되는 경로는 위의 BlockPool
          절과 같습니다. 여러 branch의 공유 관계를 tree로 명시하는 radix 방식과의
          비교는 아래 RadixAttention 절에서 이어집니다.
        </p>

        <h3 id="paper-radixattention" className="scroll-mt-20">
          SGLang RadixAttention은 prefix reuse를 radix tree로 직접 표현합니다
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
          vLLM APC가 radix tree를 사용한다는 뜻은 아닙니다. vLLM은 chained block hash와 block pool을 이용해 tree를 별도로 유지하지 않고
          cache hit를 찾습니다. 두 연구를 함께 보면 prefix reuse라는 목적과 hash table·radix tree라는 data structure 선택, 그리고
          cache-aware scheduling을 구분할 수 있습니다.
        </p>

        <h3 id="prefix-operations" className="scroll-mt-20">
          Cache hit rate는 request가 아니라 token 단위로 세야 절감량이 보입니다
        </h3>
        <p className="leading-8">
          Cache hit rate는 조회한 것 가운데 cache에 있던 비율입니다. vLLM은 cache를 조회할 때마다 물어본 token 수와 그중 hit한 token 수를
          counter로 기록하고 log에는 최근 1,000 query 구간의 비율을 보여 줍니다. Request 단위 비율은 같은 이름으로 불리지만 다른 양입니다.
        </p>
        <p className="leading-8">
          1,200-token prompt request 10개 중 9개가 앞의 992 token을 hit하면 조회 token은 12,000, hit token은 8,928이므로 token
          hit rate는 74.4%입니다. Request hit rate는 90%로 더 높게 보이지만 prefill에서 실제로 사라진 일은 74.4%뿐이고 output decode는
          하나도 줄지 않았습니다.
        </p>
      </div>

      <ExplainedFormula
        question="같은 traffic에서 request hit rate와 token hit rate가 다르게 나오는 이유는 무엇일까요?"
        idea={
          <>
            Token hit rate는 hit한 token 합을 조회 token 합으로 나눕니다. Request
            hit rate는 한 token이라도 hit한 request 수를 셉니다. 앞은 절감량에
            비례하고 뒤는 그렇지 않습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
h_{tok} &= \frac{\sum_{q\in Q} n^{hit}_q}{\sum_{q\in Q} n^{query}_q} \\
h_{req} &= \frac{\left|\{q\in Q : n^{hit}_q>0\}\right|}{|Q|}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
h_{tok} &= \underbrace{\frac{\sum_{q\in Q} n^{hit}_q}{\sum_{q\in Q} n^{query}_q}}_{\text{기준량당 비율}} \\
h_{req} &= \underbrace{\frac{\left|\{q\in Q : n^{hit}_q>0\}\right|}{|Q|}}_{\text{기준량당 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{\sum_{q\in Q} n^{hit}_q}{\sum_{q\in Q} n^{query}_q}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","구간 Q의 hit token 합을 조회 token 합으로 나눈","값이며 prefill 절감량에 비례합니다."] },
          { expression: String.raw`\frac{\left|\{q\in Q : n^{hit}_q>0\}\right|}{|Q|}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","한 token이라도 hit한 request 수를 전체 request","수로 나눈 값이며 hit 길이를 반영하지 않습니다."] },
        ]}
        terms={HIT_TERMS}
        assumptions={[
          "Q는 log의 최근 1,000 query처럼 고정 구간이거나 Prometheus rate()의 시간 창입니다. 구간이 다르면 값도 다릅니다.",
          "n_hit은 시작부터 연속으로 일치한 full-block token만 셉니다. Partial block과 중간 일치는 0으로 셉니다.",
          "Hit로 기록된 block이 실행 전에 evict되면 counter는 hit이지만 실제 prefill 절감은 일어나지 않을 수 있습니다.",
        ]}
        interpretation="10 request × 1,200 token 중 9 request가 992 token을 hit하면 h_tok=8,928/12,000=74.4%, h_req=90%입니다. 운영 대시보드에 h_req만 있으면 절감량을 25% 과대평가합니다."
        title="Token hit rate와 request hit rate"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          그래서 운영에서는 hit rate 하나 대신 prompt 중 몇 token이 hit했는지의
          histogram과 TTFT를 함께 기록합니다. Model, tokenizer, chat template,
          adapter, multimodal processor가 바뀌면 cache identity를 분리해야 같은
          숫자를 이어서 비교할 수 있습니다.
        </p>

        <h3 id="cache-locality" className="scroll-mt-20">
          Cache locality는 replica 배치와 eviction 시점 두 축에서 깨집니다
        </h3>
        <p className="leading-8">
          재사용 가능한 prefix가 실제로 hit하는 자리에 놓여 있는 정도를 cache locality라고 합니다. 논리적으로 같은 prompt가 반복돼도 두 조건이 어긋나면 miss가
          납니다. 같은 replica에 도착해야 하고, 지난 사용과 이번 사용 사이에 evict되지 않아야 합니다.
        </p>
        <p className="leading-8">
          Replica별 cache는 독립입니다. 같은 prompt request 10개를 replica 2개에
          round-robin으로 나누면 replica마다 첫 request는 miss이므로 request hit
          rate는 90%에서 80%로 내려갑니다. Replica가 8개이면 8개가 miss여서 20%가
          됩니다. 그래서 같은 prefix를 같은 replica로 보내는 routing과 그로 인한
          load imbalance를 함께 봅니다.
        </p>
        <p className="leading-8">
          시간 축의 locality는 free queue의 LRU 순서가 정합니다. Pool이 8,000
          block이고 어떤 prefix가 62 block을 차지할 때, 두 사용 사이에 다른
          traffic이 8,500 block을 새로 할당하면 그 prefix는 queue head에 도달해
          evict됩니다. 반복률이 높아도 KV pressure가 높으면 TTFT 이득이 사라지는
          이유입니다.
        </p>
        <p className="leading-8">
          측정은 cached token histogram과 함께 eviction 횟수, free pool 크기를 같은 시간축에 놓고 봅니다. Hit rate가 떨어질 때 histogram이
          그대로면 routing 문제이고 histogram의 긴 hit가 사라지면 eviction 문제입니다. Prefix를 보고 request를 배치하는 scheduling과
          routing policy는 다음 글이 다룹니다.
        </p>
      </div>
    </section>
  );
}
