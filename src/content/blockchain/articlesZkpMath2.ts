import type { Article } from "../types";

// 순서: 프리미티브 조합 → 커밋먼트 스킴 → MPC (zkp-math 뒤, zkp-systems 앞)
export const zkpMath2Articles: Article[] = [
  {
    slug: "crypto-primitives",
    title: "암호 도구: 영수증 한 장에서 해시와 서명까지",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 영수증 한 장이 승인된 묶음에 들어 있는지 확인합니다"
  },
  {
    "id": "black-box",
    "title": "2. 기록·경로·서명이 들어오고 두 판정이 나옵니다"
  },
  {
    "id": "case",
    "title": "3. C의 20은 정확히 다섯 바이트입니다"
  },
  {
    "id": "picture",
    "title": "4. C에서 루트까지 같은 기록을 따라갑니다"
  },
  {
    "id": "why",
    "title": "5. 전체를 보내지 않고도 같은 묶음인지 확인하는 이유"
  },
  {
    "id": "names",
    "title": "6. 지금 본 도구와 성질에 이름을 붙입니다"
  },
  {
    "id": "predictions",
    "title": "7. 계산 전에 세 결과를 예상해 봅니다"
  },
  {
    "id": "merkle-commitment",
    "title": "8. C의 경로를 실제 해시와 표준의 규칙에 대입합니다"
  },
  {
    "id": "hiding",
    "title": "9. 해시가 같음을 확인해도 금액이 숨겨지지는 않습니다"
  },
  {
    "id": "pedersen",
    "title": "10. 값을 숨기는 것과 바꾸지 못하게 하는 것이 갈리는 예"
  },
  {
    "id": "absence",
    "title": "11. 빈 칸을 증명하려면 빈 값의 뜻부터 정해야 합니다"
  },
  {
    "id": "poseidon",
    "title": "12. 증명 회로에서는 해시의 안쪽 계산 비용이 달라집니다"
  },
  {
    "id": "capacity",
    "title": "13. 일부 출력을 버리는 것과 비밀을 숨기는 것은 다릅니다"
  },
  {
    "id": "schnorr",
    "title": "14. 서명 응답이 왜 개인값과 연결되는지 작은 수로 봅니다"
  },
  {
    "id": "nonce",
    "title": "15. 임시값을 반복하면 두 응답에서 개인값이 나옵니다"
  },
  {
    "id": "bip340",
    "title": "16. 비슷한 식을 쓴다고 같은 서명 규격은 아닙니다"
  },
  {
    "id": "ed25519",
    "title": "17. 실제 RFC 코드에 같은 영수증 메시지를 넣습니다"
  },
  {
    "id": "source-bug",
    "title": "18. 출판본 예제와 명세가 어긋나는 길이 검사를 발견합니다"
  },
  {
    "id": "authority",
    "title": "19. 서명식의 성공과 가게의 승인을 분리합니다"
  },
  {
    "id": "variants",
    "title": "20. Ed25519의 변형과 검증식 선택도 입력 규칙입니다"
  },
  {
    "id": "abelian-group",
    "title": "21. 같아 보이는 숫자도 계산하는 세계가 다릅니다"
  },
  {
    "id": "limits",
    "title": "22. 영수증 한 장에서 확인한 보장과 남은 조건"
  }
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
    title: "Paillier: 암호문으로 4와 3의 합을 계산하기",
    subcategory: "mpc",
    sections: [
  {
    "id": "overview",
    "title": "1. 개별 수를 열어 보지 않고 4와 3을 합칩니다"
  },
  {
    "id": "black-box",
    "title": "2. 서버는 곱하고 비밀키 담당자는 합을 읽습니다"
  },
  {
    "id": "case",
    "title": "3. 이번 두 숫자는 173과 154로 바뀝니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 두 건수가 지나가는 네 단계를 봅니다"
  },
  {
    "id": "why",
    "title": "5. n+1의 거듭제곱에는 숫자를 읽어 낼 자리가 남습니다"
  },
  {
    "id": "names",
    "title": "6. 평문·암호문·난수·동형성의 역할을 연결합니다"
  },
  {
    "id": "key-generation",
    "title": "7. 비밀 지수 4와 되돌리는 계수 4를 만듭니다"
  },
  {
    "id": "encryption",
    "title": "8. 난수의 n제곱을 곱해 같은 4를 다르게 보냅니다"
  },
  {
    "id": "decryption",
    "title": "9. 173에서 4를, 92에서 7을 꺼냅니다"
  },
  {
    "id": "correctness",
    "title": "10. 왜 난수만 없어지고 메시지는 남나요"
  },
  {
    "id": "homomorphism",
    "title": "11. 암호문 173과 154의 곱이 평문 4와 3의 합을 만듭니다"
  },
  {
    "id": "rerandomization",
    "title": "12. 같은 합을 유지하면서 암호문을 다시 가릴 수 있습니다"
  },
  {
    "id": "source-encrypt",
    "title": "13. 원문 raw_encrypt에 같은 4와 난수 2를 넣습니다"
  },
  {
    "id": "source-decrypt",
    "title": "14. 원문은 9와 25에서 나눠 복호한 뒤 합칩니다"
  },
  {
    "id": "source-operations",
    "title": "15. 원문에서 더하기 기호는 암호문 곱셈으로 내려갑니다"
  },
  {
    "id": "encoding",
    "title": "16. 수학적 나머지 7과 signed 정수 7의 허용 범위는 다릅니다"
  },
  {
    "id": "randomness",
    "title": "17. 난수를 재사용하면 두 평문의 차이가 드러납니다"
  },
  {
    "id": "validation",
    "title": "18. 낮은 수준 API가 조건을 자동으로 검사하지는 않습니다"
  },
  {
    "id": "key-boundary",
    "title": "19. 왕복 복호 성공만으로 키 설정을 검증할 수 없습니다"
  },
  {
    "id": "security",
    "title": "20. 더할 수 있다는 기능은 변조를 막아 주지 않습니다"
  },
  {
    "id": "verification",
    "title": "21. 실제로 실행한 범위와 남은 범위를 나눕니다"
  },
  {
    "id": "limits",
    "title": "22. 같은 두 값에서 달라질 결과를 예측합니다"
  }
],
    component: () => import("@/pages/articles/blockchain/paillier-cryptosystem"),
  },
];
