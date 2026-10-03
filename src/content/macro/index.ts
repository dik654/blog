import type { Category } from "../types";
import { macroArticles } from "./articles";

const macro: Category = {
  slug: "macro",
  name: "전체와 부분",
  description:
    "한 사람에게 맞는 판단이 모두에게 동시에 적용되면 왜 뒤집히는지, 그리고 그렇게 더한 숫자를 읽을 때 무엇을 먼저 정해야 하는지",
  subcategories: [
    {
      slug: "macro-aggregate",
      name: "구성의 오류",
      description: "내 지출이 남의 소득이라는 사실이 만드는 되먹임",
      icon: "🔁",
    },
    {
      slug: "macro-numbers",
      name: "더한 숫자를 읽는 법",
      description:
        "총량을 무엇으로 나누고, 값이 변한 몫을 어떻게 걷어내고, 누구를 세고, 안에서 누가 이기는지",
      icon: "📏",
    },
  ],
  articles: macroArticles,
};

export default macro;
