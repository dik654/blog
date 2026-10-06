import type { Article } from "../types";

export const politicalPhilosophyArticles: Article[] = [{
  slug: "consent-liberty-and-legitimate-power",
  title: "다수의 결정도 동의·권리·해악의 검사를 통과해야 정당합니다",
  subcategory: "political-philosophy-legitimacy",
  sections: [
    { id: "overview", title: "규칙이 유익하다는 사실만으로 강제할 권리가 생기지는 않습니다" },
    { id: "black-box", title: "결정·적용·이의 제기·수정의 네 자리를 봅니다" },
    { id: "case", title: "100가구의 야간 영업 규칙을 표결합니다" },
    { id: "picture", title: "찬성표의 수와 영향을 받는 권리를 따로 놓습니다" },
    { id: "need", title: "결정을 내려야 하지만 패배한 사람도 구성원으로 남습니다" },
    { id: "names", title: "동의·정당성·자유·해악 원칙에 이름을 붙입니다" },
    { id: "mechanism", title: "60대 40의 결과가 정당한 규칙이 되는 경로를 추적합니다" },
    { id: "source", title: "로크의 동의와 재산 보호를 원문에 대입합니다" },
    { id: "comparison", title: "밀의 해악 원칙은 다수의 간섭 범위를 다시 좁힙니다" },
    { id: "limits", title: "실제 동의·불평등·공공재가 단순 표결을 어렵게 만듭니다" },
  ],
  component: () => import("@/pages/articles/political-philosophy/consent-liberty-and-legitimate-power"),
}];
