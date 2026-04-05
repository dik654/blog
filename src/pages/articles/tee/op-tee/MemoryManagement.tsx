import MemoryManagementViz from './viz/MemoryManagementViz';
import MemoryTypesViz from './viz/MemoryTypesViz';
import PageAllocViz from './viz/PageAllocViz';

export default function MemoryManagement() {
  return (
    <section id="memory-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 관리 &amp; 페이지 테이블 격리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">OP-TEE 메모리 격리</h3>
        <p>
          <strong>TZASC</strong>(TrustZone Address Space Controller)가 DRAM을 Secure/Normal 영역으로 분할<br />
          <strong>S-bit</strong>(Security bit): bus transaction에 전파되어 HW 레벨 접근 제어<br />
          <strong>TLB entry</strong>마다 NS 비트 포함 → 잘못된 world 접근 시 fault<br />
          <strong>다층 보호</strong>: MMU + ASLR + NX + stack canary + KASAN
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 분할 (TZASC 설정)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// DRAM 레이아웃 예 (1GB 시스템)

// BL2 (early boot)이 TZASC 구성
// 0x00000000 - 0x3F000000: Normal DDR (1008 MB) — Linux용
// 0x3F000000 - 0x3F800000: Shared DDR (8 MB)   — world 간 통신
// 0x3F800000 - 0x40000000: Secure DDR (8 MB)   — OP-TEE 전용

// TZASC register 설정 (예: TZASC-400)
// Region 0: Normal, 0x00000000 ~ 0x3EFFFFFF
// Region 1: Shared, 0x3F000000 ~ 0x3F7FFFFF (NS=1 read, NS=0 rw)
// Region 2: Secure, 0x3F800000 ~ 0x3FFFFFFF (NS=0 only)

// Secure DDR 구성
struct secure_ddr_layout {
    u32 teecore_code;       // OP-TEE kernel 코드 + 데이터
    u32 tzdram_base;
    u32 teecore_data;
    u32 ta_ram_base;        // Trusted Apps 로드 영역
    u32 pool_base;          // malloc pool
    u32 tee_heap_base;      // dynamic heap
    u32 tee_stack_top;
};

// 런타임 검증
// TZASC가 정상 동작 확인:
// 1. Normal world가 secure 주소 접근 시도
// 2. TZASC가 transaction 거부
// 3. Normal world에서 bus fault 발생 (data abort)`}</pre>

      </div>
      <MemoryManagementViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 영역 분류 (core/mm/core_mmu.c)</h3>
      </div>
      <div className="not-prose mb-6"><MemoryTypesViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// OP-TEE 메모리 타입 (core/include/mm/core_memprot.h)

enum teecore_memtypes {
    MEM_AREA_END = 0,
    MEM_AREA_TEE_RAM,          // TEE 실행 코드/데이터
    MEM_AREA_TEE_RAM_RX,       // RX만 (실행 전용)
    MEM_AREA_TEE_RAM_RO,       // RO (const data)
    MEM_AREA_TEE_RAM_RW,       // RW (stack, heap)
    MEM_AREA_NEX_RAM_RO,       // Nexus RAM readonly
    MEM_AREA_NEX_RAM_RW,       // Nexus RAM r/w
    MEM_AREA_TEE_COHERENT,     // cache-coherent
    MEM_AREA_TEE_ASAN,         // AddressSanitizer shadow

    MEM_AREA_TA_RAM,           // TA 로드 영역 (secure)
    MEM_AREA_NSEC_SHM,         // Non-secure shared memory
    MEM_AREA_RAM_NSEC,         // Non-secure RAM (Linux)

    MEM_AREA_IO_SEC,           // Secure peripheral MMIO
    MEM_AREA_IO_NSEC,          // Non-secure peripheral MMIO
    MEM_AREA_DDR_OVERALL,

    MEM_AREA_RES_VASPACE,      // Reserved virtual
    MEM_AREA_SHM_VASPACE,      // Shared memory virtual
    MEM_AREA_MAXTYPE,
};

// 각 영역에 MMU attributes 적용
// - Execute permission (XN bit)
// - Access permission (AP bits)
// - Memory type (device, normal, cacheable)
// - Shareability
// - Non-secure bit

// MMU walk 예
// VA = 0x40200000 (TA code)
// → TTBR1_EL1으로 walk
// → Page table entry:
//    NS = 0 (Secure)
//    XN = 0 (executable)
//    AP = 0b01 (r/w at EL1)
// → PA = 0x3F900000 (secure DRAM)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">MMU 페이지 테이블 (AArch64)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// OP-TEE는 VA_BITS=39 사용 (512GB virtual space)
// Translation table: 3-level or 4-level

// TTBR0_EL1: 사용자 영역 (TA)
// TTBR1_EL1: 커널 영역 (OP-TEE core)

// Page size 옵션
// - 4KB (표준)
// - 16KB (일부 플랫폼)
// - 64KB (대형 메모리)

// Page table walk
//           VA (39 bits)
// ┌──────┬──────┬──────┬──────┬────────────┐
// │ L0 idx│ L1 idx│ L2 idx│ L3 idx│ Page offset│
// │  9b  │  9b  │  9b  │  9b  │    12b    │
// └──────┴──────┴──────┴──────┴────────────┘

// L3 entry (leaf) 구조
struct pte {
    u64 valid    : 1;   // 1 = valid entry
    u64 type     : 1;   // 1 = Page (L3)
    u64 attr_idx : 3;   // MAIR attribute
    u64 ns       : 1;   // NS bit ← TrustZone 강제
    u64 ap       : 2;   // Access permission
    u64 sh       : 2;   // Shareability
    u64 af       : 1;   // Access Flag
    u64 ng       : 1;   // Not Global
    u64 reserved : 4;
    u64 oa       : 36;  // Output Address
    u64 pxn      : 1;   // Privileged XN
    u64 uxn      : 1;   // Unprivileged XN
    u64 sw_bits  : 4;
    u64 ignored  : 5;
};

// Secure world mapping
// - NS=0 for all kernel pages
// - NS=0 for TA pages
// - NS=1 for shared memory (controlled crossing)

// Normal world가 접근 시
// 1) MMU walk
// 2) NS bit check
// 3) NS world가 NS=0 entry 접근 → sync abort`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 페이지 할당자 & 캐시</h3>
      </div>
      <div className="not-prose mb-6"><PageAllocViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// OP-TEE heap allocator (core/mm/tee_mm.c)

// Bit-fields 기반 할당자
struct tee_mm_pool {
    vaddr_t lo;              // Pool 시작 주소
    vaddr_t hi;              // Pool 끝 주소
    size_t size;             // 총 크기
    size_t align;            // Alignment (보통 PAGE_SIZE)
    struct tee_mm_entry *entry;  // free list
    struct mutex lock;
};

// 할당
tee_mm_entry_t *tee_mm_alloc(struct tee_mm_pool *pool, size_t size) {
    mutex_lock(&pool->lock);
    // Best-fit 또는 First-fit
    entry = find_free_block(pool, size);
    if (entry) {
        split_if_needed(entry, size);
        mark_used(entry);
    }
    mutex_unlock(&pool->lock);
    return entry;
}

// 특수 보호
// 1) Guard pages (canary page)
//    - 할당된 영역 앞뒤에 unmapped page
//    - Overflow 즉시 탐지

// 2) ASLR (Address Space Layout Randomization)
//    - TA 로드 주소 랜덤화
//    - Stack/heap base 랜덤화
//    - Return-oriented attack 방어

// 3) Stack canary
//    - 함수 진입 시 stack에 canary value
//    - 함수 종료 시 canary 체크
//    - Buffer overflow 탐지

// 4) KASAN (Kernel Address Sanitizer)
//    - Shadow memory로 out-of-bounds 탐지
//    - 개발 빌드에서만 활성화`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Shared Memory — 두 세계 간 통신</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Normal world ↔ Secure world 데이터 전달

// 1. Shared memory 할당 (Linux 측)
struct tee_shm *shm = tee_shm_alloc(TEE_SHM_MAPPED | TEE_SHM_DMA_BUF, size);
// → Normal world physical memory (NS=1)

// 2. Physical address를 OP-TEE에 전달
// - SMC 인자 또는 shared memory pointer 필드로

// 3. OP-TEE가 shared memory를 Secure VA에 매핑
// NS=1로 매핑 → Secure world가 read/write 가능
// 하지만 normal world에서도 여전히 접근 가능

// 4. 데이터 복사 (not direct!)
// OP-TEE는 shared memory 내용을 secure heap에 복사 후 처리
// → TOCTOU(Time-of-check-to-time-of-use) 공격 방어
void *secure_buf = malloc(size);
memcpy(secure_buf, shared_buf, size);  // 순간 복사
validate(secure_buf);  // 자체 버퍼에서 검증
process(secure_buf);   // 처리
memcpy(shared_buf, secure_buf, size);  // 결과 복사
free(secure_buf);

// 주의사항
// - Shared memory는 attacker-controlled
// - Race conditions 주의 (한 번 읽고 자체 검증)
// - Pointer bounds 엄격 체크`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: OP-TEE 메모리 보호의 현실적 제약</p>
          <p>
            <strong>TZASC 의존성</strong>:<br />
            - Secure memory 영역은 부팅 시 고정<br />
            - 런타임 동적 크기 조정 어려움<br />
            - Secure DRAM 크기 사전 계획 필수 (보통 16~64MB)
          </p>
          <p className="mt-2">
            <strong>Cache coherency 이슈</strong>:<br />
            - Secure/Non-secure 캐시 line 분리 됨 (동일 PA 두 엔트리)<br />
            - Shared memory 동기화 시 cache flush 필수<br />
            - Performance impact 주의
          </p>
          <p className="mt-2">
            <strong>Side channel 취약성</strong>:<br />
            - SGX/TDX와 달리 LLC 파티셔닝 부재 (일부 ARM)<br />
            - 캐시 timing 공격 가능<br />
            - TrustZone 자체 완화책 제한적
          </p>
        </div>

      </div>
    </section>
  );
}
