import ASPViz from './viz/ASPViz';
import PSPCommPathViz from './viz/PSPCommPathViz';

export default function ASP() {
  return (
    <section id="asp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AMD Secure Processor (ASP)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ASP(AMD Secure Processor)</strong> — 구 이름 PSP(Platform Security Processor)<br />
          EPYC CPU 다이에 내장된 <strong>ARM Cortex-A5</strong> 기반 독립 보안 프로세서<br />
          <strong>자체 펌웨어</strong>(AMD 서명) 실행 — x86 코어와 완전 분리<br />
          SEV의 <strong>모든 암호 연산</strong> 담당 — 키 생성, 서명, VM 인증
        </p>
      </div>

      <ASPViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP 하드웨어 구성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ASP 하드웨어 스펙 (EPYC 내장)

// CPU Core: ARM Cortex-A5
// - 32-bit RISC
// - 500 MHz ~ 1 GHz (세대별)
// - 독립 ROM + SRAM
// - Main x86 메모리 접근 가능 (but 격리됨)

// Memory
// - Boot ROM: AMD 서명된 초기 코드
// - SRAM: 64KB ~ 256KB (펌웨어 실행용)
// - Shared DRAM: mailbox 통신용

// Crypto Engines
// - AES-128/256 accelerator
// - SHA-256/384 hash engine
// - RSA 2048/4096
// - ECDSA P-256/P-384
// - HMAC, HKDF
// - TRNG (True Random Number Generator)

// Interfaces
// - Mailbox with x86 cores (SMI-like)
// - Shared memory region (SEV command buffer)
// - eFUSE access (chip-unique secrets)

// 위치
// ┌─────────────────────────────────┐
// │  EPYC CPU Die                   │
// │                                 │
// │  ┌────────┐  ┌─────────────┐    │
// │  │ Cores  │  │   ASP       │    │
// │  │ (x86)  │  │ (ARM A5)    │    │
// │  └────────┘  └─────────────┘    │
// │                                 │
// │  ┌──────────────────────────┐   │
// │  │  Memory Controller       │   │
// │  │  + AES Engine            │   │
// │  └──────────────────────────┘   │
// └─────────────────────────────────┘`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP 책임</h3>
        <ul>
          <li><strong>시스템 보안 부팅</strong>: BIOS, kernel 서명 검증 chain</li>
          <li><strong>SEV 펌웨어 실행</strong>: 모든 SEV command 처리</li>
          <li><strong>키 생성·관리</strong>: VM별 AES 키, 인증서 키</li>
          <li><strong>Attestation</strong>: VCEK, SEV Report 서명</li>
          <li><strong>TRNG</strong>: 안전한 무작위성 제공</li>
          <li><strong>fTPM</strong>: firmware TPM 에뮬레이션 (옵션)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP 펌웨어 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ASP 부팅 체인 (all AMD-signed)

// Stage 0: Boot ROM (immutable, AMD 서명 공개키 내장)
boot_rom:
    verify_sig(stage1, amd_root_key);
    jump(stage1);

// Stage 1: Off-Chip Bootloader (OCB)
stage1:
    load_from_flash(asp_firmware);
    verify_sig(asp_firmware, amd_asp_key);
    jump(asp_firmware);

// Stage 2: ASP OS (main firmware)
asp_firmware:
    init_crypto_engines();
    setup_mailbox();
    event_loop:
        cmd = recv_from_host();
        dispatch(cmd);

// SEV 명령 처리 (예)
void sev_handler(SEVCommand *cmd) {
    switch (cmd->id) {
        case SEV_CMD_INIT:
            // SEV platform 초기화
            generate_cek();  // Chip Endorsement Key
            break;

        case SEV_CMD_LAUNCH_START:
            // 게스트 VM 런치 시작
            asid = alloc_asid();
            vm_key = generate_vm_key();  // AES-128
            store_key(asid, vm_key);
            break;

        case SEV_CMD_ATTESTATION:
            // 증명 보고서 생성
            measure_guest();
            sign_report_with_vcek();
            break;

        // ... 수십 개 명령
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Host ↔ ASP 통신 (Mailbox)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Host가 SEV 명령 요청하는 경로

// 1) Host (Linux KVM) 측
// drivers/crypto/ccp/sev-dev.c

struct sev_data_launch_start {
    __u32 handle;
    __u32 policy;
    __u8  dh_cert_addr[8];   // DH 키 교환용 인증서
    __u32 dh_cert_len;
    __u8  session_addr[8];   // 세션 데이터
    __u32 session_len;
};

int sev_do_cmd(int cmd, void *data) {
    struct sev_device *sev = psp_master->sev_data;

    // Command queue에 기입
    iowrite32(cmd, sev->io_regs + SEV_CMDRESP_REG);

    // Doorbell: ASP 깨우기
    iowrite32(1, sev->io_regs + SEV_CMD_READY);

    // 응답 polling (타임아웃 5초)
    while (timeout--) {
        if (ioread32(sev->io_regs + SEV_STATUS) & SEV_READY)
            break;
        udelay(100);
    }

    // Status 읽기
    status = ioread32(sev->io_regs + SEV_CMD_STATUS);
    return status;
}

// 2) ASP 측이 같은 mailbox 읽어 command 처리
// 3) Shared DRAM buffer로 대용량 데이터 전달
// 4) ASP가 결과 기입 후 응답 비트 설정`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PSP 펌웨어 & 통신 경로</h3>
      </div>
      <PSPCommPathViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASP TCB 이슈</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ASP는 SEV의 Trust Anchor
// → ASP 펌웨어 버그 = 전체 시스템 보안 붕괴

// 과거 취약점 (공개)
// [CVE-2018-8935] RCE in ASP firmware (2018)
//   - Master Chain of Trust 우회
//   - AMD가 microcode 업데이트로 대응
//
// [CVE-2019-9836] Spectre-like in ASP
//   - ASP 메모리 접근 timing 누출
//   - 특정 펌웨어 버전 영향
//
// [AMD SB-1051] SEV firmware vulnerability (2022)
//   - Replay 공격 (SEV-SNP pre-fix)
//   - Milan/Genoa에서 패치됨

// 방어
// - ASP firmware는 AMD만 업데이트 가능
// - Signed + Sealed (anti-rollback)
// - Genoa+: TCB Versioning (attestation에 포함)
// - 클라우드 사업자는 최신 펌웨어 강제`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: ASP는 왜 ARM Cortex-A5인가?</p>
          <p>
            <strong>디자인 선택 근거</strong>:<br />
            - x86 코어는 speculative execution 취약 (Spectre 등)<br />
            - A5는 in-order 단순 코어 → side-channel 공격 표면 작음<br />
            - 독립 ISA → x86 exploit 재활용 불가
          </p>
          <p className="mt-2">
            <strong>TCB 크기 고려</strong>:<br />
            - ASP firmware ~512KB<br />
            - 형식 검증 가능 범위<br />
            - TPM/HSM과 비슷한 레벨
          </p>
          <p className="mt-2">
            <strong>Intel ME와 유사</strong>:<br />
            - Intel Management Engine = 별도 Quark/x86 core<br />
            - AMD ASP = Cortex-A5<br />
            - 둘 다 "always-on" 보안 코어<br />
            - 그러나 ASP는 SEV 전용, ME는 광범위한 플랫폼 관리
          </p>
        </div>

      </div>
    </section>
  );
}
