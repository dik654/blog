import type { CodeRef } from '@/components/code/types';

const RMP_ENTRY = `/* arch/x86/include/asm/sev-common.h — RMP 엔트리 비트 레이아웃 */
struct rmp_entry {
    u64 assigned  : 1;   /* 게스트에 할당 여부 */
    u64 pagesize  : 1;   /* 0 = 4KB, 1 = 2MB */
    u64 immutable : 1;   /* 변경 불가 플래그 */
    u64 rsvd      : 9;
    u64 gpa       : 39;  /* Guest Physical Address (4KB 정렬) */
    u64 asid      : 10;  /* Address Space ID (게스트 식별) */
    u64 vmsa      : 1;   /* VMSA 페이지 여부 */
    u64 validated : 1;   /* PVALIDATE로 검증 완료 */
    u64 vmpl_perms[4];   /* VMPL 0-3별 R/W/X 권한 */
};

/* RMP 검사 흐름 (하드웨어 수행) */
// 1. 게스트 메모리 접근 시 GPA → SPA 변환
// 2. SPA로 RMP 엔트리 조회
// 3. ASID 일치 확인 → 불일치 시 #PF
// 4. GPA 일치 확인 → 재매핑 공격 차단
// 5. VMPL 권한 확인 → 위반 시 #PF`;

const VMPL_PERMS = `/* arch/x86/include/asm/sev.h — VMPL 권한 비트 */
#define VMPL_R              (1 << 0)  /* Read */
#define VMPL_W              (1 << 1)  /* Write */
#define VMPL_X_USER         (1 << 2)  /* Execute (CPL 3) */
#define VMPL_X_SUPER        (1 << 3)  /* Execute (CPL 0-2) */
#define VMPL_SSS            (1 << 4)  /* Supervisor Shadow Stack */

/* VMPL 계층 구조 */
// VMPL 0: Paravisor / vTPM (최고 권한)
//   → RMPADJUST 명령으로 하위 VMPL 권한 설정
// VMPL 1: 게스트 OS 커널
// VMPL 2: 게스트 드라이버
// VMPL 3: 사용자 애플리케이션 (최저 권한)`;

export const snpCodeRefs: Record<string, CodeRef> = {
  'rmp-entry': {
    path: 'linux/arch/x86/include/asm/sev-common.h',
    code: RMP_ENTRY,
    highlight: [2, 14],
    lang: 'c',
    annotations: [
      { lines: [3, 6], color: 'sky', note: '페이지 메타데이터 — 할당/크기/불변 플래그' },
      { lines: [8, 12], color: 'emerald', note: 'GPA + ASID — 소유권 추적 핵심 필드' },
      { lines: [13, 14], color: 'amber', note: 'VMPL별 세분화 권한 마스크' },
      { lines: [18, 22], color: 'violet', note: 'RMP 검사 흐름 — 하드웨어가 자동 수행' },
    ],
    desc:
`RMP(Reverse Map Table)는 시스템의 모든 물리 메모리 페이지에 1:1 대응하는 테이블입니다.

기존 페이지 테이블은 VA→PA 방향이지만, RMP는 PA→소유자 역방향 매핑입니다.
하이퍼바이저가 게스트 메모리를 재매핑하려 해도 ASID/GPA 불일치로 #PF가 발생합니다.

이것이 SEV-SNP의 핵심 혁신으로, Confused Deputy Attack을 하드웨어 수준에서 차단합니다.`,
  },

  'vmpl-perms': {
    path: 'linux/arch/x86/include/asm/sev.h',
    code: VMPL_PERMS,
    highlight: [2, 6],
    lang: 'c',
    annotations: [
      { lines: [2, 6], color: 'sky', note: 'R/W/X + Shadow Stack 권한 비트' },
      { lines: [9, 14], color: 'emerald', note: 'VMPL 계층 — VM 내부 권한 분리' },
    ],
    desc:
`VMPL은 게스트 VM 내부를 4단계 권한으로 분리하는 메커니즘입니다.

하이퍼바이저 없이도 VM 내부에서 Paravisor(VMPL 0)가 커널(VMPL 1)의
메모리 접근을 제어할 수 있습니다. 각 VMPL은 페이지별로 독립적인 R/W/X 권한을 가집니다.`,
  },
};
