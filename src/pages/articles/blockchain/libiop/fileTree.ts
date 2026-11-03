import type { FileNode } from "@/components/code/types";

export const libiopTree: FileNode =
  {
    name: "libiop",
    type: "dir",
    children: [
      {
        name: "relations",
        type: "dir",
        children: [{ name: "r1cs.tcc", type: "file", path: "libiop/relations/r1cs.tcc:111–148", codeKey: "r1cs-check" }],
      },
      {
        name: "protocols/encoded/r1cs_rs_iop",
        type: "dir",
        children: [
          {
            name: "r1cs_rs_iop.tcc · register",
            type: "file",
            path: "libiop/protocols/encoded/r1cs_rs_iop/r1cs_rs_iop.tcc:297–327",
            codeKey: "oracle-registration",
          },
          {
            name: "r1cs_rs_iop.tcc · submit",
            type: "file",
            path: "libiop/protocols/encoded/r1cs_rs_iop/r1cs_rs_iop.tcc:572–606",
            codeKey: "oracle-submission",
          },
        ],
      },
      {
        name: "bcs",
        type: "dir",
        children: [
          { name: "bcs_prover.tcc", type: "file", path: "libiop/bcs/bcs_prover.tcc:24–59", codeKey: "bcs-round" },
          { name: "bcs_common.tcc", type: "file", path: "libiop/bcs/bcs_common.tcc:551–565", codeKey: "bcs-hashchain" },
          { name: "bcs_verifier.tcc", type: "file", path: "libiop/bcs/bcs_verifier.tcc:61–100", codeKey: "bcs-verify" },
        ],
      },
      {
        name: "snark",
        type: "dir",
        children: [
          {
            name: "aurora_snark.tcc",
            type: "file",
            path: "libiop/snark/aurora_snark.tcc:120–179",
            codeKey: "aurora-pipeline",
          },
        ],
      },
      {
        name: "tests/bcs",
        type: "dir",
        children: [
          {
            name: "test_bcs_transformation.cpp",
            type: "file",
            path: "libiop/tests/bcs/test_bcs_transformation.cpp:201–219",
            codeKey: "bcs-test",
          },
        ],
      },
    ],
  };
