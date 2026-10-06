import type { Article } from "../types";

export const philosophyOfScienceArticles: Article[] = [{
  slug: "evidence-models-and-causal-explanation",
  title: "예측이 맞는 모형과 원인을 설명하는 모형은 같은 검사를 받지 않습니다",
  subcategory: "philosophy-of-science-explanation",
  sections: [
    { id: "overview", title: "맞힌 횟수만으로 무엇이 원인인지 정할 수 없습니다" },
    { id: "black-box", title: "관측·모형·예측·개입을 한 줄로 잇습니다" },
    { id: "case", title: "우산 판매와 사고 100일의 기록을 만듭니다" },
    { id: "picture", title: "비와 우산 판매가 함께 움직이는 이유를 드러냅니다" },
    { id: "need", title: "설명은 다음 상황에서 무엇을 바꿔야 할지 알려 줍니다" },
    { id: "names", title: "증거·모형·상관·인과 설명에 이름을 붙입니다" },
    { id: "mechanism", title: "우산 판매를 줄이는 개입과 비를 막는 개입을 비교합니다" },
    { id: "source", title: "법칙만으로 만든 설명의 비대칭 문제를 확인합니다" },
    { id: "comparison", title: "개입과 모형의 목적에 따라 좋은 설명이 달라집니다" },
    { id: "limits", title: "실험할 수 없는 대상과 여러 수준의 설명을 남겨 둡니다" },
  ],
  component: () => import("@/pages/articles/philosophy-of-science/evidence-models-and-causal-explanation"),
}];
