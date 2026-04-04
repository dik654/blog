import type { CodeRef } from '@/components/code/types';
import eip1559Rs from './codebase/reth/crates/primitives-traits/src/eip1559.rs?raw';
import txRs from './codebase/reth/crates/primitives-traits/src/tx.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'calc-base-fee': {
    path: 'reth/crates/primitives-traits/src/eip1559.rs',
    code: eip1559Rs,
    lang: 'rust',
    highlight: [5, 35],
    desc: '문제: base fee는 이전 블록의 가스 사용량에 따라 동적으로 조정됩니다. 정확한 정수 산술이 필요합니다.\n\n해결: Reth는 u128 산술로 오버플로 없이 계산합니다. gas_used > gas_target이면 base fee 인상, 미달이면 인하합니다.',
    annotations: [
      { lines: [12, 14], color: 'sky', note: 'gas_target = gas_limit / elasticity (2) → 가스 사용 목표' },
      { lines: [16, 26], color: 'emerald', note: '가스 초과 시: base_fee_delta = base_fee * delta / target / denominator (최소 1)' },
      { lines: [27, 35], color: 'amber', note: '가스 미달 시: base_fee에서 delta를 빼되 0 이하로 가지 않음 (saturating_sub)' },
    ],
  },
  'effective-tip': {
    path: 'reth/crates/primitives-traits/src/tx.rs',
    code: txRs,
    lang: 'rust',
    highlight: [4, 20],
    desc: '문제: TX가 제출하는 가스 가격에서 실제로 채굴자(proposer)에게 돌아가는 팁을 계산해야 합니다.\n\n해결: effective_tip = min(max_priority_fee, max_fee - base_fee). max_fee < base_fee이면 유효하지 않은 TX입니다.',
    annotations: [
      { lines: [7, 10], color: 'sky', note: 'max_fee < base_fee이면 None 반환 — 유효하지 않은 TX' },
      { lines: [13, 15], color: 'emerald', note: 'min(priority_fee, max_fee - base_fee) — 실효 팁 계산' },
    ],
  },
};
