import type { Category } from "../types";
import { testimonyArticles } from "./articles";

const testimony: Category = {
  slug: "testimony",
  name: "누가 왜 적었는가",
  description:
    "사료는 지난 일이 아니라 지난 일에 대한 누군가의 기록입니다. 적은 사람이 무엇을 보았고 무엇을 할 수 없었는지가 적힌 것의 모양을 정합니다.",
  subcategories: [
    {
      slug: "who-wrote",
      name: "적은 사람의 자리",
      description: "기록자가 무엇을 보았고 무엇을 지어냈는지를 스스로 밝힌 자리",
      icon: "✍️",
    },
    {
      slug: "two-accounts",
      name: "둘이 다르게 적을 때",
      description: "같은 일을 두 기록이 다르게 적을 때 무엇을 할 수 있는지",
      icon: "⚖️",
    },
  ],
  articles: testimonyArticles,
};

export default testimony;
