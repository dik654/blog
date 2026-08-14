import type { Article } from "../types";

export const zkpSystemsArticles: Article[] = [
  // ── SNARK 개론 & Groth16 ──
  {
    slug: "snark-overview",
    title: "SNARK 개론",
    subcategory: "zkp-groth16-concept",
    sections: [
      { id: "overview", title: "관계·입력·witness" },
      { id: "interface", title: "Setup · Prove · Verify" },
      { id: "security", title: "완전성·건전성·영지식" },
      { id: "selection", title: "시스템 선택과 비용" },
    ],
    component: () => import("@/pages/articles/blockchain/snark-overview"),
  },
  {
    slug: "constraint-systems",
    title: "R1CS와 QAP",
    subcategory: "zkp-groth16-concept",
    sections: [
      { id: "overview", title: "공개 입력과 witness" },
      { id: "r1cs", title: "R1CS 행과 gadget" },
      { id: "qap", title: "QAP divisibility" },
      { id: "verification", title: "증명 시스템으로 넘기는 경계" },
    ],
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
      { id: "overview", title: "HyperPLONK이란?" },
      { id: "multilinear", title: "다중선형 확장 (MLE)" },
      { id: "sumcheck", title: "Sumcheck 프로토콜" },
      { id: "comparison", title: "PLONK vs HyperPLONK" },
    ],
    component: () => import("@/pages/articles/blockchain/hyperplonk"),
  },

  // ── STARK 계열 ──
  {
    slug: "stark-theory",
    title: "STARK 증명 시스템",
    subcategory: "zkp-stark-concept",
    sections: [
      { id: "overview", title: "STARK이란?" },
      { id: "execution-trace", title: "실행 추적 (Execution Trace)" },
      { id: "air-constraints", title: "AIR 제약 시스템" },
      { id: "low-degree-extension", title: "저차 확장 (LDE)" },
      { id: "proof-pipeline", title: "STARK 증명 파이프라인" },
      { id: "comparison", title: "SNARK vs STARK" },
    ],
    component: () => import("@/pages/articles/blockchain/stark-theory"),
  },
];
