import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const libp2pTree: FileNode = d('rust-libp2p', [
  d('swarm/src', [
    f('lib.rs', 'swarm/src/lib.rs', 'swarm-struct'),
    f('behaviour.rs', 'swarm/src/behaviour.rs', 'network-behaviour'),
    f('handler.rs', 'swarm/src/handler.rs', 'connection-handler'),
    f('connection.rs', 'swarm/src/connection.rs', 'connection-poll'),
    d('connection', [f('pool.rs', 'swarm/src/connection/pool.rs')]),
  ]),
  d('core/src', [
    f('transport.rs', 'core/src/transport.rs', 'transport-trait'),
    f('muxing.rs', 'core/src/muxing.rs'),
    f('upgrade.rs', 'core/src/upgrade.rs'),
  ]),
  d('transports', [
    d('tcp/src', [f('lib.rs', 'transports/tcp/src/lib.rs', 'tcp-transport')]),
    d('quic/src', [
      f('transport.rs', 'transports/quic/src/transport.rs', 'quic-transport'),
      f('connection.rs', 'transports/quic/src/connection.rs'),
    ]),
    d('noise/src', [
      f('lib.rs', 'transports/noise/src/lib.rs', 'noise-config'),
      f('protocol.rs', 'transports/noise/src/protocol.rs', 'noise-keypair'),
      d('io', [f('handshake.rs', 'transports/noise/src/io/handshake.rs', 'noise-handshake')]),
    ]),
  ]),
  d('muxers/yamux/src', [
    f('lib.rs', 'muxers/yamux/src/lib.rs', 'yamux-muxer'),
  ]),
  d('protocols/gossipsub/src', [
    f('behaviour.rs', 'protocols/gossipsub/src/behaviour.rs', 'gossipsub-publish'),
    f('handler.rs', 'protocols/gossipsub/src/handler.rs', 'gossipsub-handler'),
    f('config.rs', 'protocols/gossipsub/src/config.rs'),
    f('peer_score.rs', 'protocols/gossipsub/src/peer_score.rs'),
    f('types.rs', 'protocols/gossipsub/src/types.rs'),
  ]),
]);
