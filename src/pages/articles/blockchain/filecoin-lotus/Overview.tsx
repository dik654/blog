import ArchOverviewViz from './viz/ArchOverviewViz';
import EthVsFilViz from './viz/EthVsFilViz';
import SealingPipelineViz from './viz/SealingPipelineViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin Lotus 아키텍처 개요</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p className="leading-7">
          Lotus — <strong>Filecoin 프로토콜의 Go 참조 구현체</strong>.<br />
          "분산 스토리지 + 검증 가능한 저장 증명" 플랫폼의 핵심 노드.<br />
          Protocol Labs가 2020 mainnet 런칭 이후 maintain.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">Lotus 레이어 구조</h3>
      <ArchOverviewViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">이더리움 vs Filecoin 아키텍처</h3>
      <EthVsFilViz />

      <h3 className="text-lg font-semibold mt-8 mb-3">섹터 봉인 파이프라인</h3>
      <SealingPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Filecoin vs Ethereum 차이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Filecoin vs Ethereum 핵심 차이</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethereum:
// - 목적: 범용 smart contract 플랫폼
// - 합의: PoS + Casper FFG (2022 merge 이후)
// - 블록: 단일 leader, 12초마다
// - 상태: Merkle Patricia Trie (MPT)
// - 가격: gas = computation
// - storage: on-chain expensive

// Filecoin:
// - 목적: 분산 storage marketplace
// - 합의: Expected Consensus (EC) + F3
// - 블록: tipset (여러 blocks), 30초/epoch
// - 상태: HAMT (Hash Array Mapped Trie)
// - 가격: storage deal + 증명 비용
// - storage: off-chain, proofs on-chain

// Lotus 역할:
// 1. Filecoin blockchain 노드
// 2. Storage provider 관리
// 3. Deal making (storage/retrieval)
// 4. PoRep/PoSt 증명 제출
// 5. Payment channel 처리

// 주요 구성:
// - lotus-daemon: chain 동기화
// - lotus-miner: storage provider
// - lotus-worker: sealing worker
// - lotus-gateway: light client gateway

// 2024 상태:
// - ~4000 active storage providers
// - ~1900 PiB actual storage
// - ~650 PiB committed capacity
// - FIL token market cap ~$2B`}
        </pre>
        <p className="leading-7">
          Lotus = <strong>Filecoin Go 참조 구현</strong>.<br />
          Ethereum과 다른 목적: 분산 storage marketplace.<br />
          4000+ storage providers, 1900 PiB 실저장.
        </p>

        {/* ── 6-layer 아키텍처 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Lotus 6-Layer 아키텍처</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lotus 6-Layer:
//
// Layer 6: API (JSON-RPC)
//   - lotus CLI tools
//   - third-party apps
//   - Lotus JSON-RPC server
//
// Layer 5: Application Logic
//   - Markets (deal making)
//   - Payment channels
//   - Retrieval
//
// Layer 4: VM & Actors
//   - Filecoin Virtual Machine (FVM)
//   - Built-in actors (Miner, Market, Power, ...)
//   - FEVM (EVM on FVM, 2023+)
//
// Layer 3: Chain & State
//   - ChainStore: block/tipset 저장
//   - StateManager: 상태 관리
//   - StateTree: HAMT 기반
//   - Block validation
//
// Layer 2: Consensus
//   - Expected Consensus (EC)
//   - Tipset voting
//   - VRF-based leader election
//   - F3 fast finality (2024+)
//
// Layer 1: P2P & Storage
//   - libp2p (network)
//   - Blockstore (IPFS blocks)
//   - Datastore (LevelDB/Badger)
//
// 각 layer 책임:
// API: 외부 인터페이스
// Application: business logic
// VM: 결정론적 실행
// Chain: 상태 저장
// Consensus: 합의 alg
// P2P: 네트워크

// 설계 철학:
// - IPFS 호환 (Content Addressable)
// - libp2p 기반 P2P
// - Modular design
// - Go implementation (Protocol Labs)`}
        </pre>
        <p className="leading-7">
          Lotus 6 layers: <strong>API → App → VM → Chain → Consensus → P2P</strong>.<br />
          IPFS 호환, libp2p 기반, modular design.<br />
          Go 구현 — Protocol Labs maintain.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Filecoin은 blockchain이 필요했나</strong> — 증명 검증.<br />
          IPFS만으로는 "누가 진짜 저장하는가?" 증명 불가.<br />
          blockchain이 PoRep/PoSt 증명 기록 + 경제적 인센티브 제공.<br />
          IPFS(content addressing) + Blockchain(incentives) = Filecoin.
        </p>
      </div>
    </section>
  );
}
