import SEVBasicsViz from './viz/SEVBasicsViz';
import EncryptionFlowViz from './viz/EncryptionFlowViz';

export default function SEVBasics() {
  return (
    <section id="sev-basics" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SEV 기본 메커니즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>AES-128 메모리 암호화</strong> — SEV의 핵심<br />
          <strong>SME/TME 엔진</strong>이 CPU-DRAM 간 모든 데이터 실시간 암호화/복호화<br />
          각 VM은 <strong>고유한 AES 키</strong> 보유 — ASP가 관리<br />
          <strong>C-bit</strong> — 페이지 테이블 비트로 페이지별 암호화 여부 제어
        </p>
      </div>

      <SEVBasicsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 레벨 암호화 흐름</h3>
        <p>
          소프트웨어 수정 없이 투명 동작 — 메모리 컨트롤러 통합<br />
          성능 오버헤드 ~2-5% (AES 엔진이 per-cycle inline)
        </p>
      </div>
      <EncryptionFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">C-bit (Encrypt bit) — Page Table 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// AMD64 Page Table Entry (x86_64, 4KB page)
// 비트 레이아웃
//
// 63            52 51         C      12 11  0
// ┌───────────────┬─────────┬─┬────────┬─────┐
// │ NX · PK · ... │  PA[51:C+1]  PA[C-1:12] │ perms│
// └───────────────┴─────────┴─┴────────┴─────┘
//                           ↑
//                         C-bit
//                    (Encrypt bit, 보통 비트 47)

// C-bit 위치 조회
cpuid(0x8000_001f);
  → EBX[5:0]  = C-bit 위치 (예: 47)

// 페이지 암호화 설정
// - C-bit = 1 → 메모리 컨트롤러가 해당 페이지 암호화
// - C-bit = 0 → 평문 접근 (shared 메모리)

// 게스트 VM 입장에서
void *private_mem = mmap(NULL, 4096, PROT_RW, MAP_PRIVATE, -1, 0);
// 커널이 자동으로 PTE에 C-bit 설정 (SEV VM이면)

void *shared_mem = mmap_decrypted(NULL, 4096);
// virtio, DMA 버퍼용 — C-bit = 0`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">AES-128 XEX (Xor-Encrypt-Xor) 모드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SEV는 AES-128 XEX 사용 (SEV-SNP부터)
// Tweakable block cipher — 주소 의존 암호화

// 암호화 공식
// C = AES_K(P ⊕ AES_K(T)) ⊕ AES_K(T)
// 여기서 T = 16B tweak (물리 주소 유래)

// 목적
// - 같은 평문 → 주소 다르면 다른 암호문
// - Rainbow table 공격 무력화
// - Chained CBC보다 parallel 친화적

// SEV 이전 버전은 AES-128 단순 모드
// → 동일 평문 블록이 동일 암호문 → 패턴 누출 가능
// SEV-SNP에서 XEX로 업그레이드

// 하드웨어 구현
// - AES 엔진이 메모리 컨트롤러 내장
// - 16B(128-bit) 블록 단위
// - 캐시 라인(64B) = 4 AES 블록
// - parallel 처리 → 지연 시간 최소화`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ASID & 키 관리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ASID(Address Space Identifier) — 각 VM 식별자

// CPUID로 최대 ASID 조회
cpuid(0x8000_001f);
  → ECX[31:0] = MAX_ASID (예: 1006 for Genoa)

// VM 생성 시 ASID 할당
// - Host hypervisor가 free ASID pool에서 선택
// - 실제 AES 키는 ASP가 관리 (Host 미노출)

// Key storage in CPU
// ┌──────────────────────────────────┐
// │  CPU internal key table          │
// │  ┌────┬─────────────────────┐    │
// │  │ASID│ AES-128 Key (16B)   │    │
// │  ├────┼─────────────────────┤    │
// │  │ 0  │ Host key (TME)      │    │
// │  │ 1  │ VM_A key            │    │
// │  │ 2  │ VM_B key            │    │
// │  │ .. │ ...                 │    │
// │  │1006│ VM_1006 key         │    │
// │  └────┴─────────────────────┘    │
// └──────────────────────────────────┘

// 메모리 접근 시
// 1) TLB walk → PA 획득
// 2) TLB에서 ASID 조회
// 3) ASID → Key 선택
// 4) AES 엔진이 해당 키로 (en/de)crypt

// 주요 특성
// - Host는 VM 키 절대 접근 불가
// - VM 종료 시 ASID → key slot 비움
// - 키 자체는 CPU에서 vanish (DRAM 저장 안 됨)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">SEV 활성화 순서</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Host 측 활성화 (BIOS + kernel)

// 1) BIOS에서 SEV 활성화
//    Advanced → CPU Configuration → SMEE = Enabled
//    Advanced → CPU Configuration → SEV-SNP Support = Enabled

// 2) Linux 커널 부트 파라미터
//    kernel boot args:
//    mem_encrypt=on             # TME 활성화
//    kvm_amd.sev=1              # SEV 호스트 지원
//    kvm_amd.sev_es=1           # SEV-ES
//    kvm_amd.sev_snp=1          # SEV-SNP

// 3) 호스트 확인
dmesg | grep SEV
// [    0.456] SEV supported: 509 ASIDs
// [    0.457] SEV-ES supported: 126 ASIDs
// [    0.458] SEV-SNP supported

// 4) QEMU VM 시작 (SEV)
qemu-system-x86_64 \\
    -machine q35,memory-encryption=sev0 \\
    -object sev-guest,id=sev0,policy=0x01,cbitpos=47,reduced-phys-bits=5 \\
    -m 4G \\
    -drive file=ubuntu.qcow2

// policy bits
// 0: SEV 활성 (필수)
// 1: SEV-ES 활성
// 2: no-debug (디버그 금지)
// 3: no-key-sharing (키 공유 금지)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 AES-128인가?</p>
          <p>
            <strong>선택 이유</strong>:<br />
            - 하드웨어 가속 성숙 (AES-NI 수십 년)<br />
            - 16B 블록 = 캐시라인(64B)의 정확한 1/4<br />
            - 메모리 컨트롤러 내장 쉬움
          </p>
          <p className="mt-2">
            <strong>AES-256이 아닌 이유</strong>:<br />
            - 128-bit로 post-quantum까지 충분 (Grover 고려 시 64-bit)<br />
            - 256-bit는 latency 2배<br />
            - Intel TME/MKTME도 AES-128 또는 AES-XTS
          </p>
          <p className="mt-2">
            <strong>SEV-SNP의 tweak 개선</strong>:<br />
            - 초기 SEV: AES-ECB-like → 블록 반복 패턴 누출<br />
            - SNP: XEX with address tweak → 위치 의존 암호문<br />
            - Ciphertext Hiding(Turin): 추가 masking
          </p>
        </div>

      </div>
    </section>
  );
}
