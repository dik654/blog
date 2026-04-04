import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PrivateRPCViz from './viz/PrivateRPCViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PrivateRPC({ onCodeRef }: Props) {
  return (
    <section id="private-rpc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프라이빗 RPC: ORAM & TEE</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ORAM(Oblivious RAM) — 실제 쿼리에 더미 쿼리를 섞어 보낸다.
          <br />
          서버 시점에서 K+1개 쿼리 중 어떤 것이 진짜인지 구별할 수 없다.
        </p>
        <p className="leading-7">
          식별 확률 = <code>1/(K+1)</code>. K=7이면 Pr = 12.5%.
          <br />
          K를 늘리면 프라이버시 강화, 대신 대역폭이 K배 증가한다.
        </p>
        <p className="leading-7">
          TEE(Trusted Execution Environment) 환경에서는 ORAM 프록시 자체를 enclave에서 실행한다.
          <br />
          서버 운영자도 쿼리 내용을 볼 수 없다.
        </p>
      </div>
      <div className="not-prose">
        <PrivateRPCViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('kh-oram', codeRefs['kh-oram'])} />
          <span className="text-[10px] text-muted-foreground">oram.rs</span>
        </div>
      </div>
    </section>
  );
}
