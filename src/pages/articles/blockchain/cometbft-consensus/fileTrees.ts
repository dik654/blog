import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftConsensusTree: FileNode = d('cometbft', [
  d('consensus', [
    f('state.go — receiveRoutine()', 'consensus/state.go', 'receive-routine'),
    f('state.go — handleMsg()', 'consensus/state.go', 'handle-msg'),
    f('state.go — handleTimeout()', 'consensus/state.go', 'handle-timeout'),
    f('state.go — enterNewRound()', 'consensus/state.go', 'enter-new-round'),
    f('state.go — enterPropose()', 'consensus/state.go', 'enter-propose'),
    f('state.go — enterPrevote()', 'consensus/state.go', 'enter-prevote'),
    f('state.go — enterPrecommit()', 'consensus/state.go', 'enter-precommit'),
    f('state.go — enterCommit()', 'consensus/state.go', 'enter-commit'),
    f('state.go — tryAddVote()', 'consensus/state.go', 'try-add-vote'),
    f('state.go — addVote()', 'consensus/state.go', 'add-vote'),
  ]),
]);
