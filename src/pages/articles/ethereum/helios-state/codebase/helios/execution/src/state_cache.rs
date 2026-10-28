pub struct Cache {
    /// Storage proofs: content-addressed by storage_hash
    /// storage_hash -> slot -> full storage proof
    storage: RwLock<LruMap<B256, LruMap<B256, EIP1186StorageProof>>>,

    /// Code: content-addressed by code_hash
    /// code_hash -> bytecode
    code: RwLock<LruMap<B256, Bytes>>,

    /// Account proofs: block-specific
    /// (address, block_hash) -> account proof response (with empty storage_proof)
    accounts: RwLock<LruMap<(Address, B256), EIP1186AccountProofResponse>>,
}

impl Cache {
    /// Insert a VERIFIED account proof response into the cache.
    pub(crate) fn insert(
        &self,
        response: EIP1186AccountProofResponse,
        code: Option<Bytes>,
        block_hash: B256,
    ) {
        let storage_hash = response.storage_hash;

        if !response.storage_proof.is_empty() {
            let mut storage = self.storage.write().unwrap_or_else(|e| e.into_inner());

            if storage.peek(&storage_hash).is_none() {
                storage.insert(
                    storage_hash,
                    LruMap::new(ByLength::new(STORAGE_SLOTS_PER_ROOT_CACHE_SIZE)),
                );
            }

            if let Some(storage_map) = storage.get(&storage_hash) {
                for proof in &response.storage_proof {
                    storage_map.insert(proof.key.as_b256(), proof.clone());
                }
            }
        }

        if let Some(code) = code {
            let mut code_cache = self.code.write().unwrap_or_else(|e| e.into_inner());
            code_cache.insert(response.code_hash, code);
        }

        let account_response = EIP1186AccountProofResponse {
            storage_proof: vec![],
            ..response
        };

        let mut accounts = self.accounts.write().unwrap_or_else(|e| e.into_inner());
        accounts.insert((account_response.address, block_hash), account_response);
    }
}
