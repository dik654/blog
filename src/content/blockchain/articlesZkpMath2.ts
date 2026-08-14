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
    title: "MPC: Paillier 기반 분산 키 생성 프로토콜",
    subcategory: "mpc",
    sections: [
      { id: "overview", title: "개요 & 보안 모델" },
      { id: "shamir", title: "Shamir 비밀 분산" },
      { id: "paillier", title: "Paillier 동형 암호화" },
      { id: "dkg", title: "분산 키 생성 (DKG)" },
    ],
    component: () => import("@/pages/articles/blockchain/mpc"),
  },
];
