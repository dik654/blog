import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function CodeSealing({ onCodeRef }: Props) {
  return (
    <section id="code-sealing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">코드: sgx_seal_data 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>sgx_seal_data_ex()</strong>는 세 단계로 동작합니다.
          <br />
          1) EGETKEY(policy)로 Seal Key 파생.
          <br />
          2) 하드웨어 난수로 12-byte IV 생성.
          <br />
          3) AES-128-GCM encrypt → 암호문 + MAC.
        </p>
        <p>
          <strong>sgx_unseal_data()</strong>는 역순입니다.
          <br />
          1) 저장된 key_request로 동일 Seal Key 재파생.
          <br />
          2) AES-128-GCM decrypt + MAC 검증.
          <br />
          3) MAC 일치 시 평문 반환, 불일치 시 SGX_ERROR_MAC_MISMATCH.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">에러 처리</h3>
        <p>
          <strong>SGX_ERROR_MAC_MISMATCH</strong>는 두 가지 원인이 있습니다.
          <br />
          첫째, 암호문이 디스크에서 변조된 경우.
          <br />
          둘째, 다른 enclave(다른 MRENCLAVE/MRSIGNER)에서 개봉을 시도한 경우.
          <br />
          두 경우 모두 파생된 Seal Key가 봉인 시와 다르므로 MAC이 불일치합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('seal-unseal', codeRefs['seal-unseal'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_seal_data_ex + sgx_unseal_data</span>
        </div>
      </div>
    </section>
  );
}
