import KernelSupportViz from './viz/KernelSupportViz';
import KVMIoctlViz from './viz/KVMIoctlViz';

export default function KernelSupport() {
  return (
    <section id="kernel-support" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리눅스 커널 SEV 지원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>KVM</strong> 모듈 + <strong>/dev/sev</strong> + <strong>CCP</strong>(Cryptographic Coprocessor) 드라이버<br />
          QEMU/libvirt가 ioctl 인터페이스로 SEV VM 생성·관리<br />
          <strong>Guest 커널</strong>도 SEV-aware 필요 — mem_encrypt, GHCB 등<br />
          <strong>성숙 시점</strong>: Linux 5.19(SNP guest), 6.5(SNP host production)
        </p>
      </div>

      <KernelSupportViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">CCP 드라이버 — ASP 통신</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// drivers/crypto/ccp/sev-dev.c
// CCP = Cryptographic Coprocessor (ASP의 Linux 이름)

static int sev_platform_probe(struct sp_device *sp) {
    struct sev_device *sev;

    sev = devm_kzalloc(sp->dev, sizeof(*sev), GFP_KERNEL);
    sev->dev = sp->dev;
    sev->io_regs = sp->io_map;      // MMIO 레지스터

    // Character device 등록 (/dev/sev)
    ret = misc_register(&sev_misc_dev);

    // Platform 초기화 요청
    sev_platform_init(&error);

    return 0;
}

// File operations (/dev/sev)
static const struct file_operations sev_fops = {
    .owner = THIS_MODULE,
    .unlocked_ioctl = sev_ioctl,
};

// 사용자공간 ioctl
long sev_ioctl(struct file *file, unsigned int ioctl, unsigned long arg) {
    struct sev_issue_cmd input;

    copy_from_user(&input, (void __user *)arg, sizeof(input));

    switch (input.cmd) {
    case SEV_FACTORY_RESET:   return sev_ioctl_do_reset(&input);
    case SEV_PLATFORM_STATUS: return sev_ioctl_do_platform_status(&input);
    case SEV_PEK_CERT_IMPORT: return sev_ioctl_do_pek_import(&input);
    case SEV_GET_ID:          return sev_ioctl_do_get_id(&input);
    // ... ~20 commands
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">KVM SEV VM 생성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// arch/x86/kvm/svm/sev.c

// 1) KVM_CREATE_VM으로 VM 생성
int kvm_fd = open("/dev/kvm", O_RDWR);
int vm_fd = ioctl(kvm_fd, KVM_CREATE_VM, KVM_X86_SEV_VM);

// 2) SEV 초기화
struct kvm_sev_cmd sev_cmd = {
    .id = KVM_SEV_INIT,
};
ioctl(vm_fd, KVM_MEMORY_ENCRYPT_OP, &sev_cmd);

// 3) Policy 설정
struct kvm_sev_launch_start start = {
    .policy = SEV_POLICY_ES | SEV_POLICY_SEV,
    .dh_uaddr = (u64)dh_cert,
    .dh_len = dh_cert_len,
    .session_uaddr = (u64)session,
    .session_len = session_len,
};
sev_cmd.id = KVM_SEV_LAUNCH_START;
sev_cmd.data = (u64)&start;
ioctl(vm_fd, KVM_MEMORY_ENCRYPT_OP, &sev_cmd);

// 4) 게스트 메모리 페이지 암호화
struct kvm_sev_launch_update_data update = {
    .uaddr = (u64)guest_mem,
    .len = guest_mem_size,
};
sev_cmd.id = KVM_SEV_LAUNCH_UPDATE_DATA;
ioctl(vm_fd, KVM_MEMORY_ENCRYPT_OP, &sev_cmd);

// 5) Measurement 획득
struct kvm_sev_launch_measure measure;
sev_cmd.id = KVM_SEV_LAUNCH_MEASURE;
ioctl(vm_fd, KVM_MEMORY_ENCRYPT_OP, &sev_cmd);

// 6) VM 실행 가능 상태로 finalize
sev_cmd.id = KVM_SEV_LAUNCH_FINISH;
ioctl(vm_fd, KVM_MEMORY_ENCRYPT_OP, &sev_cmd);

// 7) vCPU 실행 (KVM_RUN)
for each vcpu: pthread_create(kvm_run_vcpu);`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guest 커널 SEV 지원</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// arch/x86/mm/mem_encrypt_amd.c

// Guest 초기화 (early boot)
void __init sme_early_init(void) {
    // CPUID로 SEV 활성 확인
    if (!(cpuid_eax(0x8000_001f) & BIT(1)))
        return;  // SEV not active

    // C-bit 위치 저장
    sme_me_mask = 1UL << cpuid_ebx(0x8000_001f);

    // Early page tables에 C-bit 적용
    for each pgd_entry: pgd_entry |= sme_me_mask;
}

// Shared pages 생성 (DMA, virtio)
void *ioremap_encrypted(phys_addr_t addr, size_t size) {
    // C-bit = 1 (암호화)
    return __ioremap_caller(addr | sme_me_mask, size, ...);
}

void *ioremap_decrypted(phys_addr_t addr, size_t size) {
    // C-bit = 0 (shared)
    return __ioremap_caller(addr & ~sme_me_mask, size, ...);
}

// set_memory_decrypted API
int set_memory_decrypted(unsigned long addr, int numpages) {
    // 1) PTE에서 C-bit 제거
    __change_page_attr_set_clr(addr, ~sme_me_mask, 0);

    // 2) TLB flush
    flush_tlb_kernel_range(addr, addr + numpages * PAGE_SIZE);

    // 3) 페이지 zero (이전 암호화 데이터 제거)
    memset((void *)addr, 0, numpages * PAGE_SIZE);

    return 0;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">KVM SEV ioctl 인터페이스</h3>
      </div>
      <KVMIoctlViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">AMD SEV Tool — 사용자 유틸리티</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// github.com/AMDESE/sev-tool

# 설치
git clone https://github.com/AMDESE/sev-tool.git
cd sev-tool && autoreconf -vif && ./configure && make

# Platform 상태 확인
./sevtool --platform_status
# {
#   "api_major": 1,
#   "api_minor": 49,
#   "build_id": 27,
#   "state": "Working",
#   "owner": "Self-Owned",
#   "guest_count": 3
# }

# PDH 인증서 발급
./sevtool --pdh_cert_export

# OCA(Owner Certificate Authority) 자체 생성
./sevtool --generate_oca --in oca_priv_key

# Attestation quote 요청 (SNP)
./sevtool --validate_cert_chain
./sevtool --generate_attestation_report nonce.bin

# 실전 사용
# 1) 클라우드 사업자가 기본 PDH cert 제공
# 2) 테넌트가 OCA 생성 → PEK 교체 → 자체 인증 체인
# 3) Attestation 받아 pre-launch 검증`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: SEV Linux 지원의 진화</p>
          <p>
            <strong>초기 지원 (2017 이전)</strong>:<br />
            - SEV 1.0만 지원<br />
            - 수동 패치 필요<br />
            - QEMU 별도 빌드
          </p>
          <p className="mt-2">
            <strong>메인라인 통합 (2019~2022)</strong>:<br />
            - Linux 5.11: SEV-ES 정식 통합<br />
            - Linux 5.19: SEV-SNP guest<br />
            - Linux 6.5: SEV-SNP host production
          </p>
          <p className="mt-2">
            <strong>현재(2024)</strong>:<br />
            - 주요 배포판 기본 지원 (Ubuntu 22.04+, RHEL 9+)<br />
            - Kubernetes Confidential Containers 통합<br />
            - SNP 기능이 default SEV 모드<br />
            - Nested virtualization 지원 개선
          </p>
        </div>

      </div>
    </section>
  );
}
