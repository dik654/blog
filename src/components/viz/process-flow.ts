import type { ReactNode } from "react";

export interface ProcessNode {
  id: string;
  label: string;
  sub?: string;
  color?: string;
}

export interface ProcessScene {
  id: string;
  label: string;
  body?: ReactNode;
  eyebrow?: string;
  nodes: readonly ProcessNode[];
  note?: string;
  codeRef?: string;
  codeLabel?: string;
}

export function defineProcessScenes<const T extends readonly ProcessScene[]>(
  scenes: T,
): T {
  const sceneIds = new Set<string>();
  for (const scene of scenes) {
    if (sceneIds.has(scene.id)) {
      throw new Error(`Duplicate process scene id: ${scene.id}`);
    }
    sceneIds.add(scene.id);
    if (scene.nodes.length < 2 || scene.nodes.length > 4) {
      throw new Error(
        `Process scene ${scene.id} must contain two to four nodes.`,
      );
    }
    const nodeIds = new Set<string>();
    for (const node of scene.nodes) {
      if (nodeIds.has(node.id)) {
        throw new Error(`Duplicate node id in ${scene.id}: ${node.id}`);
      }
      nodeIds.add(node.id);
    }
  }
  return scenes;
}
