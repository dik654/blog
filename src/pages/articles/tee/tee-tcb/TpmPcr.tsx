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
      </div>
    </section>
  );
}
