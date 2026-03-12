export default function ConsensusProofs() {
  return (
    <section id="consensus-proofs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 & 저장 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Expected Consensus & Tipset</h3>
        <p>
          이더리움이 매 슬롯마다 하나의 블록을 제안하는 반면,
          Filecoin은 <strong>Tipset</strong> — 같은 에폭의 여러 블록을 동시에 허용합니다.
          이는 Narwhal DAG와 유사한 개념이지만, 합의 방식이 다릅니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 슬롯 vs Filecoin 에폭:

이더리움: │ B₁ │ B₂ │ B₃ │  ← 슬롯당 1블록
Filecoin: │{B₁,B₂,B₃}│{B₄,B₅}│{B₆}│  ← 에폭당 여러 블록 (Tipset)

리더 선출:
  이더리움: RANDAO → 1명의 proposer 선출
  Filecoin: VRF(Verifiable Random Function) → 여러 마이너가 당선 가능
            당선 확률 = 저장 파워(storage power) 비례

가중치:
  이더리움: LMD-GHOST (어테스테이션 가중치)
  Filecoin: 체인 가중치 = Σ(tipset 내 블록 수 × 블록의 저장 파워)
            → 더 많은 블록이 포함된 tipset이 "더 무거운" 체인`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">스토리지 증명 (PoRep & PoSt)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움의 "스테이킹"이 ETH를 잠그는 것이라면,
Filecoin의 "스테이킹"은 디스크 공간 + FIL을 잠그는 것:

PoRep (Proof of Replication) — 최초 저장 증명
───────────────────────────
  이더리움 비유: deposit contract에 32 ETH 예치
  Filecoin: 데이터를 복제(seal)하고 증명 제출

  1. PC1 (Precommit 1): 데이터를 레이어별로 인코딩 (SDR 그래프)
  2. PC2 (Precommit 2): Column hash → 트리 루트 계산
  3. C1/C2 (Commit): zk-SNARK 증명 생성 & 제출

  → GPU 가속 필수 (CUDA로 MSM, NTT 연산)

PoSt (Proof of Spacetime) — 지속적 저장 증명
──────────────────────────
  이더리움 비유: 매 에폭마다 어테스테이션 제출
  Filecoin: 매 데드라인마다 WindowPoSt 증명 제출

  - 24시간을 48개 "데드라인"으로 분할
  - 각 데드라인에 할당된 섹터에 대해 증명 제출
  - 미제출 시 → 패널티 (이더리움의 inactivity leak과 유사)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">FVM (Filecoin Virtual Machine)</h3>
        <p>
          FVM은 이더리움의 EVM과 유사한 역할을 합니다.
          WASM 기반 VM으로, Solidity 스마트 컨트랙트를 실행할 수 있습니다.
          Built-in Actor(시스템 컨트랙트)가 스토리지 마켓, 파워 테이블 등을 관리합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (lotus 레포)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`lotus/
├── chain/                    # 체인 동기화 & 상태 관리
│   ├── consensus/            # Expected Consensus
│   ├── store/                # ChainStore (블록 저장)
│   ├── stmgr/                # State Manager
│   └── vm/                   # FVM 실행 환경
├── storage/                  # 스토리지 마이닝
│   ├── sealer/               # 섹터 Sealing (PoRep)
│   ├── wdpost/               # WindowPoSt 스케줄러
│   └── pipeline/             # Sealing 파이프라인
├── markets/                  # 스토리지/검색 마켓
├── node/                     # 노드 구성 & 라이프사이클
├── api/                      # JSON-RPC API
└── extern/
    ├── filecoin-ffi/         # Rust FFI (증명 생성)
    └── sector-storage/       # 섹터 스토리지 관리`}</code>
        </pre>
      </div>
    </section>
  );
}
