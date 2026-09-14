import type { Category } from "../types";
import { polityArticles } from "./articles";

const polity: Category = {
  slug: "polity",
  name: "국가와 정당성",
  description:
    "한 사회에 하나만 존재할 수 있는 결정이 왜 문제가 되고, 그 결정을 강제할 힘을 어디에 두는가",
  subcategories: [
    {
      slug: "polity-collective",
      name: "집합적 선택",
      description: "각자 고르면 되는 문제와 하나로 정해야 하는 문제의 차이",
      icon: "🗳️",
    },
    {
      slug: "polity-state",
      name: "국가와 정당성",
      description: "강제력을 한 곳에 모으는 선택과 그 힘이 받아들여지는 근거",
      icon: "🏛️",
    },
  ],
  articles: polityArticles,
};

export default polity;
