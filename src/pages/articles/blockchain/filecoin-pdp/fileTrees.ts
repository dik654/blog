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

export const pdpTree: FileNode = d("pdp", [
  d("src", [
    f(
      "PDPVerifier.sol — challenge·proof 검증",
      "pdp/src/PDPVerifier.sol",
      "pdp-verifier",
    ),
    f(
      "SimplePDPService.sol — window·fault",
      "pdp/src/SimplePDPService.sol",
      "pdp-schedule",
    ),
  ]),
]);
