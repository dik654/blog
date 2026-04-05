import GptViz from './viz/GptViz';

export default function RmeGpt() {
  return (
    <section id="rme-gpt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RME &amp; Granule Protection Table</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">RME — Realm Management Extension</h3>
        <p>
          <strong>RME</strong>: ARMv9-A 선택적 확장(ID_AA64PFR0_EL1.RME 필드)<br />
          <strong>4개 PAS(Physical Address Space)</strong>와 <strong>GPT</strong> 하드웨어 지원 추가<br />
          <strong>Monitor(EL3)</strong>가 GPT 갱신 → World 경계 정의
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RME 기능 확인 (부팅 시)
mrs x0, ID_AA64PFR0_EL1
ubfx x0, x0, #52, #4    // RME field
cmp x0, #1              // RMEv1 지원?
b.lt no_cca_panic

// EL3 초기화 (TF-A)
msr GPCCR_EL3, x0       // GPT Config
msr GPTBR_EL3, x1       // GPT base address
isb`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPT 구조 & 동작</h3>

        <GptViz />

        <p>
          <strong>GPT</strong>: 물리 메모리 granule(보통 4KB)마다 <strong>소유 PAS</strong> 기록하는 테이블<br />
          CPU/DMA가 메모리 접근 시 하드웨어가 자동 조회 → 불일치 시 <strong>GPF(Granule Protection Fault)</strong> 발생<br />
          MMU와 독립된 <strong>2차 보호 계층</strong> — Stage 2 이후에도 확인
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPT 테이블 형식</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 2-레벨 GPT (L0 + L1)
//
// L0 entry (Block): 1GB granule 전체 PAS 지정
// L0 entry (Table): L1 테이블 포인터
// L1 entry (Contiguous): 16 × 4KB 연속 granule
// L1 entry (Granules): 4KB 단위

// L0 테이블 (16비트 엔트리)
typedef struct {
    u64 contents : 4;    // 0: invalid, 1: block(PAS), 3: table
    u64 pas      : 2;    // 0=NS, 1=Secure, 2=Root, 3=Realm
    u64 reserved : 58;
} gpt_l0_entry;

// 크기
// PA 공간 52비트 기준
// L0: 4096 × 8B = 32KB (각 1GB 커버)
// L1: 각 L0 table entry당 16KB (256 × 64B)
// 총 GPT 메모리: 수 MB 수준

// 런타임 갱신
// Monitor가 SMC로 받아 GPT 업데이트
// TLB 플러시 필요: tlbi paallos`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PAS 전환 — SMC Delegate/Undelegate</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RMM이 메모리 delegate 요청 (Host가 Realm에 페이지 제공 시)

// 1) Host → RMM: RMI_GRANULE_DELEGATE
rmi_granule_delegate(granule_pa);

// 2) RMM → Monitor: SMC(GRANULE_DELEGATE)
asm volatile("smc #0"
             :: "r"(SMC_ASC_GRANULE_DELEGATE),
                "r"(granule_pa));

// 3) Monitor(EL3, TF-A)가 GPT 업데이트
// el3-runtime/asc_granule_delegate():
//   1. PA 유효성 검사
//   2. 현재 PAS 확인 (반드시 NS)
//   3. GPT entry 갱신: NS → Realm
//   4. Cache flush + TLBI
//   5. return to RMM

// 4) RMM이 Realm에 granule 할당
//   → RD·Rec·RTT·Data 등 목적별 사용

// Undelegate는 반대 방향: Realm → NS
// - 반드시 zeroize 후 전환 (정보 유출 방지)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Granule 타입 (RMM이 관리)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">타입</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
                <th className="border border-border px-3 py-2 text-left">크기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>Undelegated</code></td>
                <td className="border border-border px-3 py-2">NS PAS — Host 메모리</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Delegated</code></td>
                <td className="border border-border px-3 py-2">Realm PAS로 전환됨, 미할당</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RD (Realm Descriptor)</code></td>
                <td className="border border-border px-3 py-2">Realm 메타데이터</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Rec</code></td>
                <td className="border border-border px-3 py-2">Realm Execution Context (vCPU)</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RTT</code></td>
                <td className="border border-border px-3 py-2">Realm Translation Table</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Data</code></td>
                <td className="border border-border px-3 py-2">Realm 실제 메모리 페이지</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPF(Granule Protection Fault) 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Non-secure가 Realm granule 접근 시도
// → 하드웨어가 GPF 발생
// → Monitor(EL3)로 exception

// ESR_EL3 레코드
// EC = 0x1E (Granule Protection Check)
// ISS.GPF = 1
// ISS.PAS = 실제 소유 PAS
// FAR_EL3 = fault한 가상 주소
// HPFAR_EL3 = fault한 IPA (중첩 매핑 시)

// Monitor가 fault 분석 후
// - Normal World exception 주입
// - 또는 RMM/S-EL1로 exit

// 악성 접근 감지 흐름
// 1. Host OS 버그로 Realm PA 접근
// 2. GPT walk → PAS mismatch
// 3. GPF → EL3
// 4. TF-A가 Host로 abort exception 반환
// 5. Host kernel이 segfault 처리`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">MEC — Memory Encryption Contexts (옵션)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RME는 암호화 기본 아님 (GPT 격리만 필수)
// MEC(FEAT_MEC, ARMv9.4)가 암호화 추가

// 플랫폼별 MEC 구현
// - Arm CCA-capable 서버 CPU
// - 보통 AES-XTS + per-Realm KeyID
// - TDX MKTME 또는 SEV-SNP와 유사

// Realm마다 MECID 할당
// GPT entry에 MECID 포함 (RME-MEC extension)
//   → 메모리 컨트롤러가 key 선택

// Cold boot 방어
// - MEC 없으면 DRAM 암호화 안 됨 (격리만)
// - 물리 공격 상정 환경엔 MEC 필수

// 초기 CCA 실리콘 현황
// - Neoverse V3: MEC 미포함 (CPU 레벨 RME만)
// - 차세대: MEC 통합 예정`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: GPT vs EPT/S-EPT</p>
          <p>
            <strong>Intel EPT/S-EPT</strong>: 가상화 전용 — IPA→PA 매핑 + 권한<br />
            <strong>ARM GPT</strong>: 가상화와 독립 — PA별 소유 World만 기록
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ 단순함 — 4개 PAS만 관리<br />
            ✓ DMA에도 자동 적용 — SMMU와 통합<br />
            ✓ 외부 RAS 이벤트 처리 편함
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ per-Realm 메모리 격리는 RMM이 Stage 2로 따로 구현<br />
            ✗ GPT 갱신은 TLB shootdown 비용<br />
            ✗ 4KB granule 단위 → 대용량 메모리 시 GPT 크기 증가
          </p>
        </div>

      </div>
    </section>
  );
}
