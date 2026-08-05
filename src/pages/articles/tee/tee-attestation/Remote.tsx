import EpidViz from './viz/EpidViz';
import DcapViz from './viz/DcapViz';
import DcapInfraViz from './viz/DcapInfraViz';
import QuoteStructViz from './viz/QuoteStructViz';

export default function Remote() {
  return (
    <section id="remote" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 (EPID/DCAP)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Remote Attestation의 구조</h3>
        <p>
          <strong>원격 증명</strong>: 로컬 증명의 확장 — 네트워크 너머 검증 가능<br />
          <strong>Quoting Enclave(QE)</strong>: EREPORT → Quote 변환, 외부 전송 가능한 서명 생성<br />
          <strong>2가지 방식</strong>: EPID(old, deprecated) vs DCAP(new, current)<br />
          <strong>Verifier 위치</strong>: Intel 서버(EPID) vs 자체 운영(DCAP)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EPID 방식 (2015~2020)</h3>
        <div className="not-prose mb-6"><EpidViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">DCAP 방식 (2019~현재)</h3>
        <div className="not-prose mb-6"><DcapViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">DCAP 인프라 구성</h3>
        <div className="not-prose mb-6"><DcapInfraViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Quote 구조 (SGX DCAP v3)</h3>
        <div className="not-prose mb-6"><QuoteStructViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 사용 사례별 패턴</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">사용 사례</th>
                <th className="border border-border px-3 py-2 text-left">권장 방식</th>
                <th className="border border-border px-3 py-2 text-left">Nonce</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">TLS handshake (RA-TLS)</td>
                <td className="border border-border px-3 py-2">DCAP + X.509 ext</td>
                <td className="border border-border px-3 py-2">TLS random</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">키 배포</td>
                <td className="border border-border px-3 py-2">DCAP + nonce</td>
                <td className="border border-border px-3 py-2">Fresh random</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">블록체인 오라클</td>
                <td className="border border-border px-3 py-2">DCAP</td>
                <td className="border border-border px-3 py-2">Block hash</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">서비스 등록</td>
                <td className="border border-border px-3 py-2">DCAP (once)</td>
                <td className="border border-border px-3 py-2">Service nonce</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">법적 감사</td>
                <td className="border border-border px-3 py-2">DCAP with long-term archive</td>
                <td className="border border-border px-3 py-2">Audit event ID</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DCAP의 패러다임 전환</p>
          <p>
            <strong>EPID의 한계</strong>:<br />
            - Intel centralized verifier<br />
            - 각 attestation이 IAS 경유<br />
            - 대규모 scale 어려움
          </p>
          <p className="mt-2">
            <strong>DCAP의 해결</strong>:<br />
            - Intel = Certificate Authority only (PCK 발급)<br />
            - Verification = 운영자가 직접<br />
            - 표준 X.509/ECDSA 사용<br />
            - 기존 PKI 인프라 재활용
          </p>
          <p className="mt-2">
            <strong>확장 방향</strong>:<br />
            - IETF RATS 표준화<br />
            - Cross-vendor verifier (Veraison)<br />
            - Attestation + blockchain audit<br />
            - Attestation-as-a-Service (cloud 3rd party)
          </p>
        </div>

      </div>
    </section>
  );
}
