import SealingViz from './viz/SealingViz';
import EGETKEYFlowViz from './viz/EGETKEYFlowViz';
import SealFlowViz from './viz/SealFlowViz';
import PolicyCompareViz from './viz/PolicyCompareViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Sealing({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sealing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 봉인 (EGETKEY + AES-GCM)</h2>
      <div className="not-prose mb-8">
        <SealingViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SGX의 <strong>데이터 봉인(Sealing)</strong>은 EGETKEY 하드웨어 명령어로
          CPU 바운드 키를 파생합니다.<br />
          이 키로 AES-256-GCM 암호화를 수행합니다.<br />
          재부팅 후에도 동일한 키가 파생되므로 디스크에 안전하게 저장할 수 있습니다.
        </p>

        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('key-request', codeRefs['key-request'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_key_request_t</span>
          <CodeViewButton onClick={() => onCodeRef('sealed-data', codeRefs['sealed-data'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_sealed_data_t</span>
          <CodeViewButton onClick={() => onCodeRef('report-body', codeRefs['report-body'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_report_body_t</span>
        </div>

        <h3>EGETKEY — CPU 바운드 키 파생</h3>
      </div>
      <div className="not-prose mb-6">
        <EGETKEYFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>sgx_seal_data — AES-GCM 봉인 흐름</h3>
      </div>
      <div className="not-prose mb-6">
        <SealFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>MRENCLAVE vs MRSIGNER 봉인 정책</h3>
      </div>
      <div className="not-prose mb-6">
        <PolicyCompareViz />
      </div>
    </section>
  );
}
