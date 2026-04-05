export default function TCB() {
  return (
    <section id="tcb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB (Trusted Computing Base)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TCB의 정의</h3>
        <p>
          <strong>TCB</strong>: 시스템 보안을 책임지는 모든 하드웨어 + 소프트웨어의 합<br />
          TCB의 <strong>어느 한 부분이라도</strong> 침해되면 전체 보안 무너짐<br />
          <strong>TCB 최소화</strong>가 보안 공학의 핵심 원칙<br />
          <strong>TCB 바깥</strong>: untrusted로 가정, 아무리 많이 악용돼도 보안 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TCB 크기의 중요성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TCB 크기 = 신뢰해야 하는 코드 라인 수
// 버그 밀도: ~1-25 bugs per 1000 LoC (평균 ~15)

// 일반 Linux 시스템 TCB
// - Linux kernel: 30M+ LoC
// - glibc: 1M+ LoC
// - systemd: 1M+ LoC
// - userspace libs: 수십M
// → 예상 버그 수: 수천~수만

// TEE로 TCB 축소
// SGX (enclave 단위)
// - CPU hardware (immutable)
// - Enclave code: 수천 ~ 수만 LoC
// - SGX SDK runtime: ~50K LoC
// → 예상 버그: 수십~수백
// → 공식 검증 가능 범위

// 보안 원칙
// "Never trust what you don't need to trust"
// - 최소한의 코드만 TCB에 포함
// - 각 라인이 보안 리뷰됨
// - 가능하면 formal verification`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE별 TCB 구성 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">TCB 포함</th>
                <th className="border border-border px-3 py-2 text-left">크기 추정</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel SGX</strong></td>
                <td className="border border-border px-3 py-2">CPU HW + Enclave 코드 + SDK</td>
                <td className="border border-border px-3 py-2">~50K LoC</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM TrustZone (OP-TEE)</strong></td>
                <td className="border border-border px-3 py-2">TrustZone HW + OP-TEE OS + TAs</td>
                <td className="border border-border px-3 py-2">~200K LoC</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel TDX</strong></td>
                <td className="border border-border px-3 py-2">CPU HW + TD Module + Guest OS</td>
                <td className="border border-border px-3 py-2">30M+ LoC (kernel 포함)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>AMD SEV-SNP</strong></td>
                <td className="border border-border px-3 py-2">CPU HW + ASP firmware + Guest OS</td>
                <td className="border border-border px-3 py-2">30M+ LoC</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM CCA</strong></td>
                <td className="border border-border px-3 py-2">ARM HW + TF-A + RMM + Realm OS</td>
                <td className="border border-border px-3 py-2">30M+ LoC</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGX vs VM-based TEE — TCB trade-off</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SGX (enclave 단위)
//
// 장점:
// ✓ 작은 TCB (수십K LoC)
// ✓ Attack surface 최소
// ✓ Formal verification 가능
// ✓ Per-application 격리
//
// 단점:
// ✗ 앱 재작성 필요 (enclave API)
// ✗ 제한된 기능 (no syscalls inside)
// ✗ 메모리 제약 (초기 128MB EPC)
// ✗ OS 수준 보호 없음 (앱만)

// VM-based TEE (TDX, SEV-SNP, CCA)
//
// 장점:
// ✓ 기존 VM 이미지 그대로 사용
// ✓ 전체 OS + 앱 보호
// ✓ 대용량 메모리 (TB+)
// ✓ 모든 syscalls 사용 가능
//
// 단점:
// ✗ 큰 TCB (OS + 드라이버 전부)
// ✗ Attack surface 넓음
// ✗ Kernel bug = 전체 침해
// ✗ Migration 복잡

// 실무 선택
// - 작은 기밀 컴포넌트: SGX
// - 기존 워크로드 마이그레이션: VM-based
// - 하이브리드: VM + enclave 조합도 가능 (gvisor SGX)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TCB 최소화 전략</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 전략 1: 라이브러리 최소화
// - 표준 libc 대신 minimal runtime (Intel SGX-SDK)
// - 필요한 기능만 링크

// 전략 2: Partitioning
// - 민감 로직만 enclave에 (Edgeless, Asylo)
// - 나머지는 untrusted world
// - ECall/OCall로 경계 관리

// 전략 3: Formal Verification
// - seL4 microkernel (검증된 커널)
// - Hacl* (검증된 암호 라이브러리)
// - FStar, Coq 등 증명 도구

// 전략 4: Hardware-rooted
// - Root key는 CPU 내부 (software 배제)
// - 물리 공격만 root 훼손 가능
// - Attestation으로 TCB 상태 검증

// 전략 5: Defense in depth
// - TCB 내부도 mini-TCB으로 구조화
// - 예: SGX 안에서 Intel MPX로 추가 격리
// - One bug ≠ full compromise

// 현실 적용
// Apple Secure Enclave: ~100K LoC (custom silicon + SEPOS)
// Google Titan: ~10K LoC (전용 RISC-V)
// Microsoft VBS: Hyper-V 기반 (큰 TCB 감수)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TCB는 정량적 지표 이상</p>
          <p>
            <strong>LoC만으로 TCB 판단 불가</strong>:<br />
            - 100 LoC 하드코딩 어셈블리 vs 10K LoC 검증된 Rust<br />
            - 후자가 더 안전할 수 있음<br />
            - 언어·아키텍처·검증 레벨 모두 고려
          </p>
          <p className="mt-2">
            <strong>질적 요소</strong>:<br />
            1. 언어 안전성 (Rust > C)<br />
            2. 검증 여부 (formal proof > tests only)<br />
            3. 공개 여부 (open source > closed)<br />
            4. 감사 받은 횟수<br />
            5. 업데이트 빈도 (패치 용이성)
          </p>
          <p className="mt-2">
            <strong>예시</strong>:<br />
            - Linux kernel 30M LoC, but 많이 검증됨<br />
            - Intel SGX SDK 50K LoC, but Intel 폐쇄<br />
            - seL4 ~10K LoC + 완전 formal verified<br />
            → 단순 LoC 비교는 misleading
          </p>
        </div>

      </div>
    </section>
  );
}
