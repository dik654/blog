// Reth v2.8.1 · crates/transaction-pool/src/{blobstore/tracker.rs,maintain.rs,blobstore/disk.rs}
// source commit: d763342fa185e4e90ee79dc65f6a5706168b0bcb
// 학습용 발췌: canonical block 추적부터 지연 삭제까지 한 흐름으로 모았습니다.

pub fn on_finalized_block(&mut self, finalized_block: BlockNumber) -> BlobStoreUpdates {
    let mut finalized = Vec::new();

    // Finalized 높이 이하 block에 들어간 Blob transaction hash를 꺼냅니다.
    while let Some(entry) = self.blob_txs_in_blocks.first_entry() {
        if *entry.key() <= finalized_block {
            finalized.extend(entry.remove_entry().1);
        } else {
            break
        }
    }

    if finalized.is_empty() {
        BlobStoreUpdates::None
    } else {
        BlobStoreUpdates::Finalized(finalized)
    }
}

// Pool maintenance loop의 finalization 처리입니다.
if let BlobStoreUpdates::Finalized(blobs) =
    blob_store_tracker.on_finalized_block(finalized)
{
    // Disk backend의 delete_all은 파일을 바로 지우지 않고 queue에 넣습니다.
    pool.delete_blobs(blobs);

    // Blocking maintenance task가 cleanup을 호출합니다.
    task_spawner.spawn_blocking_task(async move {
        pool.cleanup_blobs();
    });
}

fn cleanup(&self) -> BlobStoreCleanupStat {
    // 이번 cleanup이 처리할 삭제 queue를 한 번에 가져옵니다.
    let txs_to_delete = std::mem::take(&mut *self.inner.txs_to_delete.write());
    let mut stat = BlobStoreCleanupStat::default();

    for tx in txs_to_delete {
        let path = self.inner.blob_disk_file(tx);
        match fs::remove_file(&path) {
            Ok(_) => stat.delete_succeed += 1,
            // 이미 지운 파일도 성공으로 처리해 delete를 idempotent하게 만듭니다.
            Err(error) if error.kind() == io::ErrorKind::NotFound => {
                stat.delete_succeed += 1;
            }
            Err(_) => stat.delete_failed += 1,
        }
    }
    stat
}
