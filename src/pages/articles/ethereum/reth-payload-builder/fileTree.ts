import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});
const dir = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const rethPayloadBuilderV281Tree: FileNode = dir("reth v2.8.1", [
  dir("crates/engine/tree/src/tree", [
    file("mod.rs · payload handoff", "reth-v2.8.1/crates/engine/tree/src/tree/mod.rs", "engine-handoff"),
  ]),
  dir("crates/payload", [
    dir("primitives/src", [
      file("traits.rs · payload ID", "reth-v2.8.1/crates/payload/primitives/src/traits.rs", "payload-id"),
    ]),
    dir("basic/src", [
      file("lib.rs · job lifecycle", "reth-v2.8.1/crates/payload/basic/src/lib.rs#job", "job-lifecycle"),
      file("lib.rs · job poll", "reth-v2.8.1/crates/payload/basic/src/lib.rs#poll", "job-poll"),
    ]),
    dir("builder/src", [
      file("service.rs · resolve", "reth-v2.8.1/crates/payload/builder/src/service.rs", "resolve"),
    ]),
  ]),
  dir("crates/ethereum/payload/src", [
    file("lib.rs · gas selection", "reth-v2.8.1/crates/ethereum/payload/src/lib.rs#gas", "gas-selection"),
    file("lib.rs · execution and value", "reth-v2.8.1/crates/ethereum/payload/src/lib.rs#execute", "execution-selection"),
  ]),
]);
