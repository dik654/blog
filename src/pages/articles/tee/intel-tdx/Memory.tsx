import MktmeViz from './viz/MktmeViz';
import SeptViz from './viz/SeptViz';

export default function Memory() {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 보호 — MKTME &amp; Secure EPT</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">MKTME — Multi-Key Total Memory Encryption</h3>

        <MktmeViz />

        <p>
          <strong>MKTME</strong>: TME의 확장 — 여러 키를 동시에 사용<br />
          <strong>TD마다 별도 AES-XTS 키</strong> — 물리적으로 분리된 암호화 도메인<br />
          메모리 컨트롤러(Memory Controller)가 각 캐시라인 쓰기/읽기 시 암/복호화 수행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">KeyID 인코딩 — 물리 주소 상위 비트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 52비트 물리 주소 레이아웃 (예: MK_TME_KEYID_BITS=6)
// [51 .. 46]  [45 .. 0]
//  KeyID(6b)   실제 PA(46b)

// CPUID로 KeyID 비트 수 조회
cpuid(0x1f);
  → EBX[7:0]  = MAX_KEYID_BITS  (예: 6 → 최대 64 KeyID)
  → EDX[15:0] = MAX_KEYID       (예: 63)

// TDX에서 나누어 씀
// KeyID 0        : Host (TME 공유 키)
// KeyID 1..N     : Private(TDX) — TD Module이 할당
// KeyID N+1..M   : Shared(MKTME) — VMM이 일반 VM용으로 사용 가능

// 물리 주소 예시
PA = 0x0000_0000_1234_5000  // KeyID=0 (Host)
PA = 0x0003_0000_1234_5000  // KeyID=3 (TD #3)`}</pre>
        <p>
          <strong>KeyID는 PA 최상위 비트</strong>: 메모리 컨트롤러가 그 값으로 키 선택<br />
          소프트웨어 입장에선 PA가 넓어진 것처럼 보임 (46b → 52b)<br />
          TD에는 KeyID 필드 투명 — TD Module이 PA 변환 시 자동 주입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">AES-XTS 암호화 & 무결성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TDX 1.0: 무결성 없음
// - AES-XTS-128 암호화만
// - MITM 메모리 변조 탐지 못 함 (단 랜덤값 됨)

// TDX 1.5+: Cryptographic Integrity 옵션
// - TD_ATTRIBUTES.SEPT_VE_DISABLE=0 + config 플래그
// - 28-bit MAC per 캐시라인 저장 (ECC 비트 활용)
// - 변조된 데이터 접근 시 MCE(Machine Check Exception)

// 공격 모델 방어
// ✓ Physical DRAM read    → 암호문만 노출
// ✓ DRAM bit-flip         → 무결성 MAC으로 탐지 (TDX 1.5)
// ✗ Replay attack         → TDX 1.0은 취약, TDX 1.5는 주소-결속 MAC으로 일부 방어

// 테스트
// Linux host에서 /proc/cpuinfo | grep tdx_host_platform
// BIOS: Intel TME-MT Enable, TDX Enable`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Private vs Shared — TD 메모리 모델</h3>

        <SeptViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TD Guest Physical Address(GPA) 레이아웃
// [GPAW-1]  [GPAW-2 .. 0]
//  Shared    실제 GPA
//   bit

// GPAW = 48 또는 52 (TD 생성 시 TD_PARAMS.GPAW로 결정)

// Private GPA: Shared bit = 0
// - S-EPT(Secure EPT)로 매핑
// - TD 전용 키(KeyID=TD)로 암호화
// - Host는 접근 불가

// Shared GPA: Shared bit = 1
// - 일반 EPT로 매핑 (VMM 관리)
// - KeyID=0 (Host 공유 키)
// - Host와 통신용 (virtio 버퍼, DMA 등)

// TD 내부 포인터는 Shared bit 포함한 GPA 사용
void *shared_buf = (void *)(0x8000_0000_0000 | 0x1000);  // Shared
void *priv_buf   = (void *)(0x0000_0000_1000);            // Private`}</pre>
        <p>
          <strong>Shared bit</strong>: GPA 최상위 비트로 영역 구분<br />
          TD가 명시적으로 Shared로 매핑 → Host와 공유 가능<br />
          Private 메모리는 Host가 들여다봐도 암호문만 보임
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Secure EPT (S-EPT) — TD Module 관리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// S-EPT 구조 (SDM 33.3)
// - 일반 EPT와 같은 4-레벨 페이지 테이블
// - 물리 페이지는 Private 키로 암호화
// - TD Module만 수정 가능 (SEAMCALL로)

// Host(KVM-TDX)가 페이지 매핑하려면
tdh_mem_sept_add(tdr_pa, gpa, level);
  → TDH.MEM.SEPT.ADD
  → S-EPT 중간 레벨 추가

tdh_mem_page_aug(tdr_pa, gpa, hpa);
  → TDH.MEM.PAGE.AUG
  → 실제 페이지 바인딩 (런타임 추가, pending 상태)

// TD가 페이지 사용하려면 수락 필수
// Guest 쪽:
tdg_mem_page_accept(gpa);
  → TDG.MEM.PAGE.ACCEPT
  → pending → present 전환
  → 페이지 zero 초기화 확인

// 왜 accept 필요?
// → Host가 몰래 페이지 교체/재매핑 방지
// → TD가 명시적으로 "이 GPA를 새로 받겠다"고 승인`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PAMT — Physical Address Metadata Table</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PAMT: 각 물리 페이지의 상태 추적 (TD Module 소유)
//
// 페이지별 상태
// - FREE          : 미할당
// - NDA           : Non-TDX Domain (일반 Host 페이지)
// - TD_PAGE       : TD Private 페이지
// - TD_TDR/TDCS   : TD 관리 구조체
// - TD_EPT        : S-EPT 페이지
// - TD_TDVPS      : vCPU 상태

// 페이지 회수 (TD 종료 시)
tdh_phymem_page_reclaim(hpa);
  → TDH.PHYMEM.PAGE.RECLAIM
  → WBINVD 후 PAMT 초기화
  → NDA로 전환 → Host가 재사용 가능

// 중요: PAMT 업데이트는 원자적
// Host가 동일 페이지 동시 사용 시도 시 실패 반환
// → 상태 전이 그래프 강제

// 크기
// 4KB 페이지당 PAMT 엔트리 ~16B
// 1TB 메모리 → PAMT 4GB (BIOS가 예약)`}</pre>
        <p>
          <strong>PAMT</strong>: 페이지 상태 머신 — 혼동 방지 핵심<br />
          Host가 TD 페이지를 무단 재매핑 못함 — PAMT 상태 검사<br />
          모든 SEAMCALL이 PAMT 엔트리 원자적 갱신
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TDX 1.0 vs TDX 1.5</p>
          <p>
            <strong>TDX 1.0 (Sapphire Rapids 4th Gen Xeon)</strong>:<br />
            - 암호화만 (AES-XTS)<br />
            - 무결성 MAC 없음<br />
            - Replay 공격 취약
          </p>
          <p className="mt-2">
            <strong>TDX 1.5 (Emerald Rapids, Granite Rapids)</strong>:<br />
            - Cryptographic Integrity (28-bit MAC)<br />
            - TD Partitioning (L1 TD 안에 L2 TD)<br />
            - Live Migration 기본 지원<br />
            - Service TD 개념 (TDX Quote Enclave 등)
          </p>
          <p className="mt-2">
            <strong>실전 고려</strong>:<br />
            - 클라우드는 대부분 TDX 1.5 이상 도입 (Azure Confidential VMs)<br />
            - 무결성 미지원 시스템에선 민감 데이터 저장 주의<br />
            - TD 증명 시 TCB 버전으로 TDX 1.0/1.5 구분 가능
          </p>
        </div>

      </div>
    </section>
  );
}
