export const teeConfigCode = `// TEE 선택 모드
const (
  TEESelectModeAuto     = "auto"     // 자동 선택
  TEESelectModeHardware = "hardware" // 하드웨어 TEE 강제
  TEESelectModeNone     = "none"     // TEE 비활성화
)

// TEE 종류
const (
  TEEKindNone TEEKind = 0  // TEE 없음
  TEEKindSGX  TEEKind = 1  // Intel SGX
)

// 엔클레이브 신원 (MRENCLAVE + MRSIGNER)
type EnclaveIdentity struct {
  MrEnclave MrEnclave  // 코드 해시 (무결성)
  MrSigner  MrSigner   // 서명자 해시 (신원)
}

// RA-TLS: 원격 증명을 TLS 핸드셰이크에 내장
// 1. TLS 인증서에 SGX Quote 첨부
// 2. 상대방이 Quote 검증 후 TLS 연결 수립
// 3. 키 매니저 ↔ 컴퓨트 워커 보안 채널`;

export const teeConfigAnnotations = [
  { lines: [1, 6] as [number, number], color: 'sky' as const, note: 'TEE 선택 모드' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: 'TEE 종류 & 신원' },
  { lines: [14, 19] as [number, number], color: 'violet' as const, note: '엔클레이브 신원' },
  { lines: [21, 25] as [number, number], color: 'amber' as const, note: 'RA-TLS 보안 채널' },
];
