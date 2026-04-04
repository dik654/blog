import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const zkFieldTree: FileNode = d('zk_from_scratch', [
  d('crates/primitives/src/field', [
    f('mod.rs — adc, sbb, mac + define_prime_field! 매크로', 'field/mod.rs', 'fp-helpers'),
    f('fp.rs — Fp 소수체 (BN254 base field)', 'field/fp.rs', 'fp-struct'),
    f('fr.rs — Fr 스칼라체 (curve order)', 'field/fr.rs', 'fr-struct'),
    f('fp2.rs — Fp2 이차 확장체', 'field/fp2.rs', 'fp2-struct'),
    f('fp6.rs — Fp6 삼차 확장체', 'field/fp6.rs', 'fp6-struct'),
    f('fp12.rs — Fp12 타워 최상층', 'field/fp12.rs', 'fp12-struct'),
  ]),
]);
