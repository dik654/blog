import SecureBootViz from './viz/SecureBootViz';
import SecureBootStepViz from './viz/SecureBootStepViz';
import PCRExtendViz from './viz/PCRExtendViz';
import UefiSecureBootViz from './viz/UefiSecureBootViz';
import EventLogViz from './viz/EventLogViz';

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
      </div>
      <div className="not-prose my-6"><PCRExtendViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

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
      </div>
      <div className="not-prose my-6"><UefiSecureBootViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-6">
        <SecureBootStepViz />
      </div>
      <div className="not-prose mt-8">
        <SecureBootViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Event Log — PCR을 보강</h3>
      </div>
      <div className="not-prose my-6"><EventLogViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

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
