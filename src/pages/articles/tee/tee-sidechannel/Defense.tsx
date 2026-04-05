export default function Defense() {
  return (
    <section id="defense" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">방어 기법 — Constant-time, ORAM, Partitioning</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">방어 계층 전략</h3>
        <p>
          <strong>Defense in depth</strong>: 하드웨어 + 컴파일러 + 앱 모두에서 대응<br />
          단일 계층만으로는 불충분 — 공격자는 약한 고리 찾음<br />
          <strong>성능 비용 인식</strong>: 완전한 방어는 수십% 오버헤드 감수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Constant-time 프로그래밍</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 원칙: 모든 비밀 의존 연산이 시크릿 값과 무관한 시간·메모리 접근 패턴 가져야 함

// 취약한 비교 (early exit)
bool memcmp_insecure(const uint8_t *a, const uint8_t *b, size_t len) {
    for (size_t i = 0; i < len; i++) {
        if (a[i] != b[i]) return false;  // ← 조기 종료 → timing leak
    }
    return true;
}

// Constant-time 비교
bool memcmp_ct(const uint8_t *a, const uint8_t *b, size_t len) {
    uint8_t diff = 0;
    for (size_t i = 0; i < len; i++) {
        diff |= a[i] ^ b[i];  // 전체 바이트 검사
    }
    return diff == 0;
}

// Constant-time conditional select
// if (cond) dst = a; else dst = b;
uint32_t ct_select(uint32_t cond, uint32_t a, uint32_t b) {
    uint32_t mask = -cond;      // 0 or 0xFFFFFFFF
    return (a & mask) | (b & ~mask);
}

// Constant-time array access (vs table lookup)
uint8_t ct_table_lookup(uint8_t *table, size_t size, size_t index) {
    uint8_t result = 0;
    for (size_t i = 0; i < size; i++) {
        uint8_t match = ct_eq(i, index);  // 0 or 1
        result |= table[i] & -match;
    }
    return result;
}
// ↑ 모든 table 엔트리 접근 → cache pattern independent`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Constant-time 라이브러리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 검증된 constant-time 구현

// 1) libsodium — NaCl 기반, high-level crypto
#include <sodium.h>
sodium_memcmp(a, b, len);          // CT comparison
crypto_box_easy(cipher, msg, ...); // CT authenticated encryption

// 2) BearSSL — 임베디드 친화, fully constant-time
br_ssl_engine_*();

// 3) Intel IPP Cryptography (CT branches)
ippsAESEncrypt_CBC(...);

// 4) BoringSSL (Google) — 선별적 CT
// 5) OpenSSL (recent versions) — CT 개선 중

// 검증 도구
// - ctverif (Almeida et al.) - LLVM 기반 분석
// - Flow-tracker - dynamic taint
// - TIS-Interpreter - symbolic execution
// - Valgrind ctgrind — memory access pattern 검사

// 컴파일러 flag (GCC/Clang)
// - -fno-jump-tables: switch를 CT로
// - -fstack-protector-strong
// - 특별 __attribute__((no_optimize)) 필요`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ORAM (Oblivious RAM)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 메모리 접근 패턴 자체를 숨김
// access sequence → uniform random 분포로 변환

// Path ORAM (Stefanov et al. 2013)
// - binary tree + stash
// - 각 access = tree path 전체 read/write
// - O(log²N) overhead per access

struct PathORAM {
    Node tree[2N - 1];   // binary tree
    Block stash[];       // temporary storage
    uint64_t position_map[N];  // block → path mapping
};

int oram_read(PathORAM *o, uint64_t block_id) {
    // 1) 대상 block의 현재 path 조회
    uint64_t path = o->position_map[block_id];

    // 2) path 전체 읽기 (O(log N) blocks)
    Block path_blocks[L];
    for (int level = 0; level < L; level++) {
        path_blocks[level] = read_node(o->tree, path, level);
    }

    // 3) 타겟 블록 찾기 & stash로 이동
    Block *target = find_in_path(path_blocks, block_id);
    move_to_stash(target, o->stash);

    // 4) 새 랜덤 path 할당
    o->position_map[block_id] = random_path();

    // 5) 가능한 stash 블록을 path에 다시 채움
    rebuild_path(o->tree, path, o->stash);

    return target->data;
}

// 성능 비용
// - 실제 데이터 접근 1개당 O(log N) I/O
// - 1GB 데이터셋 → log2(2^24) = 24x slowdown
// - 민감 워크로드만 제한적 사용 권장

// 변형
// - Ring ORAM: bandwidth 최적화
// - ZeroTrace: SGX + ORAM 통합`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Oblivious Algorithms</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 특정 문제를 oblivious하게 푸는 알고리즘

// Oblivious sorting (Batcher's bitonic sort)
// - 비교·교환 패턴이 입력과 무관
// - O(n log²n) comparisons
void bitonic_sort(int *arr, int n, bool up) {
    if (n <= 1) return;
    int k = n / 2;
    bitonic_sort(arr, k, true);
    bitonic_sort(arr + k, k, false);
    bitonic_merge(arr, n, up);
}

// Oblivious selection (linear scan)
// max 찾기 대신 전체 스캔 + constant-time max
int ct_max(int *arr, size_t n) {
    int result = INT_MIN;
    for (size_t i = 0; i < n; i++) {
        int cond = arr[i] > result;
        result = ct_select(cond, arr[i], result);
    }
    return result;
}

// Oblivious data structure
// - 메모리 접근 패턴이 입력과 무관
// - ObliDS (Oblivious Data Structures)
// - PathOSM — oblivious set membership

// 실전 사용 사례
// - Private Information Retrieval
// - Oblivious Database (opaque)
// - Private set intersection`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 파티셔닝 (Cache Allocation)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Intel CAT (Cache Allocation Technology)

// LLC를 way 단위로 파티셔닝
// 예: 20-way LLC에서
//   COS 0: way 0~7  (8 ways)
//   COS 1: way 8~15 (8 ways)
//   COS 2: way 16~19 (4 ways, reserve)

// MSR 설정 (root 필요)
wrmsr(IA32_L3_MASK_0, 0x00FF);   // COS 0: ways 0-7
wrmsr(IA32_L3_MASK_1, 0xFF00);   // COS 1: ways 8-15

// 프로세스를 COS에 할당
wrmsr(IA32_PQR_ASSOC, (1 << 32));  // 현재 프로세스 → COS 1

// TEE 프로세스 격리
// - 공격자 VM: COS 0
// - 보호 대상 VM: COS 1
// - LLC 공유 없음 → Prime+Probe 불가

// 한계
// - SMT 코어 내부는 여전히 공유
// - L1/L2는 파티션 안 됨 (core-private 아님)
// - Intel only (Xeon), Ryzen은 부분 지원`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Noise Injection</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 공격자 관측에 노이즈 추가

// Dummy operations
void secure_function(secret key) {
    real_operation(key);

    // 랜덤 dummy 작업
    for (int i = 0; i < random_delay(); i++) {
        asm volatile("nop");
    }

    // 랜덤 메모리 접근
    dummy_accesses(random_pattern());
}

// Timing randomization
// - TSX에 random delay 삽입
// - Cache pre-warming

// Limitations
// - 통계적 공격은 여전히 가능
// - 성능 오버헤드
// - 완전 방어 아닌 raising the bar

// 실전 활용
// - Tor relay: timing 난독화
// - SGX quote: random delays
// - Payment cards: random SPA/DPA 대응`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 방어 기법 비교 — 비용 vs 효과</p>
          <p>
            <strong>Constant-time</strong>:<br />
            ✓ 저오버헤드 (보통 2-5%)<br />
            ✓ 타이밍·캐시 공격 대부분 차단<br />
            ✗ 개발자 훈련 필요, 검증 어려움
          </p>
          <p className="mt-2">
            <strong>ORAM</strong>:<br />
            ✓ 가장 강력한 방어<br />
            ✗ O(log²N) 오버헤드 — 일반 앱 비현실적<br />
            ✗ 특정 use case만 (key store, 검색)
          </p>
          <p className="mt-2">
            <strong>Cache partitioning</strong>:<br />
            ✓ 하드웨어 지원, 투명<br />
            ✗ SMT 공격 방어 못 함<br />
            ✗ Intel 전용, way 수 제한
          </p>
          <p className="mt-2">
            <strong>실무 추천</strong>:<br />
            1. Constant-time 기본 (모든 crypto 코드)<br />
            2. SMT 비활성화 (confidential 워크로드)<br />
            3. Cache partitioning (multi-tenant)<br />
            4. ORAM은 high-value secrets만
          </p>
        </div>

      </div>
    </section>
  );
}
