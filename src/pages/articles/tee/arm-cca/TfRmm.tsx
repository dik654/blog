import TfRmmViz from './viz/TfRmmViz';

export default function TfRmm() {
  return (
    <section id="tf-rmm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TF-RMM — Arm 레퍼런스 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TF-RMM 구조</h3>

        <TfRmmViz />

        <p>
          <strong>TF-RMM</strong>: Arm이 유지하는 RMM 레퍼런스 구현 (BSD-3)<br />
          C로 작성 — 아키텍처 독립 레이어 + plat/ 하위 플랫폼 코드<br />
          QEMU + FVP 에뮬레이터에서 개발·테스트 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RMI Dispatcher</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime/core/handler.c

unsigned long handle_ns_smc(unsigned long function_id,
                             unsigned long arg0, unsigned long arg1,
                             unsigned long arg2, unsigned long arg3, ...)
{
    struct smc_result res = {0};

    switch (function_id) {
    case SMC_RMI_VERSION:
        res.x[0] = RMI_SUCCESS;
        res.x[1] = RMI_ABI_VERSION;
        break;

    case SMC_RMI_GRANULE_DELEGATE:
        res.x[0] = smc_granule_delegate(arg0);
        break;

    case SMC_RMI_REALM_CREATE:
        res.x[0] = smc_realm_create(arg0, arg1);
        break;

    case SMC_RMI_DATA_CREATE:
        smc_data_create(arg0, arg1, arg2, arg3, &res);
        break;

    case SMC_RMI_REC_ENTER:
        smc_rec_enter(arg0, arg1, &res);
        break;

    /* ... 40개 이상 */

    default:
        res.x[0] = RMI_ERROR_NOT_SUPPORTED;
    }

    return res;  /* Host로 반환 */
}`}</pre>
        <p>
          대형 switch 기반 dispatcher — 각 RMI 호출은 별도 함수<br />
          인자 검증·권한 검사·granule lock은 개별 핸들러에서 수행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Granule Locking — Deadlock 방지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime/core/granule.c

// 각 granule마다 상태 + lock 보유
struct granule {
    unsigned long descriptor;  // state + refcount
    /* 잠금은 descriptor.lock_bit으로 관리 */
};

// Lock 순서 규칙 (ordering)
// RD → REC → RTT → DATA
//   → 순서 역전 시 panic
//   → deadlock 방지

// 예: DATA_CREATE
int smc_data_create(u64 data_pa, u64 rd_pa, u64 ipa, u64 src_pa) {
    /* 1) RD 먼저 lock */
    g_rd = find_lock_granule(rd_pa, GRANULE_STATE_RD);
    if (!g_rd) return RMI_ERROR_INPUT;

    /* 2) DATA granule lock */
    g_data = find_lock_unused_granule(data_pa, GRANULE_STATE_DELEGATED);
    if (!g_data) { unlock(g_rd); return RMI_ERROR_INPUT; }

    /* 3) RTT walk (leaf까지 lock) */
    rtt_walk_lock(rd, ipa, ...);

    /* 4) 작업 수행 */
    copy_page_from_ns(data_pa, src_pa);
    measurement_extend_data(rd, data_pa, ipa, flags);
    rtt_fold_leaf(...);

    /* 5) 역순 unlock */
    rtt_walk_unlock();
    granule_unlock_transition(g_data, GRANULE_STATE_DATA);
    granule_unlock(g_rd);
    return RMI_SUCCESS;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">REC (Realm Execution Context)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime/core/rec.c

struct rec {
    struct rec_sysregs sys_regs;   // EL1 시스템 레지스터
    unsigned long regs[31];        // GPR
    unsigned long pc;
    unsigned long pstate;

    /* FP/SIMD */
    struct simd_context simd;

    /* 상태 */
    unsigned long runnable;
    struct rd *realm;

    /* Exception 처리 */
    unsigned long last_run_info;
    struct rmi_rec_exit exit;
};

// REC 진입 흐름
int smc_rec_enter(u64 rec_pa, u64 rec_entry_pa, struct smc_result *res) {
    /* 1) Host → RMM REC_ENTER */
    /* 2) Rec 복원 (레지스터 + sysregs) */
    restore_ns_state_to_rmm();

    /* 3) ERET to EL1(Realm) */
    asm volatile("eret");

    /* 4) Realm 실행... */
    /* 5) exit 시 여기로 복귀 */

    /* 6) exit reason 전달 */
    res->x[0] = RMI_SUCCESS;
    res->x[1] = exit_reason;
    return ret;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">빌드 & 실행 (FVP)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# github.com/TF-RMM/tf-rmm

# 의존성
apt install gcc-aarch64-linux-gnu cmake ninja-build python3

# 빌드
cmake -DRMM_CONFIG=fvp_defcfg -S . -B build
cmake --build build

# 산출물
# build/Debug/rmm.elf    — EL2 Realm 이미지
# build/Debug/rmm.bin    — raw binary
# build/Debug/rmm.dump   — 심볼 덤프

# FVP(Fast Models) 실행
fvp-rme.sh \\
  --bl31=tf-a/bl31.bin \\         # TF-A (EL3 Monitor)
  --bl32=rmm.bin \\                # RMM (EL2 Realm)
  --bl33=uboot.bin \\              # Host bootloader
  --image=host-linux.bin \\        # Host kernel
  --realm=realm-linux.bin         # Realm Guest kernel

# 디버그 로그
# RMM은 UART에 로그 출력
# CONFIG_DEBUG=ON 빌드 시 verbose`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">RMM과 TF-A 역할 분담</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">컴포넌트</th>
                <th className="border border-border px-3 py-2 text-left">권한</th>
                <th className="border border-border px-3 py-2 text-left">책임</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>TF-A BL31</code></td>
                <td className="border border-border px-3 py-2">EL3 (Monitor)</td>
                <td className="border border-border px-3 py-2">GPT 갱신, World 전환, PSCI</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TF-RMM</code></td>
                <td className="border border-border px-3 py-2">EL2 (Realm)</td>
                <td className="border border-border px-3 py-2">RMI/RSI, Realm 라이프사이클</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Hafnium/SPM</code></td>
                <td className="border border-border px-3 py-2">EL2 (Secure)</td>
                <td className="border border-border px-3 py-2">Secure partition 관리 (옵션)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TF-RMM의 설계 철학</p>
          <p>
            <strong>1. Formal Verification 지향</strong><br />
            - 핵심 상태 머신을 모델체킹 가능한 형태로 작성<br />
            - CBMC로 granule transition 검증<br />
            - 장기 목표: 주요 RMI 호출 증명
          </p>
          <p className="mt-2">
            <strong>2. 최소 TCB</strong><br />
            - libc 의존성 없음 — 자체 stdlib<br />
            - 동적 할당 금지 — 정적 풀만 사용<br />
            - 이진 크기 ~200KB (debug 빌드)
          </p>
          <p className="mt-2">
            <strong>3. 플랫폼 독립</strong><br />
            - plat/ 디렉토리 분리 — FVP, Arm CCA, QEMU<br />
            - SiP-specific 기능은 vendor별 구현<br />
            - 커뮤니티가 레퍼런스 유지
          </p>
        </div>

      </div>
    </section>
  );
}
