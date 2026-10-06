import type { Article } from "../types";

export const ethicsArticles: Article[] = [{
  slug: "consequence-duty-and-character",
  title: "같은 선택을 결과·의무·성품의 세 방향에서 봅니다",
  subcategory: "ethics-action",
  sections: [
    { id: "overview", title: "좋은 의도나 큰 이익 하나만으로 행동을 판정하지 않습니다" },
    { id: "black-box", title: "영향·원칙·행위자를 같은 결정에 겹쳐 봅니다" },
    { id: "case", title: "알레르기 표시가 빠진 도시락 100개를 회수할지 정합니다" },
    { id: "picture", title: "누가 무엇을 겪고 어떤 약속이 걸렸는지 펼칩니다" },
    { id: "need", title: "세 질문은 서로 다른 실패를 잡습니다" },
    { id: "names", title: "결과주의·의무론·덕 윤리에 이름을 붙입니다" },
    { id: "mechanism", title: "도시락 100개의 결정을 세 번 계산합니다" },
    { id: "source", title: "밀·칸트·아리스토텔레스의 원문 질문을 대조합니다" },
    { id: "comparison", title: "세 관점이 같은 답을 낼 때와 갈릴 때를 나눕니다" },
    { id: "limits", title: "숫자 밖의 분배와 제도 책임을 남겨 둡니다" },
  ],
  component: () => import("@/pages/articles/ethics/consequence-duty-and-character"),
}];
