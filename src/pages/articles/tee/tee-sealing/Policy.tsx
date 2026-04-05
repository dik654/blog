export default function Policy() {
  return (
    <section id="policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MRENCLAVE vs MRSIGNER 정책</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">정책 선택의 의미</h3>
        <p>
          <strong>KEYPOLICY</strong>: Seal Key 파생 시 어떤 측정값 포함하는지 결정<br />
          <strong>MRENCLAVE</strong>: 정확한 바이너리 고정 (엄격)<br />
          <strong>MRSIGNER</strong>: 서명자 기준 (유연)<br />
          <strong>선택이 유지보수·보안 모두 결정</strong> — 사후 변경 불가 (이미 봉인된 데이터)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MRENCLAVE 봉인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// MRENCLAVE: enclave 바이너리의 SHA-256 해시
// - 코드 + 데이터 + relocation 전부 반영
// - 빌드 도구에서 deterministic 계산

// 봉인 시
sgx_key_request_t req = {
    .key_name = SGX_KEYSELECT_SEAL,
    .key_policy = SGX_KEYPOLICY_MRENCLAVE,  // ← MRENCLAVE 바인딩
    ...
};
sgx_get_key(&req, &seal_key);

// 시나리오: 코드 업데이트
// v1.0 enclave: MRENCLAVE = 0xAAA...
// v1.1 enclave: MRENCLAVE = 0xBBB... (한 바이트 수정해도 바뀜)

// v1.0에서 sealed → v1.1에서 unseal 시도
// → EGETKEY가 v1.1의 MRENCLAVE로 파생
// → 다른 key → decryption fail

// 장점
// ✓ 가장 강한 코드 격리
// ✓ 백도어 주입 불가 (코드 바이트 수준 고정)
// ✓ 검증 가능성 최고

// 단점
// ✗ 사소한 업데이트도 migration 필요
// ✗ 컴파일러 버전 바뀌면 MRENCLAVE 변경
// ✗ 데이터 영속성과 업그레이드가 충돌`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">MRSIGNER 봉인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// MRSIGNER: enclave 서명자의 공개키 해시 (256 bits)
// - SIGSTRUCT에 포함
// - 빌드 시점에 RSA-3072 서명

// 봉인 시
sgx_key_request_t req = {
    .key_name = SGX_KEYSELECT_SEAL,
    .key_policy = SGX_KEYPOLICY_MRSIGNER,  // ← MRSIGNER 바인딩
    .isv_svn = 2,  // 최소 SVN 요구
    ...
};

// 시나리오: 코드 업데이트 (같은 서명자)
// v1.0: MRSIGNER = 0xSSS, ISV_SVN = 1
// v1.1: MRSIGNER = 0xSSS (same signer), ISV_SVN = 2

// v1.0에서 sealed → v1.1에서 unseal
// → MRSIGNER 동일
// → ISV_SVN 2 >= 1 (허용)
// → 같은 key → 성공

// 장점
// ✓ 코드 업데이트 자연스럽게 migrate
// ✓ 버전 간 데이터 재사용
// ✓ 다수 enclave 간 데이터 공유 가능 (같은 서명자)

// 단점
// ✗ 서명 키 유출 시 악성 enclave 배포 가능
// ✗ 서명자가 TCB 일부 → 신뢰 요구
// ✗ 덜 엄격한 격리

// SVN (Security Version Number) 사용
// - 보안 취약점 수정 시 SVN 증가
// - 오래된 SVN enclave는 새 데이터 unseal 못 함
// - 예: isv_svn_mask로 downgrade 방어`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">정책 비교 매트릭스</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">시나리오</th>
                <th className="border border-border px-3 py-2 text-left">MRENCLAVE</th>
                <th className="border border-border px-3 py-2 text-left">MRSIGNER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">v1.0 코드 업데이트 → v1.1</td>
                <td className="border border-border px-3 py-2">❌ 마이그레이션 필요</td>
                <td className="border border-border px-3 py-2">✅ 자동 호환</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">같은 서명자의 다른 enclave</td>
                <td className="border border-border px-3 py-2">❌ 데이터 공유 불가</td>
                <td className="border border-border px-3 py-2">✅ 공유 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">서명 키 유출 시</td>
                <td className="border border-border px-3 py-2">✅ 영향 없음</td>
                <td className="border border-border px-3 py-2">❌ 공격자가 unseal 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">컴파일러 변경</td>
                <td className="border border-border px-3 py-2">❌ 마이그레이션 필요</td>
                <td className="border border-border px-3 py-2">✅ 영향 없음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Downgrade 공격</td>
                <td className="border border-border px-3 py-2">✅ 자연 방어</td>
                <td className="border border-border px-3 py-2">⚠️ SVN 체크 필요</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Migration 패턴 (MRENCLAVE 사용 시)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// v1.0에서 v1.1로 업그레이드하는 5단계

// Step 1: v1.0 enclave가 현재 데이터를 MRENCLAVE로 unseal
void *v10_data = sgx_unseal(sealed_v10_data, SGX_KEYPOLICY_MRENCLAVE);

// Step 2: v1.0이 임시 키(temp_key)로 재암호화
//         → 공유 메모리 또는 파일
uint8_t temp_key[32];
sgx_read_rand(temp_key, 32);
uint8_t *temp_encrypted = aes_gcm_encrypt(v10_data, temp_key);

// Step 3: v1.0에서 v1.1 enclave로 transfer
//         - Local attestation으로 v1.1 확인
//         - Secure channel (DH)로 temp_key 전달
send_via_local_attestation(temp_key, temp_encrypted, v11_enclave);

// Step 4: v1.1 enclave가 temp_key로 복호화
void *v11_data = aes_gcm_decrypt(temp_encrypted, temp_key);

// Step 5: v1.1이 자신의 MRENCLAVE로 re-seal
sealed_v11_data = sgx_seal(v11_data, SGX_KEYPOLICY_MRENCLAVE);

// → 이제 v1.0 sealed data 삭제
// → v1.1이 독자 데이터 소유

// 복잡도 높음 → 실전에선 MRSIGNER 선호`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">선택 기준 — 의사결정 플로우</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 질문 1: 데이터 수명은?
// - 단기 (시간~일): MRENCLAVE 또는 MRSIGNER
// - 장기 (월~년):   MRSIGNER (업데이트 필수)

// 질문 2: 업데이트 빈도는?
// - 드물게 (분기+): MRENCLAVE 고려
// - 자주 (매주):    MRSIGNER

// 질문 3: 보안 수준은?
// - 최고 (군사·금융): MRENCLAVE
// - 일반 (웹 앱):     MRSIGNER

// 질문 4: 서명 키 관리 능력?
// - HSM 기반 안전:   MRSIGNER OK
// - 개발자 로컬:     MRENCLAVE 선호

// 결론 가이드
//
// MRENCLAVE 추천:
//   - 짧은 수명 비밀 (session key)
//   - 코드가 고정된 appliance
//   - 규제 요건으로 코드 불변성 증명 필요
//
// MRSIGNER 추천:
//   - 일반 사용자 앱
//   - 빈번한 업데이트 필요
//   - 다수 enclave 간 협업
//   - 키 유출 위험 관리 가능한 조직`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Hybrid 정책</p>
          <p>
            <strong>다층 sealing 전략</strong>:<br />
            - <strong>Level 1 (MRENCLAVE)</strong>: 최상위 마스터 키 (32B)<br />
            - <strong>Level 2 (MRSIGNER)</strong>: 업데이트 가능한 데이터 키들<br />
            - 마스터 키로 데이터 키 암호화 → 이중 보호
          </p>
          <p className="mt-2">
            <strong>이점</strong>:<br />
            ✓ 마스터는 불변 (강한 root of trust)<br />
            ✓ 데이터 키는 자유롭게 rotate<br />
            ✓ 공격자가 서명 키만 얻어도 마스터 못 얻음
          </p>
          <p className="mt-2">
            <strong>실전 사용</strong>:<br />
            - Hyperledger Fabric/Avalon<br />
            - Oasis Network Key Manager<br />
            - Confidential Computing Consortium 권장 패턴
          </p>
        </div>

      </div>
    </section>
  );
}
