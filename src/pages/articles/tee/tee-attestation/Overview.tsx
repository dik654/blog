import ContextViz from './viz/ContextViz';
import AttestationRoleViz from './viz/AttestationRoleViz';
import AttestationStandardsViz from './viz/AttestationStandardsViz';
import AttestationFlowViz from './viz/AttestationFlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Remote Attestation이란</h3>
        <p>
          <strong>원격 증명</strong>(Remote Attestation): TEE 내부 코드의 신뢰성을 원격으로 검증<br />
          "이 코드가 정말 TEE 안에서, 의도한 바이너리로, 패치된 CPU에서 실행 중인가?"<br />
          <strong>암호학적 증명</strong> — 단순 신뢰가 아닌 수학적 검증<br />
          <strong>3자 모델</strong>: Attester(TEE) → Verifier(검증자) → Relying Party(의존자)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation의 역할</h3>
        <div className="not-prose mb-6"><AttestationRoleViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 필수 구성 요소</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">요소</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
                <th className="border border-border px-3 py-2 text-left">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Code Measurement</td>
                <td className="border border-border px-3 py-2">실행 중인 코드 identity</td>
                <td className="border border-border px-3 py-2">MRENCLAVE, MRTD, RIM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Platform Info</td>
                <td className="border border-border px-3 py-2">CPU·펌웨어 상태</td>
                <td className="border border-border px-3 py-2">CPUSVN, TCB version</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Nonce (Challenge)</td>
                <td className="border border-border px-3 py-2">Replay 공격 방어</td>
                <td className="border border-border px-3 py-2">REPORTDATA, user_data</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">HW 서명</td>
                <td className="border border-border px-3 py-2">Report 무결성</td>
                <td className="border border-border px-3 py-2">ECDSA P-256/384</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Cert Chain</td>
                <td className="border border-border px-3 py-2">신뢰 체인</td>
                <td className="border border-border px-3 py-2">PCK, VCEK, IAK</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 표준들</h3>
        <div className="not-prose mb-6"><AttestationStandardsViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 사용 흐름</h3>
        <div className="not-prose mb-6"><AttestationFlowViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Attestation vs Certificate</p>
          <p>
            <strong>일반 X.509 인증서</strong>:<br />
            - CA가 pre-signed<br />
            - "이 도메인은 이 회사 소유" 증명<br />
            - 코드 실행 환경에 대한 보장 없음
          </p>
          <p className="mt-2">
            <strong>TEE Attestation</strong>:<br />
            - TEE가 실시간 생성<br />
            - "이 코드가 지금 TEE에서 실행 중" 증명<br />
            - 매 세션/요청마다 fresh
          </p>
          <p className="mt-2">
            <strong>결합</strong>:<br />
            - <strong>RA-TLS</strong>: TLS cert에 attestation 내장<br />
            - X.509 extension에 SGX Quote 추가<br />
            - 기존 TLS 인프라 그대로 + attestation 검증 추가<br />
            - → 기존 HTTPS 클라이언트 소량 수정으로 적용 가능
          </p>
        </div>

      </div>
    </section>
  );
}
