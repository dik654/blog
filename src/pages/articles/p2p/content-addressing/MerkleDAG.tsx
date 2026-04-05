import MerkleDAGViz from './viz/MerkleDAGViz';
import CodePanel from '@/components/ui/code-panel';

const dagCode = `// Merkle DAG (Directed Acyclic Graph)
// 각 노드 = (데이터, [링크 목록])
// 링크 = CID (자식 노드의 내용 해시)

// 예시: 디렉토리 구조
// Root (CID: bafyA)
//   ├── readme.md  (CID: bafyB)  — leaf 노드
//   └── src/       (CID: bafyC)  — 중간 노드
//       ├── main.rs (CID: bafyD) — leaf 노드
//       └── lib.rs  (CID: bafyE) — leaf 노드

// 핵심 특성:
//   1. 불변(Immutable) — 내용 변경 → CID 변경 → 부모 CID도 변경
//   2. 중복 제거(Dedup) — 같은 내용 = 같은 CID = 한 번만 저장
//   3. 증분 전송(Incremental) — 변경된 노드만 전송
//   4. 무결성 검증 — 루트 CID로 전체 트리 검증 가능`;

const dagAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [1, 3], color: 'sky', note: '블록(데이터) + 링크(CID)로 구성' },
  { lines: [5, 10], color: 'emerald', note: 'Unix 파일시스템을 DAG로 표현' },
  { lines: [12, 16], color: 'amber', note: '4가지 핵심 특성' },
];

export default function MerkleDAG() {
  return (
    <section id="merkle-dag" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle DAG</h2>
      <div className="not-prose mb-8"><MerkleDAGViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Merkle DAG는 각 노드가 자식의 CID를 링크로 가지는 방향성 비순환 그래프입니다.<br />
          하위 노드가 변경되면 해시가 바뀌고, 이는 부모 노드의 CID까지 연쇄적으로 변경합니다.<br />
          Git의 커밋 트리도 Merkle DAG의 일종입니다.
        </p>
        <CodePanel title="Merkle DAG 구조" code={dagCode}
          annotations={dagAnnotations} />
        <p className="leading-7">
          IPFS Kubo는 UnixFS(dag-pb)로 파일을 Merkle DAG로 청킹합니다.<br />
          iroh는 BLAKE3 기반 해시 트리로 유사한 구조를 사용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle DAG 실무</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// IPFS UnixFS Chunking
//
// 파일 청킹 전략:
//
// 1. Fixed-size chunks (기본)
//    256 KB 또는 1 MB
//    - 단순, 예측 가능
//    - 같은 파일 → 같은 CIDs
//
// 2. Rabin fingerprinting
//    Content-defined chunking
//    - Sliding window hash
//    - 중간 삽입/삭제에 내성
//    - 다른 파일 간 dedup 가능
//
// 3. Buzhash
//    더 빠른 rolling hash
//    - Rabin 대안
//
// DAG 구조:
//
// Small file (< 256KB):
//   single node with raw content
//
// Large file:
//         Root DAG
//        /  |  |  \\
//    [chunk1] [chunk2] [chunk3] ...
//
//   또는 balanced tree:
//         Root
//        /    \\
//    Sub1    Sub2
//    /  \\    /  \\
//   C1  C2  C3  C4

// Directory 구조:
//   UnixFS directory = dag-pb node
//   각 link = (name, CID, size)
//
// Filesystem 예:
//   /docs
//     /readme.md → bafkXXX
//     /tutorial
//       /intro.md → bafkYYY
//       /advanced.md → bafkZZZ

// 변경 시 업데이트:
//   1. advanced.md 변경
//   2. 새 CID 생성
//   3. tutorial 디렉토리 CID 변경
//   4. /docs 디렉토리 CID 변경
//   5. Root CID 변경
//
//   → 변경된 path만 새 CID
//   → 다른 파일 CID는 그대로 (dedup)

// iroh BLAKE3 Bao:
//   Binary tree Merkle structure
//   4KB chunks
//   BLAKE3 parallel hashing
//   Streaming verification
//
// Git 비교:
//   Git blob = file content hash
//   Git tree = directory node
//   Git commit = top node with metadata
//   → Git은 Merkle DAG의 초기 실용 사례`}
        </pre>
      </div>
    </section>
  );
}
