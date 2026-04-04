import SGXAttestViz from './viz/SGXAttestViz';
import SGXAttestFlowViz from './viz/SGXAttestFlowViz';
import EREPORTFlowViz from './viz/EREPORTFlowViz';
import QuoteGenViz from './viz/QuoteGenViz';
import DCAPVerifyViz from './viz/DCAPVerifyViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Attestation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 (EREPORT → Quote)</h2>
      <div className="not-prose mb-8"><SGXAttestViz /></div>
      <div className="not-prose mb-8">
        <h3 className="text-lg font-semibold mb-3">증명 시퀀스 플로우</h3>
        <SGXAttestFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SGX 원격 증명은 <strong>EREPORT</strong> 하드웨어 명령어로 로컬 증명 보고서를 생성합니다.<br />
          AESM 데몬이 QE(Quoting Enclave)를 통해 원격 검증자가 확인 가능한{' '}
          <strong>Quote</strong>로 변환합니다.
        </p>

        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('target-info', codeRefs['target-info'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_target_info_t</span>
          <CodeViewButton onClick={() => onCodeRef('quote-structure', codeRefs['quote-structure'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_quote_t</span>
          <CodeViewButton onClick={() => onCodeRef('att-key-id', codeRefs['att-key-id'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_ql_att_key_id_t</span>
          <CodeViewButton onClick={() => onCodeRef('report-body', codeRefs['report-body'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_report_body_t</span>
        </div>

        <h3>1단계: EREPORT — 로컬 증명</h3>
      </div>
      <div className="not-prose mb-6">
        <EREPORTFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>2단계: Architecture Enclaves &amp; Quote 생성</h3>
      </div>
      <div className="not-prose mb-6">
        <QuoteGenViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>3단계: Intel PCS 검증 (DCAP)</h3>
      </div>
      <div className="not-prose mb-6">
        <DCAPVerifyViz />
      </div>
    </section>
  );
}
