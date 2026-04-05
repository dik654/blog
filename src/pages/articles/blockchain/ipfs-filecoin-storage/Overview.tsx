import CIDResolveViz from './viz/CIDResolveViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPFS &amp; Filecoin 스토리지 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          IPFS — 콘텐츠 주소 기반 분산 파일 시스템. Filecoin — IPFS 위에 경제적 인센티브를 추가한 저장 네트워크.<br />
          CID(Content Identifier) = 파일 내용의 해시가 곧 주소. 어떤 노드에서든 동일 CID로 접근 가능
        </p>
      </div>
      <div className="not-prose"><CIDResolveViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">IPFS &amp; Filecoin 관계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// IPFS (Content-Addressed File System):

// CID (Content Identifier):
// - hash of content
// - deterministic
// - self-verifying
// - immutable

// CID structure:
// <cid-version><multicodec><multihash>
// - cid-v1: base32 encoded
// - multicodec: format (dag-cbor, dag-pb)
// - multihash: sha2-256 typically

// Example:
// bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

// IPFS vs Traditional:
// HTTP: location-based (where)
//   http://example.com/file.txt
// IPFS: content-based (what)
//   ipfs://bafybeig...

// IPFS protocols:
// - Bitswap: block exchange
// - DHT (Kademlia): content routing
// - libp2p: network layer
// - UnixFS: file system format
// - IPLD: linked data

// Filecoin의 역할:
// IPFS가 제공 안 하는 것:
// - economic incentives
// - storage guarantees
// - payment mechanisms
// - persistence assurance

// Filecoin adds:
// - PoRep / PoSt (cryptographic proofs)
// - Storage deals (economic)
// - FIL token (payments)
// - Slashing (accountability)

// 관계:
// IPFS = data layer (content addressing)
// Filecoin = persistence layer (storage economy)
// 둘 결합 → decentralized storage stack

// Stack:
// Application
//   ↓
// IPFS (content addressing)
//   ↓
// Filecoin (storage + payment)
//   ↓
// Physical storage

// Use case spectrum:
// - Pure IPFS: temporary, free tier
// - IPFS + pinning: semi-permanent
// - Filecoin cold: long-term archival
// - Filecoin hot (PDP): frequently accessed

// Compatibility:
// - IPFS tools work with Filecoin data
// - CID compatibility across systems
// - migration path
// - interoperability`}
        </pre>
        <p className="leading-7">
          IPFS: <strong>content-addressed + immutable CIDs</strong>.<br />
          Filecoin: IPFS + economic incentives + storage proofs.<br />
          상호 보완 stack: content addressing + persistence economy.
        </p>
      </div>
    </section>
  );
}
