import type { FlowNode } from './FlowDiagram';

/* ── beacon-1: process_block ──────────────────────────────────── */
export const beaconProcessFlowData: Record<string, FlowNode[]> = {
  'beacon-1': [
    {
      id: 'b1-1', fn: 'process_block(block, seen_timestamp)', desc: '검증된 블록의 전체 처리 파이프라인',
      color: 'sky', codeRefKey: 'beacon-1',
      detail: '이 함수는 gossip 블록과 RPC(sync) 블록 모두 처리합니다. 타이밍 측정부터 fork choice 갱신까지 전 과정을 조율합니다.',
      children: [
        {
          id: 'b1-1-1', fn: 'BLS 배치 검증 (BatchVerifier)',
          desc: '블록 내 모든 어테스테이션 + 제안자 서명을 하나의 배치로 검증',
          color: 'emerald', codeRefKey: 'beacon-1',
          detail: '개별 BLS 검증은 O(n)이지만 배치 검증은 pairing 연산을 공유해 훨씬 빠릅니다. 수백 개의 어테스테이션이 있어도 약 3~5ms 내에 완료됩니다.',
        },
        {
          id: 'b1-1-2', fn: 'into_execution_pending_block()',
          desc: '상태 전이 준비 — randao, 예치금, 슬래싱, 어테스테이션 처리',
          color: 'amber', codeRefKey: 'beacon-1',
          children: [
            {
              id: 'b1-1-2-1', fn: 'per_block_processing(state, block)',
              desc: 'beacon state 전이 — RANDAO mix, 예치금, 슬래싱, exit 처리',
              color: 'amber', codeRefKey: 'beacon-1',
              detail: '이더리움 컨센서스 스펙의 process_block() 함수를 Rust로 구현한 것입니다. EIP별 포크 로직도 여기서 처리됩니다.',
            },
            {
              id: 'b1-1-2-2', fn: 'publish_fn(block)',
              desc: 'gossip 재전파 — 유효한 블록을 네트워크에 배포',
              color: 'slate', codeRefKey: 'beacon-1',
              detail: '완전한 검증 전에 조기 재전파(early re-broadcast)를 할 수도 있습니다. 재전파 시점은 구현 전략에 따라 다릅니다.',
            },
          ],
        },
        {
          id: 'b1-1-3', fn: 'into_executed_block()',
          desc: 'EL에 EVM 실행 위임 — engine_newPayloadV3 호출',
          color: 'violet', codeRefKey: 'engine-0',
          children: [
            {
              id: 'b1-1-3-1', fn: 'engine_newPayloadV3(payload, versioned_hashes)',
              desc: 'Reth에 실행 페이로드 전달 — EVM 실행 + stateRoot 검증',
              color: 'rose',
              codeRefKey: 'engine-tree-0',
              detail: '↗ 소스 클릭: Reth의 on_new_payload 구현을 확인할 수 있습니다. EVM 실행 → SparseStateTrie 해싱 → PersistenceService 비동기 저장 흐름이 있습니다.',
            },
          ],
        },
        {
          id: 'b1-1-4', fn: 'HotColdDB.put_block(block, state)',
          desc: '검증 완료 블록을 Hot DB에 저장',
          color: 'sky', codeRefKey: 'hotcold-0',
          detail: '새 블록은 항상 Hot DB(최근 64 epoch)에 저장됩니다. finalize 이후 split을 넘으면 migrate_to_cold()가 Cold DB로 이동합니다.',
        },
        {
          id: 'b1-1-5', fn: 'fork_choice.on_block(block_root, state)',
          desc: 'LMD-GHOST fork choice 트리에 블록 추가 — 가중치 갱신',
          color: 'emerald', codeRefKey: 'beacon-1',
          detail: 'LMD-GHOST(Latest Message Driven Greedy Heaviest Observed SubTree): 각 검증자의 최신 어테스테이션 메시지를 기반으로 가장 무거운 체인을 선택합니다.',
        },
      ],
    },
  ],
};
