import type { Article } from "../types";

// 순서: 기초 이론 → 구현 → 고급 구조 (위에서부터 읽으면 개념이 쌓이는 순서)
export const zkpMathArticles: Article[] = [
  // ── 1. 수학 기초 이론 ──
  {
    slug: "finite-field-theory",
    title: "유한체 이론",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "군 · 환 · 체 정의" },
      { id: "prime-field", title: "소수체 & 원시근" },
      { id: "polynomial-arithmetic", title: "다항식 산술 & FFT" },
      { id: "schwartz-zippel", title: "Schwartz-Zippel 보조정리" },
      { id: "extension-field", title: "확장체 개요" },
    ],
    component: () => import("@/pages/articles/blockchain/finite-field-theory"),
  },
  {
    slug: "discrete-log",
    title: "이산로그 문제: 정의·공격 비용·보안 가정",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Group에서 숨은 scalar 찾기" },
      { id: "power-table", title: "작은 군으로 해·order 확인" },
      { id: "baby-giant", title: "BSGS·Pollard rho 공격 비용" },
      { id: "applications", title: "DLP·CDH·DDH와 선택 기준" },
    ],
    component: () => import("@/pages/articles/blockchain/discrete-log"),
  },
  {
    slug: "crt",
    title: "CRT: 나머지 조건의 조립·유일성·RSA 경계",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "나머지 조건에서 시작하기" },
      { id: "numerical", title: "Selector 구성·23 예제·유일성" },
      { id: "crypto-usage", title: "RSA-CRT·fault·benchmark" },
    ],
    component: () => import("@/pages/articles/blockchain/crt"),
  },
  {
    slug: "csprng",
    title: "CSPRNG: entropy·state·reseed lifecycle",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Entropy에서 예측 불가능한 출력까지" },
      { id: "entropy-source", title: "Min-entropy와 source validation" },
      { id: "applications", title: "Key·nonce·clone 운영 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/csprng"),
  },
  {
    slug: "hash-theory",
    title: "Hash 이론: bytes·security game·compression·sponge",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Bit string에서 protocol digest까지" },
      { id: "input-security", title: "Canonical input과 세 공격 game" },
      { id: "constructions", title: "Compression chaining과 sponge" },
      { id: "merkle-boundary", title: "Merkle로 넘기는 경계" },
      { id: "release", title: "Hash release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/hash-theory"),
  },
  {
    slug: "poseidon-hash",
    title: "Poseidon: field permutation·HADES·parameter profile",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Circuit-native hash의 입구" },
      { id: "profile", title: "Parameter profile" },
      { id: "rounds", title: "S-box·MDS·HADES rounds" },
      { id: "sponge-boundary", title: "Sponge와 byte 경계" },
      { id: "release", title: "Poseidon release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/poseidon-hash"),
  },
  {
    slug: "lagrange",
    title: "Lagrange 보간",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Lagrange 보간이란?" },
      { id: "formula", title: "Lagrange 보간 공식" },
      { id: "vanishing", title: "Vanishing Polynomial" },
      { id: "usage", title: "ZKP에서의 활용" },
    ],
    component: () => import("@/pages/articles/blockchain/lagrange"),
  },
  {
    slug: "fft",
    title: "FFT / NTT — 다항식 곱셈 가속",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "FFT / NTT란?" },
      { id: "dft", title: "DFT와 시간복잡도" },
      { id: "butterfly", title: "Butterfly 분할" },
      { id: "unit-root", title: "유한체 단위근" },
      { id: "intt", title: "INTT (역변환)" },
      { id: "zk-usage", title: "ZKP에서의 활용" },
    ],
    component: () => import("@/pages/articles/blockchain/fft"),
  },
  {
    slug: "reed-solomon",
    title: "Reed–Solomon 구현: profile·decode·proximity",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Code profile과 근거 경계" },
      { id: "encoding", title: "Profile-bound encoding" },
      { id: "error-correction", title: "Error·erasure와 typed decode" },
      { id: "zk-connection", title: "RS proximity와 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/reed-solomon"),
  },
  {
    slug: "extension-field-theory",
    title: "확장체 이론 (Extension Field)",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "확장체란?" },
      { id: "tower", title: "확장 타워 (Tower Extension)" },
      { id: "minimal-poly", title: "최소다항식 (Minimal Polynomial)" },
      { id: "frobenius", title: "Frobenius 사상" },
      { id: "bn254-pairing", title: "BN254 활용: G2 & 페어링" },
      { id: "miller-loop", title: "Miller Loop 상세" },
      { id: "final-exp", title: "Final Exponentiation 상세" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/extension-field-theory"),
  },
  {
    slug: "zk-theory",
    title: "영지식 증명 이론",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "완전성 · 건전성 · 영지식성" },
      { id: "sigma", title: "Sigma protocol과 extractor" },
      { id: "simulation", title: "Simulator와 commitment" },
      { id: "noninteractive-boundary", title: "Fiat–Shamir와 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/zk-theory"),
  },
  {
    slug: "fri",
    title: "FRI (Fast Reed-Solomon IOP)",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "RS oracle proximity" },
      { id: "folding", title: "Even/odd folding" },
      { id: "soundness", title: "Merkle query와 soundness" },
      { id: "stark-boundary", title: "STARK에 넘기는 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/fri"),
  },

  // ── 2. 구현 (이론 → 코드) ──
  {
    slug: "field-arithmetic",
    title: "유한체 구현: representation·Montgomery·release",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "표현 수명주기와 근거 경계" },
      { id: "prime-repr", title: "Canonical bytes와 limb" },
      { id: "montgomery", title: "Montgomery REDC" },
      { id: "operator-overload", title: "API·typed failure·test" },
      { id: "fr-scalar", title: "Fp/Fr 타입과 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/field-arithmetic"),
  },
  {
    slug: "extension-fields",
    title: "확장체 구현: Fp²→Fp¹² tower",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Tower profile과 source" },
      { id: "fp2", title: "Fp² product·inverse" },
      { id: "fp6", title: "Fp⁶ layout·reduction" },
      { id: "fp12", title: "Fp¹²·Frobenius·release" },
    ],
    component: () => import("@/pages/articles/blockchain/extension-fields"),
  },
  {
    slug: "elliptic-curves",
    title: "타원곡선군 구현: point·subgroup·BN254",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Finite-field point group" },
      { id: "g1-curve", title: "G1 연산·Jacobian·subgroup" },
      { id: "g1-g2-bn254", title: "BN254 G1·G2·GT 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/elliptic-curves"),
  },
  {
    slug: "pairing",
    title: "Optimal Ate Pairing",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Pairing 전체 지도" },
      { id: "miller-loop", title: "Miller Loop" },
      { id: "final-exp", title: "Final Exponentiation" },
      { id: "math-foundation", title: "수학적 기초" },
    ],
    component: () => import("@/pages/articles/blockchain/pairing"),
  },
];
