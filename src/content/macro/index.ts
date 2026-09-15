import type { Category } from "../types";
import { macroArticles } from "./articles";

const macro: Category = {
  slug: "macro",
  name: "전체와 부분",
  description:
    "한 사람에게 맞는 판단이 모두에게 동시에 적용되면 왜 뒤집히는지, 그래서 총량을 따로 보는 이유",
  subcategories: [
    {
      slug: "macro-aggregate",
      name: "구성의 오류",
      description: "내 지출이 남의 소득이라는 사실이 만드는 되먹임",
      icon: "🔁",
    },
  ],
  articles: macroArticles,
};

export default macro;
