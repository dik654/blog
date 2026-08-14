import type { Article } from "../types";

export const zkpSystems2Articles: Article[] = [
  // ── Bulletproofs (투명 셋업, 기초) ──
  {
    slug: "bulletproofs",
    title: "Bulletproofs: 투명 셋업 범위 증명 (Inner Product Argument)",
    subcategory: "zkp-bp-concept",
    sections: [
      { id: "overview", title: "Committed range 전체 지도" },
      { id: "inner-product", title: "Inner-product folding" },
      { id: "range-proof", title: "Bit range와 aggregation" },
      { id: "release", title: "Failure·benchmark·rollback" },
    ],
    component: () => import("@/pages/articles/blockchain/bulletproofs"),
  },

  // ── IOP 계열 ──
  {
    slug: "libiop",
    title: "libiop: R1CS oracle reduction과 BCS transcript",
    subcategory: "zkp-iop-concept",
    sections: [
      { id: "overview", title: "R1CS에서 encoded oracle까지" },
      { id: "r1cs-iop", title: "R1CS·code·proximity profile" },
      { id: "bcs", title: "Commit-first BCS artifact" },
      { id: "release", title: "Protocol profile·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/libiop"),
  },
  {
    slug: "proofofsql",
    title: "Proof of SQL: query relation·snapshot·sumcheck·Dory",
    subcategory: "zkp-iop-impl",
    sections: [
      { id: "overview", title: "Committed SELECT의 입구" },
      { id: "query-relation", title: "SQL arithmetization과 sumcheck" },
      { id: "table-commitment", title: "Snapshot과 Dory opening" },
      { id: "verification", title: "Statement transcript" },
      { id: "release", title: "Correctness·cost release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/proofofsql"),
  },

  // ── Folding (재귀 증명) ──
  {
    slug: "nova",
    title: "Nova: NIFS 폴딩 기반 재귀 증명 (IVC)",
    subcategory: "zkp-nova-concept",
    sections: [
      { id: "overview", title: "Step→fold→IVC 전체 지도" },
      { id: "ivc", title: "IVC state·step relation" },
      { id: "relaxed-r1cs", title: "Relaxed R1CS와 NIFS" },
      { id: "compression-security", title: "Compression·ZK 경계" },
      { id: "release", title: "Resume·rollback gate" },
    ],
    component: () => import("@/pages/articles/blockchain/nova"),
  },

  // ── PLONK 구현 ──
  {
    slug: "halo2",
    title: "Halo2: columns·regions·IPA profile (zcash/halo2)",
    subcategory: "zkp-plonk-impl",
    sections: [
      { id: "overview", title: "한 row에서 proof까지" },
      { id: "columns-regions", title: "Columns·regions·rotations" },
      { id: "proof-pipeline", title: "Keygen·prove·verify profile" },
      { id: "release", title: "Underconstraint·migration gate" },
    ],
    component: () => import("@/pages/articles/blockchain/halo2"),
  },

  // ── STARK 구현 ──
  {
    slug: "plonky3",
    title: "Plonky3: generic STARK config과 proof artifact",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "Fibonacci AIR에서 stack까지" },
      { id: "config", title: "Field·MMCS·FRI generic config" },
      { id: "pipeline", title: "Trace·AIR·config·proof binding" },
      { id: "release", title: "Native parity·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/plonky3"),
  },
];
