import { codeRefs } from './codeRefs';
import NonceViz from './viz/NonceViz';
import type { CodeRef } from '@/components/code/types';

export default function NonceManagement({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="nonce-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Nonce 관리</h2>
      <div className="not-prose mb-8">
        <NonceViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 마이너의 Nonce 부담</strong> — WindowPoSt, PreCommit 등 대량 메시지 발송
          <br />
          MpoolPushMessage가 자동 nonce 할당으로 갭 방지
        </p>
      </div>
    </section>
  );
}
