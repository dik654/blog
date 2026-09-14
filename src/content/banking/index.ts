import type { Category } from "../types";
import { bankingArticles } from "./articles";

const banking: Category = {
  slug: "banking",
  name: "은행과 중앙은행",
  description:
    "예금은 어떻게 생기고, 기준금리 하나가 어떤 경로로 퍼지며, 송금한 돈은 어디서 최종적으로 옮겨지는가",
  subcategories: [
    {
      slug: "banking-deposit",
      name: "예금 창조",
      description: "은행 대차대조표와 대출이 예금을 만드는 구조, 그리고 그 취약점",
      icon: "🏦",
    },
    {
      slug: "banking-policy",
      name: "통화정책",
      description: "중앙은행 대차대조표·정책금리·공개시장조작과 파급 경로",
      icon: "🎯",
    },
    {
      slug: "banking-settlement",
      name: "지급결제",
      description: "지급·청산·결제의 분리와 결제 최종성",
      icon: "🔁",
    },
  ],
  articles: bankingArticles,
};

export default banking;
