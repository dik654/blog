import TDXQuoteViz from './viz/TDXQuoteViz';
import AttestationStepViz from './viz/AttestationStepViz';
import QuoteGenViz from './viz/QuoteGenViz';
import KmsPolicyViz from './viz/KmsPolicyViz';
import RaTlsCertViz from './viz/RaTlsCertViz';
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

        <h3 className="text-xl font-semibold mt-6 mb-3">dstack Attestation 체계</h3>
        <p>
          <strong>Quote 생성</strong>: Guest agent가 Intel TDX로부터 quote 발급<br />
          <strong>KMS 검증</strong>: Phala KMS가 quote 검증 + 정책 매치<br />
          <strong>Secret 발급</strong>: 검증 통과 시 app-specific 암호키·secrets 전달<br />
          <strong>RA-TLS</strong>: 외부 사용자가 dstack VM과 통신 시 attestation 내장 TLS
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Quote 생성 — Guest 측</h3>
      </div>
      <div className="not-prose mb-6"><QuoteGenViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">KMS 정책 기반 키 발급</h3>
      </div>
      <div className="not-prose mb-6"><KmsPolicyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">RA-TLS 인증서 구조</h3>
      </div>
      <div className="not-prose mb-6"><RaTlsCertViz /></div>
      <div className="not-prose mt-6">
        <AttestationStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: dstack vs kata confidential</p>
          <p>
            <strong>공통점</strong>:<br />
            - Intel TDX 사용<br />
            - Container workload 지원<br />
            - Attestation 통합
          </p>
          <p className="mt-2">
            <strong>dstack 특화</strong>:<br />
            ✓ Docker Compose 직접 지원<br />
            ✓ KMS 기본 포함<br />
            ✓ RA-TLS 즉시 사용<br />
            ✓ 단일 VM에 여러 containers
          </p>
          <p className="mt-2">
            <strong>Kata Confidential Containers</strong>:<br />
            ✓ Kubernetes native<br />
            ✓ Pod = TDX VM 단위<br />
            ✓ CRI-compatible<br />
            ✓ Cluster-scale 운영
          </p>
          <p className="mt-2">
            <strong>선택 기준</strong>:<br />
            - Web3·AI agent 단일 서비스: dstack<br />
            - Enterprise K8s 워크로드: Kata CoCo<br />
            - 둘 다 confidential-containers 프로젝트 우산 아래
          </p>
        </div>

      </div>
    </section>
  );
}
