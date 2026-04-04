import KMTrustViz from './viz/KMTrustViz';
import KeyManagerStepsViz from './viz/KeyManagerStepsViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function KeyManager({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="key-manager" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '키 매니저 & 런타임 보안'}</h2>
      <div className="not-prose mb-8"><KMTrustViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis의 키 매니저(Key Manager)는 기밀 ParaTime의 암호화 키를 관리하는
          특수 런타임입니다.<br />
          SGX 안에서 실행되며, 컨트랙트 키를 안전하게 파생합니다.<br />
          인증된 컴퓨트 노드에만 키를 제공합니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('km-secrets-api', codeRefs['km-secrets-api'])} />
            <span className="text-[10px] text-muted-foreground self-center">secrets/api.go · RPC 정의</span>
            <CodeViewButton onClick={() => onCodeRef('km-status', codeRefs['km-status'])} />
            <span className="text-[10px] text-muted-foreground self-center">Status · 시크릿 회전</span>
          </div>
        )}

        <h3>신뢰 체인 · 키 파생 · 키 요청 · dm-verity</h3>
      </div>
      <KeyManagerStepsViz />
    </section>
  );
}
