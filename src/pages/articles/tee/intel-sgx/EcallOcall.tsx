import SGXCallFlow from '../../blockchain/components/SGXCallFlow';
import EDLViz from './viz/EDLViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function EcallOcall({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ecall-ocall" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECALL / OCALL 경계</h2>
      <div className="not-prose mb-8">
        <SGXCallFlow />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SGX는 신뢰 경계를 <strong>ECALL</strong>(호스트 → 엔클레이브)과{' '}
          <strong>OCALL</strong>(엔클레이브 → 호스트)로 명확히 구분합니다.<br />
          Edger8r(코드 생성기)가 EDL 파일을 파싱해 양쪽의 마샬링 코드를 자동 생성합니다.
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">EDL (Enclave Definition Language)</h3>
      <div className="not-prose mb-8"><EDLViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('is-ecall-allowed', codeRefs['is-ecall-allowed'])} />
          <span className="text-[10px] text-muted-foreground self-center">is_ecall_allowed()</span>
          <CodeViewButton onClick={() => onCodeRef('trts-ecall', codeRefs['trts-ecall'])} />
          <span className="text-[10px] text-muted-foreground self-center">trts_ecall()</span>
          <CodeViewButton onClick={() => onCodeRef('do-ecall', codeRefs['do-ecall'])} />
          <span className="text-[10px] text-muted-foreground self-center">do_ecall()</span>
          <CodeViewButton onClick={() => onCodeRef('sgx-ocall', codeRefs['sgx-ocall'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_ocall()</span>
          <CodeViewButton onClick={() => onCodeRef('do-oret', codeRefs['do-oret'])} />
          <span className="text-[10px] text-muted-foreground self-center">do_oret()</span>
          <CodeViewButton onClick={() => onCodeRef('ocall-context', codeRefs['ocall-context'])} />
          <span className="text-[10px] text-muted-foreground self-center">ocall_context_t</span>
          <CodeViewButton onClick={() => onCodeRef('ecall-table', codeRefs['ecall-table'])} />
          <span className="text-[10px] text-muted-foreground self-center">ecall_table_t</span>
        </div>
      </div>
    </section>
  );
}
