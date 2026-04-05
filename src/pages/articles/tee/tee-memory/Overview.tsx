import MemoryEncryptViz from './viz/MemoryEncryptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 메모리 암호화가 필요한가</h2>
      <div className="not-prose mb-8"><MemoryEncryptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서버의 DRAM은 물리적으로 노출되어 있습니다.
          <br />
          세 가지 위협이 메모리 암호화를 필수로 만듭니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">위협 모델</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">DMA 공격</h4>
            <p className="text-sm text-muted-foreground">
              PCIe 장치(GPU, NIC)가 물리 메모리를 직접 읽습니다.<br />
              IOMMU 우회 시 전체 메모리 노출.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">콜드부트 공격</h4>
            <p className="text-sm text-muted-foreground">
              전원 차단 후 DRAM 잔류 데이터를 추출합니다.<br />
              액체 질소로 수 분간 데이터 유지 가능.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">악의적 하이퍼바이저</h4>
            <p className="text-sm text-muted-foreground">
              클라우드 관리자가 VM 메모리를 덤프합니다.<br />
              호스트 커널 권한으로 모든 게스트 메모리 접근 가능.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">핵심 원리</h3>
        <p>
          <strong>CPU 캐시 = 평문, DRAM = 암호문.</strong>
          <br />
          메모리 컨트롤러에 내장된 AES 엔진이 캐시 라인 퇴거 시 암호화, 적재 시 복호화합니다.
          <br />
          CPU 다이 바깥으로 나가는 데이터는 항상 암호화 상태입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">암호화 방식 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 주요 TEE 메모리 암호화 방식
//
// ┌──────────┬───────────┬──────────────┬────────────┐
// │  방식    │  플랫폼   │  알고리즘    │  키 범위   │
// ├──────────┼───────────┼──────────────┼────────────┤
// │ SGX EPC  │ Intel     │ AES-CTR+MAC  │ 플랫폼-1개 │
// │ SEV SME  │ AMD       │ AES-128-XEX  │ 페이지-1개 │
// │ SEV VM   │ AMD       │ AES-128-XEX  │ VM-1개     │
// │ SEV-SNP  │ AMD       │ AES-128-XEX+RMP│ VM-1개   │
// │ TDX      │ Intel     │ AES-XTS-256  │ TD-1개     │
// │ ARM CCA  │ ARM       │ QARMA/AES    │ Realm-1개  │
// └──────────┴───────────┴──────────────┴────────────┘
//
// 주요 특성:
//
// 1. Tweak-based encryption (XEX/XTS)
//    - 주소가 tweak → 같은 값도 주소마다 다름
//    - 패턴 분석 방지
//    - Intel/AMD 표준
//
// 2. Per-VM keys
//    - VM 간 완전한 격리
//    - 측면 공격 대비
//    - 핵심 혁신 (2017+)
//
// 3. Integrity (MAC)
//    - SGX: MAC tag per line
//    - SEV-SNP: RMP (Reverse Map Table)
//    - TDX: built-in integrity
//    - 변조 감지 필수

// 물리적 공격 대응:
//   - DMA: IOMMU + SEV-SNP RMP
//   - Cold Boot: 전원 cut 시 key 삭제
//   - Bus probing: 모든 data encrypted
//   - Chip attack: Secure processor 격리`}
        </pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">성능 오버헤드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Memory Encryption Performance Cost
//
// Latency overhead:
//   - Cache hit: 0% (cache에 평문)
//   - Cache miss: 10~30% (DRAM access)
//   - Write-back: ~20% (encryption)
//
// Typical benchmarks (SGX 2018):
//   - SPEC2006: 5~20% 오버헤드
//   - DRAM bandwidth: ~70% maintained
//   - Enclave entry/exit: ~8,000 cycles
//
// Modern TDX/SEV-SNP (2023):
//   - 최적화된 AES-NI 사용
//   - 일반 워크로드: 2~10% 오버헤드
//   - DB: 5~15% 오버헤드
//   - ML inference: 10~25%
//
// EPC 크기 제약:
//   SGX v1: 128~256 MB
//   SGX v2 (Scalable): 최대 1TB
//   SEV: VM 전체 (no 제한)
//   TDX: TD 전체 (no 제한)
//
//   작은 EPC → EPC paging → 성능 저하
//   SGX2/TDX가 이 제약 제거`}
        </pre>
      </div>
    </section>
  );
}
