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
    title: "Groth16 증명 시스템",
    subcategory: "zkp-groth16-concept",
    sections: [
      { id: "overview", title: "Groth16 전체 경로" },
      { id: "qap-setup", title: "QAP와 회로별 setup" },
      { id: "prove-verify", title: "세 요소 proof와 pairing 검증" },
      { id: "boundaries", title: "보안·비용 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/groth16"),
  },

  // ── PLONK 계열 ──
  {
    slug: "plonk",
    title: "PLONK 증명 시스템",
    subcategory: "zkp-plonk-concept",
    sections: [
      { id: "overview", title: "Witness table 전체 경로" },
      { id: "arithmetization", title: "Selector gate" },
      { id: "permutation", title: "Copy와 grand product" },
      { id: "opening-security", title: "Quotient·PCS·transcript" },
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
