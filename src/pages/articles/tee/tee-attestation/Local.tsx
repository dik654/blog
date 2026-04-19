import EreportViz from './viz/EreportViz';
import LocalProtocolViz from './viz/LocalProtocolViz';
import ReportKeyViz from './viz/ReportKeyViz';
import QuotingEnclaveViz from './viz/QuotingEnclaveViz';
import CrossEnclaveChannelViz from './viz/CrossEnclaveChannelViz';

export default function Local() {
  return (
    <section id="local" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">로컬 증명 (EREPORT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Local Attestation 개요</h3>
        <p>
          <strong>로컬 증명</strong>: 같은 물리 플랫폼 내 TEE 간 상호 인증<br />
          <strong>용도</strong>: 같은 머신에서 여러 enclave 협업 시 서로 신원 확인<br />
          <strong>빠름</strong>: 네트워크·인증서 체인 불필요 (HMAC 기반)<br />
          <strong>Remote attestation의 선행 단계</strong>: Quoting Enclave 호출 시 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EREPORT 명령어 — SGX</h3>
        <div className="not-prose mb-6"><EreportViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Local Attestation 프로토콜</h3>
        <div className="not-prose mb-6"><LocalProtocolViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Report Key — CPU 바운드</h3>
        <div className="not-prose mb-6"><ReportKeyViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 사용 — Quoting Enclave</h3>
        <div className="not-prose mb-6"><QuotingEnclaveViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cross-Enclave Secure Channel</h3>
        <div className="not-prose mb-6"><CrossEnclaveChannelViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Local vs Remote Attestation 선택</p>
          <p>
            <strong>Local Attestation</strong>:<br />
            ✓ 빠름 (HMAC only, ~μs)<br />
            ✓ 오프라인 가능 (네트워크 불필요)<br />
            ✓ 인증서 체인 없음<br />
            ✗ 같은 머신만
          </p>
          <p className="mt-2">
            <strong>Remote Attestation</strong>:<br />
            ✓ 원격 검증 가능<br />
            ✓ Public-key 기반 (비대칭 검증)<br />
            ✗ 느림 (ECDSA + cert chain, ~ms)<br />
            ✗ PCS·인프라 의존
          </p>
          <p className="mt-2">
            <strong>실전 패턴</strong>:<br />
            - 멀티 enclave 앱 → Local (성능)<br />
            - 외부 사용자 신뢰 → Remote<br />
            - Hybrid: QE가 Local → Remote 변환<br />
            - 같은 데이터센터 클러스터 → Local 충분<br />
            - 크로스 데이터센터 → Remote 필수
          </p>
        </div>

      </div>
    </section>
  );
}
