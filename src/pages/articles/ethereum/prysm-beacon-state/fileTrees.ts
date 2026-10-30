import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm v7.3.1", [
  d("beacon-chain/state/state-native", [
    f("state_trie.go — Copy", "beacon-chain/state/state-native/state_trie.go", "state-copy"),
    f("setters_validator.go — balance update", "beacon-chain/state/state-native/setters_validator.go", "balance-update"),
    f("state_trie.go — HashTreeRoot", "beacon-chain/state/state-native/state_trie.go", "state-root"),
  ]),
  d("beacon-chain/state/fieldtrie", [
    f("field_trie.go — RecomputeTrie", "beacon-chain/state/fieldtrie/field_trie.go", "field-trie-recompute"),
  ]),
  d("beacon-chain/core/altair", [
    f("upgrade.go — UpgradeToAltair", "beacon-chain/core/altair/upgrade.go", "altair-upgrade"),
  ]),
]);
