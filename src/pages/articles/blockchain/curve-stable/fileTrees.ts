import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({ name, type: "file", path, codeKey });
const dir = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const curveStableTree: FileNode = dir("stableswap-ng · 2abe778f", [
  dir("contracts/main", [
    file("CurveStableSwapNG.vy · exchange", "contracts/main/CurveStableSwapNG.vy", "curve-exchange"),
    file("CurveStableSwapNG.vy · rates/xp", "contracts/main/CurveStableSwapNG.vy", "curve-normalize"),
    file("CurveStableSwapNG.vy · D/y", "contracts/main/CurveStableSwapNG.vy", "curve-invariant"),
    file("CurveStableSwapNG.vy · output", "contracts/main/CurveStableSwapNG.vy", "curve-output"),
    file("CurveStableSwapNG.vy · A ramp", "contracts/main/CurveStableSwapNG.vy", "curve-ramp-a"),
  ]),
  dir("tests", [
    file("plain pool fixture · exchange test", "tests/fixtures · tests/pools/exchange/test_exchange.py", "curve-fixture"),
  ]),
]);
