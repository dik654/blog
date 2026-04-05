import AttestationViz from './viz/AttestationViz';
import SNPAttestFlowViz from './viz/SNPAttestFlowViz';
import ReportStructViz from './viz/ReportStructViz';
import VerifyFlowViz from './viz/VerifyFlowViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Attestation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '원격 증명 (Remote Attestation)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>원격 증명</strong>: untrusted 클라우드에서 게스트 VM의 <strong>신원·무결성</strong> 검증<br />
          "이 코드가 정말 SEV-SNP 보호하에 변조 없이 실행 중인가?"를 수학적 증명<br />
          <strong>3계층 인증서</strong>: AMD Root → ARK → ASK → VCEK → Report<br />
          <strong>VCEK</strong>: Versioned Chip Endorsement Key — 각 CPU + TCB 조합마다 고유
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('attest-report', codeRefs['attest-report'])} />
            <span className="text-[10px] text-muted-foreground self-center">AttestationReport 구조체</span>
            <CodeViewButton onClick={() => onCodeRef('guest-request', codeRefs['guest-request'])} />
            <span className="text-[10px] text-muted-foreground self-center">get_report() 드라이버</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">SNP Attestation Report 구조</h3>
      </div>
      <ReportStructViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-6">{`// SNP Attestation Report (1184 bytes)

struct snp_attestation_report {
    u32 version;              // 2 또는 3
    u32 guest_svn;            // Guest SVN
    u64 policy;               // Guest policy flags
    u8  family_id[16];        // Guest family
    u8  image_id[16];
    u32 vmpl;                 // Current VMPL
    u32 signature_algo;       // ECDSA P-384 = 1

    // TCB (Trusted Computing Base) versions
    struct tcb_version {
        u8 boot_loader;
        u8 tee;
        u8 reserved[4];
        u8 snp;
        u8 microcode;
    } platform_tcb;

    u64 platform_info;        // SMT enabled, TSME enabled
    u32 author_key_en;
    u8  report_data[64];      // User-provided nonce (challenge)
    u8  measurement[48];      // Launch digest (SHA-384)
    u8  host_data[32];        // Hypervisor-provided data
    u8  id_key_digest[48];
    u8  author_key_digest[48];
    u8  report_id[32];
    u8  report_id_ma[32];     // Migration agent report ID
    struct tcb_version reported_tcb;
    u8  cpuid_1_eax;          // Family/Model/Stepping
    u8  chip_id[64];

    // ... 기타 필드
    u8  signature[512];       // ECDSA signature
};

// 주요 필드
// - measurement: "이 VM 어떻게 런치됐나" (재계산 대조)
// - report_data: challenge-response용 nonce
// - platform_info: SMT/TSME 상태
// - platform_tcb: 현재 TCB 버전
// - signature: VCEK가 서명`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guest에서 Report 요청</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Guest kernel: drivers/virt/coco/sev-guest/sev-guest.c

// 1) /dev/sev-guest 디바이스 오픈
int fd = open("/dev/sev-guest", O_RDWR);

// 2) SNP_GET_REPORT ioctl
struct snp_guest_request_ioctl req = {
    .msg_version = 1,
    .req_data = (u64)&report_data,  // 64B nonce
    .resp_data = (u64)&report,
};
ioctl(fd, SNP_GET_REPORT, &req);

// Kernel 측 처리
long snp_guest_ioctl_report(struct snp_guest_dev *dev, ...) {
    // 1) Guest Message Request 구성
    struct snp_report_req *req = ...;
    memcpy(req->user_data, report_data, 64);

    // 2) GHCB로 Host에 전송
    rc = snp_issue_guest_request(SNP_GUEST_REQ_GET_REPORT, &input, &exit_info);

    // 3) Host가 ASP와 통신
    //    ASP가 report 생성 + VCEK로 서명
    //    결과를 guest message queue에 반환

    // 4) Guest가 응답 수신 & 복호화
    return copy_to_user(arg, resp, sizeof(resp));
}

// 시퀀스 카운터 사용
// - Guest↔ASP 메시지마다 nonce 증가
// - replay 방어
// - guest message encryption key (VMPCK)로 HMAC`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">증명 흐름</h3>
        <p>
          테넌트 애플리케이션이 클라우드의 게스트 VM을 검증하는 전체 과정
        </p>
      </div>
      <VerifyFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">AMD KDS (Key Distribution Service)</h3>
        <p>
          <strong>AMD 운영 공개 서비스</strong>: 칩 ID + TCB 버전 입력 → 해당 칩의 VCEK 인증서 반환<br />
          URL: <code>https://kdsintf.amd.com/vcek/v1/{'{processor}'}/{'{hwId}'}</code><br />
          오프라인 환경에선 인증서 사전 캐싱 필요 — AMD SEV snp-provision 도구 사용
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Verifier 측 검증 흐름 (전체)

// 1) Report 수신
report = receive_from_tenant();

// 2) CPU 타입 결정
cpu = decode_cpuid(report.cpuid_1_eax);
// "Genoa" 또는 "Milan" 등

// 3) VCEK 인증서 조회 (AMD KDS)
url = f"https://kdsintf.amd.com/vcek/v1/{cpu}/{report.chip_id}" \\
      f"?blSPL={report.reported_tcb.boot_loader}" \\
      f"&teeSPL={report.reported_tcb.tee}" \\
      f"&snpSPL={report.reported_tcb.snp}" \\
      f"&ucodeSPL={report.reported_tcb.microcode}"
vcek_cert = requests.get(url).content

// 4) Certificate chain 검증
//    AMD Root → ARK → ASK → VCEK
verify_cert_chain(vcek_cert, ark_cert, ask_cert, amd_root)

// 5) VCEK 공개키로 report signature 검증
vcek_pubkey = extract_pubkey(vcek_cert)
if not ecdsa_verify(report.signature, hash(report[:-512]), vcek_pubkey):
    return REJECT

// 6) Report 내용 검증
if report.report_data[:32] != my_challenge:
    return REJECT  // nonce mismatch
if report.measurement != expected_launch_digest:
    return REJECT  // 의도 안 한 이미지
if report.platform_tcb < minimum_tcb:
    return REJECT  // outdated TCB

// 7) 정책 적용
//    - VMPL = 0 인 경우 (secure kernel)
//    - policy bits 확인 (debug, migrate 등)

return ACCEPT`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">인증서 체인 상세</h3>
      </div>
      <div className="mt-8">
        <AttestationViz />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">SNP 증명 시퀀스</h3>
        <SNPAttestFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 통합 — snpguest 도구</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// github.com/virtee/snpguest (Rust)

# Guest 안에서 report 요청
snpguest report report.bin random-nonce.bin --random

# 인증서 조회
snpguest certificates PEM ./certs/

# Verifier 측 검증
snpguest verify certs -d ./certs/
snpguest verify attestation -d ./certs/ -r report.bin

# TCB 버전 확인
snpguest display report report.bin
# Reported TCB Version:
#   Boot Loader: 7
#   TEE:         0
#   SNP:         20
#   Microcode:   208

# Measurement 재계산
snpguest generate measurement \\
    --ovmf OVMF.fd \\
    --kernel vmlinuz \\
    --initrd initrd \\
    --cmdline "console=ttyS0"
# Expected measurement: abc123...`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: VCEK의 보안 속성</p>
          <p>
            <strong>VCEK 특성</strong>:<br />
            - 칩 ID (chip_id) + TCB 버전에 결속<br />
            - TCB 업데이트 시 새 VCEK 발급 → 자동 invalidation<br />
            - Old TCB VCEK는 AMD KDS가 반환 거부 (정책 따라)
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ TCB 강제 — 최신 microcode 없으면 증명 실패<br />
            ✓ vulnerability 패치 시 강제 업그레이드 가능<br />
            ✓ 칩별 고유 → 칩 도난 시 추적
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ AMD KDS 서비스 의존<br />
            ✗ 오프라인 환경은 사전 캐싱 필요<br />
            ✗ TCB 변경 시 verifier 정책도 업데이트 필요
          </p>
        </div>

      </div>
    </section>
  );
}
