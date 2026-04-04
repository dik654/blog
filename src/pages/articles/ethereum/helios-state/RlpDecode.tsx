export default function RlpDecode({ title }: { title: string }) {
  return (
    <section id="rlp-decode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Merkle 증명이 반환하는 바이트는 RLP로 인코딩되어 있다.
          <br />
          <code>Account::decode(&amp;mut &amp;encoded[..])</code>로 4개 필드를 추출한다.
        </p>
        <p className="leading-7">
          nonce(u64), balance(U256), storageRoot(B256), codeHash(B256).
          <br />
          storageRoot는 다시 storage_proof 검증의 루트가 된다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 alloy-rlp 크레이트를 사용한다.
          <br />
          Helios도 동일한 크레이트 — RLP 디코딩 로직은 완전히 같다.
        </p>
      </div>
    </section>
  );
}
