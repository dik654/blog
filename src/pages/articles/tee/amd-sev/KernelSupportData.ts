export const kvmCode = `// KVM SEV ioctl 명령어 (Linux 커널)
#define KVM_SEV_INIT          _IO(KVMIO, 0x01)
#define KVM_SEV_LAUNCH_START  _IOWR(KVMIO, 0x02, ...)
#define KVM_SEV_LAUNCH_UPDATE_DATA  _IOWR(KVMIO, 0x03, ...)
#define KVM_SEV_LAUNCH_MEASURE     _IOWR(KVMIO, 0x04, ...)
#define KVM_SEV_LAUNCH_FINISH _IO(KVMIO, 0x05)

// /dev/sev 플랫폼 관리 명령어
#define SEV_PLATFORM_RESET    _IO('S', 0x01)
#define SEV_PLATFORM_STATUS   _IOWR('S', 0x02, ...)
#define SEV_PEK_GEN           _IO('S', 0x03)
#define SEV_PDH_GEN           _IO('S', 0x05)

// KVM 내부: SEV 게스트 VMEXIT 처리
// 일반 VMEXIT와 달리 레지스터 상태가 암호화됨 (ES)
// GHCB (Guest-Host Communication Block)로
// 제한된 정보만 안전하게 교환`;

export const kvmAnnotations = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: 'KVM SEV 게스트 관리 ioctl' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: '/dev/sev 플랫폼 관리' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: 'GHCB 기반 VMEXIT 처리' },
];
