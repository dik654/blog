import type { Category } from "../types";
import { marketFailureArticles } from "./articles";

const marketFailure: Category = {
  slug: "market-failure",
  name: "가격이 놓치는 것",
  description:
    "값이 장부에 적히지 않거나, 값을 받을 수 없거나, 한쪽만 아는 것이 있을 때 가격이 무엇을 잘못 말하는지",
  subcategories: [
    {
      slug: "mf-externality",
      name: "외부효과",
      description: "결정한 사람이 아니라 옆 사람이 치르는 비용",
      icon: "🏭",
    },
    {
      slug: "mf-commons",
      name: "공공재와 공유지",
      description: "막을 수 없어서 안 만들어지는 것과 막을 수 없어서 사라지는 것",
      icon: "🌊",
    },
    {
      slug: "mf-information",
      name: "정보 비대칭",
      description: "모르는 쪽이 값을 매길 때 시장에 남는 것",
      icon: "🔍",
    },
  ],
  articles: marketFailureArticles,
};

export default marketFailure;
