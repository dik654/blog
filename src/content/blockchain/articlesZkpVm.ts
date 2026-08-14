import type { Article } from "../types";

export const zkpVmArticles: Article[] = [
  {
    slug: "circom",
    title: "Circom: signal·R1CS lowering과 reproducible artifact",
    subcategory: "zkp-groth16-impl",
    sections: [
      { id: "overview", title: "3·4=12에서 compiler pipeline까지" },
      { id: "lowering", title: "Signal·witness·constraint lowering" },
      { id: "artifacts", title: "R1CS·witness·public layout artifact" },
      { id: "release", title: "snarkjs release·rollback gate" },
    ],
    component: () => import("@/pages/articles/blockchain/circom"),
  },
  {
    slug: "scroll-zkevm",
    title: "Scroll zkEVM: EVM trace·Halo2 proof artifact",
    subcategory: "zkp-plonk-impl",
    sections: [
      { id: "overview", title: "ADD 한 번에서 zkEVM까지" },
      { id: "trace-tables", title: "EVM trace·table 계약" },
      { id: "proof-artifact", title: "Witness·proof·public input artifact" },
      { id: "release", title: "Parity·verification release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/scroll-zkevm"),
  },
  {
    slug: "sp1",
    title: "SP1: Plonky3 기반 RISC-V zkVM",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "ELF에서 proof receipt까지" },
      { id: "program-artifact", title: "ELF·program key artifact" },
      { id: "execution-shards", title: "Execution record·shards" },
      { id: "proof-receipt", title: "Proof modes·receipt" },
      { id: "release-gate", title: "Parity·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/sp1"),
  },
  {
    slug: "risc0",
    title: "RISC Zero: RISC-V zkVM & STARK 증명 시스템",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "Guest ELF에서 receipt까지" },
      { id: "method-artifact", title: "Method·ImageID artifact" },
      { id: "session-segments", title: "Session·segment continuity" },
      { id: "receipt-claim", title: "Receipt claim·journal" },
      { id: "release-gate", title: "Verification·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/risc0"),
  },
  {
    slug: "jolt",
    title: "Jolt: instruction lookup·sumcheck lowering과 proof receipt",
    subcategory: "zkp-vm",
    sections: [
      { id: "overview", title: "ADD instruction에서 zkVM claim까지" },
      { id: "lookup-sumcheck", title: "Lookup·MLE·sumcheck lowering" },
      { id: "artifact", title: "Bytecode·trace·claim artifact" },
      { id: "release", title: "Interpreter parity·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/jolt"),
  },
];
