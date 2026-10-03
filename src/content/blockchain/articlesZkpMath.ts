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
      { id: "security-direction", title: "Security margin·proof-layer 전환" },
      { id: "release", title: "Poseidon release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/poseidon-hash"),
  },
  {
    slug: "binary-field-proving",
    title: "Binary-field proving: Binius·Flock·기존 hash 증명",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Primitive와 prover 중 무엇을 바꿀까" },
      { id: "binary-field", title: "F₂·F₂ᵏ와 Boolean workload" },
      { id: "binius", title: "Binius binary-tower proof" },
      { id: "flock-selection", title: "Flock·security margin·선택 gate" },
    ],
    component: () => import("@/pages/articles/blockchain/binary-field-proving"),
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
    title: "Extension field: minimal polynomial·tower·Frobenius",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "새 root를 붙이는 입구" },
      { id: "minimal-polynomial", title: "Minimal polynomial과 degree" },
      { id: "tower", title: "Tower law" },
      { id: "frobenius", title: "Frobenius cycle" },
      { id: "release", title: "Extension profile release" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/extension-field-theory"),
  },
  {
    slug: "zk-theory",
    title: "영지식 증명 이론",
    subcategory: "zkp-math",
    sections: [{"id": "overview", "title": "1. 비밀을 보내지 않고 알고 있다는 사실을 보이려면"}, {"id": "black-box", "title": "2. 먼저 약속하고 질문을 받은 뒤 답합니다"}, {"id": "case", "title": "3. 12를 보낸 뒤 질문 2에 답 7을 보냅니다"}, {"id": "picture", "title": "4. 처음 보낸 12와 마지막 답 7이 공개 16으로 이어집니다"}, {"id": "need", "title": "5. 새 질문마다 처음 고른 수를 새로 써야 합니다"}, {"id": "names", "title": "6. 세 메시지·추출기·시뮬레이터를 구분합니다"}, {"id": "sigma", "title": "7. 두 답의 차이에서 처음 고른 10을 지웁니다"}, {"id": "simulation", "title": "8. 역순 계산은 실제 대화의 순서와 다릅니다"}, {"id": "source", "title": "9. 숨겨도 바꿀 수 있으면 약속이 되지 않습니다"}, {"id": "noninteractive-boundary", "title": "10. 해시가 질문을 대신해도 입력과 순서를 지켜야 합니다"}],
    component: () => import("@/pages/articles/blockchain/zk-theory"),
  },
  {
    slug: "fri",
    title: "FRI (Fast Reed-Solomon IOP)",
    subcategory: "zkp-math",
    sections: [{"id": "overview", "title": "1. 긴 표를 다 읽지 않고 일정한 규칙을 따르는지 확인하려면"}, {"id": "black-box", "title": "2. 표를 고정하고 줄인 표와 일부 위치를 대조합니다"}, {"id": "case", "title": "3. 위치 4와 13의 값 10과 11을 하나로 합칩니다"}, {"id": "picture", "title": "4. 서로 반대인 위치가 같은 새 위치로 모입니다"}, {"id": "need", "title": "5. 미리 알려 준 섞기 숫자에는 속임수를 맞출 수 있습니다"}, {"id": "names", "title": "6. 낮은 차수의 평가표와 근접성을 검사합니다"}, {"id": "folding", "title": "7. 짝수 차수와 홀수 차수를 나누면 차수가 줄어듭니다"}, {"id": "soundness", "title": "8. 원문은 부호와의 거리를 기준으로 거절 확률을 정의합니다"}, {"id": "source", "title": "9. WHIR는 값에 대한 제약도 같은 낮은 차수 검사와 연결합니다"}, {"id": "stark-boundary", "title": "10. 표의 차수와 프로그램의 실행은 서로 다른 검사입니다"}],
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
    title: "Pairing: Miller loop·final exponent·subgroup boundary",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Bilinearity 전체 지도" },
      { id: "miller-loop", title: "Miller function invariant" },
      { id: "final-exponent", title: "GT subgroup projection" },
      { id: "release", title: "Input/subgroup release" },
    ],
    component: () => import("@/pages/articles/blockchain/pairing"),
  },
];
