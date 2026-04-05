import RmiRsiViz from './viz/RmiRsiViz';

export default function RmiRsi() {
  return (
    <section id="rmi-rsi" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RMI &amp; RSI — Realm 호출 규약</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">인터페이스 구조</h3>

        <RmiRsiViz />

        <p>
          RMM은 <strong>두 개의 독립된 ABI</strong>를 노출<br />
          <strong>RMI</strong>: Host → RMM (Realm 관리용)<br />
          <strong>RSI</strong>: Realm → RMM (서비스 요청용)<br />
          분리된 이유: 서로 다른 권한·신뢰 수준 → 별개 경계
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SMC / HVC 명령 차이</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SMC (Secure Monitor Call) — EL3로 트랩
// - Host(Non-secure EL2) → Monitor(EL3)
// - Monitor가 RMM에 delegate
//
// HVC (Hypervisor Call) — EL2로 트랩
// - Realm(EL1) → RMM(EL2 Realm)
// - 직접 RMM 진입

// Host의 RMI 호출 (arch/arm64/kvm/rme-io.c)
static inline int arm_smccc_1_1_invoke(u32 func_id, unsigned long a1, ...) {
    struct arm_smccc_res res;
    arm_smccc_1_1_smc(func_id, a1, a2, a3, a4, a5, a6, a7, &res);
    return res.a0;
}

// 예: Realm 생성
int rmi_realm_create(u64 rd, u64 params_ptr) {
    return arm_smccc_1_1_invoke(SMC_RMI_REALM_CREATE, rd, params_ptr);
}

// Realm Guest의 RSI 호출
static inline void rsi_call(u64 fid, struct arm_smccc_res *res, ...) {
    asm volatile("hvc #0"
                 : "=r"(res->a0), "=r"(res->a1)
                 : "r"(fid), "r"(a1), "r"(a2), ...);
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">RMI 함수 카탈로그</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">함수</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2" rowSpan={2}>Granule</td>
                <td className="border border-border px-3 py-2"><code>RMI_GRANULE_DELEGATE</code></td>
                <td className="border border-border px-3 py-2">NS → Realm PAS</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RMI_GRANULE_UNDELEGATE</code></td>
                <td className="border border-border px-3 py-2">Realm → NS (zeroize)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2" rowSpan={3}>Realm</td>
                <td className="border border-border px-3 py-2"><code>RMI_REALM_CREATE</code></td>
                <td className="border border-border px-3 py-2">RD 초기화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RMI_REALM_ACTIVATE</code></td>
                <td className="border border-border px-3 py-2">RIM 확정, 실행 허용</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RMI_REALM_DESTROY</code></td>
                <td className="border border-border px-3 py-2">Realm 해제</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2" rowSpan={3}>Memory</td>
                <td className="border border-border px-3 py-2"><code>RMI_DATA_CREATE</code></td>
                <td className="border border-border px-3 py-2">초기 페이지 추가 + 측정</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RMI_DATA_CREATE_UNKNOWN</code></td>
                <td className="border border-border px-3 py-2">측정 없는 페이지 (런타임)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RMI_DATA_DESTROY</code></td>
                <td className="border border-border px-3 py-2">페이지 제거</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2" rowSpan={2}>RTT</td>
                <td className="border border-border px-3 py-2"><code>RMI_RTT_CREATE</code></td>
                <td className="border border-border px-3 py-2">Stage 2 중간 테이블 추가</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RMI_RTT_MAP_UNPROTECTED</code></td>
                <td className="border border-border px-3 py-2">Shared IPA 매핑</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2" rowSpan={2}>REC</td>
                <td className="border border-border px-3 py-2"><code>RMI_REC_CREATE</code></td>
                <td className="border border-border px-3 py-2">vCPU 생성</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RMI_REC_ENTER</code></td>
                <td className="border border-border px-3 py-2">vCPU 실행</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">RSI 함수 카탈로그</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">함수</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_VERSION</code></td>
                <td className="border border-border px-3 py-2">RMM 버전 조회</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_REALM_CONFIG</code></td>
                <td className="border border-border px-3 py-2">Realm 속성 조회 (IPA bits 등)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_IPA_STATE_GET</code></td>
                <td className="border border-border px-3 py-2">IPA 상태 조회 (RAM/EMPTY)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_IPA_STATE_SET</code></td>
                <td className="border border-border px-3 py-2">IPA 상태 변경 (RIPAS)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_HOST_CALL</code></td>
                <td className="border border-border px-3 py-2">Host 서비스 요청 (I/O 등)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_ATTESTATION_TOKEN_INIT</code></td>
                <td className="border border-border px-3 py-2">증명 토큰 생성 시작</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_ATTESTATION_TOKEN_CONTINUE</code></td>
                <td className="border border-border px-3 py-2">토큰 chunk 전송 (long token)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_MEASUREMENT_EXTEND</code></td>
                <td className="border border-border px-3 py-2">REM[0..3] 확장</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RSI_MEASUREMENT_READ</code></td>
                <td className="border border-border px-3 py-2">REM/RIM 읽기</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">RIPAS — Realm IPA State</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Realm Guest가 IPA 페이지 상태 관리

enum ripas {
    RIPAS_EMPTY,         // 미할당 (접근 시 fault)
    RIPAS_RAM,           // 실제 메모리 (접근 가능)
    RIPAS_DESTROYED      // 이전 RAM이었으나 제거됨
};

// Guest가 메모리 확장 요청
// arch/arm64/kernel/rsi.c

int set_memory_encrypted(unsigned long addr, int numpages) {
    for (i = 0; i < numpages; i++) {
        ipa = __pa(addr + i * PAGE_SIZE);
        rsi_ipa_state_set(ipa, ipa + PAGE_SIZE, RIPAS_RAM);
    }
    return 0;
}

int set_memory_decrypted(unsigned long addr, int numpages) {
    for (i = 0; i < numpages; i++) {
        ipa = __pa(addr + i * PAGE_SIZE);
        /* Unprotected IPA로 이동 (top bit 설정) */
        unprotected_ipa = ipa | (1UL << (realm_ipa_bits - 1));
        /* 매핑 변경 필요 → HOST_CALL */
    }
    return 0;
}

// Top bit = Unprotected 표시 (Shared)
// Protected IPA: [0 .. 2^(ipa_bits-1))       → Realm private
// Unprotected IPA: [2^(ipa_bits-1) .. 2^ipa_bits) → Host shared
// → Intel TDX의 Shared bit와 대응`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RMI/RSI 분리의 의의</p>
          <p>
            Intel TDX는 <strong>단일 ABI</strong>로 TDH/TDG 구분 (leaf number로)<br />
            ARM CCA는 <strong>물리적으로 분리된 호출 경로</strong> — SMC vs HVC
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ 호출 경로에서 바로 발신자 식별<br />
            ✓ CPU 인스트럭션 권한 검사가 1차 방어<br />
            ✓ Host가 실수로 RSI 호출 불가 (HVC는 EL1에서만)
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ 두 개의 dispatcher 유지 (복잡도)<br />
            {'✗ 호출 오버헤드 차이 (SMC > HVC)'}
          </p>
        </div>

      </div>
    </section>
  );
}
