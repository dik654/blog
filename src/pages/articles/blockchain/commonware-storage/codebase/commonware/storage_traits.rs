// commonware-storage/src/lib.rs
// Storage primitives: Persistable, MMR, ADB, QMDB

use bytes::Bytes;
use std::sync::Arc;

/// Context bundles storage + clock + metrics for every primitive.
pub type Context<S> = Arc<Inner<S>>;
struct Inner<S> {
    storage: S,
    clock: Clock,
    metrics: Metrics,
}

/// Persistable — commit/sync/destroy lifecycle for all storage types.
/// Every storage primitive (MMR, ADB, QMDB) implements this trait.
pub trait Persistable {
    /// Flush pending writes to the OS page cache.
    fn commit(&mut self) -> Result<()>;

    /// Force fsync to durable storage (SSD).
    fn sync(&mut self) -> Result<()>;

    /// Drop all in-memory state and release file handles.
    fn destroy(self) -> Result<()>;
}

/// MMR — append-only Merkle Mountain Range.
/// O(1) sequential writes, SSD-optimized.
pub struct MMR<H: Hasher> {
    journal: Journal,
    size: u64,
    peaks: Vec<H::Digest>,
}

impl<H: Hasher> MMR<H> {
    /// Append a leaf. Returns the new leaf index.
    /// Internally merges peaks when heights match.
    pub fn append(&mut self, leaf: &[u8]) -> Result<u64> {
        let digest = H::hash(leaf);
        self.journal.write(digest.as_ref())?;
        self.size += 1;
        self.merge_peaks();
        Ok(self.size - 1)
    }

    /// Generate an inclusion proof for the given leaf index.
    /// Proof = path_to_peak + other_peaks + mmr_size.
    pub fn prove(&self, index: u64) -> Result<Proof<H>> {
        let path = self.path_to_peak(index)?;
        let others = self.other_peaks(index)?;
        Ok(Proof { path, others, size: self.size })
    }

    /// Verify a proof against the committed root.
    pub fn verify(proof: &Proof<H>, leaf: &[u8]) -> bool {
        let root = Self::bag_peaks(&proof.others, &proof.path);
        root == Self::compute_root(proof.size)
    }
}

/// adb::any — prove "key had value V at some point."
/// Backed by an Operations MMR (append-only log of writes).
pub trait AdbAny: Persistable {
    fn put(&mut self, key: &[u8], value: &[u8]) -> Result<u64>;
    fn prove_any(&self, op_index: u64) -> Result<AnyProof>;
    fn compact(&mut self, inactivity_floor: u64) -> Result<()>;
}

/// adb::current — prove "key's current value is V."
/// Grafts an Activity Merkle Tree onto the Operations MMR.
pub trait AdbCurrent: AdbAny {
    fn get_current(&self, key: &[u8]) -> Result<Option<Bytes>>;
    fn prove_current(&self, key: &[u8]) -> Result<CurrentProof>;
}
