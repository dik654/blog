import type { FileNode } from "@/components/code/types";

export const hyperplonkTree: FileNode =
  {
    name: "hyperplonk",
    type: "dir",
    children: [
      {
        name: "hyperplonk/src",
        type: "dir",
        children: [
          { name: "custom_gate.rs", type: "file", path: "hyperplonk/src/custom_gate.rs:9–44", codeKey: "custom-gate" },
          { name: "snark.rs · gate fixture", type: "file", path: "hyperplonk/src/snark.rs:636–655", codeKey: "e2e-gate" },
          { name: "snark.rs · proof paths", type: "file", path: "hyperplonk/src/snark.rs:687–746", codeKey: "e2e-paths" },
        ],
      },
      {
        name: "subroutines/src/poly_iop",
        type: "dir",
        children: [
          { name: "zero_check/mod.rs", type: "file", path: "subroutines/src/poly_iop/zero_check/mod.rs:69–120", codeKey: "zero-check" },
          { name: "sum_check/mod.rs", type: "file", path: "subroutines/src/poly_iop/sum_check/mod.rs:154–208", codeKey: "sumcheck" },
        ],
      },
    ],
  };
