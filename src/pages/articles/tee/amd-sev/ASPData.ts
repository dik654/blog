export const aspCode = `// PSP 펌웨어 주요 API (sev::firmware)
pub mod firmware;  // 플랫폼 상태 관리
pub mod launch;    // 게스트 런치 프로세스
pub mod certs;     // 인증서 체인 관리
pub mod session;   // 보안 세션 관리
pub mod vmsa;      // VMSA 암호화

// 호스트 → PSP 통신 경로
Application → LibVirt → QEMU/KVM
    → /dev/sev (ioctl)
    → CCP 드라이버
    → PSP 메일박스 레지스터
    → PSP 펌웨어 처리
    → 응답 반환`;

export const aspAnnotations = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: 'PSP 펌웨어 모듈 구성' },
  { lines: [8, 14] as [number, number], color: 'emerald' as const, note: '호스트-PSP 통신 경로' },
];
