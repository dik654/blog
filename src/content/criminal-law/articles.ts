import type { Article } from "../types";

export const criminalLawArticles: Article[] = [
  {
    slug: "crime-and-punishment-purpose",
    title: "왜 국가가 직접\u00A0벌합니까",
    subcategory: "crim-punishment",
    sections: [
      { id: "overview", title: "물건을 돌려받아도 국가의 일이 끝나지 않는 경우가 있습니다" },
      { id: "four-reasons", title: "유죄 뒤에도 형벌의 목적은 하나가 아닙니다" },
      { id: "deterrence", title: "억제 모형은 형량이 아니라 선택의 기대값을 계산합니다" },
      { id: "why-severity-fails", title: "같은 곱이라도 적발 가능성과 엄벌은 같은 정책이 아닙니다", subsections: [{ id: "marginal-deterrence", title: "H가 이미 훔치기로 했다면 무엇이 다음 행동을 막습니까" }] },
      { id: "legality", title: "H가 행동한 뒤 금지를 만들어 거꾸로 적용할 수는 없습니다" },
      { id: "boundary", title: "형벌 목적을 정해도 H가 유죄라는 결론은 아직 나오지 않습니다" },
    ],
    component: () => import("@/pages/articles/criminal-law/crime-and-punishment-purpose"),
  },
  {
    slug: "procedure-and-proof",
    title: "얼마나 확실해야\u00A0벌할 수 있습니까",
    subcategory: "crim-procedure",
    sections: [
      { id: "overview", title: "H를 의심할 이유와 H를 벌할 수 있다는 결론은 다릅니다" },
      { id: "two-errors", title: "같은 H 사건에서도 판정 오류는 두 방향으로 생깁니다" },
      { id: "threshold", title: "숫자 문턱은 법이 아니라 오류 배분을 보는 사고실험입니다" },
      { id: "burden", title: "무죄 추정, 증명 책임, 증명 기준은 서로 다른 역할입니다" },
      { id: "how-evidence", title: "증거의 힘과 증거를 쓸 수 있는지는 별도 문턱입니다" },
      { id: "boundary", title: "합리적 의심 없음은 숫자가 아니라 공개해야 할 판단 이유입니다" },
    ],
    component: () => import("@/pages/articles/criminal-law/procedure-and-proof"),
  },
];
