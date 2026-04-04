import ForkIDStructViz from './viz/ForkIDStructViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fork ID 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Fork ID — EIP-2124에서 제안된 체인 호환성 검증 메커니즘.<br />
          fork_hash(4B CRC32) + fork_next(8B)로 구성, ENR에 포함되어 TCP 연결 없이 호환성 판단
        </p>
      </div>
      <div className="not-prose"><ForkIDStructViz /></div>
    </section>
  );
}
