import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 서버 네트워크가 다른가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 10G/25G/100G 이더넷, RDMA, InfiniBand를 비교하고,<br />
          블록체인 노드와 GPU 클러스터의 네트워크 요구사항 차이를 정리합니다.
        </p>
      </div>
    </section>
  );
}
