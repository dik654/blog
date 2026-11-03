import type { Article } from "../types";

export const disputeResolutionArticles: Article[] = [
  {
    slug: "settlement-and-access",
    title: "법은 재판하지 않은 분쟁에도 어떻게 작동합니까",
    subcategory: "disp-settlement",
    sections: [
      { id: "overview", title: "1,200만원 청구가 곧 합의금은 아닙니다" },
      { id: "settlement-range", title: "재판 대안값이 합의 범위를 만듭니다" },
      { id: "no-overlap", title: "정보 차이는 합의 범위를 없앨 수 있습니다" },
      { id: "selection", title: "재판 기록은 선택된 표본입니다" },
      { id: "shadow", title: "법 규칙은 대안값을 거쳐 협상에 들어옵니다" },
      { id: "access", title: "접근 장벽은 법적 대안을 약하게 만듭니다" },
      { id: "procedure", title: "사적 합의·법원 조정·판결은 다릅니다" },
      { id: "boundary", title: "합의율보다 대안값의 조건을 묻습니다" },
    ],
    component: () => import("@/pages/articles/dispute-resolution/settlement-and-access"),
  },
];
