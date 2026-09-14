import type { Category } from "../types";
import { electionsArticles } from "./articles";

const elections: Category = {
  slug: "elections",
  name: "선거와 대표",
  description:
    "표를 의석으로 바꾸는 계산, 그 계산이 답을 주지 못하는 조건, 그리고 표를 모으는 조직",
  subcategories: [
    {
      slug: "elect-systems",
      name: "선거제도",
      description: "같은 표가 제도에 따라 다른 의석이 되는 산식",
      icon: "🧮",
    },
    {
      slug: "elect-aggregation",
      name: "집계의 한계",
      description: "다수결이 순환하거나 답을 정하지 못하는 경우",
      icon: "🔄",
    },
    {
      slug: "elect-parties",
      name: "정당과 이익집단",
      description: "표와 이해를 모으는 조직이 왜 생기고 어떤 모양이 되는가",
      icon: "🤝",
    },
  ],
  articles: electionsArticles,
};

export default elections;
