export default function Cache() {
  return (
    <section id="cache" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cache Timing 공격 (Prime+Probe)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">캐시 timing의 원리</h3>
        <p>
          <strong>캐시 hit vs miss</strong>: 수 사이클 vs 200+ 사이클 (메모리 접근)<br />
          <strong>측정 가능</strong>: RDTSCP로 나노초 단위 정확도<br />
          <strong>공격 표면</strong>: LLC(Last Level Cache)가 core 간 공유 → 다른 CPU에서 관측 가능<br />
          <strong>핵심 통찰</strong>: 비밀 데이터에 의존하는 lookup은 캐시 접근 패턴으로 leak
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cache 계층 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 전형적인 Intel/AMD 서버 CPU

// L1 Cache (core-private)
//   - Instruction: 32KB, 8-way
//   - Data: 32KB, 8-way or 48KB 12-way
//   - Latency: 4~5 cycles

// L2 Cache (core-private, some shared)
//   - 512KB ~ 1MB per core
//   - Latency: 12~15 cycles

// LLC / L3 Cache (shared across cores)
//   - 32MB ~ 96MB
//   - Latency: 40~80 cycles
//   - ← 여기가 Prime+Probe 공격의 주 타겟

// Main Memory (DRAM)
//   - Latency: 200~300 cycles

// 공격 distinguish
// hit (L1):  ~5 cycles
// hit (L2):  ~15 cycles
// hit (LLC): ~40 cycles
// miss → DRAM: ~250 cycles

// → 수치 차이로 어느 level까지 캐시됐는지 판별`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Prime+Probe 3단계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Prime+Probe 구현 단계

// === PRIME ===
// 공격자가 특정 LLC cache set 전체를 자신의 데이터로 채움
// LLC associativity(N) 만큼 해당 set에 매핑되는 주소 접근

uint8_t eviction_set[16][LINE_SIZE];  // 16-way LLC 가정
for (int i = 0; i < 16; i++) {
    volatile uint8_t v = eviction_set[i][0];  // load → LLC에 진입
}

// 이제 target cache set은 공격자 데이터로 가득 참

// === WAIT ===
// Victim(TEE enclave)이 실행됨
// 만약 victim이 관심 cache set의 주소를 로드하면
// → 공격자의 eviction_set 한 라인이 축출됨

victim_execution();  // enclave 실행 시간

// === PROBE ===
// 공격자가 다시 eviction_set 접근하며 타이밍 측정
uint64_t times[16];
for (int i = 0; i < 16; i++) {
    times[i] = rdtscp_measure(&eviction_set[i][0]);
}

// 빠른 접근(< 40 cycles) → 아직 캐시에 남아있음
// 느린 접근(> 40 cycles) → victim이 이 라인을 밀어냄

// victim의 메모리 접근 패턴 복원
for (int i = 0; i < 16; i++) {
    if (times[i] > THRESHOLD)
        printf("victim accessed set X at time T\\n");
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Eviction Set 구성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// LLC는 physically-indexed, physically-tagged
// 공격자는 가상 주소만 알아도 eviction set 구성 가능

// LLC address decomposition (예: 32MB, 16-way, 64B line)
// 31    17 16    6 5    0
// ┌──────┬────────┬─────┐
// │ tag  │  set   │ byte│
// └──────┴────────┴─────┘
//          ↑
//        11 bits = 2048 sets

// 같은 set에 매핑되는 주소
// → PA[16:6] 동일
// → VA mod 65536 동일 (4KB page 가정 시 일부)

// Huge page 사용 시 (2MB page)
// → VA와 PA의 하위 21-bit 일치
// → VA만으로 eviction set 구성 가능

// 실전 방법
// 1) huge page 사용 시 쉬움
// 2) 일반 page는 probing으로 찾음 (Liu et al. 2015)
// 3) 같은 cache set 주소 N개 수집 → eviction set 완성`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Flush+Reload (shared memory 공격)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Prime+Probe와 다른 접근
// 공격자와 victim이 같은 메모리 페이지 공유하는 경우

// === FLUSH ===
// 공격자가 대상 address를 캐시에서 축출
_mm_clflush((void *)shared_addr);

// === WAIT ===
// Victim 실행 (몰래 shared_addr 접근하면 캐시에 돌아옴)
victim_execution();

// === RELOAD ===
// 공격자가 address 접근 시간 측정
uint64_t time = rdtscp_measure(shared_addr);
if (time < THRESHOLD) {
    // victim이 shared_addr 접근했음
}

// 장점: Prime+Probe보다 정확 (targeting 1 address)
// 단점: shared memory 필요 (library, system call 경유)

// TEE 공격 시
// - SGX enclave는 동적 링킹 제한
// - 하지만 SEV VM은 zero-page dedup 취약
// - KSM(Kernel Same-page Merging)로 page sharing 가능
// → 클라우드에선 KSM 비활성화 권장`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">AES T-table 공격 예</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// OpenSSL 과거 AES 구현 취약점
// T-table (4KB each, 4개 사용) lookup 기반

// AES round 내부
state[0] = T0[state[0] ^ key[0]]
         ^ T1[state[1] ^ key[1]]
         ^ T2[state[2] ^ key[2]]
         ^ T3[state[3] ^ key[3]];
// ↑ key에 따라 T-table cache line 접근 다름

// 공격
// 1) 공격자가 T-table cache set 관찰
// 2) 특정 평문 암호화 유도
// 3) Flush+Reload로 어떤 line accessed 측정
// 4) 여러 plaintext 반복 → 통계 분석
// 5) key 바이트 복원

// 복잡도: ~10^6 encryptions
// 수 분 내 128-bit AES key 복구

// 현대 대응
// - AES-NI 사용 (하드웨어 명령, table lookup 없음)
// - Bit-sliced AES (constant-time)
// - Table을 cache line 경계에 정렬 안 함`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Cache-Allocation Technology (CAT)</p>
          <p>
            <strong>Intel CAT</strong>: LLC의 각 way를 프로세스에 할당<br />
            - 공격자와 victim이 다른 way 사용하도록<br />
            - 동적 파티셔닝 (MSR로 설정)
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ 하드웨어 지원 → 강력한 격리<br />
            ✓ 성능 영향 예측 가능<br />
            ✓ Noisy neighbor 문제도 완화
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            ✗ SMT로 우회 가능 (같은 core 내부)<br />
            ✗ way 수 제한 (보통 16) → VM 수 제약<br />
            ✗ Intel only (AMD도 유사 기능 준비 중)<br />
            ✗ SGX enclave 레벨 세분화 어려움
          </p>
        </div>

      </div>
    </section>
  );
}
