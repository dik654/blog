export const OFFICIAL_SOURCES = {
  ethereum: {
    consensusSpecs: {
      source: "Ethereum Consensus Specifications",
      href: "https://github.com/ethereum/consensus-specs",
    },
    beaconApi: {
      source: "Ethereum Beacon APIs",
      href: "https://github.com/ethereum/beacon-APIs",
    },
    beaconApiEvents: {
      source: "Ethereum Beacon APIs — Event Stream",
      href: "https://github.com/ethereum/beacon-APIs/blob/master/apis/eventstream/index.yaml",
    },
    engineApi: {
      source: "Ethereum Execution APIs — Engine API",
      href: "https://github.com/ethereum/execution-apis/tree/main/src/engine",
    },
    engineAuthentication: {
      source: "Ethereum Execution APIs — Authentication",
      href: "https://github.com/ethereum/execution-apis/blob/main/src/engine/authentication.md",
    },
    p2p: {
      source: "Ethereum Consensus Specifications — P2P Interface",
      href: "https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/p2p-interface.md",
    },
    ssz: {
      source: "Ethereum Consensus Specifications — SSZ",
      href: "https://github.com/ethereum/consensus-specs/blob/master/ssz/simple-serialize.md",
    },
    rlp: {
      source: "ethereum.org — Recursive-length prefix",
      href: "https://ethereum.org/developers/docs/data-structures-and-encoding/rlp/",
    },
  },
  libp2p: {
    gossipsub: {
      source: "libp2p Specifications — GossipSub v1.1",
      href: "https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md",
    },
  },
  prysm: {
    repository: {
      source: "OffchainLabs — Prysm",
      href: "https://github.com/OffchainLabs/prysm",
    },
  },
  reth: {
    repository: {
      source: "Paradigm — Reth",
      href: "https://github.com/paradigmxyz/reth",
    },
    layout: {
      source: "Reth — Repository Layout",
      href: "https://github.com/paradigmxyz/reth/blob/main/docs/repo/layout.md",
    },
    blockExecutor: {
      source: "Reth API Docs — BlockExecutor",
      href: "https://reth.rs/docs/reth_evm/block/trait.BlockExecutor.html",
    },
    payloadBuilder: {
      source: "Reth API Docs — Payload Builder",
      href: "https://reth.rs/docs/reth_basic_payload_builder/index.html",
    },
  },
  alloy: {
    primitives: {
      source: "alloy-primitives API Documentation",
      href: "https://docs.rs/alloy-primitives/latest/alloy_primitives/",
    },
  },
  filecoin: {
    lotusComponents: {
      source: "Filecoin Docs — Lotus components",
      href: "https://docs.filecoin.io/storage-providers/architecture/lotus-components",
    },
    fvm: {
      source: "Filecoin Docs — The Filecoin Virtual Machine",
      href: "https://docs.filecoin.io/smart-contracts/fundamentals/the-fvm",
    },
    actors: {
      source: "Filecoin Docs — Actors",
      href: "https://docs.filecoin.io/basics/the-blockchain/actors",
    },
    pdp: {
      source: "FilOzone — PDP contracts and design",
      href: "https://github.com/FilOzone/pdp",
    },
    onchainCloud: {
      source: "Filecoin Onchain Cloud Docs — Architecture",
      href: "https://docs.filecoin.cloud/core-concepts/architecture/",
    },
    pay: {
      source: "Filecoin Onchain Cloud Docs — Filecoin Pay",
      href: "https://docs.filecoin.cloud/core-concepts/filecoin-pay-overview/",
    },
  },
  ipc: {
    architecture: {
      source: "InterPlanetary Consensus — Architecture",
      href: "https://docs.ipc.space/overview/architecture",
    },
    parentChild: {
      source: "InterPlanetary Consensus — Parent-child interactions",
      href: "https://docs.ipc.space/concepts/subnets/parent-child-interactions",
    },
    bottomUp: {
      source: "InterPlanetary Consensus — Bottom-up checkpoints",
      href: "https://docs.ipc.space/specifications/bottom-up-interaction",
    },
  },
  cometbft: {
    repository: {
      source: "CometBFT — Source repository",
      href: "https://github.com/cometbft/cometbft",
    },
    consensus: {
      source: "CometBFT Specification — Byzantine Consensus Algorithm",
      href: "https://docs.cosmos.network/cometbft/latest/spec/consensus/Byzantine-Consensus-Algorithm.md",
    },
    abci: {
      source: "CometBFT Specification — ABCI 2.0",
      href: "https://docs.cosmos.network/cometbft/latest/spec/abci/Overview",
    },
  },
} as const;
