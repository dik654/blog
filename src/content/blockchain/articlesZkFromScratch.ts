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
      { id: "release-gate", title: "구현 증거와 경계" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/impl-field-arithmetic"),
  },
  {
    slug: "impl-elliptic-curve",
    title: "타원곡선 & 페어링 구현 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "한 점의 전체 경로" },
      { id: "curve-profile", title: "BN254 타입 지도" },
      { id: "point-encoding", title: "Point admission" },
      { id: "coordinate-ops", title: "점 두 배" },
      { id: "pairing-boundary", title: "Pairing 경계" },
      { id: "evidence", title: "확인한 사실" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-elliptic-curve"),
  },
  {
    slug: "impl-hash-commitment",
    title: "Hash·Poseidon·Merkle 구현 경계 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "c에서 root까지" },
      { id: "hash-api", title: "Streaming hash" },
      { id: "poseidon-api", title: "Byte-to-field 경계" },
      { id: "merkle-api", title: "Merkle proof 경로" },
      { id: "commitment-meaning", title: "Commitment 의미" },
      { id: "evidence", title: "확인한 사실" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-hash-commitment"),
  },
  {
    slug: "impl-groth16",
    title: "Groth16 증명 시스템 구현 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "3·5=15에서 검증까지" },
      { id: "circuit-witness", title: "Circuit과 witness" },
      { id: "r1cs-qap", title: "R1CS에서 QAP로" },
      { id: "proof-structure", title: "Proof 세 점" },
      { id: "verification", title: "공개 입력과 pairing" },
      { id: "evidence", title: "공식 구현 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-groth16"),
  },
  {
    slug: "impl-plonk",
    title: "PLONK 증명 시스템 구현 (Rust)",
    subcategory: "zk-from-scratch",
    sections: [
      { id: "overview", title: "3·4=12에서 proof까지" },
      { id: "circuit-composer", title: "Circuit와 Composer 행" },
      { id: "preprocess", title: "전처리와 key" },
      { id: "prover-rounds", title: "Prover 라운드" },
      { id: "verification", title: "Public input과 KZG 검증" },
      { id: "evidence", title: "논문·공식 구현 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/impl-plonk"),
  },
];
