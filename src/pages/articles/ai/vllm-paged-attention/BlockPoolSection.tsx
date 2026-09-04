import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import BlockLifecycleViz from "./viz/BlockLifecycleViz";
import ForkCopyOnWriteViz from "./viz/ForkCopyOnWriteViz";

const REF_TERMS = [
  {
    symbol: String.raw`\mathcal R`,
    name: "Live request 집합",
    description: "현재 block table을 소유한 active·cached request 집합입니다.",
  },
  {
    symbol: "T_r",
    name: "Request block table",
    description: "Request r이 logical 순서로 참조하는 physical block들의 목록입니다.",
  },
  {
    symbol: String.raw`\operatorname{ref}(b)`,
    name: "Block reference count",
    description: "Physical block b를 현재 참조하는 block table entry의 수입니다.",
  },
  {
    symbol: String.raw`\mathbf1[\cdot]`,
    name: "Indicator",
    description: "조건이 참이면 1, 아니면 0을 더하는 표기입니다.",
  },
] as const;

export default function BlockPoolSection({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="block-pool" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BlockPool은 physical block의 수명과 재사용 가능 시점을 한곳에서 관리합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Physical block은 한 request만 영구 소유하는 객체가 아닙니다. Prefix가 같은 여러 request나 parallel branch가 같은 block을 함께 볼
          수 있으므로 request 하나가 끝났다고 즉시 내용을 덮어쓰면 다른 request의 attention 결과가 깨집니다.
        </p>
        <p className="leading-8">
          BlockPool은 reference count와 free queue를 단일 기준으로
          사용해 “현재 사용 중”, “cache hit 후보지만 지금은 참조 없음”, “새
          allocation에 재사용 가능” 상태를 구분합니다.
        </p>
      </div>

      <BlockLifecycleViz />

      <ExplainedFormula
        question="Physical block을 안전하게 덮어써도 되는 시점을 어떤 불변식으로 확인할까요?"
        idea={
          <>
            모든 live request의 block table을 보며 block b를 가리키는 entry 수를
            셉니다. 하나라도 참조하면 b는 eviction 대상이 될 수 없습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\operatorname{ref}(b)
&=\sum_{r\in\mathcal R}\sum_i \mathbf1[T_r[i]=b] \\
\operatorname{evictable}(b)
&\Longrightarrow \operatorname{ref}(b)=0
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\operatorname{ref}(b)
&=\underbrace{\sum_{r\in\mathcal R}\sum_i \mathbf1[T_r[i]=b]}_{\text{오른쪽 항으로 결과 계산}} \\
\operatorname{evictable}(b)
&\Longrightarrow \operatorname{ref}(b)=\underbrace{0}_{\text{오른쪽 항으로 결과 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{r\in\mathcal R}\sum_i \mathbf1[T_r[i]=b]`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","모든 live request의 block table을 보며","block b를 가리키는 entry 수를 셉니다."] },
          { expression: String.raw`0`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","모든 live request의 block table을 보며","block b를 가리키는 entry 수를 셉니다."] },
        ]}
        terms={REF_TERMS}
        assumptions={[
          "Block table entry의 추가·제거와 reference count 갱신이 같은 ownership 계약 안에서 일어납니다.",
          "ref=0은 eviction의 필요조건입니다. pinned/null block이나 별도 transfer state는 추가 조건을 가질 수 있습니다.",
          "Cache hash가 남은 ref=0 block은 free queue의 eviction 후보일 수 있지만 cache lookup 전까지 내용이 유효합니다.",
        ]}
        interpretation="A와 B가 P7을 공유하면 ref(P7)=2입니다. A가 끝나도 ref=1이라 덮어쓸 수 없고, B도 참조를 놓아 ref=0이 된 뒤에야 free queue에서 새 allocation 대상으로 재사용할 수 있습니다."
        title="Reference count와 eviction safety"
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("ref-count-eviction", codeRefs["ref-count-eviction"])
        }
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="free-queue-eviction" className="scroll-mt-20">
          Free queue는 빈 block 목록이면서 cached block의 eviction order입니다
        </h3>
        <p className="leading-8">
          Prefix caching이 켜져 있으면 reference count가 0이 된 block도 hash와 함께 남아 다음 요청의 cache hit가 될 수 있습니다. 동시에 새
          token을 위한 block이 부족하면 이 block은 eviction 후보입니다. 현재 V1 BlockPool은 ref=0 block을 free queue에 두고
          allocation이 그 block을 꺼낼 때 이전 hash mapping을 제거한 뒤 새 내용에 사용합니다.
        </p>
        <p className="leading-8">
          따라서 <strong>free</strong>는 “내용이 이미 지워졌다”가 아니라 “현재
          request가 참조하지 않아 필요하면 재할당할 수 있다”에 가깝습니다. Cache
          lookup이 먼저 block을 touch하면 free queue에서 빠지고 reference count가
          올라가 다시 사용 중 상태가 됩니다.
        </p>
        <p className="leading-8">
          이 ref=0 block의 집합이 free block pool입니다. Pool의 크기는 "지금 새 request에 줄 수 있는 block 수"이며 그 안에는 내용이 남은
          cached block과 한 번도 쓰지 않은 block이 섞여 있습니다. 8,000 block 중 6,300이 참조 중이면 free pool은 1,700 block입니다. 그중
          hash가 남아 있는 block이 몇 개인지가 cache의 잠재 hit 폭을 정합니다.
        </p>

        <h3 id="block-allocator" className="scroll-mt-20">
          Allocator는 free pool에서 꺼내고 ref가 0일 때 돌려주는 두 연산입니다
        </h3>
        <p className="leading-8">
          KV block allocator는 physical block의 free pool을 소유하고 allocate와 free 두 연산으로 block의 소유자를 바꾸는 부품입니다.
          vLLM V1에서 이 역할은 BlockPool이 맡고 KVCacheManager는 필요한 block 수만 계산해 BlockPool에 요청합니다. Allocator 자신은 어느
          request가 급한지 모릅니다.
        </p>
        <p className="leading-8">
          Free block pool의 크기는 엔진 시작 시 한 번 정해집니다. Model weight와 activation workspace를 뺀 GPU memory를 block 하나의
          byte로 나눈 값이 전체 block 수이고 이 수에서 ref가 0이 아닌 block을 뺀 나머지가 지금 allocate할 수 있는 free pool입니다.
        </p>
        <p className="leading-8">
          8,000 block pool에서 63 block짜리
          request 100개를 받으면 6,300 block이 점유되고 1,700 block이 남습니다.
        </p>
        <p className="leading-8">
          Free queue의 head에서 block을 꺼내 ref를 1로 올리고 request block table 끝에 붙이는 것이 allocate입니다. Free는 block
          table을 비우면서 각 block의 ref를 내리고 0이 된 block만 free queue tail로 되돌립니다. V1은 request의 block을 역순으로 되돌리는데,
          마지막 block일수록 더 긴 prefix를 hash하고 있어 재사용 확률이 낮기 때문입니다.
        </p>
      </div>

      <AlgorithmBlock
        title="BlockPool allocate · free"
        input={[
          "free_queue: ref=0 block의 doubly linked list (head = LRU, tail = MRU)",
          "cached_blocks: block hash → block id",
          "ref: block id → reference count",
          "req.table: request의 physical block id 목록",
        ]}
        steps={[
          { code: "allocate(req, m): repeat m times: b = free_queue.pop_head()", note: "free queue가 비면 allocation 실패를 manager에 돌려주고, 누구를 멈출지는 scheduler가 정합니다." },
          { code: "  if b.hash is not None: cached_blocks.remove(b.hash); b.hash = None", note: "Evict 시점에 옛 identity를 지워 다른 request가 같은 hash로 hit하지 못하게 합니다." },
          { code: "  ref[b] = 1; req.table.append(b)", note: "새 block은 정확히 한 block table만 가리킵니다." },
          { code: "free(req): for b in reversed(req.table): ref[b] -= 1", note: "마지막 block부터 되돌려 재사용 가능성이 높은 앞쪽 block이 free queue tail 쪽(MRU)에 남게 합니다." },
          { code: "  if ref[b] == 0: free_queue.push_tail(b)", note: "hash는 지우지 않습니다. 다음 request가 touch하면 queue에서 빠져 ref가 다시 오릅니다." },
        ]}
        output="req.table에 연결된 block id 목록 또는 allocation 실패"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="sequence-forking" className="scroll-mt-20">
          Fork는 block table을 복사하고 마지막 block만 copy-on-write로 나눕니다
        </h3>
        <p className="leading-8">
          Sequence forking은 한 request의 KV state를 여러 branch가 이어서 쓰도록 넘기는 연산입니다. Parallel sampling처럼 같은 prompt에서
          output을 n개 받을 때, prompt KV를 n번 복사하는 대신 block table만 복사하고 각 physical block의 reference count를 n으로
          올립니다. 이 시점에 새로 잡는 block은 없습니다.
        </p>
        <p className="leading-8">
          첫 output token을 쓰는 순간에 branch가 갈라집니다. 마지막 block은 아직 slot이 남아 있어 두 branch가 서로 다른 token을 같은 자리에 쓰려
          합니다. 그래서 쓰기 직전에 ref를 확인하고 ref가 1보다 크면 새 block을 받아 내용을 복사한 뒤 자기 table만 새 block으로 바꿉니다. 이것이 OS process
          fork에서 빌려 온 copy-on-write입니다.
        </p>
        <p className="leading-8">
          B=16에서 35-token prompt를 두 sample로 fork하면 세 block의 ref가 2가
          됩니다. 첫 sample이 P9에 쓰려 할 때 ref(P9)=2이므로 P3를 받아 16 slot을
          복사하고 ref(P9)를 1로 내립니다. 두 번째 sample은 ref(P9)=1을 보고
          제자리에 씁니다. 복사한 양은 block 하나뿐이고 앞의 32 token은 끝까지
          공유됩니다.
        </p>
      </div>

      <ForkCopyOnWriteViz />

      <AlgorithmBlock
        title="fork · copy-on-write write"
        input={[
          "parent.table: fork할 request의 block id 목록",
          "ref: block id → reference count",
          "B: block size, n_parent: parent가 채운 token 수",
        ]}
        steps={[
          { code: "fork(parent) → child: child.table = copy(parent.table)", note: "Logical 순서는 table 순서가 보존하므로 physical id를 그대로 복사합니다." },
          { code: "  for b in child.table: ref[b] += 1", note: "Prompt block은 모두 공유 상태가 되고 새 block은 잡지 않습니다." },
          { code: "write(seq, token): b = seq.table[-1]; if slot_full(b): b = allocate(seq, 1)", note: "마지막 block이 꽉 찼으면 공유 여부와 무관하게 새 block에 씁니다." },
          { code: "  elif ref[b] > 1: b' = allocate(seq, 1); copy(b → b'); ref[b] -= 1; seq.table[-1] = b'; b = b'", note: "여기가 copy-on-write입니다. 복사 비용은 block 하나(B slot)로 고정됩니다." },
          { code: "  store_kv(b, offset = n_seq mod B, token)", note: "ref가 1이면 복사 없이 제자리에 씁니다." },
        ]}
        output="branch마다 독립된 마지막 block과 공유된 prefix block"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          절약 폭은 prompt 길이와 branch 수에 비례합니다. 1,000-token prompt를 4개 sample로 fork하면 공유 없이는 63 block씩 252 block이
          필요하지만 공유하면 63 block에 CoW 복사 3개를 더한 66 block으로 시작합니다. 논문은 parallel sampling에서 6.1%에서 9.8%, ShareGPT
          prompt에서는 16.2%에서 30.5%의 block 절감을 자기보고했습니다.
        </p>

        <h3 id="beam-branch-sharing" className="scroll-mt-20">
          Beam search에서는 공유 관계가 매 step 바뀌고 pruning이 block을 돌려줍니다
        </h3>
        <p className="leading-8">
          Beam search는 매 step 상위 k개 candidate만 남기므로 어느 branch가 어느 조상을 공유하는지가 계속 바뀝니다. Reference count 기반 공유는 이
          동적인 관계를 별도 tree 없이 표현합니다. 살아남은 candidate가 가리키는 block은 ref가 남아 유지되고 버려진 candidate만 가리키던 block은 ref가
          0이 되어 free queue로 돌아갑니다.
        </p>
        <p className="leading-8">
          논문의 k=4 예에서 모든 candidate는 prompt block 0을 공유하고 candidate 0에서 2는 앞 세 block을 함께 씁니다. 다음 step의 상위 4개가
          모두 candidate 1과 2에서 나오면 candidate 0과 3이 버려지고, 그들만 참조하던 block 2, 4, 5, 8이 ref 0으로 반환된 뒤 새 block 9에서
          12가 할당됩니다.
        </p>
        <p className="leading-8">
          이전 system은 매 step 살아남은 candidate의 KV 전체를 복사했습니다. Block 공유에서는 새 token이 공유 block 안에 떨어질 때만 block 하나를
          복사하므로 복사량이 sequence 길이에 비례하지 않습니다. 논문은 beam search에서 37.6%에서 55.2%, ShareGPT에서는 44.3%에서 66.3%의 block
          절감을 자기보고했으며 beam width가 클수록 공유 비율이 올라갑니다.
        </p>
        <p className="leading-8">
          현재 V1은 논문의 sequence group fork API 대신 beam마다 별도 request를 내고 prefix cache로 앞부분 block을 공유하는 쪽으로 구현이
          바뀌었습니다. 어느 쪽이든 물리적 공유 단위는 full block이고 partial block은 복사되므로 절감률은 block size와 candidate가 갈라지는 위치에 따라
          달라집니다.
        </p>

        <h3 id="block-invariants" className="scroll-mt-20">
          구현을 읽을 때 확인할 세 가지 불변식
        </h3>
        <p className="leading-8">
          첫째, 참조 중인 일반 block은 free queue의 eviction 후보로 동시에 남아
          있으면 안 됩니다. Touch가 queue에서 빼는 것과 ref를 올리는 것이 한
          단위로 일어나야 합니다.
        </p>
        <p className="leading-8">
          둘째, eviction해 새 내용을 쓴 block이 이전 hash로 cache hit되어서는 안
          됩니다. Allocate가 옛 hash를 지우는 순서가 새 KV를 쓰는 순서보다 앞서야
          합니다.
        </p>
        <p className="leading-8">
          셋째, request의 logical 순서는 physical block ID나 free queue 순서가
          아니라 block table이 결정합니다. Fork와 copy-on-write가 table 항목을
          바꿔도 이 순서는 그대로여야 합니다.
        </p>
      </div>
    </section>
  );
}
