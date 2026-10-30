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

export const cometbftTypesTree: FileNode = d("cometbft", [
  d("types", [
    f("block.go — Block · Header · Hash() · PartSet", "types/block.go @ 0880b4d3", "block-header-struct"),
    f("vote.go — Vote · canonical sign bytes", "types/vote.go @ 0880b4d3", "vote-sign-bytes"),
    f("validation.go — Commit power 검증", "types/validation.go @ 0880b4d3", "verify-commit"),
    f(
      "validator_set.go — ValidatorSet · proposer priority",
      "types/validator_set.go @ 0880b4d3",
      "validator-set",
    ),
    f(
      "evidence.go — DuplicateVoteEvidence",
      "types/evidence.go @ 0880b4d3",
      "evidence-struct",
    ),
  ]),
  d("evidence", [
    f("verify.go — historical set · 두 signature 검증", "evidence/verify.go @ 0880b4d3", "evidence-verify"),
  ]),
]);
