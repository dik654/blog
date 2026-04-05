import TdLifecycleViz from './viz/TdLifecycleViz';
import EnterExitViz from './viz/EnterExitViz';

export default function LifecycleAbi() {
  return (
    <section id="lifecycle-abi" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TD 라이프사이클 &amp; SEAMCALL/TDCALL</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TD 생성 시퀀스 (호스트 관점)</h3>

        <TdLifecycleViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// KVM-TDX가 TD 생성하는 흐름 (arch/x86/kvm/vmx/tdx.c)

// Step 1: TDR 페이지 할당 & TD 생성
page = alloc_page(GFP_KERNEL);
ret = tdh_mng_create(tdr_pa, hkid);
  → TDH.MNG.CREATE
  → TDR(TD Root) 구조체 초기화
  → hkid(Host Key ID) 할당

// Step 2: TDCS 페이지 추가 & 키 설정
for_each_tdcs_page { tdh_mng_addcx(tdr_pa, tdcs_pa); }
tdh_mng_key_config(tdr_pa);
  → TDH.MNG.KEYCONFIG
  → MKTME 키 생성 & 활성화

// Step 3: vCPU 생성
tdh_vp_create(tdvpr_pa, tdr_pa);
  → TDH.VP.CREATE
tdh_vp_addcx(tdvpr_pa, tdvps_pa);
  → 추가 페이지 바인딩

// Step 4: TD 초기화
tdh_mng_init(tdr_pa, td_params);
  → TDH.MNG.INIT
  → TD_PARAMS 입력 (ATTRIBUTES, XFAM, RTMR 초기화)

// Step 5: 초기 메모리 페이지 추가 (측정 대상)
for each page in TD initial image {
    tdh_mem_page_add(tdr_pa, gpa, hpa);  → TDH.MEM.PAGE.ADD
    tdh_mr_extend(tdr_pa, gpa);           → TDH.MR.EXTEND (MRTD 갱신)
}

// Step 6: TD 최종화 (측정값 확정)
tdh_mr_finalize(tdr_pa);
  → TDH.MR.FINALIZE
  → MRTD 확정 → 이후 변경 불가

// Step 7: vCPU 진입
tdh_vp_enter(tdvpr_pa);
  → TDH.VP.ENTER
  → TD 실행 시작`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TD 실행 흐름 — TDENTER / TDEXIT</h3>

        <EnterExitViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TD 진입 (Host → TD)
// Host는 TDH.VP.ENTER(tdvpr_pa) 호출
//   └─> SEAM이 TD 레지스터 복원
//   └─> SEAM이 TD로 resume
//   └─> TD 코드 실행 시작

// TD 탈출 경로 3가지

Case 1: 비동기 Exit (외부 인터럽트)
  - Timer 인터럽트, NIC 인터럽트 등
  - TD Module이 레지스터 저장
  - SEAM → Host 전달 (exit reason = INTR)

Case 2: EPT Violation
  - TD가 매핑 안 된 페이지 접근
  - Host가 페이지 할당 필요
  - exit reason = EPT_VIOLATION

Case 3: TDVMCALL (의도적 호출)
  - TD가 Host 서비스 요청 (I/O, MSR, CPUID 등)
  - exit reason = TDG_VP_VMCALL

// 핵심: 어떤 exit이든 TD Module이 중재
// Host는 절대 TD 내부 레지스터 직접 못 봄`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 TDG (Guest-side) 함수</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">함수</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
                <th className="border border-border px-3 py-2 text-left">반환값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.VP.INFO</code></td>
                <td className="border border-border px-3 py-2">TD 속성 조회 (GPAW, NUM_VCPUS)</td>
                <td className="border border-border px-3 py-2">td_info</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MEM.PAGE.ACCEPT</code></td>
                <td className="border border-border px-3 py-2">Pending 페이지 활성화</td>
                <td className="border border-border px-3 py-2">completion</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MEM.PAGE.ATTR.RD/WR</code></td>
                <td className="border border-border px-3 py-2">페이지 속성 읽기/쓰기</td>
                <td className="border border-border px-3 py-2">attributes</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MR.REPORT</code></td>
                <td className="border border-border px-3 py-2">TDREPORT 생성 (로컬 증명)</td>
                <td className="border border-border px-3 py-2">TDREPORT_STRUCT</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.MR.RTMR.EXTEND</code></td>
                <td className="border border-border px-3 py-2">RTMR 확장 (동적 측정)</td>
                <td className="border border-border px-3 py-2">success</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.VP.VMCALL</code></td>
                <td className="border border-border px-3 py-2">Host 서비스 요청 (다음 섹션)</td>
                <td className="border border-border px-3 py-2">varies</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TDG.VP.CPUIDVE.SET</code></td>
                <td className="border border-border px-3 py-2">CPUID 가상화 모드 설정</td>
                <td className="border border-border px-3 py-2">success</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Linux Guest의 TDCALL 사용 예</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// arch/x86/coco/tdx/tdx.c

static u64 __cpuidle __halt(const bool irq_disabled)
{
    struct tdx_module_args args = {
        .r10 = TDX_HYPERCALL_STANDARD,
        .r11 = hcall_func(EXIT_REASON_HLT),
        .r12 = irq_disabled,
    };

    /* Hypercall: guest → host via TDVMCALL */
    return __tdx_hypercall(&args);
}

// Page acceptance during boot
void tdx_accept_memory(phys_addr_t start, phys_addr_t end)
{
    for (addr = start; addr < end; addr += PAGE_SIZE) {
        struct tdx_module_args args = {
            .rcx = addr,
        };
        ret = __tdcall(TDG_MEM_PAGE_ACCEPT, &args);
        if (ret) { /* fatal */ }
    }
}

// TDREPORT 생성 (증명용)
int tdx_mcall_get_report0(u8 *reportdata, u8 *tdreport)
{
    struct tdx_module_args args = {
        .rcx = virt_to_phys(tdreport),
        .rdx = virt_to_phys(reportdata),
        .r8  = TDREPORT_SUBTYPE_0,
    };
    return __tdcall(TDG_MR_REPORT, &args);
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TD 종료 시퀀스</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Host가 TD 종료할 때

1. TDH.VP.FLUSH      // 각 vCPU 캐시 flush
2. TDH.MNG.VPFLUSHDONE  // 플러시 확인
3. TDH.PHYMEM.PAGE.WBINVD  // 물리 메모리 쓰기 플러시
4. TDH.MNG.KEY.FREEID  // 키 해제 (MKTME 슬롯 반환)
5. TDH.PHYMEM.PAGE.RECLAIM  // 페이지 회수 (초기화됨)
6. TDH.MNG.KEYCONFIG  // 새 TD용 키 재할당 가능

// 주의사항
- KEY.FREEID 전에 반드시 모든 페이지 WBINVD
- 캐시에 남은 평문이 다른 TD로 유출 방지
- 이 과정 생략 시 SEAMCALL이 ENTROPY_FAIL 반환`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MRTD vs RTMR</p>
          <p>
            <strong>MRTD (Measurement Register for TD)</strong>:<br />
            - TD 생성 시 초기 이미지 해시 (TDH.MR.FINALIZE로 확정)<br />
            - 불변 — TD 수명 내내 고정<br />
            - SGX의 MRENCLAVE에 대응
          </p>
          <p className="mt-2">
            <strong>RTMR[0..3] (Runtime Measurement Register)</strong>:<br />
            - 런타임에 확장 가능 (TDG.MR.RTMR.EXTEND)<br />
            - SHA-384 해시 체인<br />
            - TPM PCR과 유사한 개념<br />
            - 용도: 부트로더→커널→initrd 체인 측정, 동적 로드 코드 기록
          </p>
          <p className="mt-2">
            <strong>사용 예</strong>:<br />
            - RTMR[0]: UEFI 측정<br />
            - RTMR[1]: 부트로더 측정<br />
            - RTMR[2]: 커널 측정<br />
            - RTMR[3]: 사용자 정의 (앱 레벨)
          </p>
        </div>

      </div>
    </section>
  );
}
