export const ecTipsetCode = `이더리움 슬롯 vs Filecoin 에폭:

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
  - Parent-grinding (자신의 이전 블록 누락)`;

export const storageProofsCode = `이더리움의 "스테이킹"이 ETH를 잠그는 것이라면,
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
  → zk-SNARK로 정확한 실링 수행 증명 (온체인 검증용 압축)`;

