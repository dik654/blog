import type { Article } from "../types";

export const mindAndLanguageArticles: Article[] = [{
  slug: "behavior-meaning-and-machine-understanding",
  title: "정답을 내는 행동은 능력의 증거지만 이해의 전부를 혼자 증명하지는 못합니다",
  subcategory: "mind-and-language-ai",
  sections: [
    { id: "overview", title: "대화 성공과 뜻의 이해를 한 질문으로 묶지 않습니다" },
    { id: "black-box", title: "입력·처리·출력·내부 상태·환경을 나눕니다" },
    { id: "case", title: "중국어 문답 100개를 규칙표로 처리합니다" },
    { id: "picture", title: "밖에서 보이는 성공과 안에서 일어난 일을 분리합니다" },
    { id: "need", title: "판정할 수 있는 능력과 설명하려는 마음의 범위가 다릅니다" },
    { id: "names", title: "행동 기준·구문·의미·의도성에 이름을 붙입니다" },
    { id: "mechanism", title: "같은 90점이 사람·규칙실·학습 시스템에서 무엇을 뜻하는지 봅니다" },
    { id: "source", title: "튜링은 모호한 질문을 관찰 가능한 게임으로 바꿉니다" },
    { id: "comparison", title: "중국어 방은 기호 규칙만으로 의미가 생기는지 반문합니다" },
    { id: "limits", title: "행동·구현·학습·몸·의식을 서로 다른 주장으로 남깁니다" },
  ],
  component: () => import("@/pages/articles/mind-and-language/behavior-meaning-and-machine-understanding"),
}];
