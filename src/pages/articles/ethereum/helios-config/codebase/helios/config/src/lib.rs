use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Clone, Serialize)]
pub enum Network {
    Mainnet,
    Sepolia,
    Holesky,
}

pub struct ConsensusSpec {
    pub slots_per_epoch: u64,
    pub epochs_per_period: u64,
    pub genesis_validators_root: B256,
    pub bellatrix_fork_version: [u8;4],
    pub capella_fork_version: [u8;4],
    pub deneb_fork_version: [u8;4],
}

pub struct ClientBuilder {
    network: Network,
    consensus_rpc: Option<String>,
    execution_rpc: Option<String>,
    checkpoint: Option<B256>,
    data_dir: Option<PathBuf>,
    fallback_rpcs: Vec<String>,
}

impl ClientBuilder {
    pub fn new() -> Self { .. }
    pub fn network(
        mut self, n: Network,
    ) -> Self { self.network = n; self }
    pub fn consensus_rpc(
        mut self, url: String,
    ) -> Self { .. }
    pub fn build(self)
        -> Result<Client> { .. }
}
