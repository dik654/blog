import type { FileNode } from "@/components/code/types";

export const layaTrees: Record<string, FileNode> = {
  laya: {
    name: "laya",
    type: "dir",
    children: [
      { name: "laya/common.py", path: "laya/laya/common.py", type: "file", codeKey: "build-head" },
      { name: "laya/agent.py", path: "laya/laya/agent.py", type: "file", codeKey: "decode-answers" },
      { name: "laya/train.py", path: "laya/laya/train.py", type: "file", codeKey: "rlcd-loss" },
      { name: "laya/calibrate.py", path: "laya/laya/calibrate.py", type: "file", codeKey: "fit-temperature" },
      { name: "laya/router.py", path: "laya/laya/router.py", type: "file", codeKey: "route" },
    ],
  },
  "laya-hf": {
    name: "laya-hf",
    type: "dir",
    children: [
      { name: "README.md (model card)", path: "laya-hf/README.md", type: "file", codeKey: "card-limits" },
      { name: "rl_agent_config.json", path: "laya-hf/rl_agent_config.json", type: "file", codeKey: "shipped-temps" },
    ],
  },
};
