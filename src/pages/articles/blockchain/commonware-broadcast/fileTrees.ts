import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const commonwareTree: FileNode = d('commonware', [
  d('broadcast/src', [
    f('lib.rs — Broadcaster trait', 'broadcast/src/lib.rs', 'broadcaster-trait'),
    d('buffered', [
      f('engine.rs — Engine run loop', 'broadcast/src/buffered/engine.rs', 'buffered-engine'),
      f('ingress.rs — Mailbox API', 'broadcast/src/buffered/ingress.rs', 'buffered-ingress'),
    ]),
  ]),
  d('consensus/src/ordered_broadcast', [
    f('types.rs — Chunk · Parent · Node', 'consensus/ordered_broadcast/types.rs', 'ordered-types'),
    f('engine.rs — select_loop!', 'consensus/ordered_broadcast/engine.rs', 'ordered-engine'),
    f('ack_manager.rs — 서명 수집', 'consensus/ordered_broadcast/ack_manager.rs', 'ordered-ack-mgr'),
  ]),
  d('coding/src', [
    f('lib.rs — Scheme · PhasedScheme', 'coding/src/lib.rs', 'coding-scheme'),
    f('zoda/mod.rs — ZODA 구현', 'coding/src/zoda/mod.rs', 'zoda-impl'),
  ]),
]);
