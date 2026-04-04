import CUDACompareViz from './viz/CUDACompareViz';
import CodePanel from '@/components/ui/code-panel';
import {
  CUDA_CODE, cudaAnnotations,
  ENV_CODE, envAnnotations, PERF,
} from './CUDAAccelerationData';

export default function CUDAAcceleration() {
  return (
    <section id="cuda-acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CUDA 가속</h2>
      <div className="not-prose mb-8"><CUDACompareViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1은 <strong>CUDA 백엔드</strong>를 통해 NTT, MSM, Poseidon2 해시,
          FRI 커밋을 GPU에서 병렬 처리합니다.<br />
          CPU 대비 <strong>약 50배</strong> 속도 향상을 달성합니다.
        </p>
        <h3>CPU vs GPU 성능</h3>
      </div>
      <div className="not-prose overflow-x-auto mt-4 mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-foreground/60 font-medium">연산</th>
              <th className="text-left py-2 px-3 text-foreground/60 font-medium">CPU</th>
              <th className="text-left py-2 px-3 text-green-400 font-medium">GPU</th>
              <th className="text-left py-2 px-3 text-amber-400 font-medium">배율</th>
            </tr>
          </thead>
          <tbody>
            {PERF.map(p => (
              <tr key={p.op} className="border-b border-border/50">
                <td className="py-2 px-3 font-mono text-xs">{p.op}</td>
                <td className="py-2 px-3 text-foreground/60">{p.cpu}</td>
                <td className="py-2 px-3 text-green-400">{p.gpu}</td>
                <td className="py-2 px-3 font-bold text-amber-400">{p.speedup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel title="CudaProver 구현" code={CUDA_CODE} annotations={cudaAnnotations} />
        <CodePanel title="CUDA 설정" code={ENV_CODE} annotations={envAnnotations} />
      </div>
    </section>
  );
}
