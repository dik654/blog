import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import CommitmentViz from './viz/CommitmentViz';

export default function Commitment({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Commitment — Poseidon & Merkle</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>hashCommitment()</code>는 Note 4개 필드를 Poseidon 해시로 압축한다.
          <br />
          Poseidon은 ZK-friendly 해시다. 소수 필드 위 산술 연산만 사용해서 R1CS 제약이 적다.
          <CodeViewButton onClick={() => onCodeRef('rg-commitment', codeRefs['rg-commitment'])} />
        </p>
        <p className="leading-7">
          commitment는 Merkle tree에 삽입된다. depth=16, 최대 65,536개 leaf.
          <br />
          <code>insertLeaf()</code>는 leaf 삽입 후 형제 노드와 해시를 반복해서 root를 재계산한다.
          <CodeViewButton onClick={() => onCodeRef('rg-merkle', codeRefs['rg-merkle'])} />
        </p>
      </div>
      <div className="not-prose"><CommitmentViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Incremental Merkle Tree</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// RAILGUN Merkle tree 특성
// - Depth: 16 (65,536 leaves per tree)
// - Hash: Poseidon
// - Incremental (insert-only)
// - Empty leaves = pre-computed zero values

// Structure
// Leaf level (depth 16): commitments
// Intermediate: Poseidon(left, right)
// Root (depth 0): 단일 값

// Insert 알고리즘
function insertLeaf(commitment) {
    let current = commitment;
    let index = nextLeafIndex++;

    for (let level = 0; level < DEPTH; level++) {
        if (index % 2 == 0) {
            // Left child: save for pairing
            filledSubtrees[level] = current;
            current = Poseidon(current, ZEROS[level]);
        } else {
            // Right child: pair with stored left
            current = Poseidon(filledSubtrees[level], current);
        }
        index >>= 1;
    }

    roots[rootHistoryIndex++] = current;
}

// 최적화
// 1) filledSubtrees[] 배열로 log N storage
// 2) ZEROS[] precomputed zero hashes
// 3) Root history (recent roots 기억)
// 4) User는 full tree 저장 불필요

// Tree overflow
// 65,536 leaves 차면 새 tree 생성
// Multiple trees → longer Merkle proof path
// 실전에선 충분 (block당 수 개 commit)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Zero Hash 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 문제: Empty leaves도 hash 필요
// Naive: 매 insert마다 65,535 empty hashes 재계산

// 해결: Pre-computed zero hashes
// ZEROS[0] = 0 (empty leaf sentinel)
// ZEROS[1] = Poseidon(0, 0)
// ZEROS[2] = Poseidon(ZEROS[1], ZEROS[1])
// ...
// ZEROS[16] = empty tree's root

// Contract deployment 시 한 번만 계산
uint256[] private ZEROS = [
    0x0,
    0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864,
    0x1069673dcdb12263df301a6ff584a7ec261a44cb9dc68df067a4774460b1f1e1,
    // ... total 17 values
];

// Insert 시 ZEROS 재사용
// → O(log N) 계산 per insert
// → Gas cost 거의 일정

// 고정 cost
// Insert gas: ~100K (16 levels × 6K gas)
// 대안: 동적 zero tree → 수 MB gas`}</pre>

      </div>
    </section>
  );
}
