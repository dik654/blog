import CodePanel from '@/components/ui/code-panel';
import CUDAPipelineViz from './viz/CUDAPipelineViz';
import {
  CUDA_INTERFACE_CODE, CUDA_INTERFACE_ANNOTATIONS,
  KERNEL_CODE, KERNEL_ANNOTATIONS,
  MEMORY_CODE, MEMORY_ANNOTATIONS,
} from './CUDAAccelerationData';

export default function CUDAAcceleration({ title }: { title?: string }) {
  return (
    <section id="cuda-acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'CUDA 가속 (VDF + 패킹)'}</h2>
      <div className="not-prose mb-8"><CUDAPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys의 매트릭스 패킹은 대량의 SHA256 엔트로피 계산이 필요하며,
          <strong>NVIDIA GPU CUDA 가속</strong>으로 CPU 대비 수십 배 성능을 달성합니다.
        </p>

        <h3>Rust → CUDA FFI 인터페이스</h3>
        <CodePanel title="CUDA FFI 호출" code={CUDA_INTERFACE_CODE}
          annotations={CUDA_INTERFACE_ANNOTATIONS} />

        <h3>CUDA 커널 구현</h3>
        <CodePanel title="GPU 커널 (compute_entropy_chunks_cuda_kernel)" code={KERNEL_CODE}
          annotations={KERNEL_ANNOTATIONS} />

        <h3>GPU 메모리 관리</h3>
        <CodePanel title="메모리 할당 → 전송 → 실행 → 복사" code={MEMORY_CODE}
          annotations={MEMORY_ANNOTATIONS} />
      </div>
    </section>
  );
}
