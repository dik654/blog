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

export const prysmTree: FileNode = d("prysm v7.3.1 @ 96d418cd", [
  d("validator/client", [
    f("runner.go — slot loop", "validator/client/runner.go", "slot-runner"),
    f("validator.go — RolesAt", "validator/client/validator.go", "roles-at"),
    f(
      "attest.go — due wait",
      "validator/client/attest.go",
      "attestation-wait",
    ),
    f(
      "attest.go — SubmitAttestation",
      "validator/client/attest.go",
      "attestation-pipeline",
    ),
    f(
      "attest.go — signAtt",
      "validator/client/attest.go",
      "sign-attestation",
    ),
  ]),
  d("validator/keymanager", [
    f("types.go — interface", "validator/keymanager/types.go", "keymanager-contract"),
    f(
      "local/keymanager.go — Sign",
      "validator/keymanager/local/keymanager.go",
      "local-sign",
    ),
    f(
      "remote-web3signer/keymanager.go — Sign",
      "validator/keymanager/remote-web3signer/keymanager.go",
      "remote-sign",
    ),
  ]),
  d("validator/db/kv", [
    f(
      "attester_protection.go — SlashableAttestationCheck",
      "validator/db/kv/attester_protection.go",
      "slashable-attestation",
    ),
  ]),
]);
