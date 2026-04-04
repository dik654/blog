import type { CodeRef } from '@/components/code/types';
import ProofDBViz from './viz/ProofDBViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProofDB({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="proof-db" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Helios는 revm의 <code>Database</code> trait을 구현한 ProofDB를 사용한다.
          EVM이 상태에 접근하면 ProofDB가 RPC에 증명을 요청하고 검증 후 값을 반환한다.
          EVM 코드는 Reth와 동일하고, DB 레이어만 교체된다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ProofDBViz />
      </div>
    </section>
  );
}
