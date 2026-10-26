import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const d = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const alloyPrimitivesTree: FileNode = d("alloy-primitives", [
  d("src", [
    f("aliases.rs · B256 / U256", "alloy-primitives/src/aliases.rs", "primitives-u256"),
    d("bits", [
      f("address.rs · Address / create", "alloy-primitives/src/bits/address.rs", "address-create"),
      f("fixed.rs · FixedBytes", "alloy-primitives/src/bits/fixed.rs", "fixed-bytes-struct"),
      f("bloom.rs · log bloom", "alloy-primitives/src/bits/bloom.rs", "bloom-accrue"),
    ]),
    d("utils", [
      f("mod.rs · keccak256", "alloy-primitives/src/utils/mod.rs", "keccak-hash"),
    ]),
  ]),
]);

export const alloyRlpTree: FileNode = d("alloy-rlp", [
  d("src", [
    f("header.rs · Header::decode", "alloy-rlp/src/header.rs", "rlp-header"),
    f("decode.rs · decode_exact", "alloy-rlp/src/decode.rs", "rlp-decode-exact"),
    f("decode.rs · integer padding", "alloy-rlp/src/decode.rs", "rlp-integer"),
  ]),
]);

export const ruintTree: FileNode = d("ruint", [
  d("src", [
    f("lib.rs · Uint limbs", "ruint/src/lib.rs", "u256-limbs"),
    f("add.rs · overflowing_add", "ruint/src/add.rs", "u256-overflowing"),
  ]),
]);
