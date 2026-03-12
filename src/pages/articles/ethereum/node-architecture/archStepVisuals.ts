import type { FC } from 'react';
import { JwtSharedSecret, JwtHttpPost, JwtVerify, EvmExecution, EngineResponse } from './archVisualsEngine';
import { SyncSlotCompare, SyncBatchRequest, SyncBlockSubmit, SyncBackfill, StorageTier0, StorageTier1, StorageTier2, StorageQuery } from './archVisualsFlow';
import { TxPoolReceive, TxPoolRpc, TxPoolBuild, TxPoolPrune } from './archVisualsTxpool';
import { ValidatorSlotAssign, ValidatorBlockTemplate, ValidatorPayloadBuild, ValidatorBLSSign, ValidatorGossip } from './archVisualsValidator';
import { BeaconBlockReceive, BeaconProcessBlock, BeaconNewPayload, BeaconValidResponse, BeaconForkChoice, BeaconStore } from './archVisualsBeacon';
import { HotColdWrite, HotColdRetain, HotColdFreeze, HotColdBlobs } from './archVisualsHotcold';
import { LibP2PSubscribe, LibP2PReceive, LibP2PDiscovery, LibP2PAttestation } from './archVisualsLibp2p';
import { EngineTreeReceive, EngineTreeEVM, EngineTreeStateTrie, EngineTreePersist, EngineTreeResponse } from './archVisualsEngineTree';
import { DevP2PHandshake, DevP2PBlockBroadcast, DevP2PTxPropagate, DevP2PPeerScore } from './archVisualsDevp2p';
import { RpcParse, RpcStorageLookup, RpcEvmSim, RpcResponse } from './archVisualsRpc';

export const stepVisuals: Record<string, FC> = {
  'validator-0': ValidatorSlotAssign,
  'validator-1': ValidatorBlockTemplate,
  'validator-2': ValidatorPayloadBuild,
  'validator-3': ValidatorBLSSign,
  'validator-4': ValidatorGossip,

  'beacon-0': BeaconBlockReceive,
  'beacon-1': BeaconProcessBlock,
  'beacon-2': BeaconNewPayload,
  'beacon-3': BeaconValidResponse,
  'beacon-4': BeaconForkChoice,
  'beacon-5': BeaconStore,

  'hotcold-0': HotColdWrite,
  'hotcold-1': HotColdRetain,
  'hotcold-2': HotColdFreeze,
  'hotcold-3': HotColdBlobs,

  'sync-0': SyncSlotCompare,
  'sync-1': SyncBatchRequest,
  'sync-2': SyncBlockSubmit,
  'sync-3': SyncBackfill,

  'libp2p-0': LibP2PSubscribe,
  'libp2p-1': LibP2PReceive,
  'libp2p-2': LibP2PDiscovery,
  'libp2p-3': LibP2PAttestation,

  'engine-0': JwtSharedSecret,
  'engine-1': JwtHttpPost,
  'engine-2': JwtVerify,
  'engine-3': EvmExecution,
  'engine-4': EngineResponse,

  'engine-tree-0': EngineTreeReceive,
  'engine-tree-1': EngineTreeEVM,
  'engine-tree-2': EngineTreeStateTrie,
  'engine-tree-3': EngineTreePersist,
  'engine-tree-4': EngineTreeResponse,

  'txpool-0': TxPoolReceive,
  'txpool-1': TxPoolRpc,
  'txpool-2': TxPoolBuild,
  'txpool-3': TxPoolPrune,

  'storage-0': StorageTier0,
  'storage-1': StorageTier1,
  'storage-2': StorageTier2,
  'storage-3': StorageQuery,

  'devp2p-0': DevP2PHandshake,
  'devp2p-1': DevP2PBlockBroadcast,
  'devp2p-2': DevP2PTxPropagate,
  'devp2p-3': DevP2PPeerScore,

  'rpc-0': RpcParse,
  'rpc-1': RpcStorageLookup,
  'rpc-2': RpcEvmSim,
  'rpc-3': RpcResponse,
};
