export const rmpEntryCode = `// RMP 엔트리 구조 (4KB 페이지당 1개)
struct RmpEntry {
    assigned: bool,       // 게스트에 할당되었는가
    asid: u32,           // 어떤 게스트의 ASID
    gpa: u64,            // 유효한 GPA (잘못된 매핑 차단)
    vmpl_perms: [u8; 4], // VMPL 0-3별 권한 (R/W/X)
    immutable: bool,     // 2MB 대용량 페이지 여부
}

// 하이퍼바이저가 게스트 페이지를 재매핑 시도 →
// RMP 검사에서 GPA 불일치 탐지 → #PF → 게스트에 신호
// → 메모리 재매핑 공격(Confused Deputy Attack) 원천 차단`;

export const rmpEntryAnnotations = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: '페이지 소유권 메타데이터' },
  { lines: [9, 11] as [number, number], color: 'amber' as const, note: '재매핑 공격 방어 메커니즘' },
];

export const vmplCode = `// VMPL 사용 시나리오 예
VMPL 0: Paravisor / vTPM 에이전트 (가장 신뢰됨)
VMPL 1: 게스트 OS 커널
VMPL 2-3: 게스트 애플리케이션

// 각 VMPL 레벨의 페이지별 권한 마스크
bitflags! {
    struct VmplPerms: u8 {
        const READ             = 1;
        const WRITE            = 1 << 1;
        const EXECUTE_USER     = 1 << 2;  // CPL3
        const EXECUTE_SUPERVISOR = 1 << 3; // CPL0-2
    }
}

// VMPL 1이 특정 페이지의 RWX 권한을 VMPL 2에게 위임
// → 계층적 privilege delegation`;

export const vmplAnnotations = [
  { lines: [2, 4] as [number, number], color: 'emerald' as const, note: 'VMPL 계층별 역할' },
  { lines: [7, 14] as [number, number], color: 'violet' as const, note: '비트 마스크 권한 정의' },
];

export const measurementCode = `// 게스트 런치 다이제스트 축적
launch_digest = SHA-384("")
for each page in guest_image:
    launch_digest = SHA-384(launch_digest || gpa || page_type || page_data)

// 최종값이 SNP Attestation Report의 MEASUREMENT 필드에 포함
// → 원격 verifier가 예상 이미지와 비교하여 무결성 검증`;

export const measurementAnnotations = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: 'SHA-384 해시 체인 축적' },
  { lines: [6, 7] as [number, number], color: 'amber' as const, note: '원격 검증에 사용' },
];
