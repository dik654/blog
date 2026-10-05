import type { Article } from "../types";

export const zkpSystemsArticles: Article[] = [
  // ── SNARK 개론 & Groth16 ──
  {
    slug: "snark-overview",
    title: "SNARK 개론",
    subcategory: "zkp-groth16-concept",
    sections: [{"id": "overview", "title": "1. 계산한 사람을 믿지 않고 결과를 확인하려면"}, {"id": "black-box", "title": "2. 계산에 쓴 값과 확인에 필요한 값은 다릅니다"}, {"id": "case", "title": "3. 3에 어떤 수를 곱해 12를 만들었다고 합시다"}, {"id": "picture", "title": "4. 문제는 그대로 두고 증거만 전달합니다"}, {"id": "need", "title": "5. 세 가지 실패를 따로 막아야 합니다"}, {"id": "interface", "title": "6. 관계·증인·증거를 이름으로 연결합니다"}, {"id": "security", "title": "7. 참인 명제·거짓 명제·잘못된 증인을 구별합니다"}, {"id": "source", "title": "8. 원 논문도 증인이 없는 명제를 따로 정의합니다"}, {"id": "comparison", "title": "9. 증거가 새로 주는 정보와 이미 공개된 정보를 나눕니다"}, {"id": "selection", "title": "10. 짧은 증거를 만드는 비용은 별도로 남습니다"}],
    component: () => import("@/pages/articles/blockchain/snark-overview"),
  },
  {
    slug: "constraint-systems",
    title: "R1CS와 QAP",
    subcategory: "zkp-groth16-concept",
    sections: [{"id": "overview", "title": "1. 실행한 코드와 증명한 규칙을 같게 만들어야 합니다"}, {"id": "black-box", "title": "2. 계산기는 값을 채우고 검사기는 모든 줄을 확인합니다"}, {"id": "case", "title": "3. 3×4=12를 만든 뒤 4를 더해 16을 얻습니다"}, {"id": "picture", "title": "4. 각 줄은 두 값을 골라 곱하고 세 번째와 비교합니다"}, {"id": "need", "title": "5. 변수의 이름보다 같은 자리를 읽는 것이 중요합니다"}, {"id": "names", "title": "6. 행의 등식과 다항식 조건을 구별합니다"}, {"id": "r1cs", "title": "7. 두 계수 행이 같은 값 묶음을 읽습니다"}, {"id": "qap", "title": "8. 두 점에서 0이면 두 인수로 나누어떨어집니다"}, {"id": "source", "title": "9. 원문에서 벡터 순서가 다르면 계수도 함께 옮깁니다"}, {"id": "verification", "title": "10. 다항식으로 옮겼다고 비밀이나 정수 의미가 생기지 않습니다"}],
    component: () => import("@/pages/articles/blockchain/constraint-systems"),
  },
  {
    slug: "groth16",
    title: "Groth16: 두 번의 곱셈을 증명 세 점으로 확인하기",
    subcategory: "zkp-groth16-concept",
    sections: [
  {
    "id": "overview",
    "title": "1. 3에 비밀인 4를 곱하고 그 결과를 제곱합니다"
  },
  {
    "id": "black-box",
    "title": "2. 계산 규칙을 준비하고 증명을 만든 뒤 공개값으로 확인합니다"
  },
  {
    "id": "case",
    "title": "3. 손계산에서는 101로 나눈 나머지를 씁니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 계산을 두 줄에서 증명 세 점까지 따라갑니다"
  },
  {
    "id": "why",
    "title": "5. 모든 줄을 하나의 나눗셈 관계로 묶습니다"
  },
  {
    "id": "names",
    "title": "6. 계산표·다항식·준비물에 이름을 붙입니다"
  },
  {
    "id": "rows",
    "title": "7. 한 줄의 네 칸을 두 줄의 같은 답안으로 확장합니다"
  },
  {
    "id": "qap",
    "title": "8. 두 번호를 지나는 세 직선에서 몫 72를 얻습니다"
  },
  {
    "id": "qap-proof",
    "title": "9. 서로 다른 근과 차수 조건이 모든 줄을 묶습니다"
  },
  {
    "id": "setup",
    "title": "10. 같은 두 줄의 공개 항과 비공개 항을 나눕니다"
  },
  {
    "id": "proof",
    "title": "11. 난수 13과 17을 넣으면 지수는 83·24·48이 됩니다"
  },
  {
    "id": "verify",
    "title": "12. 공개값의 결합과 증명을 같은 페어링 식에 넣습니다"
  },
  {
    "id": "derive",
    "title": "13. C의 보정 항이 필요한 이유를 전개합니다"
  },
  {
    "id": "zk",
    "title": "14. 공개 결과의 추론과 증명의 추가 정보는 다릅니다"
  },
  {
    "id": "trapdoor",
    "title": "15. 설정의 비밀을 알면 거짓 주장도 통과시킬 수 있습니다"
  },
  {
    "id": "source-circuit",
    "title": "16. 실제 Rust 호출도 같은 변수 순서와 두 줄을 만듭니다"
  },
  {
    "id": "source-qap",
    "title": "17. 실제 원문은 같은 두 줄을 여덟 평가점으로 옮깁니다"
  },
  {
    "id": "source-key",
    "title": "18. 준비 코드가 공개 계수와 비공개 계수를 다른 배열에 담습니다"
  },
  {
    "id": "source-proof",
    "title": "19. C 조립과 답안 검사는 서로 다른 경로입니다"
  },
  {
    "id": "source-verify",
    "title": "20. 검증 원문의 zip은 남는 공개 입력을 읽지 않습니다"
  },
  {
    "id": "source-bytes",
    "title": "21. 점의 유효성과 메시지를 끝까지 읽었는지는 따로 확인합니다"
  },
  {
    "id": "binding",
    "title": "22. 맞는 증명도 빠뜨린 규칙을 대신 확인하지는 않습니다"
  },
  {
    "id": "cost",
    "title": "23. 세 점의 크기와 준비·생성·검증 비용을 구분합니다"
  },
  {
    "id": "research",
    "title": "24. 원문에서 읽은 주장과 실행한 구현을 연결합니다"
  },
  {
    "id": "verification",
    "title": "25. 실제로 확인한 숫자와 남은 범위를 정리합니다"
  },
  {
    "id": "limits",
    "title": "26. 다음 검증 결과를 먼저 예측합니다"
  }
],
    component: () => import("@/pages/articles/blockchain/groth16"),
  },

  // ── PLONK 계열 ──
  {
    slug: "plonk",
    title: "PLONK: 3×4 뒤에 3을 더한 표를 짧게 증명하기",
    subcategory: "zkp-plonk-concept",
    sections: [
      { id: "overview", title: "1. 3에 비밀인 4를 곱한 뒤 3을 한 번 더 더합니다" },
      { id: "black-box", title: "2. 표를 준비하고 증명을 만든 뒤 공개값과 함께 확인합니다" },
      { id: "case", title: "3. 손계산은 97의 나머지로 하는 네 줄 표입니다" },
      { id: "picture", title: "4. 같은 표에서 산술과 복사, 나눗셈과 원문을 따라갑니다" },
      { id: "why", title: "5. 줄마다 맞는 계산만으로는 전체 계산을 확인할 수 없습니다" },
      { id: "names", title: "6. 줄의 규칙과 칸의 연결에 이름을 붙입니다" },
      { id: "arithmetization", title: "7. 계수를 바꾸어 곱셈과 덧셈을 같은 식에 담습니다" },
      { id: "labels", title: "8. 열두 칸에 서로 다른 위치 번호를 붙입니다" },
      { id: "permutation", title: "9. 위치를 섞은 두 곱의 비율을 누적합니다" },
      { id: "product-proof", title: "10. 인수의 대응과 우연히 맞는 경우를 구분합니다" },
      { id: "boundaries", title: "11. 첫 값과 마지막 줄 및 0인 분모를 함께 다룹니다" },
      { id: "quotient", title: "12. 네 줄에서 0인 오차를 X⁴−1로 나눕니다" },
      { id: "opening-security", title: "13. 무작위 점의 등식과 고정한 다항식을 연결합니다" },
      { id: "blinding", title: "14. 표의 값은 유지하면서 표 밖의 값을 숨깁니다" },
      { id: "split", title: "15. 몫을 세 조각으로 나눌 때도 결합과 숨김을 함께 봅니다" },
      { id: "source-circuit", title: "16. 실제 Go 컴파일러는 같은 계산을 여덟 줄에 배치합니다" },
      { id: "source-copy", title: "17. 원문은 숫자의 우연한 같음 대신 변수 번호로 연결합니다" },
      { id: "source-blinding", title: "18. 기본 호출과 통계적 영지식 옵션을 구분합니다" },
      { id: "transcript", title: "19. 고정한 원문은 γ부터 만든 뒤 β·α·ζ를 잇습니다" },
      { id: "source-verify", title: "20. 검증은 배열 길이부터 열기까지 차례로 확인합니다" },
      { id: "source-proof", title: "21. 증명 구조와 520바이트의 내용물을 확인합니다" },
      { id: "binding", title: "22. 잘 만든 증명도 빠뜨린 복사 조건을 보충하지는 않습니다" },
      { id: "setup-cost", title: "23. 범용 준비물의 범위와 회로별 준비물을 구분합니다" },
      { id: "research", title: "24. 원문의 버전과 후속 연구가 다루는 보장을 구분합니다" },
      { id: "verification", title: "25. 손계산과 실제 실행에서 확인한 범위를 정리합니다" },
      { id: "limits", title: "26. 다음 결과를 계산과 원문에서 먼저 예측합니다" },
    ],
    component: () => import("@/pages/articles/blockchain/plonk"),
  },
  {
    slug: "hyperplonk",
    title: "HyperPLONK",
    subcategory: "zkp-plonk-concept",
    sections: [
      { id: "overview", title: "Table→MLE→sumcheck" },
      { id: "multilinear", title: "Boolean hypercube MLE" },
      { id: "sumcheck", title: "Sumcheck rounds·soundness" },
      { id: "hyperplonk-boundary", title: "Gate·copy·PCS 경계" },
      { id: "release", title: "Linear-time release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/hyperplonk"),
  },

  // ── STARK 계열 ──
  {
    slug: "stark-theory",
    title: "STARK 증명 시스템",
    subcategory: "zkp-stark-concept",
    sections: [{"id": "overview", "title": "1. 실행의 중간 상태를 검사 가능한 표로 바꿉니다"}, {"id": "black-box", "title": "2. 상태표·규칙·표의 진위를 따로 확인합니다"}, {"id": "case", "title": "3. 1에서 6을 거쳐 10에 도착합니다"}, {"id": "picture", "title": "4. 다음 상태에서 계산 규칙을 빼면 0이어야 합니다"}, {"id": "need", "title": "5. 모든 줄을 다시 읽지 않도록 규칙을 넓혀 적습니다"}, {"id": "names", "title": "6. 실행표·대수 조건·차수 검사를 잇습니다"}, {"id": "trace-air", "title": "7. 세 상태를 잇는 다항식에서 전이 몫 10이 나옵니다"}, {"id": "lde-fri", "title": "8. 원문은 이웃 행과 지정된 끝점을 따로 적습니다"}, {"id": "source", "title": "9. 표를 열어 주면 감춘 값도 새로 드러날 수 있습니다"}, {"id": "security-cost", "title": "10. 표현이 정확해야 빠른 검증도 의미가 있습니다"}],
    component: () => import("@/pages/articles/blockchain/stark-theory"),
  },
];
