import GuestManagementViz from './viz/GuestManagementViz';
import ASIDMappingViz from './viz/ASIDMappingViz';

export default function GuestManagement() {
  return (
    <section id="guest-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게스트 VM 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ASID</strong>(Address Space Identifier) + <strong>VEK</strong>(VM Encryption Key) 쌍으로 VM 식별<br />
          각 게스트에 고유 ASID 배정 → 메모리 컨트롤러가 AES 키 선택<br />
          <strong>ASP</strong>가 키 생명주기 관리 — 생성·저장·파괴<br />
          <strong>Launch Sequence</strong>: START → UPDATE_DATA → MEASURE → FINISH
        </p>
      </div>

      <GuestManagementViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">VM 생성 시퀀스 (SEV)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// KVM + QEMU가 SEV VM 생성하는 전체 흐름
// drivers/crypto/ccp/sev-dev.c

// Step 1: Platform 초기화 (한번만)
sev_do_cmd(SEV_CMD_INIT, NULL);
  // → ASP가 platform key 준비
  // → Platform Endorsement Key (PEK) 생성

// Step 2: Guest context 할당
struct sev_data_launch_start start = {
    .policy = 0x01,    // SEV enabled
};
sev_do_cmd(SEV_CMD_LAUNCH_START, &start);
  // → 새 ASID 할당 (예: 3)
  // → VM Encryption Key (VEK) 생성
  // → Guest handle 반환

handle = start.handle;

// Step 3: 초기 페이지 추가 & 암호화
for each page in guest_initial_image:
    struct sev_data_launch_update_data update = {
        .handle = handle,
        .address = guest_phys_addr,
        .length = 4096,
    };
    sev_do_cmd(SEV_CMD_LAUNCH_UPDATE_DATA, &update);
    // → ASP가 페이지를 VEK로 암호화
    // → 측정 해시에 반영

// Step 4: VMSA 암호화 (SEV-ES)
struct sev_data_launch_update_vmsa vmsa = {
    .handle = handle,
    .address = vcpu_vmsa_phys,
};
sev_do_cmd(SEV_CMD_LAUNCH_UPDATE_VMSA, &vmsa);

// Step 5: 측정값 확보
struct sev_data_launch_measure measure = {
    .handle = handle,
    .address = measurement_buf,
    .len = 32,
};
sev_do_cmd(SEV_CMD_LAUNCH_MEASURE, &measure);
// → SHA-256(VEK-encrypted pages) 반환
// → Guest owner가 이 값 검증 (attestation)

// Step 6: Launch 완료
sev_do_cmd(SEV_CMD_LAUNCH_FINISH, &handle);
// → VM 실행 준비 완료`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">VMSA — VM State Save Area (SEV-ES)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SEV-ES부터 레지스터 상태도 암호화
// VMRUN/VMEXIT 시 VMSA를 AES로 보호

struct vmcb_save_area {
    // Segment selectors
    u16 es_selector; u16 cs_selector; u16 ss_selector; u16 ds_selector;

    // Control registers
    u64 cr0; u64 cr2; u64 cr3; u64 cr4;
    u64 efer; u64 dr7; u64 dr6;

    // RFLAGS, RIP, RSP
    u64 rflags; u64 rip; u64 rsp;

    // General purpose registers
    u64 rax, rbx, rcx, rdx, rdi, rsi, rbp;
    u64 r8, r9, r10, r11, r12, r13, r14, r15;

    // FPU/SSE state
    u8 fx_state[512];
};

// VMEXIT 발생 시
// 1) CPU가 VMSA를 DRAM에 기록
// 2) ASP가 VEK로 암호화
// 3) Hypervisor는 암호문만 봄
// 4) VMRUN 시 역순으로 복호화·복원

// SEV(no ES)의 취약점
// - VMSA가 평문으로 저장
// - Hypervisor가 레지스터 관측 가능
// - RDTSC 값 조작 가능 (timing side channel)
// → SEV-ES가 이를 해결`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">GHCB — Guest-Host Communication Block (SEV-ES)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SEV-ES에서 guest → host 통신 채널
// 레지스터가 암호화되어 있으므로 기존 VMEXIT 방식 사용 불가

// GHCB는 평문 shared page (C-bit = 0)
// Guest가 필요한 레지스터만 선별 공유

struct ghcb {
    u8  reserved_1[0x800];
    u8  valid_bitmap[0x10];  // 어떤 필드가 유효한지

    struct ghcb_save_area save;  // 공유할 레지스터

    u64 sw_exit_code;      // VMEXIT code (게스트가 지정)
    u64 sw_exit_info_1;
    u64 sw_exit_info_2;
    u64 sw_scratch;

    u64 version;
    u64 protocol;
};

// GHCB 사용 예: WRMSR
// Guest가 MSR write하려면
//   1) GHCB에 MSR 번호 + value 기입
//   2) valid_bitmap에 해당 필드 표시
//   3) vmmcall (→ hypervisor로 exit)
//   4) Host가 GHCB 읽고 처리
//   5) VMRUN으로 복귀

// MSR Protocol (standard GHCB protocol)
__wrmsr(MSR_AMD64_SEV_ES_GHCB, ghcb_paddr | GHCB_MSR_PROTOCOL);
asm("vmmcall");`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ASID & 키 관리</h3>
      </div>
      <ASIDMappingViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASID Pool 관리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Host kernel이 ASID pool 관리
// arch/x86/kvm/svm/sev.c

// 3가지 ASID range
// [1 .. asid_max_sev_legacy]    : SEV (without ES)
// [asid_max_sev_legacy+1 .. max] : SEV-ES/SNP

#define SEV_ASID_COUNT_MAX 509      // Rome/Milan
#define SEV_ASID_COUNT_MAX 1006     // Genoa
#define SEV_ES_ASID_COUNT 126       // ES-capable ASIDs (Milan)

static DECLARE_BITMAP(sev_asid_bitmap, SEV_ASID_COUNT_MAX);

// VM 생성 시 ASID 할당
int sev_asid_new(struct kvm_sev_info *sev) {
    unsigned int asid;

    if (sev->es_active)
        asid = bitmap_find_next_zero_area(
            sev_asid_bitmap, max_es, 1, 1, 0);
    else
        asid = bitmap_find_next_zero_area(
            sev_asid_bitmap, max_legacy, 1, 1, 0);

    if (asid >= max) return -EBUSY;
    set_bit(asid, sev_asid_bitmap);
    return asid;
}

// VM 종료 시 해제
void sev_asid_free(unsigned int asid) {
    clear_bit(asid, sev_asid_bitmap);
    // ASP에 키 파괴 요청
    sev_do_cmd(SEV_CMD_DEACTIVATE, &asid);
}`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: ASID 한계가 의미하는 것</p>
          <p>
            <strong>ASID 수 제약</strong>:<br />
            - Genoa: 1006 SEV-ES ASIDs<br />
            - 이게 동시 실행 VM 최대 개수<br />
            - VM 한 대가 ASID 한 개 점유
          </p>
          <p className="mt-2">
            <strong>클라우드 용량 영향</strong>:<br />
            - 1 host = 최대 ~1000 SEV VMs<br />
            - 일반 KVM은 수천 개 VM 가능 (메모리·CPU 한계까지)<br />
            - SEV는 하드웨어 제약 더 빡빡
          </p>
          <p className="mt-2">
            <strong>실전 영향</strong>:<br />
            - 대형 클라우드는 ASID 추적 서비스 운영<br />
            - oversubscription 주의 필요<br />
            - 최신 세대일수록 ASID 많음 → 업그레이드 동기
          </p>
        </div>

      </div>
    </section>
  );
}
