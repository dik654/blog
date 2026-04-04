import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const irysTree: FileNode = d('crates', [
  d('vdf/src', [
    f('lib.rs', 'crates/vdf/src/lib.rs', 'irys-vdf-sha'),
    f('vdf.rs', 'crates/vdf/src/vdf.rs', 'irys-vdf-run'),
  ]),
  d('packing/src', [
    f('lib.rs', 'crates/packing/src/lib.rs', 'irys-unpack'),
  ]),
  d('p2p/src', [
    f('peer_network_service.rs', 'crates/p2p/src/peer_network_service.rs', 'irys-peer-service'),
  ]),
  d('api-server/src', [
    f('lib.rs', 'crates/api-server/src/lib.rs', 'irys-api-routes'),
  ]),
]);
