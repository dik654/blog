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

export const prysmTree: FileNode = d("prysm", [
  d("crypto/bls/blst", [
    f(
      "public_key.go — PublicKeyFromBytes()",
      "crypto/bls/blst/public_key.go",
      "bls-point-validation",
    ),
    f("secret_key.go — Sign()", "crypto/bls/blst/secret_key.go", "bls-sign-verify"),
    f("signature.go — Verify()", "crypto/bls/blst/signature.go", "bls-sign-verify"),
    f(
      "signature.go — FastAggregateVerify()",
      "crypto/bls/blst/signature.go",
      "bls-fast-aggregate",
    ),
    f(
      "signature.go — VerifyMultipleSignatures()",
      "crypto/bls/blst/signature.go",
      "bls-multiple-verify",
    ),
  ]),
  d("crypto/bls", [
    f(
      "signature_batch.go — VerifyVerbosely()",
      "crypto/bls/signature_batch.go",
      "bls-verbose-fallback",
    ),
  ]),
]);
