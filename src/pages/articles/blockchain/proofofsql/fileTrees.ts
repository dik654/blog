import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const directory = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const proofOfSqlTree: FileNode = directory("sxt-proof-of-sql@f28544df", [
  directory("sql/proof_plans", [
    file("aggregate_exec_test.rs", "crates/proof-of-sql/src/sql/proof_plans/aggregate_exec_test.rs", "posql-aggregate-fixture"),
    file("aggregate_exec.rs", "crates/proof-of-sql/src/sql/proof_plans/aggregate_exec.rs", "posql-aggregate-relation"),
  ]),
  directory("sql/proof", [
    file("verifiable_query_result.rs", "crates/proof-of-sql/src/sql/proof/verifiable_query_result.rs", "posql-result-api"),
    file("query_proof.rs · shape", "crates/proof-of-sql/src/sql/proof/query_proof.rs", "posql-proof-shape"),
    file("query_proof.rs · prover transcript", "crates/proof-of-sql/src/sql/proof/query_proof.rs", "posql-prover-transcript"),
    file("query_proof.rs · sumcheck/opening", "crates/proof-of-sql/src/sql/proof/query_proof.rs", "posql-prover-sumcheck"),
    file("query_proof.rs · verifier transcript", "crates/proof-of-sql/src/sql/proof/query_proof.rs", "posql-verifier-transcript"),
    file("query_proof.rs · verifier checks", "crates/proof-of-sql/src/sql/proof/query_proof.rs", "posql-verifier-checks"),
  ]),
  directory("base/commitment", [
    file("commitment_evaluation_proof.rs", "crates/proof-of-sql/src/base/commitment/commitment_evaluation_proof.rs", "posql-commitment-trait"),
  ]),
]);
