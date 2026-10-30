// commonware/storage/src/qmdb/any/mod.rs · v2026.9.0

// 같은 parent에서 두 sibling batch를 만듭니다.
let parent = db.new_batch()
    .write(k1, Some(v1))
    .merkleize(&db, None).await?;
let fork_a = parent.new_batch::<Sha256>()
    .write(k2, Some(v2))
    .merkleize(&db, None).await?;
let fork_b = parent.new_batch::<Sha256>()
    .write(k3, Some(v3))
    .merkleize(&db, None).await?;

// fork_a가 winning branch가 됩니다.
let (db, _) = db.apply_batch(fork_a).await?;

// fork_b는 현재 DB prefix의 ancestor chain이 아니므로 stale입니다.
assert!(db.validate_batch(&fork_b).is_err());

// commonware/storage/src/qmdb/batch_chain.rs
// 현재 state가 batch base나 ancestor 어느 것과도 같지 않으면 거절합니다.
Err(Error::StaleBatch)
