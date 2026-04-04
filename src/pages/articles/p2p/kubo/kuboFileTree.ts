import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const kuboTree: FileNode = d('kubo', [
  d('core', [
    f('core.go', 'core/core.go', 'kubo-ipfsnode'),
    f('builder.go', 'core/builder.go', 'kubo-newnode'),
    d('node', [
      f('builder.go', 'core/node/builder.go', 'kubo-buildcfg'),
      f('groups.go', 'core/node/groups.go', 'kubo-ipfs-fx'),
      f('bitswap.go', 'core/node/bitswap.go', 'kubo-bitswap-create'),
      f('storage.go', 'core/node/storage.go', 'kubo-storage-ctor'),
      f('provider.go', 'core/node/provider.go'),
    ]),
    d('corehttp', [
      f('corehttp.go', 'core/corehttp/corehttp.go', 'kubo-serve-option'),
      f('gateway.go', 'core/corehttp/gateway.go', 'kubo-gateway-option'),
    ]),
    d('coreapi', [
      f('pin.go', 'core/coreapi/pin.go', 'kubo-pin-add'),
    ]),
  ]),
  d('routing', [
    f('composer.go', 'routing/composer.go', 'kubo-composer'),
    f('delegated.go', 'routing/delegated.go', 'kubo-parse-routing'),
    f('wrapper.go', 'routing/wrapper.go', 'kubo-http-wrapper'),
  ]),
  d('gc', [
    f('gc.go', 'gc/gc.go', 'kubo-gc-main'),
  ]),
  d('config', [
    f('config.go', 'config/config.go', 'kubo-config-struct'),
    f('routing.go', 'config/routing.go', 'kubo-routing-config'),
  ]),
]);
