import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KeyManagement({ onCodeRef }: Props) {
  return (
    <section id="key-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 관리 (Keymanager)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('run-client', codeRefs['run-client'])} />
          <span className="text-[10px] text-muted-foreground self-center">RunClient() — 키매니저 초기화</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Keymanager 추상화</strong> — 로컬 파일, Web3Signer, 파생 키(EIP-2334) 등 다양한 방식 지원<br />
          EIP-2335 키스토어: AES-128-CTR + Scrypt로 암호화된 JSON 파일<br />
          --web3signer-url로 외부 서명 서비스 사용 시 키가 바이너리에 존재하지 않음
        </p>
      </div>
    </section>
  );
}
