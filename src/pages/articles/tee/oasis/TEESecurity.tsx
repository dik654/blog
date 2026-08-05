import TEESecurityViz from './viz/TEESecurityViz';
import TEEConfigViz from './viz/TEEConfigViz';
import RakGenViz from './viz/RakGenViz';
import RatlsCertViz from './viz/RatlsCertViz';
import DmVerityViz from './viz/DmVerityViz';
import TeeNodeConfigViz from './viz/TeeNodeConfigViz';
import DiscrepancyViz from './viz/DiscrepancyViz';

export default function TEESecurity() {
  return (
    <section id="tee-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TEE 보안</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Intel SGX / TDX</strong>로 Runtime 실행의 기밀성·무결성 보장<br />
          <strong>DCAP Quote</strong> 기반 원격 증명 — Consensus에 Quote 제출 필수<br />
          <strong>RA-TLS</strong> 보안 채널 — Attestation이 TLS 인증서에 포함<br />
          <strong>Multi-TEE</strong>: SGX + TDX 동시 지원, SEV-SNP 실험 중
        </p>
      </div>

      <TEESecurityViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">RAK — Runtime Attestation Key</h3>
      </div>
      <div className="not-prose mb-4"><RakGenViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">RA-TLS — Attestation 통합 TLS</h3>
      </div>
      <div className="not-prose mb-4"><RatlsCertViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">dm-verity — 파일시스템 무결성</h3>
      </div>
      <div className="not-prose mb-4"><DmVerityViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE 설정 & 원격 증명</h3>
      </div>
      <TEEConfigViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mb-4"><TeeNodeConfigViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Discrepancy Detection</h3>
      </div>
      <div className="not-prose mb-4"><DiscrepancyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Attestation을 Consensus에 통합한 의의</p>
          <p>
            <strong>전통 SGX 모델</strong>:<br />
            - 앱이 quote 받아 verifier에 직접 전송<br />
            - verifier는 중앙집중 서비스 (IAS, PCS)<br />
            - 단일 신뢰점 존재
          </p>
          <p className="mt-2">
            <strong>Oasis 모델</strong>:<br />
            - Runtime이 Quote를 Consensus에 제출<br />
            - 모든 검증인이 Quote 검증 후 NodeRegistration 승인<br />
            - 분산 합의 → 신뢰점 분산
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ Verifier 중앙집중 제거<br />
            ✓ Governance로 정책 업데이트 (허용 MRENCLAVE 추가)<br />
            ✓ Slashing 통합 — TEE fault = economic penalty
          </p>
        </div>

      </div>
    </section>
  );
}
