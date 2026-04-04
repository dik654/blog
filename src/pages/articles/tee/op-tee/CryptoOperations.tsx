import CryptoOperationsViz from './viz/CryptoOperationsViz';
import CryptoStateViz from './viz/CryptoStateViz';
import KeyObjViz from './viz/KeyObjViz';

export default function CryptoOperations() {
  return (
    <section id="crypto-operations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 연산 & 보안 키 저장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          OP-TEE는 <strong>GlobalPlatform TEE Internal Core API</strong>를 구현하여
          TA(Trusted Application)에 AES, RSA, ECC, SHA 등 표준 암호화 기능을 제공합니다.<br />
          HW 가속 엔진(CAAM, Crypto Engine)이 있으면 자동으로 활용합니다.<br />
          없으면 mbedTLS/LibTomCrypt로 소프트웨어 처리합니다.
        </p>
      </div>

      <CryptoOperationsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>암호화 상태 관리 (tee_svc_cryp.c)</h3>
      </div>
      <div className="not-prose mb-6"><CryptoStateViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>보안 키 객체 & HW 가속 선택</h3>
      </div>
      <div className="not-prose mb-6"><KeyObjViz /></div>
    </section>
  );
}
