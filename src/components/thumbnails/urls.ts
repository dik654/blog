/**
 * 소분류별 썸네일 이미지 URL 매핑
 * - 프로젝트: 공식 로고 (GitHub raw / Wikimedia)
 * - 개념: Wikimedia 다이어그램/일러스트 (모두 고유, 중복 없음)
 */

const GH = 'https://raw.githubusercontent.com';
const SPOT = `${GH}/spothq/cryptocurrency-icons/master/svg/color`;
const WIKI = 'https://upload.wikimedia.org/wikipedia';

export const thumbnailUrls: Record<string, string> = {
  /* ── Blockchain ── */
  // 상위: 개념 다이어그램 / 하위: 프로젝트 로고 — 중복 없음
  'fundamentals': `${WIKI}/commons/thumb/9/98/Blockchain.svg/200px-Blockchain.svg.png`,
  'zkp-math': `${WIKI}/commons/thumb/d/da/Elliptic_curve_simple.svg/200px-Elliptic_curve_simple.svg.png`,
  'zkp-systems': `${WIKI}/commons/thumb/3/3f/Gnome-dialog-password.svg/200px-Gnome-dialog-password.svg.png`,
  'zkp-vm': `${WIKI}/commons/thumb/6/69/Full-adder_logic_diagram.svg/200px-Full-adder_logic_diagram.svg.png`,
  'mpc': `${WIKI}/commons/thumb/a/ab/Secretsharing_3-point.svg/200px-Secretsharing_3-point.svg.png`,

  // Ethereum: 상위=다이아몬드, 하위=Geth/Rollup/Privacy 각각 다른 이미지
  'ethereum': `${SPOT}/eth.svg`,
  'eth-core': `${WIKI}/commons/thumb/0/05/Ethereum_logo_2014.svg/200px-Ethereum_logo_2014.svg.png`,
  'eth-scaling': `${GH}/ethereum-optimism/ethereum-optimism.github.io/master/data/OP/logo.png`,
  'eth-privacy': `${WIKI}/commons/thumb/9/99/Zcash_logo_2019.svg/200px-Zcash_logo_2019.svg.png`,

  // Cosmos: 상위=허브 아이콘, 하위=CometBFT/Initia
  'cosmos': `${SPOT}/atom.svg`,
  'cosmos-core': `${GH}/cometbft/cometbft/main/docs/imgs/banner.svg`,
  'cosmos-evm': `${GH}/initia-labs/initia-registry/main/images/INIT.png`,

  'bft-consensus': `${WIKI}/commons/thumb/1/1b/Raft_Consensus_Algorithm_Mascot_on_transparent_background.svg/200px-Raft_Consensus_Algorithm_Mascot_on_transparent_background.svg.png`,

  // Filecoin: 상위=FIL 로고, 하위=개념별 아이콘
  'filecoin': `${SPOT}/fil.svg`,
  'fil-overview': `${SPOT}/fil.svg`,
  'fil-proofs': `${WIKI}/commons/thumb/1/12/Cloud_computing_icon.svg/200px-Cloud_computing_icon.svg.png`,
  'fil-hot': `${WIKI}/commons/thumb/1/12/Cloud_computing_icon.svg/200px-Cloud_computing_icon.svg.png`,
  'fil-lotus': `${SPOT}/fil.svg`,
  'fil-infra': `${WIKI}/commons/thumb/1/18/Ipfs-logo-1024-ice-text.png/200px-Ipfs-logo-1024-ice-text.png`,
  'fil-theory': `${WIKI}/commons/thumb/d/da/Elliptic_curve_simple.svg/200px-Elliptic_curve_simple.svg.png`,

  'l1-chains': `${SPOT}/sol.svg`,

  /* ── AI ── */
  'ai-foundations': `${WIKI}/commons/thumb/4/46/Colored_neural_network.svg/200px-Colored_neural_network.svg.png`,
  'ai-vision': `${WIKI}/commons/thumb/6/63/Typical_cnn.png/200px-Typical_cnn.png`,
  'ai-nlp': `${WIKI}/commons/thumb/8/8f/The-Transformer-model-architecture.png/200px-The-Transformer-model-architecture.png`,
  'ai-timeseries': `${WIKI}/commons/thumb/7/7e/Fourier_series_sawtooth_wave_circles_animation.gif/200px-Fourier_series_sawtooth_wave_circles_animation.gif`,
  'ai-llm': `${WIKI}/commons/thumb/0/04/ChatGPT_logo.svg/200px-ChatGPT_logo.svg.png`,
  'ai-generative': `${WIKI}/commons/thumb/8/83/Generative_adversarial_network.svg/200px-Generative_adversarial_network.svg.png`,
  'ai-agents': `${GH}/anthropics/anthropic-sdk-typescript/main/.github/logo.svg`,

  /* ── P2P ── */
  'p2p-fundamentals': `${WIKI}/commons/thumb/3/3b/UDP_encapsulation.svg/200px-UDP_encapsulation.svg.png`,
  'p2p-discovery': `${WIKI}/commons/thumb/6/63/Dht_example_SVG.svg/200px-Dht_example_SVG.svg.png`,
  'p2p-transport': `${WIKI}/commons/thumb/4/41/Tcp-vs-quic-handshake.svg/200px-Tcp-vs-quic-handshake.svg.png`,
  'p2p-libp2p': `${GH}/libp2p/js-libp2p/main/img/libp2p.png`,
  'p2p-bittorrent': `${WIKI}/commons/thumb/3/39/BitTorrent_logo.svg/200px-BitTorrent_logo.svg.png`,
  'p2p-iroh': `${GH}/n0-computer/iroh.computer/main/public/img/logo/iroh-wordmark-purple.svg`,
  'p2p-content': `${WIKI}/commons/thumb/1/18/Ipfs-logo-1024-ice-text.png/200px-Ipfs-logo-1024-ice-text.png`,
  'p2p-ipfs': `${WIKI}/commons/thumb/9/9f/IPFS_logo.svg/200px-IPFS_logo.svg.png`,

  /* ── GPU / TEE ── */
  'gpu-fundamentals': `${WIKI}/commons/thumb/b/b9/Nvidia_CUDA_Logo.jpg/200px-Nvidia_CUDA_Logo.jpg`,
  'zk-acceleration': `${WIKI}/commons/thumb/5/59/CUDA_processing_flow_%28En%29.PNG/200px-CUDA_processing_flow_%28En%29.PNG`,
  'tee-fundamentals': `${WIKI}/commons/thumb/e/eb/TPM_1.2_diagram.svg/200px-TPM_1.2_diagram.svg.png`,
  'tee-hw': `${WIKI}/commons/thumb/3/32/Intel_Security_logo.svg/200px-Intel_Security_logo.svg.png`,
  'intel-sgx': `${WIKI}/commons/thumb/0/0e/Intel_logo_%282020%2C_light_blue%29.svg/200px-Intel_logo_%282020%2C_light_blue%29.svg.png`,
  'arm-trustzone': `${WIKI}/commons/thumb/7/77/Arm_logo_2017.svg/200px-Arm_logo_2017.svg.png`,
  'amd-sev': `${WIKI}/commons/thumb/7/7c/AMD_Logo.svg/200px-AMD_Logo.svg.png`,
  'tee-infra': `${WIKI}/commons/thumb/6/68/Kerberos_protocol.svg/200px-Kerberos_protocol.svg.png`,
  'tee-net': `${WIKI}/commons/thumb/f/fc/Padlock-silver.svg/200px-Padlock-silver.svg.png`,
};
