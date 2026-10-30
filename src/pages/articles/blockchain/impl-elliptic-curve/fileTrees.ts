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

export const zkCurveTree: FileNode = d("arkworks · pinned sources", [
  d("algebra/ec/short_weierstrass", [
    f("mod.rs — 압축 점 decode", "algebra/ec/short_weierstrass/mod.rs", "ark-point-admission"),
    f("affine.rs — 곡선·부분군 검사", "algebra/ec/short_weierstrass/affine.rs", "ark-point-validity"),
    f("group.rs — Jacobian double", "algebra/ec/short_weierstrass/group.rs", "ark-projective-double"),
  ]),
  d("curves/bn254", [
    f("mod.rs — pairing config", "curves/bn254/mod.rs", "ark-bn254-config"),
  ]),
]);
