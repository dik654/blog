import TcbCompareViz from './viz/TcbCompareViz';

export default function TcbCompare() {
  return (
    <section id="tcb-compare" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB 크기 비교: SGX vs TDX vs SEV vs TrustZone</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TEE마다 <strong>어디까지를 신뢰 경계에 포함하는지</strong>가 다릅니다<br />
          TCB가 작을수록 검증해야 할 코드가 줄어들고, 공격 표면이 감소합니다
        </p>
        <TcbCompareViz />
        <p>
          <strong>SGX</strong>는 OS/하이퍼바이저를 완전히 제외하여 가장 작은 TCB를 달성합니다<br />
          <strong>TDX/SEV</strong>는 기존 VM을 수정 없이 보호(Lift & Shift)하는 대신 TCB가 커집니다<br />
          <strong>TrustZone</strong>은 하드웨어 레벨에서 두 세계를 물리적으로 분리하는 접근입니다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">TEE 아키텍처별 TCB 구성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 TEE의 TCB 포함 요소
//
// Intel SGX TCB (Process-level):
//   - CPU hardware
//   - SGX microcode (Intel)
//   - Enclave code (user-written)
//   - Trusted runtime (SDK)
//   - Quoting Enclave (Intel signed)
//   - Provisioning Enclave
//   Excluded: OS, hypervisor, BIOS, drivers ✓
//
// AMD SEV/SEV-SNP TCB (VM-level):
//   - CPU hardware
//   - AMD Secure Processor (PSP) firmware
//   - Guest VM entire (kernel + userspace)
//   - Guest bootloader
//   - Guest firmware
//   Excluded: Hypervisor (not fully trusted)
//
// Intel TDX TCB (VM-level):
//   - CPU hardware
//   - Intel TDX module (SEAM)
//   - Trust Domain (guest VM entire)
//   - Guest OS + apps
//   Excluded: Host hypervisor, Host OS
//
// ARM TrustZone TCB (Partition-level):
//   - CPU hardware (Secure World)
//   - Trusted OS (OP-TEE, Trusty)
//   - Trusted Applications (TA)
//   - Secure Monitor
//   Excluded: Normal World OS (Android/Linux)

// 크기별 비교:
//
// SGX (smallest TCB):
//   ~50K LOC (enclave + SDK)
//   문제: 애플리케이션 재작성 필요
//
// TDX/SEV (larger TCB):
//   ~수백만 LOC (전체 guest VM)
//   장점: Lift & Shift
//
// TrustZone:
//   ~30~100K LOC (Trusted OS)
//   장점: 모바일 친화적

// 다른 각도: Who controls the TCB?
//
// SGX:  Intel controls microcode
// SEV:  AMD controls PSP
// TDX:  Intel controls SEAM
// TZ:   SoC vendor (Qualcomm, etc.)
//
// → 모든 TEE는 하드웨어 vendor를 신뢰해야
// → Open source TEE (Keystone, OpenTitan) 연구 활발`}
        </pre>
      </div>
    </section>
  );
}
