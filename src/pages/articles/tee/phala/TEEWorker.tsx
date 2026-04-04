import TEEWorkerViz from './viz/TEEWorkerViz';
import TEEWorkerStepViz from './viz/TEEWorkerStepViz';

export default function TEEWorker({ title }: { title?: string }) {
  return (
    <section id="tee-worker" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'TEE Worker (pRuntime & Phactory)'}</h2>
      <div className="not-prose mb-8">
        <TEEWorkerViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>pRuntime</strong>은 Intel SGX Enclave 내 TEE 런타임입니다.<br />
          <strong>Phactory</strong>는 그 안에서 동작하는 핵심 비즈니스 로직 엔진입니다.<br />
          원격 증명(Remote Attestation)으로 코드 무결성을 보장합니다.<br />
          4계층 보안 모델로 데이터 기밀성을 보호합니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <TEEWorkerStepViz />
      </div>
    </section>
  );
}
