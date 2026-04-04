import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('validator/client', [
    f('sync_committee.go — SubmitSyncCommitteeMessage()', 'validator/client/sync_committee.go', 'submit-sync-msg'),
  ]),
  d('beacon-chain/core/altair', [
    f('sync_committee.go — ProcessSyncAggregate()', 'core/altair/sync_committee.go', 'process-sync-aggregate'),
  ]),
]);
