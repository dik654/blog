import type { Article } from "../types";

export const zkFromScratchArticles: Article[] = [
  {
    slug: "impl-field-arithmetic",
    title: "유한체 산술 구현 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "값의 전체 lifecycle" },
      { id: "parameter-artifact", title: "Field parameter artifact" },
      { id: "serialization", title: "Canonical serialization" },
      { id: "execution-profile", title: "Arithmetic execution profile" },
      { id: "release-gate", title: "Field release gate" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/impl-field-arithmetic"),
  },
  {
    slug: "impl-elliptic-curve",
    title: "타원곡선 & 페어링 구현 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "Bytes에서 pairing까지" },
      { id: "curve-profile", title: "Curve profile artifact" },
      { id: "point-encoding", title: "Point admission" },
      { id: "coordinate-ops", title: "Coordinate operations" },
      { id: "release-gate", title: "Pairing release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-elliptic-curve"),
  },
  {
    slug: "impl-hash-commitment",
    title: "Hash·Poseidon·Merkle 구현 경계 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "Bytes API에서 root까지" },
      { id: "hash-api", title: "Streaming hash contract" },
      { id: "poseidon-api", title: "Byte-to-field serialization" },
      { id: "merkle-api", title: "Merkle schema와 path" },
      { id: "release", title: "Implementation release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-hash-commitment"),
  },
  {
    slug: "impl-groth16",
    title: "Groth16 증명 시스템 구현 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "Artifact에서 proof까지" },
      { id: "artifact-profile", title: "Groth16 artifact profile" },
      { id: "setup-key", title: "Setup key admission" },
      { id: "prover-plan", title: "Parallel prover plan" },
      { id: "release-gate", title: "Proof release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-groth16"),
  },
  {
    slug: "impl-plonk",
    title: "PLONK 증명 시스템 구현 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "3·4=12에서 proof까지" },
      { id: "compiler-artifact", title: "Circuit compiler artifact" },
      { id: "prover-plan", title: "Prover transcript plan" },
      { id: "proof-receipt", title: "Proof receipt" },
      { id: "release-gate", title: "Release·rollback gate" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-plonk"),
  },
];
