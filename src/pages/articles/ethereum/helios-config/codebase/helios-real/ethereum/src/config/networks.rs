// a16z/helios 저장소 · ethereum/src/config/networks.rs (main branch, commit
// 43a8c9f, 2026년 8월 기준 이 글이 인용하는 SHA). 전체 392줄 중 Network
// enum과 mainnet()만 발췌했습니다. sepolia()/holesky()/hoodi()는 같은
// 구조라 생략했습니다.
// 본문 대응: network-config section의 "Network는 Mainnet·Sepolia·Holesky·
// Hoodi 네 profile을 제공하고, 각 profile은 chain ID, genesis time/root,
// consensus fork epoch/version, execution fork timestamp, default
// checkpoint·consensus endpoint와 checkpoint age policy를 한 묶음으로
// 만든다"는 claim의 실제 정의.

pub enum Network {
    Mainnet,
    Sepolia,
    Holesky,
    Hoodi,
}

pub fn mainnet() -> BaseConfig {
    BaseConfig {
        // article의 default checkpoint
        default_checkpoint: b256!(
            "9b41a80f58c52068a00e8535b8d6704769c7577a5fd506af5e0c018687991d55"
        ),
        rpc_port: 8545, // article의 "network default 8,545"
        // article의 consensus endpoint
        consensus_rpc: Some(Url::parse("https://ethereum.operationsolarstorm.org").unwrap()),
        // article의 chain ID, genesis time/root
        chain: ChainConfig {
            chain_id: 1,
            genesis_time: 1606824023,
            genesis_root: b256!("4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95"),
        },
        // article의 consensus fork epoch/version — fork마다 activation
        // epoch와 version bytes가 함께 고정된다
        forks: Forks {
            genesis: Fork { epoch: 0, fork_version: fixed_bytes!("00000000") },
            altair: Fork { epoch: 74240, fork_version: fixed_bytes!("01000000") },
            bellatrix: Fork { epoch: 144896, fork_version: fixed_bytes!("02000000") },
            capella: Fork { epoch: 194048, fork_version: fixed_bytes!("03000000") },
            deneb: Fork { epoch: 269568, fork_version: fixed_bytes!("04000000") },
            electra: Fork { epoch: 364032, fork_version: fixed_bytes!("05000000") },
            fulu: Fork { epoch: 411392, fork_version: fixed_bytes!("06000000") },
        },
        // article의 execution fork timestamp
        execution_forks: EthereumForkSchedule::mainnet(),
        // article의 checkpoint age policy
        max_checkpoint_age: 1_209_600, // 14 days
        #[cfg(not(target_arch = "wasm32"))]
        data_dir: Some(data_dir(Network::Mainnet)),
        ..std::default::Default::default()
    }
}
