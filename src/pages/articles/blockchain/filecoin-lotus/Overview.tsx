import { CitationBlock } from '../../../../components/ui/citation';
import SealingPipelineViz from './viz/SealingPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin Lotus 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Lotus는 Filecoin 프로토콜의 Go 참조 구현체입니다.
          이더리움이 "화폐 + 스마트 컨트랙트" 플랫폼이라면,
          Filecoin은 <strong>"분산 스토리지 + 검증 가능한 저장 증명"</strong> 플랫폼입니다.
          이더리움의 EL+CL 구조와 비교하면 Lotus는 훨씬 복잡한 다층 아키텍처를 가집니다.
        </p>
        <CitationBlock source="Filecoin Whitepaper, Protocol Labs 2017" citeKey={1} type="paper" href="https://filecoin.io/filecoin.pdf">
          <p className="italic text-foreground/80">"Filecoin employs Expected Consensus, a secret-leader election protocol that yields one or more leaders in each epoch. Leaders extend the chain by creating a Tipset — a set of blocks at the same height."</p>
          <p className="mt-2 text-xs">Expected Consensus는 VRF 기반 리더 선출로 에폭당 여러 블록을 허용하며, 이는 네트워크 처리량을 높이고 포크를 자연스럽게 처리합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 vs Filecoin 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움                          Filecoin (Lotus)
┌────────────────────┐          ┌────────────────────────┐
│  Consensus Layer   │          │  Expected Consensus     │
│  (Casper FFG)      │          │  (Tipset 기반)          │
├────────────────────┤          ├────────────────────────┤
│  Execution Layer   │          │  FVM (Filecoin VM)      │
│  (EVM)             │          │  + Built-in Actors      │
├────────────────────┤          ├────────────────────────┤
│  State (MPT)       │          │  State (HAMT + AMT)     │
├────────────────────┤          ├────────────────────────┤
│  P2P (devp2p)      │          │  P2P (libp2p)           │
├────────────────────┤          ├────────────────────────┤
│                    │          │  Storage Market         │
│  (해당 없음)       │          │  (Deal Making)          │
│                    │          ├────────────────────────┤
│                    │          │  Storage Proving        │
│                    │          │  (PoRep, PoSt)          │
└────────────────────┘          └────────────────────────┘

Filecoin만의 고유 레이어:
  - Storage Market: 스토리지 제공자와 클라이언트 매칭
  - Storage Proving: 데이터가 실제로 저장되어 있음을 암호학적으로 증명

노드 구성요소:
  lotus daemon  — 체인 동기화, 지갑, JSON-RPC API
  lotus-miner   — 섹터 실링, 증명, 딜 관리
  lotus worker  — 실링 연산 병렬 처리 (GPU 활용)
  boost         — 딜 엔진 (검색 & 그래프싱크, YugabyteDB)

체인 동기화 (libp2p GossipSub):
  /fil/blocks — 블록 전파
  /fil/msgs   — 메시지 전파
  Hello → BlockSync → GraphSync → CHAIN_FOLLOW 모드

핵심 차이:
  이더리움: EL + CL 분리 (Engine API), 클라이언트 다양성
  Filecoin: 단일 데몬 (모놀리식), 점진적 모듈화 진행 중
  → split-markets (Boost), Curio (차세대 마이너)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">섹터 봉인 파이프라인 시각화</h3>
        <SealingPipelineViz />
      </div>
    </section>
  );
}
