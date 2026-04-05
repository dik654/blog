import RealmLifecycleViz from './viz/RealmLifecycleViz';

export default function RealmLifecycle() {
  return (
    <section id="realm-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Realm 생성 &amp; 생명주기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Realm 상태 머신</h3>

        <RealmLifecycleViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RMM이 관리하는 Realm 상태
enum realm_state {
    REALM_NEW,       // 생성 직후
    REALM_ACTIVE,    // ACTIVATE 호출됨 → 실행 가능
    REALM_SYSTEM_OFF // 종료됨
};

// 전이
// NEW → ACTIVE  : RMI_REALM_ACTIVATE
// ACTIVE → OFF  : Realm이 PSCI_SYSTEM_OFF 호출 또는 Host가 DESTROY
// NEW → DELETED : RMI_REALM_DESTROY (미활성화 상태에서)

// NEW 상태에서만 가능한 작업
// - DATA_CREATE (초기 메모리 페이지 추가)
// - RTT_CREATE (Stage 2 테이블 확장)
// - REC_CREATE (vCPU 추가)
//
// ACTIVE 이후엔 초기 상태 변경 금지
// → 측정값(RIM) 불변 보장`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Realm Descriptor (RD) 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TF-RMM: runtime/core/realm.c

struct rd {
    unsigned long state;        // NEW, ACTIVE, SYS_OFF
    struct granule *g_rtt;      // Stage 2 root
    unsigned long rtt_base;
    unsigned long ipa_bits;     // IPA 공간 크기 (예: 40)
    unsigned long s2_starting_level;

    /* Measurement */
    unsigned char rim[64];      // Realm Initial Measurement (SHA-512)
    unsigned char rem[4][64];   // Runtime Extendable Measurements

    /* Realm parameters */
    unsigned long algorithm;    // SHA-256 또는 SHA-512
    unsigned long hash_algo;
    unsigned long feat_flag0;

    /* vCPU 관리 */
    unsigned long rec_count;
    unsigned long num_aux;

    /* Lock */
    spinlock_t lock;
};

// RD는 Realm 페이지 (Realm PAS)
// Host가 직접 읽기 불가
// RMM만 SMC로 조작`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">RIM 계산 — 초기 측정값</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RIM(Realm Initial Measurement): Realm 정체성
// SHA-512 해시 체인으로 누적

void rim_extend(struct rd *rd, void *data, size_t len) {
    uint8_t buffer[64 + SHA512_BLOCK_SIZE];
    memcpy(buffer, rd->rim, 64);
    memcpy(buffer + 64, data, len);
    sha512(buffer, 64 + len, rd->rim);
}

// RIM에 포함되는 것
// 1) REALM_CREATE 파라미터
rim_extend(rd, &create_params, sizeof(create_params));
//    → s2sz, algorithm, feat_flag 등

// 2) 각 DATA_CREATE 호출
void data_create(struct rd *rd, unsigned long ipa, void *src) {
    /* 페이지 복사 */
    memcpy(realm_page, src, PAGE_SIZE);

    /* 측정 데이터 구성 */
    struct measure {
        uint8_t  descriptor[0x100];  // "DATA" + ipa + flags
        uint8_t  content[PAGE_SIZE]; // 실제 데이터
    } m;
    rim_extend(rd, &m, sizeof(m));
}

// 3) 각 REC_CREATE 호출
rim_extend(rd, &rec_params, sizeof(rec_params));
//    → vCPU 초기 레지스터

// 4) ACTIVATE 호출 시 RIM 확정 (이후 변경 불가)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">REM — Runtime Extendable Measurements</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// REM[0..3]: 런타임에 Realm이 확장 가능
// TPM PCR과 유사, Intel TDX의 RTMR과 대응

// RSI(Realm Services Interface)로 확장
// Realm 내부에서:
asm volatile("hvc #0"
             : "+r"(x0)  /* result */
             : "r"(RSI_MEASUREMENT_EXTEND),
               "r"(index),   /* REM[0..3] */
               "r"(size),
               "r"(data0), "r"(data1), ...);

// RMM이 처리 (runtime/rsi/measurement.c)
void rsi_measurement_extend(struct rd *rd,
                             int index, void *data, size_t size) {
    uint8_t buffer[64 + 64];
    memcpy(buffer, rd->rem[index], 64);
    sha512(data, size, buffer + 64);
    sha512(buffer, 128, rd->rem[index]);
}

// 사용 예
// REM[0]: kernel 측정
// REM[1]: initrd/rootfs
// REM[2]: 동적 코드 (JIT, plugin)
// REM[3]: 앱 정의`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Realm 종료 & 정리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Realm이 종료되는 경로

// 경로 1: Realm 내부에서 power off
// Realm OS가 PSCI_SYSTEM_OFF 호출
//   → RSI를 통해 RMM에 전달
//   → RMM이 realm state = SYSTEM_OFF 설정

// 경로 2: Host가 강제 종료
// Host: RMI_REALM_DESTROY(rd)
//   → RMM이 state 검사
//   → ACTIVE 상태면 거부 (REC를 먼저 destroy)
//   → NEW/SYSTEM_OFF 상태에서만 허용

// Granule 회수 순서
rmi_rec_destroy(rec)   × N   // vCPU 제거
rmi_data_destroy(ipa)  × N   // 메모리 페이지 제거 (zeroize)
rmi_rtt_destroy(rtt)   × N   // Stage 2 테이블 제거
rmi_realm_destroy(rd)        // RD 해제
rmi_granule_undelegate(...)  // Realm PAS → NS PAS (zeroize)

// zeroize 중요
// - Monitor가 PAS 전환 시 자동 zero
// - 이전 Realm 데이터가 Host로 유출 방지
// - cache flush 포함`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">KVM의 Realm 지원 (Host 측)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Linux arch/arm64/kvm/rme.c (CCA 호스트 커널)

int kvm_init_realm_vm(struct kvm *kvm) {
    struct realm *realm = &kvm->arch.realm;

    /* 1) RD granule 할당 & delegate */
    realm->rd = alloc_delegated_granule();

    /* 2) Params 설정 */
    params->s2sz   = VTCR_EL2_IPA_SIZE;
    params->rtt_base = kvm->arch.mmu.pgd_phys;
    params->rtt_num_start = s2_starting_level;

    /* 3) REALM_CREATE */
    rmi_realm_create(virt_to_phys(realm->rd), params);

    realm->state = REALM_STATE_NEW;
    return 0;
}

int kvm_vcpu_enter_realm(struct kvm_vcpu *vcpu) {
    /* Host EL2 레지스터 저장 */
    save_host_state();

    /* RMI_REC_ENTER */
    rmi_rec_enter(rec, entry_args);

    /* Realm이 exit할 때까지 블록 */
    /* exit reason 분석 */
    handle_realm_exit(vcpu);
    return 0;
}`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RIM 측정 vs TDX MRTD</p>
          <p>
            <strong>공통점</strong>:<br />
            - 초기 이미지 해시 → Realm/TD 정체성<br />
            - 활성화 후 불변<br />
            - 원격 증명의 기반
          </p>
          <p className="mt-2">
            <strong>차이점</strong>:<br />
            - TDX: SHA-384, MRCONFIGID 등 3개 추가 레지스터<br />
            - CCA: SHA-256 또는 SHA-512 선택<br />
            - CCA는 호출 순서까지 측정 (replay 방어)
          </p>
          <p className="mt-2">
            <strong>Realm 고유 속성</strong>:<br />
            - Personalization Value(RPV) — 64B 사용자 데이터 포함<br />
            - 같은 이미지라도 RPV 다르면 다른 RIM<br />
            - 사용자별 인스턴스 구분 가능
          </p>
        </div>

      </div>
    </section>
  );
}
