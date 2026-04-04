import type { ComponentType } from 'react';
import FundamentalsThumbnail from './FundamentalsThumbnail';
import ZKPMathThumbnail from './ZKPMathThumbnail';
import ZKPSystemsThumbnail from './ZKPSystemsThumbnail';
import ZKPVMThumbnail from './ZKPVMThumbnail';
import MPCThumbnail from './MPCThumbnail';
import EthereumThumbnail from './EthereumThumbnail';
import EthCoreThumbnail from './EthCoreThumbnail';
import EthScalingThumbnail from './EthScalingThumbnail';
import EthPrivacyThumbnail from './EthPrivacyThumbnail';
import CosmosThumbnail from './CosmosThumbnail';
import CosmosCoreThumbnail from './CosmosCoreThumbnail';
import CosmosEVMThumbnail from './CosmosEVMThumbnail';
import BFTConsensusThumbnail from './BFTConsensusThumbnail';
import StorageChainThumbnail from './StorageChainThumbnail';
import FilecoinThumbnail from './FilecoinThumbnail';
import WalrusThumbnail from './WalrusThumbnail';
import IrysThumbnail from './IrysThumbnail';
import L1ChainsThumbnail from './L1ChainsThumbnail';
import DeepLearningThumbnail from './DeepLearningThumbnail';
import TimeSeriesThumbnail from './TimeSeriesThumbnail';
import LLMThumbnail from './LLMThumbnail';
import GenerativeThumbnail from './GenerativeThumbnail';
import AgentsThumbnail from './AgentsThumbnail';
import P2PFundamentalsThumbnail from './P2PFundamentalsThumbnail';
import DHTDiscoveryThumbnail from './DHTDiscoveryThumbnail';
import TransportThumbnail from './TransportThumbnail';
import Libp2pThumbnail from './Libp2pThumbnail';
import BitTorrentThumbnail from './BitTorrentThumbnail';
import IrohThumbnail from './IrohThumbnail';
import ContentAddressingThumbnail from './ContentAddressingThumbnail';
import CUDAGPUThumbnail from './CUDAGPUThumbnail';
import ZKAccelThumbnail from './ZKAccelThumbnail';
import TEEFoundationsThumbnail from './TEEFoundationsThumbnail';
import TEEHWThumbnail from './TEEHWThumbnail';
import TEEInfraThumbnail from './TEEInfraThumbnail';
import TEENetThumbnail from './TEENetThumbnail';

export const thumbnails: Record<string, ComponentType> = {
  // Blockchain
  'fundamentals': FundamentalsThumbnail,
  'zkp-math': ZKPMathThumbnail,
  'zkp-systems': ZKPSystemsThumbnail,
  'zkp-vm': ZKPVMThumbnail,
  'mpc': MPCThumbnail,
  'ethereum': EthereumThumbnail,
  'eth-core': EthCoreThumbnail,
  'eth-scaling': EthScalingThumbnail,
  'eth-privacy': EthPrivacyThumbnail,
  'cosmos': CosmosThumbnail,
  'cosmos-core': CosmosCoreThumbnail,
  'cosmos-evm': CosmosEVMThumbnail,
  'bft-consensus': BFTConsensusThumbnail,
  'filecoin': FilecoinThumbnail,
  'fil-overview': FilecoinThumbnail,
  'fil-proofs': StorageChainThumbnail,
  'fil-hot': StorageChainThumbnail,
  'fil-lotus': FilecoinThumbnail,
  'fil-infra': StorageChainThumbnail,
  'fil-theory': StorageChainThumbnail,
  'l1-chains': L1ChainsThumbnail,
  // AI
  'ai-foundations': DeepLearningThumbnail,
  'ai-nlp': LLMThumbnail,
  'ai-vision': GenerativeThumbnail,
  'ai-timeseries': TimeSeriesThumbnail,
  'ai-generative': GenerativeThumbnail,
  'ai-llm': LLMThumbnail,
  'ai-agents': AgentsThumbnail,
  // P2P
  'p2p-fundamentals': P2PFundamentalsThumbnail,
  'p2p-discovery': DHTDiscoveryThumbnail,
  'p2p-transport': TransportThumbnail,
  'p2p-libp2p': Libp2pThumbnail,
  'p2p-bittorrent': BitTorrentThumbnail,
  'p2p-iroh': IrohThumbnail,
  'p2p-content': ContentAddressingThumbnail,
  // GPU / TEE
  'gpu-fundamentals': CUDAGPUThumbnail,
  'zk-acceleration': ZKAccelThumbnail,
  'tee-fundamentals': TEEFoundationsThumbnail,
  'intel-sgx': TEEHWThumbnail,
  'arm-trustzone': TEEHWThumbnail,
  'amd-sev': TEEHWThumbnail,
  'tee-infra': TEEInfraThumbnail,
  'tee-net': TEENetThumbnail,
};
