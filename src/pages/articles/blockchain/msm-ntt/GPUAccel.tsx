import GPUParallelViz from './viz/GPUParallelViz';

export default function GPUAccel() {
  return (
    <section id="gpu-accel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 병렬화 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          MSM = 버킷 단위 SM 분배, NTT = 스테이지별 나비 연산 블록 병렬 실행.
        </p>
      </div>
      <div className="not-prose"><GPUParallelViz /></div>
    </section>
  );
}
