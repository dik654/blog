import type { Category } from "../types";
import { governanceArticles } from "./articles";

const governance: Category = {
  slug: "governance",
  name: "집행과 국제질서",
  description:
    "정해진 결정이 그대로 집행되지 않는 이유, 그리고 위에 아무도 없는 바깥에서 질서가 생기는 방식",
  subcategories: [
    {
      slug: "gov-bureaucracy",
      name: "관료제와 집행",
      description: "결정과 집행 사이에 생기는 간격과 그것을 다루는 장치",
      icon: "📋",
    },
    {
      slug: "gov-international",
      name: "국제질서",
      description: "강제할 상위 권위가 없을 때 협력과 갈등이 정해지는 방식",
      icon: "🌍",
    },
  ],
  articles: governanceArticles,
};

export default governance;
