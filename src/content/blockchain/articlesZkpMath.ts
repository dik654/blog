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
    title: "NTT: 네 계수를 빠르게 계산하고 되돌리기",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 같은 계산 규칙을 여러 위치에서 빠르게 읽으려면"
  },
  {
    "id": "black-box",
    "title": "2. 계수 목록을 받아 정한 위치의 값 목록을 돌려줍니다"
  },
  {
    "id": "case",
    "title": "3. 네 계수를 17 안에서 계산합니다"
  },
  {
    "id": "picture",
    "title": "4. 짝수 항과 홀수 항을 계산한 뒤 두 쌍으로 합칩니다"
  },
  {
    "id": "need",
    "title": "5. 반대 위치에서는 홀수 항의 부호만 바뀝니다"
  },
  {
    "id": "names",
    "title": "6. 반복 주기의 길이와 변환 알고리즘을 구분합니다"
  },
  {
    "id": "dft",
    "title": "7. 각 출력은 같은 식을 다른 위치에서 읽은 값입니다"
  },
  {
    "id": "butterfly",
    "title": "8. 작은 결과 한 쌍으로 두 출력을 만듭니다"
  },
  {
    "id": "trace",
    "title": "9. 네 계수를 나누고 합쳐 같은 네 결과를 확인합니다"
  },
  {
    "id": "source",
    "title": "10. 원 논문의 합과 보조 배열에 같은 수를 넣습니다"
  },
  {
    "id": "unit-root",
    "title": "11. 길이에 맞는 반복 주기가 체 안에 있어야 합니다"
  },
  {
    "id": "intt",
    "title": "12. 반대 근으로 계산한 뒤 길이의 역원을 곱합니다"
  },
  {
    "id": "zk-usage",
    "title": "13. 곱의 길이를 확보한 뒤 같은 위치끼리 곱합니다"
  },
  {
    "id": "release",
    "title": "14. 같은 값이 나오는지 확인한 뒤 전체 비용을 봅니다"
  }
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
    title: "확장체: 세 숫자에서 아홉 원소로 계산 넓히기",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 세 숫자로 안 되는 계산에 새 원소를 붙입니다"
  },
  {
    "id": "black-box",
    "title": "2. 숫자 두 칸을 받아 같은 두 칸으로 계산합니다"
  },
  {
    "id": "case",
    "title": "3. 1+u와 2+u를 곱하면 1이 남습니다"
  },
  {
    "id": "picture",
    "title": "4. 항을 펼치고 새 규칙으로 두 칸에 돌려놓습니다"
  },
  {
    "id": "need",
    "title": "5. 원소 수를 늘려도 0 아닌 값으로 나눌 수 있어야 합니다"
  },
  {
    "id": "names",
    "title": "6. 원래 체와 확장체, 기약 다항식을 구분합니다"
  },
  {
    "id": "quotient",
    "title": "7. 높은 차수는 다항식으로 나눈 나머지에 모읍니다"
  },
  {
    "id": "minimal-polynomial",
    "title": "8. 최소다항식의 차수가 필요한 계수 수를 정합니다"
  },
  {
    "id": "inverse",
    "title": "9. 같은 1+u의 역원을 원문의 절차로 구합니다"
  },
  {
    "id": "source",
    "title": "10. 실제 Rust 코드에도 같은 두 칸을 넣습니다"
  },
  {
    "id": "frobenius",
    "title": "11. 세제곱은 둘째 계수의 부호를 바꿉니다"
  },
  {
    "id": "tower",
    "title": "12. 두 계수 위에 다시 두 계수를 두면 네 계수가 됩니다"
  },
  {
    "id": "basis",
    "title": "13. 같은 체라도 두 칸의 의미는 달라질 수 있습니다"
  },
  {
    "id": "boundaries",
    "title": "14. 타입 이름만으로 올바른 체 구성이 보장되지는 않습니다"
  },
  {
    "id": "release",
    "title": "15. 규칙·표현·실행 결과를 같은 사례로 확인합니다"
  }
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
  {
    "id": "overview",
    "title": "1. 같은 답을 계산하되 저장하는 숫자를 바꿉니다"
  },
  {
    "id": "black-box",
    "title": "2. 숫자를 받아 계산하고 약속한 바이트로 내보냅니다"
  },
  {
    "id": "case",
    "title": "3. 7×5의 답을 내부 숫자 15로 보관합니다"
  },
  {
    "id": "picture",
    "title": "4. 입력과 출력에서 바꾸고 계산 중에는 같은 형식을 씁니다"
  },
  {
    "id": "need",
    "title": "5. 두 번 붙은 배율을 한 번 지워야 표현이 유지됩니다"
  },
  {
    "id": "names",
    "title": "6. 저장 표현과 계산 규칙에 이름을 붙입니다"
  },
  {
    "id": "representation",
    "title": "7. 여러 자리 정수와 바이트 순서를 따로 읽습니다"
  },
  {
    "id": "montgomery-form",
    "title": "8. 내부 숫자 3은 일반 숫자 7을 뜻합니다"
  },
  {
    "id": "redc",
    "title": "9. 17의 배수를 더해 낮은 다섯 비트를 0으로 만듭니다"
  },
  {
    "id": "trace",
    "title": "10. 원 논문의 변환으로 같은 요청을 끝까지 계산합니다"
  },
  {
    "id": "source",
    "title": "11. 실제 64비트 코드에도 7과 5를 넣습니다"
  },
  {
    "id": "api",
    "title": "12. 나눗셈 실패와 입력 거부는 실제 API마다 확인합니다"
  },
  {
    "id": "fp-fr",
    "title": "13. 좌표와 반복 횟수는 다른 나머지 규칙을 씁니다"
  },
  {
    "id": "carry",
    "title": "14. 넘친 자리와 구현의 분기를 함께 확인합니다"
  },
  {
    "id": "release",
    "title": "15. 같은 값을 되찾는 검사와 잘못된 입력 검사를 나눕니다"
  }
],
    component: () => import("@/pages/articles/blockchain/field-arithmetic"),
  },
  {
    slug: "extension-fields",
    title: "확장체 구현: 같은 곱을 열두 계수와 코드로 추적하기",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 문자 세 개가 붙은 곱을 숫자 열두 칸에 담습니다"
  },
  {
    "id": "black-box",
    "title": "2. 두 입력과 세 규칙을 받아 같은 모양으로 돌려줍니다"
  },
  {
    "id": "case",
    "title": "3. 같은 두 입력의 곱에서 6과 28이 나옵니다"
  },
  {
    "id": "picture",
    "title": "4. 높은 항을 줄일 때 값이 다른 칸으로 이동합니다"
  },
  {
    "id": "need",
    "title": "5. 큰 계산을 작은 계산의 조합으로 다룹니다"
  },
  {
    "id": "names",
    "title": "6. 층별 계수와 확장 차수에 이름을 붙입니다"
  },
  {
    "id": "layout",
    "title": "7. 두 묶음 안의 세 묶음 안에 숫자 두 개를 둡니다"
  },
  {
    "id": "fp2",
    "title": "8. 안쪽의 두 계수는 네 항을 두 항으로 모읍니다"
  },
  {
    "id": "inverse",
    "title": "9. 역원은 켤레에 남은 배율까지 나누어 만듭니다"
  },
  {
    "id": "fp6",
    "title": "10. 가운데 곱에서는 v⁴가 v 자리로 돌아옵니다"
  },
  {
    "id": "fp12",
    "title": "11. 마지막 w²가 v를 한 번 더 곱하게 합니다"
  },
  {
    "id": "source",
    "title": "12. 실제 설정과 분기에 같은 입력을 넣습니다"
  },
  {
    "id": "frobenius-optimization",
    "title": "13. 큰 p제곱을 층별 계수와 미리 구한 배율로 바꿉니다"
  },
  {
    "id": "wire",
    "title": "14. 같은 6+28u도 전송 규칙에 따라 순서가 달라집니다"
  },
  {
    "id": "target",
    "title": "15. 열두 계수 타입이 곧 페어링의 목표 군은 아닙니다"
  },
  {
    "id": "cost",
    "title": "16. 연산 횟수에는 어느 층의 곱인지 적습니다"
  },
  {
    "id": "boundaries",
    "title": "17. 같은 크기의 배열도 다른 계산 공간일 수 있습니다"
  },
  {
    "id": "extension-release-gate",
    "title": "18. 같은 곱의 값·저장·전송을 각각 확인합니다"
  }
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
