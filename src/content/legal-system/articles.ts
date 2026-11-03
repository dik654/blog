import type { Article } from "../types";

export const legalSystemArticles: Article[] = [
  {
    slug: "what-makes-law-law",
    title: "같은 10만 원 요구인데 왜 하나는 법일까요",
    subcategory: "ls-validity",
    sections: [
      {
        id: "overview",
        title: "같은 10만 원 요구인데 왜 하나는 고지서이고 하나는 협박일까요?",
      },
      {
        id: "command-vs-law",
        title: "1. 불이익이 있다는 사실만으로는 법과 협박을 가를 수 없습니다",
      },
      {
        id: "validity-chain",
        title: "2. 권한의 근거는 위로 이어지지만 마지막에는 문서가 아니라 관행이 있습니다",
      },
      {
        id: "form-conditions",
        title: "3. 법적 효력이 있어도 사람이 미리 행동을 맞추지 못할 수 있습니다",
      },
      {
        id: "why-form-matters",
        title: "4. 법적 효력, 법치의 작동, 도덕적 정당성은 서로 다른 판단입니다",
      },
      {
        id: "boundary",
        title: "5. 법이라는 확인이 끝나도 해석과 복종의 질문은 남습니다",
      },
      {
        id: "review",
        title: "6. 새 사례에 세 질문을 적용해 보세요",
      },
    ],
    component: () => import("@/pages/articles/legal-system/what-makes-law-law"),
  },
  {
    slug: "rules-standards-and-interpretation",
    title: "법은 언제 구체적인 답을 정할까요?",
    subcategory: "ls-interpretation",
    sections: [
      {
        id: "overview",
        title: "법은 구체적인 답을 정하는 시점을 고릅니다",
      },
      {
        id: "two-timings",
        title: "왜 같은 95킬로미터가 다른 판정을 만들까요?",
      },
      {
        id: "cost-comparison",
        title: "어느 쪽이 나은지는 무엇을 세어야 알 수 있을까요?",
      },
      {
        id: "interpretation",
        title: "숫자로 선을 그었는데도 왜 해석이 남을까요?",
      },
      {
        id: "gaps-and-analogy",
        title: "적용할 문장 자체가 없다면 어디까지 메울 수 있을까요?",
      },
      {
        id: "boundary",
        title: "결국 어느 형식을 고를지는 세 값을 함께 보는 일입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/legal-system/rules-standards-and-interpretation"),
  },
  {
    slug: "precedent-and-legal-change",
    title: "판례는 왜 따르고 언제 바꿀까요?",
    subcategory: "ls-interpretation",
    sections: [
      {
        id: "overview",
        title: "판례는 지난 답을 복사하는 장치가 아닙니다",
      },
      {
        id: "what-binds",
        title: "다음 사건으로 넘어가는 것은 무엇일까요?",
      },
      {
        id: "why-follow",
        title: "판례의 힘은 나라마다 어떻게 다를까요?",
      },
      {
        id: "distinguishing",
        title: "판례를 뒤집지 않고 비켜 갈 수 있을까요?",
      },
      {
        id: "when-to-overrule",
        title: "판례를 바꾸려면 무엇을 함께 봐야 할까요?",
        subsections: [
          {
            id: "retroactivity",
            title: "바뀐 판단은 과거 사건도 다시 열까요?",
          },
        ],
      },
      {
        id: "boundary",
        title: "다음 사건에서는 네 질문을 순서대로 확인합니다",
      },
    ],
    component: () =>
      import("@/pages/articles/legal-system/precedent-and-legal-change"),
  },
];
