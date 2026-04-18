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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">RAILGUN Merkle Tree 특성</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">Depth</p><p className="font-mono font-semibold">16</p></div>
              <div><p className="text-muted-foreground">Max Leaves</p><p className="font-mono font-semibold">65,536</p></div>
              <div><p className="text-muted-foreground">Hash</p><p className="font-mono font-semibold">Poseidon</p></div>
              <div><p className="text-muted-foreground">Mode</p><p className="font-mono font-semibold">Insert-only</p></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Insert 알고리즘 (<code>insertLeaf</code>)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>current = commitment</code>, <code>index = nextLeafIndex++</code></li>
                <li>level 0 &rarr; 15 순회:</li>
                <li>&bull; <code>index % 2 == 0</code> (left child) &rarr; <code>filledSubtrees[level] = current</code>, <code>Poseidon(current, ZEROS[level])</code></li>
                <li>&bull; <code>index % 2 == 1</code> (right child) &rarr; <code>Poseidon(filledSubtrees[level], current)</code></li>
                <li>&bull; <code>index &gt;&gt;= 1</code></li>
                <li>결과: <code>roots[rootHistoryIndex++] = current</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">최적화 기법</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>filledSubtrees[]</code> 배열로 <strong>O(log N)</strong> storage</li>
                <li><code>ZEROS[]</code> precomputed zero hashes</li>
                <li>Root history &mdash; recent roots 기억</li>
                <li>User는 full tree 저장 불필요</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">65,536 leaves 초과 시 새 tree 생성. 실전에선 block당 수 개 commit으로 충분.</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Zero Hash 최적화</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">문제</p>
              <p className="text-sm text-muted-foreground">Empty leaves도 hash 필요. Naive 접근은 매 insert마다 65,535 empty hashes를 재계산 &mdash; 비현실적.</p>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">해결: Pre-computed Zero Hashes</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>ZEROS[0] = 0</code> (empty leaf sentinel)</li>
                <li><code>ZEROS[1] = Poseidon(0, 0)</code></li>
                <li><code>ZEROS[2] = Poseidon(ZEROS[1], ZEROS[1])</code></li>
                <li>... <code>ZEROS[16]</code> = empty tree root</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Gas 비용 비교</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">배포 시</p><p className="font-mono">17개 값 1회 계산</p></div>
              <div><p className="text-muted-foreground">Insert당</p><p className="font-mono font-semibold">~100K gas</p><p className="text-xs text-muted-foreground">16 levels x 6K gas</p></div>
              <div><p className="text-muted-foreground">복잡도</p><p className="font-mono font-semibold">O(log N)</p><p className="text-xs text-muted-foreground">거의 일정</p></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
