import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTree: FileNode = d('reth', [
  d('alloy-rlp', [
    f('Encodable / Decodable trait', 'alloy-rlp/src/lib.rs', 'rlp-traits'),
    f('derive(RlpEncodable)', 'alloy-rlp/src/lib.rs', 'rlp-derive'),
    f('encode_fixed_size()', 'alloy-rlp/src/lib.rs', 'rlp-fixed'),
    f('Header::decode()', 'alloy-rlp/src/lib.rs', 'rlp-header'),
    f('decode_header()', 'alloy-rlp/src/decode.rs', 'rlp-decode-header'),
    f('Error 타입', 'alloy-rlp/src/error.rs', 'rlp-decode-errors'),
    f('decode_exact()', 'alloy-rlp/src/decode.rs', 'rlp-decode-exact'),
  ]),
  d('alloy-primitives', [
    f('Address · B256', 'alloy-primitives/src/lib.rs', 'primitives-addr'),
    f('U256 (4×u64 limbs)', 'alloy-primitives/src/lib.rs', 'primitives-u256'),
    f('FixedBytes<N> 구조체', 'alloy-primitives/src/bits/fixed.rs', 'fixed-bytes-struct'),
    f('Deref / AsRef 체인', 'alloy-primitives/src/bits/fixed.rs', 'fixed-bytes-deref'),
    f('Address / B256 뉴타입', 'alloy-primitives/src/bits/address.rs', 'fixed-bytes-addr'),
    f('keccak256()', 'alloy-primitives/src/bits/keccak.rs', 'keccak-hash'),
    f('create_address()', 'alloy-primitives/src/bits/address.rs', 'create-address'),
    f('create2_address()', 'alloy-primitives/src/bits/address.rs', 'create2-address'),
    f('Bloom 구조체', 'alloy-primitives/src/bloom.rs', 'bloom-struct'),
    f('Bloom::accrue()', 'alloy-primitives/src/bloom.rs', 'bloom-accrue'),
    f('Bloom::contains()', 'alloy-primitives/src/bloom.rs', 'bloom-contains'),
  ]),
  d('ruint', [
    f('U256 limb 구조', 'ruint/src/lib.rs', 'u256-limbs'),
    f('overflowing_add()', 'ruint/src/algorithms/add.rs', 'u256-overflowing'),
    f('checked / saturating', 'ruint/src/algorithms/add.rs', 'u256-checked'),
  ]),
]);
