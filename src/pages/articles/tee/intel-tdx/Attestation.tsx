import AttestationViz from './viz/AttestationViz';
import TdReportStructViz from './viz/TdReportStructViz';
import QuoteFlowViz from './viz/QuoteFlowViz';
import VerifierFlowViz from './viz/VerifierFlowViz';
import AzureMaaViz from './viz/AzureMaaViz';

export default function Attestation() {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 — DCAP &amp; Quote</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">DCAP 아키텍처 (3-party)</h3>

        <AttestationViz />

        <p>
          <strong>DCAP</strong>(Data Center Attestation Primitives): EPID 대체<br />
          Intel 서버 의존성 제거 — 운영자가 직접 PCS(Provisioning Cert. Service) 캐시<br />
          <strong>3 주체</strong>: TD(증명 대상) · Quote Enclave(서명자) · Verifier(검증자)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TDREPORT 구조</h3>
        <TdReportStructViz />
        <p>
          <strong>REPORTDATA(64B)</strong>: 증명자가 임의 데이터 넣는 슬롯<br />
          일반적으로 <strong>nonce + 공개키 해시</strong> → replay 방어 + 키 바인딩<br />
          MRTD+RTMR이 TD 정체성 증명 — 코드·설정·런타임 상태 전부 반영
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Quote 생성 — Service TD 경유</h3>
        <QuoteFlowViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifier 측 검증 로직</h3>
        <VerifierFlowViz />
        <p>
          <strong>검증은 다단계</strong>: 서명 → 인증서 체인 → TCB 상태 → 정책<br />
          <strong>PCS 캐시 필수</strong>: 온라인 의존 제거용 (pccs, SGX Caching Service)<br />
          <strong>정책</strong>: Relying Party가 결정 — 어떤 MRTD/RTMR 조합을 받아줄지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 — Azure CVM Attestation 예</h3>
        <AzureMaaViz />

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Local vs Remote Attestation</p>
          <p>
            <strong>Local Attestation (TDREPORT)</strong>:<br />
            - 같은 플랫폼 내 TD ↔ TD 간 검증<br />
            - HMAC 기반 — 빠름, 오프라인 가능<br />
            - TDX Module이 MAC 키 관리
          </p>
          <p className="mt-2">
            <strong>Remote Attestation (Quote)</strong>:<br />
            - 외부 Relying Party가 검증<br />
            - ECDSA + PCK 인증서 체인 — Intel 신뢰 체인 활용<br />
            - JSON/binary 직렬화 가능
          </p>
          <p className="mt-2">
            <strong>SGX 대비 개선점</strong>:<br />
            - EPID 없음 → Intel IAS 서버 의존성 제거<br />
            - PCS 셀프호스팅 가능 (pccs Docker)<br />
            - TD단위 증명 (VM 전체) — 더 넓은 TCB
          </p>
        </div>

      </div>
    </section>
  );
}
