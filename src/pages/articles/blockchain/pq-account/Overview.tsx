import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">양자 위협 &amp; AA 해결책</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Shor 알고리즘은 이산 로그 문제를 다항 시간에 해결합니다.
          이더리움의 ECDSA(secp256k1)는 이산 로그에 기반하므로,
          충분한 큐비트의 양자 컴퓨터가 등장하면 <strong>공개키에서 개인키를 복원</strong>할 수 있습니다.
        </p>
        <p>
          해결책: <strong>격자 기반 서명(CRYSTALS-Dilithium)</strong>을 Account Abstraction과 결합합니다.
          AA 스마트 계정은 서명 검증 로직을 코드로 교체할 수 있으므로,
          ECDSA 대신 양자 내성 서명을 사용할 수 있습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('handle-ops', codeRefs['handle-ops'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleOps()</span>
          <CodeViewButton onClick={() => onCodeRef('dilithium-keygen', codeRefs['dilithium-keygen'])} />
          <span className="text-[10px] text-muted-foreground self-center">keygen()</span>
        </div>
      </div>
      <div className="mt-8"><ContextViz /></div>
    </section>
  );
}
