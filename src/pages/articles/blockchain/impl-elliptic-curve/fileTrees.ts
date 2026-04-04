import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const zkCurveTree: FileNode = d('zk_from_scratch', [
  d('crates/primitives/src/field', [
    f('fp.rs — Fp 소수체', 'field/fp.rs', 'g1-struct'),
    f('fp2.rs — Fp2 이차 확장체', 'field/fp2.rs', 'g2-struct'),
    f('fp6.rs — Fp6 삼차 확장체', 'field/fp6.rs'),
    f('fp12.rs — Fp12 타워 최상층', 'field/fp12.rs'),
  ]),
  d('crates/primitives/src/curve', [
    f('mod.rs — G1, G2, pairing re-export', 'curve/mod.rs'),
    f('g1.rs — G1 Affine/Jacobian 점 연산', 'curve/g1.rs', 'g1-struct'),
    f('g2.rs — G2 Fp2 위의 점 연산', 'curve/g2.rs', 'g2-struct'),
    f('pairing.rs — Miller loop + final exp', 'curve/pairing.rs', 'miller-loop'),
  ]),
]);
