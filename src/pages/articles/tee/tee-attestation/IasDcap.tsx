import IasFlowViz from './viz/IasFlowViz';
import DcapFlowViz from './viz/DcapFlowViz';
import CloudIntegrationViz from './viz/CloudIntegrationViz';
import MigrationViz from './viz/MigrationViz';

export default function IasDcap() {
  return (
    <section id="ias-dcap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IAS vs DCAP 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">두 시스템의 역사</h3>
        <p>
          <strong>IAS</strong>(Intel Attestation Service): 2015년 SGX 출시와 함께 도입<br />
          <strong>DCAP</strong>(Data Center Attestation Primitives): 2019년 도입, 점진적 대체<br />
          <strong>2020년</strong>: Intel이 EPID/IAS deprecation 발표<br />
          <strong>현재</strong>: DCAP이 사실상 표준 — 모든 클라우드가 DCAP 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">상세 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">IAS (EPID)</th>
                <th className="border border-border px-3 py-2 text-left">DCAP (ECDSA)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">서명 알고리즘</td>
                <td className="border border-border px-3 py-2">EPID (그룹 서명)</td>
                <td className="border border-border px-3 py-2">ECDSA P-256</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">검증 주체</td>
                <td className="border border-border px-3 py-2">Intel IAS 서버</td>
                <td className="border border-border px-3 py-2">사용자/운영자</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">온라인 필수</td>
                <td className="border border-border px-3 py-2">Yes (매 attestation)</td>
                <td className="border border-border px-3 py-2">No (PCK 캐시)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Privacy</td>
                <td className="border border-border px-3 py-2">익명성 (그룹 내)</td>
                <td className="border border-border px-3 py-2">Chip ID 노출</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Scalability</td>
                <td className="border border-border px-3 py-2">Intel 서버 한계</td>
                <td className="border border-border px-3 py-2">무제한</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">인증서 체인</td>
                <td className="border border-border px-3 py-2">간단 (IAS cert만)</td>
                <td className="border border-border px-3 py-2">4단계 (Root→PCK)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Deployment 복잡도</td>
                <td className="border border-border px-3 py-2">낮음</td>
                <td className="border border-border px-3 py-2">중간 (PCCS 운영)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Status</td>
                <td className="border border-border px-3 py-2">Deprecated</td>
                <td className="border border-border px-3 py-2">현재 표준</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">IAS 검증 흐름 (legacy)</h3>
        <div className="not-prose mb-6"><IasFlowViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">DCAP 검증 흐름 (현재 표준)</h3>
        <div className="not-prose mb-6"><DcapFlowViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">클라우드 별 DCAP 통합</h3>
        <div className="not-prose mb-6"><CloudIntegrationViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">마이그레이션 고려사항</h3>
        <div className="not-prose mb-6"><MigrationViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 EPID가 실패했나</p>
          <p>
            <strong>EPID의 야심</strong>:<br />
            - 익명 증명 (프라이버시)<br />
            - 그룹 멤버 revocation<br />
            - 암호학적으로 정교함
          </p>
          <p className="mt-2">
            <strong>실제 문제</strong>:<br />
            ✗ Intel 중앙집중 — single point of failure<br />
            ✗ 익명성이 enterprise에는 장애물 (audit 불가)<br />
            ✗ EPID 구현 복잡 → 보안 버그<br />
            ✗ Scale 한계 (IAS 서버 부하)<br />
            ✗ Cloud-native 아키텍처와 불일치
          </p>
          <p className="mt-2">
            <strong>DCAP의 실용주의</strong>:<br />
            ✓ 표준 PKI (ECDSA, X.509) — 검증된 기술<br />
            ✓ Verifier 분산 → scale out<br />
            ✓ 기업 PKI 인프라 재활용<br />
            ✓ 오프라인 검증 (에어갭 환경)<br />
            → "boring technology wins"
          </p>
        </div>

      </div>
    </section>
  );
}
