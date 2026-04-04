export const mmuCode = `// core/mm/core_mmu.c — 메모리 영역 분류
enum teecore_memtypes {
    MEM_AREA_NOTYPE,       // 타입 없음
    MEM_AREA_TEE_RAM,      // TEE 커널 전용 RAM
    MEM_AREA_TEE_COHERENT, // TEE 일관성 메모리
    MEM_AREA_TA_RAM,       // TA 실행 전용 RAM
    MEM_AREA_NSEC_SHM,     // Non-Secure 공유 메모리
    MEM_AREA_DDR_OVERALL,  // 전체 DDR 메모리
    MEM_AREA_TEE_RAM_RX,   // TEE 실행 가능 메모리
};

// Secure 전용 메모리 영역 정의
static struct memaccess_area secure_only[] = {
    MEMACCESS_AREA(TRUSTED_SRAM_BASE, TRUSTED_SRAM_SIZE),
    MEMACCESS_AREA(TRUSTED_DRAM_BASE, TRUSTED_DRAM_SIZE),
};

// Non-Secure 공유 메모리 영역
static struct memaccess_area nsec_shared[] = {
    MEMACCESS_AREA(TEE_SHMEM_START, TEE_SHMEM_SIZE),
};`;

export const mmuAnnotations = [
  { lines: [2, 9] as [number, number], color: 'sky' as const, note: '메모리 영역 타입 열거형' },
  { lines: [12, 15] as [number, number], color: 'emerald' as const, note: 'Secure 전용 물리 영역' },
  { lines: [18, 20] as [number, number], color: 'amber' as const, note: 'Normal World 공유 영역' },
];

export const allocCode = `// core/mm/page_alloc.c — 보안 페이지 할당자
// 가상 메모리 풀 관리
tee_mm_pool_t core_virt_mem_pool;  // 코어 매핑용
tee_mm_pool_t core_virt_shm_pool; // 공유 메모리용

#define SHM_VASPACE_SIZE (1024 * 1024 * 32) // 32MB

// 페이지 테이블 캐시 (TLB 미스 감소)
struct pgt_cache {
    struct mutex mutex;
    struct pgt_cache_entry *entries;
    size_t num_entries;
    size_t max_entries;
};

// 보안 특성: ASLR, NX 비트, 페이지 테이블 보호
// - ASLR: 주소 공간 랜덤화
// - NX: 데이터 영역 코드 실행 방지
// - 페이지 테이블 자체를 Secure 메모리에 저장`;

export const allocAnnotations = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '가상 메모리 풀 분리' },
  { lines: [8, 13] as [number, number], color: 'emerald' as const, note: '페이지 테이블 캐시 구조' },
  { lines: [16, 19] as [number, number], color: 'violet' as const, note: '보안 메모리 보호 메커니즘' },
];
