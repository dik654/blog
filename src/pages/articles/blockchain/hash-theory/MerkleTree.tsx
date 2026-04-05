import MerkleTreeViz from './viz/MerkleTreeViz';
import SMTViz from './viz/SMTViz';

export default function MerkleTree() {
  return (
    <section id="merkle-tree" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle Tree & 희소 트리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          루트 해시 하나로 전체 데이터 무결성 증명. 증명 크기 O(log n).
        </p>
      </div>
      <div className="not-prose mb-8"><MerkleTreeViz /></div>

      <h3 className="text-xl font-semibold mb-3">희소 머클 트리 (SMT)</h3>
      <div className="not-prose"><SMTViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Tree 기본 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Merkle Tree (Binary Hash Tree)
//
// 구조 (n=4 예시):
//
//              Root = H(H(D12) || H(D34))
//              /          \\
//         H12               H34
//        /    \\            /    \\
//      H1      H2        H3      H4
//      |       |         |       |
//     D1      D2        D3      D4
//
// 생성:
//   leaf_i = H(data_i)
//   node = H(left_child || right_child)
//   root = 최상위 node
//
// Merkle Proof 검증:
//   D1 포함 증명 → [H2, H34] 제공
//   verify:
//     h1 = H(D1)
//     h12 = H(h1 || H2)
//     root' = H(h12 || H34)
//     root' == root ?
//
// 증명 크기: O(log n) 해시
//   1024 leaves → 10 hashes
//   1M leaves → 20 hashes

// 사용 사례:
//
// 1. Bitcoin SPV (Simple Payment Verification)
//    - 경량 클라이언트
//    - 블록 헤더만 저장
//    - 거래 포함 증명 O(log n)
//
// 2. Git
//    - 각 파일/디렉토리가 해시
//    - 변경 감지
//
// 3. Certificate Transparency
//    - 인증서 로그
//    - 감사 가능
//
// 4. Rollups (Ethereum L2)
//    - 거래 배치 커밋
//    - Fraud/Validity proofs
//
// 5. IPFS / Filecoin
//    - Content addressing
//    - CID = root hash

// Merkle Tree 변형:
//   Binary Merkle Tree (표준)
//   Merkle-Patricia Trie (Ethereum 상태)
//   Verkle Tree (vector commitments)
//   Sparse Merkle Tree (SMT)

// Ethereum State Trie:
//   Modified Merkle-Patricia
//   - Account trie
//   - Storage trie (per contract)
//   - Transaction trie
//   - Receipt trie
//   각 블록 헤더에 root 포함`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sparse Merkle Tree</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sparse Merkle Tree (SMT)
//
// 일반 Merkle Tree:
//   - Ordered leaves
//   - O(log n) depth (n = leaves)
//   - 추가 시 트리 재구성
//
// Sparse Merkle Tree:
//   - 모든 가능한 key의 트리
//   - Fixed depth (e.g., 256 levels)
//   - 대부분 leaves가 empty
//   - Key → position 직접 매핑

// 구조:
//   Address space: 2^256 (예: SHA-256 key)
//   Depth: 256
//   Leaves: 2^256 (대부분 비어있음)
//
//   key=0x01... → path: [0,0,0,0,0,0,0,1, ...]
//   (비트별로 left/right 결정)

// 효율성:
//   - Empty subtree 모두 같은 해시 (pre-computed)
//   - 실제 저장 = 비어있지 않은 노드만
//   - Inclusion proof + non-inclusion proof

// Non-inclusion Proof:
//   "key X는 트리에 없다"
//   - Merkle path까지 empty hash
//   - 정확한 증명 가능
//   - 일반 Merkle Tree는 불가

// 사용:
//   - Ethereum state (Verkle 이전)
//   - zk-SNARKs (state commitments)
//   - Certificate revocation
//   - Libra/Diem (deprecated)
//   - Mina Protocol

// 장점:
//   - 결정론적 구조
//   - Parallel construction
//   - Incremental updates
//   - Non-membership proofs

// 단점:
//   - Merkle proof 크기 큼 (256 depths)
//   - Verkle Tree로 대체 중 (KZG commitments)

// Verkle Tree (차세대):
//   - Vector commitments (KZG)
//   - Branching factor 높음 (256-wide)
//   - Proof 훨씬 작음
//   - Ethereum Pectra 업그레이드 예정`}
        </pre>
      </div>
    </section>
  );
}
