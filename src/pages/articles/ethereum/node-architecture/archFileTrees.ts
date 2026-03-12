export interface FileNode {
  name: string;
  type: 'dir' | 'file';
  path?: string;     // full path — matches CodeRef.path for files
  codeKey?: string;  // key in codeRefs → makes file clickable
  children?: FileNode[];
}

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

/* ── Lighthouse ─────────────────────────────────────────────────── */
export const lighthouseTree: FileNode = d('lighthouse', [
  d('beacon_node', [
    d('beacon_chain/src', [
      f('beacon_chain.rs',      'lighthouse/beacon_node/beacon_chain/src/beacon_chain.rs',     'beacon-1'),
      f('fork_choice.rs',       'lighthouse/beacon_node/beacon_chain/src/fork_choice.rs'),
      f('block_verification.rs','lighthouse/beacon_node/beacon_chain/src/block_verification.rs'),
      f('state_advance_timer.rs','lighthouse/beacon_node/beacon_chain/src/state_advance_timer.rs'),
    ]),
    d('execution_layer/src/engine_api', [
      f('http.rs',   'lighthouse/beacon_node/execution_layer/src/engine_api/http.rs', 'engine-0'),
      f('json_structures.rs', 'lighthouse/beacon_node/execution_layer/src/engine_api/json_structures.rs'),
    ]),
    d('network/src', [
      f('service.rs', 'lighthouse/beacon_node/network/src/service.rs', 'libp2p-0'),
      d('network_beacon_processor', [
        f('gossip_methods.rs', 'lighthouse/beacon_node/network/src/network_beacon_processor/gossip_methods.rs', 'beacon-0'),
        f('rpc_methods.rs',    'lighthouse/beacon_node/network/src/network_beacon_processor/rpc_methods.rs'),
      ]),
      d('sync', [
        f('manager.rs',    'lighthouse/beacon_node/network/src/sync/manager.rs', 'sync-0'),
        f('range_sync/mod.rs',  'lighthouse/beacon_node/network/src/sync/range_sync/mod.rs'),
        f('backfill_sync.rs',   'lighthouse/beacon_node/network/src/sync/backfill_sync.rs'),
      ]),
    ]),
    d('store/src', [
      f('hot_cold_store.rs', 'lighthouse/beacon_node/store/src/hot_cold_store.rs', 'hotcold-0'),
      f('chunked_vector.rs', 'lighthouse/beacon_node/store/src/chunked_vector.rs'),
      f('blob_sidecar.rs',   'lighthouse/beacon_node/store/src/blob_sidecar.rs'),
    ]),
  ]),
  d('validator_client', [
    d('validator_services/src', [
      f('duties_service.rs',  'lighthouse/validator_client/validator_services/src/duties_service.rs',  'validator-0'),
      f('block_service.rs',   'lighthouse/validator_client/validator_services/src/block_service.rs'),
      f('attestation_service.rs', 'lighthouse/validator_client/validator_services/src/attestation_service.rs'),
    ]),
    d('validator_store/src', [
      f('lib.rs', 'lighthouse/validator_client/validator_store/src/lib.rs', 'validator-3'),
    ]),
  ]),
]);

/* ── Reth ────────────────────────────────────────────────────────── */
export const rethTree: FileNode = d('reth/crates', [
  d('engine/tree/src/tree', [
    f('mod.rs',        'reth/crates/engine/tree/src/tree/mod.rs',        'engine-tree-0'),
    f('payload.rs',    'reth/crates/engine/tree/src/tree/payload.rs'),
    f('persistence.rs','reth/crates/engine/tree/src/tree/persistence.rs'),
  ]),
  d('net/network/src', [
    d('session', [
      f('active.rs',  'reth/crates/net/network/src/session/active.rs',  'devp2p-0'),
      f('handle.rs',  'reth/crates/net/network/src/session/handle.rs'),
    ]),
    d('transactions', [
      f('mod.rs',       'reth/crates/net/network/src/transactions/mod.rs', 'txpool-0'),
      f('fetcher.rs',   'reth/crates/net/network/src/transactions/fetcher.rs'),
      f('broadcast.rs', 'reth/crates/net/network/src/transactions/broadcast.rs'),
    ]),
    f('peers.rs',    'reth/crates/net/network/src/peers.rs'),
    f('manager.rs',  'reth/crates/net/network/src/manager.rs'),
  ]),
  d('rpc/rpc/src/eth/helpers', [
    f('transaction.rs', 'reth/crates/rpc/rpc/src/eth/helpers/transaction.rs', 'txpool-1'),
    f('call.rs',        'reth/crates/rpc/rpc/src/eth/helpers/call.rs',        'rpc-2'),
    f('fees.rs',        'reth/crates/rpc/rpc/src/eth/helpers/fees.rs'),
    f('state.rs',       'reth/crates/rpc/rpc/src/eth/helpers/state.rs'),
    f('block.rs',       'reth/crates/rpc/rpc/src/eth/helpers/block.rs'),
  ]),
  d('rpc/rpc-builder/src', [
    f('lib.rs', 'reth/crates/rpc/rpc-builder/src/lib.rs', 'rpc-0'),
    f('config.rs', 'reth/crates/rpc/rpc-builder/src/config.rs'),
  ]),
  d('storage/provider/src/providers/database', [
    f('provider.rs',   'reth/crates/storage/provider/src/providers/database/provider.rs', 'storage-0'),
    f('state.rs',      'reth/crates/storage/provider/src/providers/database/state.rs'),
  ]),
  d('transaction-pool/src', [
    f('pool.rs',       'reth/crates/transaction-pool/src/pool.rs'),
    f('validate.rs',   'reth/crates/transaction-pool/src/validate.rs'),
    f('ordering.rs',   'reth/crates/transaction-pool/src/ordering.rs'),
  ]),
]);
