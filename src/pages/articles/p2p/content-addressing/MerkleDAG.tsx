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
      </div>
    </section>
  );
}
