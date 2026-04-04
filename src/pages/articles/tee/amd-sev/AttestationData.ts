export const reportStructCode = `struct AttestationReport {
    version: u32,          // 보고서 버전
    guest_svn: u32,        // 게스트 SVN (Security Version Number)
    policy: GuestPolicy,   // 게스트 보안 정책 (디버그 허용 여부 등)
    family_id: [u8; 16],   // 게스트 패밀리 ID
    image_id: [u8; 16],    // 게스트 이미지 ID
    vmpl: u32,             // 보고서 요청 VMPL
    signature_algo: u32,   // ECDSA-P384-SHA384
    current_tcb: TcbVersion, // 현재 TCB 버전 (펌웨어 버전 반영)
    platform_info: u64,    // TSME/SMT 활성화 여부 등
    measurement: [u8; 48], // 런치 다이제스트 SHA-384 (핵심!)
    host_data: [u8; 32],   // 호스트가 추가한 임의 데이터
    report_data: [u8; 64], // 게스트가 추가한 임의 데이터 (challenge)
    chip_id: [u8; 64],     // 칩 고유 식별자
    signature: [u8; 512],  // PSP의 VCEK로 서명
}`;

export const reportAnnotations = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '게스트 식별 정보' },
  { lines: [11, 11] as [number, number], color: 'emerald' as const, note: '런치 다이제스트 (핵심 측정값)' },
  { lines: [15, 15] as [number, number], color: 'amber' as const, note: 'VCEK 서명 (신뢰 앵커)' },
];

export const verifyFlowCode = `// 1. 게스트: nonce 기반 증명 보고서 요청
let nonce = rand::random::<[u8; 64]>();
let report = sev_snp::get_attestation_report(nonce)?;
// → PSP가 report 생성 + VCEK 개인키로 서명

// 2. 게스트: 보고서 + VCEK 인증서를 verifier에게 전달

// 3. Verifier: AMD KDS에서 VCEK 인증서 체인 획득
// https://kds.amd.com/vcek/{chip_id}?{tcb_version}
let vcek_cert = amd_kds::get_vcek_cert(&report.chip_id, &report.current_tcb)?;

// 4. Verifier: 인증서 체인 검증 (VCEK → ASK → ARK)
let ark = load_amd_root_cert();   // AMD가 공개한 루트 인증서
verify_chain(&vcek_cert, &ark)?;

// 5. Verifier: 보고서 서명 검증
vcek_cert.verify_signature(&report.bytes, &report.signature)?;

// 6. Verifier: 핵심 필드 검증
assert_eq!(report.measurement, EXPECTED_MEASUREMENT); // 이미지 해시
assert_eq!(&report.report_data[..64], &nonce);         // 재전송 공격 방지
assert!(report.policy.debug_disabled());                // 디버그 모드 차단`;

export const verifyAnnotations = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: '게스트 측 보고서 생성' },
  { lines: [8, 14] as [number, number], color: 'emerald' as const, note: 'AMD KDS 인증서 체인 검증' },
  { lines: [18, 21] as [number, number], color: 'amber' as const, note: '핵심 필드 검증 단계' },
];
