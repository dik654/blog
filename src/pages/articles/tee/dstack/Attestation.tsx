import TDXQuoteViz from './viz/TDXQuoteViz';
import AttestationStepViz from './viz/AttestationStepViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function DstackAttestation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="tdx-attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'TDX Quote & RA-TLS'}</h2>
      <div className="not-prose mb-8"><TDXQuoteViz /></div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('tdx-quote-gen', codeRefs['tdx-quote-gen'])} />
          <span className="text-[10px] text-muted-foreground self-center">get_quote() 생성</span>
          <CodeViewButton onClick={() => onCodeRef('tdx-verify', codeRefs['tdx-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">verify_tdx_quote()</span>
          <CodeViewButton onClick={() => onCodeRef('ra-tls', codeRefs['ra-tls'])} />
          <span className="text-[10px] text-muted-foreground self-center">RA-TLS 인증서</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          dStack 신뢰 체계 — Intel TDX Quote 중심 구성<br />
          Guest Agent가 TDX 하드웨어로부터 Quote(증명 보고서) 발급<br />
          KMS가 Quote 검증 후 애플리케이션 키 제공
        </p>
      </div>
      <div className="not-prose mt-6">
        <AttestationStepViz />
      </div>
    </section>
  );
}
