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
          <CodeViewButton codeKey="rg-commitment" codeRef={codeRefs['rg-commitment']} onClick={onCodeRef} />
        </p>
        <p className="leading-7">
          commitment는 Merkle tree에 삽입된다. depth=16, 최대 65,536개 leaf.
          <br />
          <code>insertLeaf()</code>는 leaf 삽입 후 형제 노드와 해시를 반복해서 root를 재계산한다.
          <CodeViewButton codeKey="rg-merkle" codeRef={codeRefs['rg-merkle']} onClick={onCodeRef} />
        </p>
      </div>
      <div className="not-prose"><CommitmentViz /></div>
    </section>
  );
}
