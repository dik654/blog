import { CitationBlock } from '@/components/ui/citation';
import CpuGpuCompareViz from './viz/CpuGpuCompareViz';
import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CPU vs GPU & SIMT 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU는 수천 개의 경량 코어로 대량 병렬 연산을 수행하는 프로세서입니다.
          <br />
          CPU가 복잡한 분기·제어에 최적화된 반면, GPU는 동일 연산을 수천 데이터에 동시 적용하는 데 특화되어 있습니다.
          <br />
          <strong>SIMT(Single Instruction, Multiple Threads)</strong> 모델로 32개 스레드가 하나의 워프(Warp)를 구성합니다.
        </p>

        <CitationBlock source="NVIDIA CUDA C++ Programming Guide" citeKey={1} type="paper"
          href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/">
          <p className="italic">"The SIMT architecture is akin to SIMD — a single instruction controls
          multiple processing elements — but applies it to independent threads rather than data lanes."</p>
        </CitationBlock>
      </div>

      <div className="not-prose my-8">
        <CpuGpuCompareViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 핵심 구성 요소</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">구성</th>
                <th className="border border-border px-4 py-2 text-left">역할</th>
                <th className="border border-border px-4 py-2 text-left">수량 (A100)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['SM (Streaming Multiprocessor)', '코어 그룹 단위, 워프 스케줄러 포함', '108개'],
                ['CUDA Core', '단정밀도 부동소수점 연산', '6912개'],
                ['Warp Scheduler', '32-thread 워프 단위 디스패치', 'SM당 4개'],
                ['Register File', '스레드별 고속 레지스터', 'SM당 64K x 32bit'],
              ].map(([comp, role, count]) => (
                <tr key={comp}>
                  <td className="border border-border px-4 py-2 font-medium">{comp}</td>
                  <td className="border border-border px-4 py-2">{role}</td>
                  <td className="border border-border px-4 py-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
