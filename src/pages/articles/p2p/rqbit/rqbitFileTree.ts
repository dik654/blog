import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rqbitTree: FileNode = d('rqbit/crates', [
  d('librqbit/src', [
    f('session.rs', 'librqbit/src/session.rs', 'session'),
    f('chunk_tracker.rs', 'librqbit/src/chunk_tracker.rs', 'chunk-tracker'),
    f('peer_connection.rs', 'librqbit/src/peer_connection.rs', 'peer-connection'),
    f('piece_tracker.rs', 'librqbit/src/piece_tracker.rs', 'piece-tracker'),
    d('torrent_state', [
      f('mod.rs', 'librqbit/src/torrent_state/mod.rs', 'managed-torrent-state'),
      d('live', [
        f('mod.rs', 'librqbit/src/torrent_state/live/mod.rs'),
        d('peer', [
          f('mod.rs', 'librqbit/src/torrent_state/live/peer/mod.rs', 'peer-state'),
        ]),
        d('peers', [
          f('mod.rs', 'librqbit/src/torrent_state/live/peers/mod.rs'),
        ]),
      ]),
    ]),
  ]),
  d('librqbit_core/src', [
    f('hash_id.rs', 'librqbit_core/src/hash_id.rs', 'id20'),
    f('lengths.rs', 'librqbit_core/src/lengths.rs', 'lengths'),
    f('torrent_metainfo.rs', 'librqbit_core/src/torrent_metainfo.rs'),
    f('magnet.rs', 'librqbit_core/src/magnet.rs'),
  ]),
  d('dht/src', [
    f('routing_table.rs', 'dht/src/routing_table.rs', 'routing-table'),
    f('dht.rs', 'dht/src/dht.rs', 'dht-recursive-request'),
    f('bprotocol.rs', 'dht/src/bprotocol.rs'),
    f('peer_store.rs', 'dht/src/peer_store.rs'),
  ]),
  d('peer_binary_protocol/src', [
    f('lib.rs', 'peer_binary_protocol/src/lib.rs', 'message-enum'),
    d('extended', [
      f('mod.rs', 'peer_binary_protocol/src/extended/mod.rs'),
      f('handshake.rs', 'peer_binary_protocol/src/extended/handshake.rs'),
      f('ut_metadata.rs', 'peer_binary_protocol/src/extended/ut_metadata.rs'),
    ]),
  ]),
  d('tracker_comms/src', [
    f('tracker_comms.rs', 'tracker_comms/src/tracker_comms.rs'),
  ]),
]);
