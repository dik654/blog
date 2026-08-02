import ArchTimelineViz from './viz/ArchTimelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — GPU 아키텍처별 차이가 결정하는 것</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 모델 (A100 · H100) 만 알면 사양 비교 끝이지만, <strong>아키텍처 (Ampere · Hopper) 의 차이</strong>를 모르면 왜 H100 이 A100 보다 6x 빠른지, 왜 같은 모델이 다른 워크로드에서 다르게 동작하는지 답이 안 나온다.
        </p>
        <p className="leading-7">
          이 글은 NVIDIA GPU 의 세대별 아키텍처를 면접 / 운영 관점에서 정리.
          <br />
          하나의 큰 명제 — <strong>아키텍처 = SM 구조 + Tensor Core 세대 + 메모리 hierarchy + 새 명령어</strong>.
        </p>
      </div>

      <ArchTimelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">왜 아키텍처를 알아야 하나</h3>
        <ul className="leading-7">
          <li><strong>같은 카드, 다른 throughput</strong> — A100 에서 잘 돌던 코드가 H100 에서 1.2x 만 빠른 경우. Tensor Core 4 세대를 못 쓰는 코드.</li>
          <li><strong>새 기능 활용</strong> — H100 의 Transformer Engine (FP8) 을 쓰면 학습 throughput 2x. 안 쓰면 같은 H100 인데 A100 가격치도 못 함.</li>
          <li><strong>면접</strong> — &quot;Ampere 와 Hopper 의 차이&quot;, &quot;Tensor Core 가 뭔가&quot;, &quot;FP8 의 의미&quot; 같은 질문이 표준.</li>
          <li><strong>비용 결정</strong> — 워크로드가 A100 으로 충분한지 H100 필수인지 아키텍처 차이로 판단.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>SM (Streaming Multiprocessor) 구조</strong> — Volta → Hopper 의 진화. partition · cache · scheduler.</li>
          <li><strong>Tensor Core 세대별 차이</strong> — 1 gen (FP16) → 5 gen (FP4). 행렬 곱 가속 발전.</li>
          <li><strong>메모리 hierarchy 변화</strong> — L1/L2 cache, shared memory, register, HBM 진화.</li>
          <li><strong>아키텍처별 핵심 혁신</strong> — Ampere MIG · Hopper Transformer Engine · Blackwell dual-die 의 의미.</li>
          <li><strong>DC vs Consumer 분기</strong> — Hopper / Blackwell DC 와 Ada Lovelace / Blackwell consumer 의 차이.</li>
        </ol>
      </div>
    </section>
  );
}
