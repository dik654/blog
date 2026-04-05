export default function TpmPcr() {
  return (
    <section id="tpm-pcr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TPM & PCR 레지스터</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>TPM(Trusted Platform Module)</strong> — CPU와 별도의 보안 칩<br />
          측정값을 <strong>안전하게 저장</strong>하고, 외부에 서명된 증명(quote)을 제공합니다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">PCR: 확장 전용 레지스터</h3>
        <p>
          <strong>PCR(Platform Configuration Register)</strong>은 덮어쓰기가 불가능합니다<br />
          새 측정값은 기존 값에 <strong>확장(extend)</strong>만 할 수 있습니다
        </p>
        <div className="not-prose rounded-xl border p-5 mb-6">
          <div className="text-center font-mono text-sm">
            <span className="text-[#6366f1] font-bold">PCR[i]</span>
            <span className="mx-2">=</span>
            <span>SHA-256(</span>
            <span className="text-[#6366f1] font-bold">PCR[i]</span>
            <span className="mx-1">||</span>
            <span className="text-[#10b981] font-bold">new_measurement</span>
            <span>)</span>
          </div>
        </div>
        <p>
          한 번 부팅하면 <strong>리셋(재부팅) 전까지 변경 불가</strong>합니다<br />
          공격자가 중간 단계를 변조해도, PCR 값이 달라져 검출됩니다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">PCR 인덱스별 역할</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">PCR</th>
                <th className="border border-border px-4 py-2 text-left">측정 대상</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0', 'BIOS/UEFI 펌웨어'],
                ['1', '플랫폼 설정 (부트 순서 등)'],
                ['4', '부트로더 (GRUB)'],
                ['7', 'Secure Boot 정책'],
                ['8-9', 'OS 커널, initrd'],
              ].map(([pcr, desc]) => (
                <tr key={pcr}>
                  <td className="border border-border px-4 py-2 font-mono">{pcr}</td>
                  <td className="border border-border px-4 py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">TPM 2.0 명령어와 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TPM 2.0 주요 명령어
//
// Initialization:
//   TPM2_Startup        - TPM 초기화
//   TPM2_Shutdown       - TPM 종료
//
// PCR Operations:
//   TPM2_PCR_Extend     - PCR 값 확장
//   TPM2_PCR_Read       - PCR 값 읽기
//   TPM2_PCR_Reset      - PCR 리셋 (재부팅)
//   TPM2_PCR_Event      - Event 기록 + extend
//
// Attestation:
//   TPM2_Quote          - PCR 서명
//   TPM2_Certify        - Key 인증
//   TPM2_GetRandom      - 난수 생성
//
// Key Management:
//   TPM2_CreatePrimary  - Primary key 생성
//   TPM2_Create         - Child key 생성
//   TPM2_Load           - Key 로드
//   TPM2_Sign           - 서명
//   TPM2_VerifySignature - 서명 검증
//
// Sealed Storage:
//   TPM2_PolicyPCR      - PCR 기반 정책
//   TPM2_Unseal         - Sealed data 해제

// PCR 23개 (TPM 2.0 표준):
//   PCR[0-7]:  Platform firmware
//   PCR[8-15]: OS and bootloader
//   PCR[16]:   Debug (resettable)
//   PCR[17-22]: DRTM (Dynamic Root of Trust)
//   PCR[23]:   Application-defined

// PCR Bank (해시 알고리즘):
//   TPM 2.0은 multiple banks 지원
//   - SHA-1 (legacy, deprecated)
//   - SHA-256 (표준)
//   - SHA-384 (고강도)
//   - SM3 (중국 표준)

// TPM 사용 사례:
//   1. BitLocker (Windows 디스크 암호화)
//   2. tboot (Intel TXT)
//   3. LUKS + TPM2 (Linux 디스크)
//   4. SSH key storage
//   5. Remote attestation
//   6. Secure identity (EK: Endorsement Key)

// Linux 도구:
//   tpm2-tools: CLI 유틸리티
//   tpm2-tss: TPM Software Stack
//   tpm2-abrmd: Access broker

// 예시 (tpm2-tools):
//   tpm2_pcrread sha256:0,1,4,7
//   tpm2_quote -c primary.ctx -l sha256:0,4,7 \\
//              -q nonce -m quote.msg -s quote.sig
//   tpm2_checkquote -u pub.pem -m quote.msg \\
//                   -s quote.sig -f attestation.yaml`}
        </pre>
      </div>
    </section>
  );
}
