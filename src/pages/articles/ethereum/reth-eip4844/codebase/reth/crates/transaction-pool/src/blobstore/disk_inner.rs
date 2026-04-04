// reth-transaction-pool — DiskFileBlobStoreInner (reth v1.x)

impl DiskFileBlobStoreInner {
    /// 단일 blob 삽입: RLP 인코딩 → 캐시 + 디스크
    fn insert_one(&self, tx: B256, data: BlobTransactionSidecarVariant)
        -> Result<(), BlobStoreError>
    {
        // 1. RLP 인코딩 — 디스크 저장용 바이트 직렬화
        let mut buf = Vec::with_capacity(data.rlp_encoded_fields_length());
        data.rlp_encode_fields(&mut buf);

        // 2. versioned_hash → tx_hash 매핑 캐시
        // engine API의 getBlobsV1에서 사용
        {
            let mut map = self.versioned_hashes_to_txhash.lock();
            data.versioned_hashes().for_each(|hash| {
                map.insert(hash, tx);
            });
        }

        // 3. LRU 캐시에 저장 — 최근 blob 빠른 조회
        self.blob_cache.lock().insert(tx, Arc::new(data));

        // 4. 디스크에 파일로 저장
        let size = self.write_one_encoded(tx, &buf)?;
        self.size_tracker.add_size(size);
        self.size_tracker.inc_len(1);
        Ok(())
    }

    /// 캐시 또는 디스크에서 blob 조회
    /// 캐시 히트 → 즉시 반환, 미스 → 디스크 읽기 후 캐시 추가
    fn get_one(&self, tx: B256)
        -> Result<Option<Arc<BlobTransactionSidecarVariant>>, BlobStoreError>
    {
        // 캐시 확인
        if let Some(blob) = self.blob_cache.lock().get(&tx) {
            return Ok(Some(blob.clone()))
        }
        // 디스크에서 읽기
        if let Some(blob) = self.read_one(tx)? {
            let blob_arc = Arc::new(blob);
            self.blob_cache.lock().insert(tx, blob_arc.clone());
            return Ok(Some(blob_arc))
        }
        Ok(None)
    }

    /// 파일 경로: blob_dir/{tx_hash_hex}
    fn blob_disk_file(&self, tx: B256) -> PathBuf {
        self.blob_dir.join(format!("{tx:x}"))
    }

    /// 디스크에서 단일 blob 읽기
    fn read_one(&self, tx: B256)
        -> Result<Option<BlobTransactionSidecarVariant>, BlobStoreError>
    {
        let path = self.blob_disk_file(tx);
        let data = {
            let _lock = self.file_lock.read(); // 읽기 lock
            match fs::read(&path) {
                Ok(data) => data,
                Err(e) if e.kind() == io::ErrorKind::NotFound =>
                    return Ok(None),
                Err(e) => return Err(BlobStoreError::Other(
                    Box::new(DiskFileBlobStoreError::ReadFile(tx, path, e))
                )),
            }
        };
        // RLP 디코딩
        BlobTransactionSidecarVariant::rlp_decode_fields(&mut data.as_slice())
            .map(Some)
            .map_err(BlobStoreError::DecodeError)
    }
}
