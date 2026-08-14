import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";

const TrieFlow = () => (
  <figure data-viz="mpt-root-proof-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-5">
    <figcaption className="mb-4 text-sm font-semibold">Typed key에서 trusted state root까지</figcaption>
    <div className="grid gap-3 sm:grid-cols-5">
      {[["01", "Keccak key"], ["02", "64 nibbles"], ["03", "Compressed nodes"], ["04", "RLP reference"], ["05", "Root proof"]].map(([step, label]) => (
        <div key={step} className="min-w-0 rounded-lg border border-border bg-background p-4">
          <span className="text-xs font-semibold text-primary">{step}</span>
          <p className="mt-2 break-words text-sm font-semibold">{label}</p>
        </div>
      ))}
    </div>
  </figure>
);

export default function ModernArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-5">
      <h2 className="text-3xl font-bold">Ethereum MPT: key/value DB가 아니라 root로 검증하는 authenticated state</h2>
      <p className="text-lg leading-8">한 byte key 0xab를 경로로 쓴다면 먼저 4-bit 단위 a와 b로 나눌 수 있습니다. Ethereum은 account address나 storage slot의 canonical key bytes를 Keccak-256해 32 bytes, 즉 64 nibbles의 secure path를 만들고 그 path를 branch·extension·leaf nodes에 나눠 담습니다.</p>
      <TrieFlow />
      <p>MPT node bytes는 일반 DB에 저장될 수 있지만 B+ tree의 page I/O, LSM의 compaction, MDBX의 transaction durability를 대신하지 않습니다. MPT가 제공하려는 것은 trusted root에 특정 path/value 또는 구조적으로 확인된 absence가 결속되었다는 cryptographic verification boundary입니다.</p>
    </section>

    <section id="path-encoding" className="space-y-5">
      <h2 className="text-2xl font-bold">Nibble path를 branch·extension·leaf로 압축한다</h2>
      <p>Branch node는 nibble 0부터 f까지의 child slots 16개와 node 자체에서 끝나는 value slot 하나를 가집니다. Extension node는 여러 keys가 공유하는 nonterminal prefix와 다음 child reference를, leaf node는 남은 terminating suffix와 value를 담습니다. 따라서 64단계 sparse radix path를 매번 전부 만들지 않고 공통 구간을 건너뜁니다.</p>
      <p>두 항목 node의 compact hex-prefix는 leaf/extension과 odd/even path length를 첫 flag nibble에 함께 넣습니다. Leaf odd path [1,2,3,4,5]는 flag 3을 앞에 붙여 nibble sequence [3,1,2,3,4,5], bytes 0x31 0x23 0x45가 됩니다. Extension even path [a,b]는 flag 0과 padding 0을 붙여 bytes 0x00 0xab가 됩니다. Flag나 padding을 느슨하게 받으면 같은 logical path가 여러 bytes를 가져 root identity가 갈라집니다.</p>
    </section>

    <section id="root-proof" className="space-y-5">
      <h2 className="text-2xl font-bold">Canonical RLP와 inline/hash 경계가 root를 고정한다</h2>
      <p>각 logical node를 canonical RLP bytes로 직렬화한 뒤 child node의 RLP이 32 bytes 미만이면 parent 안에 그대로 inline하고, 32 bytes 이상이면 Keccak-256 digest로 참조합니다. 31-byte node를 hash하거나 32-byte node를 inline하는 구현은 logical entries가 같아도 다른 ancestor bytes와 root를 만듭니다.</p>
      <ExplainedFormula
        question="한 node의 bytes가 어떻게 root-bound reference가 될까?"
        idea="Child의 canonical RLP 길이에 따라 reversible inline bytes 또는 fixed digest를 parent에 넣고, root node는 canonical bytes를 Keccak해 block header의 root identity로 만듭니다."
        formula={String.raw`\operatorname{ref}(n)=\begin{cases}\operatorname{RLP}(n),&|\operatorname{RLP}(n)|<32\\ \operatorname{Keccak256}(\operatorname{RLP}(n)),&|\operatorname{RLP}(n)|\ge 32\end{cases},\qquad R=\operatorname{Keccak256}(\operatorname{RLP}(n_{\mathrm{root}}))`}
        terms={[
          { symbol: "n", name: "Trie node", description: "Branch·extension·leaf 중 하나의 logical node입니다." },
          { symbol: "RLP(n)", name: "Canonical node bytes", description: "Kind·length·payload가 canonical하게 직렬화된 bytes입니다." },
          { symbol: "ref(n)", name: "Parent child reference", description: "길이 경계에 따른 inline bytes 또는 Keccak digest입니다." },
          { symbol: "R", name: "Trie root", description: "Trusted block header나 parent account에 결속할 root hash입니다." },
        ]}
        assumptions={["Key hashing·hex-prefix·RLP rules와 Keccak profile이 고정되어 있습니다.", "Hash collision/preimage resistance를 security assumption으로 둡니다.", "Proof nodes는 trusted root에서 시작해 path를 정확히 소비해야 합니다."]}
        interpretation="31-byte child RLP은 inline되고 32-byte child RLP은 hash됩니다. 이 한 byte 경계를 바꾸면 parent RLP과 모든 ancestor reference가 달라져 최종 root도 달라집니다."
      />
      <p>Inclusion proof verifier는 trusted root의 node bytes를 확인하고 key nibbles를 branch index 또는 extension/leaf suffix와 차례로 맞추어 마지막 leaf value까지 이어야 합니다. Root에서 leaf까지 각 reference가 exact child bytes에 binding된다고 귀납하면 path나 value를 바꾼 proof는 hash collision 없이는 같은 root에 연결될 수 없습니다.</p>
      <p>Absence는 branch의 필요한 child가 empty이거나 trusted path를 따라 도착한 extension/leaf suffix가 남은 key와 다를 때 구조적으로 성립합니다. 단순히 node가 부족하거나 unrelated leaf 하나를 내놓은 truncated proof는 absence가 아닙니다. Proof가 root에서 시작했는지, path를 어디까지 소비했는지, 마지막 mismatch가 실제 node 안에 있는지 확인해야 합니다.</p>
    </section>

    <section id="state-tries" className="space-y-5">
      <h2 className="text-2xl font-bold">Storage root가 account value 안에 들어가 state root로 중첩된다</h2>
      <p>각 contract의 storage slots는 별도의 storage trie에 commitment되고 그 storage root가 nonce·balance·code hash와 함께 account value에 들어갑니다. Account value는 global state trie의 leaf가 되고 최종 state root가 block header에 기록됩니다. 이 때문에 storage proof는 먼저 slot을 account의 storage root에, account proof는 그 account를 block의 state root에 연결해야 합니다.</p>
      <p>Block header에는 stateRoot, transactionsRoot, receiptsRoot가 있으며 contract마다 storage trie가 따로 존재합니다. 이를 “정확히 네 개의 trie”라고 고정하면 여러 contracts의 storage roots를 설명하지 못합니다. Trie 종류와 실제 instance 수를 구분해야 합니다.</p>
      <p>Insert/update/delete는 secure nibble path에서 leaf와 shared prefix를 split하거나 compress한 뒤 변경 path의 RLP/reference만 bottom-up 재계산합니다. 동일 logical state가 동일 root가 되려면 empty value, deletion, compact path, inline threshold와 RLP canonical form까지 deterministic해야 합니다.</p>
    </section>

    <section id="release" className="space-y-5">
      <h2 className="text-2xl font-bold">Encoding·update·inclusion·absence를 한 root oracle에 맞춘다</h2>
      <p>Empty tree, shared prefix, odd/even path, branch value slot, 31/32-byte inline boundary, noncanonical/malformed RLP, wrong root/path/value, missing/extra/truncated node, valid absence, insert/update/delete를 pinned reference source와 비교합니다. Logical lookup result만 맞는 것이 아니라 root, emitted node bytes/set, proof acceptance와 typed failure가 같아야 합니다.</p>
      <p>Protocol/source SHA, key schema·hash, RLP/hex-prefix profile, database adapter와 block fixture를 pin하고 update/prove/verify time, proof/node bytes, hash/RLP count와 memory를 기록합니다. Root·proof parity가 깨지면 이전 trie implementation/profile로 rollback하며, DB fsync latency를 MPT hash algorithm의 성능으로 섞지 않습니다.</p>
      <div id="paper-ethereum-mpt-docs"><CitationBlock source="ethereum.org · Merkle Patricia Trie" citeKey={1} href="https://ethereum.org/developers/docs/data-structures-and-encoding/patricia-merkle-trie/"><p><b>문제:</b> Ethereum state의 radix path·Patricia compression·Merkle commitment를 설명합니다.</p><p><b>기여:</b> Branch/extension/leaf, hex-prefix, RLP inline/hash와 state/storage trie의 official overview를 제공합니다.</p><p><b>전제:</b> 현재 문서의 execution-layer MPT profile과 referenced protocol semantics를 따릅니다.</p><p><b>근거 범위:</b> MPT node·path·root 구조의 공식 설명입니다.</p><p><b>말하지 않는 것:</b> Moving page가 특정 client source version이나 모든 verifier edge case를 고정하지 않습니다.</p></CitationBlock></div>
      <div id="paper-geth-trie-source"><CitationBlock source="ethereum/go-ethereum trie pinned source 6bb0588" citeKey={2} href="https://github.com/ethereum/go-ethereum/tree/6bb0588ad8e7f922e4ad5580f51265a4097af08f/trie"><p><b>문제:</b> MPT update·node encoding·proof implementation seam을 exact source로 고정합니다.</p><p><b>기여:</b> Official go-ethereum trie source·tests의 pinned snapshot을 제공합니다.</p><p><b>전제:</b> Commit 6bb0588과 chain·protocol·database configuration을 pin합니다.</p><p><b>근거 범위:</b> 선택 commit에서 확인되는 trie implementation behavior입니다.</p><p><b>말하지 않는 것:</b> 다른 clients, future Verkle transition, generic storage durability를 대신하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
