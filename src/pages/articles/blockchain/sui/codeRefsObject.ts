import type { CodeRef } from '@/components/code/types';

export const codeRefsObject: Record<string, CodeRef> = {
  'sui-object-types': {
    path: 'crates/sui-types/src/object.rs',
    code: `/// Sui 객체 소유권 모델
pub enum Owner {
    AddressOwner(SuiAddress),   // Fast Path
    ObjectOwner(ObjectID),
    Shared {                    // Consensus Path
        initial_shared_version: SequenceNumber,
    },
    Immutable,                  // 읽기 전용
}
pub struct Object {
    data: Data,
    owner: Owner,
    previous_transaction: TransactionDigest,
    storage_rebate: u64,
}`,
    lang: 'rust',
    highlight: [1, 15],
    desc: 'Owner enum: 소유/공유/불변 3가지 경로.',
    annotations: [
      { lines: [3, 3], color: 'sky', note: 'AddressOwner → Fast Path' },
      { lines: [5, 7], color: 'emerald', note: 'Shared → Consensus' },
      { lines: [8, 8], color: 'amber', note: 'Immutable → 읽기 전용' },
    ],
  },
  'sui-fast-path': {
    path: 'crates/sui-core/src/authority.rs',
    code: `/// Fast Path: 소유 객체 TX (합의 스킵)
pub async fn handle_transaction(
    &self, transaction: Transaction,
) -> SuiResult<TransactionCertificate> {
    let owned_only = transaction.input_objects()
        .all(|obj| matches!(obj.owner, Owner::AddressOwner(_)));
    if owned_only {
        let cert = self
            .collect_signatures(transaction).await?;
        self.execute_certificate(cert).await
    } else {
        self.submit_to_consensus(transaction).await
    }
}`,
    lang: 'rust',
    highlight: [1, 14],
    desc: 'Fast Path: 소유 객체만 → 2f+1 서명 → 즉시 실행.',
    annotations: [
      { lines: [5, 6], color: 'sky', note: 'Owner 타입 확인' },
      { lines: [8, 10], color: 'emerald', note: '2f+1 → 합의 스킵' },
      { lines: [12, 12], color: 'amber', note: 'Shared → 합의 경로' },
    ],
  },
  'sui-move-object': {
    path: 'crates/sui-framework/sources/transfer.move',
    code: `/// Sui Move: 객체 전송
public fun transfer<T: key>(
    obj: T, recipient: address,
) {
    transfer_impl(obj, recipient)
}
struct Coin<phantom T> has key, store {
    id: UID,              // 전역 고유 ID
    balance: Balance<T>,
}`,
    lang: 'rust',
    highlight: [1, 10],
    desc: 'Sui Move: 객체 중심 전송. UID로 독립 존재.',
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'transfer: 소유권 이동' },
      { lines: [7, 9], color: 'emerald', note: 'UID: 전역 고유 ID' },
    ],
  },
};
