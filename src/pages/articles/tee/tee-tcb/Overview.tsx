export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB란 무엇인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>TCB(Trusted Computing Base)</strong> — 시스템 보안을 책임지는 <strong>모든 하드웨어와 소프트웨어의 합</strong><br />
          OS 커널, 펌웨어, 하이퍼바이저, 드라이버 등 권한이 있는 모든 코드가 포함됩니다
        </p>
        <p>
          TCB에 포함된 코드의 버그 = <strong>전체 보안 붕괴</strong><br />
          TCB가 1,000만 줄이면 통계적으로 수천 개의 버그가 잠재합니다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">TEE의 핵심 원칙: TCB 최소화</h3>
        <p>
          TEE(Trusted Execution Environment)는 <strong>TCB를 극단적으로 줄여</strong> 공격 표면을 최소화합니다<br />
          OS와 하이퍼바이저를 TCB에서 <strong>제외</strong>하는 것이 핵심 설계 철학입니다
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">구분</th>
                <th className="border border-border px-4 py-2 text-left">일반 시스템</th>
                <th className="border border-border px-4 py-2 text-left">TEE 시스템</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">TCB 크기</td>
                <td className="border border-border px-4 py-2">수천만 줄 (OS 전체)</td>
                <td className="border border-border px-4 py-2">수만 줄 (Enclave 코드만)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">OS 침해 시</td>
                <td className="border border-border px-4 py-2">모든 데이터 노출</td>
                <td className="border border-border px-4 py-2">TEE 내부 데이터 보호</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">검증 가능성</td>
                <td className="border border-border px-4 py-2">사실상 불가능</td>
                <td className="border border-border px-4 py-2">정형 검증 가능 범위</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">TCB 크기 수치 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 시스템의 TCB 규모 (approximate LOC)
//
// ┌────────────────────────┬──────────────┬──────────┐
// │      시스템            │   TCB 크기   │  대상    │
// ├────────────────────────┼──────────────┼──────────┤
// │ Linux kernel (full)    │   30M LOC    │ 전체 OS  │
// │ Windows NT kernel      │   50M LOC    │ 전체 OS  │
// │ KVM hypervisor         │   150K LOC   │ 가상화   │
// │ Xen hypervisor         │   200K LOC   │ 가상화   │
// ├────────────────────────┼──────────────┼──────────┤
// │ Intel SGX TCB          │   ~50K LOC   │ Enclave  │
// │ AMD SEV TCB            │   ~200K LOC  │ VM+fw    │
// │ Intel TDX TCB          │   ~100K LOC  │ TD+SEAM  │
// │ ARM TrustZone TCB      │   ~30K LOC   │ Secure OS│
// │ seL4 microkernel       │   10K LOC    │ 검증됨   │
// │ Minix3                 │   6K LOC     │ micro    │
// └────────────────────────┴──────────────┴──────────┘

// Attack Surface Ratio:
//   Linux: 30,000,000 LOC → 공격 표면 매우 큼
//   SGX:   50,000 LOC → 600배 감소
//   seL4:  10,000 LOC → 3,000배 감소 + 정형 검증

// 버그 확률:
//   Industry average: 1~25 bugs per KLOC
//   30M LOC × 10 bugs/KLOC = 300,000 potential bugs
//   50K LOC × 1 bug/KLOC = 50 potential bugs
//   → 수천 배 검증 가능성 차이

// TEE의 핵심 트레이드오프:
//   SGX (작은 TCB) vs SEV/TDX (큰 TCB)
//   - SGX: 코드 재작성 필요
//   - SEV/TDX: 기존 VM 그대로 (lift & shift)
//   - Better security vs. Better compatibility`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">TCB 최소화 설계 원칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TCB 축소를 위한 설계 원칙
//
// 1. Privilege Separation
//    - 권한 있는 코드와 일반 코드 분리
//    - Enclave에는 minimal 코드만
//    - 대부분 로직은 외부로
//
// 2. Attack Surface Reduction
//    - Enclave 경계 최소화
//    - ECALL/OCALL 인터페이스 제한
//    - 입력 검증 필수
//
// 3. Least Authority Principle
//    - Enclave는 필요한 권한만
//    - Tool/capability 기반 설계
//    - Capability-based security
//
// 4. Defense in Depth
//    - 여러 방어 계층
//    - Hardware + Firmware + SW
//    - 한 층 뚫려도 보호
//
// 5. Formal Verification
//    - seL4: 완전 검증된 커널
//    - Coq, Isabelle 활용
//    - TCB를 작게 유지 (검증 가능성)

// 실무 관찰:
//   - SGX TCB: Intel이 관리, closed source
//   - SEV TCB: AMD PSP 펌웨어
//   - TDX TCB: SEAM module (signed by Intel)
//   - → 모두 하드웨어 vendor 신뢰 필요
//
// 신뢰 루트:
//   Root of Trust (RoT)
//     → ROM / eFuse / Secure Element
//     → Boot ROM code
//     → Firmware signature verification
//     → OS measurement
//     → Application attestation`}
        </pre>
      </div>
    </section>
  );
}
