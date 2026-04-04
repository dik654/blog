export const ETH_VS_FIL_CODE = `이더리움                          Filecoin (Lotus)
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
  → split-markets (Boost), Curio (차세대 마이너)`;

export const ETH_VS_FIL_ANNOTATIONS = [
  { lines: [1, 11] as [number, number], color: 'sky' as const, note: '공통 레이어 비교' },
  { lines: [12, 17] as [number, number], color: 'emerald' as const, note: 'Filecoin 고유 레이어' },
  { lines: [24, 28] as [number, number], color: 'amber' as const, note: '노드 구성요소' },
];
