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

export const rethTree: FileNode = d("reth v2.8.1", [
  d("crates/chainspec/src", [
    f("spec.rs — ChainSpec", "reth/crates/chainspec/src/spec.rs", "chainspec-struct"),
    f("spec.rs — Fork ID", "reth/crates/chainspec/src/spec.rs", "fork-id"),
    f("spec.rs — 첫 헤더", "reth/crates/chainspec/src/spec.rs", "make-genesis"),
    f("spec.rs — 메인넷", "reth/crates/chainspec/src/spec.rs", "mainnet-spec"),
    f("spec.rs — 사용자 체인", "reth/crates/chainspec/src/spec.rs", "custom-spec-build"),
    f("api.rs — 조회 경계", "reth/crates/chainspec/src/api.rs", "eth-chainspec-trait"),
  ]),
  d("crates/ethereum/hardforks/src", [
    f(
      "hardforks/mod.rs — 순서와 조회",
      "reth/crates/ethereum/hardforks/src/hardforks/mod.rs",
      "chain-hardforks",
    ),
  ]),
]);

export const alloyHardforksTree: FileNode = d("alloy-hardforks 0.4.11", [
  d("crates/hardforks/src", [
    f(
      "forkcondition.rs — 활성화 판정",
      "alloy-hardforks/crates/hardforks/src/forkcondition.rs",
      "fork-condition",
    ),
  ]),
]);
