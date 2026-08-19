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

export const ucantoTree: FileNode = d("ucanto", [
  d("packages/validator/src", [
    f(
      "capability.js — defaultDerives",
      "ucanto/packages/validator/src/capability.js",
      "ucan-attenuation",
    ),
  ]),
]);

export const w3upTree: FileNode = d("w3up", [
  d("packages/upload-api/src/blob", [
    f(
      "add.js — blobAddProvider",
      "w3up/packages/upload-api/src/blob/add.js",
      "blob-add-effects",
    ),
  ]),
]);
