import type { FileNode } from "@/components/code/types";

export const giwaNodeTree: FileNode = {
  name: "giwa-node",
  type: "dir",
  children: [
    {
      name: "docker-compose.yaml — node 구성",
      type: "file",
      path: "giwa-node/docker-compose.yaml",
      codeKey: "giwa-node-compose",
    },
  ],
};
