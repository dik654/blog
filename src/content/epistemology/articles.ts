import type { Article } from "../types";

export const epistemologyArticles: Article[] = [{
  slug: "knowledge-belief-and-luck",
  title: "맞힌 것과 안 것을 가르는 마지막 문턱은 우연입니다",
  subcategory: "epistemology-knowledge",
  sections: [
    { id: "overview", title: "정답을 맞혔다는 사실만으로는 안다고 할 수 없습니다" },
    { id: "black-box", title: "믿음·사실·근거와 사실에 닿은 경로를 나눕니다" },
    { id: "case", title: "멈춘 시계 열 개 중 하나가 우연히 맞습니다" },
    { id: "picture", title: "정답과 판단 경로를 두 줄로 놓습니다" },
    { id: "need", title: "근거를 더해도 행운이 남을 수 있습니다" },
    { id: "names", title: "정당화된 참인 믿음과 인식적 행운에 이름을 붙입니다" },
    { id: "mechanism", title: "12시 정각의 같은 시계 사례를 끝까지 추적합니다" },
    { id: "source", title: "게티어의 짧은 반례가 세 조건을 흔듭니다" },
    { id: "comparison", title: "신뢰성·안전성·지적 성품은 다른 곳을 고칩니다" },
    { id: "limits", title: "지식의 경계는 하나의 네 번째 조건으로 닫히지 않습니다" },
  ],
  component: () => import("@/pages/articles/epistemology/knowledge-belief-and-luck"),
}];
