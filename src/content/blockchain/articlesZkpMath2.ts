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
    title: "다항식 커밋먼트: KZG와 IPA로 평가값 확인하기",
    subcategory: "zkp-math",
    sections: [{"id": "overview", "title": "1. 긴 계산표를 고정한 뒤 한 질문에 짧게 답하려면"}, {"id": "black-box", "title": "2. 먼저 고정하고 나중에 위치를 정합니다"}, {"id": "case", "title": "3. 제곱하고 두 배를 더한 뒤 3을 더하면"}, {"id": "picture", "title": "4. 함수 고정값과 몫의 고정값을 대조합니다"}, {"id": "need", "title": "5. 작은 고정값만으로 모든 보장이 생기지는 않습니다"}, {"id": "names", "title": "6. 다항식 커밋먼트의 인터페이스와 세 계열"}, {"id": "commit-open", "title": "7. 10을 11로 바꾸면 정확한 나눗셈이 깨집니다"}, {"id": "source", "title": "8. 원문도 인수정리로 짧은 평가 증거를 만듭니다"}, {"id": "schemes", "title": "9. 같은 10을 벡터 내적으로 쓰고 절반으로 접습니다"}, {"id": "selection", "title": "10. 준비 방식·검증 비용·은닉을 같은 표에서 읽습니다"}],
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
