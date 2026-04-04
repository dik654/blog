import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import Groth16Viz from './viz/Groth16Viz';

export default function Groth16Verify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="groth16-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Groth16 Verify — 증명 & 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Prover는 오프체인에서 witness를 R1CS → QAP로 변환한 뒤, 증명(A, B, C)을 생성한다.
          <br />
          증명 크기는 192 bytes. 검증 시간은 일정하다(O(1)).
          <CodeViewButton codeKey="rg-verifier" codeRef={codeRefs['rg-verifier']} onClick={onCodeRef} />
        </p>
        <p className="leading-7">
          Verifier는 온체인에서 페어링 검증을 수행한다.
          <br />
          <code>e(A,B) == e(α,β) · e(vk_x,γ) · e(C,δ)</code>.
          EVM precompile(0x06, 0x07, 0x08)을 사용해서 약 250,000 gas가 든다.
        </p>
      </div>
      <div className="not-prose"><Groth16Viz /></div>
    </section>
  );
}
