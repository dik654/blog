// commonware/storage/src/qmdb/any/mod.rs · v2026.9.0
// 공식 module example에서 batch 한 개의 수명주기를 발췌했습니다.

// 현재 DB state를 부모로 speculative batch를 만듭니다.
let batch = db.new_batch()
    // Application이 만든 key update와 delete를 batch에 기록합니다.
    .write(key, Some(value))
    .write(other_key, None)
    // 현재 state에 mutation을 resolve하고 candidate root를 계산합니다.
    .merkleize(&db, None).await?;

// 이 root는 apply했을 때의 결과이며 아직 durable state가 아닙니다.
let candidate_root = batch.root();

// 현재 DB prefix와 batch ancestry가 이어지는지 먼저 검사합니다.
db.validate_batch(&batch)?;

// 검증된 batch를 visible DB state와 journal에 반영합니다.
let (db, written_range) = db.apply_batch(batch).await?;

// 적용된 state를 disk에 기록합니다.
let db = db.commit().await?;
