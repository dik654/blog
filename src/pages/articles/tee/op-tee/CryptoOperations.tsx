import CryptoOperationsViz from './viz/CryptoOperationsViz';
import CryptoStateViz from './viz/CryptoStateViz';
import KeyObjViz from './viz/KeyObjViz';
import AesTaCodeViz from './viz/AesTaCodeViz';
import CrypStateLifecycleViz from './viz/CrypStateLifecycleViz';
import KeyObjectStructViz from './viz/KeyObjectStructViz';

export default function CryptoOperations() {
  return (
    <section id="crypto-operations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 연산 &amp; 보안 키 저장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">GlobalPlatform Crypto API</h3>
        <p>
          <strong>GP TEE Internal Core API</strong>: TA가 사용하는 표준 암호 API<br />
          <strong>제공 기능</strong>: AES, RSA, ECC, SHA, HMAC, HKDF, AEAD 전체<br />
          <strong>HW 가속</strong>: CAAM(NXP), CE(Rockchip), Crypto Engine 자동 활용<br />
          <strong>Fallback</strong>: mbedTLS / LibTomCrypt (소프트웨어 구현)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TA에서 AES 암호화 예</h3>
      </div>
      <div className="not-prose mb-6"><AesTaCodeViz /></div>
      <CryptoOperationsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">지원 알고리즘 카탈로그</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">알고리즘</th>
                <th className="border border-border px-3 py-2 text-left">HW 가속 (대표)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Symmetric</td>
                <td className="border border-border px-3 py-2">AES (CBC/ECB/CTR/XTS/GCM/CCM), DES, 3DES</td>
                <td className="border border-border px-3 py-2">CAAM, AES-NI</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Hash</td>
                <td className="border border-border px-3 py-2">SHA-1, SHA-2 (224/256/384/512), SHA-3, MD5</td>
                <td className="border border-border px-3 py-2">SHA engine</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">MAC</td>
                <td className="border border-border px-3 py-2">HMAC, CMAC, GMAC</td>
                <td className="border border-border px-3 py-2">부분 가속</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Asymmetric</td>
                <td className="border border-border px-3 py-2">RSA-2048/3072/4096, DSA, DH</td>
                <td className="border border-border px-3 py-2">PKA engine</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ECC</td>
                <td className="border border-border px-3 py-2">P-256/384/521, Curve25519</td>
                <td className="border border-border px-3 py-2">ECDSA accelerator</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AEAD</td>
                <td className="border border-border px-3 py-2">AES-GCM, AES-CCM, ChaCha20-Poly1305</td>
                <td className="border border-border px-3 py-2">CAAM (일부)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Random</td>
                <td className="border border-border px-3 py-2">TRNG, DRBG</td>
                <td className="border border-border px-3 py-2">TRNG HW</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">암호화 상태 관리 (tee_svc_cryp.c)</h3>
      </div>
      <div className="not-prose mb-6"><CryptoStateViz /></div>
      <div className="not-prose mb-6"><CrypStateLifecycleViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 키 객체 & HW 가속 선택</h3>
      </div>
      <div className="not-prose mb-6"><KeyObjViz /></div>
      <div className="not-prose mb-6"><KeyObjectStructViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: HUK(Hardware Unique Key)의 역할</p>
          <p>
            <strong>HUK 정의</strong>:<br />
            - 칩 제조 시 eFuse에 burn된 256-bit 고유 값<br />
            - Intel SGX Root Seal Key의 ARM 버전<br />
            - SW로 직접 읽기 불가
          </p>
          <p className="mt-2">
            <strong>HUK 사용</strong>:<br />
            - Secure Storage 암호화 키 파생<br />
            - Per-TA persistent key generation<br />
            - Attestation key seed<br />
            - Device identity root
          </p>
          <p className="mt-2">
            <strong>파생 예시</strong>:<br />
            <code>TA_key = HKDF(HUK, "TA:" + TA_UUID)</code><br />
            - 다른 TA: 다른 key (격리)<br />
            - 다른 device: 다른 HUK → 다른 key (device binding)<br />
            - 같은 device, 같은 TA: 결정적 (복구 가능)
          </p>
          <p className="mt-2">
            <strong>보안 의의</strong>:<br />
            - HUK 추출 공격은 물리 decapping 필요<br />
            - 현대 칩은 anti-tamper 보호<br />
            - 수만 달러 장비 + 수주 시간 → 실전 위협 낮음
          </p>
        </div>

      </div>
    </section>
  );
}
