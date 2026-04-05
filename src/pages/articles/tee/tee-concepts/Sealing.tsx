export default function Sealing() {
  return (
    <section id="sealing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 봉인 (Sealing)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sealing의 역할</h3>
        <p>
          <strong>TEE 내부 데이터</strong>를 외부(디스크, 네트워크, 다른 컴퓨터)에 저장 필요 시 사용<br />
          <strong>CPU 고유 키</strong>로 암호화 → 해당 CPU/플랫폼에서만 복호화 가능<br />
          <strong>Sealing vs Attestation</strong>: Sealing은 데이터 영속성, Attestation은 원격 검증<br />
          <strong>재부팅</strong> 후에도 동일 enclave/TD에서 복호화 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sealing 사용 시나리오</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오 1: 암호화폐 지갑
// - 개인 키를 enclave 안에서 생성
// - 서명 작업만 enclave 안에서 수행
// - 재부팅 후에도 같은 키 사용
// → sealing으로 디스크 저장

// 시나리오 2: 감사 로그
// - 변조 불가능한 로그 축적
// - 시간 순서 증명
// - 각 로그 엔트리를 seal
// → attested logging

// 시나리오 3: 세션 상태 저장
// - TLS 세션 키 / 토큰 캐시
// - 수명 제한 (expire)
// - 같은 enclave에서만 읽기

// 시나리오 4: 분산 DB 암호화
// - Database 파일 전체 seal
// - 각 노드마다 고유 키
// - 노드 이탈 시 키 자동 무효

// 시나리오 5: 라이선스 관리
// - 하드웨어 바운드 라이선스
// - 칩 도용 시 자동 무효
// - DRM, 게임 anti-cheat`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE별 Sealing 메커니즘</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Intel SGX
// - EGETKEY 명령어 (ring 3, enclave 내부)
// - Root Seal Key → Derived Seal Key
// - AES-128-GCM 표준 사용
// - sgx_seal_data() / sgx_unseal_data()

// ARM TrustZone (OP-TEE)
// - Secure Storage API (GP TEE Spec)
// - HUK(Hardware Unique Key) 기반
// - REE fs 또는 RPMB 저장
// - TEE_CreatePersistentObject()

// Intel TDX
// - TDG.MR.GET_KEY
// - Per-TD unique key
// - TD lifecycle과 결합 (TD 종료 시 키 사라짐)
// - 영속성을 위해 TD key → external persist key 체인

// AMD SEV-SNP
// - snp_get_derived_key (VMPCK 기반)
// - VMPL별 별도 키 파생
// - Guest가 자체 sealing 구현 필요

// 공통 원칙
// 1) Key는 CPU/chip에 결속
// 2) Policy가 코드 identity 포함
// 3) AEAD 암호화 (AES-GCM)
// 4) Monotonic counter 지원 (anti-replay)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Seal Key 파생 — 결정성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Seal Key는 결정적으로 파생됨
// 같은 input → 같은 output (매번)

// SGX의 경우
SealKey = AES-CMAC(RootSealKey,
    keyname || isvprodid || isvsvn || ownerepoch ||
    attributes || miscselect || measurement ||
    configid || configsvn || keyid)

// 같은 enclave가 다시 실행되면
// - RootSealKey 동일 (같은 CPU)
// - measurement 동일 (같은 코드)
// - → 같은 SealKey 파생 → 복호화 성공

// 다른 enclave에서
// - RootSealKey 동일 (같은 CPU)
// - measurement 다름 (다른 코드)
// - → 다른 SealKey → 복호화 실패

// 다른 CPU에서
// - RootSealKey 다름 (칩 고유)
// - → 완전히 다른 SealKey → 복호화 실패

// 이 결정성이 sealing의 핵심 속성
// Password 없이 HW 만으로 "key recovery" 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">봉인 정책 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">정책</th>
                <th className="border border-border px-3 py-2 text-left">결속 대상</th>
                <th className="border border-border px-3 py-2 text-left">업데이트 시</th>
                <th className="border border-border px-3 py-2 text-left">보안</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>MRENCLAVE</strong></td>
                <td className="border border-border px-3 py-2">정확한 바이너리</td>
                <td className="border border-border px-3 py-2">Migration 필요</td>
                <td className="border border-border px-3 py-2">최고</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>MRSIGNER</strong></td>
                <td className="border border-border px-3 py-2">서명자 공개키</td>
                <td className="border border-border px-3 py-2">자동 호환</td>
                <td className="border border-border px-3 py-2">높음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Combined</td>
                <td className="border border-border px-3 py-2">둘 다</td>
                <td className="border border-border px-3 py-2">MRENCLAVE와 동일</td>
                <td className="border border-border px-3 py-2">최고</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Rollback 방지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 공격: 오래된 sealed data 주입
// 시나리오: 계좌 잔액 50만원 → 100만원 이체 → 복원

// 1) 시점 T1: balance = 500K → seal(balance) → sealed_T1.bin
// 2) 시점 T2: balance = 400K → seal(balance) → sealed_T2.bin
// 3) 공격자가 sealed_T1.bin을 sealed_T2.bin으로 교체
// 4) T3에 unseal → balance = 500K (실제는 400K)

// 방어 기법

// 방법 1: SVN 증가
struct sealed_data {
    uint32_t svn;       // monotonic counter
    uint8_t ciphertext[];
};
// Enclave는 기록된 최고 SVN 추적
// 낮은 SVN seal은 거부

// 방법 2: Monotonic Counter (SGX MC)
sgx_mc_uuid_t counter;
sgx_create_monotonic_counter(&counter);
sgx_increment_monotonic_counter(&counter, &value);
// 하드웨어 기반 카운터 (wear-leveling flash)
// 다만 SGX MC는 deprecated (rollback 공격 발견)

// 방법 3: 외부 증인 (witness)
// - Sealed data의 hash를 blockchain에 저장
// - TEE가 unseal 전에 최신 hash 확인
// - Replay 시도 시 hash mismatch

// 방법 4: Freshness protocol
// - 주기적으로 challenge-response
// - Server와 synchronize
// - 오프라인 모드는 제약`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sealing의 한계와 대안</p>
          <p>
            <strong>근본 한계</strong>:<br />
            - Seal Key가 CPU에 결속 → 하드웨어 고장 시 데이터 손실<br />
            - 여러 노드 간 공유 불가<br />
            - Backup은 별도 프로토콜 필요
          </p>
          <p className="mt-2">
            <strong>복구 전략</strong>:<br />
            1. <strong>Multi-party sealing</strong>: Threshold SSS로 키 분산<br />
            2. <strong>Distributed key manager</strong>: Oasis KM 같은 복제<br />
            3. <strong>Secret sharing</strong>: M-of-N 조합으로 복구<br />
            4. <strong>Cross-TEE replication</strong>: RA-TLS 기반 복제
          </p>
          <p className="mt-2">
            <strong>실전 권장</strong>:<br />
            - 저가치 데이터: 단일 node sealing<br />
            - 중요 데이터: multi-party + threshold<br />
            - 최중요: HSM backup + attested replication
          </p>
        </div>

      </div>
    </section>
  );
}
