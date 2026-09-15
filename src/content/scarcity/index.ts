import type { Category } from "../types";
import { scarcityArticles } from "./articles";

const scarcity: Category = {
  slug: "scarcity",
  name: "모자람과 선택",
  description:
    "자원이 모자라기 때문에 반드시 무언가를 포기해야 하는 상황에서, 무엇을 기준으로 고르고 왜 혼자 하지 않고 나눠 하는지",
  subcategories: [
    {
      slug: "scar-choice",
      name: "선택의 비용",
      description: "고른 것의 값이 아니라 고르지 않은 것의 값으로 재는 법",
      icon: "⚖️",
    },
    {
      slug: "scar-exchange",
      name: "교환의 이득",
      description: "모든 것을 더 잘하는 쪽도 남과 나눠 하는 것이 나은 이유",
      icon: "🤝",
    },
  ],
  articles: scarcityArticles,
};

export default scarcity;
