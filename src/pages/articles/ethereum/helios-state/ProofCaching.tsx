export default function ProofCaching({ title }: { title: string }) {
  return (
    <section id="proof-caching" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          같은 주소를 반복 조회하면 매번 RPC에 증명을 요청하는 건 비효율적이다.
          <br />
          Helios는 검증된 증명을 캐시에 저장한다.
        </p>
        <p className="leading-7">
          캐시 키는 <code>(address, block_number)</code>다.
          <br />
          블록이 바뀌면 캐시가 무효화된다 — state_root가 달라지기 때문.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 DB 자체가 캐시 역할을 한다 (mmap).
          <br />
          Helios는 증명을 메모리에 캐싱한다 — 훨씬 작은 메모리 사용량.
        </p>
      </div>
    </section>
  );
}
