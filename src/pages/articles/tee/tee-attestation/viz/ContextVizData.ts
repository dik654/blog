export const C = { attest: '#6366f1', err: '#ef4444', ok: '#10b981', intel: '#3b82f6', dcap: '#f59e0b' };

export const STEPS = [
  {
    label: 'EREPORT: CPU 내부 Report Key로 MAC 생성',
    body: 'EREPORT(target_info, user_data) → report_key = EGETKEY(REPORT) → MAC = CMAC(key, body)',
  },
  {
    label: 'Local Attestation: 같은 CPU 내 CMAC 검증',
    body: 'Enclave B가 EGETKEY(REPORT, target=A) → 동일 report_key 유도 → MAC 재계산 후 비교',
  },
  {
    label: 'EPID Quote: Intel IAS에서 그룹 서명 검증',
    body: 'QE가 EREPORT→Quote 변환, EPID 그룹 서명으로 개별 플랫폼 식별 불가 (프라이버시 보호)',
  },
  {
    label: 'DCAP Quote: ECDSA-P256 로컬 검증',
    body: 'PCK(Provisioning Certification Key) 인증서를 미리 캐시 → Intel IAS 없이 오프라인 서명 검증',
  },
  {
    label: 'Quote Body: MRENCLAVE + MRSIGNER + UserData',
    body: 'report_data[64] = SHA-256(nonce || user_payload), MRENCLAVE[32] = 코드 해시, MRSIGNER[32] = 서명자',
  },
];
