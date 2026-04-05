import TEESecurityViz from './viz/TEESecurityViz';
import TEEConfigViz from './viz/TEEConfigViz';

export default function TEESecurity() {
  return (
    <section id="tee-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TEE 보안</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Intel SGX / TDX</strong>로 Runtime 실행의 기밀성·무결성 보장<br />
          <strong>DCAP Quote</strong> 기반 원격 증명 — Consensus에 Quote 제출 필수<br />
          <strong>RA-TLS</strong> 보안 채널 — Attestation이 TLS 인증서에 포함<br />
          <strong>Multi-TEE</strong>: SGX + TDX 동시 지원, SEV-SNP 실험 중
        </p>
      </div>

      <TEESecurityViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">RAK — Runtime Attestation Key</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime/src/common/sgx/egetkey.rs

// Runtime 시작 시 RAK 생성
// - 엔클레이브 내부에서만 생성·보관
// - Runtime 재시작 시마다 재생성 (ephemeral)

pub fn generate_rak() -> SecretKey {
    // Ed25519 키 쌍
    let (private, public) = ed25519_keypair();

    // SGX REPORT에 public key 바인딩
    let mut report_data = [0u8; 64];
    report_data[..32].copy_from_slice(&public.to_bytes());

    let report = sgx_report(&report_data);
    let quote = sgx_quote(&report);

    // Quote를 Consensus에 제출 (Registry service)
    consensus_submit_node_registration(NodeRegistration {
        public_key: public,
        sgx_quote: quote,
        runtime_id: RUNTIME_ID,
    });

    private
}

// RAK 용도
// 1) Executor commitment 서명
// 2) RA-TLS 인증서 서명
// 3) Host ↔ Runtime IPC 인증`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">RA-TLS — Attestation 통합 TLS</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/common/sgx/ias/attestation.go

// RA-TLS 인증서 구조
// - 표준 X.509 v3 형식
// - 사용자 extension에 SGX Quote 포함
// - 자체 서명 (RAK 사용)

type RATLSCertificate struct {
    // Standard X.509
    SerialNumber       *big.Int
    Subject            pkix.Name
    SubjectPublicKey   ed25519.PublicKey   // = RAK.Public
    NotBefore          time.Time
    NotAfter           time.Time

    // Custom extension
    Extensions []pkix.Extension{
        {
            Id:       OID_RATLS_QUOTE,    // 1.2.840.113741.1337.6
            Critical: true,
            Value:    sgxQuote,            // DER-encoded Quote
        },
    }

    // Signature
    SignatureAlgorithm x509.Ed25519
    Signature          []byte             // RAK 서명
}

// TLS handshake 시
// 1) Server가 RA-TLS cert 제시
// 2) Client가 extension에서 Quote 추출
// 3) Quote 검증 (PCS 조회, TCB 체크)
// 4) Quote.reportdata == hash(cert.pubkey) 확인
// 5) TLS 세션 수립`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">dm-verity — 파일시스템 무결성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Runtime 바이너리 탑재 파일시스템 보호

// 번들 .orc 안에 포함된 rootfs
bundle/
├── rootfs.img          # ext4 파일시스템
├── rootfs.verity       # dm-verity 해시 트리
└── rootfs.roothash     # 루트 해시 (매니페스트에 기록)

// 실행 시
// 1) rootfs.roothash를 매니페스트에서 로드
// 2) dm-verity 장치 생성
//    dmsetup create rootfs-verity --table "0 N verity ..."
// 3) Runtime이 마운트된 rootfs 사용
// 4) 읽기마다 hash tree 검증 → 변조 즉시 탐지

// 왜 필요한가
// - SGX 엔클레이브 외부 파일은 Host가 제어
// - Host가 라이브러리·설정 파일 변조 가능
// - dm-verity로 마운트된 fs 전체 무결성 보장`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE 설정 & 원격 증명</h3>
      </div>
      <TEEConfigViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// 노드 설정 — TEE 활성화

# config.yaml
runtime:
  sgx_loader: /opt/oasis/bin/oasis-core-runtime-loader
  paths:
    - /opt/oasis/runtimes/sapphire-paratime.orc

  config:
    sapphire-paratime:
      attestation:
        # DCAP QVL 설정
        quote_policy: "tdx_or_sgx"
        # PCS 프록시 (옵션)
        pccs_url: "https://pccs.oasis.network:8081"

      # Registered MRENCLAVE (거버넌스 승인 값)
      expected_mrenclave:
        - "3e1c1c7e..."

      # TCB 정책
      min_tcb_evaluation_status: "up_to_date"

# Registry에 노드 등록 시
# - SGX Quote가 validator check
# - MRENCLAVE가 governance-approved 목록에 있어야 함
# - TCB status가 정책 만족해야 함`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Discrepancy Detection</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Executor committee가 서로 다른 결과 제출 시

// 정상 흐름
executor1 → commit(IORoot=X, StateRoot=Y)
executor2 → commit(IORoot=X, StateRoot=Y)
executor3 → commit(IORoot=X, StateRoot=Y)
→ 2/3 agreement → Roothash finalizes

// Discrepancy
executor1 → commit(IORoot=X, StateRoot=Y)
executor2 → commit(IORoot=X, StateRoot=Z)  ← 다름
executor3 → commit(IORoot=X, StateRoot=Y)

// Roothash 처리
// 1) Discrepancy 감지 (결과 불일치)
// 2) Discrepancy resolution mode 진입
//    - Backup committee 재실행
//    - Backup이 결과 결정
// 3) 잘못된 executor slash
//    - Stake 일부 소각
//    - 다음 epoch에서 선출 제외

// TEE 사용 시 discrepancy = 공격 신호
// - 결정적 실행이 SGX/TDX 보장
// - 차이나면 TEE 무력화 또는 버그
// - slash 정책 엄격 적용`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Attestation을 Consensus에 통합한 의의</p>
          <p>
            <strong>전통 SGX 모델</strong>:<br />
            - 앱이 quote 받아 verifier에 직접 전송<br />
            - verifier는 중앙집중 서비스 (IAS, PCS)<br />
            - 단일 신뢰점 존재
          </p>
          <p className="mt-2">
            <strong>Oasis 모델</strong>:<br />
            - Runtime이 Quote를 Consensus에 제출<br />
            - 모든 검증인이 Quote 검증 후 NodeRegistration 승인<br />
            - 분산 합의 → 신뢰점 분산
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ Verifier 중앙집중 제거<br />
            ✓ Governance로 정책 업데이트 (허용 MRENCLAVE 추가)<br />
            ✓ Slashing 통합 — TEE fault = economic penalty
          </p>
        </div>

      </div>
    </section>
  );
}
