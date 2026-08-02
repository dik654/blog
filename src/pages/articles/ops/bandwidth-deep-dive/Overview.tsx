import BandwidthHierarchyViz from './viz/BandwidthHierarchyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — Bandwidth 가 결정하는 모든 것</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          현대 컴퓨팅의 한계 — <strong>compute 가 아니라 데이터 이동</strong>이다.
          <br />
          GPU 의 peak TFLOPS 가 989 라도 메모리에서 데이터 못 읽어오면 1% 도 못 씀.
          <br />
          이 글은 bandwidth 의 본질 + 워크로드별 영향 + 실전 운영 결정의 의미를 정리.
        </p>
        <p className="leading-7">
          핵심 명제 4 가지:
        </p>
        <ol className="leading-7">
          <li><strong>Memory wall</strong> — compute 는 매년 60% 빠르지만 memory bandwidth 는 30% 만 빠름. 격차 누적.</li>
          <li><strong>LLM 추론은 memory bound</strong> — token 마다 weight read. compute peak 의 5~10% 만 사용.</li>
          <li><strong>Bandwidth 계층의 4 자릿수 차이</strong> — L1 8 TB/s vs HDD 0.25 GB/s. 데이터 위치가 성능 결정.</li>
          <li><strong>Roofline 으로 진단</strong> — 워크로드의 Operational Intensity → memory / compute bound 여부 판단.</li>
        </ol>
      </div>

      <BandwidthHierarchyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>Roofline Model</strong> — compute peak vs memory bandwidth ceiling. 워크로드 진단의 표준.</li>
          <li><strong>LLM 추론의 memory bound</strong> — 왜 H100 의 989 TFLOPS 의 5% 만 사용되는가.</li>
          <li><strong>학습은 다르다</strong> — 큰 batch 면 compute bound. micro-batch / pipeline parallelism 의 의미.</li>
          <li><strong>네트워크 bandwidth</strong> — multi-GPU all-reduce, distributed training 의 통신 비용.</li>
          <li><strong>I/O bandwidth</strong> — Filecoin sealing 의 SSD bandwidth, 데이터 로딩의 PCIe 병목.</li>
          <li><strong>최적화 기법</strong> — flash-attention, KV cache, quantization, prompt caching, MoE.</li>
        </ol>
      </div>
    </section>
  );
}
