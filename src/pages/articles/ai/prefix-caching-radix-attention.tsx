import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PrefixCachingRadixAttentionViz from "./prefix-caching-radix-attention/viz/PrefixCachingRadixAttentionViz";

/**
 * Prefix caching: radix tree 매칭과 cache-aware scheduling
 *
 * 같은 prefix 를 어떻게 찾고(radix tree · block hash chain), 무엇을 먼저 지우고(LRU),
 * 누구를 먼저 돌리는지(cache-aware scheduling), 그리고 확정된 hit 이 attention kernel 에
 * 어떤 metadata(slot mapping · block table)로 넘어가는지를 소유한다.
 * Block 단위 prefix sharing 과 hit rate 정의는 /ai/vllm-paged-attention 이 소유한다.
 */
export default function PrefixCachingRadixAttentionArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Prefix cache 는 매칭 구조와 실행 순서가 hit 을 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 system prompt 를 가진 요청이 잇달아 오면 앞부분의 KV 를 다시 계산할 이유가
            없습니다. 그런데 무엇이 같은지를 어떤 자료구조로 찾느냐, 메모리가 모자랄 때
            무엇을 먼저 버리느냐, 대기 중인 요청을 어떤 순서로 돌리느냐에 따라 실제로
            재사용되는 token 수는 크게 달라집니다.
          </p>
          <p>
            이 글은 SGLang 의 RadixAttention 이 쓰는 radix tree 와 vLLM 의 block hash chain
            을 같은 예로 비교합니다. System prompt 2,000 token 과 few-shot 500 token 을 세
            요청이 공유하는 상황을 끝까지 따라가며, hit token 수가 어디서 잘리고 어디서
            늘어나는지를 셉니다.
          </p>
          <p>
            Block 단위 prefix sharing 과 token·request hit rate 의 정의는{" "}
            <Link to="/ai/vllm-paged-attention#prefix-sharing">PagedAttention 글</Link> 이
            이미 다뤘습니다. 이 글은 그 위에서 매칭 자료구조, eviction 순서, cache-aware
            scheduling, 그리고 hit 이 확정된 뒤 kernel 로 넘어가는 attention metadata 를
            엽니다.
          </p>
        </div>
        <PrefixCachingRadixAttentionViz />
        <ContentBoundary article="prefix-caching-radix-attention" />
      </section>

      <section id="radix-tree" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Radix tree 는 공유 prefix 를 node 로 갈라 함께 가리키게 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Radix tree 는 edge 하나에 token 여러 개를 붙일 수 있는 trie 입니다. SGLang 의
            RadixAttention 은 이 tree 의 edge 에 token 열을, node 에 그 token 열까지의 KV
            cache 위치를 둡니다. 두 요청이 앞부분을 공유하면 그 부분이 하나의 edge 로 남고,
            갈라지는 지점에서 node 가 쪼개집니다.
          </p>
          <p>
            첫 요청 R1 이 system prompt 2,000 token, few-shot 500 token, 질문 100 token 으로
            들어오면 tree 는 root 에서 2,600 token 짜리 edge 하나를 가집니다. 다음 요청 R2 가
            같은 2,500 token 뒤에 다른 질문 100 token 을 붙이면 match 는 2,500 에서 멈추고,
            edge 는 공유 node(2,500)와 두 leaf(100, 100)로 갈라집니다.
          </p>
          <p>
            R3 이 같은 2,500 token 을 공유하면 leaf 가 하나 더 붙을 뿐 공유 node 는 그대로
            입니다. 세 요청의 prompt 합은 7,800 token 이고 그중 5,000 token 이 cache 에서
            왔으니 hit rate 는 64.1% 입니다. R1 은 tree 가 비어 있어 통째로 miss 인 cold
            start 였습니다.
          </p>
          <p>
            네 번째 요청 R4 가 system prompt 만 같고 few-shot 이 다르면 공유 node 가 2,000
            에서 다시 쪼개집니다. 이제 tree 는 system(2,000) 아래 few-shot(500) 과 R4 의
            few-shot(500) 두 가지를 갖고, R4 의 hit 은 2,000 token 입니다. Tree 는 요청이
            들어올 때마다 이렇게 자랍니다.
          </p>
          <p>
            Node 마다 reference counter 가 있어 지금 running 인 요청이 몇 개나 그 node 를
            지나는지를 셉니다. 이 counter 가 아래 eviction 절의 보호 조건이 되고, cache 와
            running batch 가 하나의 memory pool 을 나눠 쓰기 때문에 waiting 이 많아지면
            cache 쪽이 밀려납니다.
          </p>
        </div>
        <ExplainedFormula
          question="Radix tree 와 block hash 는 같은 요청 묶음에서 hit token 을 얼마나 다르게 세나요?"
          idea="Hit rate 는 prefill 해야 할 token 합 가운데 cache 에서 온 token 합입니다. Radix tree 는 token 단위로 match 길이를 그대로 세고, block hash 는 그 길이를 block 크기 B 의 배수로 내림해서 셉니다."
          formula={String.raw`\begin{aligned}
H &= \frac{\sum_{r} n_r^{hit}}{\sum_{r} n_r^{prompt}} \\
n_r^{hit} &= m_r \quad (\text{radix tree}), \qquad n_r^{hit} = B\left\lfloor \frac{m_r}{B} \right\rfloor \quad (\text{block hash})
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
H &= \frac{\underbrace{\sum_{r} n_r^{hit}}_{\text{cache 에서 온 token 합}}}{\underbrace{\sum_{r} n_r^{prompt}}_{\text{prefill 대상 token 합}}} \\
n_r^{hit} &= \underbrace{m_r}_{\text{token 단위 match 길이}}, \qquad n_r^{hit} = \underbrace{B\left\lfloor \frac{m_r}{B} \right\rfloor}_{\text{full block 으로 내림}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\sum_{r} n_r^{hit}`, annotation: ["요청마다 cache 에서 가져온 token 수를", "구간 전체에 걸쳐 더합니다"] },
            { expression: String.raw`\sum_{r} n_r^{prompt}`, annotation: ["같은 구간의 prompt token 수를 더해", "분모로 삼습니다"] },
            { expression: String.raw`B\left\lfloor \frac{m_r}{B} \right\rfloor`, annotation: ["Match 길이를 block 크기로 나눈 몫만 남겨", "마지막 partial block 을 hit 에서 뺍니다"] },
          ]}
          terms={[
            { symbol: String.raw`m_r`, name: "Match 길이", description: "요청 r 의 prompt 가 처음부터 연속으로 cache 와 일치한 token 수입니다." },
            { symbol: String.raw`n_r^{hit}`, name: "Hit token 수", description: "실제로 prefill 을 생략한 token 수입니다. 자료구조에 따라 m_r 과 다를 수 있습니다." },
            { symbol: String.raw`n_r^{prompt}`, name: "Prompt 길이", description: "요청 r 이 prefill 해야 할 전체 token 수입니다." },
            { symbol: String.raw`B`, name: "Block 크기", description: "vLLM 의 KV block 한 개가 담는 token 수로 기본 16 입니다." },
          ]}
          assumptions={[
            "Hit 으로 센 KV 가 요청이 실제로 실행될 때까지 eviction 되지 않았습니다.",
            "SGLang 논문의 정의를 따라 분모는 prefill token 합이며 output decode 는 포함하지 않습니다.",
            "Radix tree 의 실제 저장 단위도 page 이지만 논문 설명에서는 page 크기가 1 token 입니다.",
          ]}
          interpretation="R1·R2·R3 의 prompt 합 7,800 에서 radix tree 는 5,000 을 hit 으로 세어 64.1% 이고, B=16 인 block hash 는 2,500 을 2,496 으로 내림해 4,992 를 세어 64.0% 입니다. 차이는 요청당 최대 15 token 이라 hit rate 를 정하는 것은 자료구조보다 어떤 요청이 언제 실행되느냐입니다."
        />
      </section>

      <section id="matching" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          match_prefix 는 token 단위로, block hash 는 16 token 단위로 잘립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefix cache matching 은 새 요청의 token 열이 cache 와 처음부터 몇 token 이나
            일치하는지를 찾는 일입니다. 답은 언제나 하나의 길이이며, 중간만 같은 구간은 세지
            않습니다. Causal attention 에서 KV 는 앞선 token 전체에 의존하므로 앞이 다르면
            뒤가 같아도 재사용할 수 없기 때문입니다.
          </p>
          <p>
            SGLang 의 <code>match_prefix</code> 는 root 에서 edge 의 token 열을 요청과 한
            token 씩 비교하며 내려갑니다. Edge 도중에 어긋나면 그 자리에서 node 를 쪼개고
            멈추므로 match 길이는 token 단위입니다. Tree 는 CPU 에 있고 요청당 한 번만
            걷기 때문에 유지 비용은 작다고 논문은 적습니다.
          </p>
          <p>
            vLLM 은 tree 를 두지 않습니다. Block 마다 parent block 의 hash, 그 block 의
            token 들, LoRA·multimodal 같은 추가 key 를 함께 hash 한 chained hash 를 만들고,
            새 요청의 prompt 를 16 token 씩 잘라 첫 block 부터 hash 를 조회합니다. 처음
            miss 가 나는 block 에서 멈추니 결과는 역시 하나의 길이입니다.
          </p>
          <p>
            차이는 경계입니다. 공유 prefix 2,500 token 은 156 개의 full block(2,496 token)
            과 4 token 짜리 partial block 으로 나뉘고, vLLM 은 full block 만 cache 하므로 hit
            은 2,496 에서 끊깁니다. R4 의 2,000 token 은 정확히 125 block 이라 손실이
            없습니다. 손실은 요청당 최대 15 token 입니다.
          </p>
          <p>
            Prompt 전체가 hit 인 경우 vLLM 의 <code>get_computed_blocks</code> 는 hit 길이를
            prompt 길이보다 하나 작게 자릅니다. 첫 output token 의 logit 을 만들려면 적어도
            마지막 prompt token 하나는 이번 forward 에서 계산해야 하기 때문입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="RadixAttention 의 match_prefix → insert → evict"
          input={["T: radix tree (edge = token 열, node = KV 위치 + ref counter)", "tokens: 새 요청의 prompt token 열", "P: GPU memory pool (cache 와 running 이 공유)"]}
          steps={[
            { code: "node = root;  matched = 0", note: "Match 는 항상 root 에서 시작합니다. 중간 구간의 일치는 재사용할 수 없습니다." },
            { code: "while child = node.child_starting_with(tokens[matched]):", note: "첫 token 으로 어느 edge 로 내려갈지 정합니다. Radix tree 라 edge 에 token 이 여러 개 있습니다." },
            { code: "  k = common_prefix_len(child.edge, tokens[matched:])", note: "Edge 의 token 열과 요청을 한 token 씩 비교합니다." },
            { code: "  if k < len(child.edge): split(child, k); node = child.prefix_part; matched += k; break", note: "Edge 도중에 어긋나면 그 자리에서 node 를 쪼개 공유 부분만 남깁니다. R2 가 R1 의 2,600 edge 를 2,500 에서 쪼갠 장면입니다." },
            { code: "  node = child;  matched += k", note: "Edge 전체가 일치하면 다음 node 로 내려갑니다." },
            { code: "return node, matched   # prefix_node, prefix_len", note: "이 길이가 이번 요청의 hit token 수이고, node 의 ref counter 를 올려 실행 중 eviction 을 막습니다." },
            { code: "insert(tokens[matched:]) after forward finishes", note: "새로 계산한 suffix 를 leaf 로 붙입니다. Prompt 와 생성 결과 모두 tree 에 남습니다." },
            { code: "evict(needed): while freed < needed: leaf = LRU leaf with ref == 0; free(leaf); freed += size(leaf)", note: "Memory 가 모자랄 때만 호출됩니다. 지우는 순서는 다음 절이 다룹니다." },
          ]}
          output="hit 길이(prefix_len) 와 갱신된 tree"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3 id="hybrid-manager" className="scroll-mt-20">
            Hybrid cache manager 는 group 마다 다른 hit 길이를 한 값으로 합의합니다
          </h3>
          <p>
            Full attention layer 와 sliding window layer 가 섞인 model 은 KV cache group 이
            둘 이상입니다. Full attention 은 prefix 의 모든 block 이 남아 있어야 hit 이지만,
            window 1,024 인 layer 는 hit 경계 직전 1,024 token 을 담은 block 만 있으면 됩니다.
            Group 마다 hit 길이가 다르니 하나로 맞춰야 합니다.
          </p>
          <p>
            vLLM V1 의 <code>HybridKVCacheCoordinator.find_longest_cache_hit</code> 은 이를
            고정점 반복으로 풉니다. Full attention group 이 먼저 후보 길이를 내고, 다른
            group 은 그 길이를 받아들이거나 줄입니다. 어느 group 이든 길이를 줄이면 모든
            group 을 처음부터 다시 검사하고, 아무도 줄이지 않는 길이에서 멈춥니다.
          </p>
          <p>
            Full attention 이 2,496 을 내고 sliding window group 의 block 130 이 지워져
            있었다고 합시다. Window group 은 후보를 2,080 으로 줄이고, full attention 은
            block 0~129 가 있으니 2,080 을 받아들입니다. Window group 이 [1,056, 2,080) 을
            다시 확인해 통과하면 hit 은 2,080 으로 확정됩니다.
          </p>
          <p>
            Group 이 하나뿐인 model 은 <code>UnitaryKVCacheCoordinator</code> 가, prefix
            caching 을 끈 배포는 <code>KVCacheCoordinatorNoPrefixCache</code> 가 같은
            interface 를 맡습니다. Group 을 나누고 allocation 을 함께 조율하는 쪽은{" "}
            <Link to="/ai/vllm-paged-attention#hybrid-cache-groups">hybrid cache group</Link>{" "}
            절이 정본입니다.
          </p>
        </div>
      </section>

      <section id="eviction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LRU eviction 은 ref 0 인 leaf 부터 지우고 조상은 뒤에 지웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            RadixAttention 의 eviction 은 두 조건을 겹칩니다. Reference counter 가 0 인
            node 만 후보이고, 후보 가운데 leaf 를 least recently used 순으로 지웁니다. Leaf
            를 먼저 지우는 이유는 조상 node 가 여러 요청이 공유하는 부분이라 마지막까지
            남겨야 재사용 가치가 크기 때문입니다.
          </p>
          <p>
            R1·R2·R3 이 모두 끝나 ref 가 0 이고 250 token 어치를 비워야 한다고 합시다. Leaf
            q1(100)이 가장 오래됐으니 먼저, 다음 q2(100), 그다음 q3(100) 순으로 지워 300
            token 을 확보합니다. 공유 node(2,500)는 leaf 셋이 모두 사라져 leaf 가 된 뒤에야
            후보가 됩니다.
          </p>
          <p>
            R3 이 아직 running 이면 그 경로의 node 는 ref 가 1 이라 q3 과 조상 모두 보호
            됩니다. 지울 수 있는 것은 q1·q2 의 200 token 뿐이라 250 을 채우지 못하고,
            scheduler 는 새 요청을 이번 step 에 받지 못합니다. Cache 가 running 과 같은 pool
            을 쓰기 때문에 생기는 제약입니다.
          </p>
          <p>
            vLLM 은 tree 가 없으므로 순서를 free queue 에 심습니다. 요청이 끝나면 block 을
            뒤에서 앞으로 반환해 tail block 이 queue 앞쪽(먼저 evict)에, 공유 prefix block
            이 뒤쪽에 놓입니다. 다른 요청이 hit 으로 block 을 다시 쓰면 <code>touch</code>{" "}
            가 queue 에서 빼내고, 끝나면 다시 tail 로 돌아옵니다.
          </p>
          <p>
            새 block 이 필요하면 queue 의 head 를 꺼내면서 그 block 의 hash 를 지웁니다. 두
            방식 모두 최근에 쓰인 공유 prefix 가 오래 남는다는 점은 같고, radix tree 는 tree
            모양으로 조상을 명시하고 vLLM 은 반환 순서로 같은 효과를 얻는다는 점이 다릅니다.
          </p>
        </div>
        <TermBreakdown
          title="Radix tree 와 block hash chain 의 차이"
          description="같은 목적(prefix 재사용)을 다른 자료구조로 푼 두 구현의 차이를 한 자리에 모았습니다."
          items={[
            { term: "Match 단위", description: "Radix tree 는 token 단위, block hash 는 full block 단위입니다.", example: "공유 2,500 token 이 radix 에서는 2,500, B=16 hash 에서는 2,496 hit 입니다.", boundary: "손실은 요청당 최대 B−1 token 이며 hit rate 차이는 1% 안쪽입니다." },
            { term: "공유 관계 표현", description: "Radix tree 는 node 분기로 어떤 요청이 무엇을 공유하는지 명시하고, hash 는 같은 hash 가 같은 block 을 가리킨다는 사실만 압니다.", example: "R4 가 system prompt 만 공유하면 radix 는 node 를 2,000 에서 쪼개고, vLLM 은 block 0~124 의 hash 가 같을 뿐입니다.", boundary: "Hash 방식은 tree 유지 비용이 없지만 cache-aware scheduling 에 쓸 match 길이를 별도로 계산해야 합니다." },
            { term: "Eviction 순서", description: "Radix 는 ref 0 인 leaf 를 LRU 로, vLLM 은 free queue 의 head 를 꺼냅니다.", example: "요청 종료 시 block 을 역순으로 반환해 tail block 이 먼저 evict 됩니다.", boundary: "SGLang 은 lru 외에 lfu·slru·priority eviction 도 옵션으로 둡니다." },
            { term: "Running 과의 관계", description: "둘 다 cache 와 running 이 하나의 pool 을 나눠 씁니다.", example: "Running 이 지나는 node(ref>0)나 ref_cnt>0 인 block 은 후보가 아닙니다.", boundary: "Waiting 이 많으면 cache 를 모두 비우고 batch 를 키우는 쪽을 택합니다." },
          ]}
        />
      </section>

      <section id="scheduling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cache-aware scheduling 은 hit 길이 순으로 세워 thrashing 을 막습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Cache-aware scheduling 은 waiting queue 의 요청을 도착 순이 아니라 matched
            prefix 길이가 긴 순으로 세우는 정책입니다. Prefix-aware scheduling 이라고도
            부릅니다. 같은 prefix 를 공유하는 요청을 연달아 돌리면 그 prefix 가 evict 되기
            전에 다시 hit 하므로 hit rate 가 올라갑니다.
          </p>
          <p>
            FCFS 가 왜 나쁜지는 thrashing 예로 보입니다. Cache 가 2,500 token prefix 하나만
            담을 수 있고, X 계열과 Y 계열 요청이 X1, Y1, X2, Y2, X3, Y3 순으로 도착해 한
            step 에 하나씩 들어간다고 합시다. Y1 이 X 를 밀어내고 X2 가 Y 를 밀어내니 여섯
            요청 모두 miss 이고 hit token 은 0 입니다.
          </p>
          <p>
            같은 요청을 match 길이 순으로 다시 세우면 X 셋이 먼저, Y 셋이 뒤에 옵니다. 각
            계열의 둘째와 셋째 요청이 2,500 씩 hit 해 hit token 은 10,000 이고 전체 prompt
            15,600 의 64% 입니다.
          </p>
          <p>
            SGLang 논문은 cache 가 가장 긴 요청 하나를 담을 수 있으면 radix tree 의
            depth-first 순서가 hit rate 의 상한에 닿고, longest-prefix-first 가 곧 그 순서라고
            증명합니다.
          </p>
          <p>
            대가는 공정성입니다. Hit 이 없는 3,000 token 요청 r1 이 먼저 와 있고, 매 step
            2,500 을 hit 하는 요청 8 개가 새로 도착해 각각 100 token 만 계산하면 된다고
            합시다. Step 의 새 prefill 상한이 3,200 이면 hit 요청 8 개가 800 을 쓰고 남은
            2,400 에 r1 이 들어가지 못하는 일이 step 마다 반복됩니다.
          </p>
          <p>
            FCFS 였다면 r1 이 먼저 3,000 을 받고 hit 요청 2 개가 같이 들어가며, 나머지 6
            개는 한 step(수십 ms) 늦어질 뿐입니다. Longest-prefix-first 는 r1 의 TTFT 를
            hit 요청의 도착이 멈출 때까지 미룹니다. 논문도 greedy cache-aware scheduling 이
            starvation 을 만들 수 있다고 적고 fair scheduling 과의 결합을 후속 과제로 남겼습니다.
          </p>
          <p>
            SGLang 은 <code>--schedule-policy</code> 로 <code>lpm</code>(longest prefix
            match)·<code>fcfs</code>·<code>dfs-weight</code> 등을 고르게 하고, priority 정책과
            queue 상한 같은 fairness 장치는{" "}
            <Link to="/ai/vllm-scheduler#queue-batching">vLLM scheduler 글</Link> 이 다룹니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Cache-aware scheduling (SGLang 논문 Alg. 1 의 batch 선택 부분)"
          input={["T: radix tree", "P: memory pool", "B: 현재 running batch", "Q: waiting queue"]}
          steps={[
            { code: "for req in Q:  req.prefix_node, req.prefix_len = T.match_prefix(req.input_tokens)", note: "Waiting 전체에 대해 match 길이를 먼저 구합니다. Tree 는 CPU 에 있어 이 비용은 작습니다." },
            { code: "Q.sort(key = prefix_len, descending)", note: "도착 순서를 버리고 hit 길이 순으로 세웁니다. 같은 prefix 를 공유하는 요청이 자연히 붙습니다." },
            { code: "available = T.evictable_size() + P.available_size();  new_batch = []", note: "비어 있는 memory 에 ref 0 인 cache 까지 더한 값이 admission 의 상한입니다." },
            { code: "for req in Q:  if req.size() + current_size < available: new_batch.append(req); available += T.increase_ref_counter(req.prefix_node)", note: "받은 요청의 prefix node 는 ref 를 올려 보호하고, 그 node 가 evictable 에서 빠진 만큼 available 을 조정합니다." },
            { code: "B.merge(new_batch);  if not P.alloc(B.needed_size()): T.evict(needed); P.alloc(...)", note: "새 batch 가 필요한 만큼 leaf 부터 evict 한 뒤 forward 를 돌립니다." },
            { code: "for req in B.drop_finished(): T.decrease_ref_counter(req.prefix_node); T.insert(req)", note: "끝난 요청은 보호를 풀고 prompt 와 output 을 tree 에 넣습니다." },
          ]}
          repeatUntil="Waiting 이 빌 때까지 step 마다 반복합니다. Online 에서는 도착이 계속되므로 정렬이 매 step 다시 일어납니다."
          output="이번 step 의 batch 와 갱신된 tree·pool"
        />
        <ProgressiveDetail
          title="Depth-first 순서가 왜 상한인가요?"
          preview="Tree 의 edge 마다 KV 는 적어도 한 번 계산해야 하므로 총 계산량의 하한은 edge 크기의 합이고, DFS 로 걸으면 각 edge 를 정확히 한 번만 계산합니다."
        >
          <p>
            요청 묶음 R 로 만든 radix tree T 에서 edge e 의 KV 크기를 |e| 라 하면 어떤
            순서로 돌려도 총 계산량 C 는 모든 |e| 의 합 이상입니다. DFS 로 걸으면 edge e 를
            처음 계산한 뒤 그 subtree 를 끝낼 때까지 e 는 계속 hit 이고, subtree 를 떠난
            뒤에는 다시 오지 않으므로 각 edge 를 정확히 한 번 계산합니다.
          </p>
          <p>
            이 논증은 cache 가 가장 긴 요청 하나(tree 의 가장 긴 경로)를 담을 수 있다는
            전제 위에 섭니다. 논문의 귀납은 longest-shared-prefix-first 가 방문하지 않은
            node 가운데 최근 경로와 가장 긴 공통 조상을 가진 node 를 고르므로 DFS 와 같은
            순서라는 것입니다. Online 에서는 도착이 순서를 끊지만 논문은 이미 자란 부분
            tree 위에서 DFS 를 근사한다고 봅니다.
          </p>
          <p>
            Output 길이를 미리 모르므로 실제 계산은 증명과 다를 수 있다는 각주가 붙어 있고,
            논문이 보고한 benchmark 의 hit rate 는 상한의 평균 96% 였습니다. 이 수치는
            저자 자기보고입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="attention-metadata" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hit 이 확정되면 slot mapping 과 block table 이 kernel 에 넘어갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Scheduler 가 hit 길이와 새 block 을 확정하면 model runner 는 그 결과를 attention
            kernel 이 읽을 수 있는 tensor 묶음으로 바꿉니다. 이 묶음이 attention metadata
            입니다. 어떤 요청이 몇 token 을 새로 계산하고, 그 K·V 를 어느 slot 에 쓰며,
            과거 K·V 를 어느 block 에서 읽을지가 여기에 담깁니다.
          </p>
          <p>
            vLLM V1 은 backend 공통 부분을 <code>CommonAttentionMetadata</code> 로 먼저
            만듭니다. 요청별 query 시작 위치 <code>query_start_loc</code>, 누적 길이{" "}
            <code>seq_lens</code>, 실제 token 수 <code>num_actual_tokens</code>, 가장 긴 query
            길이 <code>max_query_len</code>, 그리고 <code>block_table_tensor</code> 와{" "}
            <code>slot_mapping</code> 이 그 field 입니다.
          </p>
          <p>
            Backend 별 builder 가 여기에 자기 kernel 이 필요로 하는 field 를 더합니다.{" "}
            <code>FlashAttentionMetadataBuilder.build()</code> 가 만드는{" "}
            <code>FlashAttentionMetadata</code> 에는 <code>use_cascade</code>,{" "}
            <code>common_prefix_len</code>, <code>prefix_kv_lens</code>,{" "}
            <code>suffix_kv_lens</code> 처럼 공유 prefix 를 kernel 안에서 활용하기 위한
            field 가 들어 있습니다.
          </p>
          <h3 id="slot-mapping" className="scroll-mt-20">
            Slot mapping 은 새 token 하나하나가 쓰일 physical 자리입니다
          </h3>
          <p>
            Slot mapping 은 이번 forward 에서 새로 계산하는 token 마다 그 K·V 를 저장할
            physical slot 번호를 적은 1차원 tensor 입니다. Slot 번호는 physical block 번호에
            block 크기를 곱하고 block 안 offset 을 더한 값이라, kernel 은 block table 을 다시
            보지 않고 이 번호만으로 K·V 를 씁니다.
          </p>
          <p>
            R2 는 2,496 token 을 hit 했고 104 token(위치 2,496~2,599)을 새로 계산합니다.
            B=16 이면 이 token 들은 logical block 156~162 에 들어가고, scheduler 가 그
            자리에 physical block 913, 77, 1204, 42, 618, 350, 991 을 배정했다고 합시다.
          </p>
          <p>
            위치 2,500 은 logical block 156 의 offset 4 이므로 slot 은 913×16+4 = 14,612
            입니다. 같은 식으로 104 개 위치마다 slot 번호 하나가 나오고, 그 목록이 이번
            step 의 slot mapping 입니다.
          </p>
          <p>
            Hit 한 2,496 token 은 slot mapping 에 나오지 않습니다. 그 K·V 는 이미 다른
            요청이 써 둔 block 에 있고, R2 의 block table 이 그 block 을 가리킬 뿐입니다.
            Slot mapping 은 쓰기 경로이고 hit 은 쓰기가 없는 경로라는 구분이 여기서
            드러납니다.
          </p>
          <h3 id="block-table-lookup" className="scroll-mt-20">
            Block table lookup 은 읽기 경로에서 위치를 physical block 으로 바꿉니다
          </h3>
          <p>
            Query 하나가 attention 을 계산하려면 위치 0 부터 자기 위치까지의 K·V 를 모두
            읽어야 합니다. Kernel 은 요청의 block table 행에서 위치를 B 로 나눈 몫 번째
            항목을 읽어 physical block 을 얻고, 그 block 의 K·V page 를 가져옵니다. 이
            조회가 block table lookup 이며 logical 주소를 physical 로 바꾸는{" "}
            <Link to="/ai/vllm-paged-attention#logical-physical-address">address translation</Link>{" "}
            의 실행 시점 모습입니다.
          </p>
          <p>
            R2 의 위치 2,500 에 대한 query 는 block table 의 항목 0~156 을 따라 157 개
            physical block 을 읽습니다. 그중 0~155 는 R1 이 채운 공유 block 이고 156 은
            방금 slot mapping 으로 쓴 block 입니다. 읽기는 block table 로, 쓰기는 slot
            mapping 으로 가는 두 경로가 한 forward 안에서 같은 block 을 만납니다.
          </p>
          <p>
            같은 batch 의 R1·R2·R3 이 앞 156 block 을 공유하면 FlashAttention backend 는{" "}
            <code>common_prefix_len</code> 을 2,496 으로 두고 cascade attention 을 켤 수
            있습니다. 공유 prefix 에 대한 attention 을 세 요청의 query 를 모아 한 번 읽고,
            각자의 suffix 결과와 합칩니다. 이때도 block table 은 그대로이고 읽는 순서만
            바뀝니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Metadata 는 매 step 새로 만들어지나요?"
          preview="예. Batch 구성이 step 마다 바뀌므로 slot mapping 과 query 시작 위치는 매 step 다시 계산하고, block table 은 요청별 행을 유지한 채 새 block 만 덧붙입니다."
        >
          <p>
            Model runner 는 <code>SchedulerOutput</code> 의 요청별 token 수와 새 block 목록을
            받아 input batch 를 갱신하고, 거기서 <code>CommonAttentionMetadata</code> 를
            만듭니다. CUDA graph 로 실행하는 batch 는 <code>build_for_cudagraph_capture</code>{" "}
            로 고정 모양의 metadata 를 따로 만듭니다.
          </p>
          <p>
            Field 이름과 builder 구조는 2026년 8월 기준 vLLM main branch 의{" "}
            <code>vllm/v1/attention/backends/utils.py</code> 와{" "}
            <code>flash_attn.py</code> 에서 읽은 것입니다. 소스는 계속 바뀌므로 field 의
            존재보다 쓰기 경로(slot mapping)와 읽기 경로(block table)가 분리돼 있다는 구조를
            기억하는 편이 안전합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          SGLang 논문이 radix tree 와 순서를, vLLM 문서가 hash 매칭을 보였습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Radix tree 로 prefix 를 보관하고 LRU 와 cache-aware scheduling 을 결합한 것은
            SGLang 논문(NeurIPS 2024)의 §3 입니다. 논문은 Llama-2 7B 를 A10G 한 장에서
            돌린 benchmark 에서 hit rate 50~99% 와 처리량 최대 6.4× 를 보고했고, 비교
            대상은 당시의 vLLM v0.2.5 였습니다. 모두 저자 자기보고입니다.
          </p>
          <p>
            Chained block hash, full block 만 cache 하는 규칙, free queue 의 LRU 순서는
            vLLM 의 automatic prefix caching 설계 문서와 <code>kv_cache_manager.py</code>·
            <code>block_pool.py</code> 에서 읽었습니다. Hybrid coordinator 와 attention
            metadata 의 class 이름은 같은 시점의 V1 소스입니다.
          </p>
          <p>
            이 글의 수치 예(2,000+500+100, B=16, 3,200 token 상한)는 두 자료구조의 산수이며
            어느 배포의 측정도 아닙니다. Hit rate 와 TTFT 는 workload 의 prefix 반복률과
            eviction 시점에 달려 있으므로 배포 중인 trace 로 다시 재야 합니다.
          </p>
        </div>
        <div id="paper-sglang-radixattention" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zheng et al. · SGLang: Efficient Execution of Structured Language Model Programs (NeurIPS 2024)"
            citeKey={1}
            href="https://arxiv.org/abs/2312.07104"
          >
            §3 이 radix tree 에 token 열과 KV 를 두는 RadixAttention, ref counter 를 가진
            leaf-first LRU eviction, matched prefix 길이 순 cache-aware scheduling 을 제안하고,
            Theorem 3.1 에서 DFS 순서가 hit rate 상한에 닿음을 보였습니다. 처리량 6.4× 와
            hit rate 는 Llama-2 7B·A10G·vLLM v0.2.5 대비 저자 측정입니다.
          </CitationBlock>
        </div>
        <div id="source-vllm-prefix-caching" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM 문서 · Automatic Prefix Caching (design)"
            citeKey={2}
            href="https://docs.vllm.ai/en/latest/design/prefix_caching.html"
          >
            Block hash 가 parent hash·block token·extra key 로 이어지는 구조, full block 만
            cache 하는 규칙, free queue 의 head 를 꺼내며 hash 를 지우는 eviction, 요청 종료
            시 block 을 역순으로 반환하는 순서를 B=4 예제로 설명합니다.
          </CitationBlock>
        </div>
        <div id="source-vllm-v1-attention" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vllm-project/vllm · vllm/v1/attention/backends/utils.py · flash_attn.py · vllm/v1/core/kv_cache_coordinator.py"
            citeKey={3}
            href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/attention/backends/utils.py"
            type="code"
          >
            <code>CommonAttentionMetadata</code> 의 query_start_loc·seq_lens·block_table_tensor·slot_mapping
            field, <code>FlashAttentionMetadata</code> 의 use_cascade·common_prefix_len,{" "}
            <code>HybridKVCacheCoordinator.find_longest_cache_hit</code> 의 고정점 반복을 2026년
            8월 main branch 에서 확인했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/ai/vllm-scheduler#queue-batching">Queue 정책과 fairness</Link>,
          그리고 <Link to="/ai/serving-memory-admission-and-preemption#watermark-admission">KV admission 과 preemption</Link>.
        </p>
      </section>
    </div>
  );
}
