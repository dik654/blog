// Reth v2.8.1 · crates/transaction-pool/src/blobstore/disk.rs
// source commit: d763342fa185e4e90ee79dc65f6a5706168b0bcb
// 학습용 발췌: 실제 구현의 저장·조회·재시작 경계를 한 파일에 모았습니다.

impl DiskFileBlobStore {
    pub fn open(blob_dir: impl Into<PathBuf>, opts: DiskFileBlobStoreConfig)
        -> Result<Self, DiskFileBlobStoreError>
    {
        let inner = DiskFileBlobStoreInner::new(blob_dir.into(), opts.max_cached_entries);

        // 시작할 때 이전 디렉터리를 지우고 빈 디렉터리를 다시 만듭니다.
        // 따라서 이 backend는 재시작 뒤 sidecar를 복원하는 영구 archive가 아닙니다.
        inner.delete_all()?;
        inner.create_blob_dir()?;
        Ok(Self { inner: Arc::new(inner) })
    }
}

impl DiskFileBlobStoreInner {
    fn insert_one(&self, tx: B256, data: BlobTransactionSidecarVariant)
        -> Result<(), BlobStoreError>
    {
        // Sidecar fields를 RLP bytes로 만듭니다.
        let mut buf = Vec::with_capacity(data.rlp_encoded_fields_length());
        data.rlp_encode_fields(&mut buf);

        // Engine API lookup을 위해 versioned hash → transaction hash를 cache합니다.
        let mut map = self.versioned_hashes_to_txhash.lock();
        data.versioned_hashes().for_each(|hash| { map.insert(hash, tx); });
        drop(map);

        // Sidecar LRU cache를 먼저 갱신한 뒤 파일을 씁니다.
        // 이 순서는 별도의 digest·generation·atomic receipt를 만들지 않습니다.
        self.blob_cache.lock().insert(tx, Arc::new(data));
        let size = self.write_one_encoded(tx, &buf)?;
        self.size_tracker.add_size(size);
        self.size_tracker.inc_len(1);
        Ok(())
    }

    fn get_one(&self, tx: B256)
        -> Result<Option<Arc<BlobTransactionSidecarVariant>>, BlobStoreError>
    {
        // 먼저 LRU cache를 봅니다.
        if let Some(blob) = self.blob_cache.lock().get(&tx) {
            return Ok(Some(blob.clone()))
        }

        // Cache miss면 blob_dir/{tx_hash} 파일을 읽고 RLP decode합니다.
        if let Some(blob) = self.read_one(tx)? {
            let blob = Arc::new(blob);
            self.blob_cache.lock().insert(tx, blob.clone());
            return Ok(Some(blob))
        }
        Ok(None)
    }

    fn read_one(&self, tx: B256)
        -> Result<Option<BlobTransactionSidecarVariant>, BlobStoreError>
    {
        let path = self.blob_dir.join(format!("{tx:x}"));
        let data = match fs::read(path) {
            Ok(data) => data,
            // 파일이 없으면 정상적인 miss인 None입니다.
            Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(None),
            Err(error) => return Err(BlobStoreError::Other(Box::new(error))),
        };

        // 파일은 있지만 decode에 실패하면 DecodeError입니다.
        BlobTransactionSidecarVariant::rlp_decode_fields(&mut data.as_slice())
            .map(Some)
            .map_err(BlobStoreError::DecodeError)
    }
}
