import { CitationBlock } from '../../../../components/ui/citation';

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
            에폭당 평균 5명 당선 (메인넷)

가중치:
  이더리움: LMD-GHOST (어테스테이션 가중치)
  Filecoin: 체인 가중치 = Σ(tipset 내 블록 수 × 블록의 저장 파워)
            → 더 많은 블록이 포함된 tipset이 "더 무거운" 체인
            → 동점 시: 가장 작은 ElectionProof ticket으로 결정

최종성 (Finality):
  이더리움: ~12.8분 (2 에폭, Casper FFG)
  Filecoin: ~7.5시간 (900 에폭, 확률적)
  → F3 프로토콜 (GossiPBFT): 수십 초 이내 빠른 최종성 목표
     EC와 병렬 실행되는 보조 합의

상태 실행:
  Tipset 내 중복 메시지는 한 번만 실행
  → 개별 블록의 메시지를 독립 실행할 수 없음
  → Tipset 전체를 처리해야 상태 결정 가능

슬래싱 조건:
  - Double-fork mining (같은 에폭에 두 블록)
  - Time-offset mining (같은 tipset 기반, 다른 에폭)
  - Parent-grinding (자신의 이전 블록 누락)`}</code>
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
  - 미제출 시 → 패널티 (이더리움의 inactivity leak과 유사)
  - WinningPoSt: 블록 제안자가 에폭 내 제출 (마감 엄격)
  - 미신고 결함 > 신고 결함 패널티 → 조기 신고 인센티브

최소 파워: 10 TiB (메인넷 합의 참여 최소 조건)

Sealing 세부:
  동일 원본 데이터라도 고유한 replica 생성
  → proverId + sectorId로 유일성 보장
  → CommR (replica hash)을 온체인 제출
  → zk-SNARK로 정확한 실링 수행 증명 (온체인 검증용 압축)`}</code>
        </pre>
        <CitationBlock source="lotus/storage/pipeline/states_sealing.go" citeKey={2} type="code" href="https://github.com/filecoin-project/lotus/blob/master/storage/pipeline/states_sealing.go">
          <pre className="text-xs overflow-x-auto"><code>{`// Sealing state machine — 섹터 상태 전이
func (m *Sealing) handlePacking(ctx statemachine.Context, sector SectorInfo) error {
    // AddPiece 완료 → PreCommit1으로 전이
    ...
}

func (m *Sealing) handlePreCommit1(ctx statemachine.Context, sector SectorInfo) error {
    // SDR 인코딩 수행 (CPU 집약적, 3-5시간)
    // storage-proofs-porep → generate_labels()
    ...
}

func (m *Sealing) handlePreCommit2(ctx statemachine.Context, sector SectorInfo) error {
    // Merkle Tree 구축 (GPU 가속: Poseidon 해시)
    // TreeC + TreeR + TreeD 생성
    ...
}

func (m *Sealing) handleSubmitCommit(ctx statemachine.Context, sector SectorInfo) error {
    // Groth16 증명을 체인에 제출
    // ProveCommitSector 메시지 전송
    ...
}`}</code></pre>
          <p className="mt-2 text-xs">Lotus의 sealing 파이프라인은 상태 머신으로 구현되어 있으며, 각 단계(Packing → PC1 → PC2 → WaitSeed → Commit → Finalize)가 독립적인 핸들러로 처리됩니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">FVM (Filecoin Virtual Machine)</h3>
        <p>
          FVM은 <strong>WASM 기반 폴리글롯 실행 환경</strong>입니다.
          하이퍼바이저 설계로 액터가 격리된 샌드박스에서 실행되며,
          syscall로만 외부와 통신합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`FVM 아키텍처:

Built-in Actors (시스템 컨트랙트):
  StorageMarketActor  — 딜 관리
  StoragePowerActor   — 파워 테이블
  RewardActor         — 보상 분배
  PaymentChannelActor — 결제 채널

User-defined Actors:
  Rust → WASM 컴파일 → FVM에서 실행
  Solidity → EVM 바이트코드 → FEVM (SputnikVM) → WASM

FEVM (EVM 호환):
  → Hardhat, MetaMask 등 이더리움 도구 그대로 사용
  → SputnikVM (Rust EVM 인터프리터) 위에서 실행

활용 사례:
  DataDAO, 영구 스토리지 (자동 딜 갱신),
  토큰화된 데이터셋, 스토리지 바운티`}</code>
        </pre>
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
