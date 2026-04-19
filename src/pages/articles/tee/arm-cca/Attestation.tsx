import CcaAttestViz from './viz/CcaAttestViz';
import RsiTokenFlowViz from './viz/RsiTokenFlowViz';
import RmmTokenBuildViz from './viz/RmmTokenBuildViz';
import PlatformTokenViz from './viz/PlatformTokenViz';
import VerifierFlowViz from './viz/VerifierFlowViz';

export default function Attestation() {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CCA 원격 증명 — Token &amp; Verification</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">CCA Attestation 구조</h3>

        <CcaAttestViz />

        <p>
          <strong>이중 토큰 구조</strong>: Realm Token + Platform Token<br />
          <strong>포맷</strong>: CBOR(RFC 8949) + COSE(RFC 9052) — IETF 표준<br />
          <strong>프로파일</strong>: PSA Attestation API v1.0 (Arm 표준) 확장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 생성 — RSI Flow</h3>
        <div className="not-prose mb-4"><RsiTokenFlowViz /></div>
        <p>
          <strong>2단계 호출</strong>: INIT으로 시작 → CONTINUE로 chunk 전송<br />
          <strong>이유</strong>: 토큰이 1페이지 초과 가능 (여러 REM + Platform Token)<br />
          <strong>INIT에 challenge</strong>: 사용자가 제공하는 nonce (replay 방어)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RMM 측 토큰 생성</h3>
        <div className="not-prose mb-4"><RmmTokenBuildViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Platform Token (EL3에서)</h3>
        <div className="not-prose mb-4"><PlatformTokenViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifier 측 검증</h3>
        <div className="not-prose mb-4"><VerifierFlowViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">CCA vs TDX/SEV Attestation</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">Intel TDX</th>
                <th className="border border-border px-3 py-2 text-left">AMD SEV-SNP</th>
                <th className="border border-border px-3 py-2 text-left">ARM CCA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">포맷</td>
                <td className="border border-border px-3 py-2">Binary struct</td>
                <td className="border border-border px-3 py-2">Binary report</td>
                <td className="border border-border px-3 py-2">CBOR + COSE</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">서명 알고리즘</td>
                <td className="border border-border px-3 py-2">ECDSA P-256</td>
                <td className="border border-border px-3 py-2">ECDSA P-384</td>
                <td className="border border-border px-3 py-2">EdDSA / ECDSA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">표준</td>
                <td className="border border-border px-3 py-2">DCAP (Intel 전용)</td>
                <td className="border border-border px-3 py-2">VCEK (AMD 전용)</td>
                <td className="border border-border px-3 py-2">IETF RATS/EAT</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">인증서 체인</td>
                <td className="border border-border px-3 py-2">PCK/Intel Root</td>
                <td className="border border-border px-3 py-2">VCEK/AMD Root</td>
                <td className="border border-border px-3 py-2">IAK/SiP CA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">런타임 측정</td>
                <td className="border border-border px-3 py-2">RTMR[0..3] × 48B</td>
                <td className="border border-border px-3 py-2">LaunchDigest만</td>
                <td className="border border-border px-3 py-2">REM[0..3] × 64B</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CCA 증명의 개방성</p>
          <p>
            <strong>IETF RATS(Remote Attestation Procedures)</strong> 표준 기반<br />
            <strong>EAT(Entity Attestation Token)</strong> 공통 포맷 사용
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ 벤더 독립 — 여러 CCA 플랫폼 통합 검증<br />
            ✓ IoT·모바일 기존 PSA 인프라 재사용<br />
            ✓ 오픈 검증자 생태계 (Veraison, parsec 등)
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ CBOR 디코딩 오버헤드<br />
            ✗ 토큰 크기 큼 (2~4KB) — TDX Quote 대비<br />
            ✗ SiP별 IAK 인증서 정책 차이
          </p>
          <p className="mt-2">
            <strong>실전</strong>:<br />
            - Confidential Containers 프로젝트가 CCA attestation 통합 중<br />
            - Veraison이 크로스 플랫폼 verifier 제공 (TDX/SGX/SEV/CCA)<br />
            - Arm CCA API 사양: architectures.docs.arm.com
          </p>
        </div>

      </div>
    </section>
  );
}
