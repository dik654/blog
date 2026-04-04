import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const zkHashTree: FileNode = d('zk_from_scratch', [
  d('crates/primitives/src/hash', [
    f('mod.rs — re-export', 'hash/mod.rs', 'poseidon-hash'),
    f('poseidon.rs — Poseidon 해시 함수', 'hash/poseidon.rs', 'poseidon-permutation'),
  ]),
  f('merkle.rs — Sparse Merkle Tree', 'merkle.rs', 'merkle-tree'),
  f('commitment.rs — 해시 기반 커밋먼트', 'commitment.rs', 'commitment'),
  d('crates/primitives/src/circuits', [
    f('mod.rs — 회로 가젯 모듈', 'circuits/mod.rs', 'circuit-mod'),
    f('poseidon.rs — Poseidon R1CS 회로', 'circuits/poseidon.rs', 'poseidon-circuit'),
    f('merkle.rs — Merkle proof 검증 회로', 'circuits/merkle.rs', 'merkle-circuit'),
  ]),
]);
