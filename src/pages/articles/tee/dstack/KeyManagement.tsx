import KMSKeyViz from './viz/KMSKeyViz';
import KeyMgmtStepViz from './viz/KeyMgmtStepViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function KeyManagement({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="key-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '계층적 키 관리 시스템'}</h2>
      <div className="not-prose mb-8"><KMSKeyViz /></div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('key-derive', codeRefs['key-derive'])} />
          <span className="text-[10px] text-muted-foreground self-center">HKDF 키 유도</span>
          <CodeViewButton onClick={() => onCodeRef('ra-tls', codeRefs['ra-tls'])} />
          <span className="text-[10px] text-muted-foreground self-center">RA-TLS 인증서</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          dStack의 KMS는 HKDF-SHA256(HMAC 기반 키 유도 함수) 기반
          계층적 결정론적 키 유도를 제공합니다.<br />
          같은 App ID로 시작된 VM은 재시작 후에도 동일한 키를 받습니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <KeyMgmtStepViz />
      </div>
    </section>
  );
}
