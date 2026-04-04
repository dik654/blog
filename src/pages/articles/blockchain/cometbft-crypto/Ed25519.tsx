import { codeRefs } from './codeRefs';
import SignVerifyViz from './viz/SignVerifyViz';
import type { CodeRef } from '@/components/code/types';

export default function Ed25519({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ed25519" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Ed25519 서명 & 검증</h2>
      <div className="not-prose mb-8">
        <SignVerifyViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Ed25519 vs secp256k1</strong> — 이더리움은 secp256k1이지만 CometBFT는 Ed25519를 선택.<br />
          검증 속도 ~2배, batch verification 지원. 합의 라운드마다 수십 투표를 처리하는 BFT에 최적.
        </p>
      </div>
    </section>
  );
}
