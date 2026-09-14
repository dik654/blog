import type { Category } from "../types";
import { moneyArticles } from "./articles";

const money: Category = {
  slug: "money",
  name: "돈과 시간",
  description:
    "돈이 무엇을 해결하려고 생겼는지, 그리고 시점이 다른 돈을 어떻게 같은 자리에 놓고 견주는지",
  subcategories: [
    {
      slug: "money-function",
      name: "화폐의 기능",
      description: "교환·계산·저장이라는 서로 다른 일과, 오늘의 돈이 누구의 빚인지",
      icon: "🪙",
    },
    {
      slug: "money-time",
      name: "시간의 값",
      description: "이자·할인·현재가치로 다른 시점의 현금흐름을 견주는 법",
      icon: "⏳",
    },
  ],
  articles: moneyArticles,
};

export default money;
