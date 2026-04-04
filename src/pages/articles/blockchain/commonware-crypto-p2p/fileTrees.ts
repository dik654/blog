import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const commonwareTree: FileNode = d('commonware', [
  d('cryptography/src', [
    f('lib.rs — Signer trait', 'cryptography/src/lib.rs', 'signer-trait'),
    f('lib.rs — Verifier/PublicKey', 'cryptography/src/lib.rs', 'verifier-trait'),
    f('lib.rs — BatchVerifier', 'cryptography/src/lib.rs', 'batch-verifier'),
    d('ed25519', [
      f('scheme.rs — Signer', 'cryptography/src/ed25519/scheme.rs', 'ed25519-signer'),
      f('scheme.rs — Verifier', 'cryptography/src/ed25519/scheme.rs', 'ed25519-verifier'),
    ]),
    d('bls12381', [
      f('scheme.rs — Signer', 'cryptography/src/bls12381/scheme.rs', 'bls-signer'),
      f('scheme.rs — Verifier', 'cryptography/src/bls12381/scheme.rs', 'bls-verifier'),
      f('dkg.rs — Dealer', 'cryptography/src/bls12381/dkg.rs', 'dkg-dealer'),
      f('dkg.rs — Player', 'cryptography/src/bls12381/dkg.rs', 'dkg-player'),
    ]),
    d('secp256r1', [
      f('standard.rs — Signer', 'cryptography/src/secp256r1/standard.rs', 'secp256r1-signer'),
      f('recoverable.rs', 'cryptography/src/secp256r1/recoverable.rs', 'secp256r1-recover'),
    ]),
    d('handshake', [
      f('key_exchange.rs', 'cryptography/src/handshake/key_exchange.rs', 'handshake-exchange'),
    ]),
  ]),
  d('p2p/src', [
    f('lib.rs — Recipients', 'p2p/src/lib.rs', 'p2p-recipients'),
    f('lib.rs — Sender 계층', 'p2p/src/lib.rs', 'p2p-sender'),
    f('lib.rs — Blocker', 'p2p/src/lib.rs', 'p2p-blocker'),
    d('simulated', [
      f('mod.rs — Config/Link', 'p2p/src/simulated/mod.rs', 'sim-config'),
      f('mod.rs — 결정론적 실행', 'p2p/src/simulated/mod.rs', 'sim-deterministic'),
    ]),
  ]),
]);
