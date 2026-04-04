import AesGcmViz from './viz/AesGcmViz';

export default function AesGcm() {
  return (
    <section id="aes-gcm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AES-GCM 봉인/개봉 흐름</h2>
      <div className="not-prose mb-8"><AesGcmViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Seal Key가 파생되면 <strong>AES-128-GCM</strong>으로 실제 암호화를 수행합니다.<br />
          GCM 모드는 기밀성(암호화)과 무결성(인증)을 동시에 제공합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">봉인 과정</h3>
        <p>
          Seal Key + 12-byte IV(랜덤) + AAD(추가 인증 데이터) + 평문을 입력합니다.
          <br />
          AES-128-GCM이 암호문과 128-bit MAC(인증 태그)를 출력합니다.
          <br />
          AAD는 암호화되지 않지만 MAC 계산에 포함되어 변조를 탐지합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">개봉 과정</h3>
        <p>
          동일한 Seal Key + IV로 복호화합니다. MAC 검증이 먼저 수행됩니다.
          <br />
          MAC이 불일치하면 복호화를 중단하고 <strong>SGX_ERROR_MAC_MISMATCH</strong>를 반환합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">sealed_data_t 구조체</h3>
        <ul>
          <li><strong>key_request</strong> — 키 파생 파라미터. 개봉 시 EGETKEY에 그대로 전달합니다.</li>
          <li><strong>aes_data</strong> — 암호문 + 128-bit MAC + 12-byte IV.</li>
          <li><strong>plain_text_offset</strong> — AAD 시작 위치. AAD와 암호문의 경계를 표시합니다.</li>
        </ul>
      </div>
    </section>
  );
}
