export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">봉인이 필요한 이유</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">봉인(Sealing)의 필요성</h3>
        <p>
          TEE 내부에서 생성된 <strong>비밀</strong>(개인키, 설정, 세션 토큰)은 재부팅 후에도 유지 필요<br />
          그러나 TEE 메모리는 <strong>휘발성</strong>: EPC/TD 메모리는 전원 차단 시 소멸<br />
          <strong>해결</strong>: CPU 고유 키로 암호화(봉인) → 디스크 저장<br />
          재부팅 후 <strong>동일 CPU + 동일 enclave</strong>에서만 복호화(개봉) 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">봉인 없이는 어떤 문제가 발생하는가</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오: 암호화폐 지갑 enclave

// 봉인 없이
void generate_wallet_in_enclave() {
    // 1) 엔클레이브 안에서 안전하게 키 생성
    PrivateKey pk = generate_random_key();

    // 2) 어디에 저장?
    //    - 메모리: 재부팅 시 손실
    //    - 디스크 (평문): 공격자 파일 읽기 가능
    //    - 디스크 (암호화): 암호화 키는 또 어디에?
    //
    //  → 계속 순환 논리 → 지속성 불가

    // 최악: 재부팅마다 새 키 생성 → 이전 지갑 접근 불가
}

// 봉인 있을 때
void generate_and_seal_wallet() {
    // 1) 엔클레이브 안에서 키 생성
    PrivateKey pk = generate_random_key();

    // 2) CPU 하드웨어에서 파생된 Seal Key 요청
    SealKey sk = EGETKEY(MRENCLAVE_POLICY);

    // 3) Seal Key로 비밀을 AES-GCM 암호화
    SealedData sealed = aes_gcm_seal(&pk, sk);

    // 4) 디스크에 sealed bytes 저장 (안전)
    fs_write("wallet.sealed", sealed);
}

// 재부팅 후
void unseal_wallet() {
    SealedData sealed = fs_read("wallet.sealed");
    SealKey sk = EGETKEY(MRENCLAVE_POLICY);  // 같은 CPU, 같은 코드
    PrivateKey pk = aes_gcm_unseal(&sealed, sk);  // 성공
    use_key(&pk);
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 원칙 4가지</h3>
        <ul>
          <li><strong>CPU 바운드</strong> — Seal Key는 CPU 칩에 물리적 내장된 Root Key에서 파생. 다른 CPU는 같은 키 못 얻음</li>
          <li><strong>코드 바운드</strong> — 키 파생에 enclave 측정값(MRENCLAVE/MRSIGNER) 포함. 다른 코드는 같은 키 못 얻음</li>
          <li><strong>무결성 보장</strong> — AES-GCM MAC 태그로 변조 탐지. 1비트 수정도 개봉 거부</li>
          <li><strong>버전 바운드</strong> — SVN(Security Version Number) 포함 가능. downgrade 방어</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">봉인 vs 다른 데이터 보호 방법</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">방식</th>
                <th className="border border-border px-3 py-2 text-left">키 저장</th>
                <th className="border border-border px-3 py-2 text-left">CPU 의존</th>
                <th className="border border-border px-3 py-2 text-left">코드 의존</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">암호 기반 (PBKDF2)</td>
                <td className="border border-border px-3 py-2">사용자 머릿속</td>
                <td className="border border-border px-3 py-2">No</td>
                <td className="border border-border px-3 py-2">No</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">HSM</td>
                <td className="border border-border px-3 py-2">외부 하드웨어</td>
                <td className="border border-border px-3 py-2">Partial</td>
                <td className="border border-border px-3 py-2">No</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TPM Sealing</td>
                <td className="border border-border px-3 py-2">TPM 칩</td>
                <td className="border border-border px-3 py-2">Yes (TPM)</td>
                <td className="border border-border px-3 py-2">PCR 기반</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>TEE Sealing</strong></td>
                <td className="border border-border px-3 py-2">CPU 하드 root</td>
                <td className="border border-border px-3 py-2"><strong>Yes</strong></td>
                <td className="border border-border px-3 py-2"><strong>Yes (MRENCLAVE)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">공격 시나리오 &amp; 방어</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오 1: 공격자가 다른 서버로 sealed data 복사
// - sealed.bin 파일 훔침
// - 자기 CPU에서 unseal 시도
// → 다른 CPU → 다른 Root Key → Seal Key 다름 → 복호화 실패 ✓

// 시나리오 2: 공격자가 같은 서버에서 자기 enclave로 unseal 시도
// - sealed.bin 파일 접근
// - 자기 코드 MRENCLAVE_X로 EGETKEY 호출
// → 다른 MRENCLAVE → 다른 Seal Key → 복호화 실패 ✓

// 시나리오 3: 공격자가 sealed data 조작
// - sealed.bin의 ciphertext 수정
// - 정상 enclave가 unseal 시도
// → AES-GCM MAC 검증 실패 → 에러 반환 ✓

// 시나리오 4: 공격자가 old sealed data 주입 (rollback)
// - 구버전 sealed.bin 보관
// - 현재 enclave에 제공
// → MAC 검증 성공 (같은 key)
// → BUT: SVN 필드 체크로 탐지 가능
// → 또는 monotonic counter 사용

// 시나리오 5: 공격자가 CPU 자체 분석 (강력한 물리 공격)
// - 칩 decapping + SEM/FIB
// → Root Key 추출 가능성 (매우 어려움)
// → 수십만 달러 장비·수개월 시간 필요
// → 실전에선 무시 가능`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sealing의 실전 패턴</p>
          <p>
            <strong>계층적 봉인</strong>:<br />
            - Level 1: 마스터 키만 봉인 (32B seal)<br />
            - Level 2: 마스터 키로 파생한 데이터 키들 (대량)<br />
            - 이유: enclave 재빌드 시 마스터만 재봉인
          </p>
          <p className="mt-2">
            <strong>MRSIGNER 기반 upgrade</strong>:<br />
            - MRENCLAVE 기반: 코드 한 바이트 변경해도 unseal 불가<br />
            - MRSIGNER 기반: 서명자 동일하면 OK → 업데이트 가능<br />
            - 대부분 앱은 MRSIGNER + SVN 조합 사용
          </p>
          <p className="mt-2">
            <strong>백업 전략</strong>:<br />
            - Sealed data는 해당 CPU에서만 복구 가능<br />
            - CPU 하드웨어 실패 시 복구 불가<br />
            - 실전: multi-party sealing (threshold SSS) 또는 분산 KMS
          </p>
        </div>

      </div>
    </section>
  );
}
