import CIDResolveViz from "./viz/CIDResolveViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        IPFS는 content routing을, Filecoin은 저장 계약과 증명을 담당한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          IPFS와 Filecoin은 같은 시스템의 무료·유료 버전이 아닙니다. IPFS는
          content-addressed block과 provider discovery·transfer를 조합하고,
          Filecoin은 provider가 일정 기간 data를 보관한다는 계약을 actor
          state와 proof·payment로 관리합니다.
        </p>
        <p>
          CID는 content bytes뿐 아니라 hash algorithm과 codec 정보를 함께
          담는 self-describing identifier입니다. CID가 같으면 같은 encoded
          block을 가리킬 수 있지만, 그 block을 지금 제공하는 peer가 있다는
          보장이나 장기 보관 계약까지 자동으로 생기지는 않습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <CIDResolveViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>검색과 보관을 두 단계로 읽는다</h3>
        <p>
          Client는 먼저 DHT·delegated routing·indexer에서 CID provider를 찾고,
          Bitswap 또는 HTTP 같은 transport로 block을 가져옵니다. 장기
          availability가 필요하면 별도의 pinning, replication 또는 Filecoin
          storage service 정책을 설계해야 합니다.
        </p>
      </div>
    </section>
  );
}
