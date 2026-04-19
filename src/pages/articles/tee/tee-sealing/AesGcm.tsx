import AesGcmViz from './viz/AesGcmViz';
import GcmModeViz from './viz/GcmModeViz';
import SealProcessViz from './viz/SealProcessViz';
import UnsealProcessViz from './viz/UnsealProcessViz';
import SealedDataStructViz from './viz/SealedDataStructViz';
import KeyRotationViz from './viz/KeyRotationViz';

export default function AesGcm() {
  return (
    <section id="aes-gcm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AES-GCM 봉인/개봉 흐름</h2>
      <div className="not-prose mb-8"><AesGcmViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">AEAD — 기밀성 + 무결성</h3>
        <p>
          <strong>AES-128-GCM</strong>: 실제 sealing에서 사용되는 AEAD 알고리즘<br />
          <strong>AEAD</strong>(Authenticated Encryption with Associated Data): 기밀성 + 무결성 동시 제공<br />
          <strong>하드웨어 가속</strong>: AES-NI + PCLMULQDQ로 매우 빠름<br />
          <strong>NIST SP 800-38D</strong> 표준 — 방대한 검증
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GCM 모드 동작 원리</h3>
        <div className="not-prose mb-6"><GcmModeViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">봉인 과정 상세</h3>
        <div className="not-prose mb-6"><SealProcessViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">개봉 과정 — MAC 검증 우선</h3>
        <div className="not-prose mb-6"><UnsealProcessViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">sealed_data_t 구조체</h3>
        <div className="not-prose mb-6"><SealedDataStructViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">고급: Sealing + Key Rotation</h3>
        <div className="not-prose mb-6"><KeyRotationViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: IV를 왜 0으로 고정했나</p>
          <p>
            <strong>일반적 GCM 사용</strong>:<br />
            - 각 메시지마다 random IV (96-bit)<br />
            - Nonce reuse 절대 금지 (catastrophic failure)
          </p>
          <p className="mt-2">
            <strong>SGX sealing의 특수성</strong>:<br />
            - KeyID가 32B (256-bit) 랜덤<br />
            - (Key, KeyID) 쌍 자체가 유니크<br />
            - 동일 Key로 여러 번 seal해도 KeyID가 다르므로 Seal Key 다름<br />
            - 따라서 IV는 고정 가능
          </p>
          <p className="mt-2">
            <strong>이점</strong>:<br />
            ✓ IV 저장 불필요 (12B 절약)<br />
            ✓ 구현 단순화<br />
            ✓ 보안 동일 (KeyID가 effective nonce)
          </p>
          <p className="mt-2">
            <strong>주의</strong>:<br />
            ✗ Intel SGX SDK 외부에서 seal 구현 시 이 trick 주의<br />
            ✗ KeyID 생성이 random하지 않으면 위험<br />
            ✗ 다른 TEE(TDX, CCA)는 다른 convention 사용
          </p>
        </div>

      </div>
    </section>
  );
}
