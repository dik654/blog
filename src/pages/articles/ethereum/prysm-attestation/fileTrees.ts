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

export const prysmTree: FileNode = d("prysm-v7.3.1", [
  d("validator/client", [
    f(
      "attest.go — SubmitAttestation()",
      "validator/client/attest.go",
      "submit-attestation",
    ),
  ]),
  d("beacon-chain/operations/attestations", [
    f(
      "pool.go — owner contract",
      "operations/attestations/pool.go",
      "pool-interface",
    ),
    f(
      "kv/aggregated.go — save/merge",
      "operations/attestations/kv/aggregated.go",
      "attestation-pool",
    ),
  ]),
  d("beacon-chain/core/helpers", [
    f(
      "attestation.go — subnet",
      "core/helpers/attestation.go",
      "compute-subnet",
    ),
  ]),
]);
