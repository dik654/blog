import type { CodeRef } from '@/components/code/types';
import poolRs from './codebase/reth/crates/transaction-pool/src/pool.rs?raw';
import validateRs from './codebase/reth/crates/transaction-pool/src/validate.rs?raw';
import orderingRs from './codebase/reth/crates/transaction-pool/src/ordering.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'pool-add': {
    path: 'reth/crates/transaction-pool/src/pool.rs',
    code: poolRs,
    lang: 'rust',
    highlight: [24, 39],
    desc: '문제: TX가 풀에 추가될 때 검증, 정렬, 서브풀 배치를 거쳐야 합니다.\n\n해결: add_transaction()은 1) validator로 검증 2) inner pool에 삽입 3) 리스너에 알림 순서로 처리합니다. trait 기반이므로 각 단계를 교체할 수 있습니다.',
    annotations: [
      { lines: [31, 32], color: 'sky', note: 'validator.validate(tx) — 서명, nonce, 잔액 등 검증' },
      { lines: [34, 35], color: 'emerald', note: 'inner.add_transaction() — ordering 기준으로 적절한 서브풀에 삽입' },
      { lines: [37, 38], color: 'amber', note: 'notify_listeners() — 새 TX 알림 (PayloadBuilder, P2P 등)' },
    ],
  },
  'tx-validator': {
    path: 'reth/crates/transaction-pool/src/validate.rs',
    code: validateRs,
    lang: 'rust',
    highlight: [4, 21],
    desc: '문제: 잘못된 TX가 풀에 들어가면 블록 생성 시 실행 실패가 발생합니다.\n\n해결: TransactionValidator trait이 체인 ID, 서명, nonce, 잔액, intrinsic gas, base fee를 순서대로 검증합니다.',
    annotations: [
      { lines: [9, 17], color: 'sky', note: '검증 체인: 체인ID → 서명 → nonce → 잔액 → intrinsic gas → base fee' },
      { lines: [20, 21], color: 'emerald', note: 'is_local(): 로컬 TX는 풀이 가득 찰 때 제거 우선순위가 낮음' },
    ],
  },
  'tx-ordering': {
    path: 'reth/crates/transaction-pool/src/ordering.rs',
    code: orderingRs,
    lang: 'rust',
    highlight: [14, 31],
    desc: '문제: TX 풀에서 어떤 TX를 먼저 블록에 포함할지 우선순위를 정해야 합니다.\n\n해결: CoinbaseTipOrdering은 effective_tip_per_gas()를 호출하여 팁이 높은 TX가 우선순위를 갖도록 합니다.',
    annotations: [
      { lines: [22, 31], color: 'sky', note: 'effective_tip = min(max_priority_fee, max_fee - base_fee) → U256 변환' },
    ],
  },
};
