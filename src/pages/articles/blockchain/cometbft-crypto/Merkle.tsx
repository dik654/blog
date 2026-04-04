import { codeRefs } from './codeRefs';
import MerkleProofViz from './viz/MerkleProofViz';
import type { CodeRef } from '@/components/code/types';

export default function Merkle({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="merkle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle 증명 & HashFromByteSlices</h2>
      <div className="not-prose mb-8">
        <MerkleProofViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 getSplitPoint의 역할</strong> — 단순 len/2 분할 시 불균형 트리가 된다.<br />
          가장 가까운 2의 거듭제곱으로 분할 → 항상 균형 트리 → 증명 크기 O(log n) 보장.
        </p>
      </div>
    </section>
  );
}
