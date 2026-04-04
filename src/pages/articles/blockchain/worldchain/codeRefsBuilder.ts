import type { CodeRef } from '@/components/code/types';

export const codeRefsBuilder: Record<string, CodeRef> = {
  'wc-tx-pool': {
    path: 'world-chain-builder/crates/world/pool/src/lib.rs',
    code: `/// 커스텀 트랜잭션 풀
pub type WorldChainTransactionPool<P, B> =
    reth_transaction_pool::Pool<
        WorldChainTransactionValidator<
            OpTransactionValidator<P>
        >,
        WorldChainOrdering,
        B,
    >;`,
    lang: 'rust',
    highlight: [1, 9],
    desc: 'TX 풀: reth Pool + WorldChain Validator/Ordering.',
    annotations: [
      { lines: [2, 8], color: 'sky', note: 'reth Pool 래핑 구조' },
    ],
  },
  'wc-payload-builder': {
    path: 'world-chain-builder/crates/world/builder/src/lib.rs',
    code: `/// 블록 빌더
pub struct WorldChainPayloadBuilder<C, S, Txs> {
    pub inner: OpPayloadBuilder<WorldChainTxPool>,
    pub verified_blockspace_capacity: u8,
    pub pbh_entry_point: Address,
    pub pbh_signature_aggregator: Address,
    pub builder_private_key: PrivateKeySigner,
}
// 블록: 시퀀서 tx → PBH tx → 일반 tx`,
    lang: 'rust',
    highlight: [1, 9],
    desc: 'PayloadBuilder: PBH 용량 설정 + PBH 우선 정렬.',
    annotations: [
      { lines: [2, 7], color: 'sky', note: 'PayloadBuilder 구조체' },
      { lines: [9, 9], color: 'emerald', note: 'PBH → 일반 순서' },
    ],
  },
  'wc-gas-capacity': {
    path: 'world-chain-builder/crates/world/builder/src/capacity.rs',
    code: `/// PBH 가스 용량
let verified_gas_limit =
    (self.verified_blockspace_capacity as u64
        * gas_limit) / 100;
// 블록 30M, PBH 40% → 12M 예약
// PBH 부족 → 남은 공간 일반 TX
// PBH 과다 → 12M만 현재 블록`,
    lang: 'rust',
    highlight: [1, 7],
    desc: 'PBH 40% 예약 + 동적 할당.',
    annotations: [
      { lines: [2, 4], color: 'sky', note: 'PBH 가스 한도' },
      { lines: [5, 7], color: 'emerald', note: '동적 할당 규칙' },
    ],
  },
};
