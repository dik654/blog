import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import EthereumStatePathLocator, { EthereumStateMapReturn } from "../state-shared/EthereumStatePathLocator";
import MptProofTraceViz, { StateRootNestingViz } from "./viz/MptProofTraceViz";

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <EthereumStatePathLocator current="mpt-proof" />

      <section id="overview" className="scroll-mt-20 space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Ethereum 상태 · 포함 증명</p>
          <h2 className="text-3xl font-bold tracking-tight">stateRoot 하나로 계정의 balance를 어떻게 확인할까요?</h2>
          <p className="max-w-3xl text-lg leading-8 text-foreground/90">
            검증자가 믿는 값은 블록 헤더의 32-byte <code>stateRoot</code> 하나뿐이라고 하겠습니다. 증명 제공자는 계정 주소와 몇 개의 trie node를 보냅니다. 검증자는 주소에서 경로를 만들고 root부터 leaf까지 참조를 확인해, balance 10이 그 블록 상태에 속하는지 판단합니다.
          </p>
        </header>

        <MptProofTraceViz />

        <p>
          이 자료구조를 Modified Merkle Patricia Trie, 줄여서 MPT라고 부릅니다. Patricia 압축은 공통 경로를 짧게 묶고, Merkle 참조는 각 child의 bytes를 위쪽 root에 결속합니다. 그래서 계정 값 한 글자를 바꾸면 leaf에서 root까지 이어지는 참조도 달라집니다.
        </p>
        <p>
          MPT node bytes는 실제 데이터베이스에 저장될 수 있지만 MPT 자체가 디스크 내구성이나 transaction을 제공하는 것은 아닙니다. B+ tree page, LSM compaction, MDBX transaction은 물리 저장을 다루고, MPT는 특정 경로와 값이 신뢰한 root에 묶여 있는지를 검증합니다.
        </p>
      </section>

      <section id="path-encoding" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 경로</p>
          <h2 className="text-2xl font-bold">주소를 64개의 길 선택으로 바꾸고 공통 구간을 압축합니다</h2>
        </header>

        <p>
          Ethereum의 secure trie는 account address의 정규 bytes를 <code>Keccak-256</code>으로 해시합니다. 결과 32 bytes의 각 byte를 상위·하위 4-bit로 나누면 0부터 f까지의 nibble 64개가 됩니다. 이 nibble들이 root에서 어떤 child를 고를지 정합니다. 그림의 <code>a7 · 1 · 355…</code>는 이 긴 경로를 줄여 적은 것입니다.
        </p>

        <dl className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          <div className="bg-background p-4">
            <dt className="font-mono text-xs font-black text-primary">Branch</dt>
            <dd className="mt-2 break-keep text-sm leading-6">nibble 0부터 f까지의 child 16개와, 경로가 이 node에서 끝날 때 쓰는 value 한 칸을 가집니다.</dd>
          </div>
          <div className="bg-background p-4">
            <dt className="font-mono text-xs font-black text-primary">Extension</dt>
            <dd className="mt-2 break-keep text-sm leading-6">여러 key가 함께 지나는 끝나지 않은 경로 조각과 다음 child 참조를 가집니다.</dd>
          </div>
          <div className="bg-background p-4">
            <dt className="font-mono text-xs font-black text-primary">Leaf</dt>
            <dd className="mt-2 break-keep text-sm leading-6">마지막 남은 경로 조각과 그 key의 value를 가집니다.</dd>
          </div>
        </dl>

        <p>
          Extension과 leaf의 경로에는 compact hex-prefix를 붙입니다. 첫 flag nibble은 이 node가 leaf인지 extension인지, 경로 길이가 홀수인지 짝수인지를 함께 나타냅니다. 예를 들어 홀수 길이 leaf 경로 <code>[1,2,3,4,5]</code>는 flag 3을 앞에 붙여 <code>31 23 45</code>가 됩니다. 짝수 길이 extension 경로 <code>[a,b]</code>는 flag 0과 padding 0을 붙여 <code>00 ab</code>가 됩니다.
        </p>
        <p>
          Flag와 padding을 느슨하게 허용하면 같은 논리 경로를 여러 bytes로 표현할 수 있습니다. 그러면 node의 RLP와 root도 달라집니다. 따라서 경로를 읽는 일은 단순 문자열 비교가 아니라 canonical encoding 검사까지 포함합니다.
        </p>
      </section>

      <section id="root-proof" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 참조</p>
          <h2 className="text-2xl font-bold">짧은 node는 그대로 넣고, 긴 node는 hash로 가리킵니다</h2>
        </header>

        <ExplainedFormula
          question="한 node의 bytes는 어떻게 위쪽 root에 묶일까요?"
          idea="Child의 canonical RLP 길이에 따라 parent 안에 원문 bytes를 넣거나 Keccak digest를 넣습니다. Root node는 길이와 관계없이 hash해 블록 헤더와 비교합니다."
          formula={String.raw`ref(n)=\begin{cases}RLP(n),&|RLP(n)|<32\\Keccak256(RLP(n)),&|RLP(n)|\ge 32\end{cases},\qquad R=Keccak256(RLP(n_{root}))`}
          annotatedFormula={String.raw`ref(n)=\begin{cases}\underbrace{RLP(n)}_{\text{짧으면 원문}},&|RLP(n)|<32\\\underbrace{Keccak256(RLP(n))}_{\text{길면 digest}},&|RLP(n)|\ge 32\end{cases},\qquad R=\underbrace{Keccak256(RLP(n_{root}))}_{\text{신뢰할 root}}`}
          operations={[
            { expression: String.raw`RLP(n)`, annotation: ["Child의 canonical RLP가 32 bytes보다 짧으면", "parent에 bytes를 그대로 넣습니다."] },
            { expression: String.raw`Keccak256(RLP(n))`, annotation: ["32 bytes 이상이면 digest로 참조합니다.", "31-byte child는 inline, 32-byte child는 hash입니다."] },
            { expression: String.raw`Keccak256(RLP(n_{root}))`, annotation: ["Root node는 길이와 상관없이 hash합니다.", "이 값이 블록 헤더 stateRoot와 같아야 합니다."] },
          ]}
          terms={[
            { symbol: "n", name: "Trie node", description: "Branch·extension·leaf 중 하나입니다." },
            { symbol: "RLP(n)", name: "Canonical node bytes", description: "Node의 항목과 길이를 규칙에 맞게 직렬화한 bytes입니다." },
            { symbol: "ref(n)", name: "Child reference", description: "Parent가 child를 가리키는 inline bytes 또는 digest입니다." },
            { symbol: "R", name: "Trie root", description: "블록 헤더나 account value가 보관하는 32-byte root입니다." },
          ]}
          assumptions={[
            "Keccak-256과 RLP·hex-prefix 규칙을 동일하게 적용합니다.",
            "검증을 시작할 stateRoot는 신뢰할 블록 헤더에서 얻습니다.",
            "Hash collision과 preimage를 현실적으로 만들 수 없다고 가정합니다.",
          ]}
          interpretation="31-byte child RLP을 hash하거나 32-byte child RLP을 inline하면 parent RLP이 달라지고, 그 차이가 모든 ancestor를 거쳐 최종 root까지 전파됩니다."
        />

        <AlgorithmBlock
          title="신뢰한 stateRoot에서 계정 포함 증명을 확인하는 절차"
          input={[
            "trusted_root = block_header.stateRoot",
            "address_bytes = 검증할 계정 주소의 정규 bytes",
            "proof_nodes = 증명 제공자가 보낸 RLP node 목록",
          ]}
          steps={[
            { code: "path = nibbles(keccak256(address_bytes))", note: "32-byte 해시를 64개의 4-bit 길 선택으로 바꿉니다." },
            { code: "node = decode_canonical_rlp(proof_nodes[0])", note: "Noncanonical RLP이나 node 형태가 맞지 않으면 즉시 오류로 끝냅니다." },
            { code: "require keccak256(rlp(node)) == trusted_root", note: "증명 안의 root가 아니라 블록 헤더의 root를 기준으로 시작합니다." },
            { code: "while node is extension: consume_exact(node.path, path)", note: "공통 접두가 남은 경로와 정확히 일치해야 다음 참조로 이동합니다." },
            { code: "while node is branch: node = resolve(node.child[path.take(1)])", note: "다음 nibble의 slot만 고르고 inline/hash 경계에 맞춰 정확한 child bytes를 확인합니다." },
            { code: "require node is leaf and consume_exact(node.path, path)", note: "Leaf의 종료 suffix까지 소비한 뒤 남은 path가 없어야 합니다." },
            { code: "account = decode_canonical_rlp(node.value)", note: "마지막 value에서 nonce·balance·storageRoot·codeHash를 읽습니다." },
          ]}
          output="검증된 account value 또는, 인증된 구조로 확인한 ABSENT; 그 밖에는 INVALID_PROOF"
        />
      </section>

      <section id="proof-failures" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 실패</p>
          <h2 className="text-2xl font-bold">Node가 없다는 말과 계정이 없다는 증명은 다릅니다</h2>
        </header>

        <p>
          포함 증명은 root에서 시작해 key 경로를 모두 소비하고 마지막 leaf value까지 이어져야 합니다. 중간 node 하나가 빠졌거나, 무관한 leaf를 보냈거나, child hash와 bytes가 맞지 않으면 결과는 “계정 없음”이 아니라 “증명이 불완전하거나 잘못됨”입니다.
        </p>
        <p>
          부재 증명이 성립하는 경우는 구조 안에서 막힌 지점을 확인했을 때입니다. 신뢰한 경로를 따라간 branch의 필요한 child가 비어 있거나, 인증된 extension·leaf의 경로 조각이 남은 key와 다르면 그 key가 해당 root 아래 존재하지 않음을 알 수 있습니다. 이때도 mismatch를 담은 node 자체가 root에 결속되어 있어야 합니다.
        </p>
        <aside className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="MPT 증명의 세 가지 결론">
          <div className="bg-background p-4"><strong className="text-sm">포함</strong><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">경로를 전부 소비하고 leaf value가 참조 사슬과 맞습니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">부재</strong><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">인증된 빈 branch slot 또는 인증된 경로 불일치가 있습니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">잘못된 증명</strong><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">Node 누락·참조 불일치·남은 경로·비정규 encoding이 있습니다.</p></div>
        </aside>
      </section>

      <section id="state-tries" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">04 · 중첩</p>
          <h2 className="text-2xl font-bold">계약의 storageRoot가 account value 안에 들어갑니다</h2>
        </header>

        <StateRootNestingViz />

        <p>
          Contract storage slot은 그 계약만의 storage trie에 들어가고, 그 trie의 root가 account value의 <code>storageRoot</code>가 됩니다. Account value는 다시 전체 계정 state trie의 leaf에 들어갑니다. 따라서 slot 값을 검증하려면 먼저 slot proof를 account의 storageRoot에 연결하고, account proof를 블록 헤더의 stateRoot에 연결해야 합니다.
        </p>
        <p>
          블록 헤더에는 <code>stateRoot</code>·<code>transactionsRoot</code>·<code>receiptsRoot</code>가 있습니다. 여기에 계약마다 별도의 storage trie가 있으므로 “Ethereum에는 trie가 정확히 네 개 있다”고 세면 안 됩니다. Trie의 종류와 실제 instance 수를 구분해야 합니다.
        </p>
        <p>
          계정 하나를 바꾸면 해당 leaf와 root까지 이어지는 ancestor를 아래에서 위로 다시 인코딩합니다. 다른 경로의 subtree hash는 재사용할 수 있습니다. 이 실제 갱신 과정은 <Link className="text-primary underline underline-offset-4" to="/cs/blockchain/reth-trie#overview">Reth trie 실무 글</Link>에서 balance 10→11 사례로 이어집니다.
        </p>
      </section>

      <section id="evidence" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">05 · 근거</p>
          <h2 className="text-2xl font-bold">프로토콜 규칙과 클라이언트 구현을 구분해 읽습니다</h2>
        </header>

        <div id="paper-ethereum-mpt-docs">
          <CitationBlock source="ethereum.org · Merkle Patricia Trie" citeKey={1} href="https://ethereum.org/developers/docs/data-structures-and-encoding/patricia-merkle-trie/">
            <p><strong>확인한 내용:</strong> Ethereum MPT의 nibble path, branch·extension·leaf, hex-prefix와 RLP reference 구조입니다.</p>
            <p><strong>범위:</strong> 실행 계층의 MPT 자료구조를 설명합니다. 특정 클라이언트의 물리 데이터베이스나 성능을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-yellowpaper-trie">
          <CitationBlock source="Ethereum Yellow Paper · Shanghai efc5f9a" citeKey={2} href="https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex">
            <p><strong>확인한 내용:</strong> World state와 modified Merkle Patricia tree의 형식적 관계입니다.</p>
            <p><strong>범위:</strong> 고정한 Shanghai 문서입니다. 이후 fork의 실행 규칙 전체를 대표하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-geth-trie-source">
          <CitationBlock source="go-ethereum trie · 6bb0588 고정 원문" citeKey={3} href="https://github.com/ethereum/go-ethereum/tree/6bb0588ad8e7f922e4ad5580f51265a4097af08f/trie">
            <p><strong>확인할 위치:</strong> Trie update·node encoding·proof 구현을 실제 코드와 test에서 읽을 수 있는 고정 snapshot입니다.</p>
            <p><strong>범위:</strong> 이 commit의 구현 근거입니다. 다른 클라이언트나 이후 자료구조 전환을 대신 설명하지 않습니다.</p>
          </CitationBlock>
        </div>

        <aside className="not-prose border-y border-border py-5" aria-label="이 글을 읽은 뒤 설명할 수 있어야 하는 질문">
          <p className="text-[10px] font-bold text-primary">스스로 확인하기</p>
          <ol className="mt-3 grid gap-3 text-sm leading-6 sm:grid-cols-2">
            <li className="border-l-2 border-border pl-3"><strong>1.</strong> 주소가 왜 64개의 nibble 경로가 되나요?</li>
            <li className="border-l-2 border-border pl-3"><strong>2.</strong> 31-byte child와 32-byte child의 참조 방식은 어떻게 다른가요?</li>
            <li className="border-l-2 border-border pl-3"><strong>3.</strong> Truncated proof를 왜 부재 증명으로 받아들이면 안 되나요?</li>
            <li className="border-l-2 border-border pl-3"><strong>4.</strong> Contract slot은 어떤 두 root를 거쳐 블록 헤더에 연결되나요?</li>
          </ol>
        </aside>

        <EthereumStateMapReturn current="mpt-proof" />
      </section>
    </article>
  );
}
