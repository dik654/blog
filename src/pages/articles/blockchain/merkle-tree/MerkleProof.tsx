import { CitationBlock } from '../../../../components/ui/citation';

export default function MerkleProof() {
  return (
    <section id="merkle-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">머클 증명 (Merkle Proof)과 SPV</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          머클 증명(Merkle Proof)은 특정 데이터가 머클 트리에 포함되어 있음을
          효율적으로 입증하는 방법입니다. 전체 트리를 알 필요 없이,
          루트까지의 경로에 있는 형제(sibling) 해시들만 있으면 검증이 가능합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Proof = 형제 해시 경로</h3>
        <p>
          특정 리프의 멤버십을 증명하려면, 해당 리프에서 루트까지의 경로에서
          각 레벨의 형제 노드 해시를 제공하면 됩니다. 검증자는 이 해시들을 사용하여
          루트를 직접 재계산하고, 알려진 머클 루트와 비교합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Merkle Proof 예시: "Tx B가 블록에 포함되어 있는가?"

머클 트리:
              Root
            /      \\
         H(AB)     H(CD)    ← 형제: H(CD)
        /    \\
     H(A)   H(B)            ← 형제: H(A)
      |       |
    Tx A    Tx B  ← 증명 대상

Proof = { H(A), H(CD) }     ← 형제 해시 2개만 필요

검증 과정:
  1. H(B) = SHA256d(Tx B)                  ← 직접 계산
  2. H(AB) = SHA256d(H(A) || H(B))         ← H(A)는 proof에서
  3. Root' = SHA256d(H(AB) || H(CD))       ← H(CD)는 proof에서
  4. Root' == 블록헤더의 merkle_root ?      ← 일치하면 증명 완료!`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">O(log n) 검증 효율성</h3>
        <p>
          n개의 트랜잭션이 있는 블록에서 머클 증명의 크기와 검증 비용은 모두
          O(log n)입니다. 각 레벨에서 하나의 형제 해시(32 bytes)만 필요하므로,
          증명 크기는 정확히 log₂(n) x 32 bytes입니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`증명 크기 분석:

트랜잭션 수(n)    트리 높이    증명 크기         해시 연산 수
──────────────────────────────────────────────────────────
16               4           128 bytes         4
256              8           256 bytes         8
4,096            12          384 bytes         12
65,536           16          512 bytes         16
1,000,000        20          640 bytes         20

* 증명 크기 = log₂(n) × 32 bytes
* Bitcoin 블록: 평균 ~2,000 tx → 약 11 × 32 = 352 bytes

비교: 전체 블록 다운로드 vs 머클 증명
  전체 블록: ~1-2 MB (모든 트랜잭션)
  머클 증명: ~352 bytes + 트랜잭션 1건
  → 약 3,000-5,000배 효율적!`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">SPV (Simplified Payment Verification)</h3>
        <p>
          SPV는 Bitcoin 백서 Section 8에서 제안된 경량 검증 방식입니다.
          SPV 노드는 블록 헤더만 다운로드하고(약 80 bytes/블록), 특정 트랜잭션의 포함 여부를
          머클 증명을 통해 확인합니다. 전체 블록체인을 저장할 필요가 없으므로
          모바일 지갑 등 리소스가 제한된 환경에서 사용됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`SPV 노드의 동작 방식:

1. 블록 헤더 체인만 동기화 (80 bytes × 블록 수)
   → 2024년 기준: ~80 × 830,000 ≈ 66 MB

2. 관심 있는 트랜잭션 발견 시:
   SPV 노드 → 풀 노드: "이 txid의 merkle proof를 주세요"
   풀 노드 → SPV 노드: merkleblock 메시지 반환

3. 검증:
   ┌─────────────────────────────┐
   │  블록 헤더 (이미 보유)        │
   │  → merkle_root 추출          │
   │                              │
   │  merkle proof의 해시들로      │
   │  root 재계산                  │
   │                              │
   │  계산된 root == 헤더 root?    │
   │  → Yes: 트랜잭션 포함 확인!   │
   └─────────────────────────────┘`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bitcoin의 merkleblock 메시지</h3>
        <p>
          Bitcoin 프로토콜에서 SPV 노드는 <code>filterload</code> 메시지로 Bloom filter를 설정한 후,
          <code>merkleblock</code> 메시지를 통해 머클 증명을 수신합니다.
          이 메시지에는 블록 헤더, 트랜잭션 수, 머클 경로의 해시들, 그리고
          경로를 재구성하기 위한 플래그 비트가 포함됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`// Bitcoin merkleblock 메시지 구조
message merkleblock {
    block_header  header;       // 80 bytes 블록 헤더
    uint32        tx_count;     // 블록의 전체 트랜잭션 수
    uint256[]     hashes;       // 머클 경로에 필요한 해시들
    bytes         flags;        // 트리 탐색 방향 비트플래그
}

// BIP 37 (Bloom Filter + merkleblock)
// 1. filterload: SPV 노드가 관심 주소의 bloom filter 전송
// 2. 풀 노드가 매칭되는 tx 발견 시 merkleblock 응답
// 3. SPV 노드가 proof 검증 후 트랜잭션 수용`}</code>
        </pre>

        <CitationBlock source="Bitcoin Whitepaper, Section 8 — Simplified Payment Verification" citeKey={3} type="paper"
          href="https://bitcoin.org/bitcoin.pdf">
          <p className="italic text-foreground/80">
            "It is possible to verify payments without running a full network node.
            A user only needs to keep a copy of the block headers of the longest proof-of-work chain,
            and obtain the Merkle branch linking the transaction to the block it's timestamped in."
          </p>
          <p className="mt-2 text-xs">
            Satoshi Nakamoto는 머클 트리를 SPV의 핵심 메커니즘으로 활용했습니다.
            블록 헤더(80 bytes)만 저장하면 되므로, 연간 약 4.2 MB의 저장 공간만 필요합니다.
            다만 SPV 노드는 풀 노드를 신뢰해야 하므로, 이중지불 공격에 상대적으로 취약합니다.
          </p>
        </CitationBlock>

        <CitationBlock source="Ethereum — Merkle Proofs for Light Clients (Merkle Patricia Trie)" citeKey={4} type="paper"
          href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/">
          <p className="italic text-foreground/80">
            "Ethereum uses a Merkle Patricia Trie for state, transactions, and receipts,
            enabling light clients to verify specific pieces of state without downloading
            the entire blockchain."
          </p>
          <p className="mt-2 text-xs">
            Ethereum은 단순 바이너리 머클 트리 대신 Merkle Patricia Trie를 사용합니다.
            이를 통해 트랜잭션 포함 증명뿐만 아니라 계정 잔액, 컨트랙트 스토리지 등
            임의의 상태(state)에 대한 머클 증명이 가능합니다.
            블록 헤더에 stateRoot, transactionsRoot, receiptsRoot 세 개의 머클 루트가 포함됩니다.
          </p>
        </CitationBlock>

        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">Bitcoin SPV</p>
            <p className="text-sm text-muted-foreground">
              바이너리 머클 트리. 트랜잭션 포함 여부만 증명 가능.
              BIP 37 Bloom filter로 프라이버시 보호 시도 (한계 있음).
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">Ethereum Light Client</p>
            <p className="text-sm text-muted-foreground">
              Merkle Patricia Trie. 상태, 트랜잭션, 리시트 모두 증명 가능.
              EIP-1186 eth_getProof RPC로 증명 요청.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
