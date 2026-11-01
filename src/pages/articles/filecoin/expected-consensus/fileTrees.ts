import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const ecTree: FileNode = d("lotus", [
  d("chain", [
    d("types", [
      f("electionproof.go", "lotus/chain/types/electionproof.go", "ec-compute-win-count"),
      f("tipset.go", "lotus/chain/types/tipset.go", "ec-tipset-constructor"),
    ]),
    d("consensus", [
      d("filcns", [
        f("filecoin.go", "lotus/chain/consensus/filcns/filecoin.go", "ec-validate"),
        f("weight.go", "lotus/chain/consensus/filcns/weight.go", "ec-weight"),
        f("mine.go", "lotus/chain/consensus/filcns/mine.go", "ec-create"),
      ]),
    ]),
  ]),
]);
