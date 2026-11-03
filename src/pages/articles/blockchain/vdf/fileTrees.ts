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

export const chiaVdfTree: FileNode = d("chiavdf", [
  d("src", [
    f("vdf.h — 반복 제곱 evaluation", "src/vdf.h", "vdf-repeated-square"),
    f(
      "proof_common.h — challenge prime B",
      "src/proof_common.h",
      "vdf-get-b",
    ),
    f(
      "verifier.h — r·proof 검증식",
      "src/verifier.h",
      "vdf-wesolowski-verify",
    ),
  ]),
]);
