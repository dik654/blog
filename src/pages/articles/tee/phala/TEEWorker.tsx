import TEEWorkerViz from './viz/TEEWorkerViz';
import TEEWorkerStepViz from './viz/TEEWorkerStepViz';
import PRuntimeStructViz from './viz/PRuntimeStructViz';
import WorkerRegisterViz from './viz/WorkerRegisterViz';
import ContractExecModelViz from './viz/ContractExecModelViz';
import WorkerSpecsViz from './viz/WorkerSpecsViz';

export default function TEEWorker({ title }: { title?: string }) {
  return (
    <section id="tee-worker" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'TEE Worker (pRuntime & Phactory)'}</h2>
      <div className="not-prose mb-8">
        <TEEWorkerViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TEE Worker 구조</h3>
        <p>
          <strong>pRuntime</strong>: Intel SGX Enclave 내부 Rust 런타임<br />
          <strong>Phactory</strong>: pRuntime 안의 핵심 비즈니스 로직 엔진<br />
          <strong>Attestation</strong>: DCAP 기반 원격 증명으로 워커 무결성 보장<br />
          <strong>4계층 보안</strong>: HW → Enclave → Runtime → Contract
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">pRuntime 내부 구조</h3>
      </div>
      <div className="not-prose my-6"><PRuntimeStructViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 등록 & Attestation</h3>
      </div>
      <div className="not-prose my-6"><WorkerRegisterViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Contract 실행 모델</h3>
      </div>
      <div className="not-prose my-6"><ContractExecModelViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-6">
        <TEEWorkerStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 하드웨어 요구사항</h3>
      </div>
      <div className="not-prose my-6"><WorkerSpecsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Worker 경제적 인센티브</p>
          <p>
            <strong>Reward 구조</strong>:<br />
            - Contract 실행 fee (gas)<br />
            - 네트워크 공유 리워드 (inflation)<br />
            - Delegation commission
          </p>
          <p className="mt-2">
            <strong>Slashing 조건</strong>:<br />
            ✗ Uptime 90% 미만<br />
            ✗ Attestation 만료 무시<br />
            ✗ Double-signing (incorrect egress)<br />
            ✗ Cluster 규칙 위반
          </p>
          <p className="mt-2">
            <strong>현실적 수익성</strong>:<br />
            - 초기 투자: SGX 서버 $5,000+<br />
            - 월 전기·네트워크: $50~100<br />
            - ROI 기간: 시장 가격 의존<br />
            - 2024 기준: 15~25% APR<br />
            - 클라우드 렌탈도 가능 (OVH, Hetzner)
          </p>
        </div>

      </div>
    </section>
  );
}
