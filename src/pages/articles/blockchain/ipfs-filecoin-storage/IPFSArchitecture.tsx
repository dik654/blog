import IPFSNodeViz from './viz/IPFSNodeViz';
import ContentRoutingFlowViz from './viz/ContentRoutingFlowViz';

export default function IPFSArchitecture() {
  return (
    <section id="ipfs-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPFS Kubo 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Kubo — IPFS 공식 Go 구현체. API, Core(UnixFS/DAG/IPNS), Exchange(Bitswap), Network(libp2p) 4계층 구조.<br />
          콘텐츠 라우팅은 Amino DHT + IPNI 인덱서 병렬 탐색
        </p>
      </div>
      <div className="not-prose mb-8"><IPFSNodeViz /></div>
      <div className="not-prose"><ContentRoutingFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Kubo 4-Layer Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Kubo (IPFS reference implementation):

// Layer 4: API
// - HTTP RPC (port 5001)
// - Gateway HTTP (port 8080)
// - CLI commands
// - daemon mode

// Layer 3: Core
// - UnixFS: file system semantics
// - DAG: merkle DAG operations
// - IPNS: mutable naming
// - IPFS Pin API

// Layer 2: Exchange
// - Bitswap: block exchange protocol
// - wantlist tracking
// - prioritized peers
// - streaming

// Layer 1: Network
// - libp2p
// - transport (TCP, QUIC, WebTransport)
// - security (Noise, TLS)
// - multiplexing (yamux, mplex)

// Content Routing:
// 1. Amino DHT (Kademlia):
//    - global public DHT
//    - provider records
//    - find peers with content
//
// 2. IPNI (InterPlanetary Network Indexer):
//    - centralized indexer
//    - fast CID lookup
//    - advertisement-based
//    - complement to DHT

// Content flow:
// 1. Request: ipfs get <CID>
// 2. Local check (blockstore)
// 3. Content routing (DHT + IPNI)
// 4. Peer discovery
// 5. Bitswap: request blocks
// 6. Verify hashes
// 7. Assemble file
// 8. Return to client

// Blockstore:
// - local cache of blocks
// - leveldb/badger backend
// - GC-able
// - pinned blocks kept

// UnixFS:
// - files represented as trees
// - chunks (~256 KB default)
// - directory structures
// - symbolic links

// DAG:
// - Directed Acyclic Graph
// - Merkle DAG (content-addressed)
// - links between blocks
// - deduplicates automatically

// Helia (new JS implementation):
// - browser-first
// - modular
// - replaces js-ipfs (deprecated)
// - TypeScript`}
        </pre>
        <p className="leading-7">
          Kubo 4 layers: <strong>API → Core → Exchange → Network</strong>.<br />
          Amino DHT + IPNI content routing.<br />
          Bitswap block exchange, libp2p transport.
        </p>
      </div>
    </section>
  );
}
