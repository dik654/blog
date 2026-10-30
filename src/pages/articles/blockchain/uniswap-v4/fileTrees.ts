import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({ name, type: "file", path, codeKey });
const dir = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const uniswapV4Tree: FileNode = dir("v4-core · v4.0.0 · e50237c", [
  dir("src", [
    file("PoolManager.sol · unlock", "src/PoolManager.sol", "v4-unlock"),
    file("PoolManager.sol · swap", "src/PoolManager.sol", "v4-swap-account"),
    file("PoolManager.sol · settle/take", "src/PoolManager.sol", "v4-settle-take"),
    dir("types", [
      file("PoolKey.sol · PoolId.sol", "src/types/PoolKey.sol · src/types/PoolId.sol", "v4-pool-key"),
    ]),
    dir("libraries", [
      file("Hooks.sol", "src/libraries/Hooks.sol", "v4-hook-flags"),
    ]),
    dir("test", [
      file("PoolSwapTest.sol", "src/test/PoolSwapTest.sol", "v4-router-settlement"),
    ]),
  ]),
]);
