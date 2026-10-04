import type { Article } from "../types";

export const classicalArticles: Article[] = [
  {
    slug: "diffie-hellman",
    title: "Diffie–Hellman: 인증·KDF·forward secrecy",
    subcategory: "classical",
    sections: [
  {
    "id": "overview",
    "title": "1. 처음 만난 두 컴퓨터가 같은 비밀을 가지려면"
  },
  {
    "id": "black-box",
    "title": "2. 각자 숨기는 수와 밖으로 보내는 값을 나눕니다"
  },
  {
    "id": "case",
    "title": "3. 8과 19를 교환해 양쪽에서 2를 얻습니다"
  },
  {
    "id": "picture",
    "title": "4. 공개값을 바꾸어 받은 뒤 자기 비밀을 적용합니다"
  },
  {
    "id": "need",
    "title": "5. 같은 결과를 얻는 것만으로 상대를 알 수는 없습니다"
  },
  {
    "id": "names",
    "title": "6. 공개값·공유값·인증에 이름을 붙입니다"
  },
  {
    "id": "protocol",
    "title": "7. 6번과 15번의 순서가 바뀌어도 총 90번입니다"
  },
  {
    "id": "source",
    "title": "8. 1976년 원문의 기호에 같은 6·15를 넣습니다"
  },
  {
    "id": "public-validation",
    "title": "9. X25519에서는 숫자 대신 규정된 32바이트를 넣습니다"
  },
  {
    "id": "authenticated-transcript",
    "title": "10. 중간자는 같은 등식으로 6과 15를 따로 만듭니다"
  },
  {
    "id": "kdf-key-schedule",
    "title": "11. 같은 공유값에도 보내는 방향을 붙여 열쇠를 나눕니다"
  },
  {
    "id": "ephemeral-lifecycle",
    "title": "12. 과거 대화를 지키려면 임시 비밀을 남기지 않습니다"
  },
  {
    "id": "dh-release-gate",
    "title": "13. 정상 벡터와 공격받은 대화를 각각 확인합니다"
  }
],
    component: () => import("@/pages/articles/crypto/diffie-hellman"),
  },
  {
    slug: "elgamal",
    title: "ElGamal: fresh DH mask·IND-CPA와 malleability 경계",
    subcategory: "classical",
    sections: [
  {
    "id": "overview",
    "title": "1. 받는 사람만 풀 수 있는 곱셈 가리개를 만듭니다"
  },
  {
    "id": "black-box",
    "title": "2. 수신자는 공개 정보, 송신자는 두 값을 제공합니다"
  },
  {
    "id": "case",
    "title": "3. 메시지 10에 가리개 12를 곱해 5를 보냅니다"
  },
  {
    "id": "picture",
    "title": "4. 17은 가리개 재현에, 5는 메시지 복원에 쓰입니다"
  },
  {
    "id": "need",
    "title": "5. 같은 메시지도 이번에 고른 비밀에 따라 바뀝니다"
  },
  {
    "id": "names",
    "title": "6. 공개키와 임시 비밀이 같은 공유값을 만듭니다"
  },
  {
    "id": "encrypt-decrypt",
    "title": "7. 5⁶을 7번 적용하는 것과 5⁷을 6번 적용하는 것은 같습니다"
  },
  {
    "id": "source",
    "title": "8. 원문의 γ·δ에 17·5를 넣어 다시 복호합니다"
  },
  {
    "id": "security",
    "title": "9. 작은 사례에서는 메시지의 한 성질이 그대로 보입니다"
  },
  {
    "id": "malleability",
    "title": "10. 둘째 값을 두 배로 바꾸면 복호 메시지도 두 배가 됩니다"
  },
  {
    "id": "release",
    "title": "11. 실제 파일은 검토된 키 생성과 인증 암호화로 연결합니다"
  }
],
    component: () => import("@/pages/articles/crypto/elgamal"),
  },
];
