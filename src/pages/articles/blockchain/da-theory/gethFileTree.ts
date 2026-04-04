import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const gethTree: FileNode = d('go-ethereum', [
  d('core', [
    d('types', [
      f('tx_blob.go — BlobTx', 'go-ethereum/core/types/tx_blob.go', 'blob-tx-struct'),
      f('tx_blob.go — BlobTxSidecar', 'go-ethereum/core/types/tx_blob.go', 'blob-sidecar'),
    ]),
    d('txpool', [
      f('validation.go — validateBlobTx()', 'go-ethereum/core/txpool/validation.go', 'blob-validate-tx'),
      f('validation.go — validateBlobSidecar()', 'go-ethereum/core/txpool/validation.go', 'blob-validate-legacy'),
    ]),
    d('vm', [
      f('eips.go — opBlobHash()', 'go-ethereum/core/vm/eips.go', 'opcode-blobhash'),
    ]),
  ]),
  d('crypto', [
    d('kzg4844', [
      f('kzg4844.go — 타입 정의', 'go-ethereum/crypto/kzg4844/kzg4844.go', 'kzg-types'),
      f('kzg4844.go — Commit/Verify', 'go-ethereum/crypto/kzg4844/kzg4844.go', 'kzg-commit-verify'),
      f('kzg4844.go — Cell Proofs', 'go-ethereum/crypto/kzg4844/kzg4844.go', 'kzg-cell-proofs'),
    ]),
  ]),
  d('consensus/misc', [
    d('eip4844', [
      f('eip4844.go — VerifyHeader()', 'go-ethereum/consensus/misc/eip4844/eip4844.go', 'blob-gas-verify'),
      f('eip4844.go — CalcExcessBlobGas()', 'go-ethereum/consensus/misc/eip4844/eip4844.go', 'blob-excess-calc'),
      f('eip4844.go — fakeExponential()', 'go-ethereum/consensus/misc/eip4844/eip4844.go', 'blob-fake-exponential'),
    ]),
  ]),
]);
