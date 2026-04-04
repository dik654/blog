import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const commonwareTree: FileNode = d('commonware', [
  d('consensus/src', [
    f('lib.rs — Core Traits', 'consensus/src/lib.rs', 'consensus-traits'),
  ]),
  d('consensus/src/simplex', [
    f('engine.rs — Engine 조립', 'consensus/src/simplex/engine.rs', 'engine-struct'),
    f('types.rs — Proposal/Vote/Cert', 'consensus/src/simplex/types.rs', 'proposal-type'),
    f('config.rs — Config 타이머', 'consensus/src/simplex/config.rs'),
    f('elector.rs — Leader 선출', 'consensus/src/simplex/elector.rs', 'elector-trait'),
  ]),
  d('consensus/src/simplex/actors/voter', [
    f('state.rs — State 상태 머신', 'state.rs', 'simplex-state'),
    f('round.rs — Round 뷰 상태', 'round.rs', 'round-struct'),
    f('actor.rs — select_loop!', 'actor.rs', 'engine-run'),
    f('slot.rs — ProposalSlot', 'slot.rs'),
    f('ingress.rs — Mailbox', 'ingress.rs'),
  ]),
  d('consensus/src/simplex/actors/batcher', [
    f('mod.rs — VoteTracker', 'batcher/mod.rs', 'vote-tracker'),
  ]),
  d('consensus/src/simplex/actors/resolver', [
    f('mod.rs — 인증서 Fetch', 'resolver/mod.rs'),
  ]),
  d('consensus/threshold_simplex', [
    f('DKG & Threshold', 'threshold_simplex', 'threshold-dkg'),
  ]),
]);
