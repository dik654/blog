import StorageSystemViz from './viz/StorageSystemViz';
import MKVSTreeViz from './viz/MKVSTreeViz';

export default function StorageSystem() {
  return (
    <section id="storage-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스토리지 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>MKVS</strong>(Merklized Key-Value Store): Runtime 상태의 저장·증명 구조<br />
          <strong>Merkle Patricia Trie</strong> 변형 — 모든 키에 대해 암호학적 inclusion proof<br />
          <strong>BadgerDB</strong> 백엔드 + LRU 캐시 + Write-through 로그<br />
          <strong>Checkpoint</strong> 시스템 — 주기적 스냅샷으로 새 노드 빠른 sync
        </p>
      </div>

      <StorageSystemViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">MKVS 트리 구조</h3>
      </div>
      <MKVSTreeViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// go/storage/mkvs/node/node.go

// 노드 3종
type Node interface {
    GetHash() Hash
    IsClean() bool
}

// 1) InternalNode — 브랜치
type InternalNode struct {
    Hash      Hash
    Label     []byte          // 공유 prefix
    LabelBitLength int
    LeafNode  *Pointer        // 이 prefix에 매칭되는 leaf
    Left      *Pointer        // 0 branch
    Right     *Pointer        // 1 branch
}

// 2) LeafNode — 실제 값
type LeafNode struct {
    Hash   Hash
    Key    []byte
    Value  []byte
}

// 해시 계산
// H(InternalNode) = H(label || H(leafNode) || H(left) || H(right))
// H(LeafNode)    = H(key || value)

// Pointer — lazy loading 지원
type Pointer struct {
    Clean bool
    Hash  Hash
    Node  Node    // nil이면 DB에서 로드 필요
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Insert 연산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/storage/mkvs/tree_insert.go

func (t *tree) Insert(key []byte, value []byte) (*Node, error) {
    // 1) Root에서 시작하여 key bit 따라 descend
    node := t.root
    depth := 0

    for node != nil {
        switch n := node.(type) {
        case *InternalNode:
            // 공유 prefix 비교
            commonLen := countCommonBits(key[depth:], n.Label)
            if commonLen < n.LabelBitLength {
                // 분기 필요: InternalNode 쪼개기
                return splitInternal(n, key, value, depth, commonLen)
            }
            depth += commonLen
            if getBit(key, depth) == 0 {
                node = n.Left.Node
            } else {
                node = n.Right.Node
            }

        case *LeafNode:
            if bytes.Equal(n.Key, key) {
                // 기존 키 업데이트
                n.Value = value
                n.Hash = hashLeaf(n)
                return n, nil
            }
            // 새 분기 생성
            return branchLeaf(n, key, value, depth)
        }
    }

    // 빈 위치 → 새 LeafNode
    return newLeafNode(key, value), nil
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Merkle Proof 생성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Light client가 특정 키의 값 증명 받을 때

type Proof struct {
    UntrustedRoot Hash
    Entries       []ProofEntry
}

type ProofEntry struct {
    Kind      ProofEntryKind  // Internal, Leaf, Hash
    InternalNode *InternalNode
    LeafNode  *LeafNode
    HashData  Hash
}

// 검증 흐름
// 1) Root에서 시작, proof entries를 순회
// 2) 각 entry로 노드 재구성 → hash 계산
// 3) 최종 hash == UntrustedRoot 검증
// 4) 매칭되는 LeafNode의 value 반환

// 용도
// - 라이트 클라이언트 상태 쿼리
// - Cross-chain 메시지 증명
// - Rollup 분쟁 해결`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Checkpoint 시스템</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/storage/mkvs/checkpoint/

// 주기적 스냅샷 (예: 10000 라운드마다)
checkpointInterval := 10000

// Checkpoint 구조
type Metadata struct {
    Version    uint16
    Namespace  Namespace
    Root       Root
    ChunkSize  uint64        // 기본 16MB
    NumChunks  uint64
    ChunkHashes []Hash
}

// 생성
func (c *Checkpointer) Create(ctx context.Context, root Root) error {
    // 1) Tree를 chunk로 직렬화
    chunks := serializeTree(root, ChunkSize)

    // 2) 각 chunk 해시
    hashes := make([]Hash, len(chunks))
    for i, chunk := range chunks {
        hashes[i] = hash(chunk)
    }

    // 3) Metadata 저장
    metadata := &Metadata{
        Root:        root,
        NumChunks:   len(chunks),
        ChunkHashes: hashes,
    }
    saveMetadata(metadata)

    // 4) Chunks P2P 배포
    publishChunks(chunks)
}

// 새 노드가 sync 시
// 1) 최신 checkpoint metadata 다운로드
// 2) Chunks 병렬 수집 (hash로 검증)
// 3) Tree 재구성 → 즉시 최신 상태
// 4) 블록별 replay 불필요`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MKVS vs MPT vs IAVL</p>
          <p>
            <strong>Ethereum MPT</strong>: 16-ary (radix 16), RLP 인코딩, 깊이 큼<br />
            <strong>Cosmos IAVL</strong>: AVL-balanced binary, 회전 연산, 버전 branching<br />
            <strong>Oasis MKVS</strong>: binary trie with path compression
          </p>
          <p className="mt-2">
            <strong>MKVS 선택 이유</strong>:<br />
            ✓ 단순 구조 — 구현·검증 용이<br />
            ✓ Proof 크기 작음 — binary + compression<br />
            ✓ 데이터베이스 백엔드 비의존적 (BadgerDB 교체 가능)<br />
            ✓ 동시성 — COW(Copy-on-Write)로 여러 version 병렬
          </p>
          <p className="mt-2">
            <strong>성능</strong>:<br />
            - Insert: O(log n) with path compression<br />
            - Proof: O(log n) entries<br />
            - Checkpoint: O(n) but 주기적이라 amortized
          </p>
        </div>

      </div>
    </section>
  );
}
