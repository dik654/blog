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

export const cometbftCryptoTree: FileNode = d("cometbft @ 0880b4d3", [
  d("types", [
    f("tx.go — transaction root와 proof", "types/tx.go", "tx-merkle-proof"),
    f("block.go — DataHash와 Header hash", "types/block.go", "header-datahash"),
    f("canonical.go — canonical vote", "types/canonical.go", "vote-sign-bytes"),
    f("vote.go — sign bytes와 verify", "types/vote.go", "vote-verify"),
  ]),
  d("crypto", [
    d("ed25519", [
      f(
        "ed25519.go — Address · VerifySignature",
        "crypto/ed25519/ed25519.go",
        "ed25519-contract",
      ),
    ]),
    d("merkle", [
      f("tree.go · hash.go — tree와 domain", "crypto/merkle/tree.go", "merkle-domains"),
      f("proof.go — Proof.Verify", "crypto/merkle/proof.go", "proof-verify"),
    ]),
    d("tmhash", [
      f("hash.go — Sum · SumTruncated", "crypto/tmhash/hash.go", "tmhash-lengths"),
    ]),
  ]),
]);
