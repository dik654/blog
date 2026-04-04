import TPMAttestViz from './viz/TPMAttestViz';

export default function TPMAttestation() {
  return (
    <section id="tpm-attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TPM 기반 원격 증명</h2>
      <p className="leading-7 mb-4">
        Keylime의 원격 증명은 TPM 2.0의 핵심 기능을 활용합니다.<br />
        PCR(Platform Configuration Register), EK(Endorsement Key),
        AIK(Attestation Identity Key)가 주요 구성 요소입니다.<br />
        전체 증명은 5단계로 이루어지며, 각 단계에서 하드웨어 기반 신뢰가 보장됩니다.
      </p>

      <TPMAttestViz />

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">PCR 동작 원리</h3>
        <p className="leading-7">
          PCR은 TPM 내부의 특수 레지스터로, 직접 쓰기가 불가능합니다.<br />
          오직 확장(extend) 연산을 통해서만 업데이트됩니다.
          <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-sm">
            PCR_new = H(PCR_old || H(data))
          </code>
          이 단방향 누적 구조가 시스템 상태의 변조를 불가능하게 만듭니다.
        </p>

        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-foreground/60">PCR 범위</th>
                <th className="text-left py-2 px-3 font-medium text-foreground/60">용도</th>
                <th className="text-left py-2 px-3 font-medium text-foreground/60">초기값</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0-7', 'BIOS/UEFI 측정값', '0x00'],
                ['8-15', 'OS 로더 & OS 측정값', '0x00'],
                ['16', '디버그 정보', '0x00'],
                ['17-23', '동적 측정값 (IMA 등)', '0xFF'],
              ].map(([range, usage, init]) => (
                <tr key={range} className="border-b border-border/50">
                  <td className="py-2 px-3 font-mono text-foreground/70">{range}</td>
                  <td className="py-2 px-3 text-foreground/80">{usage}</td>
                  <td className="py-2 px-3 font-mono text-foreground/70">{init}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
