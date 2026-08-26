import type { Article } from "../types";

// 순서: 프리미티브 조합 → 커밋먼트 스킴 → MPC (zkp-math 뒤, zkp-systems 앞)
export const zkpMath2Articles: Article[] = [
  {
    slug: "crypto-primitives",
    title: "ZK 암호 프리미티브: 보장·조합·실패 조건",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "프리미티브별 보장 지도" },
      { id: "poseidon", title: "Poseidon field permutation" },
      { id: "merkle-commitment", title: "Merkle opening·binding·hiding" },
      { id: "schnorr", title: "Schnorr transcript·nonce" },
      { id: "ed25519", title: "Ed25519 instance 계약" },
      { id: "abelian-group", title: "Group·field·domain 타입" },
    ],
    component: () => import("@/pages/articles/blockchain/crypto-primitives"),
  },
  {
    slug: "polycommit",
    title: "다항식 커밋먼트 스킴: KZG · IPA · Linear Codes 구현 비교",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "f(4)=10에서 시작하는 PCS" },
      { id: "commit-open", title: "Commit·Open과 KZG quotient" },
      { id: "schemes", title: "KZG와 IPA의 비용·전제" },
      { id: "selection", title: "선택과 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/polycommit"),
  },
  {
    slug: "mpc",
    title: "MPC: Real/Ideal 보안 모델에서 DKG Release까지",
    subcategory: "mpc",
    sections: [
      { id: "overview", title: "3+4=7에서 시작하는 MPC" },
      { id: "security-model", title: "Real/ideal 보안 모델" },
      { id: "shamir", title: "Shamir 독립 정본으로 연결" },
      { id: "paillier", title: "Paillier 독립 정본으로 연결" },
      { id: "dkg", title: "DKG transcript artifact" },
      { id: "release", title: "Active failure release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/mpc"),
  },
  {
    slug: "shamir-secret-sharing",
    title: "Shamir Secret Sharing: Polynomial Share·복원·Privacy 경계",
    subcategory: "mpc",
    sections: [
      { id: "overview", title: "Threshold polynomial sharing" },
      { id: "share-generation", title: "Random polynomial과 share 생성" },
      { id: "reconstruction", title: "Lagrange 복원" },
      { id: "privacy-boundary", title: "t-share privacy" },
      { id: "active-boundary", title: "VSS·refresh 경계" },
      { id: "release", title: "Negative fixture와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/shamir-secret-sharing"),
  },
  {
    slug: "paillier-cryptosystem",
    title: "Paillier Cryptosystem: Randomized Encryption·Additive Homomorphism",
    subcategory: "mpc",
    sections: [
      { id: "overview", title: "Paillier의 보장과 경계" },
      { id: "key-generation", title: "Key generation과 inverse 조건" },
      { id: "encryption", title: "Unit randomizer encryption" },
      { id: "homomorphism", title: "Ciphertext 곱과 plaintext 덧셈" },
      { id: "decryption", title: "L 함수 복호" },
      { id: "security-boundary", title: "Malleability·integrity 경계" },
      { id: "release", title: "Profile·encoding·negative vectors" },
    ],
    component: () => import("@/pages/articles/blockchain/paillier-cryptosystem"),
  },
];
