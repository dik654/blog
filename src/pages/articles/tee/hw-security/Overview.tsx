import ContextViz from './viz/ContextViz';
import TCBViz from './viz/TCBViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB &amp; 위협 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 하드웨어 보안인가</h3>
        <p>
          <strong>소프트웨어 한계</strong>: OS·하이퍼바이저가 침해되면 모든 앱 보호 불가<br />
          <strong>해결</strong>: 신뢰의 기반(Root of Trust)을 하드웨어에 둠<br />
          <strong>원칙</strong>: "Never trust software alone" — 하드웨어가 software보다 안전<br />
          <strong>trade-off</strong>: 유연성 감소, 업데이트 어려움, 초기 비용 높음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TCB (Trusted Computing Base)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TCB = 시스템 보안을 책임지는 HW + SW 합계

// 일반 시스템 TCB
// - Linux kernel: ~30M LoC
// - Systemd, libc, drivers: ~10M LoC
// - BIOS/UEFI: ~2M LoC
// - 예상 버그: 수천~수만 개

// TEE 시스템 TCB (SGX)
// - CPU hardware (immutable)
// - Microcode
// - SGX SDK runtime: ~50K LoC
// - Enclave 앱 코드: custom
// - 예상 버그: 수십~수백 개

// TCB 작을수록 보안 강함
// - 각 라인이 공격 표면
// - 모든 라인이 감사·검증 대상
// - 한 버그 → 전체 침해

// 심층 분석
// → /tee/tee-tcb 참조
`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">위협 모델 3분류</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">공격 유형</th>
                <th className="border border-border px-3 py-2 text-left">HW 방어</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>물리적 공격</strong></td>
                <td className="border border-border px-3 py-2">메모리 덤프, 콜드부트, 버스 스니핑, DMA</td>
                <td className="border border-border px-3 py-2">메모리 암호화, IOMMU</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>소프트웨어 공격</strong></td>
                <td className="border border-border px-3 py-2">악성 OS, 루트킷, 하이퍼바이저 탈출</td>
                <td className="border border-border px-3 py-2">SGX/TDX/SEV 격리</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>부채널 공격</strong></td>
                <td className="border border-border px-3 py-2">캐시 타이밍, 전력 분석, EM 방사</td>
                <td className="border border-border px-3 py-2">Constant-time, 파티셔닝</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Root of Trust (RoT)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 신뢰 체인의 시작점 = 변조 불가능한 HW 구성요소

// 주요 Root of Trust 구현

// Intel ME (Management Engine)
// - 별도 x86 core (32-bit Quark)
// - 시스템 부트 제어
// - Firmware update 검증
// - fTPM 제공

// AMD ASP (Secure Processor, 구 PSP)
// - ARM Cortex-A5 core
// - SEV 암호 연산 담당
// - Boot verification
// - eFuse 관리

// ARM TrustZone Secure ROM
// - 1st-stage bootloader (BL1)
// - TF-A (Trusted Firmware-A)
// - Hash chain 시작점

// Apple Secure Enclave Processor (SEP)
// - Custom ARM core
// - T2/M1 이상 Mac에 포함
// - 자체 OS (sepOS)
// - 지문/Face ID + 키 관리

// Google Titan
// - Custom RISC-V chip
// - 데이터센터·Pixel phone
// - Boot integrity
// - Key provisioning

// 공통 속성
// 1. 메인 CPU보다 권한 높음
// 2. eFuse로 고유 키 보유
// 3. AMD/Intel/Arm 서명된 firmware만 실행
// 4. 업데이트 제한적 (rollback 방어)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰 체인 (Chain of Trust)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Secure Boot chain 예시 (ARM Cortex-A)

// Stage 0: Hardware RoT (불변)
// - Boot ROM (CPU 내부)
// - eFuse에 해시·키 저장
// - 변조 물리적으로 불가능

// Stage 1: BL1 (First-stage bootloader)
// - Boot ROM이 flash에서 BL1 로드
// - BL1 서명 검증 (eFuse 공개키로)
// - 통과하면 jump

// Stage 2: BL2 (Trusted Boot Firmware)
// - BL1이 BL2 로드 + 검증
// - Platform 초기화 (DRAM, clock)
// - 다음 단계 로더

// Stage 3: BL31 (EL3 Runtime)
// - PSCI, SMC handler
// - World switching
// - Always-resident

// Stage 4: BL32 (Secure World image)
// - OP-TEE OS
// - Secure EL1에서 실행

// Stage 5: BL33 (Normal World bootloader)
// - U-Boot, GRUB, Windows Boot Manager
// - OS kernel 로드

// 각 단계가 다음을 검증 → 체인 무결성
// 한 단계 bypass = 전체 무너짐
// → Boot ROM이 가장 중요 (immutable)`}</pre>

      </div>
      <div className="not-prose mt-8">
        <TCBViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: HW RoT의 궁극적 신뢰 문제</p>
          <p>
            <strong>최종 신뢰 필수 요소</strong>:<br />
            - CPU 제조사 (Intel, AMD, ARM)<br />
            - eFuse에 저장된 키의 true randomness<br />
            - Boot ROM이 백도어 없이 정직하게 검증
          </p>
          <p className="mt-2">
            <strong>실패 시나리오</strong>:<br />
            ✗ 제조사 내부 악성 직원이 backdoor 심음<br />
            ✗ 국가 압력으로 weakened cryptography<br />
            ✗ 공급망 공격 (supply chain)<br />
            ✗ Firmware에 zero-day 존재
          </p>
          <p className="mt-2">
            <strong>완화 전략</strong>:<br />
            - Open-source hardware (OpenTitan)<br />
            - Formal verification of firmware<br />
            - Multi-vendor attestation (N-out-of-M)<br />
            - Regular TCB update + rollback protection<br />
            - Reproducible builds<br />
            → "Zero trust"는 이론적 목표, 현실은 "minimal trust"
          </p>
        </div>

      </div>
    </section>
  );
}
