import ProofDbViz from './viz/ProofDbViz';

export default function ProofDb() {
  return (
    <section id="proof-db" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        ProofDB 아키텍처 (증명 기반 가상 DB)
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth는 MDBX에서 Account를 직접 읽는다.
          keccak(addr)로 B-tree 검색 → nonce, balance, codeHash 반환.<br />
          Helios는 로컬 DB가 없다.
          ProofDB가 revm의 Database trait을 구현하여 "가상 DB" 역할을 한다.
        </p>
        <p className="leading-7">
          basic(addr) 호출 시 ProofDB 내부 동작:<br />
          1) RPC에 eth_getProof(addr, [], block) 요청<br />
          2) CL에서 검증된 state_root로 MPT 증명 검증<br />
          3) 검증 통과 시 AccountInfo 반환 — 실패 시 에러
        </p>
        <p className="leading-7">
          storage(addr, slot) 호출도 동일 패턴.
          get_proof에 슬롯을 포함하여 이중 MPT 검증을 수행한다.
        </p>
      </div>
      <div className="not-prose"><ProofDbViz /></div>
    </section>
  );
}
