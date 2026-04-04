export const abciBridgeCode = `블록 생성 흐름 (이더리움과 비교):

이더리움:
  CL: engine_forkchoiceUpdatedV3(headHash, payloadAttributes)
  EL: 페이로드 빌드 시작
  CL: engine_getPayloadV3(payloadId)
  EL: 완성된 페이로드 반환
  CL: engine_newPayloadV3(payload) → EL이 실행 & 검증

Omni Octane:
  CometBFT: ABCI PrepareProposal 호출
  Octane:   engine_forkchoiceUpdatedV3 → geth에 빌드 요청
            engine_getPayloadV3 → 페이로드 수신
            페이로드를 CometBFT 블록에 포함

  CometBFT: ABCI ProcessProposal 호출
  Octane:   engine_newPayloadV3 → geth가 실행 & 검증
            engine_forkchoiceUpdatedV3(headHash=new) → 새 헤드 확정
            결과를 CometBFT에 Accept/Reject 반환

  CometBFT: ABCI FinalizeBlock 호출
  Octane:   GetBlockReceiptsAt → EVM 로그 수집 & 이벤트 처리

→ ABCI 콜백이 Engine API 호출로 변환되는 "어댑터" 패턴

핵심 차이 (Ethermint vs Octane):
  Ethermint: 합의 → 실행 순차 처리 (병목!)
  Octane:    합의 & 실행 병렬 처리 (동시 진행)
  → Octane은 Ethermint를 대체하기 위해 설계됨`;

export const dualConsensusCode = `Halo의 이중 합의 프로세스:

블록 N 합의 시:
  1. Omni EVM 합의:
     - 제안자가 Engine API로 EVM 페이로드 빌드
     - 페이로드를 CometBFT 트랜잭션으로 래핑
     - Prevote → Precommit → 커밋

  2. XBlock 합의 (동시 진행):
     - 검증자들이 연결된 롤업의 Portal Contract 모니터링
     - 관찰된 크로스체인 이벤트를 XBlock으로 패키징
     - XBlock 해시에 대해 어테스테이션
     - 어테스테이션을 합의 블록에 포함

이중 스테이킹:
  ┌─────────────────────────────────┐
  │ Omni Staking (Omni EVM)         │
  │  - OMNI 토큰 직접 스테이킹      │
  │  - 보상 분배 & 슬래싱           │
  ├─────────────────────────────────┤
  │ EigenLayer AVS (Ethereum L1)    │
  │  - restaked ETH 위임            │
  │  - EigenLayer 오퍼레이터 활용    │
  ├─────────────────────────────────┤
  │ Portal Contracts (각 롤업)      │
  │  - 검증자 셋 & 투표 파워 동기화  │
  └─────────────────────────────────┘

이더리움 비교:
  이더리움: 32 ETH 단일 스테이킹
  Omni: OMNI + restaked ETH 이중 스테이킹
  → 이더리움의 경제적 보안을 직접 차용`;

