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
  {
    "id": "overview",
    "title": "1. 세 사람 중 두 사람이 모여야 비밀을 복원하려면"
  },
  {
    "id": "black-box",
    "title": "2. 나누는 사람은 비밀과 새 무작위 값을 함께 사용합니다"
  },
  {
    "id": "case",
    "title": "3. 비밀 5에 번호의 세 배를 더합니다"
  },
  {
    "id": "picture",
    "title": "4. 보관자는 결과를 받고 복원자는 두 기록을 합칩니다"
  },
  {
    "id": "need",
    "title": "5. 무작위 값이 있어야 같은 기록에 여러 비밀이 대응합니다"
  },
  {
    "id": "names",
    "title": "6. 기록은 share, 복원에 필요한 수는 threshold입니다"
  },
  {
    "id": "share-generation",
    "title": "7. 8·11·14는 조각의 번호와 함께 만들어집니다"
  },
  {
    "id": "reconstruction",
    "title": "8. 두 기록을 더할 때 무작위 계수만 지웁니다"
  },
  {
    "id": "source",
    "title": "9. Shamir 원문의 q(0)에 비밀 5를 대응합니다"
  },
  {
    "id": "privacy-boundary",
    "title": "10. 한 조각 8은 비밀 0·5·10 모두와 맞습니다"
  },
  {
    "id": "active-boundary",
    "title": "11. 거짓 조각 12를 내면 비밀 4도 계산됩니다"
  },
  {
    "id": "release",
    "title": "12. 조각의 값만큼 번호·회차·전달 경로도 확인합니다"
  }
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
