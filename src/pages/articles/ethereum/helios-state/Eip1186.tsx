export default function Eip1186({ title }: { title: string }) {
  return (
    <section id="eip1186" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EIP-1186은 <code>eth_getProof</code> RPC 메서드를 정의한다.
          <br />
          주소와 스토리지 키를 보내면 account_proof + storage_proof를 반환한다.
        </p>
        <p className="leading-7">
          응답에는 nonce, balance, storageHash, codeHash와
          <br />
          각 필드까지의 Merkle-Patricia 트라이 경로가 포함된다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 이 API를 <em>제공</em>한다 (서버 측).
          <br />
          Helios는 이 API를 <em>호출하고 검증</em>한다 (클라이언트 측).
        </p>
      </div>
    </section>
  );
}
