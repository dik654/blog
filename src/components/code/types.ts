export interface LineNote {
  lines: [number, number];
  color: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose';
  note: string;
}

export type Lang = 'rust' | 'go' | 'python' | 'typescript' | 'c';

export interface CodeRef {
  path: string;
  code: string;
  highlight: [number, number]; // 1-indexed
  lang: Lang;
  desc?: string;
  annotations?: LineNote[];
}

export interface FileNode {
  name: string;
  type: 'dir' | 'file';
  path?: string;
  codeKey?: string;
  children?: FileNode[];
}

export interface ProjectMeta {
  id: string;
  label: string;
  badgeClass: string; // tailwind classes
}

export interface FlowNode {
  id: string;
  fn: string;
  desc: string;
  color: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate';
  detail?: string;
  codeRefKey?: string;
  children?: FlowNode[];
}
