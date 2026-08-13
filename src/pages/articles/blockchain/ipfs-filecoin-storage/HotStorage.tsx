import HotStorageViz from "./viz/HotStorageViz";

export default function HotStorage() {
  return (
    <section id="hot-storage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Hot storage는 proof, retrieval과 service SLA를 함께 설계한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sealed sector에 장기간 data를 보관하는 것과 사용자가 즉시 읽을 수
          있는 hot storage service는 같은 요구사항이 아닙니다. Retrieval
          latency가 중요한 서비스는 unsealed copy, cache, HTTP endpoint와
          replication을 별도로 운영하면서 보관 proof와 payment 상태를
          연결해야 합니다.
        </p>
        <p>
          Boost는 Filecoin storage deal의 data transfer와 provider workflow를
          다루고, PDP 기반 서비스는 특정 data를 계속 보유하는지 반복해서
          증명하는 별도 경로입니다. 두 구성요소를 하나의 protocol처럼
          합치기보다 onboarding, proof, retrieval과 settlement 책임을
          분리해 보는 편이 정확합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <HotStorageViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>SLA는 protocol 이름이 아니라 측정 항목으로 정의한다</h3>
        <p>
          First-byte latency, retrieval success, replication factor, proof
          success와 payment finality를 각각 측정합니다. “Cold에서 hot으로
          진화했다”는 서사보다 어떤 copy가 어떤 failure domain에 있고 proof
          실패와 retrieval 실패가 어떻게 연결되는지를 명시해야 합니다.
        </p>
      </div>
    </section>
  );
}
