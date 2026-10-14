import type { FileNode } from "@/components/code/types";

export const smoothquantTrees: Record<string, FileNode> = {
  smoothquant: {
    name: "smoothquant",
    type: "dir",
    children: [
      { name: "smoothquant/smooth.py", path: "smoothquant/smoothquant/smooth.py", type: "file", codeKey: "smooth-ln-fcs" },
      { name: "smoothquant/calibration.py", path: "smoothquant/smoothquant/calibration.py", type: "file", codeKey: "act-scales" },
      { name: "smoothquant/fake_quant.py", path: "smoothquant/smoothquant/fake_quant.py", type: "file", codeKey: "fake-quant" },
    ],
  },
};
