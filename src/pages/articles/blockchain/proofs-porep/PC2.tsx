import { codeRefs } from './codeRefs';
import PC2DetailViz from './viz/PC2DetailViz';
import type { CodeRef } from '@/components/code/types';

export default function PC2({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pc2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PreCommit2: 칼럼 해시 + 트리 R</h2>
      <div className="not-prose mb-8">
        <PC2DetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 왜 Poseidon인가?</strong> — SHA256은 비트 연산 → ZK 회로 비효율
          <br />
          Poseidon은 유한체 산술 연산 → SNARK 회로 크기 수백 배 감소
        </p>
      </div>
    </section>
  );
}
