import SecureBootViz from './viz/SecureBootViz';
import SecureBootStepViz from './viz/SecureBootStepViz';

export default function SecureBoot() {
  return (
    <section id="secure-boot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">측정 부팅 &amp; 신뢰 체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Measured Boot의 개념</h3>
        <p>
          <strong>측정 부팅</strong>(Measured Boot): 각 부팅 단계의 바이너리를 해시하여 TPM에 기록<br />
          <strong>차이점</strong>: Secure Boot가 "실행 차단"이라면 Measured Boot는 "사후 검증 가능"<br />
          <strong>TPM 역할</strong>: Platform Configuration Register(PCR)에 측정값 누적<br />
          <strong>원격 증명</strong>: 부팅 후 PCR 값을 원격 서버가 검증 → "정상 부팅됐나"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PCR Extend 연산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PCR은 "extend"만 가능 (set 불가)
// 이 단방향성이 부트 로그 변조 방지

// PCR_new = SHA-256(PCR_old || measurement)

// 초기값
PCR[0..23] = 0x00...0 (24 bytes, SHA-1) or 32 bytes (SHA-256)

// Stage 0: BIOS/UEFI extends PCR[0]
measurement = SHA256(uefi_firmware)
PCR[0] = SHA256(0x00...0 || measurement)

// Stage 1: UEFI extends PCR[4] with bootloader
measurement = SHA256(bootloader_binary)
PCR[4] = SHA256(PCR[4] || measurement)

// Stage 2: Bootloader extends PCR[4] with kernel
measurement = SHA256(kernel_binary)
PCR[4] = SHA256(PCR[4] || measurement)

// ... continues for each boot component

// 표준 PCR 할당 (TCG PC Client Spec)
// PCR[0]: SRTM + BIOS
// PCR[1]: Host Platform Configuration
// PCR[2]: Option ROM Code
// PCR[3]: Option ROM Config
// PCR[4]: MBR/GPT + Boot Manager
// PCR[5]: Boot Manager Events
// PCR[6]: Host Platform Manufacturer Specific
// PCR[7]: Secure Boot Policy
// PCR[8-15]: OS Boot (distro-specific)
// PCR[16]: Debug
// PCR[17-22]: Localities (reserved)
// PCR[23]: Application Support

// 복원 불가능
// - 이전 PCR 값을 몰라도 현재 PCR 알 수 있음
// - 하지만 역으로 PCR_old를 PCR_new에서 유도 불가
// - 악의적 bootloader가 clean measurement로 덮어쓰기 불가`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Secure Boot vs Measured Boot</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">Secure Boot</th>
                <th className="border border-border px-3 py-2 text-left">Measured Boot</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">방식</td>
                <td className="border border-border px-3 py-2">서명 검증</td>
                <td className="border border-border px-3 py-2">해시 기록</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">실패 시</td>
                <td className="border border-border px-3 py-2">부팅 중단</td>
                <td className="border border-border px-3 py-2">부팅 계속 + 기록</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">정책 결정</td>
                <td className="border border-border px-3 py-2">로컬 (BIOS)</td>
                <td className="border border-border px-3 py-2">원격 (verifier)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">유연성</td>
                <td className="border border-border px-3 py-2">엄격 (key DB 관리 필요)</td>
                <td className="border border-border px-3 py-2">유연 (정책만 업데이트)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TPM 필수</td>
                <td className="border border-border px-3 py-2">No</td>
                <td className="border border-border px-3 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">용도</td>
                <td className="border border-border px-3 py-2">Anti-rootkit</td>
                <td className="border border-border px-3 py-2">Remote attestation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">UEFI Secure Boot 상세</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// UEFI Secure Boot 키 계층

// PK (Platform Key)
// - 제조사(OEM)가 설정
// - 최상위 신뢰 앵커
// - PK 수정하려면 PK 서명 필요

// KEK (Key Exchange Key)
// - PK로 서명됨
// - db/dbx 수정 권한
// - 예: Microsoft KEK, OEM KEK

// db (Authorized DB)
// - KEK로 서명됨
// - 허용된 서명자·해시 리스트
// - 예: Microsoft Corporation Windows Production PCA

// dbx (Forbidden DB)
// - 차단된 서명자·해시 리스트
// - 알려진 취약 bootloader 차단
// - Regular update (Windows Update, fwupd)

// 부팅 시 검증
// 1) UEFI firmware가 bootloader 서명 확인
// 2) db에 서명자 있는지
// 3) dbx에 해시 없는지
// 4) 통과하면 실행, 실패하면 차단

// Linux 진입
// - shim bootloader (Microsoft 서명)
// - shim이 GRUB 서명 검증 (Linux vendor key)
// - GRUB이 kernel 서명 검증
// - Kernel이 modules 검증`}</pre>

      </div>
      <div className="not-prose mt-6">
        <SecureBootStepViz />
      </div>
      <div className="not-prose mt-8">
        <SecureBootViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Event Log — PCR을 보강</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TPM Event Log
// PCR은 해시만 저장 → 어떤 파일이었는지 불명
// Event Log가 "뭘 측정했는지" 기록 (UEFI memory 또는 ACPI table)

struct tcg_event_entry {
    u32 pcr_index;          // 어느 PCR에 extend
    u32 event_type;         // EV_EFI_BOOT_SERVICES_APPLICATION 등
    digest digests[N_ALGS]; // 측정값
    u32 event_data_size;
    u8  event_data[];       // 파일 경로, 메타데이터 등
};

// Verifier 측 검증 흐름
// 1) TPM Quote 받기 (PCR 값 + 서명)
// 2) Event Log 받기
// 3) Event Log를 replay하여 PCR 재계산
computed_pcr = 0;
for (event in event_log) {
    computed_pcr = SHA256(computed_pcr || event.digest);
}

// 4) 계산된 값과 Quote의 PCR 비교
if (computed_pcr != quote.pcr[i]) reject;

// 5) Event Log 내용 검증
// - 예상된 bootloader인지
// - 알려진 취약 컴포넌트 없는지
// - 정책 매치 여부

// 도구
// - tpm2_eventlog (ACPI 테이블 덤프)
// - Keylime policy engine
// - rootfs verification`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DRTM (Dynamic RoT for Measurement)</p>
          <p>
            <strong>SRTM vs DRTM</strong>:<br />
            - <strong>SRTM</strong>(Static RoT): 전원 on부터 측정 → PCR 전체 chain<br />
            - <strong>DRTM</strong>(Dynamic RoT): 런타임에 late launch로 새 chain 시작
          </p>
          <p className="mt-2">
            <strong>DRTM 장점</strong>:<br />
            ✓ BIOS·bootloader 측정 건너뛸 수 있음<br />
            ✓ Untrusted OS에서 trusted 환경 launch<br />
            ✓ Intel TXT, AMD SKINIT 구현
          </p>
          <p className="mt-2">
            <strong>사용 사례</strong>:<br />
            - Trusted Boot (tboot)<br />
            - OpenXT (Xen-based secure VM)<br />
            - Windows VBS / Credential Guard<br />
            - Microsoft CHERIoT<br />
            - 일반 Linux distros는 주로 SRTM
          </p>
        </div>

      </div>
    </section>
  );
}
