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
    title: "libiop: Interactive Oracle Proof (Aurora / Ligero / Fractal)",
    subcategory: "zkp-iop-concept",
    sections: [
      { id: "overview", title: "IOP 개요" },
      { id: "aurora-ligero", title: "Aurora / Ligero 프로토콜" },
      { id: "r1cs-iop", title: "R1CS -> IOP 변환" },
      { id: "bcs", title: "BCS 변환" },
      { id: "fractal", title: "Fractal PCS" },
      { id: "optimization", title: "최적화" },
    ],
    component: () => import("@/pages/articles/blockchain/libiop"),
  },
  {
    slug: "proofofsql",
    title: "Proof of SQL: SQL 쿼리 영지식 증명 (Sumcheck + Dory)",
    subcategory: "zkp-iop-impl",
    sections: [
      { id: "overview", title: "개요" },
      { id: "query-proof", title: "SQL 쿼리 증명" },
      { id: "dory-commitment", title: "Dory Commitment" },
      { id: "verification", title: "Verification" },
      { id: "benchmark", title: "벤치마크" },
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
    title: "Plonky3: 모듈형 STARK 프레임워크 (BabyBear + FRI)",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "개요 & 크레이트 구조" },
      { id: "field-arithmetic", title: "BabyBear 필드 & 확장체" },
      { id: "air", title: "AIR — Algebraic Intermediate Representation" },
      { id: "fri", title: "FRI & TwoAdicFriPcs" },
      { id: "hash", title: "Poseidon2 & 해시 레이어" },
      { id: "poseidon2-hash", title: "Poseidon2 해시 상세" },
      { id: "merkle-commit", title: "Merkle 커밋먼트 스킴" },
      { id: "uni-stark", title: "uni-stark 증명 시스템" },
      { id: "challenger", title: "Fiat-Shamir 챌린저" },
      { id: "performance", title: "성능 벤치마크" },
    ],
    component: () => import("@/pages/articles/blockchain/plonky3"),
  },
];
