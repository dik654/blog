export const anchorCommitCode = `Bullshark 합의 흐름:

매 짝수 라운드(2, 4, 6, ...)에서 "앵커(anchor)" 선출

Round 1 (투표)    Round 2 (앵커)    Round 3 (투표)    Round 4 (앵커)
  ┌───┐            ┌───┐            ┌───┐            ┌───┐
  │V₁ │───────────→│V₁★│←──────────│V₁ │───────────→│V₁★│
  └───┘            └───┘            └───┘            └───┘
  ┌───┐           ╱└───┘            ┌───┐           ╱└───┘
  │V₂ │──────────╱  ↑               │V₂ │──────────╱  ↑
  └───┘         ╱   │               └───┘         ╱   │
  ┌───┐        ╱    │               ┌───┐        ╱    │
  │V₃ │───────╱     │               │V₃ │───────╱     │
  └───┘             │               └───┘             │
                    │                                 │
              2f+1 참조 = 커밋!                  2f+1 참조 = 커밋!

4라운드 "웨이브(Wave)" 구조:
  Wave = [Round 1] [Round 2] [Round 3] [Round 4]
          투표      앵커1     투표      앵커2 + 랜덤 코인

  리더 3명/웨이브:
  - Steady-state 리더 2명 (결정론적, Round 1 & 3)
    → 동기 환경에서 2라운드 만에 커밋 (저지연)
  - Fallback 리더 1명 (Round 4에서 공유 랜덤 코인으로 사후 선출)
    → 비동기 환경에서도 ≥2/3 확률로 커밋 보장
    → 적대자가 네트워크를 조작해도 사후 선출이라 방어 불가

커밋 조건: f+1 투표(다음 라운드 vertex의 강한 참조)
View Change: 불필요 — DAG 자체가 동기화 역할

이더리움 비교:
  이더리움 LMD-GHOST: 가장 많은 어테스테이션을 받은 포크 선택
  Bullshark 앵커:     2f+1 이상의 DAG 참조를 받은 리더 vertex 커밋`;

export const linearizationCode = `앵커가 커밋되면, 해당 앵커의 "인과적 히스토리(causal history)"를
결정론적 순서로 정렬:

앵커 A₄ 커밋 시:
  1. A₄에서 도달 가능한 모든 vertex 수집 (BFS/DFS)
  2. 아직 순서가 결정되지 않은 vertex만 선별
  3. (round, author) 순서로 정렬
  4. 각 vertex의 payload(트랜잭션)를 순서대로 실행

이더리움 비교:
  이더리움: 블록 내 트랜잭션 순서 = 제안자가 결정
  Bullshark: vertex 내 순서 = 저자, vertex 간 순서 = 앵커 기반 정렬

장점: 별도의 통신 없이 DAG 구조만으로 합의 달성
     → "Zero-message overhead" consensus
     → 합의 코드 ~200줄 (Narwhal 위에서)

강한 엣지 vs 약한 엣지:
  강한 엣지: Round r → Round r-1 (투표로 카운트)
  약한 엣지: Round r → Round r-2 이하 (투표 아님)
    → 느린 검증자의 vertex도 DAG에 포함시켜 공정성 보장
    → 이더리움에서 "지연된 어테스테이션"도 포함하는 것과 유사`;

export const suiRepoCode = `sui/
├── narwhal/                    # Narwhal + Bullshark 구현
│   ├── consensus/              # Bullshark 합의
│   │   ├── src/
│   │   │   ├── bullshark.rs    # 앵커 선출 & 커밋 로직
│   │   │   ├── consensus.rs    # ConsensusState 관리
│   │   │   └── dag.rs          # DAG 탐색 & 선형화
│   ├── primary/                # Narwhal Primary (DAG 구축)
│   │   ├── src/
│   │   │   ├── primary.rs      # Certificate 생성
│   │   │   ├── proposer.rs     # Vertex 제안
│   │   │   └── synchronizer.rs # DAG 동기화
│   ├── worker/                 # Narwhal Worker (배치 저장)
│   │   └── src/
│   │       └── worker.rs       # 트랜잭션 배치 관리
│   └── types/                  # 공통 타입 정의
│       └── src/
│           ├── certificate.rs  # Certificate 구조
│           └── header.rs       # Vertex Header

참고: Sui는 이후 Mysticeti로 합의를 업그레이드했으나,
      Narwhal/Bullshark 코드는 학습 자료로서 가치가 높음`;
