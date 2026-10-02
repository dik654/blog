import type { Category } from "../types";
import { firmsArticles } from "./articles";

const firms: Category = {
  slug: "firms",
  name: "조직과 값을 정하는 힘",
  description:
    "값이 모든 것을 조정한다고 두었던 자리에서, 왜 생산의 대부분은 값이 아니라 지시로 조정되는지와 파는 쪽이 하나뿐일 때 값이 어디에 멈추는지",
  subcategories: [
    {
      slug: "firm-boundary",
      name: "조직의 경계",
      description: "시장을 쓰는 데 드는 값이 조직을 만들고 그 크기를 멈추는 자리",
      icon: "🏭",
    },
    {
      slug: "firm-pricing",
      name: "값을 정하는 힘",
      description: "많이 만들수록 싸지는 구조와 파는 쪽이 하나일 때의 값",
      icon: "🎚️",
    },
  ],
  articles: firmsArticles,
};

export default firms;
