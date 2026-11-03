import type { Article } from "../types";

export const filecoin3Articles: Article[] = [
  /* ── 이론 ── */
  {
    slug: "erasure-coding",
    title: "이레이저 코딩 이론: RS, 2D 코딩, DAS",
    subcategory: "fundamentals",
    sections: [
      { id: "overview", title: "개요 & 이레이저 코딩 개념" },
      { id: "reed-solomon", title: "Reed-Solomon 코딩" },
      { id: "two-dimensional", title: "2D 이레이저 코딩 & DAS" },
      { id: "comparison", title: "RS vs Fountain vs LDPC" },
    ],
    component: () => import("@/pages/articles/blockchain/erasure-coding"),
  },
  {
    slug: "pos-theory",
    title: "저장 증명 이론: PoR, PoRep, PoSt",
    subcategory: "fil-theory",
    sections: [
      { id: "overview", title: "개요 & 저장 증명 분류" },
      { id: "por", title: "Proof of Retrievability" },
      { id: "porep", title: "Proof of Replication" },
      { id: "post", title: "Proof of Spacetime" },
    ],
    component: () => import("@/pages/articles/blockchain/pos-theory"),
  },
  {
    slug: "vdf",
    title: "VDF: 오래 계산하고 빠르게 검증하는 함수",
    subcategory: "fil-theory",
    sections: [
      { id: "overview", title: "VDF 전체 흐름" },
      { id: "contract", title: "순차 계산" },
      { id: "wesolowski", title: "짧은 증명" },
      { id: "source", title: "실제 구현" },
      { id: "boundary", title: "검증 결과의 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/vdf"),
  },
  {
    slug: "drand",
    title: "DRAND: 분산 랜덤 비콘",
    subcategory: "fil-theory",
    sections: [
      { id: "overview", title: "Threshold beacon 전체 지도" },
      { id: "threshold-round", title: "Threshold BLS round" },
      { id: "verification", title: "Chain·round verification" },
      { id: "release", title: "Consumer release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/drand"),
  },
];
