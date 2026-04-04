import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('validator/client', [
    f('attest.go — SubmitAttestation()', 'validator/client/attest.go', 'submit-attestation'),
  ]),
  d('beacon-chain/operations/attestations', [
    f('pool.go — SaveAggregatedAttestation()', 'operations/attestations/pool.go', 'attestation-pool'),
    f('pool.go — ComputeSubnet 참조', 'operations/attestations/pool.go', 'compute-subnet'),
  ]),
]);
