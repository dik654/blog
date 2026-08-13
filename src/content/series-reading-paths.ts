export interface SeriesReadingGroup {
  label: string;
  purpose: string;
  slugs: readonly string[];
}

export interface SeriesReadingPath {
  title: string;
  question: string;
  groups: readonly SeriesReadingGroup[];
}

/**
 * 제품·클라이언트별 심층 글의 권장 순서를 한곳에서 소유합니다.
 * 표시 제목과 섹션은 Article metadata에서 읽으므로 이 파일에는 route와
 * 그룹의 의도만 둡니다.
 */
export const SERIES_READING_PATHS = {
  reth: {
    title: "Reth를 crate 목록이 아니라 node lifecycle로 읽기",
    question:
      "설정에서 시작한 노드는 블록을 받아 어디에 저장하고 어떻게 조회를 제공할까?",
    groups: [
      {
        label: "노드 조립과 규칙",
        purpose:
          "binary가 어떤 component와 chain rule을 선택하는지 먼저 잡습니다.",
        slugs: ["reth-cli", "reth-chainspec", "reth-alloy-primitives"],
      },
      {
        label: "수신과 동기화",
        purpose:
          "peer 입력이 live path와 backfill pipeline으로 나뉘는 경계를 봅니다.",
        slugs: ["reth-net", "reth-sync", "reth-pipeline"],
      },
      {
        label: "검증과 실행",
        purpose:
          "transaction 후보와 payload가 revm 실행·상태 변경으로 이어지는 순서입니다.",
        slugs: [
          "reth-txpool",
          "reth-eip1559",
          "reth-eip4844",
          "reth-payload-builder",
          "reth-block-execution",
          "reth-precompiles",
        ],
      },
      {
        label: "영속화·조회·확장",
        purpose:
          "state와 immutable history의 저장 위치, provider/RPC와 외부 확장 경계를 봅니다.",
        slugs: [
          "reth-db",
          "reth-provider",
          "reth-trie",
          "reth-rpc",
          "reth-exex",
          "reth-mev",
        ],
      },
    ],
  },
  prysm: {
    title: "Prysm을 slot 입력에서 validator duty까지 읽기",
    question:
      "gossip으로 들어온 consensus object는 어떻게 state·head·duty로 이어질까?",
    groups: [
      {
        label: "Wire format과 신뢰",
        purpose:
          "받은 byte를 consensus object로 만들고 서명·topic 규칙을 검증합니다.",
        slugs: [
          "prysm-ssz",
          "prysm-bls",
          "prysm-p2p-libp2p",
          "prysm-gossipsub",
        ],
      },
      {
        label: "Beacon state 전이",
        purpose:
          "slot·epoch·block operation이 같은 state를 어떤 순서로 바꾸는지 봅니다.",
        slugs: [
          "prysm-beacon-state",
          "prysm-slot-processing",
          "prysm-epoch-processing",
          "prysm-block-processing",
        ],
      },
      {
        label: "Head·finality·복구",
        purpose:
          "fork choice와 FFG finality, sync·DB·cache의 책임을 분리합니다.",
        slugs: [
          "prysm-forkchoice",
          "prysm-finality",
          "prysm-sync",
          "prysm-beacon-db",
          "prysm-state-cache",
        ],
      },
      {
        label: "Validator와 외부 경계",
        purpose:
          "duty 수행과 beacon/validator API, execution client handoff를 연결합니다.",
        slugs: [
          "prysm-validator-client",
          "prysm-attestation",
          "prysm-sync-committee",
          "prysm-block-proposal",
          "prysm-beacon-api",
          "prysm-engine-api",
        ],
      },
    ],
  },
  cometbft: {
    title: "CometBFT를 transaction 수신에서 app commit까지 읽기",
    question:
      "합의 엔진이 transaction 순서를 정한 뒤 애플리케이션 상태를 어떻게 확정할까?",
    groups: [
      {
        label: "메시지와 검증 기반",
        purpose:
          "block·vote·validator type과 서명·Merkle·P2P 경계를 먼저 잡습니다.",
        slugs: ["cometbft-types", "cometbft-crypto", "cometbft-p2p"],
      },
      {
        label: "후보와 합의",
        purpose:
          "CheckTx를 통과한 후보가 proposal·prevote·precommit으로 결정되는 순서입니다.",
        slugs: ["cometbft-mempool", "cometbft-consensus"],
      },
      {
        label: "ABCI++ 실행 계약",
        purpose:
          "Prepare/ProcessProposal과 FinalizeBlock이 consensus와 app을 잇는 지점을 봅니다.",
        slugs: ["cometbft-abci", "cometbft-execution"],
      },
      {
        label: "Commit된 노드 상태",
        purpose:
          "BlockStore·State·Evidence가 다음 height의 입력으로 남는 방식을 확인합니다.",
        slugs: ["cometbft-state"],
      },
    ],
  },
} as const satisfies Record<string, SeriesReadingPath>;
