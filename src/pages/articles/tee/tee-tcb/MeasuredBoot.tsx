import MeasuredBootViz from './viz/MeasuredBootViz';

export default function MeasuredBoot() {
  return (
    <section id="measured-boot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">측정 부팅 & 신뢰 체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>측정 부팅(Measured Boot)</strong> — 각 단계가 다음 단계의 코드를 <strong>측정(해시)</strong>한 뒤 실행합니다<br />
          측정값(measurement) = 코드와 설정의 SHA-256 해시
        </p>
        <p>
          체인의 한 단계라도 변조되면 최종 측정값이 달라집니다<br />
          부팅 후 원격 검증자가 측정값을 확인하면 <strong>어떤 소프트웨어가 실행 중인지</strong> 증명할 수 있습니다
        </p>
        <MeasuredBootViz />
        <h3 className="text-xl font-semibold mt-6 mb-3">신뢰 체인의 시작점: Root of Trust</h3>
        <p>
          체인의 첫 단계는 <strong>하드웨어에 내장된 코드</strong>(Boot ROM)입니다<br />
          ROM은 변경 불가능하므로 무조건 신뢰합니다 — 이것이 <strong>Root of Trust</strong>입니다<br />
          Root of Trust가 손상되면 전체 측정 체인이 무의미해집니다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Measured Boot 단계별 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Measured Boot 전체 체인
//
// Stage 0: Root of Trust (ROM/Firmware)
//   - CPU 내부 Boot ROM
//   - 변경 불가
//   - 하드웨어 키 포함
//   → Measures: BIOS/UEFI
//
// Stage 1: BIOS/UEFI
//   - 측정값 → PCR[0]
//   - Secure Boot 정책 로드
//   → Measures: bootloader (GRUB)
//
// Stage 2: Bootloader (GRUB/shim)
//   - 측정값 → PCR[4]
//   - OS 선택
//   → Measures: kernel, initrd
//
// Stage 3: OS Kernel
//   - 측정값 → PCR[8-9]
//   - 커널 모듈 로드
//   → Measures: init system
//
// Stage 4: User Space (IMA)
//   - Linux IMA (Integrity Measurement)
//   - 파일 해시 → PCR[10]
//   → Measures: application binaries

// 측정값 계산:
//   measurement = SHA-256(next_stage_binary)
//
// PCR Extend:
//   PCR[i] = SHA-256(PCR[i] || measurement)
//
// 체인 무결성:
//   단 한 바이트만 변조되어도
//   → 측정값 완전히 달라짐
//   → PCR 값 검증 시 탐지

// 실무 구현:
//   - TPM 2.0 (PCR 24개)
//   - UEFI Secure Boot
//   - Intel Trusted Boot
//   - AMD PSP Secure Boot
//   - ARM Trusted Firmware

// 검증 시나리오:
//   Remote Attestation 시:
//     Verifier requests: PCR values + log
//     Client sends: quote (signed PCRs)
//     Verifier: 해시 체인 재계산 비교
//     → 부팅 과정 검증

// Log (Event Log):
//   - 각 PCR extend 이벤트 기록
//   - TPM2_PCR_Event
//   - /sys/kernel/security/tpm0/binary_bios_measurements
//   - 체인 재계산에 사용`}
        </pre>
      </div>
    </section>
  );
}
