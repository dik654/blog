import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftTypesTree: FileNode = d('cometbft', [
  d('types', [
    f('block.go — Block · Header · Hash() · MakePartSet()', 'types/block.go', 'block-struct'),
    f('vote.go — Vote · VoteSet · AddVote()', 'types/vote.go', 'vote-struct'),
    f('validator.go — Validator · ValidatorSet · Proposer', 'types/validator.go', 'validator-struct'),
    f('evidence.go — DuplicateVoteEvidence · Verify()', 'types/evidence.go', 'evidence-struct'),
    f('tx.go — Tx · Txs · Hash()', 'types/tx.go', 'tx-hash'),
  ]),
]);
