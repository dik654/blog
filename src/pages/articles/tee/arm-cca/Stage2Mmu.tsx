import Stage2Viz from './viz/Stage2Viz';

export default function Stage2Mmu() {
  return (
    <section id="stage2-mmu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Realm Stage 2 — RTT 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 변환 3단계</h3>

        <Stage2Viz />

        <p>
          Realm 메모리 접근은 <strong>Stage 1 + Stage 2 + GPC</strong> 3단 검사 통과<br />
          <strong>Stage 2 = RTT(Realm Translation Table)</strong> — RMM이 관리<br />
          Host VMM은 Realm의 Stage 2 직접 수정 불가 → RMI 경유
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RTT 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RTT는 일반 ARM Stage 2 테이블 형식
// 4레벨 계층 (L0 → L1 → L2 → L3)
// 4KB granule 기준

// Realm 생성 시 starting level 결정
// IPA 40비트 → L1부터 시작
// IPA 48비트 → L0부터 시작

struct rtt_entry {
    u64 oa       : 36;    // Output Address (PA)
    u64 state    : 2;     // 0: unassigned, 1: assigned, 2: table_walk
    u64 ripas    : 2;     // EMPTY, RAM, DESTROYED
    u64 ns       : 1;     // 0=protected, 1=unprotected
    u64 attr     : 8;     // memory attributes
    u64 ap       : 2;     // access permission
    // ... ARMv9 스펙
};

// RTT 타입별 엔트리
// TABLE     : L1/L2가 하위 레벨 가리킴
// ASSIGNED  : 실제 granule 매핑됨
// UNASSIGNED: IPA가 EMPTY (접근 시 fault)
// DESTROYED : 이전 RAM이었으나 destroy됨`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">RTT_CREATE — 테이블 계층 확장</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime/core/rtt.c

int smc_rtt_create(u64 rtt_pa, u64 rd_pa, u64 ipa, u64 level) {
    /* RD lock */
    struct rd *rd = find_lock_rd(rd_pa);

    /* RTT walk — 부모 엔트리까지 */
    struct rtt_walk wi;
    rtt_walk_lock_unlock(rd, ipa, level - 1, &wi);

    /* 부모가 block(ASSIGNED) 상태면 table로 전환 */
    if (parent->state == RTT_STATE_ASSIGNED) {
        /* block → table 전환
           - block 하위 granule 전부 ASSIGNED로 복제
           - 부모를 TABLE로 변경 */
    }

    /* RTT granule state 전환: DELEGATED → RTT */
    granule_set_state(rtt_pa, GRANULE_STATE_RTT);

    /* 새 테이블 초기화 (UNASSIGNED로 채움) */
    memset(phys_to_virt(rtt_pa), 0, PAGE_SIZE);

    /* 부모 엔트리 갱신 */
    parent->oa    = rtt_pa;
    parent->state = RTT_STATE_TABLE;

    /* TLBI */
    tlbi_realm_s2(ipa);

    return RMI_SUCCESS;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">DATA_CREATE vs DATA_CREATE_UNKNOWN</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 2가지 방식으로 Realm에 메모리 추가

// [1] DATA_CREATE — 측정에 포함 (Realm NEW 상태만)
int smc_data_create(u64 data_pa, u64 rd_pa, u64 ipa,
                     u64 src_pa, u64 flags) {
    /* 1) src_pa에서 data_pa로 페이지 복사 */
    copy_from_ns(data_pa, src_pa);

    /* 2) 측정 업데이트 (RIM에 반영) */
    struct measure_data md = {
        .desc = "DATA",
        .ipa = ipa,
        .flags = flags,
    };
    rim_extend(rd, &md, sizeof(md));
    rim_extend(rd, phys_to_virt(data_pa), PAGE_SIZE);

    /* 3) Stage 2 매핑 */
    rtt_map_data(rd, ipa, data_pa);

    return RMI_SUCCESS;
}

// [2] DATA_CREATE_UNKNOWN — 측정 무관 (Realm ACTIVE 상태 허용)
int smc_data_create_unknown(u64 data_pa, u64 rd_pa, u64 ipa) {
    /* 페이지 내용 zero (측정 없음) */
    memset(phys_to_virt(data_pa), 0, PAGE_SIZE);

    /* 매핑만 수행 */
    rtt_map_data(rd, ipa, data_pa);

    /* RIM 변경 없음 → 런타임 추가 가능 */
    return RMI_SUCCESS;
}

// 차이점
// - DATA_CREATE: 초기 이미지 일부 (코드, 초기 데이터)
// - DATA_CREATE_UNKNOWN: 런타임 할당 (heap, swap)
//   → Realm이 Accept 의사를 RSI_IPA_STATE_SET으로 표시 필요`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Protected vs Unprotected IPA</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Realm의 IPA 공간 분할
//
// Protected IPA:   [0 .. 2^(ipa_bits - 1))
//   - Realm 전용
//   - Realm granule(Realm PAS)만 매핑
//   - Stage 2가 GPT와 일관성 강제
//
// Unprotected IPA: [2^(ipa_bits - 1) .. 2^ipa_bits)
//   - Host와 공유
//   - NS granule만 매핑 (Host 메모리)
//   - 예: virtio ring, DMA 버퍼

// 예: ipa_bits = 40
// Protected:   0x00_0000_0000 .. 0x7f_ffff_ffff
// Unprotected: 0x80_0000_0000 .. 0xff_ffff_ffff

// Realm 포인터
void *private_buf = phys_to_virt(0x40000000);       // Protected
void *shared_buf  = phys_to_virt(0x8040000000);     // Unprotected

// Host가 Unprotected IPA에 매핑 시
rmi_rtt_map_unprotected(rd, unprot_ipa, level, host_pa);
//   → Stage 2 엔트리에 NS=1 설정
//   → Host 메모리(GPT=NS) 바인딩`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TLB 관리 — Realm 격리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Realm에 VMID 할당
// 일반 VM의 VMID와 별도 네임스페이스

// RMI_REALM_CREATE 시
rd->vmid = alloc_realm_vmid();

// TLB invalidate (Realm 전용)
tlbi vmalls12e1is  // Stage 1 & 2, 모든 EL1, Inner Shareable
tlbi ipas2e1is, X  // IPA 기반

// Realm 컨텍스트 진입 시
msr VTTBR_EL2, rec->realm->rtt_base  // Realm S2 base
msr VTCR_EL2, rec->realm->vtcr
isb

// Exit 시
msr VTTBR_EL2, host_vttbr  // Host S2 복원
isb

// VMID 충돌 방지
// - Host VMID와 Realm VMID는 다른 컨텍스트
// - TLB entry에 World 비트 포함 → 혼동 없음`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 Stage 2를 RMM이 관리하는가</p>
          <p>
            일반 ARM 가상화: <strong>Host Hypervisor(EL2)가 Stage 2 관리</strong><br />
            CCA Realm: <strong>RMM(EL2 Realm)이 Stage 2 관리</strong>
          </p>
          <p className="mt-2">
            <strong>이유</strong>:<br />
            - Host Hypervisor는 untrusted<br />
            - Host가 S2 조작하면 Realm 메모리 우회 가능<br />
            - 대안: RMM이 소유 + RMI로 호출 중재
          </p>
          <p className="mt-2">
            <strong>비용</strong>:<br />
            - 모든 S2 수정이 SMC/HVC 오버헤드<br />
            - 페이지 매핑 지연 — 대량 할당 시 bottleneck<br />
            - 완화: RTT batch API, 큰 granule 지원
          </p>
          <p className="mt-2">
            <strong>TDX 비교</strong>:<br />
            - TDX도 S-EPT를 TD Module이 관리<br />
            - 구조는 거의 동일 — naming만 RTT vs S-EPT
          </p>
        </div>

      </div>
    </section>
  );
}
