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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Ethereum</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>목적: 범용 smart contract 플랫폼</li>
              <li>합의: PoS + Casper FFG (2022 merge 이후)</li>
              <li>블록: 단일 leader, 12초마다</li>
              <li>상태: Merkle Patricia Trie (MPT)</li>
              <li>가격: gas = computation</li>
              <li>storage: on-chain expensive</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Filecoin</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>목적: 분산 storage marketplace</li>
              <li>합의: Expected Consensus (EC) + F3</li>
              <li>블록: tipset (여러 blocks), 30초/epoch</li>
              <li>상태: HAMT (Hash Array Mapped Trie)</li>
              <li>가격: storage deal + 증명 비용</li>
              <li>storage: off-chain, proofs on-chain</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Lotus 역할</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Filecoin blockchain 노드</li>
              <li>Storage provider 관리</li>
              <li>Deal making (storage/retrieval)</li>
              <li>PoRep/PoSt 증명 제출</li>
              <li>Payment channel 처리</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">주요 구성 요소</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">lotus-daemon</code> — chain 동기화</li>
              <li><code className="text-xs">lotus-miner</code> — storage provider</li>
              <li><code className="text-xs">lotus-worker</code> — sealing worker</li>
              <li><code className="text-xs">lotus-gateway</code> — light client gateway</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-2">2024 네트워크 현황</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-muted-foreground">Active SPs</span><br /><strong>~4,000</strong></div>
            <div><span className="text-muted-foreground">실저장</span><br /><strong>~1,900 PiB</strong></div>
            <div><span className="text-muted-foreground">CC 용량</span><br /><strong>~650 PiB</strong></div>
            <div><span className="text-muted-foreground">FIL 시가총액</span><br /><strong>~$2B</strong></div>
          </div>
        </div>
        <p className="leading-7">
          Lotus = <strong>Filecoin Go 참조 구현</strong>.<br />
          Ethereum과 다른 목적: 분산 storage marketplace.<br />
          4000+ storage providers, 1900 PiB 실저장.
        </p>

        {/* ── 6-layer 아키텍처 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Lotus 6-Layer 아키텍처</h3>
        <div className="space-y-2 not-prose mb-4">
          {[
            { layer: '6', name: 'API (JSON-RPC)', items: ['lotus CLI tools', 'third-party apps', 'JSON-RPC server'] },
            { layer: '5', name: 'Application Logic', items: ['Markets (deal making)', 'Payment channels', 'Retrieval'] },
            { layer: '4', name: 'VM & Actors', items: ['Filecoin Virtual Machine (FVM)', 'Built-in actors (Miner, Market, Power ...)', 'FEVM (EVM on FVM, 2023+)'] },
            { layer: '3', name: 'Chain & State', items: ['ChainStore: block/tipset 저장', 'StateManager: 상태 관리', 'StateTree: HAMT 기반', 'Block validation'] },
            { layer: '2', name: 'Consensus', items: ['Expected Consensus (EC)', 'Tipset voting', 'VRF-based leader election', 'F3 fast finality (2024+)'] },
            { layer: '1', name: 'P2P & Storage', items: ['libp2p (network)', 'Blockstore (IPFS blocks)', 'Datastore (LevelDB/Badger)'] },
          ].map(l => (
            <div key={l.layer} className="flex items-start gap-3 rounded-lg border bg-card p-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{l.layer}</span>
              <div>
                <p className="text-sm font-semibold">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.items.join(' · ')}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-2">설계 철학</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <span>IPFS 호환 (Content Addressable)</span>
            <span>libp2p 기반 P2P</span>
            <span>Modular design</span>
            <span>Go implementation (Protocol Labs)</span>
          </div>
        </div>
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
