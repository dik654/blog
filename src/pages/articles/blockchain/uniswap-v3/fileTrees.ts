import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({ name, type: "file", path, codeKey });
const dir = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const uniswapV3Tree: FileNode = dir("v3-core · v1.0.0 · e3589b1", [
  dir("contracts", [
    file("UniswapV3Pool.sol", "contracts/UniswapV3Pool.sol", "v3-swap-loop"),
    dir("libraries", [
      file("SwapMath.sol", "contracts/libraries/SwapMath.sol", "v3-compute-step"),
      file("Tick.sol", "contracts/libraries/Tick.sol", "v3-tick-cross"),
      file("Position.sol", "contracts/libraries/Position.sol", "v3-position-update"),
    ]),
  ]),
]);
