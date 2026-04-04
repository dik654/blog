import dutiesServiceRs from './codebase/lighthouse/validator_client/validator_services/src/duties_service.rs?raw';
import validatorStoreRs from './codebase/lighthouse/validator_client/validator_store/src/lib.rs?raw';
import gossipMethodsRs from './codebase/lighthouse/beacon_node/network/src/network_beacon_processor/gossip_methods.rs?raw';
import beaconChainRs from './codebase/lighthouse/beacon_node/beacon_chain/src/beacon_chain.rs?raw';
import type { CodeRef } from './archCodeRefsTypes';

export const clCodeRefs: Record<string, CodeRef> = {
  'validator-0': {
    path: 'lighthouse/validator_client/validator_services/src/duties_service.rs',
    code: dutiesServiceRs,
    lang: 'rust',
    highlight: [1516, 1615],
    annotations: [
      { lines: [1516, 1529], color: 'sky',     note: '함수 진입 · 타이머 시작 · 현재 슬롯/epoch 계산' },
      { lines: [1530, 1565], color: 'emerald', note: '비콘 노드에 GET /validator/duties/proposer/{epoch} 조회 (first_success 폴백)' },
      { lines: [1566, 1615], color: 'amber',   note: '응답 파싱 · 내 pubkey만 필터 · proposers 맵에 캐싱 · 추가 알림 발송' },
    ],
    desc:
`문제: 수백 명의 검증자가 매 epoch마다 어느 슬롯에 블록을 제안해야 하는지 알아야 합니다. 매번 상태 트리 전체를 읽어 계산하면 너무 느립니다.

해결: poll_beacon_proposers() 는 비콘 노드에 GET /eth/v1/validator/duties/proposer/{epoch} 를 호출해 epoch 전체의 제안자 목록을 한 번에 받아옵니다. 내가 관리하는 pubkey가 포함된 슬롯만 로컬 proposers 맵에 캐싱해 두고, 해당 슬롯이 오면 즉시 BlockService에 알립니다.

하이라이트 구간: 비콘 노드 fallback 조회 → 결과 필터링 → proposers 맵에 삽입 흐름`,
  },

  'validator-3': {
    path: 'lighthouse/validator_client/validator_store/src/lib.rs',
    code: validatorStoreRs,
    lang: 'rust',
    highlight: [99, 104],
    annotations: [
      { lines: [99, 104], color: 'sky', note: 'sign_block 트레이트 메서드 — 슬래싱 보호 포함 BLS 서명의 인터페이스 정의' },
    ],
    desc:
`문제: 같은 검증자 키가 실수로 두 노드에서 동시에 실행되면 동일 슬롯에 서로 다른 블록에 서명하게 됩니다. 이를 이중 서명(Double Signing)이라 하며 탐지 시 스테이킹한 ETH 일부가 강제 소각되는 슬래싱 패널티를 받습니다.

해결: ValidatorStore 트레이트의 sign_block() 메서드는 반드시 슬래싱 보호 DB를 거치도록 설계되어 있습니다. 구현체는 서명 전에 이전 서명 이력을 확인하고, 충돌이 없을 때만 BLS12-381 서명을 실행합니다.

BLS12-381이란: 타원 곡선 기반 서명 방식으로, 여러 검증자의 서명을 하나로 집계(Aggregation)할 수 있어 비콘 체인이 수천 개의 어테스테이션을 효율적으로 처리할 수 있습니다.

하이라이트 구간: sign_block 트레이트 메서드 시그니처 — 슬래싱 보호를 포함한 블록 서명의 계약을 정의합니다`,
  },

  'beacon-0': {
    path: 'lighthouse/beacon_node/network/src/network_beacon_processor/gossip_methods.rs',
    code: gossipMethodsRs,
    lang: 'rust',
    highlight: [1145, 1193],
    annotations: [
      { lines: [1145, 1152], color: 'sky',     note: 'tracing 계측 어노테이션 — 분산 추적 span 생성, 부모 없이 독립 실행' },
      { lines: [1153, 1162], color: 'emerald', note: 'process_gossip_block 함수 진입 · 블록 루트는 아직 미계산(field::Empty)' },
      { lines: [1163, 1193], color: 'amber',   note: 'unverified_block 1차 검증 → duplicate_cache로 중복 방지 → verified_block 처리' },
    ],
    desc:
`문제: P2P 네트워크를 통해 gossip으로 수신한 블록은 중복일 수도 있고, 이미 finalized(확정)된 과거 블록일 수도 있습니다. 이런 블록을 검증 없이 처리하면 CPU와 I/O가 낭비됩니다.

finalized란: 비콘 체인에서 2/3 이상의 검증자가 어테스테이션한 체크포인트로 영구적으로 확정된 블록입니다. 더 이상 fork choice가 바뀔 수 없으므로 재처리할 필요가 없습니다.

해결: process_gossip_block() 은 두 가지 빠른 필터를 먼저 통과시킵니다.
① finalized epoch 이하의 슬롯 → 즉시 무시
② 이미 DB에 있는 블록 루트 → 즉시 무시
두 필터를 통과한 블록만 process_gossip_unverified_block() 으로 넘어가 전체 검증을 수행합니다.

하이라이트 구간: process_gossip_block → process_gossip_unverified_block 호출 흐름`,
  },

  'beacon-1': {
    path: 'lighthouse/beacon_node/beacon_chain/src/beacon_chain.rs',
    code: beaconChainRs,
    lang: 'rust',
    highlight: [3348, 3415],
    annotations: [
      { lines: [3348, 3368], color: 'sky',     note: '함수 시그니처 · seen_timestamp 기록 · Prometheus 카운터 증가' },
      { lines: [3369, 3395], color: 'emerald', note: 'into_execution_pending_block — BLS 배치 검증 + 상태 전이 준비, publish_fn 호출' },
      { lines: [3396, 3415], color: 'amber',   note: 'into_executed_block — EL에 엔진 페이로드 전달, 실패 시 DA 캐시에서 제거' },
    ],
    desc:
`문제: gossip으로 받은 블록의 유효성을 어떻게 효율적으로 검증하고 저장할까요? 어테스테이션·제안자 서명을 하나씩 검증하면 너무 느리고, EVM 실행까지 직렬로 수행하면 다음 블록 처리가 지연됩니다.

해결: process_block() 은 다음 순서로 처리합니다.
① BLS 서명 배치 검증 — 블록 내 모든 어테스테이션·제안자 서명을 하나의 배치로 묶어 검증 (개별 대비 ~10배 빠름)
② into_execution_pending_block() — 상태 전이 준비 (예치금·randao·슬래싱 처리)
③ into_executed_block() — EL(Reth)에 engine_newPayloadV3로 EVM 실행 위임
④ HotColdDB에 블록 + 상태 저장
⑤ fork choice 트리 갱신 — 이 블록의 어테스테이션 가중치 반영

하이라이트 구간: process_block 진입점 → execution_pending 변환 시작`,
  },
};
