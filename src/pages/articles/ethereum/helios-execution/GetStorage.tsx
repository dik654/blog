import GetStorageViz from './viz/GetStorageViz';

export default function GetStorage() {
  return (
    <section id="get-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        eth_getStorageAt 구현
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: MDBX HashedStorage 테이블에서
          (addr, keccak(slot))으로 직접 조회한다.<br />
          Helios: get_proof(addr, &[slot], block)으로
          어카운트 + 스토리지 증명을 함께 요청한다.
        </p>
        <p className="leading-7">
          이중 MPT 검증이 필요한 이유:<br />
          1단계: state_root → accountProof → storageRoot 추출<br />
          2단계: storageRoot → storageProof → 슬롯 값 추출<br />
          두 트라이가 중첩되어 있기 때문에 검증도 2회 수행한다.
        </p>
        <p className="leading-7">
          슬롯 경로: keccak256(slot)을 nibble로 변환하여
          Storage Trie를 순회한다.
          최종 Leaf의 RLP 값이 해당 슬롯의 H256 값이다.
        </p>
      </div>
      <div className="not-prose"><GetStorageViz /></div>
    </section>
  );
}
