import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import AccountProofViz from './viz/AccountProofViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function AccountProof({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="account-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>verify_account_proof()</code>는 3단계로 어카운트를 검증한다.
          <br />
          주소 해시 → Merkle 증명 검증 → RLP 디코딩.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 StateProvider로 DB에서 직접 읽는다.
          <br />
          Helios는 RPC 응답의 증명을 state_root로 검증한다 — 신뢰 불필요.
        </p>
      </div>
      <div className="not-prose">
        <AccountProofViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-account-proof', codeRefs['hl-account-proof'])} />
          <span className="text-[10px] text-muted-foreground">proof.rs</span>
        </div>
      </div>
    </section>
  );
}
