export default function Local() {
  return (
    <section id="local" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">로컬 증명 (EREPORT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Local Attestation 개요</h3>
        <p>
          <strong>로컬 증명</strong>: 같은 물리 플랫폼 내 TEE 간 상호 인증<br />
          <strong>용도</strong>: 같은 머신에서 여러 enclave 협업 시 서로 신원 확인<br />
          <strong>빠름</strong>: 네트워크·인증서 체인 불필요 (HMAC 기반)<br />
          <strong>Remote attestation의 선행 단계</strong>: Quoting Enclave 호출 시 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EREPORT 명령어 — SGX</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// EREPORT: Enclave가 자기 identity를 증명하는 report 생성
// Ring 3, enclave 내부에서만 호출

// Input
// - TARGETINFO: 검증할 대상 enclave 정보
//   (MRENCLAVE, ATTRIBUTES)
// - REPORTDATA: 64B user data (nonce, public key 등)

// Output (TARGETINFO 기반)
struct report {
    u8  cpusvn[16];             // 현재 CPU SVN
    u32 miscselect;              // MISCSELECT
    u8  reserved1[28];
    u64 attributes;              // Enclave attributes
    u8  mrenclave[32];           // This enclave's MRENCLAVE
    u8  reserved2[32];
    u8  mrsigner[32];            // This enclave's MRSIGNER
    u8  reserved3[96];
    u16 isvprodid;
    u16 isvsvn;
    u8  reserved4[60];
    u8  reportdata[64];          // Input REPORTDATA
    u8  keyid[32];               // Derived from CPU
    u8  mac[16];                 // AES-CMAC-128 MAC
};

// MAC 계산
// report_key = EGETKEY(keyname=REPORT, target.MRENCLAVE)
// MAC = AES-CMAC(report_key, report[0..384])

// → 검증자만 target.MRENCLAVE 기반 report_key 얻을 수 있음`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Local Attestation 프로토콜</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 2-way handshake (Enclave A ↔ Enclave B)

// Step 1: B가 A에게 자기 TARGETINFO 전달
//         (MRENCLAVE_B + ATTRIBUTES_B)
B → A: target_info_B = {MRENCLAVE_B, ATTRIBUTES_B}

// Step 2: A가 자기 report 생성 (target=B)
report_A = EREPORT(target_info_B, report_data_A)
// → MAC은 B의 report_key로 계산됨

// Step 3: A가 report_A를 B에게 전송
A → B: report_A

// Step 4: B가 EGETKEY로 report_key 얻기
key_request = {
    keyname: SGX_KEYSELECT_REPORT,
    keypolicy: MRENCLAVE,
    // ... B의 identity 필요
};
report_key_B = EGETKEY(key_request)
// ← A와 B가 같은 CPU → 같은 key 파생

// Step 5: B가 MAC 검증
expected_mac = AES-CMAC(report_key_B, report_A[0..384])
if expected_mac == report_A.mac:
    // A의 identity 확인됨 (MRENCLAVE_A from report)
    trusted = true

// Step 6: 반대 방향도 수행 (B → A)
// 두 enclave 상호 인증 완료 → 세션 키 교환 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Report Key — CPU 바운드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Report Key의 특수성
// - 같은 CPU에서만 파생 가능
// - 다른 CPU로 옮기면 key 다름 → MAC 검증 실패
// - CPU가 로컬 증명의 trust anchor

// EGETKEY with REPORT keyname
// 파생 input
// - RootReportKey (CPU 하드웨어)
// - MRENCLAVE (검증자 enclave)
// - Other attributes

// 결과
// - 특정 MRENCLAVE가 요청한 report_key
// - 다른 enclave가 같은 key 얻으려면 MRENCLAVE 일치 필요
// - 하지만 EREPORT는 "임의 target"으로 생성 가능
//   → 일방적 인증 (A → B)
//   → bidirectional 위해 2회 수행

// 왜 CPU 바운드인가
// - 다른 CPU로 report 복사 공격 방어
// - 물리적 격리 요구
// - Remote attestation으로 확장하려면 별도 메커니즘`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 사용 — Quoting Enclave</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Remote attestation의 기반으로 사용됨

// 1. 앱 enclave가 자기 report 생성 (target = QE)
report = EREPORT(QE_target_info, user_data)

// 2. report를 QE에 전달 (IPC or RPC)
app_enclave.send_to_qe(report)

// 3. QE가 report의 MAC 검증 (local attestation)
if verify_mac(report):
    // app enclave가 같은 CPU에서 실행됨 확인

// 4. QE가 ECDSA 서명으로 Quote 생성
//    (Attestation Key로 서명)
quote = sign_with_ak(report)

// 5. Quote가 네트워크로 전송 가능
//    원격 verifier가 PCS에서 PCK 확인 → 검증

// QE 역할
// - Intel 서명된 특권 enclave
// - Local attestation → Remote attestation 변환
// - Attestation Key 관리
// - 매 instance가 단일 QE 인스턴스 사용

// Intel SGX SDK 제공
// sgx_create_report() → local
// sgx_get_quote() → remote (QE 경유)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cross-Enclave Secure Channel</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 같은 머신의 두 enclave가 비밀 공유

// 1) Local attestation으로 상호 인증
// 2) Diffie-Hellman 키 교환 (ECDH)
// 3) Session key 수립
// 4) 이후 통신은 AES-GCM 암호화

// 구현 예 (Intel SGX SDK)
sgx_dh_session_t session;

// Initiator
sgx_dh_init_session(SGX_DH_SESSION_INITIATOR, &session);
sgx_dh_initiator_proc_msg1(msg1, &msg2, &session);
// ... msg2 전송
sgx_dh_initiator_proc_msg3(msg3, &session, &aek);  // session key

// Responder
sgx_dh_init_session(SGX_DH_SESSION_RESPONDER, &session);
sgx_dh_responder_gen_msg1(&msg1, &session);
sgx_dh_responder_proc_msg2(msg2, &msg3, &session, &aek);

// 양쪽이 aek (Authenticated Encryption Key) 보유
// AES-GCM으로 보안 채널 구축

// 사용 사례
// - Multi-enclave 앱 (split architecture)
// - Key manager → worker 키 전달
// - Secure enclave federation (같은 머신)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Local vs Remote Attestation 선택</p>
          <p>
            <strong>Local Attestation</strong>:<br />
            ✓ 빠름 (HMAC only, ~μs)<br />
            ✓ 오프라인 가능 (네트워크 불필요)<br />
            ✓ 인증서 체인 없음<br />
            ✗ 같은 머신만
          </p>
          <p className="mt-2">
            <strong>Remote Attestation</strong>:<br />
            ✓ 원격 검증 가능<br />
            ✓ Public-key 기반 (비대칭 검증)<br />
            ✗ 느림 (ECDSA + cert chain, ~ms)<br />
            ✗ PCS·인프라 의존
          </p>
          <p className="mt-2">
            <strong>실전 패턴</strong>:<br />
            - 멀티 enclave 앱 → Local (성능)<br />
            - 외부 사용자 신뢰 → Remote<br />
            - Hybrid: QE가 Local → Remote 변환<br />
            - 같은 데이터센터 클러스터 → Local 충분<br />
            - 크로스 데이터센터 → Remote 필수
          </p>
        </div>

      </div>
    </section>
  );
}
