import type { Article } from "../types";

// 순서: 기초 이론 → 구현 → 고급 구조 (위에서부터 읽으면 개념이 쌓이는 순서)
export const zkpMathArticles: Article[] = [
  // ── 1. 수학 기초 이론 ──
  {
    slug: "finite-field-theory",
    title: "유한체 이론",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 작은 값 안에서 나눗셈까지 되돌릴 수 있을까요?"
  },
  {
    "id": "black-box",
    "title": "2. 값 두 개와 연산을 받고 같은 범위의 값을 돌려줍니다"
  },
  {
    "id": "case",
    "title": "3. 같은 3으로 6도 나누고 2도 나눠 봅니다"
  },
  {
    "id": "picture",
    "title": "4. 나눗셈은 되돌리는 곱셈과 범위 정리로 진행됩니다"
  },
  {
    "id": "need",
    "title": "5. 기준을 8로 바꾸면 같은 되돌리기가 막힙니다"
  },
  {
    "id": "names",
    "title": "6. 곱해 1이 되는 값이 역원입니다"
  },
  {
    "id": "prime-field",
    "title": "7. 소수 기준이면 0 아닌 값마다 역원이 생깁니다"
  },
  {
    "id": "trace",
    "title": "8. 입력부터 되곱하기까지 같은 요청을 검산합니다"
  },
  {
    "id": "source",
    "title": "9. HAC 원문의 역원 절차에 3과 7을 넣습니다"
  },
  {
    "id": "multiplicative-order",
    "title": "10. 같은 값을 반복해서 곱하면 1로 돌아옵니다"
  },
  {
    "id": "polynomial",
    "title": "11. 계산 규칙을 계수로 적거나 여러 위치의 값으로 적습니다"
  },
  {
    "id": "root-bound",
    "title": "12. 다른 두 규칙이 우연히 같은 위치는 차수가 제한합니다"
  },
  {
    "id": "schwartz-zippel",
    "title": "13. 거짓 규칙이 무작위 검사를 통과할 확률을 셉니다"
  },
  {
    "id": "extension-field",
    "title": "14. 더 큰 체는 정수 기준만 키워서 만들지 않습니다"
  },
  {
    "id": "release",
    "title": "15. 나눗셈의 정확성과 암호 사용 조건을 함께 확인합니다"
  }
],
    component: () => import("@/pages/articles/blockchain/finite-field-theory"),
  },
  {
    slug: "discrete-log",
    title: "이산로그 문제: 정의·공격 비용·보안 가정",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 공개된 결과에서 비밀 숫자를 되찾기 어렵게 만듭니다"
  },
  {
    "id": "black-box",
    "title": "2. 숫자를 고르고, 반복 계산하고, 결과만 공개합니다"
  },
  {
    "id": "worked-case",
    "title": "3. 3을 다섯 번 곱해 17로 나눈 나머지는 5입니다"
  },
  {
    "id": "parts",
    "title": "4. 계산 규칙에는 나머지 기준과 한 번의 이동이 함께 있습니다"
  },
  {
    "id": "why-parts",
    "title": "5. 짧은 순환에서는 큰 숫자를 붙여도 비밀 후보가 적습니다"
  },
  {
    "id": "names",
    "title": "6. 찾는 것은 고정된 생성원에서 출발한 지수 좌표입니다"
  },
  {
    "id": "power-table",
    "title": "7. 5가 나타난 위치를 찾고 한 바퀴의 길이를 검산합니다"
  },
  {
    "id": "forward-cost",
    "title": "8. 만드는 쪽은 반복 횟수의 자릿수만 따라갈 수 있습니다"
  },
  {
    "id": "baby-giant",
    "title": "9. 네 칸짜리 표와 네 칸씩의 이동을 서로 만나게 합니다"
  },
  {
    "id": "applications",
    "title": "10. 부분군 크기와 프로토콜이 요구하는 문제를 함께 봅니다"
  }
],
    component: () => import("@/pages/articles/blockchain/discrete-log"),
  },
  {
    slug: "crt",
    title: "CRT: 나머지 조건의 조립·유일성·RSA 경계",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 원래 수를 모르고 세 나머지만 알 때"
  },
  {
    "id": "black-box",
    "title": "2. 계산을 나누는 기준과 합치는 규칙이 필요합니다"
  },
  {
    "id": "case",
    "title": "3. 23을 세 번 나누어 기록을 확인합니다"
  },
  {
    "id": "picture",
    "title": "4. 작은 기록 세 개가 같은 수를 가리킵니다"
  },
  {
    "id": "need",
    "title": "5. 한 기록을 맞추며 다른 두 기록을 건드리지 않으려면"
  },
  {
    "id": "names",
    "title": "6. 같은 나머지를 합동이라 부릅니다"
  },
  {
    "id": "numerical",
    "title": "7. 세 선택자 70·21·15로 23을 조립합니다"
  },
  {
    "id": "uniqueness",
    "title": "8. 답은 왜 105마다 하나씩 반복되나요?"
  },
  {
    "id": "crypto-usage",
    "title": "9. RFC 8017은 같은 23을 두 작은 계산으로 복원합니다"
  },
  {
    "id": "compatibility",
    "title": "10. 기준이 서로소가 아니면 답이 없을 수도 있습니다"
  },
  {
    "id": "fault-boundary",
    "title": "11. 한쪽 결과가 3에서 4로 바뀌면 인수 7이 드러납니다"
  },
  {
    "id": "release",
    "title": "12. 같은 답·오류 검출·속도는 따로 비교합니다"
  }
],
    component: () => import("@/pages/articles/blockchain/crt"),
  },
  {
    slug: "csprng",
    title: "CSPRNG: entropy·state·reseed lifecycle",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 길고 복잡한 문자열도 시작값을 알면 예측할 수 있습니다"
  },
  {
    "id": "black-box",
    "title": "2. 비밀 재료를 얻는 곳과 출력을 만드는 곳을 나눕니다"
  },
  {
    "id": "case",
    "title": "3. 시작값이 0부터 7까지면 긴 결과도 여덟 후보입니다"
  },
  {
    "id": "picture",
    "title": "4. 출력은 늘어나도 새 비밀이 저절로 생기지는 않습니다"
  },
  {
    "id": "need",
    "title": "5. 다음 값 예측과 상태 복제는 서로 다른 실패입니다"
  },
  {
    "id": "names",
    "title": "6. 비밀의 불확실성과 출력 생성에 이름을 붙입니다"
  },
  {
    "id": "entropy-source",
    "title": "7. 가장 잘 맞힐 수 있는 한 번의 추측을 셉니다"
  },
  {
    "id": "predictability",
    "title": "8. 다음 비트를 60% 맞히면 절반보다 10%p 유리합니다"
  },
  {
    "id": "source",
    "title": "9. 실제 규격의 상태 갱신에 시작값 3을 넣습니다"
  },
  {
    "id": "state-lifecycle",
    "title": "10. 상태를 읽힌 뒤에는 새로 모르는 재료가 필요합니다"
  },
  {
    "id": "applications",
    "title": "11. 서명 비밀을 재사용하면 개인키 7까지 드러납니다"
  },
  {
    "id": "release",
    "title": "12. 부팅·복제·실패를 통과한 뒤 생성 속도를 봅니다"
  }
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
  {
    "id": "overview",
    "title": "1. 세 기록에서 계산 규칙을 다시 찾으려면"
  },
  {
    "id": "black-box",
    "title": "2. 위치와 결과를 받고 규칙 또는 새 값을 돌려줍니다"
  },
  {
    "id": "case",
    "title": "3. 같은 세 기록을 17개의 값 안에서 계산합니다"
  },
  {
    "id": "picture",
    "title": "4. 각 기록의 담당 식을 만든 뒤 더합니다"
  },
  {
    "id": "need",
    "title": "5. 한 기록을 맞추다가 다른 기록을 바꾸지 않으려면"
  },
  {
    "id": "names",
    "title": "6. 기록은 표본점, 담당 식은 보간 기저입니다"
  },
  {
    "id": "formula",
    "title": "7. 담당 식 세 개를 1·4·9배 해 더합니다"
  },
  {
    "id": "trace",
    "title": "8. 입력 3에서는 기저값 1·14·3으로 16을 얻습니다"
  },
  {
    "id": "source",
    "title": "9. DLMF 원문의 세 점에 같은 기록을 넣습니다"
  },
  {
    "id": "usage",
    "title": "10. 위치가 고정되면 무게를 미리 계산해 둡니다"
  },
  {
    "id": "vanishing",
    "title": "11. 세 위치에서 모두 0이 되는 식을 따로 만듭니다"
  },
  {
    "id": "boundaries",
    "title": "12. 세 점이 같아도 더 높은 차수의 규칙은 다릅니다"
  },
  {
    "id": "release",
    "title": "13. 필요한 출력과 표본 구조에 맞춰 계산합니다"
  }
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
    title: "Reed–Solomon: 사라지거나 틀린 기록 복원하기",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 기록 두 개가 사라져도 원본을 되찾으려면"
  },
  {
    "id": "black-box",
    "title": "2. 위치가 붙은 기록을 만들고 남은 기록으로 되돌립니다"
  },
  {
    "id": "case",
    "title": "3. 원본 2·3을 네 기록 2·5·1·4로 바꿉니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 규칙을 여러 위치에서 읽어 여유를 만듭니다"
  },
  {
    "id": "need",
    "title": "5. 값의 개수와 함께 위치와 계산 범위를 알아야 합니다"
  },
  {
    "id": "names",
    "title": "6. 원본의 크기와 보낸 기록의 크기를 구분합니다"
  },
  {
    "id": "encoding",
    "title": "7. 원본을 계수로 놓고 네 위치에서 계산합니다"
  },
  {
    "id": "trace",
    "title": "8. 남은 두 기록에서 계수 2·3을 다시 구합니다"
  },
  {
    "id": "source",
    "title": "9. 원문 식과 행렬에 같은 네 기록을 대응합니다"
  },
  {
    "id": "error-correction",
    "title": "10. 위치를 모르는 오류는 여유를 두 칸씩 씁니다"
  },
  {
    "id": "berlekamp-welch",
    "title": "11. 틀린 위치에서 0이 되는 식을 함께 찾습니다"
  },
  {
    "id": "misdecode",
    "title": "12. 복원기가 성공해도 다른 원본일 수 있습니다"
  },
  {
    "id": "profile",
    "title": "13. 같은 부호 이름만으로 구현을 섞지 않습니다"
  },
  {
    "id": "zk-connection",
    "title": "14. 증명에서는 정상 목록과의 거리를 묻기도 합니다"
  },
  {
    "id": "reed-solomon-release-gate",
    "title": "15. 성공 사례와 잘못된 성공 사례를 함께 확인합니다"
  }
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
