// coding/src/zoda/mod.rs — ZODA PhasedScheme implementation

/// Strong shard: data rows + Merkle proof + checksum matrix.
pub struct StrongShard<D: Digest> {
    data_bytes: usize,
    root: D,                     // Merkle root of row hashes
    inclusion_proof: Proof<D>,   // BMT multi-proof for this shard's rows
    rows: Matrix<F>,             // this shard's data rows
    checksum: Arc<Matrix<F>>,    // shared checksum matrix (Z = X · H)
}

/// Weak shard: only rows + Merkle proof (no checksum, no root).
pub struct WeakShard<D: Digest> {
    inclusion_proof: Proof<D>,
    shard: Matrix<F>,
}

impl<H: Hasher> PhasedScheme for Zoda<H> {
    fn encode(config, data, strategy) -> Result<(Commitment, Vec<StrongShard>)> {
        // 1. Arrange data as matrix n·S × c
        let data = Matrix::init(rows, cols, F::stream_from_u64s(data));
        // 2. Reed-Solomon encode → pad((n+k)·S) × c
        let encoded = data.as_polynomials(encoded_rows).evaluate().data();
        // 3. Commit rows via Binary Merkle Tree
        let bmt = BmtBuilder::<H>::new(row_hashes).build();
        // 4. Fiat-Shamir transcript → commitment
        let mut transcript = Transcript::new(NAMESPACE);
        transcript.commit(root); // → commitment
        // 5. Checking matrix H (random, deterministic from transcript)
        let checksum = data.mul(&checking_matrix);
        // 6. Shuffle indices, produce per-participant shards
        strategy.map_collect_vec(0..total_shards, |i| {
            StrongShard { data_bytes, root, inclusion_proof, rows, checksum }
        })
    }

    fn weaken(config, commitment, index, shard) {
        // StrongShard → WeakShard (strip checksum/root)
        // + CheckingData (transcript-derived matrices)
        // + self-check via check()
    }

    fn check(config, commitment, checking_data, index, weak_shard) {
        // 1. Verify Merkle inclusion proof
        // 2. shard_checksum = weak_shard.shard · checking_matrix
        // 3. Compare with encoded_checksum at shuffled indices
    }

    fn decode(config, commitment, checking_data, shards, strategy) {
        // Collect n·S rows from checked shards
        // Reed-Solomon interpolation → original data
    }
}
