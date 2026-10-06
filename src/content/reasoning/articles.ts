import type { Article } from "../types";

export const reasoningArticles: Article[] = [{
  slug: "argument-and-counterexample",
  title: "말이 그럴듯한지보다 결론이 실제로 따라오는지 봅니다",
  subcategory: "reasoning-arguments",
  sections: [
    { id: "overview", title: "결론과 근거 사이의 다리를 검사합니다" },
    { id: "black-box", title: "주장을 전제와 결론으로 나눕니다" },
    { id: "case", title: "카드 결제 가게 100곳으로 빈틈을 찾습니다" },
    { id: "picture", title: "참인 문장과 따라오는 관계를 따로 놓습니다" },
    { id: "need", title: "맞는 결론도 나쁜 추론에서 나올 수 있습니다" },
    { id: "names", title: "전제·결론·타당성·건전성에 이름을 붙입니다" },
    { id: "mechanism", title: "같은 가게 사례를 두 추론 형식에 넣습니다" },
    { id: "source", title: "아리스토텔레스 원문에서 논증과 증명을 가릅니다" },
    { id: "comparison", title: "묵가의 원인 구분으로 조건을 더 세밀하게 봅니다" },
    { id: "limits", title: "현실의 논증은 불확실한 전제와 숨은 선택을 남깁니다" },
  ],
  component: () => import("@/pages/articles/reasoning/argument-and-counterexample"),
}];
