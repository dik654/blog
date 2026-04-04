// commonware/storage/src/merkle/batch.rs — Batch API (add → merkleize → apply)

/// 머클화 전 배치: 원소 추가만 가능.
pub type UnmerkleizedBatch<D> = batch::UnmerkleizedBatch<Family, D>;

/// 머클화 후 배치: root 조회 가능, finalize → Changeset.
pub type MerkleizedBatch<D> = batch::MerkleizedBatch<Family, D>;

/// Changeset: apply()에 전달하는 변경 집합.
pub type Changeset<D> = batch::Changeset<Family, D>;

// 사용 패턴:
// let mut batch = mmr.new_batch();
// batch = batch.add(&hasher, &element);    // 리프 추가
// let merkleized = batch.merkleize(&hasher); // 루트 계산
// let changeset = merkleized.finalize();     // 소유권 이전
// mmr.apply(changeset)?;                     // DB 반영
